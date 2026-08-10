import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';

const AboutCTA = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white text-center">
      <Container>
        <h2 className="text-4xl font-semibold mb-6">Be Part of the VMANOUS Journey.</h2>
        <p className="text-xl text-blue-100 mb-12">
          Explore AI. Build practical skills. Discover what you can create.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/enroll" className="px-8 py-4 bg-white text-blue-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg shadow-black/10">
            Get Started
          </Link>
          <Link to="/ai-summit" className="px-8 py-4 border border-vmanous-green text-white rounded-xl font-medium hover:bg-vmanous-green transition-colors">
            Explore AI Summit
          </Link>
          <Link to="/data-science" className="px-8 py-4 bg-blue-800/40 border border-blue-400/30 text-white rounded-xl font-medium hover:bg-blue-800/60 transition-colors backdrop-blur-sm">
            Explore Data Science
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default AboutCTA;
