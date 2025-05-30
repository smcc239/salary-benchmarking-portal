import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Users, FileText, BarChart2, Settings, Download, Eye, Lock, CheckCircle, AlertCircle, Menu, X, Search, Filter, Bell, BookmarkPlus, Share, TrendingUp, Calendar, Globe, Award, Zap, Target, Activity, DollarSign, Building, UserCheck, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { generateReport } from './services/reportService';
import { User, BenchmarkedRole } from './types/user';
import { SurveyResponse, BenchmarkReport } from './types/survey';
import { JobTheme } from './types/job';

// Supabase client setup
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Shared constants
const organizationTypes = [
  'Charity',
  'Social Enterprise',
  'CIC',
  'Housing Association',
  'Foundation',
  'Community Group',
  'Other'
] as const;

const organizationSizes = [
  '1-10 employees',
  '11-50 employees',
  '51-100 employees',
  '101-500 employees',
  '500-1000 employees',
  '1000+ employees'
] as const;

interface DatabaseState {
  surveys: SurveyResponse[];
  reports: Record<string, BenchmarkReport>;
}

interface FilterOptions {
  orgType: string;
  salaryRange: string;
  region: string;
}

const mockRole: BenchmarkedRole = {
  roleId: '1',
  title: 'Software Engineer',
  theme: {
    id: '1',
    name: 'Technology',
    description: 'IT, Software Development, and Technical Roles',
    roles: []
  },
  compensation: {
    baseSalary: {
      min: 45000,
      max: 85000,
      median: 65000,
      average: 65000,
      midPoint: 65000
    },
    pension: {
      min: 2250,
      max: 4250,
      median: 3250,
      average: 3250,
      midPoint: 3250
    },
    totalCompensation: {
      min: 47250,
      max: 89250,
      median: 68250,
      average: 68250,
      midPoint: 68250
    },
    annualBonus: {
      min: 0,
      max: 15000,
      median: 5000,
      average: 5000,
      midPoint: 5000
    },
    overtimeEarnings: {
      min: 0,
      max: 10000,
      median: 2000,
      average: 2000,
      midPoint: 2000
    }
  },
  requirements: ['Bachelor\'s degree', '3+ years experience'],
  responsibilities: ['Develop software', 'Code review'],
  skills: ['JavaScript', 'React', 'Node.js'],
  experience: '3-5 years',
  education: 'Bachelor\'s',
  location: 'London',
  organizationType: 'Charity',
  organizationSize: '11-50 employees',
  industry: 'Technology',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  surveyCompleted: false
};

const SalaryBenchmarkingPortal: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('login');
  const [selectedRole, setSelectedRole] = useState<BenchmarkedRole | null>(null);
  const [completedSurveys, setCompletedSurveys] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Array<{ id: number; type: string; title: string; message: string; time: string; read: boolean }>>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    orgType: 'all',
    salaryRange: 'all',
    region: 'all'
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<BenchmarkedRole[]>([mockRole]);

  // Database state for local caching
  const [database, setDatabase] = useState<DatabaseState>({
    surveys: [],
    reports: {}
  });

  const handleViewReport = (roleId: string): BenchmarkReport => {
    const role = roles.find(r => r.roleId === roleId);
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }
    return generateReport(role.roleId, role.title, role.theme);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Salary Benchmarking Portal</h1>
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setCurrentView('notifications')}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative"
                  >
                    <Bell className="h-6 w-6" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                    )}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Content will be rendered here based on currentView */}
            {currentView === 'login' && (
              <div className="text-center">
                <h2 className="text-xl font-medium text-gray-900">Welcome to the Salary Benchmarking Portal</h2>
                <p className="mt-2 text-gray-600">Please sign in to continue</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SalaryBenchmarkingPortal; 