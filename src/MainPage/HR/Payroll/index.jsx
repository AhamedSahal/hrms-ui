/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import EmployeeSalary from './employeesalary';
import Payrollitem from './payrollitem';
import Payslip from './payslip';

const ReportsRoute = () => (
   <Routes>
      <Route path="_salary" element={<EmployeeSalary />} />
      <Route path="payroll-items" element={<Payrollitem />} />
      <Route path="salary-view" element={<Payslip />} />
      <Route path="*" element={<Navigate to="_salary" replace />} />
   </Routes>
);

export default ReportsRoute;
