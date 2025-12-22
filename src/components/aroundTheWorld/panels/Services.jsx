import ServiceCard from '../../ui/ServiceCard';

export default function Services() {
  const services = [
    {
      title: "Product Development",
      description: "From concept to launch, we guide your product journey with agile methodologies and innovative development practices."
    },
    {
      title: "Quality Assurance",
      description: "Ensure flawless performance with comprehensive testing strategies, automated workflows, and continuous quality monitoring."
    },
    {
      title: "Cloud Solutions",
      description: "Migrate and optimize your infrastructure with modern cloud architectures for enhanced scalability, security, and performance."
    },
    {
      title: "Artificial Intelligence & Data",
      description: "Leverage cutting-edge AI and data analytics to transform your business insights and automate intelligent decision-making processes."
    },
    {
      title: "Custom Software Development",
      description: "Build tailored software solutions that perfectly match your business requirements with scalable and maintainable architectures."
    },
   
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col items-start opacity-100 mb-6 sm:mb-8 lg:mb-10 gap-3 sm:gap-4 w-full">
        <h2 className="heading-h2">
          Our Services
        </h2>
        <p className="text-gray-600 font-satoshi text-sm sm:text-base md:text-lg max-w-3xl">
          Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl.
        </p>
      </div>
  
      <div className="opacity-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl gap-4 sm:gap-5 md:gap-6 lg:gap-4 auto-rows-fr">
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