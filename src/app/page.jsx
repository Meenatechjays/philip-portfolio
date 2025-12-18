'use client';

import Image from 'next/image';
import { useState } from 'react';
import Image from 'next/image';
import About from '../components/about/About';
import Timeline from '../components/timeLine/Timeline';
import Highlights from '../components/pressAndHighlights/Highlights';
import Investors from '../components/investors/Investors';
import AroundTheWorld from '../components/aroundTheWorld/AroundTheWorld';
export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {/* Splash Screen - Shows and stays visible */}
      <SplashScreen onComplete={handleSplashComplete} />

      {/* Main Content - Hidden for now (don't show after splash) */}
      {/* Uncomment below when ready to show About section */}
      {/*
      <main 
        className={`relative transition-all duration-1000 ease-out ${
          showSplash ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="relative">
          <About />
          <div className="absolute bottom-0 left-0 right-0 w-full z-30 pointer-events-none translate-y-1/2">
            <Image
              src="/rectangle.svg"
              alt="Section Connector"
              width={1832}
              height={217}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
        <Timeline />
        <AroundTheWorld />
        <Highlights/>
        <Investors/>
        <Contact />
    </main>
      */}
    </>
  );
}


