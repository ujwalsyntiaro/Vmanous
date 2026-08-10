import React from 'react';
import Container from '../ui/Container';

const AboutIntroduction = () => {
  return (
    <section id="explore" className="py-12 md:py-16 bg-white">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-video relative">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
              alt="Professional VMANOUS visual" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-vmanous-navy-deep mb-6">What is VMANOUS?</h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              VMANOUS is designed to bridge the gap between academic learning and practical technology experience.
            </p>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              We provide an ecosystem around AI and Data Science, offering practical workshops, real-world projects, and dedicated research initiatives.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our comprehensive evaluation process prepares students for potential internship opportunities, ensuring they have the practical skills needed to thrive in the technology industry.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutIntroduction;
