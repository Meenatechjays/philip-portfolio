'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import About from '../components/about/About';
import Timeline from '../components/timeLine/Timeline';
import Highlights from '../components/pressAndHighlights/Highlights';
import Investors from '../components/investors/Investors';
import AroundTheWorld from '../components/aroundTheWorld/AroundTheWorld';
import SplashScreen from '../components/ui/SplashScreen';
import Contact from '../components/contact/Contact';
export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  // Disable scroll-snap during initial load and re-enable only after fonts & images load
  useEffect(() => {
    if (showSplash) return;

    // Wait for fonts, images, and layout to fully stabilize before enabling scroll-snap
    const enableScrollSnap = async () => {
      // Wait for fonts to load (CRITICAL - prevents layout shifts)
      await document.fonts.ready;
      
      // Allow motion/layout to settle
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Force reflow to ensure layout is calculated
      void document.body.offsetHeight;
      void document.documentElement.offsetHeight;
      
      // Ensure scroll is at 0 before enabling scroll-snap
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Re-enable scroll-snap
      document.body.classList.remove('scroll-snap-disabled');
      document.documentElement.classList.remove('scroll-snap-disabled');
      
      // Final scroll reset after scroll-snap is enabled
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    };

    enableScrollSnap();
  }, [showSplash]);

  // Lock body scroll during splash screen
  useEffect(() => {
    if (showSplash) {
      // Prevent scrolling during splash
      document.body.classList.add('splash-active');
      document.documentElement.classList.add('splash-active');
      // Ensure scroll is at 0
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      // Re-enable scrolling after splash
      document.body.classList.remove('splash-active');
      document.documentElement.classList.remove('splash-active');
    }

    return () => {
      document.body.classList.remove('splash-active');
      document.documentElement.classList.remove('splash-active');
    };
  }, [showSplash]);

  // Ensure scroll position is at 0 on initial load
  useEffect(() => {
    // Immediately set scroll to 0
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Reset scroll to 0 when splash screen is hidden and force layout recalculation
  useEffect(() => {
    if (!showSplash) {
      // Force a layout recalculation by reading layout properties
      const forceReflow = () => {
        // Trigger reflow by reading layout properties
        void document.body.offsetHeight;
        void document.documentElement.offsetHeight;
      };

      // Use multiple methods to ensure scroll is reset
      const resetScroll = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        // Also reset scrollTop on window
        if (window.scrollY !== 0) {
          window.scrollTo(0, 0);
        }
      };

      // Force reflow first
      forceReflow();
      
      // Reset immediately
      resetScroll();

      // Reset after a frame to catch any layout shifts
      requestAnimationFrame(() => {
        forceReflow();
        resetScroll();
        // Reset again after a small delay to catch scroll-snap adjustments
        setTimeout(() => {
          forceReflow();
          resetScroll();
        }, 50);
        // One more reset after scroll-snap is re-enabled
        setTimeout(() => {
          forceReflow();
          resetScroll();
        }, 250); // After scroll-snap is re-enabled (100ms + 150ms buffer)
      });
    }
  }, [showSplash]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {/* Splash Screen - Shows on initial load */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Main Content - Slides up slowly after splash screen */}
      <main 
        className={`relative transition-all duration-[2000ms] ease-out ${
          showSplash ? 'opacity-0 translate-y-16' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="snap-section">
          <About isVisible={!showSplash} />
        </div>
        <div className="snap-section">
          <Timeline />
        </div>
        <div className="snap-section">
          <AroundTheWorld />
        </div>
        <div className="snap-section">
          <Highlights/>
        </div>
        <div className="snap-section">
          <Investors/>
        </div>
        <div className="snap-section-start">
          <Contact />
        </div>
      </main>
      
    </>
  );
}


