import React from 'react';
import { ArrowRight, Sparkles, Shield, ArrowUpRight, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const HomeView: React.FC = () => {
  const { products, setActiveTab, setCatalogCategoryFilter } = useShop();

  const handleCategoryClick = (category: string) => {
    setCatalogCategoryFilter(category);
    setActiveTab('catalog');
  };

  // Best sellers
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  // Focus on Vòng tay (Bracelets) as highlighted in prompt 2
  const bracelets = products.filter((p) => p.category === 'vong-tay');

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Editorial Luxury Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden border-b border-zinc-800/80 bg-zinc-950">
        {/* Background Subtle Silver Texture & Dark Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(200,200,220,0.12),rgba(12,12,14,0.95))]" />
        
        {/* Background High Fashion Editorial Jewelry Imagery with Low Opacity */}
        <div className="absolute inset-0 opacity-25 mix-blend-luminosity pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1611591475152-4783113f60bc?auto=format&fit=crop&w=2000&q=80"
            alt="CARA Silver Jewelry Editorial"
            className="w-full h-full object-cover object-center filter grayscale contrast-125"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
          {/* Subtle Tag */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-700/80 text-zinc-300 text-xs tracking-[0.2em] uppercase backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span>Trang Sức Bạc Ý S925 • Tối Giản • Phi Giới Tính</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-brand text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white uppercase leading-[1.1]"
          >
            Vẻ Đẹp Trường Tồn <br />
            <span className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              Của Kim Loại Bạc
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed tracking-wide"
          >
            Thương hiệu kim hoàn tối giản đương đại dành cho mọi giới tính. Đúc nguyên khối từ bạc S925 tinh khiết phủ Rhodium phản quang ánh gương sang trọng.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              type="button"
              onClick={() => handleCategoryClick('vong-tay')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-zinc-200 font-semibold text-xs uppercase tracking-[0.2em] rounded-xl shadow-2xl shadow-white/10 transition-all flex items-center justify-center gap-2 group"
              id="hero-cta-bracelets"
            >
              <span>Khám Phá Vòng Tay Bạc</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => handleCategoryClick('all')}
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700/80 font-semibold text-xs uppercase tracking-[0.2em] rounded-xl backdrop-blur-md transition-all flex items-center justify-center gap-2"
              id="hero-cta-all"
            >
              <span>Xem Toàn Bộ Sản Phẩm</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-500 font-semibold">
              Khám phá theo danh mục
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-brand text-white mt-1">
              Bộ Sưu Tập CARA
            </h2>
          </div>
          <button
            type="button"
            onClick={() => handleCategoryClick('all')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition"
          >
            <span>Tất cả sản phẩm</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card: Vòng tay */}
          <div
            onClick={() => handleCategoryClick('vong-tay')}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-zinc-500 transition-all shadow-xl shadow-black/40"
            id="cat-card-vong-tay"
          >
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
              alt="Vòng tay bạc"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400">4 Mẫu Thiết Kế</span>
              <h3 className="text-base sm:text-lg font-bold text-white font-brand mt-0.5 flex items-center justify-between">
                <span>Vòng & Lắc Tay</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
            </div>
          </div>

          {/* Card: Dây chuyền */}
          <div
            onClick={() => handleCategoryClick('day-chuyen')}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-zinc-500 transition-all shadow-xl shadow-black/40"
            id="cat-card-day-chuyen"
          >
            <img
              src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80"
              alt="Dây chuyền bạc"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400">3 Mẫu Thiết Kế</span>
              <h3 className="text-base sm:text-lg font-bold text-white font-brand mt-0.5 flex items-center justify-between">
                <span>Dây Chuyền</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
            </div>
          </div>

          {/* Card: Nhẫn */}
          <div
            onClick={() => handleCategoryClick('nhan')}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-zinc-500 transition-all shadow-xl shadow-black/40"
            id="cat-card-nhan"
          >
            <img
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"
              alt="Nhẫn bạc"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400">3 Mẫu Thiết Kế</span>
              <h3 className="text-base sm:text-lg font-bold text-white font-brand mt-0.5 flex items-center justify-between">
                <span>Nhẫn Unisex</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
            </div>
          </div>

          {/* Card: Khuyên tai */}
          <div
            onClick={() => handleCategoryClick('khuyen-tai')}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-zinc-500 transition-all shadow-xl shadow-black/40"
            id="cat-card-khuyen-tai"
          >
            <img
              src="https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=800&q=80"
              alt="Khuyên tai bạc"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400">2 Mẫu Thiết Kế</span>
              <h3 className="text-base sm:text-lg font-bold text-white font-brand mt-0.5 flex items-center justify-between">
                <span>Khuyên Tai Bạc</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Spotlight: VÒNG TAY BẠC CARA (Direct translation of Prompt 2 requirement) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-[#15151a] to-[#0f0f13] border border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-[10px] uppercase font-bold tracking-widest border border-zinc-700">
                Tâm Điểm Thiết Kế
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-brand text-white">
                Bộ Sưu Tập Vòng Tay Bạc CARA
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                Được chế tác từ Bạc Ý 925 nguyên khối với phong cách hình học tối giản, phù hợp cho cả nam và nữ dễ dàng phối lớp (stacking) hoặc đeo đơn bản.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCategoryClick('vong-tay')}
              className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 text-xs font-semibold uppercase tracking-wider rounded-xl transition flex items-center gap-2 self-start md:self-end"
            >
              <span>Xem Tất Cả Vòng Tay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Vòng tay grid with full interactions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bracelets.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-semibold">
            Được Yêu Thích Nhất
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-brand text-white">
            Sản Phẩm Bán Chạy (Best Sellers)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Những biểu tượng trang sức bạc được khách hàng lựa chọn nhiều nhất tại hệ thống CARA.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand Philosophy / Craftsmanship Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-zinc-800 rounded-3xl overflow-hidden bg-zinc-950 grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 sm:p-14 flex flex-col justify-center space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-bold">
              Triết Lý Chế Tác
            </span>
            <h2 className="text-2xl sm:text-4xl font-brand font-bold text-white leading-tight">
              Tối Giản, Bền Bỉ & <br />
              Vượt Qua Mọi Giới Hạn
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              <p>
                Tại CARA Silver Jewelry, chúng tôi tin rằng trang sức không chỉ là phụ kiện làm đẹp, mà là biểu đạt chân thực cho bản sắc cá nhân. Không phân chia giới tính, không rườm rà phô trương.
              </p>
              <p>
                Mỗi sản phẩm đều trải qua quy trình đúc sáp áp lực cao, gia công tinh xảo bởi những nghệ nhân kim hoàn lành nghề và hoàn thiện bằng lớp mạ Rhodium bạch kim chống xỉn màu tối ưu.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800 text-xs">
              <div className="space-y-1">
                <span className="text-xl font-bold text-white font-brand">92.5%</span>
                <p className="text-zinc-400">Hàm lượng bạc ròng chuẩn kiểm định Ý</p>
              </div>
              <div className="space-y-1">
                <span className="text-xl font-bold text-white font-brand">100%</span>
                <p className="text-zinc-400">Bảo hành đánh bóng & làm sạch trọn đời</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[350px] lg:min-h-full bg-zinc-900 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80"
              alt="CARA Craftsmanship"
              className="w-full h-full object-cover filter contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-semibold">
            Đánh Giá Từ Khách Hàng
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-brand text-white">
            Trải Nghiệm Thực Tế Cùng CARA
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
              "Chiếc vòng tay Minimalist Twisted Cuff quá đẹp! Mình và bạn trai đeo cặp với nhau rất hợp. Bạc sáng bóng, đầm tay và không bị ngứa hay kích ứng da."
            </p>
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Hoàng Nam & Khánh Linh</span>
              <span className="text-zinc-500">Hà Nội • Mua Vòng Tay</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
              "Đóng gói hộp sang trọng như hàng hiệu xa xỉ. Dây chuyền Monogram chữ CA lồng tinh tế, các góc vát phản quang lấp lánh khi có ánh đèn rọi vào."
            </p>
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Trần Minh Quân</span>
              <span className="text-zinc-500">TP. HCM • Mua Dây Chuyền</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
              "Lắc tay Cuban Chain cầm nặng tay chắc nịch, chốt bấm chắc chắn. Điểm cộng lớn là dịch vụ hỗ trợ đổi size siêu nhanh và nhân viên tư vấn rất tận tâm."
            </p>
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Đặng Thảo Vy</span>
              <span className="text-zinc-500">Đà Nẵng • Mua Lắc Tay</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
