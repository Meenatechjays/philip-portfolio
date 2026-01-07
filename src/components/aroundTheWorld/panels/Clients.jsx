'use client';

import Image from 'next/image';

export default function Clients() {
  // Client logos array - easily add more clients in the future
  const clients = [
    { logo: '/orbcomm.svg', alt: 'ORBCOMM' },
    { logo: '/Arkose labs 1.svg', alt: 'Arkose Labs' },
    { logo: '/Bracketology logo with tagline 1.svg', alt: 'Bracketology' },
    { logo: '/hawx.svg', alt: 'hawx' },
    { logo: '/alberta.svg', alt: 'University of Alberta' },
    { logo: '/pepcare.svg', alt: 'PepCare' },
    { logo: '/aquacycl.svg', alt: 'AQUACYCL' },
    { logo: '/american-museum.svg', alt: 'American Museum of Natural History' },
    { logo: '/Kaizen.png', alt: 'kaizen HEALTH' },
    { logo: '/Decerna logo 1.svg', alt: 'DECERNA' },
    { logo: '/Midalloy.svg', alt: 'Midalloy' },
    { logo: '/hawx.svg', alt: 'hawx' }, // Duplicate as shown in design
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Content Section */}
      <div className="flex flex-col items-start opacity-100 mb-6 sm:mb-8 lg:mb-10 gap-3 sm:gap-4 w-full">
        <h2 className="section-heading">
          Our clients
        </h2>
        <p className="font-satoshi text-sm sm:text-base md:text-lg text-[#454654] max-w-3xl">
        Strategic investments in emerging technologies and high-growth ventures
        </p>
      </div>
  
      {/* Clients Grid Container */}
      <div className="flex flex-col items-start opacity-100 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl auto-rows-fr gap-0">
          {clients.map((client, index) => (
            <div
              key={index}
              className="group flex items-center justify-center opacity-100 bg-white w-full min-w-0 aspect-[2.5/1] p-4 sm:p-5 md:p-6 lg:p-7 border border-[#CFD4D9] overflow-hidden"
            >
              <Image
                src={client.logo}
                alt={client.alt}
                width={280}
                height={115}
                className="object-contain max-w-[70%] max-h-[60%] w-auto h-auto transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}