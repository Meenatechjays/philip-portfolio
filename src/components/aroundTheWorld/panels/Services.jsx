import ServiceCard from '../../ui/ServiceCard';

export default function Services() {
  const services = [
    {
      title: "Artificial Intelligence & Data",
      description: "Exploring the innovative AI solutions and technology leadership that sets..."
    },
    {
      title: "Artificial Intelligence & Data",
      description: "Exploring the innovative AI solutions and technology leadership that sets..."
    },
    {
      title: "Artificial Intelligence & Data",
      description: "Exploring the innovative AI solutions and technology leadership that sets..."
    },
    {
      title: "Artificial Intelligence & Data",
      description: "Exploring the innovative AI solutions and technology leadership that sets..."
    },
    {
      title: "Artificial Intelligence & Data",
      description: "Exploring the innovative AI solutions and technology leadership that sets..."
    },
    {
      title: "Artificial Intelligence & Data",
      description: "Exploring the innovative AI solutions and technology leadership that sets..."
    }
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <p className="text-gray-600 mb-6 sm:mb-8 lg:mb-10 font-satoshi max-w-3xl">
        Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl.
      </p>
  
      <div className="opacity-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl gap-4 sm:gap-5 md:gap-6 lg:gap-8 auto-rows-fr">
        {services.map((service, i) => (
          <div key={i} className="w-full min-w-0">
            <ServiceCard
              title={service.title}
              description={service.description}
              linkText="Learn More"
              showStarIcon={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}