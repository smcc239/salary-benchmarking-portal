import React, { useState } from 'react';
import { storage } from '../services/storage';
import type { SurveyResponse } from '../types/survey';

export const SurveyManager: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      // Get all survey responses from storage
      const allResponses: SurveyResponse[] = [];
      const keys = Object.keys(localStorage);
      
      for (const key of keys) {
        if (key.startsWith('survey_')) {
          const responses = storage.getSurveyResponses(key.replace('survey_', ''));
          allResponses.push(...responses);
        }
      }

      // Create and download the file
      const blob = new Blob([JSON.stringify(allResponses, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `survey_responses_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting surveys:', error);
      setError(error instanceof Error ? error.message : 'Failed to export surveys');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-white">Survey Management</h2>
        <p className="mt-2 text-sm text-gray-400">
          Export all survey responses for backup or analysis.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500/50 rounded-md">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-4 py-2 text-sm font-medium text-white bg-engage-accent hover:bg-engage-accent/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? 'Exporting...' : 'Export All Surveys'}
        </button>
      </div>
    </div>
  );
}; 