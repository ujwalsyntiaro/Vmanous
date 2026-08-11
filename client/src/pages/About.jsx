import React, { useEffect } from 'react';
import AboutHero from '../components/about/AboutHero';
import ApproachTimeline from '../components/about/ApproachTimeline';
import FocusAreas from '../components/about/FocusAreas';
import CollegeSection from '../components/about/CollegeSection';
import ResearchSection from '../components/about/ResearchSection';
import FounderProfile from '../components/about/FounderProfile';
import ValuesSection from '../components/about/ValuesSection';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full min-h-screen bg-white font-sans overflow-hidden pt-0">
      <AboutHero />
      <ApproachTimeline />
      <FocusAreas />
      <CollegeSection />
      <ResearchSection />
      <FounderProfile />
      <ValuesSection />
    </main>
  );
};

export default About;
