import { JobTheme } from '../types/job';
import { sampleUsers, jobThemes } from '../data/sampleData';

interface SurveyData {
  role: string;
  salary: number;
  benefits: string[];
  experience: string;
  location: string;
  companySize: string;
  industry: string;
}

export const submitSurvey = async (surveyData: SurveyData): Promise<void> => {
  // In a real application, this would send the data to a backend
  // For now, we'll simulate a network request
  return new Promise((resolve) => {
    setTimeout(() => {
      // Update the job theme data with the new survey response
      const theme = jobThemes.find((t: JobTheme) => 
        t.roles.some((r: { title: string }) => r.title === surveyData.role)
      );
      
      if (theme) {
        const role = theme.roles.find((r: { title: string }) => r.title === surveyData.role);
        if (role) {
          // Update the role's salary data
          const newSalary = (role.averageSalary + surveyData.salary) / 2;
          role.averageSalary = Math.round(newSalary);
          
          // Update salary range
          role.salaryRange.min = Math.min(role.salaryRange.min, surveyData.salary);
          role.salaryRange.max = Math.max(role.salaryRange.max, surveyData.salary);
          
          // Mark survey as completed
          role.surveyCompleted = true;
        }
      }
      
      resolve();
    }, 1000);
  });
};

export const getJobThemes = async (): Promise<JobTheme[]> => {
  // In a real application, this would fetch from a backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(jobThemes);
    }, 500);
  });
};

export const getBenchmarkData = async (roleId: string): Promise<JobTheme | null> => {
  // In a real application, this would fetch from a backend
  return new Promise((resolve) => {
    setTimeout(() => {
      const theme = jobThemes.find((t: JobTheme) => 
        t.roles.some((r: { id: string }) => r.id === roleId)
      );
      resolve(theme || null);
    }, 500);
  });
};

export const verifySurveyCompletion = async (roleId: string): Promise<boolean> => {
  // In a real application, this would check against a backend
  return new Promise((resolve) => {
    setTimeout(() => {
      const theme = jobThemes.find((t: JobTheme) => 
        t.roles.some((r: { id: string }) => r.id === roleId)
      );
      const role = theme?.roles.find((r: { id: string }) => r.id === roleId);
      resolve(role?.surveyCompleted || false);
    }, 500);
  });
}; 