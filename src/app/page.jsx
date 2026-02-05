'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import About from '../components/about/About';
import AboutRightContentMobile from '../components/about/AboutRightContentMobile';
import Timeline from '../components/timeLine/Timeline';
import Highlights from '../components/pressAndHighlights/Highlights';
import Investors from '../components/investors/Investors';
import AroundTheWorld from '../components/aroundTheWorld/AroundTheWorld';
import SplashScreen from '../components/ui/SplashScreen';
import Contact from '../components/contact/Contact';
export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  // Disable scroll-snap during initial load and re-enable only after fonts & images load
  // CRITICAL: Wait for main element transition (2000ms) to complete before enabling scroll-snap
  useEffect(() => {
    if (showSplash) return;

    // Wait for fonts, images, layout, AND main element transition to fully stabilize
    const enableScrollSnap = async () => {
      // Wait for fonts to load (CRITICAL - prevents layout shifts)
      await document.fonts.ready;
      
      // Wait for main element transition to complete (2000ms) + buffer
      // This prevents scroll-snap from calculating positions during the translate-y transition
      await new Promise(resolve => setTimeout(resolve, 2100));
      
      // Force reflow to ensure layout is calculated after transition
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

  // Lock body scroll during splash screen and main element transition
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
      // Keep scroll locked during main element transition (2000ms)
      // This prevents scroll offset during the translate-y transition
      const unlockScroll = setTimeout(() => {
        document.body.classList.remove('splash-active');
        document.documentElement.classList.remove('splash-active');
      }, 2000);

      return () => {
        clearTimeout(unlockScroll);
        document.body.classList.remove('splash-active');
        document.documentElement.classList.remove('splash-active');
      };
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
  // CRITICAL: Reset scroll after main element transition completes to prevent initial scroll offset
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
      });

      // Reset after main element transition completes (2000ms) to catch any scroll offset
      setTimeout(() => {
        forceReflow();
        resetScroll();
      }, 2000);

      // Reset again after scroll-snap is re-enabled (2100ms + buffer)
      setTimeout(() => {
        forceReflow();
        resetScroll();
      }, 2150); // After scroll-snap is re-enabled (2100ms + 50ms buffer)
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
          showSplash ? 'opacity-0 translate-y-0' : 'opacity-100 translate-y-0'
        }`}
      >
        <div id="about" className="snap-section">
          <About isVisible={!showSplash} />
        </div>
        {/* Mobile-only section for right content column (max-width: 768px) */}
        <div className="snap-section md:hidden">
          <AboutRightContentMobile isVisible={!showSplash} />
        </div>
        <div id="timeline" className="snap-section">
          <Timeline />
          {/* <TimelineTestPage /> */}
        </div>
        <div id="around-the-world" className="snap-section">
          <AroundTheWorld />
        </div>
        <div className="snap-section-auto">
          <Highlights/>
        </div>
        <div id="investors" className="snap-section">
          <Investors/>
        </div>
        <div id="contact" className="snap-section-start">
          <Contact />
        </div>
      </main>
      
    </>
  );
}


