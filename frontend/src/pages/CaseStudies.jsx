import React, { useState, useEffect, useMemo } from 'react';
import {
  caseStudiesHeroData,
  impactMetrics,
  caseStudyCategories,
  caseStudiesData
} from '../constants/caseStudies';

import { CaseStudiesHero } from '../components/case-studies/CaseStudiesHero';
import { CaseStudiesImpact } from '../components/case-studies/CaseStudiesImpact';
import { CaseStudiesFilter } from '../components/case-studies/CaseStudiesFilter';
import { CaseStudyCard } from '../components/case-studies/CaseStudyCard';
import Container from '../components/ui/Container';

const CaseStudies = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredCaseStudies = useMemo(() => {
    if (activeCategory === 'All') return caseStudiesData;
    return caseStudiesData.filter(cs => cs.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <CaseStudiesHero
        title={caseStudiesHeroData.title}
        subtitle={caseStudiesHeroData.subtitle}
      />

      {/* Top 4 Impact Metric Cards */}
      <CaseStudiesImpact metrics={impactMetrics} />

      {/* Category Filter Pills & Case Studies List */}
      <section className="pb-4 sm:pb-6">
        <CaseStudiesFilter
          categories={caseStudyCategories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <Container>
          <div className="space-y-4 sm:space-y-8">
            {filteredCaseStudies.map((study) => (
              <CaseStudyCard key={study.id} study={study} />
            ))}
          </div>

          {filteredCaseStudies.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
              <p className="text-gray-500 text-lg">
                No case studies found for "{activeCategory}".
              </p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

export default CaseStudies;
