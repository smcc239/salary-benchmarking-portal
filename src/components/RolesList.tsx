import React, { useState } from 'react';
import { BenchmarkedRole, JobTheme } from '../types/user';
import { SurveyForm } from './SurveyForm';
import { BenchmarkReport } from './BenchmarkReport';
import type { SurveyResponse } from '../types/survey';
import { storage } from '../services/storage';
import { generateBenchmarkReport } from '../utils/reportGenerator';

interface RolesListProps {
  roles: BenchmarkedRole[];
  onViewReport: (roleId: string) => void;
}

export const RolesList: React.FC<RolesListProps> = ({ roles, onViewReport }) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<JobTheme | 'all'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const themes: JobTheme[] = [
    'Chief Officer',
    'Communications',
    'Corporate Services',
    'Human Resources',
    'Income Generation',
    'Operations',
    'Service Delivery'
  ];

  const handleSurveySubmit = async (data: SurveyResponse) => {
    if (!selectedRole) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      storage.saveSurveyResponse(selectedRole, data);
      
      const role = roles.find(r => r.id === selectedRole);
      if (!role) throw new Error('Role not found');
      
      const responses = storage.getSurveyResponses(selectedRole);
      const report = generateBenchmarkReport(role.title, role.theme, responses);
      storage.saveReport(selectedRole, report);

      setShowSurvey(false);
      setShowReport(true);
      onViewReport(selectedRole);
    } catch (error) {
      console.error('Error submitting survey:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit survey');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewReport = (role: BenchmarkedRole) => {
    setSelectedRole(role.id);
    setError(null);
    
    if (role.surveyCompleted) {
      const report = storage.getReport(role.id);
      if (!report) {
        try {
          const responses = storage.getSurveyResponses(role.id);
          const newReport = generateBenchmarkReport(role.title, role.theme, responses);
          storage.saveReport(role.id, newReport);
          setShowReport(true);
          setShowSurvey(false);
        } catch (error) {
          console.error('Error generating report:', error);
          setError('Failed to generate report. Please try completing the survey again.');
          setShowReport(false);
          setShowSurvey(true);
        }
      } else {
        setShowReport(true);
        setShowSurvey(false);
      }
    } else {
      setShowReport(false);
      setShowSurvey(true);
    }
  };

  const filteredRoles = selectedTheme === 'all' 
    ? roles 
    : roles.filter(role => role.theme === selectedTheme);

  if (showReport && selectedRole) {
    const report = storage.getReport(selectedRole);
    if (!report) {
      return (
        <div className="p-6 text-center text-white">
          <p className="text-red-400 mb-4">Error: Report not found</p>
          <button
            onClick={() => setShowReport(false)}
            className="px-4 py-2 text-sm font-medium bg-engage-accent hover:bg-engage-accent/90 rounded-md transition-colors"
          >
            Back to Roles
          </button>
        </div>
      );
    }
    
    return (
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-white">Benchmark Report</h2>
          <button
            onClick={() => setShowReport(false)}
            className="px-4 py-2 text-sm font-medium text-white hover:text-engage-accent transition-colors"
          >
            Back to Roles
          </button>
        </div>
        <BenchmarkReport report={report} />
      </div>
    );
  }

  if (showSurvey && selectedRole) {
    const role = roles.find(r => r.id === selectedRole);
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-medium text-white">Complete Survey for {role?.title}</h2>
              <p className="mt-2 text-sm text-gray-400">
                Please complete this survey to view the benchmarking report.
              </p>
            </div>
            <button
              onClick={() => {
                setShowSurvey(false);
                setSelectedRole(null);
                setError(null);
              }}
              className="px-4 py-2 text-sm font-medium text-white hover:text-engage-accent transition-colors"
            >
              Back to Roles
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-500/50 rounded-md">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}
        </div>
        <SurveyForm onSubmit={handleSurveySubmit} isLoading={isSubmitting} />
      </div>
    );
  }

  return (
    <div>
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex flex-col space-y-4">
          <h2 className="text-lg font-medium text-white">Benchmarked Roles</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTheme('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors
                ${selectedTheme === 'all'
                  ? 'bg-engage-accent text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
            >
              All Roles
            </button>
            {themes.map(theme => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors
                  ${selectedTheme === theme
                    ? 'bg-engage-accent text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/10">
        {filteredRoles.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-400">No roles found in this category</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {filteredRoles.map((role) => (
              <li key={role.id} className="px-6 py-5 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">{role.title}</h3>
                    <p className="text-sm text-gray-400">{role.theme}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Last updated: {new Date(role.lastUpdated).toLocaleDateString()}
                    </p>
                    {!role.surveyCompleted && (
                      <p className="text-xs text-engage-accent mt-1">
                        Survey required for report access
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleViewReport(role)}
                    className="px-4 py-2 text-sm font-medium text-white bg-engage-accent hover:bg-engage-accent/90 rounded-md transition-colors"
                  >
                    {role.surveyCompleted ? 'View Report' : 'Complete Survey'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}; 