export default function RightStacks({ stacks, active, onChange }) {
  const activeIndex = stacks.findIndex(s => s.id === active);
  const isWorldActive = active === "world";
  
  // Left side: Show all stacks from start up to and including the active one (except when world is active)
  // When services is active: show world (01) and services (02) on left
  // When clients is active: show world (01) and services (02) on left
  const leftStacks = isWorldActive 
    ? [] // Don't show anything on left when world is active
    : stacks.slice(0, activeIndex + 1); // Show all stacks from start to active (inclusive)
  
  // Right side: Show only stacks after the active one
  // When world is active: show services (02) and clients (03)
  // When services is active: show only clients (03)
  // When clients is active: show nothing
  const rightStacks = stacks.slice(activeIndex + 1);

  return (
    <>
      {/* Left Side - Stacks from start to active (only when not world) */}
      {!isWorldActive && leftStacks.length > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex z-20">
          {leftStacks.map((stack) => (
            <button
              key={stack.id}
              onClick={() => onChange(stack.id)}
              className="w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px] h-full pt-8 px-4 sm:px-6 md:px-8 pb-8 text-left border-l transition-all duration-300 flex flex-col items-start"
              style={{
                background: "linear-gradient(180deg, #DBECF6 0%, #93CDEB 100%)",
              }}
            >
              <div className="text-3xl font-bold mb-6 text-[#1F2024]">
                {stack.number}
              </div>

              <h3 className="text-lg font-semibold mb-4 text-[#1F2024]">
                {stack.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {stack.description}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Right Side - Remaining Stacks */}
      <div className="flex">
        {rightStacks.map((stack) => (
          <button
            key={stack.id}
            onClick={() => onChange(stack.id)}
            className="w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px] pt-8 px-4 sm:px-6 md:px-8 pb-8 text-left border-l transition-all duration-300 flex flex-col items-start"
            style={{
              background: "linear-gradient(180deg, #DBECF6 0%, #93CDEB 100%)",
            }}
          >
            <div className="text-3xl font-bold mb-6 text-[#1F2024]">
              {stack.number}
            </div>

            <h3 className="text-lg font-semibold mb-4 text-[#1F2024]">
              {stack.title}
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed">
              {stack.description}
            </p>
          </button>
        ))}
      </div>
    </>
  );
}