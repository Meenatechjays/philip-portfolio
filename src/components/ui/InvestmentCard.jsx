'use client';

import Image from 'next/image';

export default function InvestmentCard({
  imageSrc,
  imageAlt = 'Investment company',
  title,
  description,
  className = '',
}) {
  return (
    <div
      className={`relative w-[464px] h-[576px] overflow-hidden rounded-[28px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.18)] ${className}`}
    >
      {/* Image Section */}
      <div className="relative h-[360px] w-full overflow-hidden">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Bridge Gradient */}
        <div
          className="pointer-events-none absolute"
          style={{
            width: '752px',
            height: '601px',
            top: '179px',
            left: '-163px',
            background: '#FEFEFE',
            opacity: 1,
            filter: 'blur(96.7px)',
          }}
        />
      </div>

      {/* Content Section */}
      <div className="relative z-10 -mt-14 rounded-t-[32px] bg-white px-8 pt-8 pb-10 shadow-[0_-12px_30px_rgba(0,0,0,0.12)]">
        {/* Icon */}
        <div className="mb-4 h-10 w-10">
          <Image
            src="/star.svg"
            alt="Icon"
            width={40}
            height={40}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Title */}
        {title && (
          <h3 className="mb-3 text-[28px] font-semibold leading-tight text-[#0F172A]">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-lg leading-relaxed text-[#475569]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
