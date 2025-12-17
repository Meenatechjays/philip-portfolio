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
      className={`flex flex-col opacity-100 ${className}`}
      style={{
        width: '307.33px',
        height: '298px',
        borderRadius: '8px',
        padding: '16px',
        background: '#F3F4F5'
      }}
    >
      {/* Inner Content Container */}
      <div 
        className="flex flex-col opacity-100"
        style={{
          width: '275.33px',
          height: '212px',
          gap: '16px'
        }}
      >
        {/* Logo - Default to star icon if no logo provided */}
        {(logo || showStarIcon) && (
          <div>
            {logo ? (
              typeof logo === 'string' ? (
                <Image
                  src={logo}
                  alt={logoAlt}
                  width={48}
                  height={48}
                  className="object-contain"
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
                className="object-contain"
              />
            )}
          </div>
        )}

        {/* Title */}
        {title && (
          <h3 className="text-2xl md:text-3xl font-bold text-[#1F2024] font-satoshi leading-tight">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-base text-[#454654] flex-grow font-satoshi leading-relaxed">
            {description}
          </p>
        )}

        {/* Learn More Link */}
        <div className="flex items-center gap-2 mt-auto">
          <span 
            className="font-satoshi font-bold opacity-100"
            style={{
              fontSize: '16px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#2A2A2A',
              width: '103px',
              height: '22px'
            }}
          >
            {linkText}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#2A2A2A]"
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

