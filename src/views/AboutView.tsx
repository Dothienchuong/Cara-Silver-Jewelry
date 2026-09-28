import React from 'react';
import { Sparkles, Shield, Compass, Gem } from 'lucide-react';
import { Logo } from '../components/Logo';
import caraVt04Image from '../assets/images/regenerated_image_1790216696616.jpg';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Logo size="lg" className="justify-center mb-2" />
        <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-bold">
          Câu Chuyện Thương Hiệu
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-brand text-white leading-tight">
          Nghệ Thuật Kim Hoàn <br />
          Tối Giản & Đương Đại
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
          Được khởi nguồn từ niềm đam mê với chất liệu kim loại ánh bạc, CARA Silver Jewelry ra đời nhằm định nghĩa lại chuẩn mực trang sức bạc cao cấp tại Việt Nam.
        </p>
      </div>

      {/* Editorial Image Banner */}
      <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
        <img
          src={caraVt04Image}
          alt="CARA Silver Jewelry Atelier"
          className="w-full h-full object-cover filter contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 sm:p-10">
          <p className="text-white text-sm sm:text-base font-brand max-w-lg">
            "Chúng tôi loại bỏ mọi chi tiết thừa thãi để giữ lại vẻ đẹp thuần khiết nhất của cấu trúc hình học và ánh sáng kim loại."
          </p>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white">
            <Compass className="w-5 h-5 text-zinc-300" />
          </div>
          <h3 className="text-base font-bold text-white font-brand">Thiết Kế Unisex</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Mỗi tác phẩm của CARA không bị giới hạn bởi khuôn mẫu giới tính. Đường nét mạnh mẽ nhưng uyển chuyển, tôn vinh cá tính độc bản của bất kỳ ai khoác lên mình.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white">
            <Gem className="w-5 h-5 text-zinc-300" />
          </div>
          <h3 className="text-base font-bold text-white font-brand">Bạc Ý S925 Nguyên Khối</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Sử dụng 92.5% bạc ròng kết hợp cùng hợp kim tinh khiết tiêu chuẩn châu Âu để đạt độ cứng hoàn hảo, không bị biến dạng và tuyệt đối an toàn cho làn da nhạy cảm.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white">
            <Shield className="w-5 h-5 text-zinc-300" />
          </div>
          <h3 className="text-base font-bold text-white font-brand">Phủ Bạch Kim Rhodium</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Công nghệ mạ Rhodium đa lớp độc quyền giúp ngăn chặn quá trình oxy hoá tự nhiên, mang lại bề mặt bóng gương lộng lẫy và độ bền màu vượt thời gian.
          </p>
        </div>
      </div>

      {/* Care Guide Section */}
      <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Cẩm Nang Sử Dụng</span>
          <h2 className="text-2xl font-bold font-brand text-white">Bảo Quản Trang Sức Bạc Đúng Cách</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300">
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1.5">
            <strong className="text-white block">1. Tránh tiếp xúc hóa chất mạnh</strong>
            <p className="text-zinc-400 leading-relaxed">
              Tháo trang sức khi tắm biển, ngâm nước nóng có lưu huỳnh, hoặc khi xịt nước hoa trực tiếp lên bề mặt bạc.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1.5">
            <strong className="text-white block">2. Cất giữ trong túi zip chân không</strong>
            <p className="text-zinc-400 leading-relaxed">
              Khi không đeo, hãy lau khô bằng khăn lau bạc chuyên dụng tặng kèm và bảo quản trong hộp chống ẩm của CARA.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1.5">
            <strong className="text-white block">3. Đeo thường xuyên</strong>
            <p className="text-zinc-400 leading-relaxed">
              Lớp dầu tự nhiên trên cơ thể người thực chất là một lớp màng bảo vệ tự nhiên giúp bạc luôn giữ được độ sáng bóng.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1.5">
            <strong className="text-white block">4. Bảo hành đánh bóng trọn đời</strong>
            <p className="text-zinc-400 leading-relaxed">
              Bất kỳ lúc nào bạc có dấu hiệu mờ, hãy ghé bất kỳ showroom nào của CARA để được siêu âm làm sáng hoàn toàn miễn phí.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
