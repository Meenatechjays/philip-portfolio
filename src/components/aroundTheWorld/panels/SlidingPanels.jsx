import World from "./World";
import Services from "./Services";
import Clients from "./Clients";

const PANELS = {
  world: <World />,
  services: <Services />,
  clients: <Clients />,
};

export default function SlidingPanels({ stacks, active }) {
  const index = stacks.findIndex(s => s.id === active);
  
  // Calculate left margin based on active stack
  // Stack width: w-[80px] sm:w-[90px] md:w-[100px] lg:w-[110px]
  // When world is active: 1 left stack (world itself)
  // When services is active: 2 left stacks (world + services)
  // When clients is active: 3 left stacks (world + services + clients)
  const leftStackCount = index + 1; // Always count from 0 to current index (inclusive)
  
  // Generate unique ID for this component instance to scope the styles
  const styleId = `sliding-panels-${leftStackCount}`;
  
  // Calculate exact margins for each breakpoint
  // Stack widths: 80px (base), 90px (sm), 100px (md), 110px (lg)
  const margins = {
    base: leftStackCount * 80,   // < 640px
    sm: leftStackCount * 90,     // >= 640px
    md: leftStackCount * 100,     // >= 768px
    lg: leftStackCount * 110,     // >= 1024px
    xl: leftStackCount * 110      // >= 1200px
  };

  return (
    <>
      {/* Inject responsive styles for precise margin matching */}
      {leftStackCount > 0 && (
        <style dangerouslySetInnerHTML={{
          __html: `
            #${styleId} {
              margin-left: ${margins.base}px;
              width: calc(100% - ${margins.base}px);
            }
            @media (min-width: 640px) {
              #${styleId} {
                margin-left: ${margins.sm}px;
                width: calc(100% - ${margins.sm}px);
              }
            }
            @media (min-width: 768px) {
              #${styleId} {
                margin-left: ${margins.md}px;
                width: calc(100% - ${margins.md}px);
              }
            }
            @media (min-width: 1024px) {
              #${styleId} {
                margin-left: ${margins.lg}px;
                width: calc(100% - ${margins.lg}px);
              }
            }
            @media (min-width: 1200px) {
              #${styleId} {
                margin-left: ${margins.xl}px;
                width: calc(100% - ${margins.xl}px);
              }
            }
          `
        }} />
      )}
      <div 
        id={styleId}
        className="overflow-x-hidden relative z-10 transition-all duration-[2000ms] ease-in-out"
        style={leftStackCount === 0 ? { width: '100%' } : {}}
      >
        <div
          className="flex transition-transform duration-[2000ms] ease-in-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {stacks.map((stack) => (
            <div
              key={stack.id}
              className="w-full flex-shrink-0 relative"
              style={{ minWidth: '100%' }}
            >
              <div className={`w-full py-1 ${
                stack.id === 'world' 
                  ? 'pl-4 sm:pl-6 md:pl-8 lg:pl-10 xl:pl-12 2xl:pl-16 pr-0' 
                  : 'px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16'
              }`}>
                {PANELS[stack.id]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}