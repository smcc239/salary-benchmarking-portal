export type JobTheme = 
  | 'technology'
  | 'finance'
  | 'healthcare'
  | 'education'
  | 'nonprofit'
  | 'government'
  | 'retail'
  | 'manufacturing'
  | 'construction'
  | 'transportation'
  | 'hospitality'
  | 'media'
  | 'legal'
  | 'marketing'
  | 'sales'
  | 'customer-service'
  | 'human-resources'
  | 'operations'
  | 'research'
  | 'other';

export interface SalaryRange {
  min: number;
  max: number;
  median: number;
}

export interface JobRole {
  roleId: string;
  title: string;
  theme: JobTheme;
  averageSalary: number;
  salaryRange: SalaryRange;
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
} 