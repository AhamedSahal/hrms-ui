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
         <Route path={`${match.url}/:id`} component={PerformanceReviewDetailsForm} />
      </Routes>
   )
};

export default PerformanceDetailSetupRoute;
