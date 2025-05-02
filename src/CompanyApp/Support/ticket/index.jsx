/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Ticket from './list';
import TicketAction from './ticketAction';


const TicketActionSetupRoute = () => {
   return (
   <Routes>
      <Route path=":id" element={<TicketAction />} /> 
      <Route path="" element={<Ticket />} /> 
   </Routes>
)};
export default TicketActionSetupRoute;
