export default function RightStacks({ stacks, active, onChange, activeIndex }) {
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
      <div className="absolute left-0 top-0 w-full h-screen pointer-events-none z-[20]">
        {stacks.map((stack, index) => {
          const styleId = `stack-${stack.id}-${activeIndex}`;

          return (
            <button
              key={stack.id}
              id={styleId}
              onClick={() => onChange(stack.id)}
              className="absolute top-0 h-full py-8 px-2 sm:px-3 border-l border-white flex flex-col items-center justify-between cursor-pointer w-[80px] sm:w-[90px] md:w-[100px] lg:w-[110px] pointer-events-auto will-change-[left]"
              style={{
                background: "linear-gradient(180deg, #DBECF6 0%, #93CDEB 100%)",
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center font-heading tracking-tight leading-none font-satoshi text-[#1F2024] flex-shrink-0">
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
      <div className="flex self-stretch h-screen pointer-events-none">
        {stacks.slice(activeIndex + 1).map((_, idx) => (
          <div
            key={`spacer-${idx}`}
            className="w-[80px] sm:w-[90px] md:w-[100px] lg:w-[110px] h-full"
          />
        ))}
      </div>
    </>
  );
}