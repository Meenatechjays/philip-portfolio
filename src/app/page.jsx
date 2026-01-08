'use client';

import { useState } from 'react';
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
        <div className="relative snap-section">
          <About isVisible={!showSplash} />
          {/* <div className="absolute h-0 z-30 bottom-0 left-0 right-0 w-full pointer-events-none translate-y-1/2">
            <Image
              src="/rectangle.svg"
              alt="Section Connector"
              width={1832}
              height={217}
              className="w-full h-auto object-cover"
              priority
            />
          </div> */}
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


