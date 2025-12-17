'use client';

import { useState } from 'react';
import Image from 'next/image';
import ToggleButton from '../ui/ToggleButton';
import HighlightsCard from '../ui/HighlightsCard';
import DesktopFrame from '../layout/DesktopFrame';

export default function Highlights() {
  const [activeOption, setActiveOption] = useState('Media Mentions');

  const toggleOptions = ['Media Mentions', 'Podcasts'];

  return (
    <section className="relative min-h-screen w-full overflow-visible pb-12">
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
      <DesktopFrame>
        <div className="relative z-5 min-h-screen flex flex-col items-center justify-start pt-20 max-[1727px]:pt-16 pb-12">
          {/* Header Section */}
          <div className="w-full max-w-[671px] flex flex-col gap-4 max-[1727px]:gap-y-3 items-center mb-12 max-[1727px]:mb-8">
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
          <div className="absolute flex flex-col items-start bg-white py-1.5 max-[1727px]:py-1 gap-2.5 max-[1727px]:gap-y-2 w-[260px] h-[60px] left-1/2 -translate-x-1/2 top-[200px] rounded-[30px] max-xl:relative max-xl:top-0 max-xl:left-0 max-xl:translate-x-0 max-xl:mb-12">
            <ToggleButton
              options={toggleOptions}
              activeOption={activeOption}
              onOptionChange={setActiveOption}
            />
          </div>

          {/* Content Area - Highlights Cards */}
          <div className="relative w-full mt-32 max-[1727px]:mt-24 mb-12 flex flex-row items-start justify-center gap-4 flex-nowrap max-xl:overflow-x-auto max-xl:justify-start max-xl:scroll-smooth max-xl:gap-4 max-xl:px-4">
            {/* Card 1 - Press One Image - Highest */}
            <HighlightsCard
              imageSrc="/pressOneImg.jpg"
              imageAlt="Press highlight image"
              title="What Makes Techjays AI Products STAND OUT?"
              description="Exploring the innovative AI solutions and technology leadership that sets Techjays apart in the industry."
              readMoreLink="/article"
              position={{ left: '0', top: '0' }}
              className="relative -translate-y-4 max-xl:translate-y-0 max-xl:flex-shrink-0"
            />

            {/* Card 2 - Press Two Image - Lower than Card 1 */}
            <HighlightsCard
              imageSrc="/press-two.jpg"
              imageAlt="Press highlight image two"
              title="Innovation in Technology Leadership"
              description="Discover how cutting-edge technology solutions are transforming industries and driving digital transformation."
              readMoreLink="/article"
              position={{ left: '0', top: '0' }}
              className="relative translate-y-18 max-xl:translate-y-0 max-xl:flex-shrink-0"
            
            />

            {/* Card 3 - Philip Header Image - Higher than Card 2 */}
            <HighlightsCard
              imageSrc="/philip-header.png"
              imageAlt="Philip header image"
              title="Leadership and Vision"
              description="Insights into strategic leadership and vision that drives successful technology ventures and innovation."
              readMoreLink="/article"
              position={{ left: '0', top: '0' }}
              className="relative -translate-y-2 max-xl:translate-y-0 max-xl:flex-shrink-0"
            />

            {/* Card 4 - Timeline 2018 Image - Lower than Card 3 */}
            <HighlightsCard
              imageSrc="/time-line-2018.jpg"
              imageAlt="Timeline 2018 image"
              title="Journey Through Innovation"
              description="A look back at the milestones and achievements that have shaped the technology landscape over the years."
              readMoreLink="/article"
              position={{ left: '0', top: '0' }}
              className="relative translate-y-18 max-xl:translate-y-0 max-xl:flex-shrink-0"
            />
          </div>
        </div>
      </DesktopFrame>
    </section>
  );
}
