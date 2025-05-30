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

  const salaries = responses.map(r => r.salary);
  const bonuses = responses.map(r => r.bonus);
  const benefits = responses.flatMap(r => r.benefits);
  const experiences = responses.map(r => r.experience);
  const locations = responses.map(r => r.location);
  const companySizes = responses.map(r => r.companySize);
  const industries = responses.map(r => r.industry);

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
    commonBenefits: [...new Set(benefits)],
    experienceDistribution: calculateDistribution(experiences.map(e => `${e} years`)),
    locationDistribution: calculateDistribution(locations),
    companySizeDistribution: calculateDistribution(companySizes),
    industryDistribution: calculateDistribution(industries),
    lastUpdated: new Date().toISOString()
  };
}; 