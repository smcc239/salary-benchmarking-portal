import { BenchmarkReport } from '../types/survey';

export const generateReport = (roleId: string, roleTitle: string, theme: string): BenchmarkReport => {
  // This is a mock implementation. In a real application, this would use actual survey data
  return {
    roleId,
    title: roleTitle,
    theme,
    averageSalary: 65000,
    salaryRange: {
      min: 45000,
      max: 85000
    },
    averageBonus: 5000,
    commonBenefits: ['Health Insurance', 'Pension', 'Flexible Working', 'Professional Development'],
    experienceDistribution: {
      '0-2 years': 20,
      '3-5 years': 35,
      '6-10 years': 25,
      '10+ years': 20
    },
    locationDistribution: {
      'London': 40,
      'South East': 25,
      'North West': 15,
      'Other': 20
    },
    companySizeDistribution: {
      '1-50': 30,
      '51-200': 40,
      '201-500': 20,
      '500+': 10
    },
    industryDistribution: {
      'Charity': 35,
      'Social Enterprise': 25,
      'Public Sector': 20,
      'Private Sector': 20
    },
    lastUpdated: new Date().toISOString()
  };
}; 