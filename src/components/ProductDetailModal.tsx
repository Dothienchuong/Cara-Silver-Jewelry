import React, { useState } from 'react';
import { X, Star, Shield, RefreshCw, Truck, Ruler, Minus, Plus, ShoppingBag, Zap, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { formatVND } from '../utils/format';
import { SizeGuideModal } from './SizeGuideModal';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, closeProductDetail, addToCart, setActiveTab, setIsCartDrawerOpen } = useShop();

  if (!selectedProduct) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(selectedProduct.sizes[0] || 'Tiêu chuẩn');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedSize, quantity);
    setIsAddedSuccess(true);
    setTimeout(() => {
      setIsAddedSuccess(false);
    }, 1200);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, selectedSize, quantity);
    closeProductDetail();
    setIsCartDrawerOpen(false);
    setActiveTab('checkout');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl bg-[#111115] border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row"
          id={`product-detail-modal-${selectedProduct.id}`}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeProductDetail}
            className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/50 transition"
            aria-label="Đóng chi tiết sản phẩm"
            id="close-product-detail-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Image Gallery */}
          <div className="w-full md:w-1/2 p-5 sm:p-6 bg-zinc-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
            {/* Main Featured Image */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <img
                src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {selectedProduct.isBestSeller && (
                <div className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded">
                  Bán Chạy Nhất
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {selectedProduct.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-white ring-2 ring-white/20'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Interactions */}
          <div className="w-full md:w-1/2 p-5 sm:p-8 overflow-y-auto flex flex-col justify-between bg-[#111115]">
            <div className="space-y-5">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                  {selectedProduct.categoryName} • Mã SKU: <span className="text-amber-300 font-mono font-bold">{selectedProduct.sku || selectedProduct.modelCode}</span>
                </span>
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold">{selectedProduct.rating}</span>
                  <span className="text-zinc-500 text-xs">({selectedProduct.reviewsCount} đánh giá)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-snug">
                {selectedProduct.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 pb-2 border-b border-zinc-800/80">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-white tracking-tight">
                    {formatVND(selectedProduct.price)}
                  </span>
                  {selectedProduct.coupleItem && (
                    <span className="text-sm font-semibold text-rose-300">
                      / cặp
                    </span>
                  )}
                </div>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-zinc-500 line-through">
                    {formatVND(selectedProduct.originalPrice)}
                  </span>
                )}
                <span className="px-2 py-0.5 text-[11px] font-medium bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                  Chuẩn Bạc 925
                </span>
              </div>

              {/* SEO Keywords tags */}
              {selectedProduct.seoKeywords && selectedProduct.seoKeywords.length > 0 && (
                <div className="flex items-center flex-wrap gap-1.5 text-[11px]">
                  <span className="text-zinc-500 font-medium">Gợi ý tìm kiếm:</span>
                  {selectedProduct.seoKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              )}

              {/* Material Highlight */}
              <div className="bg-zinc-900/90 rounded-xl p-3.5 border border-zinc-800/80 flex items-start gap-3">
                <Shield className="w-5 h-5 text-zinc-300 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white uppercase tracking-wider">
                    Chất liệu bảo chứng
                  </div>
                  <div className="text-xs text-zinc-300 mt-0.5">
                    {selectedProduct.material}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Special Product Callouts */}
              {selectedProduct.coupleItem && (
                <div className="bg-rose-950/30 border border-rose-800/40 rounded-lg p-3 text-xs text-rose-200 flex items-center gap-2">
                  <span className="font-semibold text-rose-300">Set Đôi:</span>
                  <span>Tặng kèm hộp quà tình nhân CARA & thiệp chúc mừng cao cấp.</span>
                </div>
              )}
              {selectedProduct.engravingOption && (
                <div className="bg-zinc-800/60 border border-zinc-700/60 rounded-lg p-3 text-xs text-zinc-200 flex items-center gap-2">
                  <span className="font-semibold text-white">Khắc Tên Laser:</span>
                  <span>Miễn phí khắc tên hoặc ngày kỷ niệm theo yêu cầu khi đặt hàng.</span>
                </div>
              )}

              {/* Size Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Chọn kích cỡ (Size):
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(true)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 underline underline-offset-4 transition"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Hướng dẫn chọn size</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-2 text-xs rounded-lg border font-medium transition ${
                        selectedSize === size
                          ? 'bg-white text-black border-white shadow-md shadow-black/40'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Số lượng:
                </label>
                <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 transition"
                    aria-label="Giảm số lượng"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-zinc-400 hover:text-white transition"
                    aria-label="Tăng số lượng"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CTAs: Add to Cart & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAddedSuccess}
                  className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
                    isAddedSuccess
                      ? 'bg-zinc-800 text-white border-zinc-600'
                      : 'bg-transparent text-white border-zinc-500 hover:border-white hover:bg-zinc-800/40'
                  }`}
                  id="modal-add-to-cart-btn"
                >
                  {isAddedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Đã Thêm Vào Giỏ!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Thêm Vào Giỏ Hàng</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/5 transition"
                  id="modal-buy-now-btn"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Mua Ngay</span>
                </motion.button>
              </div>

              {/* Guarantees list */}
              <div className="pt-4 border-t border-zinc-800 grid grid-cols-3 gap-2 text-[11px] text-zinc-400 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-zinc-400" />
                  <span>Giao hàng toàn quốc</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Shield className="w-4 h-4 text-zinc-400" />
                  <span>Bảo hành làm sáng</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RefreshCw className="w-4 h-4 text-zinc-400" />
                  <span>Đổi size trong 7 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Size Guide Child Modal */}
      {showSizeGuide && (
        <SizeGuideModal
          category={selectedProduct.category}
          onClose={() => setShowSizeGuide(false)}
        />
      )}
    </>
  );
};
