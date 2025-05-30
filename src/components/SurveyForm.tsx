import React, { useState } from 'react';
import type { SurveyResponse } from '../types/survey';

interface SurveyFormProps {
  onSubmit: (data: SurveyResponse) => void;
  isLoading: boolean;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    salary: '',
    bonus: '',
    benefits: [] as string[],
    experience: '',
    location: '',
    companySize: '',
    industry: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      roleId: 'temp-id', // This will be set by the parent component
      salary: Number(formData.salary),
      bonus: Number(formData.bonus),
      benefits: formData.benefits,
      experience: Number(formData.experience),
      location: formData.location,
      companySize: formData.companySize,
      industry: formData.industry,
      submittedAt: new Date().toISOString()
    });
  };

  const handleArrayChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      benefits: checked
        ? [...prev.benefits, value]
        : prev.benefits.filter(b => b !== value)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Base Salary (£)
          </label>
          <input
            type="number"
            required
            value={formData.salary}
            onChange={e => setFormData(prev => ({ ...prev, salary: e.target.value }))}
            className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-engage-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Annual Bonus (£)
          </label>
          <input
            type="number"
            required
            value={formData.bonus}
            onChange={e => setFormData(prev => ({ ...prev, bonus: e.target.value }))}
            className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-engage-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Years of Experience
          </label>
          <input
            type="number"
            required
            value={formData.experience}
            onChange={e => setFormData(prev => ({ ...prev, experience: e.target.value }))}
            className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-engage-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Location
          </label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-engage-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Company Size
          </label>
          <select
            required
            value={formData.companySize}
            onChange={e => setFormData(prev => ({ ...prev, companySize: e.target.value }))}
            className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-engage-accent"
          >
            <option value="">Select company size</option>
            <option value="1-50">1-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Industry
          </label>
          <select
            required
            value={formData.industry}
            onChange={e => setFormData(prev => ({ ...prev, industry: e.target.value }))}
            className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-engage-accent"
          >
            <option value="">Select industry</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Non-Profit">Non-Profit</option>
            <option value="Government">Government</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Benefits
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            'Health Insurance',
            'Dental Insurance',
            'Vision Insurance',
            'Life Insurance',
            '401(k)',
            'Pension',
            'Stock Options',
            'Remote Work',
            'Flexible Hours',
            'Professional Development',
            'Gym Membership',
            'Childcare'
          ].map(benefit => (
            <label key={benefit} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.benefits.includes(benefit)}
                onChange={e => handleArrayChange(benefit, e.target.checked)}
                className="rounded bg-white/5 border-white/10 text-engage-accent focus:ring-engage-accent"
              />
              <span className="text-sm text-gray-300">{benefit}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-engage-accent hover:bg-engage-accent/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Submitting...' : 'Submit Survey'}
        </button>
      </div>
    </form>
  );
}; 