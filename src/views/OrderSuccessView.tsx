import React from 'react';
import { Check, Package, Clock, MapPin, Phone, ArrowRight, Copy, CheckCheck, QrCode } from 'lucide-react';
import { motion } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { formatVND, formatDate } from '../utils/format';

export const OrderSuccessView: React.FC = () => {
  const { latestOrder, setActiveTab } = useShop();
  const [copied, setCopied] = React.useState(false);

  if (!latestOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-brand text-white">Không tìm thấy thông tin đơn hàng</h2>
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="px-6 py-2.5 bg-white text-black text-xs font-semibold rounded-lg"
        >
          Trở về trang chủ
        </button>
      </div>
    );
  }

  const handleCopyOrderId = () => {
    navigator.clipboard?.writeText(latestOrder.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Celebratory Banner */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-white/80 mx-auto flex items-center justify-center text-white shadow-2xl shadow-white/10"
        >
          <Check className="w-10 h-10" />
        </motion.div>

        <div className="space-y-1">
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-bold">
            Đặt Hàng Thành Công
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-brand text-white">
            Cảm Ơn Bạn Đã Chọn CARA
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Đơn hàng của bạn đã được tiếp nhận vào hệ thống chế tác kim hoàn CARA. Chúng tôi sẽ sớm liên hệ xác nhận và giao hàng.
          </p>
        </div>

        {/* Order ID Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs">
          <span className="text-zinc-400">Mã Đơn Hàng:</span>
          <strong className="text-white font-mono text-sm tracking-wider">#{latestOrder.id}</strong>
          <button
            type="button"
            onClick={handleCopyOrderId}
            className="p-1 text-zinc-400 hover:text-white transition"
            title="Sao chép mã đơn"
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Order Progress Status Tracker */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300">
          Trạng Thái Xử Lý Đơn Hàng
        </h3>

        <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center text-xs shadow-md shadow-white/20">
              1
            </div>
            <span className="font-semibold text-white">Đã Tiếp Nhận</span>
            <span className="text-[10px] text-zinc-500 hidden sm:inline">Hệ thống ghi nhận</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 font-bold flex items-center justify-center text-xs">
              2
            </div>
            <span className="text-zinc-400">Chuẩn Bị Bạc</span>
            <span className="text-[10px] text-zinc-600 hidden sm:inline">Đóng gói hộp nhung</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 font-bold flex items-center justify-center text-xs">
              3
            </div>
            <span className="text-zinc-400">Đang Giao</span>
            <span className="text-[10px] text-zinc-600 hidden sm:inline">Vận chuyển hỏa tốc</span>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 font-bold flex items-center justify-center text-xs">
              4
            </div>
            <span className="text-zinc-400">Hoàn Tất</span>
            <span className="text-[10px] text-zinc-600 hidden sm:inline">Nhận & Kiểm tra</span>
          </div>
        </div>
      </div>

      {/* Special QR code payment box if Bank Transfer selected */}
      {latestOrder.paymentMethod === 'banking' && (
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-700 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-40 h-40 bg-white p-2 rounded-xl shrink-0 flex items-center justify-center shadow-lg">
            {/* Visual VietQR representation */}
            <div className="w-full h-full border-2 border-black p-2 flex flex-col items-center justify-between text-center">
              <div className="text-[9px] font-bold tracking-widest uppercase">VIETQR • MB BANK</div>
              <QrCode className="w-20 h-20 text-black" />
              <div className="text-[8px] font-mono font-semibold">CARA - {latestOrder.id}</div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-zinc-300">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Quét Mã QR Chuyển Khoản Ngân Hàng
            </h4>
            <p className="text-zinc-400">
              Vui lòng chuyển khoản chính xác số tiền để đơn hàng được xuất kho tự động:
            </p>
            <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-[11px]">
              <div>Ngân hàng: <strong className="text-white">MB Bank</strong></div>
              <div>Số TK: <strong className="text-white">8888 6828 9999</strong></div>
              <div>Số tiền: <strong className="text-emerald-400">{formatVND(latestOrder.total)}</strong></div>
              <div>Nội dung: <strong className="text-white">{latestOrder.id}</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details & Summary Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer & Shipping Info */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3.5 text-xs">
          <h3 className="text-sm font-bold font-brand text-white border-b border-zinc-800 pb-2">
            Thông Tin Giao Hàng
          </h3>
          <div className="space-y-2 text-zinc-300">
            <div className="flex items-center gap-2">
              <strong className="text-white">{latestOrder.customer.fullName}</strong>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-zinc-400" />
              <span>{latestOrder.customer.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <span>
                {latestOrder.customer.address}, {latestOrder.customer.district ? `${latestOrder.customer.district}, ` : ''}
                {latestOrder.customer.city}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>Thời gian đặt: {formatDate(latestOrder.createdAt)}</span>
            </div>
            <div className="pt-2 border-t border-zinc-800 flex justify-between">
              <span className="text-zinc-400">Phương thức:</span>
              <span className="text-white font-semibold uppercase">
                {latestOrder.paymentMethod === 'cod'
                  ? 'COD - Tiền mặt khi nhận'
                  : latestOrder.paymentMethod === 'banking'
                  ? 'Chuyển khoản VietQR'
                  : 'Ví điện tử MoMo'}
              </span>
            </div>
          </div>
        </div>

        {/* Items list */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3.5 text-xs">
          <h3 className="text-sm font-bold font-brand text-white border-b border-zinc-800 pb-2">
            Sản Phẩm Đã Mua ({latestOrder.items.length})
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {latestOrder.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 border-b border-zinc-800/40 pb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                  />
                  <div className="truncate">
                    <span className="text-zinc-200 font-medium truncate block">{item.product.name}</span>
                    <span className="text-zinc-500 text-[10px]">
                      Size: {item.selectedSize} × {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="text-white font-bold shrink-0">
                  {formatVND(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Tạm tính:</span>
              <span>{formatVND(latestOrder.subtotal)}</span>
            </div>
            {latestOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Giảm giá:</span>
                <span>-{formatVND(latestOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-400">
              <span>Phí vận chuyển:</span>
              <span>{latestOrder.shippingFee === 0 ? 'Miễn phí' : formatVND(latestOrder.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
              <span>Tổng thanh toán:</span>
              <span className="text-base">{formatVND(latestOrder.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className="w-full sm:w-auto px-8 py-3.5 bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl transition flex items-center justify-center gap-2"
        >
          <span>Tiếp Tục Mua Sắm</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('order-history')}
          className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          <span>Xem Lịch Sử Đơn Hàng</span>
        </button>
      </div>
    </div>
  );
};
