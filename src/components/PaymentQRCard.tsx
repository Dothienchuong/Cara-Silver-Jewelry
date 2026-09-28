import React, { useState } from 'react';
import { Copy, Check, Download, QrCode, ShieldCheck, Smartphone, ExternalLink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatVND } from '../utils/format';
import localVietQrImage from '../assets/images/vietqr_mb_bank.png';
import localQrOnlyImage from '../assets/images/vietqr_qr_only.png';

interface PaymentQRCardProps {
  amount: number;
  orderId?: string;
  customerName?: string;
  defaultMethod?: 'banking' | 'momo';
  title?: string;
  subtitle?: string;
  isOrderConfirmed?: boolean;
}

export const PaymentQRCard: React.FC<PaymentQRCardProps> = ({
  amount,
  orderId = 'CARA-ORDER',
  defaultMethod = 'banking',
  title = 'Quét Mã QR Để Thanh Toán',
  subtitle,
  isOrderConfirmed = false,
}) => {
  const [activeTab, setActiveTab] = useState<'vietqr' | 'multibank'>(
    defaultMethod === 'momo' ? 'multibank' : 'vietqr'
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  // Dynamic VietQR API URL prefilled with amount & memo
  const dynamicVietQrUrl = `https://img.vietqr.io/image/MB-0354123512-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    orderId
  )}&accountName=DO%20THIEN%20CHUONG`;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = !imgError ? dynamicVietQrUrl : localVietQrImage;
    link.download = `VietQR-CARA-${orderId}.png`;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.click();
  };

  return (
    <div className="bg-[#121217] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 p-4 sm:p-5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <QrCode className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">{title}</h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            {subtitle || (isOrderConfirmed ? 'Đơn hàng đã được tạo. Vui lòng quét mã QR để hoàn tất thanh toán.' : 'Mở ứng dụng ngân hàng hoặc ví điện tử để quét mã tự động.')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-zinc-950 rounded-xl border border-zinc-800/80 shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('vietqr')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeTab === 'vietqr'
                ? 'bg-white text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>VietQR MB Bank</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('multibank')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeTab === 'multibank'
                ? 'bg-white text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>QR Đa Năng / Ví ĐT</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: QR Code Display Card */}
        <div className="md:col-span-6 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {activeTab === 'vietqr' ? (
              <motion.div
                key="tab-vietqr"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="w-full max-w-[320px] bg-white rounded-2xl p-3 sm:p-4 text-black shadow-2xl border border-zinc-200 flex flex-col items-center"
              >
                {/* Visual Header matching IMG_7019 */}
                <div className="w-full flex items-center justify-between pb-2 border-b border-zinc-200">
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-full bg-[#1b365d] text-white flex items-center justify-center font-bold text-[10px]">
                      MB
                    </span>
                    <div>
                      <div className="text-[11px] font-bold text-[#1b365d] leading-none uppercase">
                        DO THIEN CHUONG
                      </div>
                      <div className="text-[10px] font-mono text-zinc-600 tracking-wider">
                        0354123512
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold text-red-600 tracking-wider">
                      Viet<span className="text-blue-600">QR</span>
                    </span>
                  </div>
                </div>

                {/* QR Image */}
                <div className="relative my-3 w-full aspect-square bg-zinc-50 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-100">
                  <img
                    src={imgError ? localVietQrImage : dynamicVietQrUrl}
                    alt={`Mã VietQR thanh toán ${orderId}`}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Amount & Memo Footer */}
                <div className="w-full pt-2 border-t border-zinc-200 text-center space-y-0.5">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                    Số tiền thanh toán:
                  </div>
                  <div className="text-base font-extrabold text-[#1b365d] font-mono">
                    {formatVND(amount)}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    Nội dung: <strong className="text-black">{orderId}</strong>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="tab-multibank"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="w-full max-w-[320px] bg-gradient-to-b from-blue-50 to-white rounded-2xl p-4 text-black shadow-2xl border-2 border-blue-400 flex flex-col items-center"
              >
                {/* Frame matching IMG_8606 */}
                <div className="text-center pb-2">
                  <span className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wider">
                    QR Nhận Tiền Từ Mọi Ứng Dụng
                  </span>
                  <p className="text-[10px] text-zinc-500">ZaloPay • MoMo • 50+ Ngân Hàng</p>
                </div>

                {/* Central QR with Blue outer Border */}
                <div className="relative my-2 p-2 bg-white rounded-2xl border-4 border-blue-600 shadow-md">
                  <img
                    src={localQrOnlyImage}
                    alt="Mã QR đa năng ZaloPay & Ngân hàng"
                    className="w-48 h-48 object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-9 h-9 rounded-full bg-white shadow-lg border-2 border-blue-600 flex items-center justify-center overflow-hidden text-[9px] font-bold text-blue-900">
                      MB
                    </div>
                  </div>
                </div>

                {/* Name & Bank Badges */}
                <div className="w-full text-center space-y-1.5 pt-1">
                  <div className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                    DO THIEN CHUONG
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[9px] text-zinc-600 font-medium">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">ZaloPay</span>
                    <span className="px-1.5 py-0.5 rounded bg-pink-100 text-pink-800 font-bold">MoMo</span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800 font-bold">MB Bank</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">50+ Bank</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Download & Fullscreen button */}
          <div className="mt-3 flex gap-2 w-full max-w-[320px]">
            <button
              type="button"
              onClick={handleDownloadQr}
              className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Tải Mã QR Về Máy</span>
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Transfer Information & 1-Click Copy */}
        <div className="md:col-span-6 space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Thông Tin Chuyển Khoản Trực Tiếp
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Bạn có thể quét mã QR bên cạnh để được tự động điền thông tin, hoặc sao chép nhanh số tài khoản dưới đây:
            </p>
          </div>

          {/* Info Details List */}
          <div className="space-y-2.5 text-xs bg-zinc-950/70 p-4 rounded-xl border border-zinc-800">
            {/* Bank Name */}
            <div className="flex items-center justify-between py-1 border-b border-zinc-800/80">
              <span className="text-zinc-400">Ngân hàng thụ hưởng:</span>
              <div className="flex items-center gap-2">
                <strong className="text-white font-semibold">MB Bank (Quân Đội)</strong>
              </div>
            </div>

            {/* Account Number */}
            <div className="flex items-center justify-between py-1 border-b border-zinc-800/80">
              <span className="text-zinc-400">Số tài khoản:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-amber-300 tracking-wider">
                  0354123512
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('0354123512', 'accountNumber')}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                  title="Sao chép số tài khoản"
                >
                  {copiedField === 'accountNumber' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Account Owner */}
            <div className="flex items-center justify-between py-1 border-b border-zinc-800/80">
              <span className="text-zinc-400">Chủ tài khoản:</span>
              <div className="flex items-center gap-2">
                <strong className="text-white font-mono uppercase font-semibold">
                  DO THIEN CHUONG
                </strong>
                <button
                  type="button"
                  onClick={() => copyToClipboard('DO THIEN CHUONG', 'accountName')}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                  title="Sao chép tên chủ tài khoản"
                >
                  {copiedField === 'accountName' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex items-center justify-between py-1 border-b border-zinc-800/80">
              <span className="text-zinc-400">Số tiền:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {formatVND(amount)}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(amount.toString(), 'amount')}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                  title="Sao chép số tiền"
                >
                  {copiedField === 'amount' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Transfer Memo */}
            <div className="flex items-center justify-between py-1">
              <span className="text-zinc-400">Nội dung chuyển khoản:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {orderId}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(orderId, 'orderId')}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                  title="Sao chép nội dung chuyển khoản"
                >
                  {copiedField === 'orderId' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 space-y-1 text-[11px] text-zinc-400">
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Hệ thống ghi nhận giao dịch tức thì (24/7)</span>
            </div>
            <p className="leading-relaxed pl-5">
              Sau khi chuyển khoản, đơn hàng của bạn sẽ được kích hoạt xuất kho đóng gói hộp quà và mã vận đơn hỏa tốc gửi qua SMS/Zalo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
