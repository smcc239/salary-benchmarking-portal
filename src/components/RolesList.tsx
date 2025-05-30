import React, { useState } from 'react';
import { BarChart2, FileText } from 'lucide-react';
import { SurveyForm } from './SurveyForm';
import { BenchmarkReport } from './BenchmarkReport';
import type { BenchmarkedRole, BenchmarkReport as BenchmarkReportType } from '../types/survey';

interface RolesListProps {
  roles: BenchmarkedRole[];
  onViewReport: (roleId: string) => BenchmarkReportType;
}

export const RolesList: React.FC<RolesListProps> = ({ roles, onViewReport }) => {
  const [selectedRole, setSelectedRole] = useState<BenchmarkedRole | null>(null);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleRoleClick = (role: BenchmarkedRole) => {
    setSelectedRole(role);
    if (role.surveyCompleted) {
      setIsReportOpen(true);
    } else {
      setIsSurveyOpen(true);
    }
  };

  const handleSurveyComplete = async () => {
    setIsSurveyOpen(false);
    if (selectedRole) {
      setIsReportOpen(true);
    }
  };

  return (
    <div>
      <div className="grid gap-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:border-orange-600 transition-all cursor-pointer"
            onClick={() => handleRoleClick(role)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{role.title}</h4>
                <p className="text-sm text-gray-500">Theme: {role.theme}</p>
              </div>
              <div className="flex items-center space-x-2">
                {role.surveyCompleted ? (
                  <BarChart2 className="w-5 h-5 text-orange-600" />
                ) : (
                  <FileText className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isSurveyOpen && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <SurveyForm
              onSubmit={handleSurveyComplete}
              isLoading={false}
            />
          </div>
        </div>
      )}

      {isReportOpen && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <BenchmarkReport
              report={onViewReport(selectedRole.id)}
            />
          </div>
        </div>
      )}
    </div>
  );
}; 