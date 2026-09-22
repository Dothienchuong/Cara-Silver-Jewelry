import React from 'react';
import { Package, Calendar, MapPin, ArrowRight, Eye, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatVND, formatDate } from '../utils/format';

export const OrderHistoryView: React.FC = () => {
  const { orders, viewOrderDetails, setActiveTab } = useShop();

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-brand text-white">Chưa Có Đơn Hàng Nào</h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto">
            Lịch sử đơn hàng của bạn sẽ được tự động lưu trữ tại đây sau khi đặt hàng thành công.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className="px-6 py-3 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition"
        >
          Khám Phá Sản Phẩm Ngay
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold font-brand text-white">
          Lịch Sử Đơn Hàng Của Bạn
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Được lưu trữ cục bộ ({orders.length} đơn hàng đã đặt)
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-5 sm:p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
            id={`order-history-${order.id}`}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm font-bold text-white tracking-wider">
                  #{order.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Đã tiếp nhận
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(order.createdAt)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span>
                  Giao đến: {order.customer.fullName} • {order.customer.address}, {order.customer.city}
                </span>
              </div>

              {/* Thumbnails of items */}
              <div className="flex items-center gap-2 overflow-x-auto pt-1">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0"
                    title={`${item.product.name} (x${item.quantity})`}
                  >
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                    {item.quantity > 1 && (
                      <span className="absolute bottom-0 right-0 bg-black/80 text-white text-[9px] font-bold px-1 rounded-tl">
                        x{item.quantity}
                      </span>
                    )}
                  </div>
                ))}
                <span className="text-xs text-zinc-400 pl-2">
                  Tổng {order.items.reduce((sum, i) => sum + i.quantity, 0)} món đồ
                </span>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-zinc-800 pt-3 md:pt-0 gap-3">
              <div>
                <span className="text-xs text-zinc-500 block text-left md:text-right">Tổng thanh toán</span>
                <span className="text-lg font-bold text-white">{formatVND(order.total)}</span>
              </div>

              <button
                type="button"
                onClick={() => viewOrderDetails(order)}
                className="px-4 py-2 bg-zinc-800 hover:bg-white hover:text-black text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem Chi Tiết</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
