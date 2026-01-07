'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function InvestmentCard({
  imageSrc,
  imageAlt = 'Investment company',
  title,
  description,
  className = '',
}) {
  const [isHovered, setIsHovered] = useState(false);
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
      y: 0,
      opacity: 1,
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
      className={`relative w-[360px] h-[400px] md:h-[420px] lg:h-[440px] overflow-hidden rounded-[28px] ${className}`}
      initial="initial"
      whileHover="hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        className="absolute bottom-0 left-0 right-0 z-10 px-6 pt-8 pb-6 bg-white"
        variants={contentVariants}
      >
        {/* Star Icon - Rotates smoothly to -180deg on hover */}
        <motion.div
          className="mb-3 h-8 w-8 relative z-20"
          variants={starVariants}
        >
          <Image
            src="/star.svg"
            alt="Icon"
            width={32}
            height={32}
            className="h-full w-full object-contain"
          />
        </motion.div>

        {/* Title */}
        {title && (
          <h3 className="mb-2 text-xl md:text-2xl font-semibold leading-tight text-[#1F2024] relative z-20">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className={`text-xs md:text-sm font-satoshi text-[#454654] relative z-20 transition-all duration-300 leading-relaxed ${
            !isHovered ? 'line-clamp-2' : ''
          }`}>
            {description}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
