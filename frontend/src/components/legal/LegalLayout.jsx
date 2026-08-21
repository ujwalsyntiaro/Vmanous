import React from 'react';
import Container from '../ui/Container';
import { FileText } from 'lucide-react';

const LegalLayout = ({ title, subtitle, icon: Icon = FileText, lastUpdated = 'August 2026', children }) => {
  return (
    <div className="py-6 md:py-8 bg-white min-h-screen">
      <Container>
        <div className="w-full">
          {/* Header Section (Regular Font Weight - No Heavy Bold) */}
          <div className="mb-5 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-1.5 text-vmanous-green font-normal text-xs mb-1">
              <Icon size={16} />
              <span>Vmanous Legal & Governance</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-medium text-vmanous-navy-dark tracking-tight mb-2">
              {title}
            </h1>

            <p className="text-gray-600 text-xs md:text-sm font-normal leading-relaxed mb-3">
              {subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-normal pt-1">
              <div>CIN: <span className="text-gray-700 font-normal">U62099PN2024PTC229219</span></div>
              <div className="h-3 w-px bg-gray-300 hidden sm:block"></div>
              <div>Last Updated: <span className="text-gray-700 font-normal">{lastUpdated}</span></div>
            </div>
          </div>

          {/* Main Content (Regular Font Weight) */}
          <div className="text-gray-700 text-xs md:text-sm font-normal leading-relaxed space-y-5">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LegalLayout;
