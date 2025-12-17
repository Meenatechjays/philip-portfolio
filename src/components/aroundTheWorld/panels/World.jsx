import Image from 'next/image';

export default function World() {
    return (
      <div className="relative h-full w-full flex flex-col">
        {/* Header Section - Responsive */}
        <div 
          className="opacity-100 flex flex-col gap-2 md:gap-4 ml-4 md:ml-[4.6vw] mt-4 md:mt-8 w-full md:w-[clamp(300px,38.8vw,671px)]"
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-satoshi font-bold text-[#1F2024]">
            Around the World with AI
          </h1>
          <p 
            className="font-satoshi font-normal text-base md:text-lg leading-normal tracking-[0%] opacity-100 text-[#454654] w-full"
          >
            Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl. Non risus semper vel est amet leo non
          </p>
        </div>

        {/* Map - Responsive */}
        <div className="mt-4 md:mt-8 px-4 md:px-0 flex-shrink-0">
          <img
            src="/map.svg"
            alt="World map"
            className="w-full max-w-full h-auto"
          />
        </div>

        {/* Bottom Section - Stats and Content */}
        <div className="relative mt-6 md:mt-8 mb-4 md:mb-8 flex-1 min-h-0 px-4 md:px-0">
          {/* Mobile: Stack vertically */}
          <div className="md:hidden flex flex-col gap-4">
            {/* Mobile Logo */}
            <div className="flex items-center justify-start h-[80px]">
              <Image
                src="/techjays-logo.svg"
                alt="Techjays Logo"
                width={91}
                height={83}
                className="object-contain w-auto h-full"
              />
            </div>
            
            {/* Mobile Stats */}
            <div className="flex flex-row items-center gap-2 flex-wrap justify-start">
              <Stat value="7+" label="Countries" />
              <Stat value="150+" label="Projects" />
              <Stat value="170+" label="People" />
            </div>
            
            {/* Mobile Content */}
            <div className="flex flex-col items-start mt-4">
              <p className="font-satoshi font-normal text-sm text-[#454654] w-full">
                Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl.
                Non risus semper vel est amet leo non Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl.
                Non risus semper vel est amet leo non Lorem ipsum dolor sit amet consectetur.
              </p>
            </div>
          </div>

          {/* Desktop Layout - Absolute positioning */}
          <div className="hidden md:block relative h-full">
            {/* Logo - Bottom Left */}
            <div 
              className="absolute bottom-0 left-0 lg:left-[1.2vw] flex items-center h-[clamp(60px,8.7vh,89px)] z-10"
            >
              <Image
                src="/techjays-logo.svg"
                alt="Techjays Logo"
                width={91}
                height={83}
                className="object-contain w-auto h-full"
              />
            </div>
            
            {/* Stats Container - Bottom Right */}
            <div 
              className="absolute bottom-0 right-4 lg:right-[16.6vw] flex flex-row items-center gap-3 z-10"
              style={{ 
                maxWidth: 'clamp(350px, 35vw, 500px)',
                minHeight: 'clamp(70px, 8.7vh, 89px)'
              }}
            >
              <Stat value="7+" label="Countries" />
              <Stat value="150+" label="Projects" />
              <Stat value="170+" label="People" />
            </div>
      
            {/* Content - Bottom Left, above stats */}
            <div 
              className="absolute left-[4.6vw] flex flex-col items-start z-0"
              style={{
          
                width: 'clamp(400px, 50vw, 800px)'
              }}
            >
              <p 
                className="font-satoshi font-normal text-base lg:text-lg leading-normal tracking-[0%] opacity-100 text-[#454654] w-full"
              >
                Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl.
                Non risus semper vel est amet leo non Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl.
                Non risus semper vel est amet leo non Lorem ipsum dolor sit amet consectetur.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  function Stat({ value, label }) {
    return (
      <div 
        className="flex flex-col items-start bg-[#F2F6FC] rounded-[9px] flex-none p-[clamp(8px,1.2vh,12px)] w-[clamp(85px,9vw,155.25px)] min-w-[85px] max-w-[155.25px] min-h-[70px] h-[clamp(70px,8.7vh,89px)] gap-[clamp(4px,0.8vh,8px)]"
      >
        <div className="text-lg md:text-xl lg:text-2xl font-bold text-[#1F2024] leading-tight">
          {value}
        </div>
        <div className="text-xs md:text-sm text-[#454654] leading-tight">
          {label}
        </div>
      </div>
    );
  }