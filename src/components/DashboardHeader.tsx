import React from 'react';
import { User } from '../types/user';

interface DashboardHeaderProps {
  user: User;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onLogout }) => (
  <header className="bg-engage-dark border-b border-white/10">
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <div className="flex items-center">
        <img 
          src="https://engageexec.co.uk/wp-content/themes/html5blank/img/nav/main-logo.png"
          alt="Engage Executive Talent"
          className="h-12 w-auto"
        />
        <div className="ml-8">
          <h1 className="text-2xl font-bold text-white">Salary Benchmarking</h1>
          <p className="mt-1 text-sm text-gray-300">
            Welcome back, {user.firstName} {user.lastName} | {user.company}
          </p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="px-4 py-2 text-sm font-medium text-white hover:text-engage-accent transition-colors"
      >
        Sign Out
      </button>
    </div>
  </header>
); 