/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ObjectiveGroup from './Performance/ObjectiveGroup';


const CompanyModuleSetupRoute = ({ match }) => {
   return (
   <Routes>
      {/* <Redirect exact from={`${match.url}/`} to={`${match.url}/admin`} /> */}
     
      {/* <Route path={`${match.url}/branch`} component={Branch} />
      <Route path={`${match.url}/designation`} component={Designation} />
      <Route path={`${match.url}/department`} component={Department} />
      <Route path={`${match.url}/leave-type`} component={LeaveType} />
      <Route path={`${match.url}/document-type`} component={DocumentType} />
      <Route path={`${match.url}/holiday`} component={Holiday} />
      <Route path={`${match.url}/allowance-type`} component={AllowanceType} />
      <Route path={`${match.url}/gratuity`} component={GratuitySettingForm} />
      <Route path={`${match.url}/overtime`} component={OvertimeSettingForm} /> */}
      <Route path={`${match.url}/performance/objectivegroup`} element={<ObjectiveGroup/>} />
     
   </Routes>
)};

export default CompanyModuleSetupRoute;
