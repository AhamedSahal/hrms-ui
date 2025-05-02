import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Notification from '../Notification';
import Admindashboard from './admindashboard';
import NewSocialShare from './NewSocialshare';
import { getUserType } from '../../../utility';

const DashboardRoute = () => {
  const isCompanyAdmin = getUserType() === 'COMPANY_ADMIN';
  const isEmployee = getUserType() === 'EMPLOYEE';

  const DefaultComponent = isEmployee || isCompanyAdmin
    ? <NewSocialShare />
    : <Admindashboard />;

  return (
    <Routes>
      <Route index path="dashboard" element={DefaultComponent} />
      <Route path="notification" element={<Notification />} />
      <Route path="NewSocialShare" element={<NewSocialShare />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default DashboardRoute;
