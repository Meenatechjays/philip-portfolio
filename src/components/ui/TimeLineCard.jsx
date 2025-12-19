'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

export default function TimeLineCard({ 
  imageSrc, 
  imageAlt = 'Timeline event',
  title,
  description,
  year,
  position = { left: '363px', top: '357px' },
  scrollContainerRef,
  isActive = false,
  onFillComplete
}) {
  const cardRef = useRef(null);
  const [fillProgress, setFillProgress] = useState(0);

  useEffect(() => {
    if (!scrollContainerRef?.current || !cardRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    const card = cardRef.current;
    let rafId = null;
    let lastProgress = 0;

    const updateFillProgress = () => {
      // Only show progress for active card
      if (!isActive) {
        setFillProgress(0);
        return;
      }

      const containerRect = scrollContainer.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      
      const viewportCenter = containerRect.left + (containerRect.width / 2);
      const cardCenter = cardRect.left + (cardRect.width / 2);
      
      // Card must be centered or sliding right (past center)
      if (cardCenter > viewportCenter) {
        // Card hasn't reached center yet
        setFillProgress(0);
        return;
      }
      
      // Card is at or past center - calculate fill progress as it slides right
      // Progress fills from center to right edge of viewport
      const distanceFromCenter = viewportCenter - cardCenter;
      const maxDistance = containerRect.width / 2; // Distance from center to right edge
      const progress = Math.max(0, Math.min(1, distanceFromCenter / maxDistance));
      
      // Only update if progress changed significantly (avoid unnecessary re-renders)
      if (Math.abs(progress - lastProgress) > 0.001) {
        setFillProgress(progress);
        lastProgress = progress;
      }

      // Notify parent when fill is complete
      if (progress >= 0.99 && onFillComplete) {
        onFillComplete();
      }
    };

    // Smooth scroll update using requestAnimationFrame
    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updateFillProgress);
    };

    // Update on scroll
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial update
    updateFillProgress();
    
    // Update on resize
    window.addEventListener('resize', updateFillProgress);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateFillProgress);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [scrollContainerRef, isActive, onFillComplete]);

  return (
    <div 
      ref={cardRef}
      className="absolute flex flex-row items-center p-0 z-30 w-[1013.84px] h-[390px]"
      style={{
        left: position.left,
        top: position.top,
      }}
    >
      {/* Event Image */}
      <div className="relative w-[637.84px] h-[390px] z-20">
        <div className="relative w-full h-full rounded-[28.8889px] overflow-hidden bg-black/10">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Year Overlay - Bottom Left Corner */}
          {year && (
            <div className="absolute w-[265px] h-[156px] top-[233.52px] left-[26.48px] font-satoshi font-bold text-white opacity-100 z-30 text-[115.56px] leading-[100%] tracking-[0%]">
              {year}
            </div>
          )}
        </div>
      </div>

      {/* Event Description - At the right end of the image with progressive image reveal */}
      <div 
        className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[496px] h-[203px] rounded-3xl z-20 overflow-hidden"
      >
        {/* Solid white background - always visible, never changes */}
        <div className="absolute inset-0 bg-white/86 rounded-3xl" />
        
        {/* Progressive image reveal - shows the main card image behind white background */}
        <div 
          className="absolute inset-0 overflow-hidden opacity-10"
          style={{
            clipPath: `inset(0 ${100 - (fillProgress * 100)}% 0 0)`,
          }}
        >
          <Image
            src={imageSrc}
            alt={`${imageAlt} - preview`}
            fill
            className="object-cover"
            quality={90}
          />
        </div>
        
        {/* Content overlay - always visible on top of white background */}
        <div 
          className="relative flex flex-col items-start p-6 gap-4 h-full z-10"
        >
          <h3 className="font-satoshi font-bold text-2xl text-[#1F2024]">
            {title}
          </h3>
          <p className="font-satoshi font-normal text-base text-[#454654] leading-relaxed">
            {description}
          </p>
        </div>
      </div>

    </div>
  );
}

