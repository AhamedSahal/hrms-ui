/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EmployeeReport from './Employee';
import companyanalyticsdashboard  from '../../MainPage/Main/Dashboard/companyanalyticsdashboard';
import ChatbotDashboard from '../ChatbotDashboard/chatbotDashboard';
import HireReportLanding from './Hire';
import PayReportLanding from './Pay';
import ManageReportLanding from './Manage';
import RewardReportLanding from './Reward';
import OnboardReportLanding from './Onboard';
import WorkForceplaneReportLanding from './PayReport';
import PerformReportLanding from './Perform';
import CompanyAnalyticsDashboard from '../../MainPage/Main/Dashboard/companyanalyticsdashboard';


const ReportRoute = () => {
   return (
   <Routes>
      <Route path="chatbotdashboard" element={<ChatbotDashboard />} />
      <Route path="employee" element={<EmployeeReport />} />
      {/* <Route path="payroll" element={<PayrollReport />} /> */}
      <Route path="plan" element={<WorkForceplaneReportLanding />} />
      <Route path="reward" element={<RewardReportLanding />} />
      <Route path="manage" element={<ManageReportLanding />} />
      <Route path="pay" element={<PayReportLanding />} />
      <Route path="hire" element={<HireReportLanding />} />
      <Route path="onboard" element={<OnboardReportLanding />} />
      <Route path="companydashboard" element={<CompanyAnalyticsDashboard />} />
      <Route path="perform" element={<PerformReportLanding />} />
   </Routes>
)};

export default ReportRoute;
