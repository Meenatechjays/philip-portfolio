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

  return (
    <div className="flex-1 overflow-x-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${index * 100}%)`,
        }}
      >
        {stacks.map((stack) => (
          <div
            key={stack.id}
            className="w-full flex-shrink-0 px-4 md:px-8 lg:px-12 xl:px-20 pt-4 md:pt-6 lg:pt-8 pb-12 md:pb-16 lg:pb-24 relative"
          >
            {PANELS[stack.id]}
          </div>
        ))}
      </div>
    </div>
  );
}