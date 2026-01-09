'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ToggleButton from '../ui/ToggleButton';
import HighlightsCard from '../ui/HighlightsCard';

export default function Highlights() {
  const [activeOption, setActiveOption] = useState('Media Mentions');

  const toggleOptions = ['Media Mentions', 'Podcasts'];

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
      <div className="relative z-5 h-screen flex flex-col items-center justify-start px-4 pt-10 pb-6">
        {/* Header Section */}
        <div className="w-full max-w-[671px] flex flex-col gap-3 items-center mb-3">
          {/* Main Heading */}
          <h2 className="w-full max-w-[428px] font-satoshi font-bold text-3xl leading-[100%] tracking-[0%] text-center text-[#1F2024] whitespace-nowrap">
            Press & Podcast Highlights
          </h2>
          
          {/* Description Paragraph */}
          <p className="w-full max-w-[671px] font-satoshi font-normal text-base leading-normal tracking-[0%] text-center text-[#454654]">
            Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non
          </p>
        </div>

        {/* Toggle Button */}
        <div className="relative flex flex-col items-start bg-white p-1 gap-1.5 w-[260px] h-[52px] rounded-[30px] mb-3">
          <ToggleButton
            options={toggleOptions}
            activeOption={activeOption}
            onOptionChange={setActiveOption}
          />
        </div>

        {/* Content Area - Highlights Cards */}
        <div className="relative w-[90%] mt-8 flex flex-row items-start justify-center gap-6 flex-nowrap px-4 lg:mx-10">
          {/* Card 1 - Press One Image - Highest */}
          <motion.div
            className="w-full"
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
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
            className="w-full"
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
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
            className="w-full"
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
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
            className="w-full"
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
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
