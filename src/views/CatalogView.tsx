import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const CatalogView: React.FC = () => {
  const { products, catalogCategoryFilter, setCatalogCategoryFilter } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const categories = [
    { id: 'all', label: 'Tất Cả Sản Phẩm' },
    { id: 'vong-tay', label: 'Vòng & Lắc Tay' },
    { id: 'day-chuyen', label: 'Dây Chuyền' },
    { id: 'nhan', label: 'Nhẫn Unisex' },
    { id: 'khuyen-tai', label: 'Khuyên Tai' },
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          catalogCategoryFilter === 'all' || product.category === catalogCategoryFilter;
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // featured: best sellers first
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return 0;
      });
  }, [products, catalogCategoryFilter, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>Catalog Trang Sức Bạc 925</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-brand text-white">
              {catalogCategoryFilter === 'vong-tay'
                ? 'Bộ Sưu Tập Vòng Tay Bạc CARA'
                : catalogCategoryFilter === 'day-chuyen'
                ? 'Dây Chuyền Bạc Unisex'
                : catalogCategoryFilter === 'nhan'
                ? 'Nhẫn Bạc S925 Đương Đại'
                : catalogCategoryFilter === 'khuyen-tai'
                ? 'Khuyên Tai Bạc Nguyên Khối'
                : 'Tất Cả Sản Phẩm Trang Sức Bạc'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              {catalogCategoryFilter === 'vong-tay'
                ? 'Tuyển tập các mẫu kiềng xoắn Cuff, lắc xích Cuban Chain, và lắc mỏ neo Marine đúc từ bạc 925 nguyên khối dành riêng cho cổ tay người Việt.'
                : 'Mỗi sản phẩm đều mang đậm dấu ấn tối giản, phong cách phi giới tính và được kiểm định nghiêm ngặt về chất lượng bạc.'}
            </p>
          </div>

          <div className="text-xs text-zinc-400">
            Hiển thị <strong className="text-white">{filteredProducts.length}</strong> sản phẩm
          </div>
        </div>

        {/* Filters and Search Bar */}
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
                placeholder="Tìm tên hoặc chất liệu..."
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
