'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function HighlightsCard({ 
  imageSrc,
  imageAlt = 'Highlight image',
  title, 
  description, 
  readMoreLink = '#',
  position = { left: '122px', top: '401px' },
  className = ''
}) {
  const [isHovered, setIsHovered] = useState(false);

  const isRelative = className.includes('relative') || (position.left === '0' && position.top === '0');
  const positionClass = isRelative ? 'relative' : 'absolute';
  
  return (
    <div 
      className={`${positionClass} flex flex-col items-start p-0 w-[341px] h-[497px] flex-shrink-0 ${className}`}
      style={!isRelative ? {
        left: position.left,
        top: position.top
      } : {}}
    >
      {/* Card Container with rounded corners */}
      <div className="w-full h-full bg-white rounded-2xl overflow-visible relative">
        {/* Image Section */}
        {imageSrc && (
          <div className="box-border w-[341px] h-[267px] flex justify-between rounded-[24px] p-4 border-2 border-white relative overflow-hidden">
            <div className="absolute inset-4 rounded-[20px] overflow-hidden">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Content Section - Overlapping the image */}
        <div className="box-border absolute bottom-0 left-0 right-0 flex flex-col items-start p-4 gap-4 w-full h-[270px] bg-[#F4F6FF] border-2 border-white rounded-[24px] z-10">
          {/* Star Icon */}
          <div 
            className="w-12 h-12 flex-shrink-0 relative cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered ? (
              <DotLottieReact
                src="/Rotating star.lottie"
                loop
                autoplay
                className="w-full h-full"
              />
            ) : (
              <Image
                src="/star.svg"
                alt="Star Icon"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Title */}
          {title && (
            <h3 className="font-satoshi font-bold text-xl leading-tight text-[#1F2024]">
              {title}
            </h3>
          )}

          {/* Description */}
          {description && (
            <p className="font-satoshi font-normal text-base leading-relaxed text-[#454654] flex-grow">
              {description}
            </p>
          )}

          {/* Read More Link */}
          <a 
            href={readMoreLink}
            className="flex items-center gap-2 font-satoshi font-medium text-sm text-[#1F2024] hover:opacity-80 transition-opacity mt-auto"
          >
            Read more
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block"
            >
              <path 
                d="M6 12L10 8L6 4" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

