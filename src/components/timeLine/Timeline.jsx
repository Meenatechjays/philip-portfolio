'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import TimeLineCard from '../ui/TimeLineCard';

// Timeline constants for pre-scroll animation (2000 → 2014)
const PRE_SCROLL_START_YEAR = 2000;
const PRE_SCROLL_END_YEAR = 2014;
const TOTAL_YEARS = PRE_SCROLL_END_YEAR - PRE_SCROLL_START_YEAR + 1; // 15 years (2000-2014)
// Calculate exact width for 15 years - divide space equally
const PRE_SCROLL_TIMELINE_WIDTH = 3000; // Exact width for 15 years timeline
const YEAR_WIDTH = PRE_SCROLL_TIMELINE_WIDTH / (TOTAL_YEARS - 1); // Equal spacing between years
const PRE_SCROLL_DISTANCE = PRE_SCROLL_TIMELINE_WIDTH;

export default function Timeline() {
  const scrollContainerRef = useRef(null);
  const innerContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const timelineControls = useAnimation();
  const [introDone, setIntroDone] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnimationSkipped, setIsAnimationSkipped] = useState(false);
  const [scrollHijackActive, setScrollHijackActive] = useState(false);
  const [timelineComplete, setTimelineComplete] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const hasShownInitialPaddingRef = useRef(false);
  const isSnapping = useRef(false);
  const hasStartedAnimationRef = useRef(false);
  const isScrollingRef = useRef(false);
  const lastScrollTime = useRef(0);
  const carouselScrollThrottle = useRef(0);
  const wheelLockRef = useRef(false); // Prevent multiple card jumps per wheel gesture
  const wasInViewRef = useRef(false); // Track previous view state for reset logic
  const lastCardReachedAt = useRef(null); // Track when we reached the last card

  // Dynamic timeline cards data - easily add more cards in the future
  const timelineCards = [
    {
      imageSrc: '/philip-footer-img.png',
      imageAlt: 'Timeline event 2015',
      title: 'Early Beginnings',
      description: 'The foundation of my journey in technology and cybersecurity began with innovative approaches to digital security challenges.',
      year: '2015',
      position: { left: '200px', top: '0px' }
    },
    {
      imageSrc: '/time-line-2016.jpg',
      imageAlt: 'Timeline event 2016',
      title: 'Growth Phase',
      description: 'Expanding cutting-edge security solutions and establishing key partnerships in the technology sector.',
      year: '2016',
      position: { left: '1700px', top: '0px' }
    },
    {
      imageSrc: '/timeLine-2017.jpg',
      imageAlt: 'Timeline event 2017',
      title: 'Innovation Phase',
      description: 'Pioneering new methods and tools in cybersecurity and establishing key partnerships in the technology sector.',
      year: '2017',
      position: { left: '3200px', top: '0px' }
    },
    {
      imageSrc: '/time-line-2018.jpg',
      imageAlt: 'Timeline event 2018',
      title: 'Expansion Phase',
      description: 'Scaling operations and reaching new milestones in technology and cybersecurity innovation.',
      year: '2018',
      position: { left: '4700px', top: '0px' }
    }
  ];

  // Responsive card width - matches TimeLineCard component widths
  const getCardWidth = () => {
    if (typeof window === 'undefined') return 810;
    const width = window.innerWidth;
    if (width < 640) return 350; // Mobile: max-w-[350px]
    if (width < 768) return 500; // Tablet: max-w-[500px]
    if (width < 1024) return 750; // Small desktop: md:w-[750px]
    return 810; // Desktop: lg:w-[810px]
  };
  
  const [cardWidth, setCardWidth] = useState(getCardWidth());
  
  // Update card width on resize
  useEffect(() => {
    const handleResize = () => {
      setCardWidth(getCardWidth());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const paddingBeforeFirstCard = 2000; // Add space before first card for more lines
  const paddingAfterLastCard = 2000; // Extra padding after last card for more timeline lines
  const TIMELINE_LINE_START = 600; // Timeline line starts at 600px (changed from 2000px)
  const cardPositions = timelineCards.map(card => parseInt(card.position.left) + paddingBeforeFirstCard);
  const firstCardPosition = cardPositions[0];
  const lastCardIndex = timelineCards.length - 1;
  const lastCardPosition = cardPositions[lastCardIndex];
  const timelineStart = 2000; // Start timeline from 0
  const timelineEnd = lastCardPosition + cardWidth + paddingAfterLastCard;
  // Since timeline line starts at 600px instead of 2000px (paddingBeforeFirstCard), 
  // reduce total width by the difference to eliminate extra scroll
  const widthReduction = paddingBeforeFirstCard - TIMELINE_LINE_START; // 2000 - 600 = 1400
  const totalTimelineWidth = timelineEnd - widthReduction;
  // Timeline line SVG width: since line starts at TIMELINE_LINE_START (600px), width should match container
  const timelineLineWidth = totalTimelineWidth;

  // Helper function to get exact scroll position for a card index
  const getCardScrollPosition = useCallback((index) => {
    if (!scrollContainerRef.current) return 0;
    const scrollContainer = scrollContainerRef.current;
    const containerWidth = scrollContainer.clientWidth;
    const cardLeft = cardPositions[index];
    return Math.max(0, cardLeft - (containerWidth / 2) + (cardWidth / 2));
  }, [cardPositions, cardWidth]);

  const lockWheel = useCallback((duration = 500) => {
    wheelLockRef.current = true;
    setTimeout(() => {
      wheelLockRef.current = false;
    }, duration);
  }, []);

  // Strict snap function - forces scroll to exact card position
  const snapToCard = useCallback((targetIndex, instant = false) => {
    if (!scrollContainerRef.current || isSnapping.current) return;
    
    isSnapping.current = true;
    const targetPosition = getCardScrollPosition(targetIndex);
    const scrollContainer = scrollContainerRef.current;
    
    scrollContainer.scrollTo({
      left: targetPosition,
      behavior: instant ? 'auto' : 'smooth'
    });
    
    setCurrentCardIndex(targetIndex);
    
    // Allow next snap after animation completes
    setTimeout(() => {
      isSnapping.current = false;
    }, instant ? 50 : 500);
  }, [getCardScrollPosition]);

  // Skip animation and allow vertical scrolling
  const skipAnimation = useCallback(() => {
    setTimelineComplete(true);
    setScrollHijackActive(false);
    setIsAnimationSkipped(true);
    snapToCard(lastCardIndex, false);
  }, [snapToCard, lastCardIndex]);

  // Intersection Observer to detect when Timeline component enters/leaves viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isNowInView = entry.isIntersecting && entry.intersectionRatio >= 0.8;
          const wasInView = wasInViewRef.current;

          // When entering viewport
          if (isNowInView && !wasInView && !hasStartedAnimationRef.current) {
            setTimeout(() => {
              setIsInView(true);
            }, 100);
          } 
          // When leaving viewport - reset state for next entry
          else if (!isNowInView && wasInView) {
            setIsInView(false);
            // Reset all state when leaving viewport
            hasStartedAnimationRef.current = false;
            setIntroDone(false);
            setCurrentCardIndex(0);
            setIsAnimationSkipped(false);
            setScrollHijackActive(false);
            setTimelineComplete(false);
            hasShownInitialPaddingRef.current = false;
            isSnapping.current = false;
            isScrollingRef.current = false;
            lastCardReachedAt.current = null;
            
            // Reset scroll position
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollLeft = 0;
            }
          }

          wasInViewRef.current = isNowInView;
        });
      },
      {
        threshold: [0, 0.3, 0.5, 0.8, 1.0],
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
  }, []);

  // Set initial position before component enters viewport
  useEffect(() => {
    if (!isInView && !hasStartedAnimationRef.current) {
      const startX = typeof window !== 'undefined' ? window.innerWidth : 1920;
      timelineControls.set({ x: startX });
    }
  }, [isInView, timelineControls]);

  // Phase 1: Fast intro auto-scroll animation (2000 → 2014)
  // Only starts when component enters viewport
  useEffect(() => {
    if (!isInView || hasStartedAnimationRef.current) return;

    async function runIntro() {
      hasStartedAnimationRef.current = true;
      
      // Start timeline off-screen to the right, then animate to left
      const startX = typeof window !== 'undefined' ? window.innerWidth : 1920;
      
      // Set initial position off-screen to the right
      await timelineControls.set({ x: startX });
      
      // Fast animation from right to left (3 seconds instead of 6)
      await timelineControls.start({
        x: -PRE_SCROLL_DISTANCE,
        transition: {
          duration: 3,
          ease: 'linear'
        }
      });

      setIntroDone(true);
      hasShownInitialPaddingRef.current = true;
      setScrollHijackActive(true);
      
      // Center on first card after intro
      setTimeout(() => {
        snapToCard(0, false);
      }, 100);
    }

    runIntro();
  }, [isInView, timelineControls, snapToCard]);

  // Update scroll position based on currentCardIndex - enforces strict snapping
  useEffect(() => {
    if (!scrollContainerRef.current || isSnapping.current) return;
    
    // During scroll hijacking phase, update smoothly
    if (scrollHijackActive && !timelineComplete) {
      const targetPosition = getCardScrollPosition(currentCardIndex);
      scrollContainerRef.current.scrollTo({
        left: targetPosition,
        behavior: 'smooth'
      });
    }
    // After timeline complete, always snap instantly
    else if (timelineComplete) {
      const targetPosition = getCardScrollPosition(currentCardIndex);
      scrollContainerRef.current.scrollTo({
        left: targetPosition,
        behavior: 'auto'
      });
    }
  }, [currentCardIndex, scrollHijackActive, timelineComplete, cardPositions, cardWidth]);

  // Prevent manual scrolling that could cause intermediate positions (only when timelineComplete)
  useEffect(() => {
    if (!isInView || !scrollContainerRef.current || !timelineComplete) return;

    const scrollContainer = scrollContainerRef.current;
    let snapTimeout;
    
    const handleScroll = () => {
      // Skip if we're already snapping (programmatic scroll)
      if (isSnapping.current) return;
      
      // Debounce snap detection
      clearTimeout(snapTimeout);
      snapTimeout = setTimeout(() => {
        // Immediately snap to nearest card if scrolled manually
        const containerWidth = scrollContainer.clientWidth;
        const scrollLeft = scrollContainer.scrollLeft;
        const centerPosition = scrollLeft + (containerWidth / 2);

        let closestCardIndex = 0;
        let minDistance = Infinity;

        cardPositions.forEach((cardLeft, index) => {
          const cardCenter = cardLeft + (cardWidth / 2);
          const distance = Math.abs(centerPosition - cardCenter);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestCardIndex = index;
          }
        });

        // If not on the closest card, snap to it
        if (closestCardIndex !== currentCardIndex && minDistance > 100) {
          snapToCard(closestCardIndex, true);
        }
      }, 100);
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(snapTimeout);
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [isInView, timelineComplete, currentCardIndex, cardPositions, cardWidth, snapToCard]);

  // Track when we reach the last card
  useEffect(() => {
    if (currentCardIndex === lastCardIndex) {
      lastCardReachedAt.current = Date.now();
    } else {
      lastCardReachedAt.current = null;
    }
  }, [currentCardIndex, lastCardIndex]);

  // Scroll hijacking - only hijack scroll within Timeline section boundaries (before timelineComplete)
  useEffect(() => {
    if (!isInView || !scrollHijackActive || timelineComplete) return;

    const LAST_CARD_SCROLL_DELAY = 3000; // Delay in ms before allowing scroll to next page from last card

    const handleWheel = (e) => {
      if (!isInView || !scrollHijackActive) {
        return;
      }

      if (wheelLockRef.current) {
        e.preventDefault();
        return;
      }

      // Allow normal scroll when at boundaries
      if (currentCardIndex >= lastCardIndex && e.deltaY > 0) {
        // At last card scrolling down - check if 1000ms has passed since reaching last card
        if (lastCardReachedAt.current === null) {
          // Just reached last card, start timer
          lastCardReachedAt.current = Date.now();
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        
        const timeSinceLastCard = Date.now() - lastCardReachedAt.current;
        if (timeSinceLastCard < LAST_CARD_SCROLL_DELAY) {
          // Still within 1000ms window - prevent scroll to next page
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        // 1000ms has passed - allow scroll to next section
        return;
      }
      if (currentCardIndex === 0 && e.deltaY < 0) {
        return;
      }

      // Throttle scroll events
      const now = Date.now();
      if (now - lastScrollTime.current < 800 || isScrollingRef.current || isSnapping.current) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      isScrollingRef.current = true;
      lastScrollTime.current = now;
      lockWheel();

      // Handle vertical scroll (down = next card, up = previous card)
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if (e.deltaY > 0) {
          if (currentCardIndex < lastCardIndex) {
            snapToCard(currentCardIndex + 1, false);
          }
        } else {
          if (currentCardIndex > 0) {
            snapToCard(currentCardIndex - 1, false);
          }
        }
      }
      // Handle horizontal scroll (right = next card, left = previous card)
      else if (Math.abs(e.deltaX) > 0) {
        if (e.deltaX > 0) {
          if (currentCardIndex < lastCardIndex) {
            snapToCard(currentCardIndex + 1, false);
          }
        } else {
          if (currentCardIndex > 0) {
            snapToCard(currentCardIndex - 1, false);
          }
        }
      }

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isInView, scrollHijackActive, timelineComplete, currentCardIndex, lastCardIndex, snapToCard, lockWheel]);

  // Horizontal carousel scroll handler - only active when timelineComplete is true
  useEffect(() => {
    if (!isInView || !timelineComplete || !scrollContainerRef.current) return;

    const CAROUSEL_SCROLL_DELAY = 300;

    const handleCarouselWheel = (e) => {
      // Only handle horizontal scroll (deltaX)
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) {
        return; // Ignore vertical scroll
      }

      if (wheelLockRef.current) {
        e.preventDefault();
        return;
      }

      // Throttle to prevent rapid card switching
      const now = Date.now();
      if (now - carouselScrollThrottle.current < CAROUSEL_SCROLL_DELAY || isSnapping.current) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      carouselScrollThrottle.current = now;
      lockWheel(CAROUSEL_SCROLL_DELAY);

      // Move to next/previous card based on scroll direction
      if (e.deltaX > 0) {
        // Scrolling right = next card
        if (currentCardIndex < lastCardIndex) {
          snapToCard(currentCardIndex + 1, true);
        }
      } else {
        // Scrolling left = previous card
        if (currentCardIndex > 0) {
          snapToCard(currentCardIndex - 1, true);
        }
      }
    };

    window.addEventListener('wheel', handleCarouselWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleCarouselWheel);
    };
  }, [isInView, timelineComplete, currentCardIndex, lastCardIndex, snapToCard, lockWheel]);

  // Mark timeline as complete when user reaches last card
  useEffect(() => {
    if (currentCardIndex === lastCardIndex && scrollHijackActive && !timelineComplete) {
      setTimeout(() => {
        setTimelineComplete(true);
        setScrollHijackActive(false);
      }, 500);
    }
  }, [currentCardIndex, lastCardIndex, scrollHijackActive, timelineComplete]);

  // Show Skip Animation button based on current slide (not timelineComplete state)
  const showSkipButton = !timelineComplete && currentCardIndex < lastCardIndex;

  return (
    <section 
      ref={sectionRef}
      className="relative h-full w-full overflow-hidden"
    >
      {/* Background SVG */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/timeline.svg"
          alt="Timeline Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </div>

      {/* Main Content Container - Centered like Investors and Highlights */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        {/* Header Section */}
        <div className="w-full max-w-[671px] flex flex-col gap-3 items-center mb-16">
          {/* Timeline Heading */}
          <h2 className="w-full section-heading text-center">
            Timeline & Journey
          </h2>

          {/* Timeline Paragraph Content */}
          <p className="w-full max-w-[671px] section-body text-center">
            Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non
          </p>
        </div>

        {/* Timeline Content Area - Centered */}
        <div className="relative w-full flex items-center justify-center">
          {/* Scrollable Timeline Container */}
          <div
            ref={scrollContainerRef}
            className="relative z-20 w-full max-w-full overflow-x-auto overflow-y-hidden scroll-smooth overscroll-x-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ overscrollBehaviorX: 'none', height: '400px' }}
          >
            <div
              ref={innerContainerRef}
              className="relative"
              style={{ width: `${totalTimelineWidth}px`, height: 400 }}
            >
              {/* Main Timeline Line - Horizontal line spanning the scrollable width */}
              <motion.div 
                className="absolute left-[1600px] top-[195px] z-[10]"
                style={{ width: `${timelineLineWidth}px` }}
                animate={timelineControls}
                initial={{ x: 1800 }}
              >
                <svg width={timelineLineWidth} height="1" viewBox={`0 0 ${timelineLineWidth} 1`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[1px]">
                  <line x1="0" y1="0.5" x2={timelineLineWidth} y2="0.5" stroke="#112643" strokeWidth="1" />
                </svg>
              </motion.div>

              {/* Vertical Timeline Markers - Evenly spaced along the horizontal line */}
              <motion.div 
                className="absolute left-[1600px] top-[195px] z-[15] h-[68px] pointer-events-none transform -translate-y-1/2"
                style={{ width: `${timelineLineWidth}px` }}
                animate={timelineControls}
                initial={{ x: 1920 }}
              >
                <svg width={timelineLineWidth} height="68" viewBox={`0 0 ${timelineLineWidth} 68`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  {/* Generate evenly spaced vertical lines every 50px for dense grid pattern */}
                  {Array.from({ length: Math.ceil(timelineLineWidth / 50) }, (_, i) => (
                    <line
                      key={i}
                      x1={i * 50}
                      y1="0"
                      x2={i * 50}
                      y2="68"
                      stroke="#112643"
                      strokeWidth="1"
                    />
                  ))}
                </svg>
              </motion.div>

              {/* Year Labels - Display years below the timeline, evenly distributed */}
              <motion.div 
                className="absolute left-0 top-[195px] z-[15] pointer-events-none"
                style={{ width: `${totalTimelineWidth}px`, paddingTop: '40px' }}
                animate={timelineControls}
                initial={{ x: 1920 }}
              >
                {Array.from({ length: TOTAL_YEARS }, (_, i) => {
                  const year = PRE_SCROLL_START_YEAR + i;
                  // Position years starting from paddingBeforeFirstCard, evenly distributed across PRE_SCROLL_TIMELINE_WIDTH
                  // Year 2000 at start, Year 2014 at end of the 1800px timeline width
                  const yearX = paddingBeforeFirstCard + (i * YEAR_WIDTH);
                  return (
                    <div
                      key={year}
                      className="absolute text-[#112643] font-medium font-satoshi text-lg whitespace-nowrap"
                      style={{ left: `${yearX}px`, transform: 'translateX(-50%)' }}
                    >
                      {year}
                    </div>
                  );
                })}
              </motion.div>

              {/* Timeline Events Container - Centered */}
              <div className="absolute inset-0 z-20 w-full h-[400px] flex items-center justify-center">
                <div className="relative w-full h-full">
                  {timelineCards.map((card, index) => {
                    const adjustedPosition = {
                      left: `${cardPositions[index]}px`,
                      top: card.position.top
                    };
                    return (
                      <TimeLineCard
                        key={index}
                        imageSrc={card.imageSrc}
                        imageAlt={card.imageAlt}
                        title={card.title}
                        description={card.description}
                        year={card.year}
                        position={adjustedPosition}
                        scrollContainerRef={scrollContainerRef}
                        isActive={index === currentCardIndex}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skip Animation Button - Show based on current slide index, not timelineComplete */}
      {showSkipButton && (
        <div className="absolute bottom-10 right-8 z-30">
          <button
            onClick={skipAnimation}
            className="box-border cursor-pointer font-semibold flex flex-row justify-center items-center px-6 py-4 gap-3 isolate w-[196px] h-14 bg-[rgba(167,185,255,0.2)] rounded-lg font-satoshi text-[#1F2024] hover:bg-[rgba(167,185,255,0.3)] transition-colors duration-200"
          >
            <span>Skip Animation</span>
            <Image
              src="/skip.svg"
              alt="Skip icon"
              width={20}
              height={20}
              className="flex-shrink-0"
            />
          </button>
        </div>
      )}
    </section>
  );
}
