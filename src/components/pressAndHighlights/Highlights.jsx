'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import ToggleButton from '../ui/ToggleButton';
import HighlightsCard from '../ui/HighlightsCard';

export default function Highlights() {
  const [activeOption, setActiveOption] = useState('Media Mentions');
  const [isEntranceComplete, setIsEntranceComplete] = useState(false);
  const cardsRef = useRef(null);
  const isInView = useInView(cardsRef, { once: true, margin: "-100px" });

  const toggleOptions = ['Media Mentions', 'Podcasts'];

  useEffect(() => {
    if (isInView) {
      // Wait for all entrance animations to complete (longest delay 0.6s + duration 0.8s = 1.4s)
      const timer = setTimeout(() => {
        setIsEntranceComplete(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
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
      <div className="relative z-5 min-h-screen flex flex-col items-center justify-start px-4 pt-24 pb-32">
        {/* Header Section */}
        <div className="w-full max-w-[671px] flex flex-col gap-4 items-center mb-16">
          {/* Main Heading */}
          <h2 className="w-full max-w-[428px] font-satoshi font-bold text-4xl leading-[100%] tracking-[0%] text-center text-[#1F2024] whitespace-nowrap">
            Press & Podcast Highlights
          </h2>
          
          {/* Description Paragraph */}
          <p className="w-full max-w-[671px] font-satoshi font-normal text-lg leading-normal tracking-[0%] text-center text-[#454654]">
            Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non
          </p>
        </div>

        {/* Toggle Button */}
        <div className="relative flex flex-col items-start bg-white p-1.5 gap-2.5 w-[260px] h-[60px] rounded-[30px] mb-12">
          <ToggleButton
            options={toggleOptions}
            activeOption={activeOption}
            onOptionChange={setActiveOption}
          />
        </div>

        {/* Content Area - Highlights Cards */}
        <div ref={cardsRef} className="relative w-full mt-8 flex flex-row items-start justify-center gap-6 flex-nowrap px-4">
          {/* Card 1 - Press One Image - Highest */}
          <motion.div
            className="w-full max-w-[341px] flex-shrink-0"
            initial={{ y: 100, opacity: 0 }}
            animate={
              !isInView
                ? { y: 100, opacity: 0 }
                : isEntranceComplete
                ? {
                    y: [-10, 10, -10],
                    opacity: 1,
                  }
                : {
                    y: 0,
                    opacity: 1,
                  }
            }
            transition={
              !isInView
                ? {}
                : isEntranceComplete
                ? {
                    y: {
                      duration: 2,
                      repeat: Infinity,
                      ease: [0.68, -0.55, 0.265, 1.55],
                    },
                  }
                : {
                    y: {
                      duration: 0.8,
                      ease: "easeOut",
                    },
                    opacity: {
                      duration: 0.8,
                      ease: "easeOut",
                    },
                  }
            }
          >
            <HighlightsCard
              imageSrc="/pressOneImg.jpg"
              imageAlt="Press highlight image"
              title="What Makes Techjays AI Products STAND OUT?"
              description="Exploring the innovative AI solutions and technology leadership that sets Techjays apart in the industry."
              readMoreLink="/article"
              position={{ left: '0', top: '0' }}
              className="relative -translate-y-4"
            />
          </motion.div>

          {/* Card 2 - Press Two Image - Lower than Card 1 */}
          <motion.div
            className="w-full max-w-[341px] flex-shrink-0"
            initial={{ y: 100, opacity: 0 }}
            animate={
              !isInView
                ? { y: 100, opacity: 0 }
                : isEntranceComplete
                ? {
                    y: [-10, 10, -10],
                    opacity: 1,
                  }
                : {
                    y: 0,
                    opacity: 1,
                  }
            }
            transition={
              !isInView
                ? {}
                : isEntranceComplete
                ? {
                    y: {
                      duration: 2,
                      repeat: Infinity,
                      ease: [0.68, -0.55, 0.265, 1.55],
                    },
                  }
                : {
                    y: {
                      duration: 0.8,
                      ease: "easeOut",
                      delay: 0.2,
                    },
                    opacity: {
                      duration: 0.8,
                      ease: "easeOut",
                      delay: 0.2,
                    },
                  }
            }
          >
            <HighlightsCard
              imageSrc="/press-two.jpg"
              imageAlt="Press highlight image two"
              title="Innovation in Technology Leadership"
              description="Discover how cutting-edge technology solutions are transforming industries and driving digital transformation."
              readMoreLink="/article"
              position={{ left: '0', top: '0' }}
              className="relative translate-y-20"
            />
          </motion.div>

          {/* Card 3 - Philip Header Image - Higher than Card 2 */}
          <motion.div
            className="w-full max-w-[341px] flex-shrink-0"
            initial={{ y: 100, opacity: 0 }}
            animate={
              !isInView
                ? { y: 100, opacity: 0 }
                : isEntranceComplete
                ? {
                    y: [-10, 10, -10],
                    opacity: 1,
                  }
                : {
                    y: 0,
                    opacity: 1,
                  }
            }
            transition={
              !isInView
                ? {}
                : isEntranceComplete
                ? {
                    y: {
                      duration: 2,
                      repeat: Infinity,
                      ease: [0.68, -0.55, 0.265, 1.55],
                    },
                  }
                : {
                    y: {
                      duration: 0.8,
                      ease: "easeOut",
                      delay: 0.4,
                    },
                    opacity: {
                      duration: 0.8,
                      ease: "easeOut",
                      delay: 0.4,
                    },
                  }
            }
          >
            <HighlightsCard
              imageSrc="/philip-header.png"
              imageAlt="Philip header image"
              title="Leadership and Vision"
              description="Insights into strategic leadership and vision that drives successful technology ventures and innovation."
              readMoreLink="/article"
              position={{ left: '0', top: '0' }}
              className="relative -translate-y-2 "
            />
          </motion.div>

          {/* Card 4 - Timeline 2018 Image - Lower than Card 3 */}
          <motion.div
            className="w-full max-w-[341px] flex-shrink-0"
            initial={{ y: 100, opacity: 0 }}
            animate={
              !isInView
                ? { y: 100, opacity: 0 }
                : isEntranceComplete
                ? {
                    y: [-10, 10, -10],
                    opacity: 1,
                  }
                : {
                    y: 0,
                    opacity: 1,
                  }
            }
            transition={
              !isInView
                ? {}
                : isEntranceComplete
                ? {
                    y: {
                      duration: 2,
                      repeat: Infinity,
                      ease: [0.68, -0.55, 0.265, 1.55],
                    },
                  }
                : {
                    y: {
                      duration: 0.8,
                      ease: "easeOut",
                      delay: 0.6,
                    },
                    opacity: {
                      duration: 0.8,
                      ease: "easeOut",
                      delay: 0.6,
                    },
                  }
            }
          >
            <HighlightsCard
              imageSrc="/time-line-2018.jpg"
              imageAlt="Timeline 2018 image"
              title="Journey Through Innovation"
              description="A look back at the milestones and achievements that have shaped the technology landscape over the years."
              readMoreLink="/article"
              position={{ left: '0', top: '0' }}
              className="relative translate-y-20"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
