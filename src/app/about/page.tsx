import React from "react";

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  dataAos?: string;
};

const SectionCard: React.FC<SectionCardProps> = ({ title, children, className = "", dataAos = "" }) => (
  <div
    data-aos={dataAos}
    className={`bg-white rounded-3xl p-8 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-xl shadow-lg ${className}`}
    style={{
      background: "linear-gradient(145deg, #ffffff 0%, #e6e6e6 100%)",
    }}
  >
    <h2 className="text-2xl font-bold text-black mb-4 border-b-2 border-gray-300 pb-2">
      {title}
    </h2>
    {children}
  </div>
);

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-800">
              About Our Company
            </span>
            <span className="text-gray-800 block text-3xl mt-2">Explore product with every dimensions</span>
          </h1>
        </div>

        {/* About Sections */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* About Our Company Section */}
          <SectionCard title="About Our Company" dataAos="fade-right">
            <p className="text-gray-700 mb-4 leading-relaxed">
              At 3D xyz, we are more than just a company. We are a community dedicated to creating meaningful connections and providing exceptional experiences.
            </p>
            <p className="text-gray-700 leading-relaxed">
              "Our journey is fueled by creativity, cutting-edge technology, and a commitment to delivering immersive 3D experiences that help our clients visualize and connect with products like never before.
            </p>
          </SectionCard>

          {/* Why Choose Us Section */}
          <SectionCard title="Why Choose Us?" dataAos="fade-left">
            <p className="text-gray-700 mb-4 leading-relaxed">
              We stand out through our innovative 3D solutions, personalized experiences, and unwavering dedication to helping our customers engage with products in a way that’s both interactive and immersive.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our team brings together diverse expertise, creative thinking, and a genuine passion for delivering excellence.
            </p>
          </SectionCard>

          {/* Objective Section */}
          <SectionCard title="Objectives" dataAos="fade-right" className="lg:col-span-2">
            <ul className="text-gray-700 leading-relaxed list-disc list-inside space-y-2">
              <li>Revolutionize the way customers experience products through immersive 3D visualization.</li>
              <li>Foster continuous innovation in 3D technology to create ever-evolving user experiences.</li>
              <li>Develop sustainable 3D solutions that deliver long-term value to both customers and businesses.</li>
              <li>Build strong, trust-based relationships with clients through interactive, transparent product views.</li>
              <li>Push the limits of 3D visualization to create truly next-gen online shopping experiences.</li>
            </ul>
          </SectionCard>

          {/* Vision Section */}
          <SectionCard title="Vision" dataAos="fade-right">
            <p className="text-gray-700 leading-relaxed">
              To be the leading platform that connects people, inspires innovation, and creates transformative experiences that empower individuals and businesses.
            </p>
          </SectionCard>

          {/* Mission Section */}
          <SectionCard title="Mission" dataAos="fade-left">
            <p className="text-gray-700 leading-relaxed">
              Our mission is to leverage technology and human-centric design to solve complex challenges, create meaningful connections, and drive positive change in the world.
            </p>
          </SectionCard>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-800">
              Join our journey
            </span>
            <span className="text-gray-800 block text-2xl mt-2">Together, We Create Extraordinary Experiences</span>
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            At 3D XYZ, every interaction brings you closer to a new dimension of shopping. We invite you to explore, experience, and be part of our journey into the world of 3D innovation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
