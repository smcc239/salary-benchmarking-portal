import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { User } from '../types/user';

interface RegistrationFormProps {
  onRegister: (user: User) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await registerUser(formData);
      onRegister(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <a href="#" className="font-medium text-engage-accent hover:text-engage-accent/80">
              Sign in
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-engage-accent focus:border-engage-accent focus:z-10 sm:text-sm"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-engage-accent focus:border-engage-accent focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="organization" className="sr-only">
                Organization
              </label>
              <input
                id="organization"
                name="organization"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-engage-accent focus:border-engage-accent focus:z-10 sm:text-sm"
                placeholder="Organization"
                value={formData.organization}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="role" className="sr-only">
                Role
              </label>
              <input
                id="role"
                name="role"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-engage-accent focus:border-engage-accent focus:z-10 sm:text-sm"
                placeholder="Role"
                value={formData.role}
                onChange={handleChange}
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
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-engage-accent focus:border-engage-accent focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-engage-accent hover:bg-engage-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-engage-accent disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 