/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Policies from './policies';

const ReportsRoute = () => (
   <Routes>
      <Route path="policies" element={<Policies />} />
      <Route path="*" element={<Navigate to="policies" replace />} />
   </Routes>
);

export default ReportsRoute;
