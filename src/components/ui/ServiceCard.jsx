import Image from 'next/image';

export default function ServiceCard({
  logo,
  logoAlt = "Service logo",
  title,
  description,
  linkText = "Learn More",
  onClick,
  href,
  className = "",
  showStarIcon = true
}) {
  const content = (
    <div 
      className={`group flex flex-col opacity-100 w-full min-w-0 rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 bg-[#F3F4F5]  ${className}`}
    >
      {/* Inner Content Container */}
      <div className="flex flex-col opacity-100 flex-1 min-h-0 gap-2 sm:gap-3 md:gap-4">
        {/* Logo - Default to star icon if no logo provided */}
        {(logo || showStarIcon) && (
          <div className="flex-shrink-0">
            {logo ? (
              typeof logo === 'string' ? (
                <Image
                  src={logo}
                  alt={logoAlt}
                  width={48}
                  height={48}
                  className="object-contain w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                />
              ) : (
                logo
              )
            ) : (
              <Image
                src="/star.svg"
                alt="Service icon"
                width={48}
                height={48}
                className="object-contain w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-transform duration-300 ease-in-out group-hover:rotate-180"
              />
            )}
          </div>
        )}

        {/* Title */}
        {title && (
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-[#1F2024] font-satoshi leading-tight flex-shrink-0 break-words">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-xs sm:text-sm md:text-base text-[#454654] flex-grow font-satoshi leading-relaxed break-words overflow-hidden">
            {description}
          </p>
        )}

        {/* Learn More Link */}
        <div className="flex items-center gap-2 mt-auto flex-shrink-0">
          <span className="font-satoshi font-bold text-sm sm:text-base text-[#2A2A2A] whitespace-nowrap">
            {linkText}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#2A2A2A] flex-shrink-0"
          >
            <path
              d="M5 15L15 5M15 5H7M15 5V13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="text-left w-full">
        {content}
      </button>
    );
  }

  return content;
}

