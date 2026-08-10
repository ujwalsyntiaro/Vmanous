import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Container from '../../components/ui/Container';

const CollegePartnership = () => {
  return (
    <div className="min-h-[70vh] pt-32 pb-20 flex items-center justify-center bg-gray-50">
      <Container>
        <div className="max-w-2xl mx-auto bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
          <h1 className="text-3xl md:text-4xl font-medium text-vmanous-navy-dark mb-4">College Partnership</h1>
          <p className="text-gray-600 mb-8">
            This is a placeholder for the future college partnership flow. Architecture is ready for integration.
          </p>
          <Link 
            to="/enroll" 
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Roles</span>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default CollegePartnership;
