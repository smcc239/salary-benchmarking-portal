import React, { useState } from 'react';
import { BarChart2, FileText } from 'lucide-react';
import { SurveyForm } from './SurveyForm';
import { BenchmarkReport as BenchmarkReportComponent } from './BenchmarkReport';
import { BenchmarkedRole } from '../types/user';
import { BenchmarkReport } from '../types/survey';

interface RolesListProps {
  roles: BenchmarkedRole[];
  onViewReport: (roleId: string) => BenchmarkReport;
}

export const RolesList: React.FC<RolesListProps> = ({ roles, onViewReport }) => {
  const [selectedRole, setSelectedRole] = useState<BenchmarkedRole | null>(null);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleRoleClick = (role: BenchmarkedRole): void => {
    setSelectedRole(role);
    if (role.surveyCompleted) {
      setIsReportOpen(true);
    } else {
      setIsSurveyOpen(true);
    }
  };

  const handleSurveyComplete = async (): Promise<void> => {
    setIsSurveyOpen(false);
    if (selectedRole) {
      setIsReportOpen(true);
    }
  };

  return (
    <div>
      <div className="grid gap-4">
        {roles.map((role: BenchmarkedRole) => (
          <div
            key={role.roleId}
            className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow"
            onClick={() => handleRoleClick(role)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{role.title}</h4>
                <p className="text-sm text-gray-500">Theme: {role.theme.name}</p>
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
            <BenchmarkReportComponent
              report={onViewReport(selectedRole.roleId)}
            />
          </div>
        </div>
      )}
    </div>
  );
}; 