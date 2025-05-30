import { JobTheme, JobRole } from '../types/job';
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
          const newSalary = (role.compensation.baseSalary.average + surveyData.salary) / 2;
          role.compensation.baseSalary.average = Math.round(newSalary);
          
          // Update salary range
          role.compensation.baseSalary.min = Math.min(role.compensation.baseSalary.min, surveyData.salary);
          role.compensation.baseSalary.max = Math.max(role.compensation.baseSalary.max, surveyData.salary);
          
          // Mark survey as completed
          role.surveyCompleted = true;
        }
      }
      
      resolve();
    }, 1000);
  });
};

export const getJobThemes = async (): Promise<JobTheme[]> => {
  // In a real application, this would fetch from an API
  return [
    {
      id: 'tech',
      name: 'Technology',
      description: 'Technology and software development roles',
      roles: [
        {
          id: 'swe',
          title: 'Software Engineer',
          theme: {
            id: 'tech',
            name: 'Technology'
          },
          compensation: {
            baseSalary: {
              min: 80000,
              max: 150000,
              median: 115000,
              average: 120000,
              midPoint: 115000
            },
            pension: {
              min: 4000,
              max: 7500,
              median: 5750,
              average: 6000,
              midPoint: 5750
            },
            totalCompensation: {
              min: 84000,
              max: 157500,
              median: 120750,
              average: 126000,
              midPoint: 120750
            },
            annualBonus: {
              min: 8000,
              max: 15000,
              median: 11500,
              average: 12000,
              midPoint: 11500
            },
            overtimeEarnings: {
              min: 0,
              max: 15000,
              median: 5000,
              average: 6000,
              midPoint: 5000
            }
          },
          requirements: [
            'Bachelor\'s degree in Computer Science or related field',
            '3+ years of software development experience',
            'Strong knowledge of data structures and algorithms'
          ],
          responsibilities: [
            'Design and implement software solutions',
            'Write clean, maintainable, and efficient code',
            'Collaborate with cross-functional teams'
          ],
          skills: [
            'JavaScript/TypeScript',
            'React',
            'Node.js',
            'SQL',
            'Git'
          ],
          experience: '3-5 years',
          education: 'Bachelor\'s degree',
          location: 'Remote',
          organizationType: 'Technology',
          organizationSize: '1000+',
          industry: 'Technology',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          surveyCompleted: false
        }
      ]
    }
  ];
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