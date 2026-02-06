'use client';

import World from "./World";
import Services from "./Services";
import Clients from "./Clients";

const PANELS = {
  world: <World />,
  services: <Services />,
  clients: <Clients />,
};

export default function RightStacks({ stacks, active, onChange, activeIndex, openAccordions }) {
  const toggleAccordion = (stackId) => {
    onChange(stackId);
  };

  // Calculate stack widths for responsive positioning
  const getStackWidth = (breakpoint = 'base') => {
    const widths = {
      base: 80,
      sm: 90,
      md: 100,
      lg: 110,
    };
    return widths[breakpoint] || widths.base;
  };

  return (
    <>
      {/* Mobile/Tablet Accordion (max-width: 1024px) */}
      <div className="lg:hidden relative w-full min-h-full z-[20]">
        <div className="flex flex-col w-full">
          {stacks.map((stack, index) => {
            const isOpen = openAccordions[stack.id];
            const isActive = active === stack.id;

            return (
              <div
                key={stack.id}
              >
                <button
                  onClick={() => toggleAccordion(stack.id)}
                  className="w-full bg-gradient-to-b from-[#DBECF6] to-[#93CDEB] border-b border-white/50 flex items-center justify-between px-4 py-6 transition-all duration-300"
                  style={{
                    minHeight: '80px',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl sm:text-3xl font-bold font-satoshi text-[#1F2024]">
                      {stack.number}
                    </span>
                    <h4 className="text-base sm:text-lg md:text-xl font-bold font-satoshi text-[#1F2024]">
                      {stack.title}
                    </h4>
                  </div>
                  <svg
                    className={`w-6 h-6 text-[#1F2024] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Accordion Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="bg-white px-4 py-6">
                    {PANELS[stack.id] && (
                      <div className="w-full">
                        {PANELS[stack.id]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Stacks (min-width: 1024px) */}
      <>
        {/* Consolidated style tag for all stacks - synchronized with content */}
        <style dangerouslySetInnerHTML={{
          __html: stacks.map((stack, index) => {
            const isLeftSide = index <= activeIndex;
            const rightIndex = isLeftSide ? null : index - (activeIndex + 1);
            const totalRightStacks = stacks.length - (activeIndex + 1);
            const positionFromRight = isLeftSide ? 0 : (totalRightStacks - 1 - rightIndex);
            const styleId = `stack-${stack.id}-${activeIndex}`;
            
            const baseWidth = getStackWidth('base');
            const smWidth = getStackWidth('sm');
            const mdWidth = getStackWidth('md');
            const lgWidth = getStackWidth('lg');
            
            return `
              #${styleId} {
                left: ${isLeftSide ? `${index * baseWidth}px` : `calc(100vw - ${(positionFromRight + 1) * baseWidth}px)`};
                transition: left 2000ms ease-in-out;
              }
              @media (min-width: 640px) {
                #${styleId} {
                  left: ${isLeftSide ? `${index * smWidth}px` : `calc(100vw - ${(positionFromRight + 1) * smWidth}px)`};
                }
              }
              @media (min-width: 768px) {
                #${styleId} {
                  left: ${isLeftSide ? `${index * mdWidth}px` : `calc(100vw - ${(positionFromRight + 1) * mdWidth}px)`};
                }
              }
              @media (min-width: 1024px) {
                #${styleId} {
                  left: ${isLeftSide ? `${index * lgWidth}px` : `calc(100vw - ${(positionFromRight + 1) * lgWidth}px)`};
                }
              }
            `;
          }).join('')
        }} />
        
        {/* All stacks in one container - moves as rigid group with content */}
        <div className="hidden lg:block absolute left-0 top-0 w-full h-full pointer-events-none z-[20]">
          {stacks.map((stack, index) => {
            const styleId = `stack-${stack.id}-${activeIndex}`;

            return (
              <button
                key={stack.id}
                id={styleId}
                onClick={() => onChange(stack.id)}
                className="absolute top-0 h-full py-9 px-2 sm:px-3 border-l border-white flex flex-col items-center justify-between cursor-pointer w-[80px] sm:w-[90px] md:w-[100px] lg:w-[110px] pointer-events-auto will-change-[left]"
                style={{
                  background: "linear-gradient(180deg, #DBECF6 0%, #93CDEB 100%)",
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-center font-heading tracking-tight leading-none font-satoshi text-[#1F2024] flex-shrink-0">
                  {stack.number}
                </div>

                <div 
                  className="flex-1 flex items-center justify-center"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  <h4 className="sm:text-lg md:text-xl lg:text-2xl font-bold text-[#1F2024] font-heading tracking-tight leading-none font-satoshi whitespace-nowrap transform rotate-180 cursor-pointer">
                    {stack.title}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Spacer to maintain layout - same width as right-side stacks */}
        <div className="hidden lg:flex self-stretch h-full pointer-events-none">
          {stacks.slice(activeIndex + 1).map((_, idx) => (
            <div
              key={`spacer-${idx}`}
              className="w-[80px] sm:w-[90px] md:w-[100px] lg:w-[110px] h-full"
            />
          ))}
        </div>
      </>
    </>
  );
}