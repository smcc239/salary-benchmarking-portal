import React, { useState, ChangeEvent } from 'react';
import { User } from '../types/user';

interface RegistrationFormProps {
  onSubmit: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  onCancel,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await onSubmit({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        role: formData.role
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            required
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-300 shadow-sm focus:border-engage-accent focus:ring-engage-accent sm:text-sm transition-colors duration-200"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            required
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-300 shadow-sm focus:border-engage-accent focus:ring-engage-accent sm:text-sm transition-colors duration-200"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-300 shadow-sm focus:border-engage-accent focus:ring-engage-accent sm:text-sm transition-colors duration-200"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-300">
          Company
        </label>
        <input
          type="text"
          name="company"
          id="company"
          required
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-300 shadow-sm focus:border-engage-accent focus:ring-engage-accent sm:text-sm transition-colors duration-200"
          value={formData.company}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-300">
          Role
        </label>
        <input
          type="text"
          name="role"
          id="role"
          required
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-300 shadow-sm focus:border-engage-accent focus:ring-engage-accent sm:text-sm transition-colors duration-200"
          value={formData.role}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
          Password
        </label>
        <div className="relative mt-1">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            required
            className="block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-300 shadow-sm focus:border-engage-accent focus:ring-engage-accent sm:text-sm transition-colors duration-200"
            value={formData.password}
            onChange={handleChange}
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

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
          Confirm Password
        </label>
        <div className="relative mt-1">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            required
            className="block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-300 shadow-sm focus:border-engage-accent focus:ring-engage-accent sm:text-sm transition-colors duration-200"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
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

      <div className="flex items-center justify-between space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-engage-accent transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-engage-accent hover:bg-engage-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-engage-accent disabled:opacity-50 transition-all duration-200"
        >
          {isLoading ? (
            <>
              <div className="animate-spin -ml-1 mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </div>
    </form>
  );
}; 