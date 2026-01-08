'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

/**
 * SplashScreen Component
 * 
 * Displays a multi-language greeting animation on initial load
 * Cycles through greetings in different languages, then shows "SKY IS THE LIMIT"
 * with sky background before revealing the main content
 * 
 * @param {Object} props
 * @param {Function} props.onComplete - Callback fired when splash animation completes
 */
export default function SplashScreen({ onComplete }) {
  const [currentGreeting, setCurrentGreeting] = useState(0);
  const [showSkyPhase, setShowSkyPhase] = useState(false);
  const [isGreetingComplete, setIsGreetingComplete] = useState(false);
  const intervalRef = useRef(null);
  const hasStartedRef = useRef(false);

  // Multi-language greetings configuration
  const greetings = [
    "Hey",
    "Hello",      // English
    "Bonjour",    // French
    "Hallo",      // German
    "வணக்கம்",    // Tamil
    "Hola"        // Spanish
  ];

  useEffect(() => {
    // Prevent duplicate execution in React Strict Mode
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Cycle through greetings every 600ms (3.6s total for 6 greetings)
    intervalRef.current = setInterval(() => {
      setCurrentGreeting((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= greetings.length) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsGreetingComplete(true);
          return prev;
        }
        return nextIndex;
      });
    }, 600);

    // After greetings complete (3.6s for 6 greetings), wait 500ms, then show sky phase
    const skyPhaseTimeout = setTimeout(() => {
      setShowSkyPhase(true);
    }, 4100); // 3.6s greetings + 0.5s pause

    // Hide splash screen after sky phase displays (3s for sky phase to be visible)
    const loaderTimeout = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 7100); // 3.6s greetings + 0.5s pause + 3s sky phase

    // Cleanup intervals and timeouts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      clearTimeout(skyPhaseTimeout);
      clearTimeout(loaderTimeout);
      hasStartedRef.current = false;
    };
  }, [onComplete, greetings.length]);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      role="dialog"
      aria-label="Loading screen"
      aria-live="polite"
    >
      {/* Banner Blue Background - Always visible */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/Banner Blue.png"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </div>

      {/* Sky Background - Slides in from bottom (z-index: 5) */}
      <div 
        className={`absolute z-[5] transition-all duration-1500 ease-out ${
          showSkyPhase ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[100vh]'
        }`}
        style={{
          width: '110%',
          height: 'auto',
          maxHeight: '65vh',
          top: '30vh',
          left: '50%',
          transform: showSkyPhase 
            ? 'translateX(-50%) translateY(0)' 
            : 'translateX(-50%) translateY(100vh)'
        }}
      >
        <Image
          src="/Sky.png"
          alt="Sky Background"
          width={1758}
          height={921}
          className="w-full h-auto object-cover"
          priority
          quality={90}
        />
      </div>

      {/* Greeting Text Phase - Centered (z-index: 10) */}
      <div 
        className={`absolute inset-0 z-10 flex items-center justify-center px-4 transition-opacity duration-500 ${
          showSkyPhase ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <h1 
          className="text-center capitalize animate-fade-in splash-greeting-text font-sparkling-mellow"
          key={currentGreeting}
        >
          {greetings[currentGreeting]}
        </h1>
      </div>

      {/* "SKY IS THE LIMIT" Text Phase - Slides in from bottom ABOVE Sky.png (z-index: 10) */}
      <div 
        className={`absolute inset-0 z-10 flex items-center justify-center px-4 transition-all duration-1500 ease-out ${
          showSkyPhase ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[100vh]'
        }`}
      >
        <h1 className="text-center uppercase splash-sky-text text-4xl font-bold font-sparkling-mellow">
          Sky is the limit
        </h1>
      </div>
    </div>
  );
}

