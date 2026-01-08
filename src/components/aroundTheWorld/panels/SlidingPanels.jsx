import { useMemo } from "react";
import World from "./World";
import Services from "./Services";
import Clients from "./Clients";

const PANELS = {
  world: <World />,
  services: <Services />,
  clients: <Clients />,
};

export default function SlidingPanels({ stacks, active, previousIndex = 0, activeIndex = 0 }) {
  // Use provided activeIndex or calculate it
  const validIndex = useMemo(() => {
    if (activeIndex !== undefined && activeIndex >= 0) {
      return activeIndex;
    }
    const index = stacks.findIndex(s => s.id === active);
    return index >= 0 ? index : 0;
  }, [stacks, active, activeIndex]);
  
  const index = validIndex;
  
  // Simple check: if panel is between previous and current (and not equal to either), hide it
  const shouldHidePanel = (idx) => {
    if (previousIndex === validIndex) return false; // Not transitioning
    const minIdx = Math.min(previousIndex, validIndex);
    const maxIdx = Math.max(previousIndex, validIndex);
    return idx > minIdx && idx < maxIdx; // Between previous and current, exclusive
  };
  
  // Calculate left margin based on active stack - synchronized with stack positions
  // Stack width: w-[80px] sm:w-[90px] md:w-[100px] lg:w-[110px]
  // When world is active: 1 left stack (world itself)
  // When services is active: 2 left stacks (world + services)
  // When clients is active: 3 left stacks (world + services + clients)
  const leftStackCount = validIndex + 1; // Always count from 0 to current index (inclusive)
  
  // Generate unique ID for this component instance to scope the styles
  const styleId = `sliding-panels-${leftStackCount}`;
  
  // Calculate exact margins for each breakpoint - must match stack widths exactly
  // Content starts exactly after the rightmost left-side stack (0px gap)
  // Rightmost stack position: validIndex * stackWidth
  // Content margin: (validIndex + 1) * stackWidth (right after the stack)
  // Stack widths: 80px (base), 90px (sm), 100px (md), 110px (lg)
  const margins = {
    base: leftStackCount * 80,   // < 640px
    sm: leftStackCount * 90,     // >= 640px
    md: leftStackCount * 100,     // >= 768px
    lg: leftStackCount * 110,     // >= 1024px
    xl: leftStackCount * 110      // >= 1200px
  };
  
  // Calculate the rightmost left-side stack's right edge position
  // This ensures content left = stack right edge (0px gap, fixed)
  // The active stack (at validIndex) has its right edge at: (validIndex * stackWidth) + stackWidth
  // Content must start exactly at this position to maintain 0px gap
  // Both stack and content use the same transition timing to move as one rigid unit
  const rightmostStackRightEdge = {
    base: (validIndex * 80) + 80,   // active stack left + stack width = right edge
    sm: (validIndex * 90) + 90,
    md: (validIndex * 100) + 100,
    lg: (validIndex * 110) + 110,
    xl: (validIndex * 110) + 110,
  };

  return (
    <>
      {/* Inject responsive styles - content positioned exactly at active stack's right edge (0px gap) */}
      {/* Content and stack move together as one rigid unit with synchronized transitions */}
      {leftStackCount > 0 && (
        <style dangerouslySetInnerHTML={{
          __html: `
            #${styleId} {
              position: absolute;
              left: ${rightmostStackRightEdge.base}px;
              top: 0;
              width: calc(100vw - ${rightmostStackRightEdge.base}px);
              min-height: 100vh;
              transition: left 2000ms cubic-bezier(0.4, 0, 0.2, 1), width 0ms;
            }
            @media (min-width: 640px) {
              #${styleId} {
                left: ${rightmostStackRightEdge.sm}px;
                width: calc(100vw - ${rightmostStackRightEdge.sm}px);
                min-height: 100vh;
              }
            }
            @media (min-width: 768px) {
              #${styleId} {
                left: ${rightmostStackRightEdge.md}px;
                width: calc(100vw - ${rightmostStackRightEdge.md}px);
                min-height: 100vh;
              }
            }
            @media (min-width: 1024px) {
              #${styleId} {
                left: ${rightmostStackRightEdge.lg}px;
                width: calc(100vw - ${rightmostStackRightEdge.lg}px);
                min-height: 100vh;
              }
            }
            @media (min-width: 1200px) {
              #${styleId} {
                left: ${rightmostStackRightEdge.xl}px;
                width: calc(100vw - ${rightmostStackRightEdge.xl}px);
                min-height: 100vh;
              }
            }
          `
        }} />
      )}
      <div 
        id={styleId}
        className="relative z-[1] will-change-[left]"
        style={{
          ...(leftStackCount === 0 ? { 
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
          } : {
            position: 'absolute',
            top: 0,
            minHeight: '100vh',
            // GPU acceleration for smooth transitions
            transform: 'translateZ(0)',
          }),
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          overflowY: 'auto',
          overflowX: 'hidden',
          // Left transitions smoothly with same timing as stacks to maintain fixed gap
          // Width changes instantly (0ms) to prevent gap changes during transition
          transition: leftStackCount > 0 ? 'left 2000ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        }}
      >
        <div
          className="flex will-change-transform"
          style={{
            transform: `translateX(-${validIndex * 100}%)`,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            // Synchronized transition timing with stacks and content container
            transition: 'transform 2000ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {stacks.map((stack, idx) => {
            // Ensure we only render valid panels
            const panel = PANELS[stack.id];
            if (!panel) {
              console.warn(`Panel not found for stack id: ${stack.id}`);
              return null;
            }
            
            const shouldHide = shouldHidePanel(idx);
            
            return (
              <div
                key={stack.id}
                className="w-full flex-shrink-0 relative"
                style={{ 
                  minWidth: '100%',
                  maxWidth: '100%',
                  flex: '0 0 100%',
                  // Hide intermediate panels during non-adjacent transitions
                  visibility: shouldHide ? 'hidden' : 'visible',
                  opacity: shouldHide ? 0 : 1,
                  pointerEvents: shouldHide ? 'none' : 'auto',
                }}
              >
                <div className={`w-full py-1 ${
                  stack.id === 'world' 
                    ? 'pl-4 sm:pl-6 md:pl-8 lg:pl-10 xl:pl-12 2xl:pl-16 pr-0' 
                    : 'px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16'
                }`}>
                  {panel}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}