import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegistrationForm } from './RegistrationForm';
import { registerUser, loginUser } from '../services/authService';
import { User } from '../types/user';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await loginUser(email, password);
      onLogin(user);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    setError('');
    setIsLoading(true);

    try {
      const user = await registerUser(userData);
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistering) {
    return (
      <div className="space-y-6 transition-all duration-300 ease-in-out">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Create an Account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Join our salary benchmarking platform
          </p>
        </div>

        <RegistrationForm
          onSubmit={handleRegister}
          onCancel={() => setIsRegistering(false)}
          isLoading={isLoading}
        />

        {error && (
          <div className="rounded-md bg-red-900/50 p-4 border border-red-500/50">
            <div className="flex items-center">
              <div className="h-5 w-5 text-red-400 mr-2">!</div>
              <h3 className="text-sm font-medium text-red-200">{error}</h3>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <button
              onClick={() => setIsRegistering(true)}
              className="font-medium text-engage-accent hover:text-engage-accent/80 transition-colors duration-200"
            >
              start your 14-day free trial
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-gray-300 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-engage-accent focus:border-engage-accent focus:z-10 sm:text-sm transition-colors duration-200"
                placeholder="Email address"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-gray-300 placeholder-gray-500 rounded-b-md focus:outline-none focus:ring-engage-accent focus:border-engage-accent focus:z-10 sm:text-sm transition-colors duration-200"
                placeholder="Password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-900/50 p-4 border border-red-500/50">
              <div className="flex items-center">
                <div className="h-5 w-5 text-red-400 mr-2">!</div>
                <h3 className="text-sm font-medium text-red-200">{error}</h3>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-engage-accent focus:ring-engage-accent border-gray-700 bg-gray-800 rounded transition-colors duration-200"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button
                type="button"
                className="font-medium text-engage-accent hover:text-engage-accent/80 transition-colors duration-200"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-engage-accent hover:bg-engage-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-engage-accent disabled:opacity-50 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin -ml-1 mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsRegistering(true)}
            className="text-sm font-medium text-engage-accent hover:text-engage-accent/90 transition-colors duration-200"
          >
            Don't have an account? Register here
          </button>
        </div>
      </div>
    </div>
  );
}; 