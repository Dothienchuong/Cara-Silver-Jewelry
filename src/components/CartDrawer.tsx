import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { formatVND } from '../utils/format';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    shippingFee,
    discountAmount,
    grandTotal,
    voucherCode,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    applyVoucher,
    removeVoucher,
    setActiveTab,
  } = useShop();

  const [inputCode, setInputCode] = useState('');
  const [voucherMsg, setVoucherMsg] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyVoucher(inputCode);
    setVoucherMsg({ text: res.message, error: !res.success });
    if (res.success) setInputCode('');
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setActiveTab('checkout');
  };

  // Free shipping progress calculation (threshold: 1.000.000₫)
  const freeShippingThreshold = 1000000;
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - cartSubtotal);
  const shipProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="w-screen max-w-md bg-[#111115] border-l border-zinc-800 text-zinc-200 flex flex-col shadow-2xl"
          id="cart-drawer-container"
        >
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-white" />
              <h2 className="text-base font-semibold text-white tracking-wide">
                Giỏ Hàng Của Bạn ({cartCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
              aria-label="Đóng giỏ hàng"
              id="close-cart-drawer-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-zinc-900/90 border-b border-zinc-800 text-xs">
            {remainingForFreeShip > 0 ? (
              <p className="text-zinc-300 mb-1.5">
                Mua thêm <strong className="text-white">{formatVND(remainingForFreeShip)}</strong> để được <span className="text-zinc-100 font-semibold">Miễn Phí Vận Chuyển</span>!
              </p>
            ) : (
              <p className="text-emerald-400 font-medium mb-1.5 flex items-center gap-1">
                <span>🎉 Đơn hàng của bạn đã đủ điều kiện Freeship toàn quốc!</span>
              </p>
            )}
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-zinc-400 to-white transition-all duration-500 rounded-full"
                style={{ width: `${shipProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-medium text-white">Giỏ hàng đang trống</h3>
                  <p className="text-xs text-zinc-400 max-w-xs">
                    Hãy khám phá những thiết kế trang sức bạc 925 tối giản và chọn cho mình món phụ kiện ưng ý.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setActiveTab('catalog');
                  }}
                  className="mt-2 px-6 py-2.5 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-zinc-200 transition"
                >
                  Khám Phá Sản Phẩm
                </button>
              </div>
            ) : (
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedSize}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-3.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition"
                    id={`cart-item-${item.product.id}`}
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-zinc-100 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                            className="text-zinc-500 hover:text-red-400 p-1 transition"
                            title="Xoá sản phẩm"
                            aria-label={`Xoá ${item.product.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Size: <span className="text-zinc-200">{item.selectedSize}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity selector */}
                        <div className="flex items-center border border-zinc-700 bg-zinc-950 rounded-md">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, item.selectedSize, -1)}
                            className="p-1 px-1.5 text-zinc-400 hover:text-white transition"
                            aria-label="Giảm"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-2 text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, item.selectedSize, 1)}
                            className="p-1 px-1.5 text-zinc-400 hover:text-white transition"
                            aria-label="Tăng"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-xs font-bold text-white tracking-tight">
                          {formatVND(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Footer with Calculations and Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-zinc-800 bg-zinc-950 space-y-4">
              {/* Voucher section */}
              <form onSubmit={handleApplyVoucher} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Mã ưu đãi (VD: CARASILVER10)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 uppercase"
                      id="cart-voucher-input"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition"
                  >
                    Áp dụng
                  </button>
                </div>
                {voucherCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-400">
                    <span>Đang áp dụng: {voucherCode}</span>
                    <button
                      type="button"
                      onClick={removeVoucher}
                      className="text-zinc-400 hover:text-zinc-200 underline text-[11px]"
                    >
                      Bỏ mã
                    </button>
                  </div>
                )}
                {voucherMsg && (
                  <p className={`text-[11px] ${voucherMsg.error ? 'text-red-400' : 'text-emerald-400'}`}>
                    {voucherMsg.text}
                  </p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs border-t border-zinc-800/80 pt-3">
                <div className="flex justify-between text-zinc-400">
                  <span>Tạm tính</span>
                  <span className="text-zinc-200 font-medium">{formatVND(cartSubtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Giảm giá khuyến mãi</span>
                    <span>-{formatVND(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-400">Miễn phí</strong> : formatVND(shippingFee)}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                  <span>Tổng thanh toán</span>
                  <span className="text-base tracking-tight text-white">{formatVND(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-white/5 transition"
                id="cart-drawer-checkout-btn"
              >
                <span>Tiến Hành Đặt Hàng</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Bảo mật thanh toán & Cam kết bạc 925 chính hãng</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
