'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
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
  const timelineControls = useAnimation();
  const [introDone, setIntroDone] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [isAnimationSkipped, setIsAnimationSkipped] = useState(false);
  const hasShownInitialPaddingRef = useRef(false);
  const animationTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);
  const fillCompleteRef = useRef(false);

  // Handler for when card fill animation completes
  const handleFillComplete = () => {
    fillCompleteRef.current = true;
  };

  // Reset function to scroll back to start
  const resetTimeline = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Cancel any ongoing animations
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    // Reset state
    setCurrentCardIndex(0);
    setIsAutoScrolling(false);
    fillCompleteRef.current = false;

    // Scroll back to first card
    scrollContainer.scrollTo({
      left: 0,
      behavior: 'smooth'
    });
  };

  // Dynamic timeline cards data - easily add more cards in the future
  const timelineCards = [
    {
      imageSrc: '/philip-footer-img.png',
      imageAlt: 'Timeline event 2015',
      title: 'Early Beginnings',
      description: 'The foundation of my journey in technology and cybersecurity began with innovative approaches to digital security challenges.',
      year: '2015',
      position: { left: '200px', top: '185px' }
    },
    {
      imageSrc: '/time-line-2016.jpg',
      imageAlt: 'Timeline event 2016',
      title: 'Growth Phase',
      description: 'Expanding cutting-edge security solutions and establishing key partnerships in the technology sector.',
      year: '2016',
      position: { left: '1700px', top: '185px' }
    },
    {
      imageSrc: '/timeLine-2017.jpg',
      imageAlt: 'Timeline event 2017',
      title: 'Innovation Phase',
      description: 'Pioneering new methods and tools in cybersecurity and establishing key partnerships in the technology sector.',
      year: '2017',
      position: { left: '3200px', top: '185px' }
    },
    {
      imageSrc: '/time-line-2018.jpg',
      imageAlt: 'Timeline event 2018',
      title: 'Expansion Phase',
      description: 'Scaling operations and reaching new milestones in technology and cybersecurity innovation.',
      year: '2018',
      position: { left: '4700px', top: '185px' }
    }
  ];

  const cardWidth = 1013.84; // Width of each timeline card
  const paddingBeforeFirstCard = 2000; // Add space before first card for more lines
  const paddingAfterLastCard = 2000; // Extra padding after last card for more timeline lines
  const cardPositions = timelineCards.map(card => parseInt(card.position.left) + paddingBeforeFirstCard);
  const firstCardPosition = cardPositions[0];
  const lastCardIndex = timelineCards.length - 1;
  const lastCardPosition = cardPositions[lastCardIndex];
  const timelineStart = 2000; // Start timeline from 0
  const timelineEnd = lastCardPosition + cardWidth + paddingAfterLastCard;
  const totalTimelineWidth = timelineEnd;

  // Phase 1: Fast intro auto-scroll animation (2000 → 2014)
  useEffect(() => {
    async function runIntro() {
      // Start timeline off-screen to the right, then animate to left
      const startX = typeof window !== 'undefined' ? window.innerWidth : 1920;
      
      // Set initial position off-screen to the right
      await timelineControls.set({ x: startX  });
      
      // Fast animation from right to left (3 seconds instead of 6)
      await timelineControls.start({
        x: -PRE_SCROLL_DISTANCE,
        transition: {
          duration: 3,
          ease: 'linear'
        }
      });

      setIntroDone(true); // unlock card scrolling logic
      hasShownInitialPaddingRef.current = true;
    }

    runIntro();
  }, [timelineControls]);

  // Phase 2: Existing scroll logic (only runs after intro completes)
  useEffect(() => {
    if (!introDone) return;

    const scrollContainer = scrollContainerRef.current;
    const innerContainer = innerContainerRef.current;
    if (!scrollContainer || !innerContainer) return;

    // Calculate max scroll width based on last card
    const containerWidth = scrollContainer.clientWidth;
    const maxScrollLeft = Math.max(0, lastCardPosition - (containerWidth / 2) + (cardWidth / 2));

    // Prevent scrolling past the last card and prevent scrolling back to padding area
    let isScrolling = false;
    const handleScroll = () => {
      if (isScrolling) return;

      const currentScroll = scrollContainer.scrollLeft;
      // Calculate min scroll position dynamically (prevent scrolling back to padding area after initial mount)
      const minScrollLeft = hasShownInitialPaddingRef.current
        ? Math.max(0, firstCardPosition - (containerWidth / 2) + (cardWidth / 2))
        : 0;

      // Prevent scrolling right past the last card
      if (currentScroll > maxScrollLeft) {
        isScrolling = true;
        requestAnimationFrame(() => {
          scrollContainer.scrollLeft = maxScrollLeft;
          isScrolling = false;
        });
      }
      // Prevent scrolling left back to padding area (after initial mount)
      else if (hasShownInitialPaddingRef.current && currentScroll < minScrollLeft) {
        isScrolling = true;
        requestAnimationFrame(() => {
          scrollContainer.scrollLeft = minScrollLeft;
          isScrolling = false;
        });
      }
    };

    // Use wheel event to prevent overscroll bounce
    const handleWheel = (e) => {
      const currentScroll = scrollContainer.scrollLeft;
      // Calculate min scroll position dynamically
      const minScrollLeft = hasShownInitialPaddingRef.current
        ? Math.max(0, firstCardPosition - (containerWidth / 2) + (cardWidth / 2))
        : 0;

      // Prevent scrolling right past the last card
      if (currentScroll >= maxScrollLeft && e.deltaX > 0) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Prevent scrolling left back to padding area (after initial mount)
      else if (hasShownInitialPaddingRef.current && currentScroll <= minScrollLeft && e.deltaX < 0) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

    const scrollToCardCenter = (cardIndex) => {
      if (cardIndex >= cardPositions.length) return;

      const cardLeft = cardPositions[cardIndex];
      const centerPosition = Math.max(0, cardLeft - (containerWidth / 2) + (cardWidth / 2));

      scrollContainer.scrollTo({
        left: centerPosition,
        behavior: 'smooth'
      });
    };

    const slideCardRight = (cardIndex) => {
      if (cardIndex >= cardPositions.length) return;

      setIsAutoScrolling(true);
      fillCompleteRef.current = false;

      const cardLeft = cardPositions[cardIndex];
      const startPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2); // Center position
      const endPosition = cardLeft + (containerWidth / 2); // Slide to right edge
      const distance = endPosition - startPosition;
      const duration = 5000; // 5 seconds for slow slide with fill animation
      const startTime = performance.now();

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Linear easing for consistent fill animation
        scrollContainer.scrollLeft = startPosition + (distance * progress);

        if (progress < 1 && !fillCompleteRef.current) {
          animationFrameRef.current = requestAnimationFrame(animateScroll);
        } else {
          setIsAutoScrolling(false);
          animationFrameRef.current = null;
          
          // Move to next card after fill complete
          if (cardIndex < lastCardIndex) {
            setTimeout(() => {
              setCurrentCardIndex(cardIndex + 1);
            }, 500); // Small delay before next card
          }
        }
      };

      // Clear any existing animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(animateScroll);
    };

    // Start card-by-card progression after intro
    if (!isAnimationSkipped && hasShownInitialPaddingRef.current) {
      // First, center the card
      scrollToCardCenter(currentCardIndex);
      
      // Then after centering, start the slide-right animation
      animationTimeoutRef.current = setTimeout(() => {
        slideCardRight(currentCardIndex);
      }, 1000); // Wait for centering to complete
    }

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      scrollContainer.removeEventListener('wheel', handleWheel);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [introDone, currentCardIndex, cardPositions, cardWidth, lastCardIndex, lastCardPosition, firstCardPosition]);

  return (
    <section className="relative min-h-screen w-full mb-0 overflow-hidden">
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

      {/* Fixed Header */}
      <div className="relative z-10 w-full flex items-start justify-center pt-[100px]">
        {/* Timeline Container */}
        <div className="w-[671px] h-[145px] opacity-100 flex flex-col gap-4 items-center">
          {/* Timeline Heading */}
          <h2 className="w-[428px] h-[65px] opacity-100 font-satoshi font-bold text-4xl leading-[100%] tracking-[0%] text-center text-[#1F2024]">
            Timeline & Journey
          </h2>

          {/* Timeline Paragraph Content */}
          <p className="w-[671px] h-[64px] opacity-100 font-satoshi font-normal text-lg leading-[100%] tracking-[0%] text-center text-[#454654]">
            Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non
          </p>
        </div>
      </div>

      {/* Scrollable Timeline Container */}
      <div
        ref={scrollContainerRef}
        className="relative z-20 w-full overflow-x-auto overflow-y-visible -mt-[60px] scroll-smooth overscroll-x-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ overscrollBehaviorX: 'none' }}
      >
        <div
          ref={innerContainerRef}
          className="relative h-screen"
          style={{ width: `${totalTimelineWidth}px` }}
        >
          {/* Main Timeline Line - Horizontal line spanning the scrollable width */}
          <motion.div 
            className="absolute left-[2000px] top-[380px] z-[10]"
            style={{ width: `${totalTimelineWidth}px` }}
            animate={timelineControls}
            initial={{ x: 1920 }}
          >
            <svg width={totalTimelineWidth} height="1" viewBox={`0 0 ${totalTimelineWidth} 1`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[1px]">
              <line x1="0" y1="0.5" x2={totalTimelineWidth} y2="0.5" stroke="#112643" strokeWidth="1" />
            </svg>
          </motion.div>

          {/* Vertical Timeline Markers - Evenly spaced along the horizontal line */}
          <motion.div 
            className="absolute left-[2000px] top-[380px] z-[15] h-[68px] pointer-events-none transform -translate-y-1/2"
            style={{ width: `${totalTimelineWidth}px` }}
            animate={timelineControls}
            initial={{ x: 1920 }}
          >
            <svg width={totalTimelineWidth} height="68" viewBox={`0 0 ${totalTimelineWidth} 68`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Generate evenly spaced vertical lines every 50px for dense grid pattern */}
              {Array.from({ length: Math.ceil(totalTimelineWidth / 50) }, (_, i) => (
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
            className="absolute left-0 top-[380px] z-[15] pointer-events-none"
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

          {/* Timeline Events Container */}
          <div className="absolute inset-0 z-20 w-full">
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
                  onFillComplete={handleFillComplete}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Reset Button - Positioned within section layout */}
      <div className="absolute bottom-8 right-8 top-200">
        <button
          onClick={resetTimeline}
          className="box-border flex flex-row justify-center items-center px-6 py-4 gap-3 isolate w-[196px] h-14 bg-[rgba(167,185,255,0.2)] rounded-lg font-satoshi text-[#1F2024] hover:bg-[rgba(167,185,255,0.3)] transition-colors duration-200"
        >
          <span>Skip Animation</span>
          <Image
            src="/skip.svg"
            alt="Reset icon"
            width={20}
            height={20}
            className="flex-shrink-0"
          />
        </button>
      </div>
    </section>
  );
}

