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
      className={`relative w-[370px] h-[460px] flex-shrink-0 overflow-hidden rounded-[28px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.18)] ${className}`}
    >
      {/* Image Section */}
      <div className="relative h-[288px] w-[370px] flex-shrink-0 overflow-hidden">
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
      <div className="relative z-10 -mt-12 rounded-t-[32px] bg-white px-6 pt-6 pb-8 shadow-[0_-12px_30px_rgba(0,0,0,0.12)]">
        {/* Icon */}
        <div className="mb-3 h-8 w-8">
          <Image
            src="/star.svg"
            alt="Icon"
            width={32}
            height={32}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Title */}
        {title && (
          <h3 className="mb-2 text-[24px] font-semibold leading-tight text-[#0F172A]">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-base leading-relaxed text-[#475569]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
