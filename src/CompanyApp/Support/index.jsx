/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TicketActionSetupRoute from './ticket';


const SupportModuleSetupRoute = () => {
   return (
   <Routes>
      <Route path="ticket" element={<TicketActionSetupRoute />} /> 
   </Routes>
)};
export default SupportModuleSetupRoute;
