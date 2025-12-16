import Image from 'next/image';

export default function Timeline() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background SVG */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/timeline.svg"
          alt="Timeline Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen">
        {/* Timeline Container */}
        <div className="absolute w-[671px] h-[145px] top-[100px] left-[529px] opacity-100 flex flex-col gap-4">
          {/* Timeline Heading */}
          <h2 className="w-[428px] h-[65px] opacity-100 font-satoshi font-bold text-4xl leading-[100%] tracking-[0%] text-center text-[#1F2024]">
            Timeline
          </h2>
          
          {/* Timeline Paragraph Content */}
          <p className="w-[671px] h-[64px] opacity-100 font-satoshi font-normal text-lg leading-[100%] tracking-[0%] text-center">
            Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non 
          </p>
        </div>
      </div>
    </section>
  );
}

