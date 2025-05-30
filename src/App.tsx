import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginForm } from './components/LoginForm';
import AppRoutes from './routes';
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

  return (
    <BrowserRouter>
      {!user ? (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Salary Benchmarking Portal
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <LoginForm onLogin={handleLogin} />
            </div>
          </div>
        </div>
      ) : (
        <Layout user={user}>
          <AppRoutes />
        </Layout>
      )}
    </BrowserRouter>
  );
};

export default App; 