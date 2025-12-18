'use client';

import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Animation constants
const ANIMATION_DURATION = 3; // seconds for scroll animations
const FADE_DURATION = 0.8; // seconds for fade transitions

// Location marker positions - initially placed in orderly fashion (will be positioned later)
const LOCATION_POSITIONS = [
  { top: '100px', left: '100px' }, // Position 1
  { top: '100px', left: '300px' }, // Position 2
  { top: '100px', left: '500px' }, // Position 3
  { top: '300px', left: '200px' }, // Position 4
  { top: '300px', left: '400px' }, // Position 5
  { top: '500px', left: '300px' }, // Position 6
  { top: '500px', left: '500px' }, // Position 7
];

// SignalRipple component
function SignalRipple() {
  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      {/* Ripple circles */}
      <span className="absolute w-full h-full rounded-full bg-blue-400/30 animate-ripple delay-0" />
      <span className="absolute w-full h-full rounded-full bg-blue-400/30 animate-ripple delay-700" />
      <span className="absolute w-full h-full rounded-full bg-blue-400/30 animate-ripple delay-1400" />

      {/* Center dot */}
      <span className="relative w-6 h-6 rounded-full bg-blue-600" />
    </div>
  );
}

export default function World() {
  const componentRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const logoScrollControls = useAnimation();
  const mapScrollControls = useAnimation();
  const logoFinalControls = useAnimation();
  const [showFinalLogo, setShowFinalLogo] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const startAnimations = async () => {
      // Wait a bit before starting animations
      await new Promise(resolve => setTimeout(resolve, 500));

      // Calculate the width of the map container for logo positioning
      const mapContainer = mapContainerRef.current;
      if (!mapContainer) return;

      const containerWidth = mapContainer.offsetWidth;
      const logoWidth = 91; // Logo width in pixels

      // Start both animations in parallel
      await Promise.all([
        // Task 1: Logo scrolls from left to right across center of map and disappears
        logoScrollControls.start({
          x: [`-${logoWidth}px`, `${containerWidth + logoWidth}px`],
          opacity: [1, 1, 0],
          transition: {
            duration: ANIMATION_DURATION,
            ease: 'linear',
            opacity: {
              times: [0, 0.85, 1],
              duration: ANIMATION_DURATION,
            },
          },
        }),
        // Task 2: Map scrolls from right to left (marquee style) and returns to original position
        mapScrollControls.start({
          x: ['100%', '0%'],
          opacity: [0, 1, 1, 1],
          transition: {
            duration: ANIMATION_DURATION + FADE_DURATION * 2,
            ease: 'linear',
            opacity: {
              times: [0, 0.2, 0.8, 1],
              duration: ANIMATION_DURATION + FADE_DURATION * 2,
            },
          },
        }),
      ]);

      // Task 3: Logo appears only after map reaches its original position (0%)
      // Wait a bit to ensure map is fully in position
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setShowFinalLogo(true);
      logoFinalControls.start({
        opacity: [0, 1],
        scale: [0.8, 1],
        transition: {
          duration: 0.8,
          ease: 'easeOut',
        },
      });
    };

    // Intersection Observer to detect when component enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            startAnimations();
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of component is visible
        rootMargin: '0px',
      }
    );

    const currentRef = componentRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [logoScrollControls, mapScrollControls, logoFinalControls, hasAnimated]);

  return (
    <div ref={componentRef} className="relative w-full flex flex-col">
      {/* Header Section - Responsive */}
      <div 
        className="opacity-100 flex flex-col gap-2 md:gap-4 ml-4 md:ml-[4.6vw] mt-4 md:mt-8 w-full md:w-[clamp(300px,38.8vw,671px)]"
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-satoshi font-bold text-[#1F2024]">
          Around the World with AI
        </h1>
        <p 
          className="font-satoshi font-normal text-base md:text-lg leading-normal tracking-[0%] opacity-100 text-[#454654] w-full"
        >
          Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non
        </p>
      </div>

      {/* Map Section Wrapper */}
      <div className="relative mt-4 md:mt-8 px-4 md:px-0 flex-shrink-0">
        {/* Map Container - Responsive with overflow hidden for scroll effect */}
        <div 
          ref={mapContainerRef}
          className="relative overflow-hidden"
        >
          {/* Animated Map - Task 2: Scrolls right to left with fade */}
          <motion.div
            ref={mapRef}
            animate={hasAnimated ? mapScrollControls : {}}
            initial={{ x: '0%', opacity: 1 }}
            className="relative w-full"
            style={{ willChange: 'transform, opacity' }}
          >
            <img
              src="/map.svg"
              alt="World map"
              className="w-full max-w-full h-auto"
            />
          </motion.div>

          {/* Task 1: Logo scrolling across center of map (vertically centered on map) */}
          {!showFinalLogo && hasAnimated && (
            <motion.div
              animate={logoScrollControls}
              initial={{ x: 0, opacity: 1 }}
              className="absolute z-20 pointer-events-none"
              style={{
                width: '91px',
                height: '83px',
                top: '50%',
                left: 0,
                transform: 'translateY(-50%)',
              }}
            >
              <Image
                src="/techjays-logo.svg"
                alt="Techjays Logo"
                width={91}
                height={83}
                className="object-contain w-full h-full"
              />
            </motion.div>
          )}

          {/* Location markers - 7 SignalRipple components positioned on the map */}
          {/* Only render after map reaches original position */}
          {showFinalLogo && LOCATION_POSITIONS.map((position, index) => (
            <div
              key={index}
              className="absolute z-10 pointer-events-none"
              style={{
                top: position.top,
                left: position.left,
              }}
            >
              <SignalRipple />
            </div>
          ))}
        </div>

        {/* Task 3: Final logo position - appears only after map reaches original position, to the right of map */}
        {showFinalLogo && (
          <motion.div
            animate={logoFinalControls}
            initial={{ opacity: 0, scale: 0.8 }}
            className="absolute z-20 hidden md:block"
            style={{
              width: 'clamp(60px, 8.7vh, 89px)',
              height: 'clamp(60px, 8.7vh, 89px)',
              top: '50%',
              left: 'calc(100% + clamp(16px, 2vw, 48px))',
              transform: 'translateY(-50%)',
            }}
          >
            <Image
              src="/techjays-logo.svg"
              alt="Techjays Logo"
              width={91}
              height={83}
              className="object-contain w-full h-full"
            />
          </motion.div>
        )}
      </div>

        {/* Bottom Section - Stats and Content */}
        <div className="relative mt-6 md:mt-8 mb-4 md:mb-8 flex-1 min-h-0 px-4 md:px-0">
          {/* Mobile: Stack vertically */}
          <div className="md:hidden flex flex-col gap-4">
            {/* Mobile Logo */}
            <div className="flex items-center justify-start h-[80px]">
              <Image
                src="/techjays-logo.svg"
                alt="Techjays Logo"
                width={91}
                height={83}
                className="object-contain w-auto h-full"
              />
            </div>
            
            {/* Mobile Stats */}
            <div className="flex flex-row items-center gap-2 flex-wrap justify-start">
              <Stat value="7+" label="Countries" />
              <Stat value="150+" label="Projects" />
              <Stat value="170+" label="People" />
            </div>
            
            {/* Mobile Content */}
            <div className="flex flex-col items-start mt-4">
              <p className="font-satoshi font-normal text-sm text-[#454654] w-full">
                Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl.
                Non risus semper vel est amet leo non Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl.
                Non risus semper vel est amet leo non Lorem ipsum dolor sit amet consectetur.
              </p>
            </div>
          </div>

          {/* Desktop Layout - Absolute positioning */}
          <div className="hidden md:block relative min-h-[300px]">
            {/* Logo - Bottom Left (only shown after animations on mobile, hidden on desktop as it's animated) */}
            <div 
              className="absolute bottom-0 left-0 lg:left-[1.2vw] flex items-center h-[clamp(60px,8.7vh,89px)] z-10 opacity-0 pointer-events-none"
            >
              <Image
                src="/techjays-logo.svg"
                alt="Techjays Logo"
                width={91}
                height={83}
                className="object-contain w-auto h-full"
              />
            </div>
            
            {/* Stats Container - Bottom Right */}
            <div 
              className="absolute bottom-0 right-4 lg:right-[16.6vw] flex flex-row items-center gap-3 z-10"
              style={{ 
                maxWidth: 'clamp(350px, 35vw, 500px)',
                minHeight: 'clamp(70px, 8.7vh, 89px)'
              }}
            >
              <Stat value="7+" label="Countries" />
              <Stat value="150+" label="Projects" />
              <Stat value="170+" label="People" />
            </div>
      
            {/* Content - Bottom Left, above stats */}
            <div 
              className="absolute left-[4.6vw] flex flex-col items-start z-0"
              style={{
          
                width: 'clamp(400px, 50vw, 800px)'
              }}
            >
              <p 
                className="font-satoshi font-normal text-base lg:text-lg leading-normal tracking-[0%] opacity-100 text-[#454654] w-full"
              >
                Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl.
                Non risus semper vel est amet leo non Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl.
                Non risus semper vel est amet leo non Lorem ipsum dolor sit amet consectetur.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  function Stat({ value, label }) {
    return (
      <div 
        className="flex flex-col items-start bg-[#F2F6FC] rounded-[9px] flex-none p-[clamp(8px,1.2vh,12px)] w-[clamp(85px,9vw,155.25px)] min-w-[85px] max-w-[155.25px] min-h-[70px] h-[clamp(70px,8.7vh,89px)] gap-[clamp(4px,0.8vh,8px)]"
      >
        <div className="text-lg md:text-xl lg:text-2xl font-bold text-[#1F2024] leading-tight">
          {value}
        </div>
        <div className="text-xs md:text-sm text-[#454654] leading-tight">
          {label}
        </div>
      </div>
    );
  }