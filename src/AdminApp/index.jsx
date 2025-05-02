/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Template from '../CompanyApp/ModuleSetup/Template';
import CompanySettingModuleSetupRoute from '../CompanyApp/Settings';
import Company from './Company';
import Coupon from './Coupon';
import Order from './Order';
import Plan from './Plan';
import SMTP from './SMTP/form';
import SurveySetupRoute from '../CompanyApp/Survey';
import AccessModule from './Company/accessModule';
import CompanyDetailsLandingPage from './Company/CompanyDetailsLandingPage';
import CompanyCreateForm from './Company/companyCreateForm';
import PayHubLanding from './PayHub/landing';

const AdminAppRoute = () => {
   return (
   <Routes>
      <Route path="company-add" element={<CompanyCreateForm />} />
      <Route path="company-details" element={<CompanyDetailsLandingPage />} />
      <Route path="company" element={<Company />} />
      <Route path="coupon" element={<Coupon />} />
      <Route path="order" element={<Order />} />
      <Route path="plan" element={<Plan />} /> 
      <Route path="smtp" element={<SMTP />} />
      <Route path="settings/theme" element={<CompanySettingModuleSetupRoute />} /> 
      <Route path="module-setup/template" element={<Template />} />
      <Route path="manage-survey/*" element={<SurveySetupRoute />} /> 
      <Route path="access-module" element={<AccessModule />} />
      <Route path="payHub" element={<PayHubLanding />} />
   </Routes>
)};

export default AdminAppRoute;
