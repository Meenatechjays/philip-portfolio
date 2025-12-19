'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortfolioHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    setCurrentIndex((prev) => (prev + 1) % rightContentItems.length);
  };

  const contentVariants = {
    initial: {
      y: '100vh',
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: 'easeInOut'
      }
    },
    exit: {
      y: '-100vh',
      opacity: 0,
      transition: {
        duration: 1,
        ease: 'easeInOut'
      }
    }
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
        {/* Logo - phil.in */}
        <div className="absolute top-6 left-6 md:left-12 z-20">
          <a href="/" className="text-xl md:text-2xl font-bold text-gray-900 hover:opacity-80 transition-opacity">
            phil.in
          </a>
        </div>

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
      </div>

      {/* Right Side Content - Framer Motion Full Height Animation */}
      <div 
        className="absolute w-[500px] top-[150px] left-[980px] h-screen  cursor-pointer z-10"
        onClick={handleContentClick}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 flex flex-col justify-start gap-4"
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
              {rightContentItems[currentIndex].title}
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-md">
              {rightContentItems[currentIndex].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}