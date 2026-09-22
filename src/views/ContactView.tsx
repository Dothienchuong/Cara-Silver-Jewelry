import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export const ContactView: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Tư vấn chọn size vòng tay/nhẫn',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({
        name: '',
        phone: '',
        email: '',
        subject: 'Tư vấn chọn size vòng tay/nhẫn',
        message: '',
      });
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-bold">
          Hệ Thống Showroom & Dịch Vụ
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-brand text-white">
          Liên Hệ CARA Silver Jewelry
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn về sản phẩm, chọn size hoặc chính sách bảo hành.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: Showrooms & Info */}
        <div className="lg:col-span-5 space-y-6">
          {/* Flagship Hanoi */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-white text-black">
                Flagship Store Hà Nội
              </span>
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 09:00 - 21:30
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-brand">
              Showroom Phố Huế
            </h3>
            <p className="text-xs text-zinc-300 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <span>Số 88 Phố Huế, Phường Hàng Bài, Quận Hai Bà Trưng, Hà Nội</span>
            </p>
            <p className="text-xs text-zinc-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>Hotline HN: 024 3988 6828</span>
            </p>
          </div>

          {/* Boutique HCMC */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-white text-black">
                Boutique TP. Hồ Chí Minh
              </span>
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 09:00 - 21:30
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-brand">
              Showroom Nam Kỳ Khởi Nghĩa
            </h3>
            <p className="text-xs text-zinc-300 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <span>142 Nam Kỳ Khởi Nghĩa, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
            </p>
            <p className="text-xs text-zinc-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>Hotline HCM: 028 3822 6828</span>
            </p>
          </div>

          {/* Customer Care Channels */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3 text-xs text-zinc-400">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Kênh Chăm Sóc Trực Tuyến:
            </h4>
            <div className="flex items-center gap-2.5 text-zinc-300">
              <Mail className="w-4 h-4 text-zinc-400" />
              <span>Email: support@carajewelry.vn</span>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-300">
              <Phone className="w-4 h-4 text-zinc-400" />
              <span>Tổng đài CSKH: 1900 6828 (Miễn phí cước)</span>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">
            <div>
              <h2 className="text-xl font-bold font-brand text-white">Gửi Lời Nhắn Cho CARA</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Để lại thông tin, chuyên viên kim hoàn của CARA sẽ phản hồi trong vòng 30 phút.
              </p>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-800 text-center space-y-3 text-xs text-emerald-200"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">Lời Nhắn Đã Được Gửi Thành Công!</h3>
                <p>Cảm ơn bạn. Chuyên viên CSKH CARA sẽ liên hệ lại với bạn sớm nhất.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-300">Họ và tên *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-300">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0987 654 321"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Email nhận phản hồi</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Vấn đề bạn quan tâm</label>
                  <select
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-zinc-400"
                  >
                    <option value="Tư vấn chọn size vòng tay/nhẫn">Tư vấn chọn size vòng tay / lắc / nhẫn</option>
                    <option value="Tư vấn đặt mẫu trang sức bạc thiết kế riêng">Tư vấn đặt làm mẫu theo yêu cầu (Custom)</option>
                    <option value="Bảo hành & Làm sạch bạc S925">Chính sách bảo hành & làm sạch bạc S925</option>
                    <option value="Hỗ trợ đổi trả đơn hàng">Hỗ trợ đổi trả hoặc tra cứu đơn hàng</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Nội dung chi tiết *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Nhập nội dung cần hỗ trợ hoặc kích thước cổ tay/ngón tay bạn muốn tư vấn..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi Yêu Cầu Tư Vấn</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
