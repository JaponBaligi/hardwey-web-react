import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/Navigation/Navigation';
import { MobileMenu } from '@/components/MobileMenu/MobileMenu';
import { LoadingScreen } from '@/components/LoadingScreen/LoadingScreen';
import { HeroSection } from '@/components/HeroSection/HeroSection';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useModal } from '@/hooks/useModal';
import { features } from '@/utils/env';
import styles from './App.module.css';

const IntroSection = lazy(() => import('@/components/IntroSection/IntroSection').then(m => ({ default: m.IntroSection })));
const SharesSection = lazy(() => import('@/components/SharesSection/SharesSection').then(m => ({ default: m.SharesSection })));
const TickerAnimation = lazy(() => import('@/components/TickerAnimation/TickerAnimation').then(m => ({ default: m.TickerAnimation })));
const InvestmentIntroSection = lazy(() => import('@/components/InvestmentIntroSection/InvestmentIntroSection').then(m => ({ default: m.InvestmentIntroSection })));
const NftDisclaimer = lazy(() => import('@/components/NftDisclaimer/NftDisclaimer').then(m => ({ default: m.NftDisclaimer })));
const FaqSection = lazy(() => import('@/components/FaqSection/FaqSection').then(m => ({ default: m.FaqSection })));
const CookieConsent = lazy(() => import('@/components/CookieConsent/CookieConsent').then(m => ({ default: m.CookieConsent })));
const FredAgainSection = lazy(() => import('@/components/FredAgainSection/FredAgainSection').then(m => ({ default: m.FredAgainSection })));
const FoundersSection = lazy(() => import('@/components/FoundersSection/FoundersSection').then(m => ({ default: m.FoundersSection })));
const JoinUsSection = lazy(() => import('@/components/JoinUsSection/JoinUsSection').then(m => ({ default: m.JoinUsSection })));
const ErrorPage = lazy(() => import('@/components/ErrorPage/ErrorPage').then(m => ({ default: m.ErrorPage })));
const WebGLAnimation = lazy(() => import('@/components/WebGLAnimation/WebGLAnimation').then(m => ({ default: m.WebGLAnimation })));
const MoreFaqPage = lazy(() => import('@/pages/MoreFaqPage'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const PartnersPage = lazy(() => import('@/pages/PartnersPage'));
const AdminApp = lazy(() => import('@/admin/AdminApp'));

/**
 * Main App component with routing and layout
 * Integrates all HARDWEY components and pages
 */
function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Use custom hooks for modal and smooth scroll
  const { isOpen: isMobileMenuOpen, open: openMobileMenu, close: closeMobileMenu } = useModal({
    closeOnEscape: true,
    preventBodyScroll: true,
  });
  

  // Initialize smooth scroll
  useSmoothScroll({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Simulate loading time for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleJoinUsClick = () => {
    // This is now handled by the Navigation component internally
  };

  const handleCloseMobileMenu = () => {
    closeMobileMenu();
  };

  if (isLoading) {
    return <LoadingScreen isLoading={isLoading} />;
  }

  return (
    <Router>
      <div className={styles.app}>
        {/* WebGL Animation Background */}
        {features.webglAnimation && (
          <div className={styles.webglBackground}>
            <Suspense fallback={null}>
              <WebGLAnimation />
            </Suspense>
          </div>
        )}

        {/* Navigation */}
        <Navigation 
          onJoinUsClick={handleJoinUsClick}
          onMenuClick={openMobileMenu}
        />

        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={isMobileMenuOpen}
          onClose={handleCloseMobileMenu}
          onJoinUsClick={handleJoinUsClick}
        />

        {/* Main Content */}
        <main className={styles.mainContent}>
          <Routes>
                {/* Home Page */}
                <Route path="/" element={
                  <>
                    <HeroSection />
                    <Suspense fallback={<div>Loading...</div>}>
                      <IntroSection />
                      <SharesSection />
                      <TickerAnimation />
                      <InvestmentIntroSection />
                      <NftDisclaimer />
                      <FaqSection />
                      <FredAgainSection />
                      <FoundersSection />
                      <JoinUsSection />
                    </Suspense>
                  </>
                } />

            {/* Admin Panel */}
            <Route path="/dfaqs" element={<AdminApp />} />

            {/* Static Pages */}
            <Route path="/more-faq" element={<MoreFaqPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/partners" element={<PartnersPage />} />

            {/* 404 Page */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>


        {/* Cookie Consent */}
        {features.cookieConsent && <CookieConsent />}
      </div>
    </Router>
  );
}

export default App;
