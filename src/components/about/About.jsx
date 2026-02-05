'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortfolioHero({ isVisible = true }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLeftMounted, setIsLeftMounted] = useState(false);
  const [isRightMounted, setIsRightMounted] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [scrollHijackActive, setScrollHijackActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [animationDirection, setAnimationDirection] = useState(1); // 1 for down (next), -1 for up (previous)
  const sectionRef = useRef(null);
  const isScrolling = useRef(false);
  const scrollAccumulator = useRef(0);
  const scrollDirection = useRef(0); // Track scroll direction: 1 for down, -1 for up
  const lastSlideReachedAt = useRef(null); // Track when we reached the last slide

  const rightContentItems = [
    {
      title: 'Innovator',
      description:
        'Philip is known for combining strategic insight with hands on execution. He brings structure to creativity by using data, market sensing, AI and rapid prototyping. Whether it is a new digital product or a process overhaul, he builds innovation that is both ambitious and impactful.'
    },
    {
      title: 'Leader',
      description:
        'Philip leads with a combination of strategic discipline and human understanding. His leadership is defined by clear communication, and a focus on outcomes over noise. He empowers people to grow while keeping the organization aligned and resilient.'
    },
    {
      title: 'Investor',
      description:
        'As an investor, Philip focuses on early stage ideas that solve real world inefficiencies. He brings more than capital. He brings mentorship, strategic clarity, and operational rigor. His investment style is analytical yet empathetic. He backs people as much as ideas.'
    },
  ];

  const lastItemIndex = rightContentItems.length - 1;

  // Check if we're on mobile (max-width: 768px) - disable scroll hijacking on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Intersection Observer to detect when About section enters/leaves viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
          // Activate scroll hijacking only on desktop (not mobile) after right content is mounted and section is in view
          if (entry.isIntersecting && isRightMounted && !isMobile) {
            setScrollHijackActive(true);
          } else {
            setScrollHijackActive(false);
          }
        });
      },
      {
        threshold: 0.7,
        rootMargin: '0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isRightMounted, isMobile]);

  // Disable scroll-snap when scroll hijack is active (they should never coexist)
  // On mobile, always keep scroll-snap enabled since we don't hijack on first page
  useEffect(() => {
    if (sectionRef.current) {
      if (isMobile) {
        // Always enable scroll-snap on mobile (no hijacking on first page)
        sectionRef.current.style.scrollSnapAlign = 'start';
      } else if (scrollHijackActive) {
        sectionRef.current.style.scrollSnapAlign = 'none';
      } else {
        sectionRef.current.style.scrollSnapAlign = 'start';
      }
    }
  }, [scrollHijackActive, isMobile]);

  // Mount animation effects - triggered only when component becomes visible (after splash)
  useEffect(() => {
    if (!isVisible) return;

    // Show left content immediately after component becomes visible
    const leftMountTimer = setTimeout(() => {
      setIsLeftMounted(true);
    }, 100); // Small delay for smooth transition from splash

    // Show right content after 2000ms
    const rightMountTimer = setTimeout(() => {
      setIsRightMounted(true);
    }, 2000);

    return () => {
      clearTimeout(leftMountTimer);
      clearTimeout(rightMountTimer);
    };
  }, [isVisible, isInView]);

  // Track when we reach the last slide
  useEffect(() => {
    if (currentIndex === lastItemIndex) {
      lastSlideReachedAt.current = Date.now();
    } else {
      lastSlideReachedAt.current = null;
    }
  }, [currentIndex, lastItemIndex]);

  // Scroll hijacking - only hijack scroll within About section boundaries (disabled on mobile)
  useEffect(() => {
    // Disable scroll hijacking on mobile - it's handled by AboutRightContentMobile component
    if (isMobile || !isInView || !scrollHijackActive || !isRightMounted) return;

    const SCROLL_THRESHOLD = 50;
    const LAST_SLIDE_SCROLL_DELAY = 3500; // Delay in ms before allowing scroll to next page from last slide

    const moveToItem = (targetIndex) => {
      if (isScrolling.current) return;
      
      const clampedIndex = Math.max(0, Math.min(targetIndex, lastItemIndex));
      
      if (clampedIndex === currentIndex) {
        scrollAccumulator.current = 0;
        return;
      }
      
      const direction = clampedIndex > currentIndex ? 1 : -1;
      setAnimationDirection(direction);
      
      isScrolling.current = true;
      setCurrentIndex(clampedIndex);
      scrollAccumulator.current = 0;

      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    };

    const handleWheel = (e) => {
      // Don't hijack if section is not in view or not active
      if (!isInView || !scrollHijackActive) {
        return; // Let scroll-snap handle it
      }

      // Allow normal scroll when at boundaries (let scroll-snap work)
      const currentDirection = e.deltaY > 0 ? 1 : -1;
      if (currentIndex === 0 && currentDirection < 0) {
        return; // At first item scrolling up - allow scroll to previous section
      }
      if (currentIndex >= lastItemIndex && currentDirection > 0) {
        // At last item scrolling down - check if 500ms has passed since reaching last slide
        if (lastSlideReachedAt.current === null) {
          // Just reached last slide, start timer
          lastSlideReachedAt.current = Date.now();
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        
        const timeSinceLastSlide = Date.now() - lastSlideReachedAt.current;
        if (timeSinceLastSlide < LAST_SLIDE_SCROLL_DELAY) {
          // Still within 500ms window - prevent scroll to next page
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        // 500ms has passed - allow scroll to next section
        return;
      }

      // Prevent default only when actively hijacking (not at boundaries)
      if (isScrolling.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // Handle vertical scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if (scrollDirection.current !== 0 && scrollDirection.current !== currentDirection) {
          scrollAccumulator.current = 0;
        }
        
        scrollDirection.current = currentDirection;
        scrollAccumulator.current += Math.abs(e.deltaY);
        
        if (scrollAccumulator.current > SCROLL_THRESHOLD) {
          const targetIndex = currentDirection > 0 ? currentIndex + 1 : currentIndex - 1;
          moveToItem(targetIndex);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isMobile, isInView, scrollHijackActive, isRightMounted, currentIndex, lastItemIndex]);

  /* Animation variants - direction aware */
  const getContentVariants = (direction) => ({
    initial: { 
      y: direction > 0 ? '100vh' : '-100vh', 
      opacity: 0 
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 1, ease: 'easeInOut' }
    },
    exit: {
      y: direction > 0 ? '-100vh' : '100vh',
      opacity: 0,
      transition: { duration: 1, ease: 'easeInOut' }
    }
  });

  return (
    <div 
      ref={sectionRef} 
      className="h-[100dvh] relative overflow-hidden"
      style={{ scrollSnapAlign: (isMobile || !scrollHijackActive) ? 'start' : 'none' }}
    >
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0">
        <Image
          src="/Banner Blue.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute bottom-0 inset-x-0">
          <Image
            src="/Sky.png"
            alt="Sky"
            width={1920}
            height={600}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Font SVG Overlay */}
        <div className="absolute pointer-events-none z-[5] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/5">
          <div className="relative w-[90vw] max-w-[1350px] h-auto aspect-[1350/640]">
            <Image
              src="/font.svg"
              alt="Font Overlay"
              fill
              className="object-contain object-center"
              priority
              // style={{ opacity: 1, filter: 'contrast(5) brightness(2)' }}
            />
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Logo - Header Section */}
        <div className="pt-8 md:pt-12 lg:pt-8 px-4 sm:px-6 md:px-8 lg:px-[76px]">
          <div 
            className={`transition-all duration-700 ease-out ${
              isLeftMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <a
              href="/"
              className="inline-block text-2xl md:text-2xl font-bold text-[#1F2024] hover:opacity-80 transition-opacity"
            >
              Phil.in
            </a>
          </div>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-6 px-4 sm:px-6 md:px-8 lg:px-[76px] pb-8 md:pb-12 relative">
          {/* Left Content Column */}
          <div 
            className={`flex flex-col gap-4 md:order-1 relative translate-y-1/5 z-20 transition-all duration-700 ease-out delay-100 ${
              isLeftMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="font-satoshi font-semibold text-3xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1F2024] leading-tight">
              Hey Im <br />
              Philip Samuelraj
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#454654] leading-relaxed">
              At the crossroads of technology, AI, and human behavior, I focus on building 
            </p>
          </div>

          {/* Center Image Column - Placeholder for grid */}
          <div className="md:order-2 relative"></div>

          {/* Center Image - Absolutely positioned to not affect layout */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] pointer-events-none z-10"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
            }}
          >
            <div 
              className="transition-all duration-700 ease-out delay-200"
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
              }}
            >
              <div
                className="relative w-full overflow-hidden"
                style={{
                  height: 'clamp(401px, calc(50vw + 1px), 631px)',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  minHeight: '401px',
                  margin: 0,
                  padding: 0,
                  transform: 'translateZ(0) translateY(-1px)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  willChange: 'transform',
                }}
              >
                <Image
                  src="/header-img.svg"
                  alt="Philip Samuelraj"
                  width={815}
                  height={1500}
                  className="object-contain w-full h-full"
                  style={{
                    display: 'block',
                    background: 'transparent',
                    objectPosition: 'bottom center',
                    margin: 0,
                    padding: 0,
                    border: 'none',
                    outline: 'none',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    imageRendering: 'auto',
                    WebkitImageRendering: 'auto',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                  }}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right Content Column - Hidden on mobile (max-width: 768px), shown on md and up */}
          <div 
            className={`hidden md:flex flex-col gap-4 md:order-3 relative translate-y-1/5 z-20 transition-all duration-1000 ease-out ${
              isRightMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
            }`}
          >
            <div className="relative min-h-[120px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={getContentVariants(animationDirection)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0 flex flex-col gap-4"
                >
                  <h2 className="text-[clamp(1.4rem,2.2vw,1.9rem)] font-bold font-satoshi text-[#1F2024]">
                    {rightContentItems[currentIndex].title}
                  </h2>
                  <p className="text-[clamp(0.9rem,1.2vw,1rem)] text-[#454654] leading-relaxed">
                    {rightContentItems[currentIndex].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom blur and white overlay */}
      <div 
        className="absolute left-0 right-0 h-[50px] bg-transparent z-30 pointer-events-none"
        style={{
          // backdropFilter: 'blur(20px)',
          // WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 -20px 50px rgba(255, 255, 255, 0.5)',
        }}
      />
    </div>

  );
}
