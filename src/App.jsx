import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { SplashScreen } from './components/common/SplashScreen';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ParticleBackground } from './components/common/ParticleBackground';
import { WelcomeModal } from './components/common/WelcomeModal';
import { CookieBanner } from './components/common/CookieBanner';
import { ChatWidget } from './components/common/ChatWidget';
import { CommandPalette } from './components/common/CommandPalette';
import { CartDrawer } from './components/common/CartDrawer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { GameHostingPage } from './pages/GameHostingPage';
import { CloudVPSPage } from './pages/CloudVPSPage';
import { DedicatedServersPage } from './pages/DedicatedServersPage';
import { WebHostingPage } from './pages/WebHostingPage';
import { DiscordBotPage } from './pages/DiscordBotPage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CheckoutPage } from './pages/CheckoutPage';

// Client Dashboard
import { ClientLayout } from './pages/client/ClientLayout';
import { ClientOverview } from './pages/client/ClientOverview';
import { ClientServers } from './pages/client/ClientServers';
import { ClientBilling } from './pages/client/ClientBilling';
import { ClientSupport } from './pages/client/ClientSupport';
import { ClientSettings } from './pages/client/ClientSettings';

// Admin Control Center
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminServers } from './pages/admin/AdminServers';
import { AdminTickets } from './pages/admin/AdminTickets';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminContent } from './pages/admin/AdminContent';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';

// Smooth Momentum Scrolling & Scroll Animations
import { useLenis } from './hooks/useLenis';
import { ScrollProgressBar } from './components/common/ScrollProgressBar';
import { ScrollToTopButton } from './components/common/ScrollToTopButton';

export const App = () => {
  // Initialize Lenis smooth momentum scrolling engine
  useLenis();

  const [searchOpen, setSearchOpen] = useState(false);
  const [replaySplashTrigger, setReplaySplashTrigger] = useState(0);
  const location = useLocation();

  // Scroll to top smoothly on route change
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleReplay = () => {
      setReplaySplashTrigger((prev) => prev + 1);
    };
    window.addEventListener('zerox-replay-splash', handleReplay);
    return () => window.removeEventListener('zerox-replay-splash', handleReplay);
  }, []);

  const isClientArea = location.pathname.startsWith('/client');
  const isAdminArea = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-[#080B0A] text-white flex flex-col font-sans selection:bg-[#C5F36A] selection:text-black">
      {/* Sleek Neon Glow Top Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* Cinematic Splash Screen matching video loading sequence */}
      <SplashScreen
        key={replaySplashTrigger}
        forceShow={replaySplashTrigger > 0}
      />

      {/* Ambient background particles */}
      <ParticleBackground />

      {/* Global Navbar (omitted on client/admin/auth portals for clean app experience) */}
      {!isClientArea && !isAdminArea && !isAuthPage && (
        <Navbar onOpenSearch={() => setSearchOpen(true)} />
      )}

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Ctrl+K Command Palette Search */}
      <CommandPalette isOpen={searchOpen} onClose={setSearchOpen} />

      {/* Floating Utilities on Public Site */}
      {!isClientArea && !isAdminArea && !isAuthPage && (
        <>
          <WelcomeModal />
          <CookieBanner />
          <ChatWidget />
          <ScrollToTopButton />
        </>
      )}

      {/* Main Content View */}
      <div className="flex-1">
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<HomePage />} />
          <Route path="/games" element={<GameHostingPage />} />
          <Route path="/cloud" element={<CloudVPSPage />} />
          <Route path="/dedicated" element={<DedicatedServersPage />} />
          <Route path="/web" element={<WebHostingPage />} />
          <Route path="/bots" element={<DiscordBotPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<LegalPage />} />
          <Route path="/privacy" element={<LegalPage />} />
          <Route path="/refund" element={<LegalPage />} />
          <Route path="/rules" element={<LegalPage />} />
          <Route path="/dataloss" element={<LegalPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Customer Client Area */}
          <Route path="/client" element={<ClientLayout />}>
            <Route path="overview" element={<ClientOverview />} />
            <Route path="servers" element={<ClientServers />} />
            <Route path="billing" element={<ClientBilling />} />
            <Route path="support" element={<ClientSupport />} />
            <Route path="settings" element={<ClientSettings />} />
          </Route>

          {/* Super Admin Control Center */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="overview" element={<AdminOverview />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="servers" element={<AdminServers />} />
            <Route path="tickets" element={<AdminTickets />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>

      {/* Global Footer (omitted on client/admin/auth) */}
      {!isClientArea && !isAdminArea && !isAuthPage && <Footer />}
    </div>
  );
};

