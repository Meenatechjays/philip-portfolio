'use client';

export default function ToggleButton({ options, activeOption, onOptionChange }) {
  return (
    <div className="flex flex-row items-center p-0 bg-white rounded-full gap-3 w-[248px] h-12">
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
              p-4 gap-2 h-12 flex-none self-stretch grow-0
              ${isActive 
                ? 'bg-[#454654] border border-white rounded-[24px] text-white w-[141px]' 
                : 'bg-white rounded-lg text-[#454654] w-[95px]'
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

