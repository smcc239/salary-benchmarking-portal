export interface JobTheme {
  id: string;
  name: string;
  description: string;
  roles: JobRole[];
}

export interface SalaryRange {
  min: number;
  max: number;
  median: number;
  average: number;
  midPoint: number;
}

export interface CompensationData {
  baseSalary: SalaryRange;
  pension: SalaryRange;
  totalCompensation: SalaryRange;
  annualBonus: SalaryRange;
  overtimeEarnings: SalaryRange;
}

export interface JobRole {
  id: string;
  title: string;
  theme: {
    id: string;
    name: string;
  };
  compensation: CompensationData;
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