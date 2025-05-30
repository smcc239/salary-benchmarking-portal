import React from 'react';
import { Navigation } from './Navigation';
import { Breadcrumb } from './Breadcrumb';
import { User } from '../types/user';

interface LayoutProps {
  user: User;
  children?: any;
}

export const Layout: React.FC<LayoutProps> = ({ user, children }) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation user={user} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Breadcrumb />
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          {children}
        </div>
      </main>
    </div>
  );
}; 