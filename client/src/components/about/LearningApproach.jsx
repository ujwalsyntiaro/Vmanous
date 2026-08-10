import React from 'react';
import Container from '../ui/Container';
import { approach } from '../../constants/about';
import { Wrench, BookOpen, Lightbulb, TrendingUp } from 'lucide-react';

const icons = [Wrench, BookOpen, Lightbulb, TrendingUp];

const LearningApproach = () => {
  return (
    <section className="py-12 md:py-16 bg-vmanous-navy-dark text-white">
      <Container>
        <h2 className="text-3xl md:text-4xl font-semibold mb-16 text-center">{approach.heading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {approach.principles.map((p, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-vmanous-ai-blue mb-6">
                  <Icon size={28} />
                </div>
                <div className="text-sm font-medium text-gray-500 mb-2">{p.num}</div>
                <h3 className="text-xl font-medium mb-3">{p.title}</h3>
                <p className="text-gray-400">{p.text}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default LearningApproach;
