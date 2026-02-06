'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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

export default function AboutRightContentMobile({ isVisible = true }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [scrollHijackActive, setScrollHijackActive] = useState(false);
  const [animationDirection, setAnimationDirection] = useState(1);
  const sectionRef = useRef(null);
  const isScrolling = useRef(false);
  const scrollAccumulator = useRef(0);
  const scrollDirection = useRef(0);
  const lastSlideReachedAt = useRef(null);

  const lastItemIndex = rightContentItems.length - 1;

  // Intersection Observer to detect when section enters/leaves viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
          if (entry.isIntersecting && isMounted) {
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
  }, [isMounted]);

  // Disable scroll-snap when scroll hijack is active
  useEffect(() => {
    if (sectionRef.current) {
      if (scrollHijackActive) {
        sectionRef.current.style.scrollSnapAlign = 'none';
      } else {
        sectionRef.current.style.scrollSnapAlign = 'start';
      }
    }
  }, [scrollHijackActive]);

  // Mount animation - triggered when component becomes visible
  useEffect(() => {
    if (!isVisible) return;

    const mountTimer = setTimeout(() => {
      setIsMounted(true);
    }, 100);

    return () => {
      clearTimeout(mountTimer);
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

  // Scroll hijacking - same logic as About section
  useEffect(() => {
    if (!isInView || !scrollHijackActive || !isMounted) return;

    const SCROLL_THRESHOLD = 50;
    const LAST_SLIDE_SCROLL_DELAY = 3500;

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
      if (!isInView || !scrollHijackActive) {
        return;
      }

      const currentDirection = e.deltaY > 0 ? 1 : -1;
      if (currentIndex === 0 && currentDirection < 0) {
        return;
      }
      if (currentIndex >= lastItemIndex && currentDirection > 0) {
        if (lastSlideReachedAt.current === null) {
          lastSlideReachedAt.current = Date.now();
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        
        const timeSinceLastSlide = Date.now() - lastSlideReachedAt.current;
        if (timeSinceLastSlide < LAST_SLIDE_SCROLL_DELAY) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        return;
      }

      if (isScrolling.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      e.preventDefault();
      e.stopPropagation();

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
  }, [isInView, scrollHijackActive, isMounted, currentIndex, lastItemIndex]);

  // Touch-based scroll hijacking for real mobile devices
  useEffect(() => {
    if (!isInView || !scrollHijackActive || !isMounted) return;

    const TOUCH_THRESHOLD = 50;
    const LAST_SLIDE_SCROLL_DELAY = 3500;
    let touchStartY = null;
    let touchHandled = false;
    let released = false;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchHandled = false;
      released = false;
    };

    const handleTouchMove = (e) => {
      if (touchStartY === null || released) return;

      const deltaY = touchStartY - e.touches[0].clientY; // positive = swipe up (scroll down)
      const absDelta = Math.abs(deltaY);

      // Need at least a small movement to detect direction reliably
      if (absDelta < 5) return;

      const direction = deltaY > 0 ? 1 : -1;

      // Check boundaries EARLY (before threshold) to decide: hijack or release
      // At first slide swiping down - release to let browser scroll to previous section
      if (currentIndex === 0 && direction < 0) {
        released = true;
        return;
      }

      // At last slide swiping up - release if delay has passed
      if (currentIndex >= lastItemIndex && direction > 0) {
        if (lastSlideReachedAt.current && (Date.now() - lastSlideReachedAt.current >= LAST_SLIDE_SCROLL_DELAY)) {
          released = true;
          return;
        }
      }

      // NOT at a releasing boundary - prevent browser scroll immediately
      // This must happen before threshold to stop the browser from starting native scroll
      e.preventDefault();

      // Already changed slide for this gesture
      if (touchHandled) return;

      // Wait for full threshold before changing slide
      if (absDelta < TOUCH_THRESHOLD) return;

      touchHandled = true;

      if (isScrolling.current) return;

      setAnimationDirection(direction);
      isScrolling.current = true;
      setCurrentIndex(Math.max(0, Math.min(currentIndex + direction, lastItemIndex)));

      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    };

    const handleTouchEnd = () => {
      touchStartY = null;
      touchHandled = false;
      released = false;
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('touchstart', handleTouchStart, { passive: true });
      section.addEventListener('touchmove', handleTouchMove, { passive: false });
      section.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (section) {
        section.removeEventListener('touchstart', handleTouchStart);
        section.removeEventListener('touchmove', handleTouchMove);
        section.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isInView, scrollHijackActive, isMounted, currentIndex, lastItemIndex]);

  // Animation variants - direction aware
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
      className="md:hidden h-[100dvh] relative overflow-hidden"
      style={{ scrollSnapAlign: scrollHijackActive ? 'none' : 'start' }}
    >
      {/* Background - Same as About section */}
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
            />
          </div>
        </div>
      </div>

      {/* Main Content - Centered Right Content Column */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Centered Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-8">
          <div 
            className={`w-full max-w-md transition-all duration-1000 ease-out ${
              isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
            }`}
          >
            <div className="relative min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={getContentVariants(animationDirection)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0 flex flex-col gap-4"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold font-satoshi text-[#1F2024] text-center">
                    {rightContentItems[currentIndex].title}
                  </h2>
                  <p className="text-base sm:text-lg text-[#454654] leading-relaxed text-center">
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
          boxShadow: '0 -20px 50px rgba(255, 255, 255, 0.5)',
        }}
      />
    </div>
  );
}

