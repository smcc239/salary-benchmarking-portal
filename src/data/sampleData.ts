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
    id: 'tech',
    name: 'Technology',
    description: 'IT, Software Development, and Technical Roles',
    roles: [
      {
        id: '1',
        title: 'Senior Software Engineer',
        theme: {
          id: 'tech',
          name: 'Technology'
        },
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
      },
      {
        id: '2',
        title: 'Product Manager',
        theme: {
          id: 'tech',
          name: 'Technology'
        },
        compensation: {
          baseSalary: {
            min: 70000,
            max: 140000,
            median: 95000,
            average: 98000,
            midPoint: 105000
          },
          pension: {
            min: 3500,
            max: 14000,
            median: 7000,
            average: 7500,
            midPoint: 8750
          },
          totalCompensation: {
            min: 73500,
            max: 154000,
            median: 102000,
            average: 105500,
            midPoint: 113750
          },
          annualBonus: {
            min: 7000,
            max: 28000,
            median: 14000,
            average: 15000,
            midPoint: 17500
          },
          overtimeEarnings: {
            min: 0,
            max: 14000,
            median: 7000,
            average: 8000,
            midPoint: 7000
          }
        },
        requirements: [
          '3+ years of product management experience',
          'Strong analytical skills',
          'Experience with agile methodologies'
        ],
        responsibilities: [
          'Define product strategy',
          'Gather and prioritize requirements',
          'Work with cross-functional teams'
        ],
        skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research'],
        experience: '3-5 years',
        education: 'Bachelor\'s degree',
        location: 'Hybrid',
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
    id: 'finance',
    name: 'Finance',
    description: 'Financial Services and Banking Roles',
    roles: [
      {
        id: '3',
        title: 'Financial Analyst',
        theme: {
          id: 'finance',
          name: 'Finance'
        },
        compensation: {
          baseSalary: {
            min: 50000,
            max: 100000,
            median: 75000,
            average: 78000,
            midPoint: 75000
          },
          pension: {
            min: 2500,
            max: 10000,
            median: 5000,
            average: 5500,
            midPoint: 6250
          },
          totalCompensation: {
            min: 52500,
            max: 110000,
            median: 80000,
            average: 83500,
            midPoint: 81250
          },
          annualBonus: {
            min: 5000,
            max: 20000,
            median: 10000,
            average: 11000,
            midPoint: 12500
          },
          overtimeEarnings: {
            min: 0,
            max: 10000,
            median: 5000,
            average: 6000,
            midPoint: 5000
          }
        },
        requirements: [
          'Bachelor\'s degree in Finance or related field',
          '2+ years of financial analysis experience',
          'Strong Excel skills'
        ],
        responsibilities: [
          'Prepare financial reports',
          'Analyze market trends',
          'Support budgeting process'
        ],
        skills: ['Financial Analysis', 'Excel', 'Financial Modeling', 'Data Analysis'],
        experience: '2-4 years',
        education: 'Bachelor\'s degree',
        location: 'Office',
        organizationType: 'Financial Institution',
        organizationSize: '1000+',
        industry: 'Finance',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        surveyCompleted: false
      },
      {
        id: '4',
        title: 'Investment Banker',
        theme: {
          id: 'finance',
          name: 'Finance'
        },
        compensation: {
          baseSalary: {
            min: 80000,
            max: 160000,
            median: 120000,
            average: 125000,
            midPoint: 120000
          },
          pension: {
            min: 4000,
            max: 16000,
            median: 8000,
            average: 9000,
            midPoint: 10000
          },
          totalCompensation: {
            min: 84000,
            max: 176000,
            median: 128000,
            average: 134000,
            midPoint: 130000
          },
          annualBonus: {
            min: 8000,
            max: 32000,
            median: 16000,
            average: 18000,
            midPoint: 20000
          },
          overtimeEarnings: {
            min: 0,
            max: 16000,
            median: 8000,
            average: 9000,
            midPoint: 8000
          }
        },
        requirements: [
          'Bachelor\'s degree in Finance or related field',
          '3+ years of investment banking experience',
          'Strong financial modeling skills'
        ],
        responsibilities: [
          'Lead M&A transactions',
          'Prepare pitch books',
          'Manage client relationships'
        ],
        skills: ['Financial Modeling', 'Valuation', 'M&A', 'Client Management'],
        experience: '3-5 years',
        education: 'Bachelor\'s degree',
        location: 'Office',
        organizationType: 'Investment Bank',
        organizationSize: '1000+',
        industry: 'Finance',
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
        theme: {
          id: '2',
          name: 'Finance'
        },
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
        theme: {
          id: '3',
          name: 'Healthcare'
        },
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