export type ProductCategory = 'all' | 'vong-tay' | 'lac-tay';

export interface Product {
  id: string;
  name: string;
  category: 'vong-tay' | 'lac-tay';
  categoryName: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  material: string;
  sizes: string[];
  tags: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  modelCode?: string;
  sku?: string;
  coupleItem?: boolean;
  engravingOption?: boolean;
  seoKeywords?: string[];
  specifications: {
    purity: string;
    finish: string;
    weightApprox: string;
    origin: string;
    warranty: string;
  };
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export type PaymentMethod = 'cod' | 'banking' | 'momo';

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  note?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  orderStatus: 'received' | 'processing' | 'shipping' | 'delivered';
  voucherCode?: string;
}
