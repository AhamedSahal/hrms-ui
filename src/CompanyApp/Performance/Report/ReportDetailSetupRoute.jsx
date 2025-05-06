/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PerformanceReviewReportDetailsForm from './detailsForm'; 


const ReportDetailSetupRoute = ({ match }) => {
   return (
      <Routes>
         <Route path={':id'} element={<PerformanceReviewReportDetailsForm/>} />
      </Routes>
   )
};

export default ReportDetailSetupRoute;
