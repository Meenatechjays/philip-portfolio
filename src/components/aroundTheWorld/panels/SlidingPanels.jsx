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
  const isWorldActive = active === "world";
  
  // Calculate left margin based on active stack
  // Stack width: w-[100px] sm:w-[120px] md:w-[140px] lg:w-[150px]
  // When services is active: 1 left stack (world)
  // When clients is active: 2 left stacks (world + services)
  const leftStackCount = isWorldActive ? 0 : index;
  
  // Generate unique ID for this component instance to scope the styles
  const styleId = `sliding-panels-${leftStackCount}`;
  
  // Calculate exact margins for each breakpoint
  // Stack widths: 60px (base), 70px (sm), 80px (md), 90px (lg)
  const margins = {
    base: leftStackCount * 60,   // < 640px
    sm: leftStackCount * 70,     // >= 640px
    md: leftStackCount * 80,     // >= 768px
    lg: leftStackCount * 90,     // >= 1024px
    xl: leftStackCount * 90      // >= 1200px
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
        className="overflow-x-hidden overflow-y-auto min-h-screen relative z-10 transition-all duration-700 ease-in-out"
        style={leftStackCount === 0 ? { width: '100%' } : {}}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {stacks.map((stack) => (
            <div
              key={stack.id}
              className="w-full flex-shrink-0 min-h-screen relative overflow-hidden"
              style={{ minWidth: '100%' }}
            >
              <div className="absolute right-0 top-0 w-[calc(100%-120px)] sm:w-[calc(100%-140px)] md:w-[calc(100%-160px)] lg:w-[calc(100%-180px)] xl:w-[calc(100%-200px)] h-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-12 sm:pb-16 md:pb-20 lg:pb-24 overflow-y-auto">
                {PANELS[stack.id]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}