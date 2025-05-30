import React, { useState } from 'react';
import { User } from '../types/user';
import { JobRole } from '../types/job';
import { getJobThemes } from '../services/surveyService';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'reports' | 'settings'>('jobs');
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadRoles = async () => {
      try {
        const themes = await getJobThemes();
        const allRoles = themes.flatMap(theme => theme.roles);
        setRoles(allRoles);
      } catch (error) {
        console.error('Failed to load roles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoles();
  }, []);

  const tabs = [
    { id: 'jobs', label: 'My Jobs' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' }
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'jobs':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">My Jobs</h2>
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-engage-accent border-t-transparent rounded-full" />
              </div>
            ) : roles.length === 0 ? (
              <p className="text-gray-400">No jobs found. Start by completing a survey.</p>
            ) : (
              <div className="grid gap-4">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-white">{role.title}</h3>
                        <p className="text-sm text-gray-300">Theme: {role.theme.name}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          role.surveyCompleted
                            ? 'bg-green-900/50 text-green-300'
                            : 'bg-yellow-900/50 text-yellow-300'
                        }`}
                      >
                        {role.surveyCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Reports</h2>
            <p className="text-gray-400">Your reports will appear here once you complete surveys.</p>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Profile Information</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">First Name</label>
                      <p className="mt-1 text-white">{user.firstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Last Name</label>
                      <p className="mt-1 text-white">{user.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Email</label>
                      <p className="mt-1 text-white">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Company</label>
                      <p className="mt-1 text-white">{user.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-engage-accent text-engage-accent'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {renderTabContent()}
    </div>
  );
}; 