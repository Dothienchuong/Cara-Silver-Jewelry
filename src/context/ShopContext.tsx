import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, CustomerInfo, PaymentMethod } from '../types';
import { INITIAL_PRODUCTS, VOUCHER_CODES } from '../data/products';
import { generateOrderId } from '../utils/format';
import { getAccessToken } from '../services/googleAuthService';
import { getSavedSheetConfig, appendOrderToSheet } from '../services/googleSheetsService';

export type ActiveTab =
  | 'home'
  | 'catalog'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'order-history'
  | 'order-management'
  | 'about'
  | 'contact';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  voucherCode: string;
  discountAmount: number;
  grandTotal: number;
  isCartDrawerOpen: boolean;
  activeTab: ActiveTab;
  selectedProductId: string | null;
  selectedProduct: Product | null;
  latestOrder: Order | null;
  orders: Order[];
  toastMessage: { title: string; subtitle?: string; image?: string } | null;
  catalogCategoryFilter: string;

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setCatalogCategoryFilter: (category: string) => void;
  openProductDetail: (productId: string) => void;
  closeProductDetail: () => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, selectedSize: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, selectedSize: string, delta: number) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  clearCart: () => void;
  applyVoucher: (code: string) => { success: boolean; message: string };
  removeVoucher: () => void;
  createOrder: (customer: CustomerInfo, paymentMethod: PaymentMethod) => Order;
  viewOrderDetails: (order: Order) => void;
  dismissToast: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cara_silver_cart_v1';
const ORDERS_STORAGE_KEY = 'cara_silver_orders_v1';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders state persisted to localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTabState] = useState<ActiveTab>('home');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle?: string; image?: string } | null>(null);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }, [cart]);

  // Save orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders', e);
    }
  }, [orders]);

  // Auto dismiss toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
  };

  const closeProductDetail = () => {
    setSelectedProductId(null);
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId) || null;

  // Cart calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  // Free shipping threshold: 350.000₫ (Đơn hàng từ 350k được miễn phí vận chuyển toàn quốc)
  const shippingFee = cartSubtotal >= 350000 || cartSubtotal === 0 ? 0 : 25000;

  // Discount calculation
  let discountAmount = 0;
  if (voucherCode && VOUCHER_CODES[voucherCode.toUpperCase()]) {
    const val = VOUCHER_CODES[voucherCode.toUpperCase()];
    if (val < 1) {
      discountAmount = Math.round(cartSubtotal * val);
    } else {
      discountAmount = Math.min(val, cartSubtotal);
    }
  }

  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  // Add to cart with micro-notification
  const addToCart = (product: Product, selectedSize: string, quantity = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
        };
        return updated;
      } else {
        return [...prev, { product, selectedSize, quantity }];
      }
    });

    setToastMessage({
      title: 'Đã thêm vào giỏ hàng',
      subtitle: `${product.name} (Size: ${selectedSize})`,
      image: product.images[0],
    });
  };

  const updateCartQuantity = (productId: string, selectedSize: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId && item.selectedSize === selectedSize) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string, selectedSize: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedSize === selectedSize))
    );
  };

  const clearCart = () => {
    setCart([]);
    setVoucherCode('');
  };

  const applyVoucher = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (VOUCHER_CODES[clean]) {
      setVoucherCode(clean);
      return { success: true, message: `Áp dụng mã ${clean} thành công!` };
    }
    return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' };
  };

  const removeVoucher = () => {
    setVoucherCode('');
  };

  // Create Order
  const createOrder = (customer: CustomerInfo, paymentMethod: PaymentMethod): Order => {
    const newOrder: Order = {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      customer,
      items: [...cart],
      subtotal: cartSubtotal,
      shippingFee,
      discount: discountAmount,
      total: grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'received',
      voucherCode: voucherCode || undefined,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);
    clearCart();
    setActiveTab('order-success');

    // Asynchronously push to Google Sheets if connected
    (async () => {
      try {
        const token = await getAccessToken();
        const config = getSavedSheetConfig();
        if (token && config?.spreadsheetId && config.autoSync !== false) {
          await appendOrderToSheet(token, config.spreadsheetId, newOrder);
        }
      } catch (err) {
        console.warn('Background sync to Google Sheets failed:', err);
      }
    })();

    return newOrder;
  };

  const viewOrderDetails = (order: Order) => {
    setLatestOrder(order);
    setActiveTab('order-success');
  };

  const dismissToast = () => {
    setToastMessage(null);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        cartCount,
        cartSubtotal,
        shippingFee,
        voucherCode,
        discountAmount,
        grandTotal,
        isCartDrawerOpen,
        activeTab,
        selectedProductId,
        selectedProduct,
        latestOrder,
        orders,
        toastMessage,
        catalogCategoryFilter,
        setActiveTab,
        setCatalogCategoryFilter,
        openProductDetail,
        closeProductDetail,
        setIsCartDrawerOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyVoucher,
        removeVoucher,
        createOrder,
        viewOrderDetails,
        dismissToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
