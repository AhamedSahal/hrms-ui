/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import BulkUpload from './bulkUpload';
import CreateEmployeeForm from './createForm';
import EmployeeDetailSetupRoute from './detail';
import EmployeeList from './list'; 
import RosterForm from './roster/form.jsx'; 

const EmployeeModuleSetupRoute = () => {
   return (
   <Routes>
      <Route path="RosterForm" element={<RosterForm />} />
      <Route path="create" element={<CreateEmployeeForm />} />
      <Route path="bulk-upload" element={<BulkUpload />} />
      <Route path="detail/*" element={<EmployeeDetailSetupRoute />} />
      <Route path="" element={<EmployeeList />} />
   </Routes>
)};

export default EmployeeModuleSetupRoute;
