/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import AllEmployees from './allemployees';
import AllEmployeesList from './employeeslist';
import Holidays from './holidays';
import LeaveAdmin from './leave_admin';
import LeaveEmployee from './leaveemployee';
import Leavesetting from './leavesettings';
import AttendanceAdmin from './attendanceadmin';
import AttendanceEmployee from './attendanceemployee';
import Department from './department';
import Designation from './designation';
import Timesheet from './timesheet';
import Overtime from './overtime';
import ShiftScheduling from './shiftscheduling';
import ShiftList from './shiftlist';

const EmployeesRoute = () => (
   <Routes>
      <Route path="allemployees" element={<AllEmployees />} />
      <Route path="employees-list" element={<AllEmployeesList />} />
      <Route path="holidays" element={<Holidays />} />
      <Route path="leaves-admin" element={<LeaveAdmin />} />
      <Route path="leaves-employee" element={<LeaveEmployee />} />
      <Route path="leave-settings" element={<Leavesetting />} />
      <Route path="attendance-admin" element={<AttendanceAdmin />} />
      <Route path="attendance-employee" element={<AttendanceEmployee />} />
      <Route path="departments" element={<Department />} />
      <Route path="designations" element={<Designation />} />
      <Route path="timesheet" element={<Timesheet />} />
      <Route path="overtime" element={<Overtime />} />
      <Route path="shift-scheduling" element={<ShiftScheduling />} />
      <Route path="shift-list" element={<ShiftList />} />
      <Route path="*" element={<Navigate to="allemployees" replace />} />
   </Routes>
);

export default EmployeesRoute;
