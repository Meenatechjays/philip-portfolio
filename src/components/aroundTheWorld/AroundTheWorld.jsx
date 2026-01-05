"use client";

import { useState } from "react";
import { STACKS } from "./panels/stack.config";
import SlidingPanels from "./panels/SlidingPanels";
import RightStacks from "./panels/RightStacks";

export default function AroundTheWorld() {
  const [active, setActive] = useState("world");

  return (
    <section className="relative bg-white mt-0 min-h-screen overflow-hidden">
      <div className="flex relative">

        {/* LEFT – sliding content */}
        <SlidingPanels
          stacks={STACKS}
          active={active}
        />

        {/* RIGHT – stack columns */}
        <RightStacks
          stacks={STACKS}
          active={active}
          onChange={setActive}
        />

      </div>
    </section>
  );
}