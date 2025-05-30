import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginForm } from './components/LoginForm';
import { User } from './types/user';

// Mock user for development
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  organization: 'Acme Corp',
  role: 'HR Manager',
  password: 'password123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Salary Benchmarking Portal
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <LoginForm onLogin={handleLogin} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<Navigate to="/roles" replace />} />
          <Route path="/roles" element={<div>Job Roles</div>} />
          <Route path="/roles/themes" element={<div>Job Themes</div>} />
          <Route path="/roles/single" element={<div>Single Job</div>} />
          <Route path="/reports" element={<div>Reports</div>} />
          <Route path="/reports/single" element={<div>Single Reports</div>} />
          <Route path="/profile" element={<div>Profile</div>} />
          <Route path="/profile/settings" element={<div>Profile Settings</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App; 