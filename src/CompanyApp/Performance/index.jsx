/**
 * Performance Route
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom'; 
import EmployeePerformanceReviewReport from './Report';
import EmployeePerformanceReview from './Review';
import PerformanceDetailSetupRoute from './Review/PerformanceDetailSetupRoute';
import PerformanceTemplate from './Template'; 
import TemplateDetailSetupRoute from './Template/TemplateDetailSetupRoute';
import ReportDetailSetupRoute from './Report/ReportDetailSetupRoute';
import EmployeePerfomanceCycle from './ReviewCycle';
import EmployeePerformanceModule from './PerformanceModule';



const PerformanceRoute = () => { 
   return (
   <Routes>
      <Route path="report/details" element={<ReportDetailSetupRoute />} />
      <Route path="report" element={<EmployeePerformanceReviewReport />} />
      {/* <Route path="review/details" element={<PerformanceDetailSetupRoute />} /> */}
      <Route path="review" element={<EmployeePerformanceModule />} />
      <Route path="cycle" element={<EmployeePerfomanceCycle />} />
      {/* <Route path="template/details" element={<TemplateDetailSetupRoute />} /> */}
      {/* <Route path="template" element={<PerformanceTemplate />} /> */}
   </Routes>
)};
export default PerformanceRoute;
