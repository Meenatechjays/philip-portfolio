"use client";

import { useState, useRef } from "react";
import { STACKS } from "./panels/stack.config";
import SlidingPanels from "./panels/SlidingPanels";
import RightStacks from "./panels/RightStacks";

export default function AroundTheWorld() {
  const [active, setActive] = useState("world");
  const previousActiveRef = useRef("world");

  const handleChange = (newActive) => {
    previousActiveRef.current = active;
    setActive(newActive);
  };

  const getPreviousIndex = () => {
    return STACKS.findIndex(s => s.id === previousActiveRef.current);
  };

  const activeIndex = STACKS.findIndex(s => s.id === active);

  return (
    <section className="relative bg-white mt-0 min-h-screen">
      {/* Single rigid group container - moves both stacks and content together */}
      <div className="relative w-full min-h-screen">
        {/* LEFT – sliding content */}
        <SlidingPanels
          stacks={STACKS}
          active={active}
          previousIndex={getPreviousIndex()}
          activeIndex={activeIndex}
        />

        {/* RIGHT – stack columns */}
        <RightStacks
          stacks={STACKS}
          active={active}
          onChange={handleChange}
          activeIndex={activeIndex}
        />
      </div>
    </section>
  );
}