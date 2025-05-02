/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Timesheet from './list';

const TimesheetRoute = ({ match }) => {
   return (
   <Routes>
      <Route path='' element={<Timesheet />} />  
   </Routes>
)};

export default TimesheetRoute;
