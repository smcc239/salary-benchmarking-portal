export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
}

export type JobTheme = 
  | 'Chief Officer'
  | 'Communications'
  | 'Corporate Services'
  | 'Human Resources'
  | 'Income Generation'
  | 'Operations'
  | 'Service Delivery';

export interface BenchmarkedRole {
  id: string;
  title: string;
  theme: JobTheme;
  surveyCompleted: boolean;
  lastUpdated: string;
} 