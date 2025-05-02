/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Language from './Language';
import Branch from './Branch';
import Department from './Department';
import Designation from './Designation';
import DocumentType from './DocumentType';
import LeaveType from './LeaveType';
import Holiday from './Holiday';
import AllowanceType from './Allowance';
import OrgSetupForm from './OrgSetup/form';
import GratuitySettingForm from './gratuity/GratuitySettingForm';
import OvertimeSettingForm from './overtime/OvertimeSettingForm';
import PerformanceLanding from './Performance/PerformanceLanding';
import Announcement from './Announcement';
import Country from './Country';
import Signature from './Signature';
import Template from './Template/index';
import DocumentRequest from './DocumentRequest/index';
import DocumentRequestView from './DocumentRequest/view';
import SocialShareApproval from './SocialShare';
import Recognition from './Recognition';
import LeaveLanding from './LeaveLanding';
import EmployeeLanding from './EmployeeLanding';
import PayrollLanding from './PayrollLanding';
import ProjectLanding from './ProjectLanding';
import ShiftIndex from './Shifts/index';
import policiesDocument from './PoliciesDocuments';
import Benefits from './Benefits/index';
const CompanyModuleSetupRoute = () => {
   return (
      <Routes>
         <Route path="country" element={<Country />} />
         <Route path="language" element={<Language />} />
         <Route path="branch" element={<Branch />} />
         <Route path="designation" element={<Designation />} />
         <Route path="department" element={<Department />} />
         <Route path="leave-type" element={<LeaveType />} />
         <Route path="document-type" element={<DocumentType />} />
         <Route path="holiday" element={<Holiday />} />
         <Route path="allowance-type" element={<AllowanceType />} />
         <Route path="gratuity" element={<GratuitySettingForm />} />
         <Route path="overtime" element={<OvertimeSettingForm />} />
         <Route path="performance" element={<PerformanceLanding />} />
         <Route path="announcement" element={<Announcement />} />
         <Route path="social-share" element={<SocialShareApproval />} />
         <Route path="orgsetup" element={<OrgSetupForm />} />
         <Route path="signature" element={<Signature />} />
         <Route path="template" element={<Template />} />
         <Route path="document-request" element={<DocumentRequest />} />
         <Route path="Recognition" element={<Recognition />} />
         <Route path="employee" element={<EmployeeLanding />} />
         <Route path="leave" element={<LeaveLanding />} />
         <Route path="payroll" element={<PayrollLanding />} />
         <Route path="project" element={<ProjectLanding />} />
         <Route path="Shifts" element={<ShiftIndex />} />
         <Route path="policiesdocuments" element={<policiesDocument />} />
         <Route path="benefits" element={<Benefits />} />
      </Routes>
   );
};

export default CompanyModuleSetupRoute;
