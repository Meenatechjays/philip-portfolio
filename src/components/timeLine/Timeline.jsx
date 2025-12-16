'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import TimeLineCard from '../ui/TimeLineCard';

export default function Timeline() {
  const scrollContainerRef = useRef(null);
  const innerContainerRef = useRef(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const hasShownInitialPaddingRef = useRef(false);

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

  useEffect(() => {
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

    const scrollToCard = (cardIndex) => {
      if (cardIndex >= cardPositions.length) return;

      setIsAutoScrolling(true);
      const cardLeft = cardPositions[cardIndex];
      
      // Calculate scroll position to center the card in viewport
      const scrollPosition = Math.max(0, cardLeft - (containerWidth / 2) + (cardWidth / 2));

      // Smooth scroll to the card position with longer duration for slower scroll
      scrollContainer.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });

      // After scrolling completes, wait before moving to next card
      const scrollDuration = 3500; // 3.5 seconds for smooth, slow scroll
      setTimeout(() => {
        setIsAutoScrolling(false);
        // Stop auto-scrolling at the last card
        if (cardIndex < lastCardIndex) {
          // Wait 2 seconds before scrolling to next card
          setTimeout(() => {
            setCurrentCardIndex(cardIndex + 1);
          }, 2000);
        }
      }, scrollDuration);
    };

    // Initial mount: Show padding area first, then scroll to first card
    if (currentCardIndex === 0 && !hasShownInitialPaddingRef.current) {
      // First, scroll to show the padding area (extra lines before first card)
      setTimeout(() => {
        setIsAutoScrolling(true);
        // Scroll to position 0 to show the padding area
        scrollContainer.scrollTo({
          left: 0,
          behavior: 'smooth'
        });

        // After showing padding area, wait then scroll to first card
        const scrollDuration = 3000; // 3 seconds to show padding area
        setTimeout(() => {
          setIsAutoScrolling(false);
          hasShownInitialPaddingRef.current = true;
          // Now scroll to first card
          setTimeout(() => {
            scrollToCard(0);
          }, 1000); // 1 second delay before scrolling to first card
        }, scrollDuration);
      }, 800); // Small delay to ensure component is mounted
    } else if (hasShownInitialPaddingRef.current) {
      // Scroll to subsequent cards (including first card after initial padding)
      scrollToCard(currentCardIndex);
    }

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, [currentCardIndex, cardPositions, cardWidth, lastCardIndex, lastCardPosition, firstCardPosition]);

  return (
    <section className="relative min-h-screen w-full">
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
        className="relative z-20 w-full overflow-x-auto overflow-y-visible -mt-[60px] scroll-smooth overscroll-x-none"
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
              <line x1="0" y1="0.5" x2={totalTimelineWidth} y2="0.5" stroke="#112643" strokeWidth="1"/>
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
    </section>
  );
}

