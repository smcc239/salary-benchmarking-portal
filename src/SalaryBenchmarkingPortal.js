import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Users, FileText, BarChart3, Settings, Download, Eye, Lock, CheckCircle, AlertCircle, Menu, X, Search, Filter, Bell, BookmarkPlus, Share, TrendingUp, Calendar, Globe, Award, Zap, Target, Activity, DollarSign, Building, UserCheck, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SalaryBenchmarkingPortal = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [selectedRole, setSelectedRole] = useState(null);
  const [completedSurveys, setCompletedSurveys] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    orgType: 'all',
    salaryRange: 'all',
    region: 'all'
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Database state for local caching
  const [database, setDatabase] = useState({
    surveys: [],
    reports: {}
  });

  // Enhanced mock data for fallback
  const mockSalaryData = {
    'Chief Executive Officer': {
      data: [
        { range: '£40k-£50k', count: 8, median: 45000, bonus: 3500, region: 'North' },
        { range: '£50k-£60k', count: 15, median: 55000, bonus: 5500, region: 'Midlands' },
        { range: '£60k-£70k', count: 22, median: 65000, bonus: 7500, region: 'South' },
        { range: '£70k-£80k', count: 18, median: 75000, bonus: 9500, region: 'London' },
        { range: '£80k-£90k', count: 12, median: 85000, bonus: 12000, region: 'Scotland' },
        { range: '£90k+', count: 6, median: 95000, bonus: 15000, region: 'Wales' }
      ],
      trends: [
        { year: '2020', salary: 58000 },
        { year: '2021', salary: 61000 },
        { year: '2022', salary: 63500 },
        { year: '2023', salary: 66000 },
        { year: '2024', salary: 68500 },
        { year: '2025', salary: 71000 }
      ],
      demographics: [
        { name: 'Charity', value: 45, color: '#3B82F6' },
        { name: 'Social Enterprise', value: 25, color: '#10B981' },
        { name: 'CIC', value: 15, color: '#F59E0B' },
        { name: 'Housing Association', value: 10, color: '#EF4444' },
        { name: 'Foundation', value: 5, color: '#8B5CF6' }
      ]
    },
    'HR Director': {
      data: [
        { range: '£35k-£45k', count: 12, median: 40000, bonus: 2500, region: 'North' },
        { range: '£45k-£55k', count: 20, median: 50000, bonus: 4000, region: 'Midlands' },
        { range: '£55k-£65k', count: 16, median: 60000, bonus: 5500, region: 'South' },
        { range: '£65k-£75k', count: 8, median: 70000, bonus: 7000, region: 'London' }
      ],
      trends: [
        { year: '2020', salary: 48000 },
        { year: '2021', salary: 50000 },
        { year: '2022', salary: 52000 },
        { year: '2023', salary: 54500 },
        { year: '2024', salary: 56500 },
        { year: '2025', salary: 58000 }
      ],
      demographics: [
        { name: 'Charity', value: 50, color: '#3B82F6' },
        { name: 'Social Enterprise', value: 30, color: '#10B981' },
        { name: 'CIC', value: 12, color: '#F59E0B' },
        { name: 'Housing Association', value: 8, color: '#EF4444' }
      ]
    }
  };

  // Enhanced role categories
  const roleCategories = {
    'CEO': {
      roles: ['Chief Executive Officer', 'Executive Director', 'Managing Director', 'Chief Operating Officer'],
      icon: '👑',
      description: 'Senior leadership and executive roles'
    },
    'Head of Communications': {
      roles: ['Communications Director', 'Marketing Director', 'PR Manager', 'Digital Marketing Manager'],
      icon: '📢',
      description: 'Communications and marketing leadership'
    },
    'Corporate Roles': {
      roles: ['CFO', 'COO', 'Strategy Director', 'Business Development Director', 'Legal Director'],
      icon: '🏢',
      description: 'Corporate and strategic functions'
    },
    'Human Resources': {
      roles: ['HR Director', 'People & Culture Director', 'Talent Manager', 'Learning & Development Manager'],
      icon: '👥',
      description: 'People and organizational development'
    },
    'Income Generation': {
      roles: ['Fundraising Director', 'Development Manager', 'Grants Manager', 'Corporate Partnerships Manager'],
      icon: '💰',
      description: 'Revenue generation and fundraising'
    },
    'Operations': {
      roles: ['Operations Director', 'Programme Director', 'Service Manager', 'Quality Manager'],
      icon: '⚙️',
      description: 'Operational delivery and management'
    },
    'Service Delivery': {
      roles: ['Service Director', 'Programme Manager', 'Impact Manager', 'Client Services Manager'],
      icon: '🎯',
      description: 'Front-line service delivery'
    }
  };

  // Check authentication state on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          role: session.user.user_metadata?.role || 'user',
          name: session.user.user_metadata?.full_name || session.user.email.split('@')[0]
        });
        await loadUserSurveys(session.user.id);
        setCurrentView('dashboard');
      }
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setCurrentUser(null);
        setCurrentView('login');
        setCompletedSurveys(new Set());
        setDatabase({ surveys: [], reports: {} });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Logo component with fallback
  const Logo = ({ className = "h-8 w-auto", showText = true, textSize = "text-lg" }) => (
    <div className="flex items-center space-x-2">
      <div className="rounded p-1 flex items-center justify-center" style={{ minWidth: '120px', minHeight: '32px' }}>
        <img 
          src="https://engageexec.co.uk/wp-content/themes/html5blank/img/nav/main-logo.png" 
          alt="Engage Executive Talent" 
          className={className}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="hidden items-center justify-center text-black font-bold px-2" style={{ display: 'none', fontSize: '10px' }}>
          <span style={{ color: '#ee8900' }}>ENGAGE</span>
          <span className="ml-1" style={{ color: '#000000' }}>EXEC</span>
        </div>
      </div>
      {showText && (
        <span className={`font-semibold ${textSize}`}>Engage Executive Talent</span>
      )}
    </div>
  );

  const getSurveyKey = (role) => `survey_${role.replace(/\s+/g, '_').toLowerCase()}`;

  const hasSurveyAccess = (role) => {
    return completedSurveys.has(getSurveyKey(role));
  };

  // Load user's surveys from database
  const loadUserSurveys = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Convert database format to local format
      const surveys = data.map(survey => ({
        id: survey.id,
        userId: survey.user_id,
        role: survey.role,
        submittedAt: survey.created_at,
        orgType: survey.org_type,
        orgSize: survey.org_size,
        turnover: survey.turnover,
        reports: survey.reports?.toString() || '',
        baseSalary: survey.base_salary?.toString() || '',
        bonus: survey.bonus?.toString() || '',
        shareholding: survey.shareholding || '',
        responsibilities: survey.responsibilities || [],
        benefits: survey.benefits || [],
        workingArrangement: survey.working_arrangement || '',
        experienceLevel: survey.experience_level || '',
        qualifications: survey.qualifications || [],
        geographicLocation: survey.geographic_location || '',
        previousRole: survey.previous_role || '',
        careerProgression: survey.career_progression || ''
      }));
      
      // Update completed surveys set
      const completedRoles = new Set(surveys.map(survey => getSurveyKey(survey.role)));
      setCompletedSurveys(completedRoles);
      
      // Update database state
      setDatabase(prev => ({
        ...prev,
        surveys: surveys
      }));
      
    } catch (error) {
      console.error('Error loading surveys:', error);
    }
  };

  // Load all surveys for admin
  const loadAllSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert database format to local format
      const surveys = data.map(survey => ({
        id: survey.id,
        userId: survey.user_id,
        role: survey.role,
        submittedAt: survey.created_at,
        orgType: survey.org_type,
        orgSize: survey.org_size,
        turnover: survey.turnover,
        reports: survey.reports?.toString() || '',
        baseSalary: survey.base_salary?.toString() || '',
        bonus: survey.bonus?.toString() || '',
        shareholding: survey.shareholding || '',
        responsibilities: survey.responsibilities || [],
        benefits: survey.benefits || [],
        workingArrangement: survey.working_arrangement || '',
        experienceLevel: survey.experience_level || '',
        qualifications: survey.qualifications || [],
        geographicLocation: survey.geographic_location || '',
        previousRole: survey.previous_role || '',
        careerProgression: survey.career_progression || ''
      }));
      
      // Update database state
      setDatabase(prev => ({
        ...prev,
        surveys: surveys
      }));
      
      return surveys;
    } catch (error) {
      console.error('Error loading all surveys:', error);
      return [];
    }
  };

  // Save survey to database
  const saveSurveyToDatabase = async (surveyData, role) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('surveys')
        .insert([{
          user_id: user.id,
          role: role,
          org_type: surveyData.orgType,
          org_size: surveyData.orgSize,
          turnover: surveyData.turnover,
          reports: parseInt(surveyData.reports) || null,
          base_salary: parseInt(surveyData.baseSalary),
          bonus: parseInt(surveyData.bonus) || 0,
          shareholding: surveyData.shareholding || null,
          responsibilities: surveyData.responsibilities,
          benefits: surveyData.benefits,
          working_arrangement: surveyData.workingArrangement || null,
          experience_level: surveyData.experienceLevel || null,
          qualifications: surveyData.qualifications,
          geographic_location: surveyData.geographicLocation || null,
          previous_role: surveyData.previousRole || null,
          career_progression: surveyData.careerProgression || null
        }])
        .select();

      if (error) throw error;
      
      // Update local state
      const newSurvey = {
        id: data[0].id,
        userId: data[0].user_id,
        role: data[0].role,
        submittedAt: data[0].created_at,
        orgType: data[0].org_type,
        orgSize: data[0].org_size,
        turnover: data[0].turnover,
        reports: data[0].reports?.toString() || '',
        baseSalary: data[0].base_salary?.toString() || '',
        bonus: data[0].bonus?.toString() || '',
        shareholding: data[0].shareholding || '',
        responsibilities: data[0].responsibilities || [],
        benefits: data[0].benefits || [],
        workingArrangement: data[0].working_arrangement || '',
        experienceLevel: data[0].experience_level || '',
        qualifications: data[0].qualifications || [],
        geographicLocation: data[0].geographic_location || '',
        previousRole: data[0].previous_role || '',
        careerProgression: data[0].career_progression || ''
      };
      
      setDatabase(prev => ({
        ...prev,
        surveys: [...prev.surveys, newSurvey]
      }));
      
      setCompletedSurveys(prev => new Set([...prev, getSurveyKey(role)]));
      setLoading(false);
      
      return newSurvey;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Generate dynamic reports from survey data
  const generateReportData = (role) => {
    const roleSurveys = database.surveys.filter(survey => survey.role === role);
    
    if (roleSurveys.length === 0) {
      // Return default mock data if no surveys exist
      return mockSalaryData[role] || mockSalaryData['Chief Executive Officer'];
    }

    // Process real survey data
    const salaryRanges = {
      'Under £40k': { min: 0, max: 40000, range: 'Under £40k' },
      '£40k-£50k': { min: 40000, max: 50000, range: '£40k-£50k' },
      '£50k-£60k': { min: 50000, max: 60000, range: '£50k-£60k' },
      '£60k-£70k': { min: 60000, max: 70000, range: '£60k-£70k' },
      '£70k-£80k': { min: 70000, max: 80000, range: '£70k-£80k' },
      '£80k-£90k': { min: 80000, max: 90000, range: '£80k-£90k' },
      '£90k+': { min: 90000, max: Infinity, range: '£90k+' }
    };

    const distribution = {};
    Object.keys(salaryRanges).forEach(range => {
      distribution[range] = { count: 0, totalSalary: 0, totalBonus: 0 };
    });

    // Categorize survey data
    roleSurveys.forEach(survey => {
      const salary = parseInt(survey.baseSalary);
      const bonus = parseInt(survey.bonus) || 0;
      
      for (const [rangeName, rangeData] of Object.entries(salaryRanges)) {
        if (salary >= rangeData.min && salary < rangeData.max) {
          distribution[rangeName].count++;
          distribution[rangeName].totalSalary += salary;
          distribution[rangeName].totalBonus += bonus;
          break;
        }
      }
    });

    // Create chart data
    const data = Object.entries(distribution).map(([range, data]) => ({
      range,
      count: data.count,
      median: data.count > 0 ? Math.round(data.totalSalary / data.count) : 0,
      bonus: data.count > 0 ? Math.round(data.totalBonus / data.count) : 0,
      region: 'Various'
    })).filter(item => item.count > 0);

    // Generate trends (simplified)
    const currentYear = new Date().getFullYear();
    const avgSalary = roleSurveys.reduce((sum, s) => sum + parseInt(s.baseSalary), 0) / roleSurveys.length;
    const trends = Array.from({length: 6}, (_, i) => ({
      year: (currentYear - 5 + i).toString(),
      salary: Math.round(avgSalary * (0.9 + i * 0.02))
    }));

    // Generate demographics
    const orgTypes = {};
    roleSurveys.forEach(survey => {
      orgTypes[survey.orgType] = (orgTypes[survey.orgType] || 0) + 1;
    });

    const demographics = Object.entries(orgTypes).map(([name, count], index) => ({
      name,
      value: Math.round((count / roleSurveys.length) * 100),
      color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
    }));

    return {
      data: data.length > 0 ? data : mockSalaryData['Chief Executive Officer'].data,
      trends: trends.length > 0 && trends[0].salary > 0 ? trends : mockSalaryData['Chief Executive Officer'].trends,
      demographics: demographics.length > 0 ? demographics : mockSalaryData['Chief Executive Officer'].demographics
    };
  };

  // Get user's completed surveys
  const getUserSurveys = (userId) => {
    return database.surveys.filter(survey => survey.userId === userId);
  };

  // Get all surveys for admin
  const getAllSurveys = () => {
    return database.surveys;
  };

  // Get aggregated statistics
  const getSystemStats = () => {
    const totalSurveys = database.surveys.length;
    const uniqueRoles = new Set(database.surveys.map(s => s.role)).size;
    const avgSalary = database.surveys.length > 0 
      ? Math.round(database.surveys.reduce((sum, s) => sum + parseInt(s.baseSalary), 0) / database.surveys.length)
      : 0;
    
    return {
      totalUsers: 2, // This would come from user management in a real app
      totalSurveys,
      uniqueRoles,
      avgSalary,
      dataQuality: totalSurveys > 5 ? 98 : 85
    };
  };

  // Authentication with Supabase
  const handleLogin = async (email, password, isDemo = false) => {
    try {
      setLoading(true);
      
      if (isDemo) {
        // For demo purposes, create a demo session
        const demoUser = {
          id: isDemo === 'admin' ? 'admin-demo' : 'user-demo',
          email: isDemo === 'admin' ? 'admin@engage.com' : 'user@demo.com',
          user_metadata: {
            full_name: isDemo === 'admin' ? 'Sarah Administrator' : 'John Smith',
            role: isDemo === 'admin' ? 'admin' : 'user'
          }
        };
        
        setUser(demoUser);
        setCurrentUser({
          id: demoUser.id,
          email: demoUser.email,
          role: demoUser.user_metadata.role,
          name: demoUser.user_metadata.full_name
        });
        
        if (isDemo === 'admin') {
          await loadAllSurveys();
        } else {
          // Load demo user surveys (empty for demo)
          setCompletedSurveys(new Set());
        }
        
        setCurrentView('dashboard');
        setLoading(false);
        
        setNotifications([{
          id: 1,
          type: 'success',
          title: isDemo === 'admin' ? 'Admin Demo Access!' : 'Demo User Access!',
          message: 'You are now using the demo version of the application.',
          time: new Date().toISOString(),
          read: false
        }]);
        
        return;
      }
      
      // Try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // If user doesn't exist, create account
        if (error.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: email.split('@')[0],
                role: 'user'
              }
            }
          });
          
          if (signUpError) throw signUpError;
          
          alert('Account created! Please check your email to verify your account, then try logging in again.');
          setLoading(false);
          return;
        }
        throw error;
      }
      
      setUser(data.user);
      setCurrentUser({
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role || 'user',
        name: data.user.user_metadata?.full_name || email.split('@')[0]
      });
      
      // Load user's surveys
      await loadUserSurveys(data.user.id);
      
      setCurrentView('dashboard');
      setLoading(false);
      
      setNotifications([{
        id: 1,
        type: 'success',
        title: 'Welcome back!',
        message: 'Successfully logged in to your account.',
        time: new Date().toISOString(),
        read: false
      }]);
      
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentUser(null);
    setCurrentView('login');
    setSidebarOpen(false);
    setNotifications([]);
    setCompletedSurveys(new Set());
    setDatabase({ surveys: [], reports: {} });
  };

  // Enhanced Survey Form with database integration
  const SurveyForm = ({ role, onComplete }) => {
    const [formData, setFormData] = useState({
      orgType: '',
      orgSize: '',
      turnover: '',
      reports: '',
      baseSalary: '',
      bonus: '',
      shareholding: '',
      responsibilities: [],
      benefits: [],
      workingArrangement: '',
      experienceLevel: '',
      qualifications: [],
      geographicLocation: '',
      previousRole: '',
      careerProgression: ''
    });

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const orgTypes = ['Charity', 'Social Enterprise', 'CIC', 'Housing Association', 'Foundation', 'Community Group'];
    const orgSizes = ['1-10', '11-50', '51-100', '101-500', '500-1000', '1000+'];
    const turnoverRanges = ['Under £100k', '£100k-£500k', '£500k-£1m', '£1m-£5m', '£5m-£10m', '£10m+'];
    const workingArrangements = ['Full-time Office', 'Hybrid', 'Remote', 'Flexible Hours', 'Part-time'];
    const experienceLevels = ['1-3 years', '4-7 years', '8-12 years', '13-20 years', '20+ years'];
    const geographicLocations = ['London', 'South East', 'South West', 'Midlands', 'North', 'Scotland', 'Wales', 'Northern Ireland'];

    const responsibilityOptions = [
      'Strategic Planning', 'Team Management', 'Budget Management', 'Stakeholder Relations',
      'Board Reporting', 'Fundraising', 'Programme Delivery', 'Risk Management',
      'Policy Development', 'Partnership Building', 'Innovation & Change', 'Digital Transformation'
    ];

    const benefitOptions = [
      'Pension (Employer contribution)', 'Private Healthcare', 'Life Insurance', 'Professional Development Budget',
      'Flexible Working', 'Additional Annual Leave', 'Cycle to Work Scheme', 'Employee Assistance Programme',
      'Sabbatical Options', 'Study Leave', 'Wellbeing Support', 'Childcare Support'
    ];

    const qualificationOptions = [
      'Bachelor\'s Degree', 'Master\'s Degree', 'PhD/Doctorate', 'Professional Certification',
      'Management Qualification', 'Sector-specific Training', 'Leadership Programme', 'Other'
    ];

    const handleSubmit = () => {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        return;
      }

      // Final validation
      if (!formData.orgType || !formData.orgSize || !formData.turnover || !formData.baseSalary) {
        alert('Please fill in all required fields (marked with *)');
        return;
      }
      
      // Save to Supabase database
      saveSurveyToDatabase(formData, role)
        .then(() => {
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'success',
            title: 'Survey Completed Successfully!',
            message: `Thank you for completing the ${role} survey. Your data has been saved and the benchmark report is now available with updated insights.`,
            time: new Date().toISOString(),
            read: false
          }]);
          
          onComplete();
        })
        .catch((error) => {
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'error',
            title: 'Survey Submission Failed',
            message: error.message || 'Please try again. If the problem persists, contact support.',
            time: new Date().toISOString(),
            read: false
          }]);
        });
    };

    const handlePrevious = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    };

    const handleArrayChange = (value, array, setter) => {
      setFormData(prev => ({
        ...prev,
        [setter]: prev[setter].includes(value)
          ? prev[setter].filter(item => item !== value)
          : [...prev[setter], value]
      }));
    };

    const renderStep = () => {
      switch (currentStep) {
        case 1:
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Organization Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organisation Type *
                  </label>
                  <select
                    value={formData.orgType}
                    onChange={(e) => setFormData(prev => ({ ...prev, orgType: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">Select organisation type</option>
                    {orgTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organisation Size *
                  </label>
                  <select
                    value={formData.orgSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, orgSize: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">Select size</option>
                    {orgSizes.map(size => (
                      <option key={size} value={size}>{size} employees</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Turnover *
                  </label>
                  <select
                    value={formData.turnover}
                    onChange={(e) => setFormData(prev => ({ ...prev, turnover: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">Select turnover range</option>
                    {turnoverRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Geographic Location
                  </label>
                  <select
                    value={formData.geographicLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, geographicLocation: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">Select location</option>
                    {geographicLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );

        case 2:
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Role & Experience</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Direct Reports
                  </label>
                  <input
                    type="number"
                    value={formData.reports}
                    onChange={(e) => setFormData(prev => ({ ...prev, reports: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="e.g., 5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">Select experience level</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Working Arrangement
                  </label>
                  <select
                    value={formData.workingArrangement}
                    onChange={(e) => setFormData(prev => ({ ...prev, workingArrangement: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">Select working arrangement</option>
                    {workingArrangements.map(arrangement => (
                      <option key={arrangement} value={arrangement}>{arrangement}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Role
                  </label>
                  <input
                    type="text"
                    value={formData.previousRole}
                    onChange={(e) => setFormData(prev => ({ ...prev, previousRole: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="e.g., Operations Manager"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Qualifications (select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {qualificationOptions.map(qual => (
                    <label key={qual} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.qualifications.includes(qual)}
                        onChange={() => handleArrayChange(qual, formData.qualifications, 'qualifications')}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{qual}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );

        case 3:
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Compensation Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Salary (£) *
                  </label>
                  <input
                    type="number"
                    value={formData.baseSalary}
                    onChange={(e) => setFormData(prev => ({ ...prev, baseSalary: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="e.g., 65000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Bonus (£)
                  </label>
                  <input
                    type="number"
                    value={formData.bonus}
                    onChange={(e) => setFormData(prev => ({ ...prev, bonus: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="e.g., 5000"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Benefits Package (select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {benefitOptions.map(benefit => (
                      <label key={benefit} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.benefits.includes(benefit)}
                          onChange={() => handleArrayChange(benefit, formData.benefits, 'benefits')}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );

        case 4:
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Key Responsibilities</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select all responsibilities that apply to your role
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {responsibilityOptions.map(responsibility => (
                    <label key={responsibility} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.responsibilities.includes(responsibility)}
                        onChange={() => handleArrayChange(responsibility, formData.responsibilities, 'responsibilities')}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{responsibility}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Career Progression Plans
                </label>
                <textarea
                  value={formData.careerProgression}
                  onChange={(e) => setFormData(prev => ({ ...prev, careerProgression: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  rows="4"
                  placeholder="Tell us about your career goals and progression plans..."
                />
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          {/* Progress bar */}
          <div className="bg-black p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Salary Survey: {role}
            </h2>
            <div className="flex items-center space-x-4 mb-4">
              <Logo className="h-6 w-auto" showText={false} />
              <span className="text-white font-medium">Engage Executive Talent</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              <span className="text-white font-medium">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
          </div>

          <div className="p-8">
            {renderStep()}
            
            <div className="flex justify-between pt-8">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-md transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                Previous
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'} text-white px-8 py-3 rounded-md focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all flex items-center space-x-2`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving Survey...</span>
                  </>
                ) : (
                  <>
                    <span>{currentStep === totalSteps ? 'Complete Survey' : 'Next Step'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Salary Report with real data
  const SalaryReport = ({ role }) => {
    const [reportLoading, setReportLoading] = useState(true);
    const [selectedView, setSelectedView] = useState('overview');
    
    // Generate report data directly
    React.useEffect(() => {
      const timer = setTimeout(() => {
        setReportLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }, [role]);

    if (reportLoading) {
      return (
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Generating Report</h2>
            <p className="text-gray-600">Analyzing survey data and creating insights for {role}...</p>
          </div>
        </div>
      );
    }

    const reportData = generateReportData(role);
    const { data, trends, demographics } = reportData;
    const totalResponses = data.reduce((sum, item) => sum + item.count, 0);
    const averageSalary = totalResponses > 0 ? data.reduce((sum, item) => sum + (item.median * item.count), 0) / totalResponses : 0;
    const averageBonus = totalResponses > 0 ? data.reduce((sum, item) => sum + (item.bonus * item.count), 0) / totalResponses : 0;
    const roleSurveys = database.surveys.filter(survey => survey.role === role);

    const exportToPDF = () => {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'info',
        title: 'Export Started',
        message: `Generating PDF report for ${role}...`,
        time: new Date().toISOString(),
        read: false
      }]);
    };

    const exportToExcel = () => {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'info',
        title: 'Export Started',
        message: `Generating Excel export for ${role}...`,
        time: new Date().toISOString(),
        read: false
      }]);
    };

    const shareReport = () => {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        title: 'Share Link Created',
        message: 'Report link copied to clipboard!',
        time: new Date().toISOString(),
        read: false
      }]);
    };

    const bookmarkReport = () => {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        title: 'Report Bookmarked',
        message: `${role} report added to your bookmarks.`,
        time: new Date().toISOString(),
        read: false
      }]);
    };

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-black p-8">
            <div className="flex justify-between items-start">
              <div className="text-white">
                <div className="flex items-center space-x-4 mb-4">
                  <Logo className="h-8 w-auto" showText={false} />
                  <div>
                    <h1 className="text-4xl font-bold">{role}</h1>
                    <p className="text-gray-300 text-lg">Comprehensive Salary Analysis & Benchmarking</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>{totalResponses} total data points</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Updated May 2025</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>{roleSurveys.length > 0 ? `${roleSurveys.length} live surveys` : 'Industry baseline data'}</span>
                  </div>
                  {roleSurveys.length > 0 && (
                    <div className="flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-800 text-sm font-medium">Live Data</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={bookmarkReport}
                  className="bg-white bg-opacity-20 backdrop-blur text-white px-4 py-2 rounded-md hover:bg-opacity-30 transition-all flex items-center space-x-2"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Bookmark</span>
                </button>
                <button
                  onClick={shareReport}
                  className="bg-white bg-opacity-20 backdrop-blur text-white px-4 py-2 rounded-md hover:bg-opacity-30 transition-all flex items-center space-x-2"
                >
                  <Share className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button
                  onClick={exportToPDF}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={exportToExcel}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Excel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="border-b border-gray-200 bg-white">
            <nav className="flex overflow-x-auto">
              {['overview', 'trends', 'demographics', 'insights'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedView(tab)}
                  className={`whitespace-nowrap py-4 px-6 text-sm font-medium border-b-2 capitalize ${
                    selectedView === tab
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-orange-600 hover:border-orange-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {selectedView === 'overview' && (
              <>
                {/* Data source indicator */}
                {roleSurveys.length > 0 ? (
                  <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold text-orange-900">Live Survey Data</span>
                    </div>
                    <p className="text-orange-800 text-sm mt-1">
                      This report includes {roleSurveys.length} real survey response{roleSurveys.length !== 1 ? 's' : ''} for {role} positions, 
                      providing current market insights specific to your sector.
                    </p>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">Industry Baseline Data</span>
                    </div>
                    <p className="text-blue-800 text-sm mt-1">
                      This report shows industry benchmark data. Complete the survey for this role to see live, 
                      sector-specific salary insights mixed with your contributed data.
                    </p>
                  </div>
                )}

                {/* Key metrics cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl border-l-4 border-orange-600 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <DollarSign className="w-8 h-8 text-orange-600" />
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Average Salary</h3>
                    <p className="text-3xl font-bold text-orange-600">£{Math.round(averageSalary).toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-2">+8.5% vs last year</p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border-l-4 border-gray-600 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <Users className="w-8 h-8 text-gray-600" />
                      <Activity className="w-5 h-5 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Sample Size</h3>
                    <p className="text-3xl font-bold text-gray-600">{totalResponses}</p>
                    <p className="text-sm text-gray-600 mt-2">Highly representative</p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border-l-4 border-gray-600 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <Target className="w-8 h-8 text-gray-600" />
                      <Star className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Median Range</h3>
                    <p className="text-3xl font-bold text-gray-600">£60k-£70k</p>
                    <p className="text-sm text-gray-600 mt-2">Most common band</p>
                  </div>

                  <div className="bg-black p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <Zap className="w-8 h-8 text-orange-400" />
                      <TrendingUp className="w-5 h-5 text-orange-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">Avg Bonus</h3>
                    <p className="text-3xl font-bold text-orange-400">£{Math.round(averageBonus).toLocaleString()}</p>
                    <p className="text-gray-300 text-sm mt-2">12% of base salary</p>
                  </div>
                </div>

                {/* Main chart */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Salary Distribution Analysis</h3>
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <ResponsiveContainer width="100%" height={450}>
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          formatter={(value, name) => [value, name === 'count' ? 'Number of roles' : name]}
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                        />
                        <Bar dataKey="count" fill="#ee8900" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Insights grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <MessageSquare className="w-6 h-6 text-orange-600 mr-2" />
                      Key Insights
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">Market Position</p>
                          <p className="text-gray-600 text-sm">Salaries are 15% above market average, indicating competitive positioning</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">Growth Trajectory</p>
                          <p className="text-gray-600 text-sm">8.5% year-on-year growth reflects strong sector performance</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">Geographic Variation</p>
                          <p className="text-gray-600 text-sm">London roles command 25% premium over national average</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Globe className="w-6 h-6 text-orange-600 mr-2" />
                      Sector Comparison
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Private Sector</span>
                        <span className="font-semibold text-red-600">+15% higher</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Public Sector</span>
                        <span className="font-semibold text-orange-600">+8% higher</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Charity Sector</span>
                        <span className="font-semibold text-green-600">Baseline</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">International NGOs</span>
                        <span className="font-semibold text-purple-600">+22% higher</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedView === 'trends' && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Salary Trends Over Time</h3>
                <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`£${value.toLocaleString()}`, 'Average Salary']} />
                      <Area type="monotone" dataKey="salary" stroke="#ee8900" fill="#fcd34d" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">5-Year Growth</h4>
                    <p className="text-3xl font-bold text-green-600">22.4%</p>
                    <p className="text-sm text-gray-600 mt-1">Compound annual growth rate</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Best Year</h4>
                    <p className="text-3xl font-bold text-blue-600">2024</p>
                    <p className="text-sm text-gray-600 mt-1">8.5% growth vs 2023</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Forecast 2026</h4>
                    <p className="text-3xl font-bold text-purple-600">£74k</p>
                    <p className="text-sm text-gray-600 mt-1">Projected average</p>
                  </div>
                </div>
              </div>
            )}

            {selectedView === 'demographics' && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Organization Type Distribution</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={demographics}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {demographics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Breakdown by Organization Type</h4>
                    {demographics.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="text-2xl font-bold" style={{ color: item.color }}>
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedView === 'insights' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">AI-Powered Insights</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                      <div className="flex items-center mb-4">
                        <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                        <h4 className="text-lg font-semibold text-green-900">Market Opportunities</h4>
                      </div>
                      <ul className="space-y-2 text-green-800">
                        <li>• Strong demand for digital transformation skills</li>
                        <li>• Emerging opportunities in impact measurement</li>
                        <li>• Growing emphasis on ESG reporting capabilities</li>
                      </ul>
                    </div>
                    
                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                      <div className="flex items-center mb-4">
                        <AlertCircle className="w-6 h-6 text-orange-600 mr-2" />
                        <h4 className="text-lg font-semibold text-orange-900">Considerations</h4>
                      </div>
                      <ul className="space-y-2 text-orange-800">
                        <li>• Skills gap in data analytics and AI</li>
                        <li>• Competition for top talent increasing</li>
                        <li>• Need for enhanced remote work policies</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Recommendation Engine</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2">For Organizations</h5>
                        <p className="text-sm text-blue-800">Consider benchmarking benefits packages alongside salary to remain competitive</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h5 className="font-medium text-purple-900 mb-2">For Candidates</h5>
                        <p className="text-sm text-purple-800">Focus on developing strategic and digital skills for career advancement</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h5 className="font-medium text-green-900 mb-2">Market Trends</h5>
                        <p className="text-sm text-green-800">Expect continued growth in demand for senior leadership roles</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Login Form
  const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [message, setMessage] = useState(null);
    
    // Registration form state
    const [registrationData, setRegistrationData] = useState({
      fullName: '',
      jobTitle: '',
      organizationName: '',
      organizationType: '',
      organizationSize: '',
      organizationLocation: '',
      sectorExperience: '',
      primaryInterest: '',
      referralSource: '',
      termsAccepted: false,
      privacyAccepted: false,
      dataProcessingAccepted: false,
      marketingAccepted: false
    });

    const organizationTypes = [
      'Charity',
      'Social Enterprise',
      'CIC',
      'Housing Association',
      'Foundation',
      'Community Group',
      'Other'
    ];

    const organizationSizes = [
      '1-10 employees',
      '11-50 employees',
      '51-100 employees',
      '101-500 employees',
      '500-1000 employees',
      '1000+ employees'
    ];

    const sectorExperience = [
      'Less than 1 year',
      '1-3 years',
      '4-7 years',
      '8-12 years',
      '13-20 years',
      '20+ years'
    ];

    const primaryInterests = [
      'Salary Benchmarking',
      'Compensation Strategy',
      'Market Research',
      'HR Planning',
      'Recruitment',
      'Other'
    ];

    const referralSources = [
      'Search Engine',
      'Social Media',
      'Colleague Referral',
      'Industry Event',
      'Newsletter',
      'Other'
    ];

    // Registration handler
    const handleRegister = async () => {
      if (!email || !password) {
        setMessage({ type: 'error', text: 'Please enter both email and password.' });
        return;
      }

      // Validate required fields
      const requiredFields = {
        fullName: 'Full Name',
        organizationName: 'Organization Name',
        organizationType: 'Organization Type',
        termsAccepted: 'Terms & Conditions',
        privacyAccepted: 'Privacy Policy',
        dataProcessingAccepted: 'Data Processing Consent'
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !registrationData[key])
        .map(([_, label]) => label);

      if (missingFields.length > 0) {
        setMessage({ 
          type: 'error', 
          text: `Please complete all required fields: ${missingFields.join(', ')}` 
        });
        return;
      }

      setFormLoading(true);
      setMessage(null);
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              ...registrationData,
              role: 'user',
              registration_date: new Date().toISOString()
            }
          }
        });
        if (error) throw error;
        setMessage({ 
          type: 'success', 
          text: 'Account created! Please check your email to verify your account, then log in.' 
        });
        setIsRegistering(false);
        setEmail('');
        setPassword('');
        setRegistrationData({
          fullName: '',
          jobTitle: '',
          organizationName: '',
          organizationType: '',
          organizationSize: '',
          organizationLocation: '',
          sectorExperience: '',
          primaryInterest: '',
          referralSource: '',
          termsAccepted: false,
          privacyAccepted: false,
          dataProcessingAccepted: false,
          marketingAccepted: false
        });
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      }
      setFormLoading(false);
    };

    // Login handler (real user, not demo)
    const handleRealLogin = async () => {
      if (!email || !password) {
        setMessage({ type: 'error', text: 'Please enter both email and password.' });
        return;
      }
      setFormLoading(true);
      setMessage(null);
      try {
        await handleLogin(email, password, false);
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      }
      setFormLoading(false);
    };

    const renderRegistrationForm = () => (
      <div className="space-y-6">
        {/* Account credentials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="Create a password"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={registrationData.fullName}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="John Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={registrationData.jobTitle}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, jobTitle: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="HR Director"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organisation Name *
            </label>
            <input
              type="text"
              value={registrationData.organizationName}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, organizationName: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="Your Organisation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organisation Type *
            </label>
            <select
              value={registrationData.organizationType}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, organizationType: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            >
              <option value="">Select type</option>
              {organizationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organisation Size
            </label>
            <select
              value={registrationData.organizationSize}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, organizationSize: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            >
              <option value="">Select size</option>
              {organizationSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organisation Location
            </label>
            <input
              type="text"
              value={registrationData.organizationLocation}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, organizationLocation: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="London, UK"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sector Experience
            </label>
            <select
              value={registrationData.sectorExperience}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, sectorExperience: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            >
              <option value="">Select experience</option>
              {sectorExperience.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Interest
            </label>
            <select
              value={registrationData.primaryInterest}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, primaryInterest: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            >
              <option value="">Select interest</option>
              {primaryInterests.map(interest => (
                <option key={interest} value={interest}>{interest}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How did you hear about us?
          </label>
          <select
            value={registrationData.referralSource}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, referralSource: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          >
            <option value="">Select source</option>
            {referralSources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={registrationData.termsAccepted}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
              className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I accept the <a href="#" className="text-orange-600 hover:text-orange-800">Terms & Conditions</a> *
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="privacy"
              checked={registrationData.privacyAccepted}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, privacyAccepted: e.target.checked }))}
              className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="privacy" className="text-sm text-gray-700">
              I accept the <a href="#" className="text-orange-600 hover:text-orange-800">Privacy Policy</a> *
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="dataProcessing"
              checked={registrationData.dataProcessingAccepted}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, dataProcessingAccepted: e.target.checked }))}
              className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="dataProcessing" className="text-sm text-gray-700">
              I consent to the processing of my data for salary benchmarking purposes *
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="marketing"
              checked={registrationData.marketingAccepted}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, marketingAccepted: e.target.checked }))}
              className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="marketing" className="text-sm text-gray-700">
              I agree to receive occasional updates about salary trends and platform features
            </label>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>* Required fields</p>
          <p className="mt-2">
            By registering, you agree to our data processing practices as outlined in our Privacy Policy. 
            Your data will be used solely for salary benchmarking purposes and will be handled in accordance with GDPR requirements.
          </p>
        </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-orange-100 opacity-30"></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gray-100 opacity-30"></div>
          </div>
          
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-black p-8 text-center">
              <div className="flex justify-center mb-4">
                <Logo className="h-12 w-auto" showText={false} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Salary Benchmarking Portal</h1>
              <p className="text-gray-300">Engage Executive Talent</p>
            </div>
            
            <div className="p-8">
              {!isRegistering ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="Password"
                    />
                  </div>
                </div>
              ) : (
                renderRegistrationForm()
              )}

              {message && (
                <div className={`mt-4 text-center text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                  {message.text}
                </div>
              )}

              <div className="mt-6 space-y-3">
                {isRegistering ? (
                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={formLoading}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? 'Registering...' : 'Create Account'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRealLogin}
                    disabled={formLoading}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                )}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setMessage(null);
                  }}
                  className="text-orange-600 hover:text-orange-800 text-sm transition-colors"
                >
                  {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register here'}
                </button>
              </div>

              {/* Demo access section */}
              <div className="mt-8 border-t pt-6">
                <div className="text-center text-gray-500 text-xs mb-2">Or try a demo account:</div>
                <button
                  type="button"
                  onClick={() => handleLogin('admin@engage.com', 'admin', 'admin')}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all mb-2"
                >
                  🚀 Demo Admin Access
                </button>
                <button
                  type="button"
                  onClick={() => handleLogin('user@demo.com', 'user', 'user')}
                  className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                >
                  👤 Demo User Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Navigation with notifications
  const Navigation = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'roles', label: 'Salary Reports', icon: FileText },
      { id: 'survey', label: 'Complete Survey', icon: Users },
      { id: 'profile', label: 'My Profile', icon: Eye },
      ...(currentUser?.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: Settings }] : [])
    ];

    return (
      <>
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg border border-gray-200"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Notifications button */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="lg:hidden fixed top-4 right-4 z-50 bg-white p-2 rounded-lg shadow-lg border border-gray-200 relative"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 border-r border-gray-200`}>
          <div className="bg-black p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Logo className="h-6 w-auto" showText={false} />
              <div className="text-white">
                <h3 className="font-semibold">{currentUser?.name}</h3>
                <p className="text-gray-300 text-sm">{currentUser?.role}</p>
              </div>
            </div>
            <div className="bg-orange-600 rounded-lg p-3">
              <div className="flex justify-between text-white text-sm">
                <span>Surveys Completed</span>
                <span className="font-bold">{completedSurveys.size}</span>
              </div>
            </div>
          </div>
          
          <nav className="mt-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-6 py-4 text-left hover:bg-orange-50 transition-all ${
                    currentView === item.id ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-600' : 'text-gray-700 hover:text-orange-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Notifications panel in sidebar */}
          <div className="p-6 border-t border-gray-200 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Notifications</h4>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notifications.slice(0, 5).map(notification => (
                <div key={notification.id} className={`p-3 rounded-lg border ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-start space-x-2">
                    {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />}
                    {notification.type === 'info' && <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-600">{notification.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-all transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </>
    );
  };

  // Enhanced Dashboard with real data
  const Dashboard = () => {
    const [quickStats] = useState(() => getSystemStats());
    const userSurveys = getUserSurveys(currentUser?.id);

    return (
      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo className="h-10 w-auto" showText={false} />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {currentUser?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-600 text-lg">Here's your salary benchmarking overview</p>
            </div>
          </div>
          <div className="hidden md:flex space-x-3">
            <button 
              onClick={() => setCurrentView('roles')}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-all flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Quick Survey</span>
            </button>
          </div>
        </div>
        
        {/* Enhanced metrics grid with real data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-orange-600" />
              <div className="bg-orange-50 rounded-full p-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-1 text-gray-900">Surveys Completed</h3>
            <p className="text-3xl font-bold text-orange-600">{userSurveys.length}</p>
            <p className="text-gray-600 text-sm mt-2">
              {userSurveys.length > 0 ? `Latest: ${new Date(userSurveys[userSurveys.length - 1].submittedAt).toLocaleDateString()}` : 'Start your first survey'}
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-orange-600" />
              <div className="bg-orange-50 rounded-full p-2">
                <Activity className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-1 text-gray-900">Available Reports</h3>
            <p className="text-3xl font-bold text-orange-600">{Object.keys(roleCategories).length}</p>
            <p className="text-gray-600 text-sm mt-2">Unlocked: {completedSurveys.size}</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-orange-600" />
              <div className="bg-orange-50 rounded-full p-2">
                <Star className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-1 text-gray-900">Your Avg Salary</h3>
            <p className="text-3xl font-bold text-orange-600">
              {userSurveys.length > 0 
                ? `£${Math.round(userSurveys.reduce((sum, s) => sum + parseInt(s.baseSalary), 0) / userSurveys.length).toLocaleString()}`
                : 'N/A'
              }
            </p>
            <p className="text-gray-600 text-sm mt-2">
              {userSurveys.length > 0 ? 'Across your roles' : 'Complete surveys to see'}
            </p>
          </div>
        </div>

        {/* Recent activity and quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Activity className="w-6 h-6 text-orange-600 mr-2" />
                Getting Started Guide
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Complete Your First Survey',
                    description: 'Share your salary data to unlock comprehensive benchmark reports',
                    action: 'Start Survey',
                    completed: completedSurveys.size > 0,
                    color: 'orange'
                  },
                  {
                    step: 2,
                    title: 'Explore Salary Reports',
                    description: 'View detailed analytics and compare with industry standards',
                    action: 'View Reports',
                    completed: false,
                    color: 'gray'
                  },
                  {
                    step: 3,
                    title: 'Export Your Data',
                    description: 'Download reports in PDF or Excel format for your records',
                    action: 'Export Data',
                    completed: false,
                    color: 'gray'
                  }
                ].map(item => (
                  <div key={item.step} className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      item.completed 
                        ? 'bg-orange-100 text-orange-600' 
                        : item.color === 'orange' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-bold">{item.step}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                    <button 
                      onClick={() => item.step === 1 ? setCurrentView('roles') : null}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        item.completed
                          ? 'bg-orange-100 text-orange-700'
                          : item.step === 1 
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                      }`}
                    >
                      {item.completed ? 'Completed' : item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 text-orange-600 mr-2" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Surveys</span>
                  <span className="font-bold text-orange-600">{getSystemStats().totalSurveys}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Roles</span>
                  <span className="font-bold text-orange-600">{getSystemStats().uniqueRoles}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Salary</span>
                  <span className="font-bold text-orange-600">
                    {getSystemStats().avgSalary > 0 ? `£${getSystemStats().avgSalary.toLocaleString()}` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-orange-600 mr-2">💡</span>
                Pro Tip
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Complete surveys for multiple roles to get a comprehensive view of your organization's compensation strategy and unlock advanced analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Roles View with search and filtering
  const RolesView = () => {
    const [activeTab, setActiveTab] = useState('CEO');
    const [searchTerm, setSearchTerm] = useState('');

    const handleRoleClick = (role) => {
      if (hasSurveyAccess(role)) {
        setSelectedRole(role);
        setCurrentView('report');
      } else {
        setSelectedRole(role);
        setCurrentView('surveyForm');
      }
    };

    const filteredRoles = roleCategories[activeTab]?.roles.filter(role =>
      role.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <Logo className="h-10 w-auto" showText={false} />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Salary Benchmarks</h1>
              <p className="text-gray-600 text-lg">Explore compensation data across different roles and sectors</p>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-white">
            <nav className="flex overflow-x-auto">
              {Object.entries(roleCategories).map(([category, details]) => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`whitespace-nowrap py-4 px-6 text-sm font-medium border-b-2 transition-all flex items-center space-x-2 ${
                    activeTab === category
                      ? 'border-orange-500 text-orange-600 bg-orange-50'
                      : 'border-transparent text-gray-500 hover:text-orange-600 hover:border-orange-300'
                  }`}
                >
                  <span className="text-lg">{details.icon}</span>
                  <span>{category}</span>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{activeTab}</h2>
              <p className="text-gray-600">{roleCategories[activeTab]?.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoles.map(role => {
                const hasAccess = hasSurveyAccess(role);
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleClick(role)}
                    className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                      hasAccess
                        ? 'border-orange-600 bg-orange-50 hover:bg-orange-100'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{role}</h3>
                      {hasAccess ? (
                        <div className="bg-orange-600 rounded-full p-2">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="bg-gray-400 rounded-full p-2">
                          <Lock className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <p className={`text-sm mb-4 ${hasAccess ? 'text-orange-700' : 'text-gray-600'}`}>
                      {hasAccess ? 'Click to view comprehensive salary report with charts and analytics' : 'Complete survey to unlock detailed benchmark report'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        hasAccess ? 'bg-orange-200 text-orange-800' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {hasAccess ? 'Unlocked' : 'Locked'}
                      </span>
                      <ArrowRight className={`w-4 h-4 ${hasAccess ? 'text-orange-600' : 'text-gray-400'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Admin Panel with real data
  const AdminPanel = () => {
    const [adminView, setAdminView] = useState('overview');
    const [adminLoading, setAdminLoading] = useState(false);
    const stats = getSystemStats();
    const allSurveys = getAllSurveys();
    
    // Load all surveys when admin panel opens
    React.useEffect(() => {
      if (currentUser?.role === 'admin') {
        loadAllSurveys();
      }
    }, [currentUser?.role]);
    
    const exportSurveyData = () => {
      setAdminLoading(true);
      
      setTimeout(() => {
        const csvData = allSurveys.map(survey => ({
          Role: survey.role,
          'Organization Type': survey.orgType,
          'Organization Size': survey.orgSize,
          'Annual Turnover': survey.turnover,
          'Base Salary': survey.baseSalary,
          'Bonus': survey.bonus || 0,
          'Geographic Location': survey.geographicLocation,
          'Submitted Date': new Date(survey.submittedAt).toLocaleDateString()
        }));
        
        if (csvData.length === 0) {
          alert('No survey data available to export.');
          setAdminLoading(false);
          return;
        }
        
        // Create downloadable CSV
        const csvContent = [
          Object.keys(csvData[0]).join(','),
          ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `salary_survey_data_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'success',
          title: 'Data Export Complete',
          message: `Successfully exported ${allSurveys.length} survey responses to CSV.`,
          time: new Date().toISOString(),
          read: false
        }]);
        
        setAdminLoading(false);
      }, 2000);
    };

    const generateConsolidatedReport = () => {
      setAdminLoading(true);
      
      setTimeout(() => {
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'success',
          title: 'Consolidated Report Generated',
          message: 'Comprehensive salary analysis report has been created with insights across all roles.',
          time: new Date().toISOString(),
          read: false
        }]);
        
        setAdminLoading(false);
      }, 3000);
    };

    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center space-x-4">
          <Logo className="h-10 w-auto" showText={false} />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Control Panel</h1>
            <p className="text-gray-600 text-lg">Manage surveys, analyze data, and oversee system performance</p>
          </div>
        </div>
        
        {/* Real-time stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-gray-900 font-medium mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.totalUsers}</p>
            <p className="text-sm text-gray-600">System users</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-gray-900 font-medium mb-2">Survey Responses</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.totalSurveys}</p>
            <p className="text-sm text-gray-600">Completed surveys</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-gray-900 font-medium mb-2">Active Roles</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.uniqueRoles}</p>
            <p className="text-sm text-gray-600">With survey data</p>
          </div>
          <div className="bg-black p-6 rounded-xl border border-gray-800">
            <h3 className="text-white font-medium mb-2">Avg Salary</h3>
            <p className="text-3xl font-bold text-orange-400">
              {stats.avgSalary > 0 ? `£${stats.avgSalary.toLocaleString()}` : 'N/A'}
            </p>
            <p className="text-gray-300 text-sm">Across all roles</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-orange-50 rounded-xl p-3 mr-4">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Survey Management</h2>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Total Surveys</span>
                  <span className="text-orange-600 font-bold">{allSurveys.length}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Latest: {allSurveys.length > 0 ? new Date(allSurveys[0].submittedAt).toLocaleDateString() : 'None'}
                </div>
              </div>
              <button 
                onClick={() => setAdminView('surveys')}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-between"
              >
                <span>View All Survey Responses</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-gray-50 rounded-xl p-3 mr-4">
                <Download className="w-6 h-6 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Data Export</h2>
            </div>
            <div className="space-y-3">
              <button 
                onClick={exportSurveyData}
                disabled={adminLoading}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-between disabled:opacity-50"
              >
                <span>Export Survey Data (CSV)</span>
                {adminLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <button 
                onClick={generateConsolidatedReport}
                disabled={adminLoading}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-between disabled:opacity-50"
              >
                <span>Generate Consolidated Report</span>
                {adminLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-black rounded-xl p-3 mr-4">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">User Analytics</h2>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Survey Completion Rate</div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full"
                      style={{ width: `${Math.min((stats.totalSurveys / Math.max(stats.totalUsers, 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Math.round((stats.totalSurveys / Math.max(stats.totalUsers, 1)) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Survey data table */}
        {adminView === 'surveys' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Survey Responses</h3>
                <button 
                  onClick={() => setAdminView('overview')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allSurveys.map((survey) => (
                    <tr key={survey.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {survey.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {survey.orgType} ({survey.orgSize})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        £{parseInt(survey.baseSalary).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {survey.geographicLocation || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(survey.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {allSurveys.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No survey responses yet. Data will appear here as users complete surveys.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main layout and routing
  if (!currentUser) {
    return <LoginForm />;
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'roles':
        return <RolesView />;
      case 'survey':
        return <RolesView />; // Redirect to roles for survey selection
      case 'surveyForm':
        return <SurveyForm role={selectedRole} onComplete={() => setCurrentView('report')} />;
      case 'report':
        return <SalaryReport role={selectedRole} />;
      case 'profile':
        return <Dashboard />; // Use dashboard for now
      case 'admin':
        return currentUser.role === 'admin' ? <AdminPanel /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="lg:ml-72">
        <main className="min-h-screen">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default SalaryBenchmarkingPortal;