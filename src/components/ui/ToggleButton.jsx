'use client';

export default function ToggleButton({ options, activeOption, onOptionChange }) {
  return (
    <div className="flex flex-row items-center p-0 bg-white rounded-full gap-0 w-full max-w-[250px] h-[44px]">
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
              gap-1 h-[44px] max-w-[125px] flex-1 min-w-0 self-stretch px-3 whitespace-nowrap

              ${isActive 
                ? 'bg-[#454654] border border-white rounded-[24px] text-white' 
                : 'bg-white rounded-lg text-[#454654]'
              }
              ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
            `}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

