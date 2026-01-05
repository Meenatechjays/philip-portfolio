'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function InvestmentCard({
  imageSrc,
  imageAlt = 'Investment company',
  title,
  description,
  className = '',
}) {
  // Animation variants
  const imageVariants = {
    initial: {
      scale: 1,
      opacity: 1,
    },
    hover: {
      scale: 1.08,
      opacity: 0.75,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const contentVariants = {
    initial: {
      y: 60,
      opacity: 0.6,
    },
    hover: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const starVariants = {
    initial: {
      rotate: 0,
    },
    hover: {
      rotate: -180,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      className={`relative w-[400px] h-[500px] md:h-[540px] lg:h-[576px] overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.18)] ${className}`}
      initial="initial"
      whileHover="hover"
    >
      {/* Image Layer - Always visible, scales and fades on hover */}
      <div className="absolute inset-0 w-full h-full">
        {imageSrc && (
          <motion.div
            className="absolute inset-0 w-full h-full"
            variants={imageVariants}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        )}

        {/* Simple gradient fade - Only at bottom, no blur */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-[5]"
          style={{
            height: '45%',
            background: `linear-gradient(
              to bottom,
              transparent 0%,
              rgba(255, 255, 255, 0.2) 30%,
              rgba(255, 255, 255, 0.5) 60%,
              rgba(255, 255, 255, 0.8) 85%,
              rgba(255, 255, 255, 0.95) 100%
            )`,
          }}
        />
      </div>

      {/* Content Layer - Slides up and fades in on hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10 px-8 pt-12 pb-10"
        variants={contentVariants}
        style={{
          background: `linear-gradient(
            to top,
            rgba(255, 255, 255, 0.98) 0%,
            rgba(255, 255, 255, 0.95) 15%,
            rgba(255, 255, 255, 0.88) 30%,
            rgba(255, 255, 255, 0.75) 45%,
            rgba(255, 255, 255, 0.6) 60%,
            rgba(255, 255, 255, 0.4) 75%,
            rgba(255, 255, 255, 0.2) 85%,
            transparent 100%
          )`,
          backdropFilter: 'blur(12px) saturate(150%)',
          WebkitBackdropFilter: 'blur(12px) saturate(150%)',
        }}
      >
        {/* Star Icon - Rotates smoothly to -180deg on hover */}
        <motion.div
          className="mb-4 h-10 w-10 relative z-20"
          variants={starVariants}
        >
          <Image
            src="/star.svg"
            alt="Icon"
            width={40}
            height={40}
            className="h-full w-full object-contain"
          />
        </motion.div>

        {/* Title */}
        {title && (
          <h3 className="mb-3 text-[28px] font-semibold leading-tight text-[#1F2024] relative z-20">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-lg sm:text-base md:text-lg lg:text-xl font-satoshi  text-[#454654] relative z-20">
            {description}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
