'use client';

import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import DotLottie with SSR disabled to avoid CORS issues
const DotLottieReact = dynamic(
  () => import('@lottiefiles/dotlottie-react').then((mod) => mod.DotLottieReact),
  { 
    ssr: false,
    loading: () => <div className="w-full h-auto max-h-[400px] bg-gray-100 animate-pulse rounded" />
  }
);

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
// function SignalRipple() {
//   return (
//     <div className="relative flex items-center justify-center" style={{ width: '57px', height: '57px' }}>
//       {/* Ripple circles */}
//       <span className="absolute w-full h-full rounded-full bg-blue-400/[0.72] animate-ripple delay-0" />
//       <span className="absolute w-full h-full rounded-full bg-blue-400/[0.72] animate-ripple delay-700" />
//       <span className="absolute w-full h-full rounded-full bg-blue-400/[0.72] animate-ripple delay-1400" />

//       {/* Center dot */}
//       <span className="relative w-2 h-2 rounded-full bg-blue-600" />
//     </div>
//   );
// }

export default function World() {
  const componentRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const logoFinalRef = useRef(null);
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

      // Task 3: Logo appears only after map animation completes and Lottie is fully rendered
      // TEST: Show logo after 5 seconds for testing (change back to 300ms after testing)
      await new Promise(resolve => setTimeout(resolve, 5000));
      
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
        className="opacity-100 flex flex-col gap-2 md:gap-4 mt-4 md:mt-8 w-full md:w-[clamp(300px,38.8vw,671px)]"
      >
        <h2 className="heading-h2">
          Around the World with AI
        </h2>
        <p 
          className="font-satoshi font-normal text-base md:text-lg leading-normal tracking-[0%] opacity-100 text-[#454654] w-full"
        >
          Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non
        </p>
      </div>

      {/* Map Section Wrapper */}
      <div className="relative mt-4 md:mt-6 px-4 md:px-0 flex-shrink-0">
        {/* Map Container - Responsive with overflow hidden for scroll effect */}
        <div 
          ref={mapContainerRef}
          className="relative overflow-hidden max-w-full"
        >
          {/* Animated Map - Task 2: Scrolls right to left with fade */}
          <motion.div
            ref={mapRef}
            animate={hasAnimated ? mapScrollControls : {}}
            initial={{ x: '0%', opacity: 1 }}
            className="relative w-full"
            style={{ willChange: 'transform, opacity', maxWidth: '85%' }}
          >
            <DotLottieReact
              src="/World_map.lottie"
              loop
              autoplay
              className="w-full h-auto max-h-[400px] object-contain"
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
           {showFinalLogo && (
              <div className="absolute top-40 right-30 animate-logo-fade-in">
                <Image
                  src="/techjays-logo.svg"
                  alt="Techjays Logo"
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>
            )}

          {/* Location markers - 7 SignalRipple components positioned on the map */}
          {/* Only render after map reaches original position */}
          {/* {showFinalLogo && LOCATION_POSITIONS.map((position, index) => (
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
          ))} */}

          {/* Stats positioned on the map - Desktop only */}
          {showFinalLogo && (
            <div className="hidden md:flex flex-row items-center justify-center gap-3 z-20">
              <Stat value="7+" label="Countries" />
              <Stat value="150+" label="Projects" />
              <Stat value="170+" label="People" />
            </div>
          )}
        </div>

        {/* Task 3: Final logo position - appears only after map animation completes, to the right of map */}
        
          
        
      </div>

        {/* Bottom Section - Content only (Stats moved to map) */}
        <div className="relative mt-8 md:mt-12 mb-4 md:mb-8 px-4 md:px-0">
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
                
              </p>
            </div>
          </div>

          {/* Desktop Layout - Content only */}
          <div className="hidden md:flex justify-start">
            <div className="font-satoshi font-normal text-base lg:text-lg leading-relaxed text-[#454654] max-w-4xl space-y-4">
              <p>
                Founded in 2020 in Menlo Park, California, Techjays is on a bold mission to build the world's best AI products, apps, and solutions. With over 150 projects delivered across 7 countries, they've rapidly grown to serve 65+ clients spanning 15+ verticals in just a few years.
              </p>
              <p>
                Their team of 170+ professionals specializes in Gen AI, Web & Mobile development, Edge/Cloud Computing, AI Quality Engineering, and Digital Transformation. This expertise is backed by partnerships with industry leaders like Google Cloud, AWS, and IBM, along with ISO 27001 and 9001 certifications.
              </p>
              <p>
                At Techjays, they combine cutting-edge technical capabilities with deep industry knowledge to deliver solutions that drive real business impact. Their client-centric approach and commitment to excellence have established them as trusted partners for organizations looking to harness the power of AI and digital technologies in an increasingly competitive landscape.
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