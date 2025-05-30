import React, { useState, useEffect, ChangeEvent } from 'react';
import { JobTheme, JobRole } from '../types/job';
import { getJobThemes, getBenchmarkData } from '../services/surveyService';

interface CompensationCardProps {
  title: string;
  data: {
    min: number;
    max: number;
    median: number;
    average: number;
    midPoint: number;
  };
}

const CompensationCard: React.FC<CompensationCardProps> = ({ title, data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Low</span>
          <span className="text-white font-medium">{formatCurrency(data.min)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Mid-Point</span>
          <span className="text-white font-medium">{formatCurrency(data.midPoint)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">High</span>
          <span className="text-white font-medium">{formatCurrency(data.max)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Median</span>
          <span className="text-white font-medium">{formatCurrency(data.median)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Average</span>
          <span className="text-white font-medium">{formatCurrency(data.average)}</span>
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const [themes, setThemes] = useState<JobTheme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadThemes = async () => {
      try {
        const data = await getJobThemes();
        setThemes(data);
        if (data.length > 0) {
          setSelectedTheme(data[0].id);
        }
      } catch (err) {
        setError('Failed to load job themes');
      } finally {
        setIsLoading(false);
      }
    };

    loadThemes();
  }, []);

  useEffect(() => {
    const loadRoleData = async () => {
      if (!selectedTheme) return;

      try {
        setIsLoading(true);
        const theme = await getBenchmarkData(selectedTheme);
        if (theme && theme.roles.length > 0) {
          setSelectedRole(theme.roles[0]);
        }
      } catch (err) {
        setError('Failed to load role data');
      } finally {
        setIsLoading(false);
      }
    };

    loadRoleData();
  }, [selectedTheme]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-engage-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Salary Benchmarking Dashboard</h1>
          <p className="text-gray-400">View and compare compensation data across different roles</p>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-300 mb-2">
                Job Theme
              </label>
              <select
                id="theme"
                value={selectedTheme}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedTheme(e.target.value)}
                className="block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-300 shadow-sm focus:border-engage-accent focus:ring-engage-accent sm:text-sm"
              >
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                Role
              </label>
              <select
                id="role"
                value={selectedRole?.id || ''}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  const theme = themes.find((t) => t.id === selectedTheme);
                  const role = theme?.roles.find((r) => r.id === e.target.value);
                  setSelectedRole(role || null);
                }}
                className="block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-300 shadow-sm focus:border-engage-accent focus:ring-engage-accent sm:text-sm"
              >
                {themes
                  .find((t) => t.id === selectedTheme)
                  ?.roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {selectedRole && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CompensationCard
              title="Base Salary"
              data={selectedRole.compensation.baseSalary}
            />
            <CompensationCard
              title="Pension"
              data={selectedRole.compensation.pension}
            />
            <CompensationCard
              title="Total Compensation"
              data={selectedRole.compensation.totalCompensation}
            />
            <CompensationCard
              title="Annual Bonus"
              data={selectedRole.compensation.annualBonus}
            />
            <CompensationCard
              title="Overtime Earnings"
              data={selectedRole.compensation.overtimeEarnings}
            />
          </div>
        )}

        {selectedRole && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Role Details</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  {selectedRole.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Responsibilities</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  {selectedRole.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 