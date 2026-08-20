import React, { useEffect } from 'react';
import { aiSummit } from '../constants/aiSummit';

// New AI Summit Components
import { AISummitHero } from '../components/ai-summit/AISummitHero';
import { SummitIntro } from '../components/ai-summit/SummitIntro';
import { AITechnologyUniverse } from '../components/ai-summit/AITechnologyUniverse';
import { SummitPrograms } from '../components/ai-summit/SummitPrograms';

import { AIProjectLab } from '../components/ai-summit/AIProjectLab';
import { ResearchInnovation } from '../components/ai-summit/ResearchInnovation';
import { ResearchLab } from '../components/ai-summit/ResearchAndInternship';
import { SummitTimeline } from '../components/ai-summit/SummitTimeline';
import { StudentExperience } from '../components/ai-summit/StudentExperience';

import { SummitRegistration } from '../components/ai-summit/SummitRegistration';
import { SummitAudience, CertificateShowcase } from '../components/ai-summit/SummitInfo';

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

      <AIProjectLab projects={aiSummit.projects} />

      <ResearchLab image={aiSummit.images.gallery[5]} />
      <SummitTimeline timeline={aiSummit.timeline} />
      <StudentExperience experience={aiSummit.experience} />
      <SummitAudience />

      <SummitRegistration registration={aiSummit.registration} />
    </div>
  );
};

export default AISummit;
