import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { RolesList } from './RolesList';
import { User, BenchmarkedRole } from '../types/user';

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
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const themes = [
    'Chief Officer',
    'Communications',
    'Corporate Services',
    'Human Resources',
    'Income Generation',
    'Operations',
    'Service Delivery'
  ];

  const filteredRoles = selectedTheme
    ? roles.filter(role => role.theme === selectedTheme)
    : roles;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} onLogout={onLogout} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Theme Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Theme</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedTheme === theme
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-orange-600'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Roles List */}
        {selectedTheme && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedTheme} Roles
            </h3>
            <RolesList
              roles={filteredRoles}
              onViewReport={onViewReport}
            />
          </div>
        )}
      </main>
    </div>
  );
}; 