'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function PortfolioHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);

  const rightContentItems = [
    {
      title: 'Investor',
      description: 'Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non'
    },
    {
      title: 'Leader',
      description: 'Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non'
    },
    {
      title: 'Entrepreneur',
      description: 'Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non'
    }
  ];

  const handleContentClick = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection('up');
    
    // After animation completes, update index
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % rightContentItems.length);
      setIsAnimating(false);
      setDirection(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 w-full h-full">
        {/* Banner Blue Background */}
        <Image
          src="/Banner Blue.png"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Sky Background - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 w-full">
          <Image
            src="/Sky.png"
            alt="Sky Background"
            width={1920}
            height={600}
            className="w-full h-auto object-contain"
            priority
            quality={90}
          />
        </div>
        {/* Font SVG Overlay - First letter aligned with left content p tag */}
        <div className="absolute top-[340px] left-[76px] pointer-events-none z-[5]">
          <div className="relative w-[1350px] h-[640px]">
            <Image
              src="/font.svg"
              alt="Font Overlay"
              fill
              className="object-contain object-left-top"
              priority
              style={{ opacity: 1, filter: 'contrast(5) brightness(2)' }}
            />
          </div>
        </div>
      </div>

    

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen">
        {/* Left Content */}
        <div className="absolute w-[529px] h-[284px] top-[150px] left-[76px] opacity-100 flex flex-col gap-4">
          <h1 className="opacity-100 font-sans font-bold text-6xl text-gray-900 leading-normal tracking-[0%]">
            Hey Im<br /> 
              Philip Samuelraj
            </h1>
          <p className="h-[96px] opacity-100 text-base sm:text-lg text-gray-700 leading-[100%]">
              Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non
            </p>
          </div>

        {/* Center Image */}
        <div className="absolute top-1/2 left-[52%] transform -translate-x-1/2 -translate-y-1/2">
          {/* Mobile/Tablet: Responsive */}
          <div className="relative w-full max-w-[400px] sm:max-w-[500px] lg:hidden">
            <Image 
              src="/header-img.svg"
              alt="Philip Samuelraj"
              width={815}
              height={831}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Desktop: Fixed size */}
          <div className="hidden lg:block ">
              <Image
              src="/header-img.svg"
                alt="Philip Samuelraj"
              width={815}
              height={831}
                className="object-contain"
                priority
              />
            </div>
          </div>

        {/* Right Side Content - Scrollable */}
        <div 
          className="absolute w-[529px] h-[166px] top-[210px] left-[980px] overflow-hidden cursor-pointer"
          onClick={handleContentClick}
        >
          <div className="relative w-full h-full">
            {rightContentItems.map((item, index) => {
              const isActive = index === currentIndex;
              const isNext = index === (currentIndex + 1) % rightContentItems.length;
              
              let animationClass = '';
              if (isActive && !isAnimating) {
                // Currently visible item (not animating)
                animationClass = 'translate-y-0 opacity-100';
              } else if (isActive && isAnimating && direction === 'up') {
                // Current item sliding up and out
                animationClass = '-translate-y-full opacity-0';
              } else if (isNext) {
                // Next item: positioned below, will slide up when animating
                if (isAnimating && direction === 'up') {
                  animationClass = 'translate-y-0 opacity-100';
                } else {
                  animationClass = 'translate-y-full opacity-0';
                }
              } else {
                // All other items: positioned below (invisible)
                animationClass = 'translate-y-full opacity-0';
              }
              
              return (
                <div
                  key={index}
                  className={`absolute w-full h-full flex flex-col gap-4 transition-all duration-500 ease-in-out ${animationClass}`}
                >
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}