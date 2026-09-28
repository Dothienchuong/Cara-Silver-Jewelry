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
          Địa Chỉ & Liên Hệ Trực Tiếp
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-brand text-white">
          Liên Hệ CARA Silver Jewelry
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          CARA Silver Jewelry hiện có địa chỉ và trung tâm trải nghiệm duy nhất tại TP. Hồ Chí Minh. Chúng tôi luôn sẵn sàng đón tiếp và tư vấn tận tâm cho quý khách.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: Showroom HCM & Direct Contact */}
        <div className="lg:col-span-5 space-y-6">
          {/* Boutique HCMC Card */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-white text-black">
                Showroom Duy Nhất Tại TP.HCM
              </span>
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" /> 09:00 - 21:30 (Tất cả các ngày)
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-brand">
                Showroom CARA TP. Hồ Chí Minh
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Không gian trưng bày, thử trực tiếp trang sức bạc Ý S925 và hỗ trợ đo ni tay chính xác.
              </p>
            </div>

            <div className="space-y-3.5 pt-2 border-t border-zinc-800/80">
              <div className="text-xs text-zinc-300 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-800/80 text-white shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <strong className="text-white block font-medium">Địa chỉ:</strong>
                  <span className="text-zinc-300">140 Lê Trọng Tấn, Phường Tây Thạnh, TP Hồ Chí Minh</span>
                </div>
              </div>

              <div className="text-xs text-zinc-300 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-800/80 text-white shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <strong className="text-white block font-medium">Hotline HCM (Hỗ trợ 24/7):</strong>
                  <a
                    href="tel:0775610065"
                    className="font-mono text-base font-bold text-white hover:text-amber-300 transition block mt-0.5"
                  >
                    0775610065
                  </a>
                  <span className="text-[11px] text-zinc-400 block">Zalo & Tư vấn đo size trực tiếp</span>
                </div>
              </div>

              <div className="text-xs text-zinc-300 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-800/80 text-white shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <strong className="text-white block font-medium">Email chính thức:</strong>
                  <span className="text-zinc-300">support@carajewelry.vn</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-zinc-800 flex gap-2.5">
              <a
                href="tel:0775610065"
                className="flex-1 py-2.5 px-3 rounded-xl bg-white text-black text-center text-xs font-bold hover:bg-zinc-200 transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" /> Gọi 0775610065
              </a>
              <a
                href="https://maps.google.com/?q=140+Lê+Trọng+Tấn,+Phường+Tây+Thạnh,+TP+Hồ+Chí+Minh"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-800 text-white text-center text-xs font-semibold hover:bg-zinc-700 transition flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" /> Xem Bản Đồ
              </a>
            </div>
          </div>

          {/* Customer Care Box */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3 text-xs text-zinc-400">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-zinc-300" />
              Dịch Vụ Tại Showroom TP. Hồ Chí Minh
            </h4>
            <ul className="space-y-2 text-zinc-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Thử mẫu trực tiếp, đo size cổ tay & ngón tay miễn phí</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Vệ sinh, đánh bóng bằng máy rung siêu âm lấy ngay</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Hỗ trợ khắc tên laser lấy ngay trong 15 phút</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Chỗ đỗ xe ô tô & xe máy an toàn, thuận tiện</span>
              </li>
            </ul>
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
