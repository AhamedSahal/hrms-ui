/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EmployeeDetail from './detail';

const EmployeeDetailSetupRoute = () => {
   return (
      <Routes>
         <Route path=":id" element={<EmployeeDetail id={':id'} />} />
      </Routes>
   );
};

export default EmployeeDetailSetupRoute;
