/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Clients from './clients';
import ClientsList from './clientslist';
import Leades from './leades';
import Tickets from './tickets';
import TicketView from './ticketview';

const EmployeeRoute = () => (
   <Routes>
      <Route path="clients" element={<Clients />} />
      <Route path="clients-list" element={<ClientsList />} />
      <Route path="leads" element={<Leades />} />
      <Route path="tickets" element={<Tickets />} />
      <Route path="ticket-view" element={<TicketView />} />
      <Route path="*" element={<Navigate to="clients" replace />} />
   </Routes>
);

export default EmployeeRoute;
