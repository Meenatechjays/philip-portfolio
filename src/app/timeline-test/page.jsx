'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const TIMELINE_START_YEAR = 2000;
const CARD_TRANSITION_DURATION = 2; // seconds per card transition

// Define your data - cards can start from any year
const TimelineCards = [
  {
    year: 2015,
    title: 'Early Beginnings',
    content: 'The foundation of my journey in technology and cybersecurity began with innovative approaches to digital security challenges.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'
  },
  {
    year: 2016,
    title: 'Growth & Innovation',
    content: 'Expanding horizons with cutting-edge solutions and building strong foundations in the tech industry.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop'
  },
  {
    year: 2017,
    title: 'Strategic Milestones',
    content: 'Achieving key objectives and establishing partnerships that would shape the future of our operations.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=600&fit=crop'
  },
  {
    year: 2018,
    title: 'Expansion Phase',
    content: 'Scaling operations and reaching new milestones in technology and cybersecurity innovation.',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop'
  }
];

// SVG Component
const TimelineSVG = ({ year }) => (
  <div className="flex flex-col items-center gap-2" style={{ minWidth: '81px' }}>
    <svg width="81" height="108" viewBox="0 0 81 108" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0.5" y1="20" x2="0.499995" y2="88" stroke="#64748b" strokeWidth="1.5"/>
      <line x1="40.5" y1="2.18557e-08" x2="40.5" y2="108" stroke="#64748b" strokeWidth="1.5"/>
      <line x1="80.5" y1="20" x2="80.5" y2="88" stroke="#64748b" strokeWidth="1.5"/>
    </svg>
    <div className="text-slate-700 text-base font-medium">{year}</div>
  </div>
);

// Card Component
const TimelineCard = ({ card }) => (
  <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ width: '480px' }}>
    <div className="relative h-64 overflow-hidden">
      <img 
        src={card.image}
        alt={card.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-6 left-6 text-white text-7xl font-bold drop-shadow-lg">
        {card.year}
      </div>
    </div>
    <div className="p-8 bg-gray-50">
      <h2 className="text-2xl font-bold text-slate-900 mb-3">
        {card.title}
      </h2>
      <p className="text-slate-600 leading-relaxed">
        {card.content}
      </p>
    </div>
  </div>
);

