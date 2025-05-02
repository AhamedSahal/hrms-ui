/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PerformanceTemplateDetailsForm from './detailsForm';


const TemplateDetailSetupRoute = ({ match }) => {
   return (
      <Routes>
         <Route path={`${match.url}/:id`} component={PerformanceTemplateDetailsForm} />
      </Routes>
   )
};

export default TemplateDetailSetupRoute;
