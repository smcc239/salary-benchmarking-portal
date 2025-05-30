import { JobTheme } from './job';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  role: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompensationData {
  min: number;
  max: number;
  median: number;
  average: number;
  midPoint: number;
}

export interface Compensation {
  baseSalary: CompensationData;
  pension: CompensationData;
  totalCompensation: CompensationData;
  annualBonus: CompensationData;
  overtimeEarnings: CompensationData;
}

export interface BenchmarkedRole {
  roleId: string;
  title: string;
  theme: JobTheme;
  compensation: Compensation;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  experience: string;
  education: string;
  location: string;
  organizationType: string;
  organizationSize: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
  surveyCompleted: boolean;
} 