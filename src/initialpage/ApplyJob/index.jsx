/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import JobsList from './JobsList';
import Jobdetails from './jobdetails';

const JobRoute = ({ match }) => (
   <div className="dashboard-wrapper">
      <Routes>
         <Route
            path={`${match.url}/`}
            element={<Navigate to={`${match.url}/joblist`} replace />}
         />
         <Route path={`${match.url}/joblist`} element={<JobsList />} />
         <Route path={`${match.url}/jobdetail`} element={<Jobdetails />} />
      </Routes>
   </div>
);

export default JobRoute;
