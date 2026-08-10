import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

export const DataScienceFeature = () => {
  const tools = ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'Power BI', 'TensorFlow', 'PyTorch'];
  
  const demoData = [
    { name: 'Model A', val: 75 },
    { name: 'Model B', val: 85 },
    { name: 'Model C', val: 65 },
    { name: 'Model D', val: 95 }
  ];
  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

  return (
    <section className="py-6 md:py-8 bg-white relative">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative bg-vmanous-light rounded-3xl p-8 border border-gray-100 shadow-xl overflow-hidden">
            <div className="absolute top-4 right-6 px-3 py-1 bg-white/50 border border-gray-200 rounded-full text-[10px] font-medium text-gray-500 uppercase tracking-widest backdrop-blur-sm z-10">
              Illustrative Demo
            </div>
            
            <div className="mb-8">
              <h4 className="text-lg md:text-xl md: text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Technology Stack</h4>
              <div className="flex flex-wrap gap-2">
                {tools.map(tool => (
                  <span key={tool} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-vmanous-navy-deep shadow-sm">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="text-lg md:text-xl md: text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">Algorithm Accuracy Demo</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demoData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="val" radius={[4, 4, 0, 0]} maxBarSize={40}>
                      {demoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl md:text-4xl md: text-xl md:text-xl font-medium text-vmanous-navy-deep mb-6">
              Explore the World of Data Science
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              From Python and SQL to Machine Learning, visualization and AI, discover the tools behind modern Data Science.
            </p>
            
            <Link 
              to="/data-science"
              className="inline-flex justify-center items-center px-8 py-4 bg-vmanous-navy-deep text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md"
            >
              Explore Data Science
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};
