import { User } from '../types/user';
import { JobTheme } from '../types/job';

export const demoCredentials = {
  email: 'demo@example.com',
  password: 'Demo@123'
};

export const sampleUsers: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    company: 'Tech Corp',
    role: 'HR Manager',
    password: 'Demo@123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    company: 'Enterprise Solutions',
    role: 'Recruitment Director',
    password: 'Admin@123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const jobThemes: JobTheme[] = [
  {
    id: '1',
    name: 'Technology',
    description: 'IT, Software Development, and Technical Roles',
    roles: [
      {
        id: '1',
        title: 'Senior Software Engineer',
        compensation: {
          baseSalary: {
            min: 60000,
            max: 120000,
            median: 85000,
            average: 88000,
            midPoint: 90000
          },
          pension: {
            min: 3000,
            max: 12000,
            median: 6000,
            average: 6500,
            midPoint: 7500
          },
          totalCompensation: {
            min: 63000,
            max: 132000,
            median: 91000,
            average: 94500,
            midPoint: 97500
          },
          annualBonus: {
            min: 5000,
            max: 25000,
            median: 15000,
            average: 16000,
            midPoint: 15000
          },
          overtimeEarnings: {
            min: 0,
            max: 20000,
            median: 5000,
            average: 6000,
            midPoint: 10000
          }
        },
        requirements: [
          '5+ years of experience',
          'Strong knowledge of modern frameworks',
          'Experience with cloud platforms'
        ],
        responsibilities: [
          'Lead technical projects',
          'Mentor junior developers',
          'Architect solutions'
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'AWS'],
        experience: '5-8 years',
        education: 'Bachelor\'s in Computer Science',
        location: 'Remote',
        organizationType: 'Tech Company',
        organizationSize: '500-1000',
        industry: 'Technology',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        surveyCompleted: false
      }
    ]
  },
  {
    id: '2',
    name: 'Finance',
    description: 'Financial Services, Banking, and Accounting Roles',
    roles: [
      {
        id: '2',
        title: 'Financial Analyst',
        compensation: {
          baseSalary: {
            min: 45000,
            max: 85000,
            median: 65000,
            average: 67000,
            midPoint: 65000
          },
          pension: {
            min: 2250,
            max: 8500,
            median: 3250,
            average: 3350,
            midPoint: 5375
          },
          totalCompensation: {
            min: 47250,
            max: 93500,
            median: 68250,
            average: 70350,
            midPoint: 70375
          },
          annualBonus: {
            min: 3000,
            max: 15000,
            median: 8000,
            average: 8500,
            midPoint: 9000
          },
          overtimeEarnings: {
            min: 0,
            max: 10000,
            median: 2000,
            average: 2500,
            midPoint: 5000
          }
        },
        requirements: [
          '3+ years of experience',
          'Strong analytical skills',
          'Financial modeling expertise'
        ],
        responsibilities: [
          'Financial reporting',
          'Budget analysis',
          'Market research'
        ],
        skills: ['Excel', 'Financial Modeling', 'Data Analysis'],
        experience: '3-5 years',
        education: 'Bachelor\'s in Finance',
        location: 'Hybrid',
        organizationType: 'Financial Institution',
        organizationSize: '1000+',
        industry: 'Finance',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        surveyCompleted: false
      }
    ]
  },
  {
    id: '3',
    name: 'Healthcare',
    description: 'Medical, Nursing, and Healthcare Administration Roles',
    roles: [
      {
        id: '3',
        title: 'Healthcare Administrator',
        compensation: {
          baseSalary: {
            min: 55000,
            max: 95000,
            median: 75000,
            average: 77000,
            midPoint: 75000
          },
          pension: {
            min: 2750,
            max: 9500,
            median: 3750,
            average: 3850,
            midPoint: 6125
          },
          totalCompensation: {
            min: 57750,
            max: 104500,
            median: 78750,
            average: 80850,
            midPoint: 81125
          },
          annualBonus: {
            min: 4000,
            max: 20000,
            median: 10000,
            average: 10500,
            midPoint: 12000
          },
          overtimeEarnings: {
            min: 0,
            max: 15000,
            median: 3000,
            average: 3500,
            midPoint: 7500
          }
        },
        requirements: [
          '5+ years of healthcare experience',
          'Management experience',
          'Healthcare regulations knowledge'
        ],
        responsibilities: [
          'Facility management',
          'Staff coordination',
          'Policy implementation'
        ],
        skills: ['Healthcare Management', 'Leadership', 'Regulatory Compliance'],
        experience: '5+ years',
        education: 'Master\'s in Healthcare Administration',
        location: 'On-site',
        organizationType: 'Hospital',
        organizationSize: '500+',
        industry: 'Healthcare',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        surveyCompleted: false
      }
    ]
  }
]; 