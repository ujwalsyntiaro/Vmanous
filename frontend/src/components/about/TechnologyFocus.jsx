import React from 'react';
import Container from '../ui/Container';
import { technologyFocus } from '../../constants/about';

const TechnologyFocus = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-vmanous-navy-deep">{technologyFocus.heading}</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {technologyFocus.categories.map((tech, i) => (
            <div key={i} className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium hover:bg-white hover:shadow-md transition-all cursor-default">
              {tech}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TechnologyFocus;
