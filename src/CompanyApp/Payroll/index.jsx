/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
// import OvertimeApproval from './Overtime';
import PayrollLanding from './PaySlip/PayrollLanding';
import PayslipViewer from './PaySlip/view';
import PayVariance from './PayVariance';
import LeaveSettlement from './Settlement/LeaveSettlement';
import FinalSettlement from './Settlement/FinalSettlement';
import WorkExpensesRoute from './WorkExpenses/WorkExpensesRoute';
import DashboardOvertimeApproval from './Overtime/dashboardIndex';
import TeamTimeinlieu from '../MyEntitlements/TimeInLieu/dashboardIndex';
import EmployeePayrollProfile from './EmployeeProfile';
const PayrollRoute = () => {
   return (
      <Routes>
         <Route path="pay-slip" element={<PayrollLanding />} />
         {/* <Route path="overtime" element={<OvertimeApproval />} />  */}
         <Route path="dashboard-overtime" element={<DashboardOvertimeApproval />} />
         <Route path="dashboard-timeInlieu" element={<TeamTimeinlieu />} />
         <Route path="pay-variance" element={<PayVariance />} />
         <Route path="pay-slip-viewer" element={<PayslipViewer />} />
         <Route path="LeaveSettlement" element={<LeaveSettlement />} />
         <Route path="FinalSettlement" element={<FinalSettlement />} />
         <Route path="WorkExpenses" element={<WorkExpensesRoute />} />
         <Route path="payrollProfile" element={<EmployeePayrollProfile />} />
      </Routes>
   )
};

export default PayrollRoute;
