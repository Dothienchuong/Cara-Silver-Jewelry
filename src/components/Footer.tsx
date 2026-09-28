import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Shield, Sparkles, Send } from 'lucide-react';
import { Logo } from './Logo';
import { useShop, ActiveTab } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setCatalogCategoryFilter } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const handleNav = (tab: ActiveTab, category?: string) => {
    setActiveTab(tab);
    if (category) setCatalogCategoryFilter(category);
  };

  return (
    <footer className="bg-[#09090c] border-t border-zinc-800/80 text-zinc-400 text-xs">
      {/* Top Value Badges */}
      <div className="border-b border-zinc-800/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white shrink-0">
              <Sparkles className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Bạc Ý S925 Nguyên Chất</h4>
              <p className="text-xs text-zinc-400 mt-1">
                92.5% bạc ròng phủ Rhodium chống oxy hoá và giữ độ bóng gương trường tồn.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white shrink-0">
              <Shield className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Bảo Hành Làm Sáng Trọn Đời</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Làm sạch, đánh bóng và kiểm tra chốt khóa miễn phí tại toàn bộ showroom CARA.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white shrink-0">
              <Clock className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Đổi Size Trong 7 Ngày</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Hỗ trợ đổi kích thước linh hoạt, an tâm trải nghiệm ngay cả khi mua sắm online.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white shrink-0">
              <MapPin className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Showroom TP. Hồ Chí Minh</h4>
              <p className="text-xs text-zinc-400 mt-1">
                140 Lê Trọng Tấn, P. Tây Thạnh - Trải nghiệm trang sức bạc và đo ni tay trực tiếp.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" />
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              CARA Silver Jewelry tôn vinh nghệ thuật kim hoàn đương đại thông qua những thiết kế tối giản, sắc sảo và phi giới tính. Từng đường nét được tạo hình chuẩn xác từ bạc Ý S925 cao cấp.
            </p>

            <div className="space-y-2 text-xs text-zinc-400 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-zinc-300">
                  <strong className="text-white">Địa chỉ:</strong> 140 Lê Trọng Tấn, Phường Tây Thạnh, TP Hồ Chí Minh
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong className="text-white">Hotline HCM:</strong>{' '}
                  <a href="tel:0775610065" className="font-mono text-zinc-200 hover:text-amber-300 font-bold">
                    0775610065
                  </a>{' '}
                  (09:00 - 21:30)
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Email: contact@carajewelry.vn</span>
              </div>
            </div>
          </div>

          {/* Collections Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Bộ Sưu Tập</h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('catalog', 'all')}
                  className="hover:text-white transition"
                >
                  Tất cả vòng & lắc tay
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('catalog', 'vong-tay')}
                  className="hover:text-white transition"
                >
                  Vòng tay bạc (Cuff & Bangle)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('catalog', 'lac-tay')}
                  className="hover:text-white transition"
                >
                  Lắc tay bạc (Cuban & Marine)
                </button>
              </li>
            </ul>
          </div>

          {/* Brand & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Chính Sách & Hỗ Trợ</h4>
            <ul className="space-y-2">
              <li>
                <button type="button" onClick={() => handleNav('about')} className="hover:text-white transition">
                  Câu chuyện thương hiệu
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('about')} className="hover:text-white transition">
                  Chuẩn bạc 925 & Lớp mạ Rhodium
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('about')} className="hover:text-white transition">
                  Hướng dẫn bảo quản trang sức
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('contact')} className="hover:text-white transition">
                  Chính sách bảo hành trọn đời
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('contact')} className="hover:text-white transition">
                  Chính sách giao hàng & COD
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('order-management')}
                  className="text-zinc-500 hover:text-zinc-300 transition text-[11px] pt-1 block"
                >
                  🔒 Cổng Quản Trị Viên
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter signup */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Đăng Ký Nhận Tin</h4>
            <p className="text-xs text-zinc-400">
              Nhận voucher <strong>10%</strong> cho đơn hàng đầu tiên và thông báo về các bộ sưu tập giới hạn mới nhất.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-white text-black hover:bg-zinc-200 rounded-md transition flex items-center justify-center"
                  aria-label="Đăng ký nhận tin"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400">
                  Cảm ơn bạn! Mã voucher <strong>CARASILVER10</strong> đã sẵn sàng sử dụng.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} CARA Silver Jewelry. Bản quyền thuộc về thương hiệu CARA.</p>
          <div className="flex items-center gap-4">
            <span>Thanh toán an toàn:</span>
            <span className="px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-400 font-mono">COD</span>
            <span className="px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-400 font-mono">VietQR</span>
            <span className="px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-400 font-mono">MoMo</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
