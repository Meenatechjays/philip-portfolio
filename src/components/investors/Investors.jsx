'use client';

import InvestmentCard from '../ui/InvestmentCard';
import { motion } from 'framer-motion';

export default function Investors() {
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

  return (
    <section 
      className="investment-section investment-section-bg relative w-full overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      {/* Investment Header */}
      <div className="relative z-10 flex flex-col items-center text-center gap-4 px-6 max-w-3xl mx-auto">
        <h2 className="heading-h2 text-center">
          Investment portfolio
        </h2>
        <p className="font-satoshi font-normal text-base sm:text-lg leading-[130%] tracking-[0%] text-center text-[#454654]">
          Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non
        </p>
      </div>
      
      {/* Investment Cards Container */}
      <div
         className=" overflow-x-auto hide-scrollbar mt-6  "
      >
        <motion.div 
          className="flex gap-6 sm:gap-8 px-6 sm:px-10  "
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={`card-${index}`}
              variants={cardVariants}
              style={{
                minWidth: '500px',
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

