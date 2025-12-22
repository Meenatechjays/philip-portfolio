'use client';

import InvestmentCard from '../ui/InvestmentCard';
import { motion } from 'framer-motion';
import { useRef } from 'react';

export default function Investors() {
  const scrollContainerRef = useRef(null);
  const cardRefs = useRef({});
  const containerVariants = {
    hidden: {
      opacity: 1,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0,
      },
    },
  };

  const cardVariants = {
    hidden: {
      x: 800,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 1.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const cards = [
    {
      imageSrc: '/pepcare.png',
      imageAlt: 'PepCare',
      title: 'Pepcare',
      description: 'Built a web HIPPA-compliant platform to streamline scheduling.',
    },
    {
      imageSrc: '/belongy.png',
      imageAlt: 'Belongly',
      title: 'Belongly',
      description: 'A HIPAA-compliant AI matching solution that streamlines therapist connections, enhances',
    },
    {
      imageSrc: '/decerna.png',
      imageAlt: 'Decerna',
      title: 'Decerna',
      description: 'Our team created a cutting-edge emission calculation tool with multiple data interface',
    },
    {
      imageSrc: '/ameya.png',
      imageAlt: 'Ameya',
      title: 'Ameya',
      description: 'Ameya is a du designed to o',
    },
  ];

  // Generic handler to scroll card into full view when partially visible
  const handleCardHover = (index) => {
    if (scrollContainerRef.current && cardRefs.current[index]) {
      const container = scrollContainerRef.current;
      const card = cardRefs.current[index];
      
      // Get positions
      const containerRect = container.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      
      // Check if card is partially visible on left side (left edge is cut off)
      const isLeftCutOff = cardRect.left < containerRect.left;
      // Check if card is partially visible on right side (right edge is cut off)
      const isRightCutOff = cardRect.right > containerRect.right;
      
      // Only scroll if card is partially hidden
      if (!isLeftCutOff && !isRightCutOff) {
        return;
      }
      
      // Calculate card's position relative to scroll container content
      const cardLeftRelativeToContent = cardRect.left - containerRect.left + container.scrollLeft;
      const cardWidth = cardRect.width;
      const containerWidth = containerRect.width;
      let scrollPosition;
      
      if (isLeftCutOff) {
        // Card is partially hidden on left, scroll to show full card from left with padding
        scrollPosition = cardLeftRelativeToContent - 40; // 40px padding from left
      } else if (isRightCutOff) {
        // Card is partially hidden on right
        if (cardWidth > containerWidth) {
          // Card is wider than container, align right edge
          const cardRightRelativeToContent = cardLeftRelativeToContent + cardWidth;
          scrollPosition = cardRightRelativeToContent - containerWidth + 40; // 40px padding from right
        } else {
          // Card fits in container, align left edge with padding
          scrollPosition = cardLeftRelativeToContent - 40; // 40px padding from left
        }
      }
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section 
      className="relative w-full min-h-screen overflow-hidden investment-section pb-32 md:pb-40 lg:pb-48" 
      style={{ 
        backgroundColor: 'rgb(247, 247, 247)',
        background: 'rgb(247, 247, 247)',
      }}
    >
      {/* Investment Header */}
      <div
        className="absolute z-10"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0px',
          gap: '16px',
          width: '671px',
          height: '145px',
          left: 'calc(50% - 671px/2 + 0.5px)',
          top: '100px',
        }}
      >
        {/* Investment Heading */}
        <h2 className="w-[428px] h-[65px] opacity-100 font-satoshi font-bold text-4xl leading-[100%] tracking-[0%] text-center text-[#1F2024]">
          Investment portfolio
        </h2>
        
        {/* Investment Paragraph Content */}
        <p className="w-[671px] h-[64px] opacity-100 font-satoshi font-normal text-lg leading-[100%] tracking-[0%] text-center text-[#454654]">
          Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non
        </p>
      </div>
      
      {/* Investment Cards Container */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 w-full overflow-x-auto pb-32"
        style={{ marginTop: '300px' }}
      >
        <motion.div 
          className="flex gap-8 px-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={`card-${index}`}
              ref={(el) => {
                if (el) cardRefs.current[index] = el;
              }}
              onMouseEnter={() => handleCardHover(index)}
              variants={cardVariants}
              style={{
                minWidth: '400px',
                flexShrink: 0,
                willChange: 'transform, opacity',
              }}
            >
              <InvestmentCard
                imageSrc={card.imageSrc}
                imageAlt={card.imageAlt}
                title={card.title}
                description={card.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}

