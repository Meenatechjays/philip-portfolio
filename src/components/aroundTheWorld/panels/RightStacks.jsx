export default function RightStacks({ stacks, active, onChange }) {
  const activeIndex = stacks.findIndex(s => s.id === active);
  
  // Left side: Show all stacks from start up to and including the active one
  // When world is active: show world (01) on left
  // When services is active: show world (01) and services (02) on left
  // When clients is active: show world (01), services (02), and clients (03) on left
  const leftStacks = stacks.slice(0, activeIndex + 1); // Always show from start to active (inclusive)
  
  // Right side: Show only stacks after the active one
  // When world is active: show services (02) and clients (03)
  // When services is active: show only clients (03)
  // When clients is active: show nothing
  const rightStacks = stacks.slice(activeIndex + 1);

  return (
    <>
      {/* Left Side - Stacks from start to active (always shown) */}
      {leftStacks.length > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex z-[5] cursor-pointer">
          {leftStacks.map((stack, idx) => (
            <button
              key={stack.id}
              onClick={() => onChange(stack.id)}
              className="w-[60px] sm:w-[70px] md:w-[80px] lg:w-[90px] h-full py-8 px-2 sm:px-3 border-l flex flex-col items-center justify-between animate-slide-in-from-right cursor-pointer"
                style={{
                  background: "linear-gradient(180deg, #DBECF6 0%, #93CDEB 100%)",
                }}
              >
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold  text-center font-heading tracking-tight leading-none font-satoshi text-[#1F2024]  flex-shrink-0">
                {stack.number}
              </div>

              {/* Vertical title from bottom to top */}
              <div 
                className="flex-1 flex items-center justify-center"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
              >
                <h4 className=" sm:text-lg md:text-xl lg:text-2xl font-bold text-[#1F2024] font-heading tracking-tight leading-none font-satoshi  whitespace-nowrap transform rotate-180 cursor-pointer">
                  {stack.title}
                </h4>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Right Side - Remaining Stacks */}
      <div className="flex self-stretch cursor-pointer">
        {rightStacks.map((stack) => (
          <button
            key={stack.id}
            onClick={() => onChange(stack.id)}
            className="w-[60px] sm:w-[70px] md:w-[80px] lg:w-[90px] h-full py-8 px-2 sm:px-3 border-l transition-all duration-300 flex flex-col items-center justify-between cursor-pointer"
            style={{
              background: "linear-gradient(180deg, #DBECF6 0%, #93CDEB 100%)",
            }}
          >
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F2024] text-center font-heading tracking-tight leading-none font-satoshi text-[#1F2024]  flex-shrink-0">
              {stack.number}
            </div>

            {/* Vertical title from bottom to top */}
            <div 
              className="flex-1 flex items-center justify-center"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            > 
                 <h4 className=" sm:text-lg md:text-xl lg:text-2xl font-bold text-[#1F2024] font-heading tracking-tight leading-none font-satoshi  whitespace-nowrap transform rotate-180 cursor-pointer">
                  {stack.title}
                </h4>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}