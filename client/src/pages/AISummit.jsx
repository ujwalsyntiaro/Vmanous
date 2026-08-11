import React, { useEffect } from 'react';
import { aiSummit } from '../constants/aiSummit';

// New AI Summit Components
import { AISummitHero } from '../components/ai-summit/AISummitHero';
import { SummitIntro } from '../components/ai-summit/SummitIntro';
import { AITechnologyUniverse } from '../components/ai-summit/AITechnologyUniverse';
import { SummitPrograms } from '../components/ai-summit/SummitPrograms';
import { AITechnologyShowcase } from '../components/ai-summit/AITechnologyShowcase';
import { AIProjectLab } from '../components/ai-summit/AIProjectLab';
import { ResearchInnovation } from '../components/ai-summit/ResearchInnovation';
import { ResearchLab, InternshipPathwayVisual } from '../components/ai-summit/ResearchAndInternship';
import { SummitTimeline } from '../components/ai-summit/SummitTimeline';
import { StudentExperience } from '../components/ai-summit/StudentExperience';
import { AISummitGallery } from '../components/ai-summit/AISummitGallery';
import { SummitRegistration } from '../components/ai-summit/SummitRegistration';
import { SummitAudience, CertificateShowcase, SummitFAQ } from '../components/ai-summit/SummitInfo';

const AISummit = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-vmanous-navy-deep">
      <AISummitHero data={aiSummit} />
      <SummitIntro />
      <AITechnologyUniverse />
      <SummitPrograms programs={aiSummit.programs} />
      <AITechnologyShowcase technologies={aiSummit.technologies} />
      <AIProjectLab projects={aiSummit.projects} />

      <ResearchLab image={aiSummit.images.gallery[5]} />
      <SummitTimeline timeline={aiSummit.timeline} />
      <StudentExperience experience={aiSummit.experience} />
      <SummitAudience />
      <AISummitGallery images={aiSummit.images.gallery} />
      <CertificateShowcase />
      <InternshipPathwayVisual />
      <SummitFAQ faq={aiSummit.faq} />
      <SummitRegistration registration={aiSummit.registration} />
    </div>
  );
};

export default AISummit;
