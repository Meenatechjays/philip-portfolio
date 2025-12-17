'use client';

export default function ToggleButton({ options, activeOption, onOptionChange }) {
  return (
    <div className="flex flex-row items-center p-1.5 bg-white rounded-[30px] gap-2.5 w-[260px] h-[60px]">
      {options.map((option) => {
        const isActive = option === activeOption;
        
        return (
          <button
            key={option}
            onClick={() => onOptionChange(option)}
            className={`
              box-border flex flex-row items-center justify-center
              font-satoshi font-medium text-sm transition-all duration-200
              h-full flex-1
              ${isActive 
                ? 'bg-[#454654] rounded-[30px] text-white' 
                : 'bg-transparent rounded-[30px] text-[#454654]'
              }
            `}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

