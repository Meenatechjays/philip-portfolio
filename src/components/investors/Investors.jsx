'use client';

import { useRef, useState, useEffect } from 'react';
import InvestmentCard from '../ui/InvestmentCard';
import { motion, useInView } from 'framer-motion';

export default function Investors() {
  const ref = useRef(null);
  const scrollContainerRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [isMobile, setIsMobile] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(-1);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    };

    checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Track which card is closest to viewport center on mobile
  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;

    const updateActiveCard = () => {
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;

      const cardElements = container.querySelectorAll('[data-card-index]');
      let closestIndex = 0;
      let minDistance = Infinity;

      cardElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(centerX - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = parseInt(el.dataset.cardIndex);
        }
      });

      setActiveCardIndex(closestIndex);
    };

    container.addEventListener('scroll', updateActiveCard, { passive: true });

    // Activate first card after entrance animation settles
    const timer = setTimeout(updateActiveCard, 4000);

    return () => {
      container.removeEventListener('scroll', updateActiveCard);
      clearTimeout(timer);
    };
  }, [isMobile]);

  const containerVariants = {
    hidden: {
      opacity: 1,
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 1.5,
        staggerChildren: 0.4,
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
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const cards = [
    {
      imageSrc: '/pepcare.png',
      imageAlt: 'PepCare',
      title: 'Pepcare',
      description: 'Built a web HIPPA-compliant platform to streamline scheduling, referral, and consultation services for dental practitioners.',
    },
    {
      imageSrc: '/belongy.png',
      imageAlt: 'Belongly',
      title: 'Belongly',
      description: 'A HIPAA-compliant AI matching solution that streamlines therapist connections, enhances accuracy, and accelerates user onboarding.',
    },
    {
      imageSrc: '/decerna.png',
      imageAlt: 'Decerna',
      title: 'Decerna',
      description: 'Our team created a cutting-edge emission calculation tool with multiple data interface options and instant shareability.',
    },
    {
      imageSrc: '/ameya.png',
      imageAlt: 'Ameya',
      title: 'Ameya',
      description: 'Ameya is a dual-platform healthcare application designed to connect healthcare providers with patients through an integrated digital platform.',
    },
  ];

  return (
    <section 
      className="investment-section investment-section-bg relative w-full h-full overflow-visible pb-2 flex flex-col items-center justify-center"
    >
      {/* Investment Header */}
      <div className="relative z-10 w-full max-w-[671px] flex flex-col gap-2 md:gap-4 items-center mb-2 md:mb-4 px-4 md:px-6 mx-auto">
        <h2 className="w-full section-heading text-center mx-auto">
          Investment Portfolio
        </h2>
        <p className="w-full max-w-[671px] section-body text-center mx-auto">
          Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non
        </p>
      </div>
      
      {/* Investment Cards Container */}
      <div
         ref={scrollContainerRef}
         className="overflow-x-auto hide-scrollbar mt-2 md:mt-4 investment-section-bg w-full"
         style={{
           scrollbarWidth: 'none',
           msOverflowStyle: 'none',
           scrollSnapType: isMobile ? 'x mandatory' : 'none',
         }}
      >
        <motion.div
          ref={ref}
          className={`flex items-center gap-6 md:gap-8 lg:gap-10 py-2 md:py-3 lg:py-4 bg-none ${
            isMobile ? '' : 'justify-center px-6 md:px-8 lg:px-16'
          }`}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            width: 'max-content',
            ...(isMobile ? {
              paddingLeft: 'max(24px, calc(50vw - 160px))',
              paddingRight: 'max(24px, calc(50vw - 160px))',
            } : {}),
          }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={`card-${index}`}
              data-card-index={index}
              variants={cardVariants}
              style={{
                ...(isMobile ? {} : { minWidth: '360px' }),
                flexShrink: 0,
                willChange: 'transform, opacity',
                scrollSnapAlign: isMobile ? 'center' : 'none',
                scrollSnapStop: isMobile ? 'always' : 'none',
              }}
            >
              <InvestmentCard
                imageSrc={card.imageSrc}
                imageAlt={card.imageAlt}
                title={card.title}
                description={card.description}
                isActive={isMobile && index === activeCardIndex}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

