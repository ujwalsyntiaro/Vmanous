import React, { useEffect } from 'react';
import DataScienceHero from '../components/data-science/DataScienceHero';
import DataScienceEcosystem from '../components/data-science/DataScienceEcosystem';
import ToolGrid from '../components/data-science/ToolGrid';
import DataScienceWorkflow from '../components/data-science/DataScienceWorkflow';
import DataScienceLearningPath from '../components/data-science/DataScienceLearningPath';
import ProjectShowcase from '../components/data-science/ProjectShowcase';
import ResearchSection from '../components/data-science/ResearchSection';
import CareerPath from '../components/data-science/CareerPath';
import InternshipPathway from '../components/data-science/InternshipPathway';
import DataScienceGallery from '../components/data-science/DataScienceGallery';
import DataScienceCTA from '../components/data-science/DataScienceCTA';

const DataScience = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <DataScienceHero />
      <DataScienceEcosystem />
      <ToolGrid />
      <DataScienceWorkflow />
      <DataScienceLearningPath />
      <ProjectShowcase />
      <ResearchSection />
      <CareerPath />
      <InternshipPathway />
      <DataScienceGallery />
      <DataScienceCTA />
    </div>
  );
};

export default DataScience;
