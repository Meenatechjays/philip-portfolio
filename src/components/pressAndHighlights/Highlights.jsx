'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ToggleButton from '../ui/ToggleButton';
import HighlightsCard from '../ui/HighlightsCard';

export default function Highlights() {
  const [activeOption, setActiveOption] = useState('Media Mentions');
  const [isVisible, setIsVisible] = useState(false);
  const [startFloating, setStartFloating] = useState(false);
  const sectionRef = useRef(null);

  const toggleOptions = ['Media Mentions', 'Podcasts'];

  // Animation configuration constants
  const ANIMATION_CONFIG = {
    initialY: 100,
    initialOpacity: 0,
    entranceDuration: 1,
    staggerDelay: 1,
    floatDistance: -12,
    floatDuration: 2,
  };

  // Card data configuration
  const cardsData = [
    {
      imageSrc: '/pressOneImg.jpg',
      imageAlt: 'Press highlight image',
      title: 'What Makes Techjays AI Products STAND OUT?',
      description: 'Exploring the innovative AI solutions and technology leadership that sets Techjays apart in the industry.',
      readMoreLink: '/article',
      className: 'relative -translate-y-4',
    },
    {
      imageSrc: '/press-two.jpg',
      imageAlt: 'Press highlight image two',
      title: 'Innovation in Technology Leadership',
      description: 'Discover how cutting-edge technology solutions are transforming industries and driving digital transformation.',
      readMoreLink: '/article',
      className: 'relative translate-y-10',
    },
    {
      imageSrc: '/philip-header.png',
      imageAlt: 'Philip header image',
      title: 'Leadership and Vision',
      description: 'Insights into strategic leadership and vision that drives successful technology ventures and innovation.',
      readMoreLink: '/article',
      className: 'relative -translate-y-2',
    },
    {
      imageSrc: '/time-line-2018.jpg',
      imageAlt: 'Timeline 2018 image',
      title: 'Journey Through Innovation',
      description: 'A look back at the milestones and achievements that have shaped the technology landscape over the years.',
      readMoreLink: '/article',
      className: 'relative translate-y-10',
    },
  ];

  // Intersection Observer to detect when section is fully visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is visible
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

  // Start floating animation after all cards have entered (only when visible)
  useEffect(() => {
    if (!isVisible) return;

    const totalDelay = ANIMATION_CONFIG.entranceDuration + (cardsData.length - 1) * ANIMATION_CONFIG.staggerDelay;
    const timer = setTimeout(() => {
      setStartFloating(true);
    }, totalDelay * 1000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="relative h-full w-full overflow-hidden">
      {/* Background - Media Mentions Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/media mentions.png"
          alt="Media Mentions Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-5 h-full flex flex-col items-center justify-center px-4 py-8">
        {/* Header Section */}
        <div className="w-full max-w-[671px] flex flex-col gap-3 items-center mb-3">
          {/* Main Heading */}
          <h2 className="w-full font-satoshi section-heading leading-[100%] tracking-[0%] text-center text-[#1F2024] whitespace-nowrap">
            Press & Podcast Highlights
          </h2>
          
          {/* Description Paragraph */}
          <p className="w-full max-w-[671px] font-satoshi font-normal text-lg leading-normal tracking-[0%] text-center text-[#454654]">
            Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non
          </p>
        </div>

        {/* Toggle Button */}
        <div className="relative flex flex-col items-start bg-white p-1 gap-1.5 w-[260px] h-[52px] rounded-[30px] mb-10">
          <ToggleButton
            options={toggleOptions}
            activeOption={activeOption}
            onOptionChange={setActiveOption}
          />
        </div>

        {/* Content Area - Highlights Cards */}
        <div className="relative w-full flex flex-1 flex-row items-stretch gap-10 justify-center flex-nowrap px-8 max-h-[400px]">
          {cardsData.map((card, index) => (
            <motion.div
              key={index}
              className="w-full max-w-[300px] h-full flex"
              initial={{
                y: ANIMATION_CONFIG.initialY,
                opacity: ANIMATION_CONFIG.initialOpacity,
              }}
              animate={{
                y: isVisible
                  ? startFloating
                    ? [0, ANIMATION_CONFIG.floatDistance, 0]
                    : 0
                  : ANIMATION_CONFIG.initialY,
                opacity: isVisible ? 1 : ANIMATION_CONFIG.initialOpacity,
              }}
              transition={{
                y: isVisible
                  ? startFloating
                    ? {
                        duration: ANIMATION_CONFIG.floatDuration,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }
                    : {
                        duration: ANIMATION_CONFIG.entranceDuration,
                        delay: index * ANIMATION_CONFIG.staggerDelay,
                        ease: 'easeOut',
                      }
                  : {},
                opacity: isVisible
                  ? {
                      duration: ANIMATION_CONFIG.entranceDuration,
                      delay: index * ANIMATION_CONFIG.staggerDelay,
                      ease: 'easeOut',
                    }
                  : {},
              }}
            >
              <HighlightsCard
                imageSrc={card.imageSrc}
                imageAlt={card.imageAlt}
                title={card.title}
                description={card.description}
                readMoreLink={card.readMoreLink}
                position={{ left: '0', top: '0' }}
                className={card.className}
              />
            </motion.div>
          ))}
        </div>

        <div className="h-10"></div>
      </div>
    </section>
  );
}
