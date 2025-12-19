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
      className="relative w-full min-h-screen overflow-hidden investment-section pb-32" 
      style={{ 
        backgroundColor: 'rgb(247, 247, 247)',
        background: 'rgb(247, 247, 247)',
      }}
    >
      {/* Investment Section Background */}
      <div
        className="absolute investment-section-bg"
        style={{
          width: '1728px',
          height: '1016px',
          left: 'calc(50% - 1728px/2 - 1990px)',
          top: '20px',
          backgroundColor: 'rgb(247, 247, 247)',
          background: 'rgb(247, 247, 247)',
          zIndex: 0,
          isolation: 'isolate',
          willChange: 'auto',
        }}
      />
      
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

