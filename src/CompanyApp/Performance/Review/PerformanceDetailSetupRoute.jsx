/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PerformanceReviewDetailsForm from './detailsForm'; 


const PerformanceDetailSetupRoute = ({ match }) => {
   return (
      <Routes>
         <Route path={':id'} element={<PerformanceReviewDetailsForm />} />
      </Routes>
   )
};

export default PerformanceDetailSetupRoute;
