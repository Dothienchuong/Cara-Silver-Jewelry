import React, { useState } from 'react';
import { ShieldCheck, Truck, CreditCard, Banknote, QrCode, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { CustomerInfo, PaymentMethod } from '../types';
import { formatVND } from '../utils/format';
import { PaymentQRCard } from '../components/PaymentQRCard';

export const CheckoutView: React.FC = () => {
  const { cart, cartSubtotal, shippingFee, discountAmount, grandTotal, createOrder, setActiveTab } = useShop();

  const [formData, setFormData] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'TP. Hồ Chí Minh',
    district: '',
    note: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-brand text-white">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-zinc-400">Vui lòng chọn sản phẩm trước khi tiến hành thanh toán.</p>
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className="px-6 py-2.5 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded-lg"
        >
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên nhận hàng.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 9) {
      setErrorMessage('Vui lòng nhập số điện thoại hợp lệ để shipper liên hệ.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ giao nhận cụ thể (số nhà, tên đường).');
      return;
    }

    setIsSubmitting(true);

    // Simulate order placement
    setTimeout(() => {
      createOrder(formData, paymentMethod);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 border-b border-zinc-800 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('cart')}
          className="hover:text-white flex items-center gap-1 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại giỏ hàng</span>
        </button>
        <span>/</span>
        <span className="text-white font-medium">Thanh toán & Đặt hàng</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Form Details & Payment Methods */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Customer Information */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h2 className="text-base font-bold font-brand text-white">
                  1. Thông Tin Nhận Hàng
                </h2>
                <span className="text-[11px] text-zinc-500">* Bắt buộc</span>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Họ và tên người nhận *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                    id="checkout-fullname-input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="0987 654 321"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                    id="checkout-phone-input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Địa chỉ Email (nhận mã vận đơn)
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                  id="checkout-email-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Tỉnh / Thành phố *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-400"
                    id="checkout-city-select"
                  >
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Tỉnh thành khác">Tỉnh thành khác</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Quận / Huyện
                  </label>
                  <input
                    type="text"
                    name="district"
                    placeholder="Quận Tân Phú, v.v."
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà) *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="140 Lê Trọng Tấn, Phường Tây Thạnh"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                  id="checkout-address-input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Ghi chú cho xưởng kim hoàn hoặc shipper (tùy chọn)
                </label>
                <textarea
                  name="note"
                  rows={2}
                  placeholder="Ví dụ: Giao giờ hành chính, đóng gói hộp quà tặng kèm thiệp chúc mừng..."
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <div className="border-b border-zinc-800 pb-3">
                <h2 className="text-base font-bold font-brand text-white">
                  2. Phương Thức Thanh Toán
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Lựa chọn hình thức thanh toán an toàn và thuận tiện nhất cho bạn
                </p>
              </div>

              <div className="space-y-3">
                {/* Method 1: COD */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-white bg-zinc-800/80 shadow-md shadow-white/5'
                      : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Kiểm tra trang sức đúng mẫu, đúng size trước khi thanh toán tiền mặt cho shipper.
                    </p>
                  </div>
                </label>

                {/* Method 2: Bank Transfer (VietQR) */}
                <label
                  onClick={() => setPaymentMethod('banking')}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'banking'
                      ? 'border-white bg-zinc-800/80 shadow-md shadow-white/5'
                      : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="banking"
                    checked={paymentMethod === 'banking'}
                    onChange={() => setPaymentMethod('banking')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Chuyển Khoản Ngân Hàng (Quét mã VietQR tự động)
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Chuyển khoản nhanh 24/7 qua VietQR hoặc STK ngân hàng MB Bank / Techcombank.
                    </p>

                    {paymentMethod === 'banking' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-3 border-t border-zinc-800 space-y-3"
                      >
                        <PaymentQRCard
                          amount={grandTotal}
                          orderId={`CARA-${formData.phone ? formData.phone.slice(-4) : 'DH'}`}
                          defaultMethod="banking"
                          title="Mã VietQR MB Bank — Quét Thanh Toán Nhanh"
                          subtitle="Quét mã bằng app MB Bank hoặc bất kỳ ngân hàng nào để tự động điền số tiền"
                        />
                      </motion.div>
                    )}
                  </div>
                </label>

                {/* Method 3: E-Wallet */}
                <label
                  onClick={() => setPaymentMethod('momo')}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'momo'
                      ? 'border-white bg-zinc-800/80 shadow-md shadow-white/5'
                      : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={() => setPaymentMethod('momo')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-pink-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Ví Điện Tử (ZaloPay / MoMo / QR Đa Năng)
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Nhận tiền từ mọi ứng dụng: ZaloPay, MoMo, MB Bank, Vietcombank, Techcombank và 50+ app.
                    </p>

                    {paymentMethod === 'momo' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-3 border-t border-zinc-800 space-y-3"
                      >
                        <PaymentQRCard
                          amount={grandTotal}
                          orderId={`CARA-${formData.phone ? formData.phone.slice(-4) : 'DH'}`}
                          defaultMethod="momo"
                          title="Mã QR Đa Năng — ZaloPay & 50+ Ngân Hàng"
                          subtitle="Mở ZaloPay, MoMo hoặc app ngân hàng để quét mã nhận tiền tức thì"
                        />
                      </motion.div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-white/10 transition flex items-center justify-center gap-2"
              id="confirm-order-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Đang Xử Lý Đơn Hàng...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Nhận Đặt Hàng ({formatVND(grandTotal)})</span>
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Right 5 Cols: Order Summary Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5 sticky top-24">
            <h2 className="text-base font-bold font-brand text-white border-b border-zinc-800 pb-3">
              Đơn Hàng Của Bạn ({cart.length} món)
            </h2>

            {/* List of ordered items */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="flex gap-3 py-2 border-b border-zinc-800/50 last:border-0"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-lg object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      Size: <span className="text-zinc-200">{item.selectedSize}</span> • SL: {item.quantity}
                    </p>
                    <p className="text-xs font-bold text-white mt-1">
                      {formatVND(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs border-t border-zinc-800 pt-4">
              <div className="flex justify-between text-zinc-400">
                <span>Tạm tính</span>
                <span className="text-white font-medium">{formatVND(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Giảm giá khuyến mãi</span>
                  <span>-{formatVND(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-400">
                <span>Phí vận chuyển</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-400">Miễn phí toàn quốc</strong> : formatVND(shippingFee)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-zinc-800">
                <span>Tổng thanh toán</span>
                <span className="text-lg text-white">{formatVND(grandTotal)}</span>
              </div>
            </div>

            {/* Brand Commitments */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2.5 text-[11px] text-zinc-400">
              <div className="flex items-center gap-2 text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-zinc-400" />
                <span>Bảo chứng bạc S925 chuẩn Ý có thẻ bảo hành đi kèm</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Truck className="w-4 h-4 text-zinc-400" />
                <span>Giao hàng hỏa tốc trong 24-48 giờ toàn quốc</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