export default function TimelineTestPage() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [scrollHijackEnabled, setScrollHijackEnabled] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  const timelineControls = useAnimation();
  const pageRef = useRef(null);
  const lastScrollTime = useRef(0);

  // Calculate timeline configuration based on card data
  const firstCardYear = TimelineCards[0].year;
  const timelineEndYear = firstCardYear - 1;
  
  // Generate all years from start to current card
  const allYears = Array.from(
    { length: firstCardYear + TimelineCards.length - TIMELINE_START_YEAR },
    (_, i) => TIMELINE_START_YEAR + i
  );
  
  // Calculate SVG width per year (each SVG is 81px + we want consistent spacing)
  const SVG_WIDTH = 81;
  const SVG_GAP = 40;
  const YEAR_WIDTH = SVG_WIDTH + SVG_GAP;
  
  // Calculate positions
  const totalYears = allYears.length;
  const timelineYearsCount = timelineEndYear - TIMELINE_START_YEAR + 1;
  
  // Calculate scroll distance: from right edge to center, accounting for all timeline years
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const centerPosition = screenWidth / 2 - SVG_WIDTH / 2;
  
  // Start position: rightmost SVG at right edge
  const startPosition = screenWidth;
  
  // End position: first card year at center (after timeline years have scrolled past)
  const scrollDistance = startPosition + (timelineYearsCount * YEAR_WIDTH) - centerPosition;
  
  const TIMELINE_SCROLL_DURATION = timelineYearsCount * 0.8; // 0.8s per year

  // Start timeline animation on mount
  useEffect(() => {
    const startTimeline = async () => {
      await timelineControls.start({
        x: [0, -scrollDistance],
        transition: {
          duration: TIMELINE_SCROLL_DURATION,
          ease: 'linear'
        }
      });
      
      setAnimationComplete(true);
    };

    startTimeline();
  }, [timelineControls, scrollDistance, TIMELINE_SCROLL_DURATION]);

  // Handle wheel scroll
  useEffect(() => {
    const handleWheel = (e) => {
      if (!scrollHijackEnabled || isTransitioning || !animationComplete) {
        if (!animationComplete) {
          e.preventDefault();
        }
        return;
      }

      const now = Date.now();
      if (now - lastScrollTime.current < 100) return;
      lastScrollTime.current = now;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      if (scrollingDown) {
        if (activeCardIndex < TimelineCards.length - 1) {
          e.preventDefault();
          moveToCard(activeCardIndex + 1);
        } else {
          setScrollHijackEnabled(false);
        }
      } else if (scrollingUp) {
        if (activeCardIndex > 0) {
          e.preventDefault();
          moveToCard(activeCardIndex - 1);
        }
      }
    };

    const pageElement = pageRef.current;
    if (pageElement) {
      pageElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (pageElement) {
        pageElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [scrollHijackEnabled, isTransitioning, animationComplete, activeCardIndex]);

  // Move to specific card
  const moveToCard = async (newIndex) => {
    if (newIndex === activeCardIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    
    const cardDifference = newIndex - activeCardIndex;
    const additionalScroll = cardDifference * YEAR_WIDTH;

    await timelineControls.start({
      x: `-=${additionalScroll}`,
      transition: {
        duration: CARD_TRANSITION_DURATION,
        ease: 'linear'
      }
    });

    setActiveCardIndex(newIndex);
    setIsTransitioning(false);
  };

  return (
    <div 
      ref={pageRef}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 overflow-hidden"
    >
      {/* Header */}
      <div className="text-center pt-16 pb-8">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">Timeline & Journey</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto px-4">
          Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non
        </p>
      </div>

      {/* Main Timeline Section */}
      <div className="relative h-screen flex items-center justify-center">
        
        {/* Unified Timeline + Cards Container */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '100%' }}>
          <motion.div
            animate={timelineControls}
            className="flex items-end gap-10 absolute"
            style={{
              left: `${startPosition}px`,
              bottom: '80px',
            }}
          >
            {/* Render all years */}
            {allYears.map((year, index) => {
              const cardIndex = TimelineCards.findIndex(card => card.year === year);
              const hasCard = cardIndex !== -1;
              
              return (
                <div key={year} className="flex flex-col items-center gap-6">
                  {/* Card above timeline (if data exists for this year) */}
                  {hasCard && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: animationComplete && cardIndex === activeCardIndex ? 1 : 0.4,
                        scale: animationComplete && cardIndex === activeCardIndex ? 1 : 0.95
                      }}
                      transition={{ duration: 0.5, ease: 'linear' }}
                      style={{ marginBottom: '40px' }}
                    >
                      <TimelineCard card={TimelineCards[cardIndex]} />
                    </motion.div>
                  )}
                  
                  {/* Timeline SVG */}
                  <TimelineSVG year={year} />
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Progress dots */}
        {animationComplete && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {TimelineCards.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeCardIndex 
                    ? 'bg-slate-700 w-8' 
                    : 'bg-slate-300 w-2'
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation hint */}
        {animationComplete && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-sm text-slate-500">
              {activeCardIndex < TimelineCards.length - 1 
                ? 'Scroll to navigate'
                : 'Scroll to continue'}
            </p>
          </div>
        )}
      </div>

      {/* Next Page Section */}
      {!scrollHijackEnabled && (
        <div className="h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold mb-4">What's Next</h2>
            <p className="text-xl text-slate-300">
              Continue exploring our story...
            </p>
          </div>
        </div>
      )}

      {/* Debug info */}
      <div className="fixed top-4 right-4 bg-black/80 backdrop-blur-sm p-3 rounded-lg text-xs font-mono text-white z-50">
        <div>Timeline: <span className="text-blue-400">{TIMELINE_START_YEAR}-{timelineEndYear}</span></div>
        <div>First Card: <span className="text-blue-400">{firstCardYear}</span></div>
        <div>Active Card: <span className="text-blue-400">{activeCardIndex + 1}/{TimelineCards.length}</span></div>
        <div>Year: <span className="text-blue-400">{TimelineCards[activeCardIndex].year}</span></div>
        <div>Animation: <span className={animationComplete ? 'text-green-400' : 'text-yellow-400'}>{animationComplete ? 'COMPLETE' : 'RUNNING'}</span></div>
        <div>Hijack: <span className={scrollHijackEnabled ? 'text-green-400' : 'text-red-400'}>{scrollHijackEnabled ? 'ON' : 'OFF'}</span></div>
      </div>
    </div>
  );
}

