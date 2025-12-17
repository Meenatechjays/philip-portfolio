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
    <div className="relative">
      <p className="text-gray-600 max-w-xl mb-12 font-satoshi">
        Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl.
      </p>
  
      <div 
        className="absolute opacity-100 grid grid-cols-3"
        style={{
          width: '970px',
          height: '620px',
        
          gap: '24px'
        }}
      >
        {services.map((service, i) => (
          <ServiceCard
            key={i}
            title={service.title}
            description={service.description}
            linkText="Learn More"
            showStarIcon={true}
          />
        ))}
      </div>
    </div>
  );
}