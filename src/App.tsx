import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Toast } from './components/Toast';

import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderSuccessView } from './views/OrderSuccessView';
import { OrderHistoryView } from './views/OrderHistoryView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';

const MainLayout: React.FC = () => {
  const { activeTab } = useShop();

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#f2f2f5] flex flex-col selection:bg-zinc-700 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-grow">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'catalog' && <CatalogView />}
        {activeTab === 'cart' && <CartView />}
        {activeTab === 'checkout' && <CheckoutView />}
        {activeTab === 'order-success' && <OrderSuccessView />}
        {activeTab === 'order-history' && <OrderHistoryView />}
        {activeTab === 'about' && <AboutView />}
        {activeTab === 'contact' && <ContactView />}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Micro-Notification Toast */}
      <Toast />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}
