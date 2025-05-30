import { BenchmarkReport } from '../types/survey';
import { generateMockBenchmarkReport } from '../utils/reportGenerator';
import { JobTheme } from '../types/job';

export const generateReport = (roleId: string, roleTitle: string, theme: JobTheme): BenchmarkReport => {
  return generateMockBenchmarkReport(roleId, roleTitle, theme);
}; 