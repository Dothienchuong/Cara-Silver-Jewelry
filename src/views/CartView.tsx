import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { formatVND } from '../utils/format';

export const CartView: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    shippingFee,
    discountAmount,
    grandTotal,
    voucherCode,
    updateCartQuantity,
    removeFromCart,
    applyVoucher,
    removeVoucher,
    clearCart,
    setActiveTab,
  } = useShop();

  const [inputCode, setInputCode] = useState('');
  const [voucherMsg, setVoucherMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyVoucher(inputCode);
    setVoucherMsg({ text: res.message, error: !res.success });
    if (res.success) setInputCode('');
  };

  const freeShippingThreshold = 1000000;
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - cartSubtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-brand text-white">Giỏ Hàng Của Bạn Đang Trống</h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Chưa có sản phẩm nào được chọn. Hãy khám phá bộ sưu tập trang sức bạc S925 tối giản và thêm sản phẩm yêu thích.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className="px-8 py-3.5 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition shadow-lg shadow-white/5 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Khám Phá Sản Phẩm Ngay</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-brand text-white">Giỏ Hàng Của Bạn</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Bạn có <strong className="text-white">{cartCount}</strong> sản phẩm trong giỏ hàng
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-zinc-500 hover:text-red-400 transition underline underline-offset-4"
        >
          Xoá toàn bộ giỏ
        </button>
      </div>

      {/* Main Grid: Cart Items vs Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Item Table */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={`${item.product.id}-${item.selectedSize}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition"
              >
                {/* Thumbnail */}
                <div className="w-full sm:w-28 aspect-square rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                        {item.product.categoryName}
                      </span>
                      <h3 className="text-sm font-semibold text-white mt-0.5">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        Kích cỡ đã chọn: <strong className="text-zinc-200">{item.selectedSize}</strong>
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        Chất liệu: Bạc Ý S925 phủ Rhodium
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 transition rounded-lg hover:bg-zinc-800"
                      title="Xoá món đồ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Pricing and Quantity */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                    <div className="flex items-center border border-zinc-700 bg-zinc-950 rounded-lg">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.selectedSize, -1)}
                        className="p-1.5 px-2 text-zinc-400 hover:text-white transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold px-3 text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.selectedSize, 1)}
                        className="p-1.5 px-2 text-zinc-400 hover:text-white transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-white">
                        {formatVND(item.product.price * item.quantity)}
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-[11px] text-zinc-500">
                          {formatVND(item.product.price)} / món
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 pt-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tiếp tục chọn thêm trang sức khác</span>
          </button>
        </div>

        {/* Right 1 Col: Summary Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">
            <h2 className="text-base font-bold text-white font-brand border-b border-zinc-800 pb-3">
              Tổng Quan Đơn Hàng
            </h2>

            {/* Voucher input form */}
            <form onSubmit={handleApplyVoucher} className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                Mã Khuyến Mãi / Voucher:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="CARASILVER10"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition"
                >
                  Áp dụng
                </button>
              </div>
              {voucherCode && (
                <div className="flex items-center justify-between text-xs text-emerald-400 pt-1">
                  <span>Đã áp dụng: <strong>{voucherCode}</strong></span>
                  <button
                    type="button"
                    onClick={removeVoucher}
                    className="text-zinc-400 hover:text-zinc-200 underline text-[11px]"
                  >
                    Hủy
                  </button>
                </div>
              )}
              {voucherMsg && (
                <p className={`text-[11px] ${voucherMsg.error ? 'text-red-400' : 'text-emerald-400'}`}>
                  {voucherMsg.text}
                </p>
              )}
            </form>

            {/* Free Shipping Alert */}
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
              {remainingForFreeShip > 0 ? (
                <p className="text-zinc-300">
                  Thêm <strong>{formatVND(remainingForFreeShip)}</strong> để được <strong>Freeship</strong>.
                </p>
              ) : (
                <p className="text-emerald-400 font-medium">
                  🎉 Đơn hàng đủ điều kiện miễn phí giao hàng!
                </p>
              )}
            </div>

            {/* Cost Details */}
            <div className="space-y-2.5 text-xs border-t border-zinc-800 pt-4">
              <div className="flex justify-between text-zinc-400">
                <span>Tạm tính</span>
                <span className="text-white font-medium">{formatVND(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Ưu đãi khuyến mãi</span>
                  <span>-{formatVND(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-400">
                <span>Phí vận chuyển</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-400">Miễn phí</strong> : formatVND(shippingFee)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-zinc-800">
                <span>Tổng cộng</span>
                <span className="text-lg text-white">{formatVND(grandTotal)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              type="button"
              onClick={() => setActiveTab('checkout')}
              className="w-full py-4 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-white/5 transition"
              id="cart-view-checkout-btn"
            >
              <span>Tiến Hành Thanh Toán</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
              <ShieldCheck className="w-4 h-4" />
              <span>Được bảo vệ bởi chính sách bảo hành CARA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
