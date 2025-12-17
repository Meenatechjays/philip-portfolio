'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import TimeLineCard from '../ui/TimeLineCard';
import DesktopFrame from '../layout/DesktopFrame';

export default function Timeline() {
  const scrollContainerRef = useRef(null);
  const innerContainerRef = useRef(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [isAnimationSkipped, setIsAnimationSkipped] = useState(false);
  const hasShownInitialPaddingRef = useRef(false);
  const animationTimeoutRef = useRef(null);

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
  const paddingAfterLastCard = 500; // Add padding after last card to prevent bounce
  const cardPositions = timelineCards.map(card => parseInt(card.position.left) + paddingBeforeFirstCard);
  const firstCardPosition = cardPositions[0];
  const lastCardIndex = timelineCards.length - 1;
  const lastCardPosition = cardPositions[lastCardIndex];
  const timelineStart = 0; // Start timeline from 0
  const timelineEnd = lastCardPosition + cardWidth + paddingAfterLastCard;
  const totalTimelineWidth = timelineEnd;

  // Skip animation function - accessible from button
  const skipAnimation = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    setIsAnimationSkipped(true);
    setIsAutoScrolling(false);

    // Clear any existing timeouts
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    // Jump directly to the last card
    const containerWidth = scrollContainer.clientWidth;
    const lastCardLeft = cardPositions[lastCardIndex];
    const scrollPosition = Math.max(0, lastCardLeft - (containerWidth / 2) + (cardWidth / 2));

    scrollContainer.scrollTo({
      left: scrollPosition,
      behavior: 'auto'
    });

    setCurrentCardIndex(lastCardIndex);
    hasShownInitialPaddingRef.current = true;
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const innerContainer = innerContainerRef.current;
    if (!scrollContainer || !innerContainer) return;

    // Check if viewport is tablet size (≤1439px) - disable auto-scroll on tablet
    const isTablet = window.innerWidth <= 1439;
    if (isTablet) {
      // On tablet, only enable manual scroll - disable auto-scroll logic
      return;
    }

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

    const scrollToCard = (cardIndex, skipAnimation = false) => {
      if (cardIndex >= cardPositions.length) return;

      setIsAutoScrolling(true);
      const cardLeft = cardPositions[cardIndex];

      // Calculate scroll position to center the card in viewport
      const scrollPosition = Math.max(0, cardLeft - (containerWidth / 2) + (cardWidth / 2));

      // Smooth scroll to the card position with longer duration for slower scroll
      scrollContainer.scrollTo({
        left: scrollPosition,
        behavior: skipAnimation ? 'auto' : 'smooth'
      });

      // After scrolling completes, wait before moving to next card
      const scrollDuration = skipAnimation ? 0 : 3500; // 3.5 seconds for smooth, slow scroll

      // Clear any existing timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      animationTimeoutRef.current = setTimeout(() => {
        setIsAutoScrolling(false);
        // Stop auto-scrolling at the last card
        if (cardIndex < lastCardIndex && !skipAnimation) {
          // Wait 2 seconds before scrolling to next card
          setTimeout(() => {
            setCurrentCardIndex(cardIndex + 1);
          }, 2000);
        }
      }, scrollDuration);
    };

    // Initial mount: Show padding area first, then scroll to first card
    if (!isAnimationSkipped) {
      if (currentCardIndex === 0 && !hasShownInitialPaddingRef.current) {
        // First, scroll to show the padding area (extra lines before first card)
        animationTimeoutRef.current = setTimeout(() => {
          setIsAutoScrolling(true);
          // Scroll to position 0 to show the padding area
          scrollContainer.scrollTo({
            left: 0,
            behavior: 'smooth'
          });

          // After showing padding area, wait then scroll to first card
          const scrollDuration = 3000; // 3 seconds to show padding area
          animationTimeoutRef.current = setTimeout(() => {
            setIsAutoScrolling(false);
            hasShownInitialPaddingRef.current = true;
            // Now scroll to first card
            animationTimeoutRef.current = setTimeout(() => {
              scrollToCard(0);
            }, 1000); // 1 second delay before scrolling to first card
          }, scrollDuration);
        }, 800); // Small delay to ensure component is mounted
      } else if (hasShownInitialPaddingRef.current) {
        // Scroll to subsequent cards (including first card after initial padding)
        scrollToCard(currentCardIndex);
      }
    }

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      scrollContainer.removeEventListener('wheel', handleWheel);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [currentCardIndex, cardPositions, cardWidth, lastCardIndex, lastCardPosition, firstCardPosition, isAnimationSkipped]);

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
      <DesktopFrame>
        <div className="relative z-10 w-full flex items-start justify-center pt-[100px] max-[1727px]:pt-[80px]">
          {/* Timeline Container */}
          <div className="w-[671px] h-[145px] opacity-100 flex flex-col gap-4 max-[1727px]:gap-y-3 items-center">
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
      </DesktopFrame>

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
          <div className="absolute left-0 top-[380px] z-[10] w-full">
            <svg width={totalTimelineWidth} height="1" viewBox={`0 0 ${totalTimelineWidth} 1`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[1px]">
              <line x1="0" y1="0.5" x2={totalTimelineWidth} y2="0.5" stroke="#112643" strokeWidth="1" />
            </svg>
          </div>

          {/* Vertical Timeline Markers - Evenly spaced along the horizontal line */}
          <div className="absolute left-0 top-[380px] z-[15] w-full h-[68px] pointer-events-none transform -translate-y-1/2">
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
          </div>

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
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Skip Animation Button - Positioned within section layout */}
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
    </section>
  );
}

