"use client";

import { useState } from "react";
import { STACKS } from "./panels/stack.config";
import SlidingPanels from "./panels/SlidingPanels";
import RightStacks from "./panels/RightStacks";
import DesktopFrame from "../layout/DesktopFrame";

export default function AroundTheWorld() {
  const [active, setActive] = useState("world");

  return (
    <section className="relative bg-white mt-0">
      <DesktopFrame>
        <div className="flex h-screen max-h-screen overflow-hidden relative max-xl:flex-col max-xl:h-auto max-xl:min-h-screen max-xl:overflow-y-auto">

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
      </DesktopFrame>
    </section>
  );
}