'use client';

import { useRef } from 'react';
import InvestmentCard from '../ui/InvestmentCard';
import { motion, useInView } from 'framer-motion';

export default function Investors() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

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
         className="overflow-x-auto hide-scrollbar mt-2 md:mt-4 investment-section-bg w-full"
         style={{
           scrollbarWidth: 'none',
           msOverflowStyle: 'none',
         }}
      >
        <motion.div 
          ref={ref}
          className="flex gap-6 md:gap-8 lg:gap-10 px-6 md:px-8 lg:px-16 py-2 md:py-3 lg:py-4 bg-none"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            width: 'max-content',
          }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={`card-${index}`}
              variants={cardVariants}
              style={{
                minWidth: '360px',
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

