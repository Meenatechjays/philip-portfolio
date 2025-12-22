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
  const sectionRef = useRef(null);
  const timelineControls = useAnimation();
  const [introDone, setIntroDone] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnimationSkipped, setIsAnimationSkipped] = useState(false);
  const [scrollHijackActive, setScrollHijackActive] = useState(false);
  const [timelineComplete, setTimelineComplete] = useState(false);
  const hasShownInitialPaddingRef = useRef(false);
  const scrollAccumulator = useRef(0);
  const isSnapping = useRef(false);

  // Skip animation and allow vertical scrolling
  const skipAnimation = () => {
    // Mark timeline as complete to allow vertical scrolling
    setTimelineComplete(true);
    setScrollHijackActive(false);
    setIsAnimationSkipped(true);
    
    // Scroll to last card
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const lastCardPosition = cardPositions[lastCardIndex];
      const containerWidth = scrollContainer.clientWidth;
      scrollContainer.scrollTo({
        left: lastCardPosition - (containerWidth / 2) + (cardWidth / 2),
        behavior: 'smooth'
      });
      setCurrentCardIndex(lastCardIndex);
    }
  };

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
      setScrollHijackActive(true); // Enable scroll hijacking after intro
      
      // Center on first card after intro
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const containerWidth = scrollContainer.clientWidth;
        const firstCardLeft = cardPositions[0];
        const centerPosition = Math.max(0, firstCardLeft - (containerWidth / 2) + (cardWidth / 2));
        scrollContainer.scrollTo({
          left: centerPosition,
          behavior: 'smooth'
        });
      }
    }

    runIntro();
  }, [timelineControls]);

  // Lock body scroll when timeline is active
  useEffect(() => {
    if (!timelineComplete) {
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
  }, [timelineComplete]);

  // Scroll hijacking with snap-to-card behavior
  useEffect(() => {
    if (!scrollHijackActive || timelineComplete) return;

    const SCROLL_THRESHOLD = 50; // Lower threshold for more responsive snapping

    const snapToCard = (targetIndex) => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer || isSnapping.current) return;

      isSnapping.current = true;
      const containerWidth = scrollContainer.clientWidth;
      const cardLeft = cardPositions[targetIndex];
      const targetScroll = cardLeft - (containerWidth / 2) + (cardWidth / 2);

      scrollContainer.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });

      // Update current card index
      setCurrentCardIndex(targetIndex);
      scrollAccumulator.current = 0;

      // Check if this is the last card
      if (targetIndex >= lastCardIndex) {
        setTimeout(() => {
          setTimelineComplete(true);
          setScrollHijackActive(false);
          isSnapping.current = false;
        }, 500);
      } else {
        setTimeout(() => {
          isSnapping.current = false;
        }, 500);
      }
    };

    const handleWheel = (e) => {
      if (isSnapping.current || timelineComplete) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Always prevent default to lock scroll
      e.preventDefault();
      e.stopPropagation();

      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      // Handle vertical scroll (down = next card, up = previous card)
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scrollAccumulator.current += e.deltaY;

        // Snap to next card when scrolling down
        if (scrollAccumulator.current > SCROLL_THRESHOLD) {
          const nextIndex = Math.min(currentCardIndex + 1, lastCardIndex);
          if (nextIndex !== currentCardIndex) {
            snapToCard(nextIndex);
          } else {
            scrollAccumulator.current = 0;
          }
        } 
        // Snap to previous card when scrolling up
        else if (scrollAccumulator.current < -SCROLL_THRESHOLD) {
          const prevIndex = Math.max(currentCardIndex - 1, 0);
          if (prevIndex !== currentCardIndex) {
            snapToCard(prevIndex);
          } else {
            scrollAccumulator.current = 0;
          }
        }
      }
      // Handle horizontal scroll (right = next card, left = previous card)
      else if (Math.abs(e.deltaX) > 0) {
        scrollAccumulator.current += e.deltaX;

        // Scrolling right (positive deltaX) = next card
        if (scrollAccumulator.current > SCROLL_THRESHOLD) {
          const nextIndex = Math.min(currentCardIndex + 1, lastCardIndex);
          if (nextIndex !== currentCardIndex) {
            snapToCard(nextIndex);
          } else {
            scrollAccumulator.current = 0;
          }
        }
        // Scrolling left (negative deltaX) = previous card
        else if (scrollAccumulator.current < -SCROLL_THRESHOLD) {
          const prevIndex = Math.max(currentCardIndex - 1, 0);
          if (prevIndex !== currentCardIndex) {
            snapToCard(prevIndex);
          } else {
            scrollAccumulator.current = 0;
          }
        }
      }
    };

    // Prevent touch scroll on mobile
    const handleTouchMove = (e) => {
      if (!timelineComplete) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [scrollHijackActive, timelineComplete, currentCardIndex, cardPositions, cardWidth, lastCardIndex]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{  position: 'relative' }}
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

      {/* Fixed Header */}
      <div className="relative z-10 w-full flex items-start justify-center pt-[50px]">
        {/* Timeline Container */}
        <div className="w-[671px] opacity-100 flex flex-col gap-4 items-center">
          {/* Timeline Heading */}
          <h2 className="w-[428px] h-[65px] opacity-100 font-satoshi font-bold text-4xl leading-[100%] tracking-[0%] text-center text-[#1F2024]">
            Timeline & Journey
          </h2>

          {/* Timeline Paragraph Content */}
          <p className="w-[671px] opacity-100 font-satoshi font-normal text-lg leading-[100%] tracking-[0%] text-center text-[#454654] pb-5">
            Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non
          </p>
        </div>
      </div>

      {/* Scrollable Timeline Container */}
      <div
        ref={scrollContainerRef}
        className="relative z-20 w-full overflow-x-auto overflow-y-visible scroll-smooth overscroll-x-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ overscrollBehaviorX: 'none', marginTop: '20px' }}
      >
        <div
          ref={innerContainerRef}
          className="relative h-screen"
          style={{ width: `${totalTimelineWidth}px` }}
        >
          {/* Main Timeline Line - Horizontal line spanning the scrollable width */}
          <motion.div 
            className="absolute left-[2000px] top-[195px] z-[10]"
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
            className="absolute left-[2000px] top-[195px] z-[15] h-[68px] pointer-events-none transform -translate-y-1/2"
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
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Skip Animation Button - Positioned within section layout */}
      {!timelineComplete && (
        <div className="absolute bottom-8 right-8 top-200">
          <button
            onClick={skipAnimation}
            className="box-border flex flex-row justify-center items-center px-6 py-4 gap-3 isolate w-[196px] h-14 bg-[rgba(167,185,255,0.2)] rounded-lg font-satoshi text-[#1F2024] hover:bg-[rgba(167,185,255,0.3)] transition-colors duration-200"
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

