/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TeamApprovalLanding from './TeamApprovalLanding';


const TeamApprovalSetupRoute = ({ match }) => {
   return (
   <Routes>
      <Route path={''} element={<TeamApprovalLanding />} /> 
   </Routes>
)};
export default TeamApprovalSetupRoute;
