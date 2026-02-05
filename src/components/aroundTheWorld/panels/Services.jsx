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
    <div className="w-full flex flex-col items-center lg:items-start">
      {/* Header Section */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left opacity-100 mb-6 sm:mb-8 lg:mb-10 gap-3 sm:gap-4 w-full lg:w-[calc(100%-250px)]">
        <h2 className="section-heading">
          Our Services
        </h2>
        <p className="text-gray-600 font-satoshi text-sm sm:text-base md:text-lg w-full lg:w-[calc(100%-250px)]">
          Lorem ipsum dolor sit amet consectetur. Aliquam mattis tortor magna nisl.
        </p>
      </div>
  
      <div className="opacity-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full lg:w-[calc(100%-150px)] gap-2 sm:gap-3 md:gap-5 lg:gap-4 auto-rows-fr">
        {services.map((service, i) => (
          <div key={i} className="w-full min-w-0 flex">
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