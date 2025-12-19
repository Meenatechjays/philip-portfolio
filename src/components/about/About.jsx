'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortfolioHero({ isVisible = true }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLeftMounted, setIsLeftMounted] = useState(false);
  const [isRightMounted, setIsRightMounted] = useState(false);

  const rightContentItems = [
    {
      title: 'Investor',
      description:
        'Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non'
    },
    {
      title: 'Leader',
      description:
        'Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non'
    },
    {
      title: 'Entrepreneur',
      description:
        'Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non'
    }
  ];

  const handleContentClick = () => {
    setCurrentIndex((prev) => (prev + 1) % rightContentItems.length);
  };

  // Mount animation effects - triggered only when component becomes visible (after splash)
  useEffect(() => {
    if (!isVisible) return;

    // Show left content immediately after component becomes visible
    const leftMountTimer = setTimeout(() => {
      setIsLeftMounted(true);
    }, 100); // Small delay for smooth transition from splash

    // Show right content after 2000ms
    const rightMountTimer = setTimeout(() => {
      setIsRightMounted(true);
    }, 2000);

    return () => {
      clearTimeout(leftMountTimer);
      clearTimeout(rightMountTimer);
    };
  }, [isVisible]);

  /* ❗ Animation UNCHANGED */
  const contentVariants = {
    initial: { y: '100vh', opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 1, ease: 'easeInOut' }
    },
    exit: {
      y: '-100vh',
      opacity: 0,
      transition: { duration: 1, ease: 'easeInOut' }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0">
        <Image
          src="/Banner Blue.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute bottom-0 inset-x-0">
          <Image
            src="/Sky.png"
            alt="Sky"
            width={1920}
            height={600}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Font SVG */}
        {/* Font SVG Overlay - size preserved */}
        <div className="absolute pointer-events-none z-[5] top-[340px] left-[76px] max-xl:left-[60px] max-lg:left-[40px]">
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


        {/* Logo - Shows immediately */}
        <div 
          className={`absolute top-[32px] left-[76px] z-20 transition-all duration-700 ease-out ${
            isLeftMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <a
            href="/"
            className="text-xl md:text-2xl font-bold text-gray-900 hover:opacity-80 transition-opacity"
          >
            phil.in
          </a>
        </div>


        {/* Left Content - Shows immediately */}
        <div 
          className={`absolute w-[529px] top-[150px] left-[76px] flex flex-col gap-4 transition-all duration-700 ease-out delay-100 ${
            isLeftMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="font-sans font-bold text-6xl text-gray-900 leading-tight">
            Hey Im <br />
            Philip Samuelraj
          </h1>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl.
            Non risus semper vel est amet leo non
          </p>
        </div>


        {/* Center Image - Shows immediately */}
<div 
  className={`absolute top-1/2 left-[52%] -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out delay-200 ${
    isLeftMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
  }`}
>
  <div
    className="relative"
    style={{
      WebkitMaskImage:
        'linear-gradient(to bottom, black 75%, transparent 100%)',
      maskImage:
        'linear-gradient(to bottom, black 75%, transparent 100%)'
    }}
  >
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



        {/* ================= RIGHT CONTENT - Delayed 2000ms, Slides from Bottom ================= */}
        <div
          className={`absolute w-[500px] left-[980px] cursor-pointer z-10 transition-all duration-1000 ease-out ${
            isRightMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
          }`}
          style={{ top: '230px' }}
          onClick={handleContentClick}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 flex flex-col gap-4"
            >
              <h2 className="text-[clamp(1.4rem,2.2vw,1.9rem)] font-bold text-gray-800">
                {rightContentItems[currentIndex].title}
              </h2>
              <p className="text-[clamp(0.9rem,1.2vw,1rem)] text-gray-600 leading-relaxed">
                {rightContentItems[currentIndex].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>

  );
}
