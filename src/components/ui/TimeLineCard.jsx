import Image from 'next/image';

export default function TimeLineCard({ 
  imageSrc, 
  imageAlt = 'Timeline event',
  title,
  description,
  year,
  position = { left: '363px', top: '357px' }
}) {
  return (
    <div 
      className="absolute flex flex-row items-center p-0 z-30 w-[1013.84px] h-[390px]"
      style={{
        left: position.left,
        top: position.top,
      }}
    >
      {/* Event Image */}
      <div className="relative w-[637.84px] h-[390px] z-20">
        <div className="relative w-full h-full rounded-[28.8889px] overflow-hidden bg-black/10">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Year Overlay - Bottom Left Corner */}
          {year && (
            <div className="absolute w-[265px] h-[156px] top-[233.52px] left-[26.48px] font-satoshi font-bold text-white opacity-100 z-30 text-[115.56px] leading-[100%] tracking-[0%]">
              {year}
            </div>
          )}
        </div>
      </div>

      {/* Event Description - At the right end of the image */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[496px] h-[203px] flex flex-col items-start p-6 gap-4 bg-white/86 rounded-3xl z-20">
        <h3 className="font-satoshi font-bold text-2xl text-[#1F2024]">
          {title}
        </h3>
        <p className="font-satoshi font-normal text-base text-[#454654] leading-relaxed">
          {description}
        </p>
      </div>

    </div>
  );
}

