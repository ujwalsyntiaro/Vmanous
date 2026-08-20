import React from 'react';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';

export const CampusSection = () => {
  return (
    <section className="py-8 md:py-10 bg-white relative">
      <Container>
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-medium text-vmanous-navy-deep mb-6">
            Bringing AI Learning to Campuses
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            VMANOUS can support colleges with structured AI and Data Science workshops, practical learning experiences and student development programs.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {['AI Workshops', 'Hands-on Sessions', 'Student Projects', 'Assessment', 'Research Exposure'].map(item => (
              <span key={item} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-vmanous-navy-deep shadow-xs">
                {item}
              </span>
            ))}
          </div>

          <Link
            to="/enroll"
            className="inline-flex justify-center items-center px-8 py-4 border border-vmanous-green text-vmanous-navy-dark font-medium rounded-xl hover:bg-vmanous-green hover:text-white transition-all"
          >
            Partner With VMANOUS
          </Link>
        </div>
      </Container>
    </section>
  );
};
