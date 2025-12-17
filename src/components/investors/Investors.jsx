'use client';

import InvestmentCard from '../ui/InvestmentCard';

export default function Investors() {
  return (
    <section 
      className="relative w-full min-h-screen overflow-hidden investment-section" 
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
      {/* Investment Cards Container */}
<div
  className="relative z-10 w-full overflow-x-auto"
  style={{ marginTop: '300px' }}
>
  <div className="flex gap-8 px-10">
    <InvestmentCard
      imageSrc="/pepcare.png"
      imageAlt="PepCare"
      title="Pepcare"
      description="Built a web HIPPA-compliant platform to streamline scheduling."
    />

    <InvestmentCard
      imageSrc="/belongy.png"
      imageAlt="Belongly"
      title="Belongly"
      description="A HIPAA-compliant AI matching solution that streamlines therapist connections, enhances"
    />

    <InvestmentCard
      imageSrc="/decerna.png"
      imageAlt="Decerna"
      title="Decerna"
      description="Our team created a cutting-edge emission calculation tool with multiple data interface"
    />

    <InvestmentCard
      imageSrc="/ameya.png"
      imageAlt="Ameya"
      title="Ameya"
      description="Ameya is a du designed to o"
    />
  </div>
</div>

    </section>
  );
}

