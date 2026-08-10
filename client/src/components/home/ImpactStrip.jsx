import React from 'react';
import Container from '../ui/Container';

const ImpactStrip = () => {
  const metrics = [
    { title: "AI & Data Science", subtitle: "Workshops" },
    { title: "College", subtitle: "Programs" },
    { title: "Industry", subtitle: "Mentors" },
    { title: "Internship", subtitle: "Opportunities" }
  ];

  return (
    <div className="bg-white border-b border-gray-100 py-10 relative z-10 shadow-sm">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-gray-100">
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-lg md:text-xl font-medium text-vmanous-navy-deep mb-1">{metric.title}</span>
              <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">{metric.subtitle}</span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default ImpactStrip;
