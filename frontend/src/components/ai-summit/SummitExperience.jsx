import React from 'react';
import { Users, Code, Target, Book, Layout, Briefcase } from 'lucide-react';
import Container from '../ui/Container';

export const SummitAudience = () => {
  const cards = [
    { title: "1st & 2nd Year Students", desc: "Build your AI foundations early." },
    { title: "Final Year Students", desc: "Strengthen practical and project experience." },
    { title: "AI & Machine Learning Learners", desc: "Explore modern AI technologies." },
    { title: "Students Interested in Research", desc: "Move from learning toward experimentation." },
    { title: "Computer Science / Engineering Students", desc: "Apply technical skills to real-world problems." }
  ];
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <Container>
        <h2 className="text-2xl md:text-4xl md: text-xl md: font-medium text-center text-[#050816] mb-12">Who Is the AI Summit For?</h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {cards.map((c, i) => (
            <div key={i} className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-200 w-full sm:w-auto">
              <h4 className="text-lg md:text-xl md: font-medium text-[#050816]">{c.title}</h4>
              <p className="text-sm text-gray-500">{c.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export const SummitExperienceGrid = () => {
  const experiences = [
    { icon: Users, text: "Expert Mentorship" },
    { icon: Layout, text: "Hands-on Learning" },
    { icon: Target, text: "Real-world Problems" },
    { icon: Book, text: "Research Exposure" },
    { icon: Code, text: "Practical Projects" },
    { icon: Briefcase, text: "Industry Perspective" }
  ];
  
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {experiences.map((exp, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-vmanous-light flex items-center justify-center mb-4">
                <exp.icon className="w-8 h-8 text-vmanous-ai-blue" />
              </div>
              <h4 className="text-lg md:text-xl md: font-medium text-[#050816]">{exp.text}</h4>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export const SummitTimeline = ({ timeline }) => {
  return (
    <section className="py-24 bg-[#050816] text-white">
      <Container>
        <h2 className="text-2xl md:text-4xl md: text-xl md: font-medium mb-12 text-center">Summit Timeline</h2>
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {timeline.slice(0, 5).map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4">
                <div className="bg-vmanous-ai-blue/20 text-vmanous-ai-blue px-3 py-1 rounded-md text-sm font-medium">{t.day}</div>
                <div className="font-medium">{t.topic}</div>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            {timeline.slice(5).map((t, i) => (
              <div key={i} className="bg-white/10 border border-white/20 p-6 rounded-xl text-center">
                <h4 className="text-lg md:text-xl md: font-medium text-xl text-vmanous-ai-electric mb-1">{t.phase}</h4>
                <p className="text-gray-400 font-medium">{t.duration}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-6 italic">* Exact schedule may vary based on specific batch.</p>
        </div>
      </Container>
    </section>
  );
};

export const SummitGallery = ({ images }) => {
  return (
    <section className="py-20 bg-[#080B1A]">
      <Container>
        <h2 className="text-2xl md:text-4xl md: text-xl font-medium text-white mb-10 text-center">Summit Highlights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div key={i} className="rounded-xl overflow-hidden group h-64">
              <img src={img} alt={`Highlight ${i+1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export const SummitOutcomes = ({ outcomes }) => {
  return (
    <section className="py-20 bg-white">
      <Container>
        <h2 className="text-2xl md:text-4xl md: text-xl font-medium text-center text-[#050816] mb-10">What You Take Away</h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {outcomes.map((o, i) => (
            <div key={i} className="px-6 py-3 bg-vmanous-light border border-gray-200 rounded-full text-gray-800 font-medium shadow-sm">
              {o}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export const SummitCertificate = () => {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-200">
      <Container>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-4xl md: text-xl md: font-medium text-[#050816] mb-6">Earn Your VMANOUS AI Summit Certificate</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Participants who successfully complete the required program components and meet the applicable assessment criteria may receive a VMANOUS certificate.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg p-2 shadow-2xl border border-gray-200">
              <div className="border-4 border-vmanous-navy-dark/5 p-8 text-center aspect-[1.4/1] flex flex-col items-center justify-center relative bg-gradient-to-br from-white to-gray-50">
                <div className="absolute top-8 left-8 w-16 h-16 opacity-10 bg-[#050816] rounded-full"></div>
                <h4 className="text-lg md:text-xl md: font-serif text-[#050816] mb-2">CERTIFICATE OF PARTICIPATION</h4>
                <div className="w-16 h-1 bg-vmanous-ai-blue mb-6"></div>
                <p className="text-gray-500 text-sm mb-4">VMANOUS AI SUMMIT 2026</p>
                <div className="w-48 h-6 bg-gray-200 rounded mb-4"></div>
                <div className="w-20 h-20 rounded-full border-4 border-vmanous-ai-blue/20 flex items-center justify-center mt-auto">
                  <span className="text-vmanous-ai-blue font-medium text-xs">VMANOUS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
