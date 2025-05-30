export interface SurveyResponse {
  roleId: string;
  salary: number;
  bonus: number;
  benefits: string[];
  experience: number;
  location: string;
  companySize: string;
  industry: string;
  submittedAt: string;
}

export interface BenchmarkReport {
  roleId: string;
  title: string;
  theme: string;
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