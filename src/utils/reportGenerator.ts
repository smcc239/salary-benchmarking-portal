import { SurveyResponse, BenchmarkReport } from '../types/survey';
import { JobTheme } from '../types/user';

export const generateBenchmarkReport = (
  title: string,
  theme: JobTheme,
  responses: SurveyResponse[]
): BenchmarkReport => {
  if (responses.length === 0) {
    throw new Error('No survey responses available to generate report');
  }

  const salaries = responses.map(r => parseInt(r.baseSalary));
  const bonuses = responses.map(r => parseInt(r.bonusPayments) || 0);
  const benefits = ['Health Insurance', 'Pension', 'Flexible Working', 'Professional Development']; // Mock benefits since not in survey
  const experiences = responses.map(() => '3-5 years'); // Mock experience since not in survey
  const locations = responses.map(() => 'London'); // Mock location since not in survey
  const companySizes = responses.map(r => {
    const staff = parseInt(r.totalStaff);
    if (staff <= 50) return '1-50';
    if (staff <= 200) return '51-200';
    if (staff <= 500) return '201-500';
    return '500+';
  });
  const industries = responses.map(r => r.organizationCategory);

  const calculateDistribution = (items: string[]) => {
    return items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  };

  return {
    roleId: responses[0].roleId,
    title,
    theme,
    averageSalary: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length),
    salaryRange: {
      min: Math.min(...salaries),
      max: Math.max(...salaries)
    },
    averageBonus: Math.round(bonuses.reduce((a, b) => a + b, 0) / bonuses.length),
    commonBenefits: benefits,
    experienceDistribution: calculateDistribution(experiences),
    locationDistribution: calculateDistribution(locations),
    companySizeDistribution: calculateDistribution(companySizes),
    industryDistribution: calculateDistribution(industries),
    lastUpdated: new Date().toISOString()
  };
};

export const generateMockBenchmarkReport = (roleId: string, roleTitle: string, theme: string): BenchmarkReport => {
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