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
    <div className="relative">
      {/* Header Content Section */}
      <div 
        className="absolute flex flex-col items-start opacity-100"
        style={{
          width: 'clamp(300px, 38.8vw, 671px)',
          height: 'clamp(120px, 14.2vh, 145px)',
          top: 'clamp(20px, 7.8vh, 80px)',
          left: 'clamp(20px, 18.5vw, 320px)',
          gap: '16px'
        }}
      >
        <h2 className="text-4xl font-bold text-[#1F2024] font-satoshi">
          Our clients
        </h2>
        <p className="font-satoshi text-lg text-[#454654]">
          Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl.
          Non risus semper vel est amet leo non
        </p>
      </div>
  
      {/* Clients Grid Container */}
      <div 
        className="absolute flex flex-col items-start opacity-100"
        style={{
          width: 'clamp(300px, 56.2vw, 970px)',
          height: 'clamp(400px, 54.7vh, 590px)',
          left: 'clamp(20px, 18.5vw, 320px)',
          top: 'clamp(20px, 25.9vh, 265px)',
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 w-full">
          {clients.map((client, index) => (
            <div
              key={index}
              className="flex items-center justify-center opacity-100 bg-white w-full lg:w-[323.33px] h-[147.5px] p-4 border border-[#CFD4D9]"
            >
              <Image
                src={client.logo}
                alt={client.alt}
                width={280}
                height={115}
                className="object-contain w-auto h-auto max-w-full max-h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}