/**
 * Tables Routes
 */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import EmployeeProfile from './employeeprofile';
import ClientProfile from './clientprofile';

const SubscriptionRoute = () => (
    <Routes>
        <Route path="employee-profile" element={<EmployeeProfile />} />
        <Route path="client-profile" element={<ClientProfile />} />
        <Route path="*" element={<Navigate to="employee-profile" replace />} />
    </Routes>
);

export default SubscriptionRoute;
