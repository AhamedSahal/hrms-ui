/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Gratuity from './Gratuity/index';
import TimeInLieu from './TimeInLieu/index';
import Leave from './Leave/index';

const EntitlementRoute = () => {
   return (
   <Routes>
      {/* <Redirect exact from={`${match.url}/`} to={`${match.url}/admin`} /> */}
     
      <Route path="gratuity" element={<Gratuity />} />
      <Route path="time-in-lieu" element={<TimeInLieu />} />
      <Route path="leave" element={<Leave />} />
      
   </Routes>
)};

export default EntitlementRoute;
