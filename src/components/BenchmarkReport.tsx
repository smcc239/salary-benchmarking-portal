import React from 'react';
import type { BenchmarkReport as BenchmarkReportType } from '../types/survey';

interface BenchmarkReportProps {
  report: BenchmarkReportType;
}

export const BenchmarkReport: React.FC<BenchmarkReportProps> = ({ report }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number, total: number) => {
    return `${Math.round((value / total) * 100)}%`;
  };

  const renderDistribution = (distribution: { [key: string]: number }) => {
    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    return (
      <div className="space-y-2">
        {Object.entries(distribution).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-300">{key}</span>
            <span className="text-sm text-gray-400">{formatPercentage(value, total)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Salary Overview */}
      <div className="bg-white/5 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Salary Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-400">Average Base Salary</p>
            <p className="text-2xl font-bold text-white mt-1">
              {formatCurrency(report.averageSalary)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Average Bonus</p>
            <p className="text-2xl font-bold text-white mt-1">
              {formatCurrency(report.averageBonus)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Compensation Range</p>
            <p className="text-2xl font-bold text-white mt-1">
              {formatCurrency(report.salaryRange.min)} - {formatCurrency(report.salaryRange.max)}
            </p>
          </div>
        </div>
      </div>

      {/* Common Benefits */}
      <div className="bg-white/5 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Common Benefits</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {report.commonBenefits.map(benefit => (
            <div key={benefit} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-engage-accent rounded-full" />
              <span className="text-sm text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Distribution */}
      <div className="bg-white/5 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Experience Distribution</h3>
        {renderDistribution(report.experienceDistribution)}
      </div>

      {/* Location Distribution */}
      <div className="bg-white/5 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Location Distribution</h3>
        {renderDistribution(report.locationDistribution)}
      </div>

      {/* Company Size Distribution */}
      <div className="bg-white/5 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Company Size Distribution</h3>
        {renderDistribution(report.companySizeDistribution)}
      </div>

      {/* Industry Distribution */}
      <div className="bg-white/5 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Industry Distribution</h3>
        {renderDistribution(report.industryDistribution)}
      </div>

      {/* Report Metadata */}
      <div className="text-sm text-gray-400 text-right">
        Last updated: {new Date(report.lastUpdated).toLocaleDateString()}
      </div>
    </div>
  );
}; 