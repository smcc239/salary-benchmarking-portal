import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import type { User, BenchmarkedRole } from './types/user';
import { BenchmarkReport } from './types/survey';
import { generateReport } from './services/reportService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<BenchmarkedRole[]>([]);

  const handleLogout = () => {
    setUser(null);
  };

  const handleImportData = (data: any) => {
    // Process imported data and update roles
    console.log('Imported data:', data);
  };

  const handleViewReport = (roleId: string): BenchmarkReport => {
    const role = roles.find(r => r.roleId === roleId);
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }
    return generateReport(role.roleId, role.title, role.theme);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-engage-dark flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <img
              src="https://engageexec.co.uk/wp-content/themes/html5blank/img/nav/main-logo.png"
              alt="Engage Executive Talent"
              className="mx-auto h-12 w-auto"
            />
            <h2 className="mt-6 text-3xl font-bold text-white">
              Salary Benchmarking Portal
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Sign in to access the benchmarking portal
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={(e) => {
            e.preventDefault();
            // For demo purposes, create a mock user
            setUser({
              id: '1',
              name: 'Demo User',
              email: 'demo@example.com',
              company: 'Demo Company'
            });
            // Add some mock roles
            setRoles([
              {
                id: '1',
                title: 'Chief Technology Officer',
                theme: 'Chief Officer',
                surveyCompleted: false,
                lastUpdated: new Date().toISOString()
              },
              {
                id: '2',
                title: 'Head of HR',
                theme: 'Human Resources',
                surveyCompleted: true,
                lastUpdated: new Date().toISOString()
              }
            ]);
          }}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-engage-accent focus:border-transparent"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-engage-accent focus:border-transparent"
                placeholder="Password"
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-engage-accent hover:bg-engage-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-engage-accent"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Dashboard
      user={user}
      roles={roles}
      onLogout={handleLogout}
      onImportData={handleImportData}
      onViewReport={handleViewReport}
    />
  );
};

export default App; 