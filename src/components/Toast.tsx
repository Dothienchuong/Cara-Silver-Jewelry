import React from 'react';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';

export const Toast: React.FC = () => {
  const { toastMessage, dismissToast, setIsCartDrawerOpen } = useShop();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#16161b] border border-zinc-700/80 rounded-xl p-3.5 shadow-2xl flex items-center gap-3 backdrop-blur-md"
          id="cara-toast-notification"
        >
          {toastMessage.image ? (
            <img
              src={toastMessage.image}
              alt="Item added"
              className="w-12 h-12 rounded-lg object-cover bg-zinc-950 border border-zinc-700 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-5 h-5" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-white tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              {toastMessage.title}
            </h4>
            {toastMessage.subtitle && (
              <p className="text-[11px] text-zinc-300 truncate mt-0.5">
                {toastMessage.subtitle}
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                dismissToast();
                setIsCartDrawerOpen(true);
              }}
              className="text-[11px] text-white underline underline-offset-2 hover:text-zinc-300 font-medium mt-1 inline-block"
            >
              Xem giỏ hàng ngay &rarr;
            </button>
          </div>

          <button
            type="button"
            onClick={dismissToast}
            className="p-1 text-zinc-400 hover:text-white rounded-lg transition shrink-0"
            aria-label="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
