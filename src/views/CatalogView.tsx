import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const CatalogView: React.FC = () => {
  const { products, catalogCategoryFilter, setCatalogCategoryFilter } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<'all' | 'new' | 'bestseller' | 'under500k' | 'couple'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const categories = [
    { id: 'all', label: 'Tất Cả Vòng & Lắc Tay' },
    { id: 'vong-tay', label: 'Vòng Tay (Cuff & Bangle)' },
    { id: 'lac-tay', label: 'Lắc Tay (Chain & Link)' },
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          catalogCategoryFilter === 'all' || product.category === catalogCategoryFilter;

        const matchesTag =
          tagFilter === 'all' ||
          (tagFilter === 'new' && product.isNew) ||
          (tagFilter === 'bestseller' && product.isBestSeller) ||
          (tagFilter === 'under500k' && product.price <= 500000) ||
          (tagFilter === 'couple' && (product.coupleItem || product.tags.includes('Lắc Đôi') || product.tags.includes('Couple')));

        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          (product.sku && product.sku.toLowerCase().includes(query)) ||
          product.material.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          (product.modelCode && product.modelCode.toLowerCase().includes(query)) ||
          product.tags.some((t) => t.toLowerCase().includes(query)) ||
          (product.seoKeywords && product.seoKeywords.some((k) => k.toLowerCase().includes(query)));

        return matchesCategory && matchesTag && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // featured: new arrivals & best sellers first
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return 0;
      });
  }, [products, catalogCategoryFilter, tagFilter, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>Catalog Vòng & Lắc Tay Bạc S925</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-brand text-white">
              {catalogCategoryFilter === 'vong-tay'
                ? 'Bộ Sưu Tập Vòng Tay Bạc (Cuff & Bangle)'
                : catalogCategoryFilter === 'lac-tay'
                ? 'Bộ Sưu Tập Lắc Tay Bạc (Chain & Link)'
                : 'Toàn Bộ Bộ Sưu Tập Vòng & Lắc Tay Bạc CARA'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              {catalogCategoryFilter === 'vong-tay'
                ? 'Tuyển tập kiềng xoắn Twisted Cuff, vòng trơn Solid Bangle, và kiềng mở đúc từ bạc S925 nguyên khối chế tác tinh xảo.'
                : catalogCategoryFilter === 'lac-tay'
                ? 'Tuyển tập lắc xích Cuban Chain, lắc mỏ neo Marine Link, và lắc Figaro, Snake Bone cá tính, đẳng cấp.'
                : 'Được chế tác thủ công từ bạc Ý S925 phủ Rhodium sáng bóng, hoàn thiện tỉ mỉ cho cổ tay nam và nữ.'}
            </p>
          </div>

          <div className="text-xs text-zinc-400">
            Hiển thị <strong className="text-white">{filteredProducts.length}</strong> sản phẩm
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="space-y-3">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCatalogCategoryFilter(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all uppercase tracking-wider ${
                    catalogCategoryFilter === cat.id
                      ? 'bg-white text-black shadow-lg shadow-white/10'
                      : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                  }`}
                  id={`cat-filter-btn-${cat.id}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm tên, mã SP (LT00CARA)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                  id="catalog-search-input"
                />
              </div>

              {/* Sort Select */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <SlidersHorizontal className="w-4 h-4 text-zinc-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 cursor-pointer"
                  id="catalog-sort-select"
                >
                  <option value="featured">Nổi bật nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sub Tag Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-zinc-500 text-[11px] uppercase tracking-wider shrink-0 mr-1">Bộ sưu tập:</span>
            {[
              { id: 'all', label: 'Tất Cả' },
              { id: 'new', label: '✨ Mới Ra Mắt' },
              { id: 'bestseller', label: '🔥 Bán Chạy Nhất' },
              { id: 'under500k', label: '🏷️ Giá Dưới 500k' },
              { id: 'couple', label: '🤍 Lắc Đôi Tình Nhân' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTagFilter(t.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  tagFilter === t.id
                    ? 'bg-zinc-200 text-zinc-950 font-semibold shadow'
                    : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl p-8 space-y-4">
          <div className="text-zinc-500 text-sm">Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.</div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setCatalogCategoryFilter('all');
            }}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg transition"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
