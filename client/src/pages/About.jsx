import React, { useEffect } from 'react';
import AboutHero from '../components/about/AboutHero';
import AboutIntroduction from '../components/about/AboutIntroduction';
import ApproachTimeline from '../components/about/ApproachTimeline';
import FocusAreas from '../components/about/FocusAreas';
import CollegeSection from '../components/about/CollegeSection';
import ResearchSection from '../components/about/ResearchSection';
import InternshipSection from '../components/about/InternshipSection';
import FounderProfile from '../components/about/FounderProfile';
import ValuesSection from '../components/about/ValuesSection';
import AboutCTA from '../components/about/AboutCTA';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full min-h-screen bg-white font-sans overflow-hidden pt-20">
      <AboutHero />
      <AboutIntroduction />
      <ApproachTimeline />
      <FocusAreas />
      <CollegeSection />
      <ResearchSection />
      <InternshipSection />
      <FounderProfile />
      <ValuesSection />
      <AboutCTA />
    </main>
  );
};

export default About;
