'use client';

import { useState } from 'react';
import Image from 'next/image';

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
      className={`${positionClass} flex flex-1 flex-col items-start p-0 w-full h-full max-w-[300px] flex-shrink-0 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={!isRelative ? {
        left: position.left,
        top: position.top
      } : {}}
    >
      {/* Card Container with rounded corners */}
      <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative flex flex-col">
        {/* Image Section */}
        {imageSrc && (
          <div className="box-border w-full flex justify-between rounded-[16px] border-2 border-white relative overflow-hidden h-[215px]">
    
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
              />
         
          </div>
        )}

        {/* Content Section - Overlapping the image */}
        <div className="box-border absolute bottom-0 left-0 right-0 flex flex-col items-start p-4 w-full h-[200px] bg-[#F4F6FF] border-2 border-white rounded-t-[24px] rounded-b-2xl z-10 overflow-hidden">
          {/* Star Icon */}
          <div 
            className="w-8 h-8 flex-shrink-0 relative cursor-pointer"
          >
            <Image
              src="/star.svg"
              alt="Star Icon"
              width={32}
              height={32}
              className="w-full h-full object-contain transition-transform duration-1000"
              style={{
                transform: isHovered ? 'rotate(360deg)' : 'rotate(0deg)',
              }}
            />
          </div>

          {/* Title */}
          {title && (
            <h3 className="font-satoshi font-semibold text-base leading-tight text-[#1F2024] line-clamp-2 pt-2">
              {title}
            </h3>
          )}

          {/* Description */}
          {description && (
            <p className="font-satoshi font-normal text-sm leading-relaxed text-[#454654] overflow-hidden line-clamp-2 pt-2">
              {description}
            </p>
          )}

          {/* Read More Link */}
          <a 
            href={readMoreLink}
            className="flex items-center font-satoshi font-medium pt-3 text-xs text-[#1F2024] hover:opacity-80 transition-opacity mt-auto"
          >
            Read more
            <Image
              src="/Arrow up.svg"
              alt="Arrow icon"
              width={14}
              height={14}
              className="inline-block mt-1 font-semibold"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

