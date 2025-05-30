import React, { useState } from 'react';
import { User, BenchmarkedRole } from '../types/user';
import { DashboardHeader } from './DashboardHeader';
import { RolesList } from './RolesList';
import { DataProcessor } from './DataProcessor';
import { SurveyManager } from './SurveyManager';

interface DashboardProps {
  user: User;
  roles: BenchmarkedRole[];
  onLogout: () => void;
  onImportData: (data: any) => void;
  onViewReport: (roleId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  roles,
  onLogout,
  onImportData,
  onViewReport,
}) => {
  const [activeTab, setActiveTab] = useState<'roles' | 'survey' | 'import'>('roles');

  return (
    <div className="min-h-screen bg-engage-dark">
      <DashboardHeader user={user} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          <nav className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('roles')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'roles'
                  ? 'bg-engage-accent text-white'
                  : 'text-gray-300 hover:text-white hover:bg-engage-accent/80'
              }`}
            >
              Roles
            </button>
            <button
              onClick={() => setActiveTab('survey')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'survey'
                  ? 'bg-engage-accent text-white'
                  : 'text-gray-300 hover:text-white hover:bg-engage-accent/80'
              }`}
            >
              Survey Management
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'import'
                  ? 'bg-engage-accent text-white'
                  : 'text-gray-300 hover:text-white hover:bg-engage-accent/80'
              }`}
            >
              Import Data
            </button>
          </nav>

          <div className="bg-white/10 rounded-lg shadow-xl backdrop-blur-sm">
            {activeTab === 'roles' && (
              <RolesList roles={roles} onViewReport={onViewReport} />
            )}

            {activeTab === 'survey' && (
              <div className="p-6">
                <SurveyManager />
              </div>
            )}

            {activeTab === 'import' && (
              <div className="p-6">
                <DataProcessor onImportData={onImportData} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}; 