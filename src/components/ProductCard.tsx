import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { formatVND } from '../utils/format';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductDetail, addToCart } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    // Use first available size as default for quick-add
    const defaultSize = product.sizes[0] || 'Tiêu chuẩn';
    addToCart(product, defaultSize, 1);

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const currentImage = isHovered && product.images[1] ? product.images[1] : product.images[0];

  return (
    <div
      onClick={() => openProductDetail(product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-[#131317] border border-zinc-800/80 rounded-xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300 hover:border-zinc-600 hover:shadow-2xl hover:shadow-black/60"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Tags / Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestSeller && (
            <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-white text-zinc-950 rounded shadow-sm">
              Bán Chạy
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-zinc-800/90 backdrop-blur-sm text-zinc-200 border border-zinc-700 rounded shadow-sm">
              Mới
            </span>
          )}
          <span className="px-2 py-0.5 text-[9px] font-semibold tracking-wider bg-black/60 backdrop-blur-sm text-zinc-300 border border-zinc-800 rounded">
            S925
          </span>
        </div>

        {/* Quick View Floating Action */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openProductDetail(product.id);
            }}
            className="p-2 bg-zinc-900/90 hover:bg-white hover:text-black text-zinc-200 rounded-full backdrop-blur-md border border-zinc-700 transition"
            title="Xem chi tiết"
            aria-label={`Xem chi tiết ${product.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Overlay Button for Desktop */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10 hidden sm:block">
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
              isAdding
                ? 'bg-zinc-200 text-black'
                : 'bg-white/95 hover:bg-white text-zinc-950 shadow-lg shadow-black/40'
            }`}
            id={`quick-add-btn-${product.id}`}
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Đã thêm!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Thêm Vào Giỏ</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-[#131317]">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
            <span className="uppercase tracking-wider text-[11px] text-zinc-500 font-medium">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 text-zinc-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-medium">{product.rating}</span>
              <span className="text-zinc-600 text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-medium text-zinc-100 line-clamp-2 group-hover:text-white transition-colors mb-1.5 leading-snug">
            {product.name}
          </h3>

          {/* Material Tag */}
          <p className="text-[11px] text-zinc-400 line-clamp-1 mb-3">
            {product.material}
          </p>
        </div>

        {/* Pricing & Mobile Add Button */}
        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold text-white tracking-tight">
                {formatVND(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-zinc-500 line-through">
                  {formatVND(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Mobile Always-Visible Quick Add Icon */}
          <div className="sm:hidden">
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-white hover:text-black text-zinc-200 transition"
              aria-label="Thêm vào giỏ"
            >
              {isAdding ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
