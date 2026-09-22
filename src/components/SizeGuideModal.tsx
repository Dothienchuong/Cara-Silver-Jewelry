import React from 'react';
import { X, Ruler, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface SizeGuideModalProps {
  category: string;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ category, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-[#141418] border border-zinc-700 rounded-2xl p-6 text-zinc-200 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition"
          aria-label="Đóng bảng đo size"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 text-white">
          <Ruler className="w-5 h-5 text-zinc-300" />
          <h3 className="text-lg font-bold font-brand tracking-wide">
            Hướng Dẫn Chọn Size Trang Sức Bạc CARA
          </h3>
        </div>

        {/* Dynamic section based on product category */}
        {category === 'vong-tay' ? (
          <div className="space-y-4 text-sm text-zinc-300">
            <p className="text-zinc-400 text-xs leading-relaxed">
              Trang sức vòng tay & lắc tay bạc CARA được thiết kế chuẩn form Unisex, ôm vừa vặn cổ tay và tạo cảm giác thoải mái khi vận động hàng ngày.
            </p>

            <div className="bg-zinc-900/90 rounded-xl p-4 border border-zinc-800 space-y-3">
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                Cách Đo Chu Vi Cổ Tay Tại Nhà:
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-300">
                <li>Dùng một sợi dây mảnh hoặc dải giấy quấn quanh cổ tay tại vị trí bạn muốn đeo vòng.</li>
                <li>Đánh dấu điểm giao nhau rồi dùng thước kẻ đo chiều dài đoạn dây (tính theo cm).</li>
                <li>Cộng thêm 1cm - 1.5cm nếu bạn thích đeo lắc rủ thoải mái.</li>
              </ol>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="py-2 px-3">Size Vòng</th>
                    <th className="py-2 px-3">Chu vi cổ tay</th>
                    <th className="py-2 px-3">Gợi ý đối tượng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-white">16.0 cm</td>
                    <td className="py-2.5 px-3">14.5 - 15.5 cm</td>
                    <td className="py-2.5 px-3 text-zinc-400">Nữ cổ tay nhỏ / Nam mảnh</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-white">17.5 cm</td>
                    <td className="py-2.5 px-3">16.0 - 17.0 cm</td>
                    <td className="py-2.5 px-3 text-zinc-400">Tiêu chuẩn Unisex (Phổ biến nhất)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-white">19.0 cm</td>
                    <td className="py-2.5 px-3">17.5 - 18.5 cm</td>
                    <td className="py-2.5 px-3 text-zinc-400">Nam cổ tay vừa / Nữ thích đeo rộng</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-white">20.0 cm</td>
                    <td className="py-2.5 px-3">18.5 - 19.5 cm</td>
                    <td className="py-2.5 px-3 text-zinc-400">Nam cổ tay đầy đặn</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : category === 'nhan' ? (
          <div className="space-y-4 text-sm text-zinc-300">
            <div className="bg-zinc-900/90 rounded-xl p-4 border border-zinc-800 space-y-2">
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                Đo Đường Kính Lòng Trong Nhẫn Cũ:
              </h4>
              <p className="text-xs text-zinc-300">
                Nếu bạn có sẵn chiếc nhẫn vừa vặn, dùng thước kẻ đo đường kính lòng trong (không tính viền ngoài).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="py-2 px-3">Size Quốc Tế</th>
                    <th className="py-2 px-3">Đường kính lòng trong</th>
                    <th className="py-2 px-3">Chu vi ngón tay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  <tr>
                    <td className="py-2 px-3 font-medium text-white">Size 6</td>
                    <td className="py-2 px-3">16.5 mm</td>
                    <td className="py-2 px-3">51.8 mm</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-white">Size 7</td>
                    <td className="py-2 px-3">17.3 mm</td>
                    <td className="py-2 px-3">54.4 mm</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-white">Size 8</td>
                    <td className="py-2 px-3">18.1 mm</td>
                    <td className="py-2 px-3">56.9 mm</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-white">Size 9</td>
                    <td className="py-2 px-3">18.9 mm</td>
                    <td className="py-2 px-3">59.5 mm</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-white">Size 10</td>
                    <td className="py-2 px-3">19.8 mm</td>
                    <td className="py-2 px-3">62.1 mm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-sm text-zinc-300">
            <p className="text-xs text-zinc-400">
              Chiều dài dây chuyền bạc CARA được thiết kế linh hoạt phù hợp với nhiều phong cách phối đồ:
            </p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">45 cm:</strong> Ôm ngang xương quai xanh, thanh lịch khi mặc sơ mi hoặc áo cổ tròn.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">50 cm:</strong> Rơi dưới quai xanh 2-3cm, chiều dài tiêu chuẩn và dễ đeo nhất cho cả nam và nữ.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">55 - 60 cm:</strong> Rơi ngang ngực áo, phong cách cá tính, thích hợp phối layer nhiều sợi.</span>
              </li>
            </ul>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 rounded-lg transition"
          >
            Đã Hiểu
          </button>
        </div>
      </motion.div>
    </div>
  );
};
