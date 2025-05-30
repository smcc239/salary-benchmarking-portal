import { BenchmarkReport } from '../types/survey';
import { generateMockBenchmarkReport } from '../utils/reportGenerator';

export const generateReport = (roleId: string, roleTitle: string, theme: string): BenchmarkReport => {
  return generateMockBenchmarkReport(roleId, roleTitle, theme);
}; 