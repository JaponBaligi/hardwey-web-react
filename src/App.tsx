/**
 * HARDWEY Music Group - Main App Component
 * React + TypeScript application for music investment platform
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/Navigation/Navigation';
import { MobileMenu } from '@/components/MobileMenu/MobileMenu';
import { LoadingScreen } from '@/components/LoadingScreen/LoadingScreen';
import { HeroSection } from '@/components/HeroSection/HeroSection';
import { IntroSection } from '@/components/IntroSection/IntroSection';
import { SharesSection } from '@/components/SharesSection/SharesSection';
import { TickerAnimation } from '@/components/TickerAnimation/TickerAnimation';
import { InvestmentIntroSection } from '@/components/InvestmentIntroSection/InvestmentIntroSection';
import { NftDisclaimer } from '@/components/NftDisclaimer/NftDisclaimer';
import { FaqSection } from '@/components/FaqSection/FaqSection';
import { PlaylistContainer } from '@/components/PlaylistContainer/PlaylistContainer';
import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import { FoundersSection } from '@/components/FoundersSection/FoundersSection';
import { ErrorPage } from '@/components/ErrorPage/ErrorPage';
import { WebGLAnimation } from '@/components/WebGLAnimation/WebGLAnimation';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useModal } from '@/hooks/useModal';
import { features } from '@/utils/env';
import MoreFaqPage from '@/pages/MoreFaqPage';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import styles from './App.module.css';

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
    console.log('Join Us clicked');
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
            <WebGLAnimation />
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
                    <IntroSection />
                    <SharesSection />
                    <TickerAnimation />
                    <InvestmentIntroSection />
                    <NftDisclaimer />
                    <FaqSection />
                    <PlaylistContainer />
                    <FoundersSection />
                  </>
                } />

            {/* Static Pages */}
            <Route path="/more-faq" element={<MoreFaqPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />

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
