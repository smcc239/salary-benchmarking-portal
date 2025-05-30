import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { SurveyResponse } from '../types/survey';

const surveySchema = z.object({
  organizationCategory: z.enum(['Charity', 'Social Enterprise', 'Community Interest Company', 'Private Company', 'Public Sector', 'Other']),
  totalStaff: z.string().min(1, 'Please select total staff'),
  annualTurnover: z.string().min(1, 'Please select annual turnover'),
  reportingStaff: z.string().min(1, 'Please select reporting staff'),
  baseSalary: z.string().min(1, 'Please select base salary'),
  bonusPayments: z.string().min(1, 'Please select bonus payments'),
  shareValue: z.string().min(1, 'Please select share value'),
  responsibilities: z.object({
    staffManagement: z.boolean(),
    budgetManagement: z.boolean(),
    resourcesManagement: z.boolean(),
    externalStakeholderManagement: z.boolean(),
    systemOperation: z.boolean(),
    marketing: z.boolean(),
    contractManagement: z.boolean(),
    businessDevelopment: z.boolean(),
  }),
});

interface SurveyFormProps {
  onSubmit: (data: SurveyResponse) => Promise<void>;
  isLoading?: boolean;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ onSubmit, isLoading = false }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SurveyResponse>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      responsibilities: {
        staffManagement: false,
        budgetManagement: false,
        resourcesManagement: false,
        externalStakeholderManagement: false,
        systemOperation: false,
        marketing: false,
        contractManagement: false,
        businessDevelopment: false,
      }
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-engage-dark-lighter p-6 rounded-lg">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-engage-text">
            1. Please select the category of organisation that is closest to yours:
            <select
              {...register('organizationCategory')}
              className="mt-1 block w-full rounded-md bg-engage-dark border-engage-dark-darker text-engage-text shadow-sm focus:border-engage-accent focus:ring-engage-accent"
            >
              <option value="">Select organization category</option>
              <option value="Charity">Charity</option>
              <option value="Social Enterprise">Social Enterprise</option>
              <option value="Community Interest Company">Community Interest Company</option>
              <option value="Private Company">Private Company</option>
              <option value="Public Sector">Public Sector</option>
              <option value="Other">Other</option>
            </select>
          </label>
          {errors.organizationCategory && (
            <p className="mt-1 text-sm text-red-400">{errors.organizationCategory.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-engage-text">
            2. How many paid staff are employed across your whole organisation?
            <select
              {...register('totalStaff')}
              className="mt-1 block w-full rounded-md bg-engage-dark border-engage-dark-darker text-engage-text shadow-sm focus:border-engage-accent focus:ring-engage-accent"
            >
              <option value="">Select staff size</option>
              <option value="1-5">1-5</option>
              <option value="6-10">6-10</option>
              <option value="11-20">11-20</option>
              <option value="21-50">21-50</option>
              <option value="51-100">51-100</option>
              <option value="101-250">101-250</option>
              <option value="250+">250+</option>
            </select>
          </label>
          {errors.totalStaff && (
            <p className="mt-1 text-sm text-red-400">{errors.totalStaff.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-engage-text">
            3. What was the most recently reported turnover of your organisation?
            <select
              {...register('annualTurnover')}
              className="mt-1 block w-full rounded-md bg-engage-dark border-engage-dark-darker text-engage-text shadow-sm focus:border-engage-accent focus:ring-engage-accent"
            >
              <option value="">Select annual turnover</option>
              <option value="Under £100,000">Under £100,000</option>
              <option value="£100,001-£250,000">£100,001-£250,000</option>
              <option value="£250,001-£500,000">£250,001-£500,000</option>
              <option value="£500,001-£1m">£500,001-£1m</option>
              <option value="£1m-£2m">£1m-£2m</option>
              <option value="£2m-£5m">£2m-£5m</option>
              <option value="£5m+">£5m+</option>
            </select>
          </label>
          {errors.annualTurnover && (
            <p className="mt-1 text-sm text-red-400">{errors.annualTurnover.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-engage-text">
            4. How many staff report to the postholder of this job?
            <select
              {...register('reportingStaff')}
              className="mt-1 block w-full rounded-md bg-engage-dark border-engage-dark-darker text-engage-text shadow-sm focus:border-engage-accent focus:ring-engage-accent"
            >
              <option value="">Select reporting staff</option>
              <option value="1-5">1-5</option>
              <option value="6-10">6-10</option>
              <option value="11-20">11-20</option>
              <option value="21-50">21-50</option>
              <option value="51-100">51-100</option>
              <option value="101-250">101-250</option>
              <option value="250+">250+</option>
            </select>
          </label>
          {errors.reportingStaff && (
            <p className="mt-1 text-sm text-red-400">{errors.reportingStaff.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-engage-text">
            5. What is currently the basic salary for the post?
            <select
              {...register('baseSalary')}
              className="mt-1 block w-full rounded-md bg-engage-dark border-engage-dark-darker text-engage-text shadow-sm focus:border-engage-accent focus:ring-engage-accent"
            >
              <option value="">Select base salary</option>
              <option value="Under £25,000">Under £25,000</option>
              <option value="£25,001-£30,000">£25,001-£30,000</option>
              <option value="£30,001-£35,000">£30,001-£35,000</option>
              <option value="£35,001-£40,000">£35,001-£40,000</option>
              <option value="£40,001-£45,000">£40,001-£45,000</option>
              <option value="£45,001-£50,000">£45,001-£50,000</option>
              <option value="£50,001+">£50,001+</option>
            </select>
          </label>
          {errors.baseSalary && (
            <p className="mt-1 text-sm text-red-400">{errors.baseSalary.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-engage-text">
            6. How much in bonus payments can the postholder earn in a year?
            <select
              {...register('bonusPayments')}
              className="mt-1 block w-full rounded-md bg-engage-dark border-engage-dark-darker text-engage-text shadow-sm focus:border-engage-accent focus:ring-engage-accent"
            >
              <option value="">Select bonus payments</option>
              <option value="None">None</option>
              <option value="Under £1,000">Under £1,000</option>
              <option value="£1,001-£2,500">£1,001-£2,500</option>
              <option value="£2,501-£5,000">£2,501-£5,000</option>
              <option value="£5,001-£10,000">£5,001-£10,000</option>
              <option value="£10,000+">£10,000+</option>
            </select>
          </label>
          {errors.bonusPayments && (
            <p className="mt-1 text-sm text-red-400">{errors.bonusPayments.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-engage-text">
            7. What is the value of shares, if any, held in the organisation by the postholder?
            <select
              {...register('shareValue')}
              className="mt-1 block w-full rounded-md bg-engage-dark border-engage-dark-darker text-engage-text shadow-sm focus:border-engage-accent focus:ring-engage-accent"
            >
              <option value="">Select share value</option>
              <option value="None">None</option>
              <option value="Under £1,000">Under £1,000</option>
              <option value="£1,001-£2,500">£1,001-£2,500</option>
              <option value="£2,501-£5,000">£2,501-£5,000</option>
              <option value="£5,001-£10,000">£5,001-£10,000</option>
              <option value="£10,000+">£10,000+</option>
            </select>
          </label>
          {errors.shareValue && (
            <p className="mt-1 text-sm text-red-400">{errors.shareValue.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-engage-text mb-4">
            Main responsibilities include:
          </label>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('responsibilities.staffManagement')}
                className="rounded bg-engage-dark border-engage-dark-darker text-engage-accent focus:ring-engage-accent"
              />
              <span className="text-sm text-engage-text">Staff Management</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('responsibilities.budgetManagement')}
                className="rounded bg-engage-dark border-engage-dark-darker text-engage-accent focus:ring-engage-accent"
              />
              <span className="text-sm text-engage-text">Budget Management</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('responsibilities.resourcesManagement')}
                className="rounded bg-engage-dark border-engage-dark-darker text-engage-accent focus:ring-engage-accent"
              />
              <span className="text-sm text-engage-text">Resources Management</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('responsibilities.externalStakeholderManagement')}
                className="rounded bg-engage-dark border-engage-dark-darker text-engage-accent focus:ring-engage-accent"
              />
              <span className="text-sm text-engage-text">External Stakeholder Management</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('responsibilities.systemOperation')}
                className="rounded bg-engage-dark border-engage-dark-darker text-engage-accent focus:ring-engage-accent"
              />
              <span className="text-sm text-engage-text">Income Generation</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('responsibilities.marketing')}
                className="rounded bg-engage-dark border-engage-dark-darker text-engage-accent focus:ring-engage-accent"
              />
              <span className="text-sm text-engage-text">Marketing</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('responsibilities.contractManagement')}
                className="rounded bg-engage-dark border-engage-dark-darker text-engage-accent focus:ring-engage-accent"
              />
              <span className="text-sm text-engage-text">Contract Management</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('responsibilities.businessDevelopment')}
                className="rounded bg-engage-dark border-engage-dark-darker text-engage-accent focus:ring-engage-accent"
              />
              <span className="text-sm text-engage-text">Business Development</span>
            </label>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-engage-accent hover:bg-engage-accent-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-engage-accent disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Submitting...' : 'Submit Survey'}
        </button>
      </div>
    </form>
  );
}; 