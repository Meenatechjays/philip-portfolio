"use client";

import { useState, useRef } from "react";
import { STACKS } from "./panels/stack.config";
import SlidingPanels from "./panels/SlidingPanels";
import RightStacks from "./panels/RightStacks";

export default function AroundTheWorld() {
  const [active, setActive] = useState("world");
  const previousActiveRef = useRef("world");
  const [openAccordions, setOpenAccordions] = useState({
    world: true, // World open by default
    services: false,
    clients: false,
  });

  const handleChange = (newActive) => {
    previousActiveRef.current = active;
    setActive(newActive);
  };

  const handleAccordionToggle = (stackId) => {
    setOpenAccordions(prev => ({
      ...prev,
      [stackId]: !prev[stackId]
    }));
    // Also update active state for desktop behavior
    handleChange(stackId);
  };

  const getPreviousIndex = () => {
    return STACKS.findIndex(s => s.id === previousActiveRef.current);
  };

  const activeIndex = STACKS.findIndex(s => s.id === active);

  return (
    <section className="relative bg-white h-full w-full overflow-hidden">
      {/* Single rigid group container - moves both stacks and content together */}
      <div className="relative w-full h-full">
        {/* LEFT – sliding content (desktop only) */}
        <SlidingPanels
          stacks={STACKS}
          active={active}
          previousIndex={getPreviousIndex()}
          activeIndex={activeIndex}
          openAccordions={openAccordions}
        />

        {/* RIGHT – stack columns / accordion */}
        <RightStacks
          stacks={STACKS}
          active={active}
          onChange={handleAccordionToggle}
          activeIndex={activeIndex}
          openAccordions={openAccordions}
        />
      </div>
    </section>
  );
}