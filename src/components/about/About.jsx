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
  const [aboutComplete, setAboutComplete] = useState(false);
  const sectionRef = useRef(null);
  const isScrolling = useRef(false);
  const scrollAccumulator = useRef(0);

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
    }
  ];

  const lastItemIndex = rightContentItems.length - 1;

  // Intersection Observer to detect when About section enters/leaves viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Activate scroll hijacking after right content is mounted
            if (isRightMounted) {
              setScrollHijackActive(true);
            }
          } else {
            setIsInView(false);
            setScrollHijackActive(false);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the component is visible
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
  }, [isRightMounted]);

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
      // Activate scroll hijacking after right content is mounted and section is in view
      if (isInView) {
        setScrollHijackActive(true);
      }
    }, 2000);

    return () => {
      clearTimeout(leftMountTimer);
      clearTimeout(rightMountTimer);
    };
  }, [isVisible, isInView]);

  // Lock body scroll when scroll hijacking is active
  useEffect(() => {
    if (scrollHijackActive && !aboutComplete && isInView) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [scrollHijackActive, aboutComplete, isInView]);

  // Scroll hijacking - scroll up to show next content item
  useEffect(() => {
    if (!isInView || !scrollHijackActive || aboutComplete) return;

    const SCROLL_THRESHOLD = 50;

    const moveToNextItem = (nextIndex) => {
      if (isScrolling.current) return;
      
      isScrolling.current = true;
      setCurrentIndex(nextIndex);
      scrollAccumulator.current = 0;

      // If we reached the last item (Investor), allow normal scrolling
      if (nextIndex >= lastItemIndex) {
        setTimeout(() => {
          setAboutComplete(true);
          setScrollHijackActive(false);
          isScrolling.current = false;
          // Restore body scroll
          document.body.style.overflow = '';
          document.body.style.height = '';
        }, 500);
      } else {
        setTimeout(() => {
          isScrolling.current = false;
        }, 500);
      }
    };

    const handleWheel = (e) => {
      // Allow normal scrolling if about section is complete
      if (aboutComplete) {
        return;
      }

      if (isScrolling.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Prevent default to lock scroll
      e.preventDefault();
      e.stopPropagation();

      // Handle vertical scroll - both up and down move to next item
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        // Accumulate scroll in any direction
        scrollAccumulator.current += Math.abs(e.deltaY);
        
        // Move to next item when threshold is reached (regardless of scroll direction)
        if (scrollAccumulator.current > SCROLL_THRESHOLD) {
          const nextIndex = Math.min(currentIndex + 1, lastItemIndex);
          if (nextIndex !== currentIndex) {
            moveToNextItem(nextIndex);
          } else {
            scrollAccumulator.current = 0;
          }
        }
      }
    };

    // Prevent touch scroll on mobile
    const handleTouchMove = (e) => {
      if (aboutComplete) {
        return;
      }
      e.preventDefault();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isInView, scrollHijackActive, aboutComplete, currentIndex, lastItemIndex]);

  /* ❗ Animation UNCHANGED */
  const contentVariants = {
    initial: { y: '100vh', opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 1, ease: 'easeInOut' }
    },
    exit: {
      y: '-100vh',
      opacity: 0,
      transition: { duration: 1, ease: 'easeInOut' }
    }
  };

  return (
    <div ref={sectionRef} className="h-screen relative overflow-hidden">
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
              style={{ opacity: 1, filter: 'contrast(5) brightness(2)' }}
            />
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Logo - Header Section */}
        <div className="pt-8 md:pt-12 lg:pt-16 px-4 sm:px-6 md:px-8 lg:px-[76px]">
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
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-6 px-4 sm:px-6 md:px-8 lg:px-[76px] pb-8 md:pb-12 relative overflow-hidden">
          {/* Left Content Column */}
          <div 
            className={`flex flex-col gap-4 md:order-1 relative translate-y-1/5 z-20 transition-all duration-700 ease-out delay-100 ${
              isLeftMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="font-sans font-semibold text-3xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1F2024] leading-tight">
              Hey Im <br />
              Philip Samuelraj
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#454654] leading-relaxed">
              At the crossroads of technology, AI, and human behavior, I focus on building 
            </p>
          </div>

          {/* Center Image Column - Placeholder for grid */}
          <div className="md:order-2 relative z-0"></div>

          {/* Center Image - Absolutely positioned to not affect layout */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-10 w-full max-w-[1000px] pointer-events-none">
            <div 
              className={`transition-all duration-700 ease-out delay-200
                // isLeftMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              `}
            >
              <div
                className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]"
                // style={{
                //   WebkitMaskImage:
                //     'linear-gradient(to bottom, black 75%, transparent 100%)',
                //   maskImage:
                //     'linear-gradient(to bottom, black 75%, transparent 100%)'
                // }}
              >
                <Image
                  src="/header-img.svg"
                  alt="Philip Samuelraj"
                  width={815}
                  height={1500}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right Content Column */}
          <div 
            className={`flex flex-col gap-4 md:order-3 relative translate-y-1/5 z-20 transition-all duration-1000 ease-out ${
              isRightMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
            }`}
          >
            <div className="relative min-h-[120px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0 flex flex-col gap-4"
                >
                  <h2 className="text-[clamp(1.4rem,2.2vw,1.9rem)] font-bold text-[#1F2024]">
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
    </div>

  );
}
