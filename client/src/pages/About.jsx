import React from 'react';
import AboutHero from '../components/about/AboutHero';
import AboutIntroduction from '../components/about/AboutIntroduction';
import VisionSection from '../components/about/VisionSection';
import ProblemSection from '../components/about/ProblemSection';
import EcosystemSection from '../components/about/EcosystemSection';
import WhatWeDo from '../components/about/WhatWeDo';
import FounderSection from '../components/about/FounderSection';
import LearningApproach from '../components/about/LearningApproach';
import TechnologyFocus from '../components/about/TechnologyFocus';
import StudentJourney from '../components/about/StudentJourney';
import CollegeEcosystem from '../components/about/CollegeEcosystem';
import ValuesSection from '../components/about/ValuesSection';
import FutureVision from '../components/about/FutureVision';
import AboutCTA from '../components/about/AboutCTA';

const About = () => {
  return (
    <main className="w-full overflow-hidden">
      <AboutHero />
      <AboutIntroduction />
      <VisionSection />
      <ProblemSection />
      <EcosystemSection />
      <WhatWeDo />
      <FounderSection />
      <LearningApproach />
      <TechnologyFocus />
      <StudentJourney />
      <CollegeEcosystem />
      <ValuesSection />
      <FutureVision />
      <AboutCTA />
    </main>
  );
};

export default About;
