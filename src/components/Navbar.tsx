import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Clock, ShieldCheck, Truck, ChevronDown, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop, ActiveTab } from '../context/ShopContext';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setCatalogCategoryFilter,
    cartCount,
    setIsCartDrawerOpen,
    orders,
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const handleNavClick = (tab: ActiveTab, category?: string) => {
    setActiveTab(tab);
    if (category) {
      setCatalogCategoryFilter(category);
    }
    setIsMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0c0c0e]/95 backdrop-blur-md border-b border-zinc-800/80">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-zinc-950 border-b border-zinc-800/50 py-1.5 px-4 text-[11px] sm:text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Truck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Freeship toàn quốc đơn từ 1.000.000₫</span>
            </span>
            <span className="hidden md:inline-block text-zinc-700">•</span>
            <span className="hidden md:flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Bạc S925 chuẩn Ý - Bảo hành làm sáng trọn đời</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-zinc-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-500" />
              <span>Showroom HCM: 09:00 - 21:30</span>
            </span>
            <a href="tel:0775610065" className="hover:text-white transition font-mono font-medium">
              Hotline HCM: 0775610065
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-white rounded-md hover:bg-zinc-800/60 transition"
            aria-label="Toggle Navigation Menu"
            id="mobile-nav-toggle-btn"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="text-left focus:outline-none"
          id="cara-brand-home-link"
        >
          <Logo size="md" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`transition-colors py-1 relative ${
              activeTab === 'home' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            id="nav-link-home"
          >
            Trang Chủ
            {activeTab === 'home' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-zinc-300 to-zinc-500 rounded-full" />
            )}
          </button>

          {/* Products with Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsCategoryDropdownOpen(true)}
            onMouseLeave={() => setIsCategoryDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => handleNavClick('catalog', 'all')}
              className={`flex items-center gap-1 transition-colors py-1 relative ${
                activeTab === 'catalog' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              id="nav-link-catalog"
            >
              Bộ Sưu Tập
              <ChevronDown className="w-4 h-4 opacity-70" />
              {activeTab === 'catalog' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-zinc-300 to-zinc-500 rounded-full" />
              )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isCategoryDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 w-60 py-2 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-lg shadow-xl shadow-black/50 z-50"
                >
                  <button
                    type="button"
                    onClick={() => handleNavClick('catalog', 'all')}
                    className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition flex items-center justify-between"
                  >
                    <span>Tất Cả Vòng & Lắc Tay</span>
                  </button>
                  <div className="h-[1px] bg-zinc-800 my-1 mx-2" />
                  <button
                    type="button"
                    onClick={() => handleNavClick('catalog', 'vong-tay')}
                    className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition"
                  >
                    Vòng Tay Bạc (Bangles & Cuffs)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick('catalog', 'lac-tay')}
                    className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition"
                  >
                    Lắc Tay Bạc (Chains & Links)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => handleNavClick('about')}
            className={`transition-colors py-1 relative ${
              activeTab === 'about' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            id="nav-link-about"
          >
            Về CARA
            {activeTab === 'about' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-zinc-300 to-zinc-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            className={`transition-colors py-1 relative ${
              activeTab === 'contact' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            id="nav-link-contact"
          >
            Liên Hệ
            {activeTab === 'contact' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-zinc-300 to-zinc-500 rounded-full" />
            )}
          </button>

          {orders.length > 0 && (
            <button
              type="button"
              onClick={() => handleNavClick('order-history')}
              className={`transition-colors py-1 relative text-xs uppercase tracking-wider ${
                activeTab === 'order-history' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              id="nav-link-orders"
            >
              Đơn hàng ({orders.length})
            </button>
          )}
        </nav>

        {/* Right action controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick search button */}
          <button
            type="button"
            onClick={() => handleNavClick('catalog', 'all')}
            className="p-2 text-zinc-300 hover:text-white rounded-full hover:bg-zinc-800/60 transition"
            title="Tìm kiếm trang sức"
            aria-label="Tìm kiếm sản phẩm"
            id="quick-search-btn"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Discreet Admin Portal Button */}
          <button
            type="button"
            onClick={() => handleNavClick('order-management')}
            className={`p-2 rounded-full transition ${
              activeTab === 'order-management'
                ? 'bg-zinc-800 text-amber-300 border border-amber-500/30'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60'
            }`}
            title="Cổng Quản Trị Viên (Admin)"
            aria-label="Cổng Quản Trị Viên"
            id="admin-portal-nav-btn"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>

          {/* Cart button with counter badge */}
          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative p-2.5 text-zinc-200 hover:text-white rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition group"
            aria-label="Mở giỏ hàng"
            id="open-cart-drawer-btn"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={cartCount}
                className="absolute -top-1 -right-1 bg-white text-black text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-black/50"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer / Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-800 bg-[#121216] px-6 py-5 flex flex-col gap-3 text-sm"
          >
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="text-left py-2 text-zinc-300 hover:text-white font-medium border-b border-zinc-800/60"
            >
              Trang Chủ
            </button>
            <div className="py-1">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold block mb-2">
                Bộ Sưu Tập Vòng & Lắc Tay
              </span>
              <div className="grid grid-cols-2 gap-2 pl-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('catalog', 'all')}
                  className="text-left py-1.5 text-zinc-300 hover:text-white text-xs"
                >
                  • Tất cả sản phẩm
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('catalog', 'vong-tay')}
                  className="text-left py-1.5 text-zinc-300 hover:text-white text-xs"
                >
                  • Vòng tay bạc (Cuff & Bangle)
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('catalog', 'lac-tay')}
                  className="text-left py-1.5 text-zinc-300 hover:text-white text-xs"
                >
                  • Lắc tay bạc (Chain & Link)
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleNavClick('about')}
              className="text-left py-2 text-zinc-300 hover:text-white font-medium border-b border-zinc-800/60"
            >
              Về Thương Hiệu CARA
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className="text-left py-2 text-zinc-300 hover:text-white font-medium border-b border-zinc-800/60"
            >
              Hệ Thống Showroom & Liên Hệ
            </button>
            {orders.length > 0 && (
              <button
                type="button"
                onClick={() => handleNavClick('order-history')}
                className="text-left py-2 text-zinc-300 hover:text-white font-medium border-b border-zinc-800/60"
              >
                Tra cứu đơn hàng ({orders.length})
              </button>
            )}
            <button
              type="button"
              onClick={() => handleNavClick('order-management')}
              className="text-left pt-3 text-xs text-zinc-500 hover:text-zinc-300 font-medium flex items-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
              <span>Cổng Quản Trị Viên (Admin)</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
