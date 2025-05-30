import { JobTheme } from './job';

export interface User {
  id: string;
  email: string;
  name: string;
  organization: string;
  role: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface BenchmarkedRole {
  roleId: string;
  title: string;
  theme: JobTheme;
  averageSalary: number;
  salaryRange: {
    min: number;
    max: number;
    median: number;
  };
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