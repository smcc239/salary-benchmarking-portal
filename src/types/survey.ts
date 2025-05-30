import { JobTheme } from './job';

export interface SurveyResponse {
  roleId: string;
  organizationCategory: 'Charity' | 'Social Enterprise' | 'Community Interest Company' | 'Private Company' | 'Public Sector' | 'Other';
  totalStaff: string;
  annualTurnover: string;
  reportingStaff: string;
  baseSalary: string;
  bonusPayments: string;
  shareValue: string;
  responsibilities: {
    staffManagement: boolean;
    budgetManagement: boolean;
    resourcesManagement: boolean;
    externalStakeholderManagement: boolean;
    systemOperation: boolean;
    marketing: boolean;
    contractManagement: boolean;
    businessDevelopment: boolean;
  };
  submittedAt: string;
}

export interface BenchmarkedRole {
  id: string;
  title: string;
  theme: string;
  surveyCompleted: boolean;
}

export interface BenchmarkReport {
  roleId: string;
  title: string;
  theme: JobTheme;
  averageSalary: number;
  salaryRange: {
    min: number;
    max: number;
  };
  averageBonus: number;
  commonBenefits: string[];
  experienceDistribution: {
    [key: string]: number;
  };
  locationDistribution: {
    [key: string]: number;
  };
  companySizeDistribution: {
    [key: string]: number;
  };
  industryDistribution: {
    [key: string]: number;
  };
  lastUpdated: string;
} 