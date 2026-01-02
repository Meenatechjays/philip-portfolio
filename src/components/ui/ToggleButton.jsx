'use client';

export default function ToggleButton({ options, activeOption, onOptionChange }) {
  return (
    <div className="flex flex-row items-center bg-white rounded-full gap-0 w-full max-w-[250px] h-[44px]">
      {options.map((option) => {
        const isActive = option === activeOption;
        const isDisabled = option === 'Podcasts';
        
        return (
          <button
            key={option}
            onClick={() => !isDisabled && onOptionChange(option)}
            disabled={isDisabled}
            className={`
              box-border flex flex-row items-center justify-center

              font-inter font-medium text-sm font-weight-600 transition-all duration-200 
              gap-1 h-[44px] max-w-[150px] flex-1 min-w-0 self-stretch whitespace-nowrap

              ${isActive 
                ? 'bg-[#112643] border border-white rounded-[24px] text-white px-6' 
                : 'bg-white rounded-lg text-[#112643]'
              }
              ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer px-5'}
            `}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

