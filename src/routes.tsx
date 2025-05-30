import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Profile } from './components/Profile';

type AppRoutesProps = Record<string, never>;

const AppRoutes: React.FC<AppRoutesProps> = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/roles" replace />} />
      <Route path="/roles" element={<div>Job Roles</div>} />
      <Route path="/roles/themes" element={<div>Job Themes</div>} />
      <Route path="/roles/single" element={<div>Single Job</div>} />
      <Route path="/reports" element={<div>Reports</div>} />
      <Route path="/reports/single" element={<div>Single Reports</div>} />
      <Route path="/profile" element={<Profile user={mockUser} />} />
      <Route path="/profile/settings" element={<Profile user={mockUser} />} />
    </Routes>
  );
};

export default AppRoutes; 