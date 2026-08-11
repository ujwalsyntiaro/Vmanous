import React, { useEffect } from 'react';
import { homeData } from '../constants/home';

import { HomeHero } from '../components/home/HomeHero';
import { WhatIsVmanous } from '../components/home/WhatIsVmanous';
import { EcosystemSection } from '../components/home/EcosystemSection';
import { AISummitFeature } from '../components/home/AISummitFeature';
import { DataScienceFeature } from '../components/home/DataScienceFeature';
import { LearningJourney } from '../components/home/LearningJourney';
import { ProjectShowcase } from '../components/home/ProjectShowcase';
import { TechnologyUniverse } from '../components/home/TechnologyUniverse';
import { WhyVmanous } from '../components/home/WhyVmanous';
import { AudienceSection } from '../components/home/AudienceSection';
import { CampusSection } from '../components/home/CampusSection';
import { ResearchSection } from '../components/home/ResearchSection';
import { HomeGallery } from '../components/home/HomeGallery';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans text-vmanous-navy-deep bg-white overflow-x-hidden">
      {/* 01 HERO */}
      <HomeHero data={homeData.hero} />

      {/* 02 VMANOUS ECOSYSTEM */}
      <EcosystemSection nodes={homeData.ecosystem} />

      {/* 03 WHAT IS VMANOUS */}
      <WhatIsVmanous blocks={homeData.whatIsVmanous} />

      {/* 04 AI SUMMIT FEATURE */}
      <AISummitFeature />





      {/* 08 PRACTICAL PROJECTS */}
      <ProjectShowcase projects={homeData.projects} />

      {/* 09 AI TECHNOLOGY UNIVERSE */}
      <TechnologyUniverse technologies={homeData.technologies} />

      {/* 11 WHY VMANOUS */}
      <WhyVmanous benefits={homeData.whyVmanous} />

      {/* 12 WHO IS VMANOUS FOR */}
      <AudienceSection audiences={homeData.audiences} />






    </div>
  );
};

export default Home;
