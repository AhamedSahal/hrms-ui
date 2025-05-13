/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import CompanyAccessSetupRoute from './AccessSetup';
import EmployeeModuleSetupRoute from './Employee';
import LeaveTrackView from './Employee/LeaveTrackView';
import EmployeeAttendanceList from './Employee/attendanceList';
import LeaveLanding from './LeaveLanding';
import CompanyModuleSetupRoute from './ModuleSetup';
import DocumentRequest from './ModuleSetup/DocumentRequest/index';
import ModuleSetupLanding from './ModuleSetupPage/ModuleSetupLanding';
import EntitlementRoute from './MyEntitlements';
import Onboarding from './Onboarding';
import HireLanding from './Hire';
import OrganisationchartRoute from './Organisationchart';
import PayrollRoute from './Payroll';
import PerformanceRoute from './Performance';
import ProjectsRoute from './Project';
import RecognitionListIndex from './RecognitionList/RecognitionListIndex.jsx';
import RecognitionRoute from './RecognitionMain';
import ReportRoute from './Report';
import RosterLanding from './RosterLanding';
import CompanySettingModuleSetupRoute from './Settings';
import SupportModuleSetupRoute from './Support';
import SurveySetupRoute from './Survey';
import TasksForm from './Tasks/form.jsx';
import Rewards from './Rewards';
import TasksLanding from './TasksLanding';
import TeamApprovalSetupRoute from './TeamApproval';
import TimesheetRoute from './Timesheet';
import ManageWorkingDays from './ManageWorkingDays/manageWorkingDaysList';
import WorkforceplanRoute from './workforceplan';
import AttendanceMonthList from '../MainPage/Main/Dashboard/AttendanceMonthList';
import UpComingEventList from '../MainPage/Main/Dashboard/UpComingEventList';
import ExpiryDocumentList from '../MainPage/Main/Dashboard/ExpiryDocumentList';
import MissingInfoList from '../MainPage/Main/Dashboard/MissingInfoList';
import WorkflowLanding from './Workflow/workflowLanding';
import AccessSetupLanding from './AccessSetup';
import SystemSetupLanding from './Settings';
import Assets from './Assets/AssetLanding.jsx';
import DevelopLanding from './Develop/index.jsx';
import DocumentRequestView from './ModuleSetup/DocumentRequest/view.jsx';
import ConfigurationRoute from './Configuration/ConfigurationLanding.jsx';
import EmployeeList from './Employee/list.jsx';
import TeamEmployeeList from './Employee/myteam/index.jsx';
import { getEmployeeId } from '../utility.jsx';
import Timesheet from './Timesheet/list.jsx';
import TeamApprovalLanding from './TeamApproval/TeamApprovalLanding.jsx';
import EmployeeDetail from './Employee/detail/detail.jsx';

const CompanyAppRoute = () => {
   let employeeId = getEmployeeId();

   return (
      <Routes>
         {/* <Redirect exact from={`admin`} to={`admin`} /> */}

         <Route path='timesheet' element={<TimesheetRoute />} />
         <Route path='manage-working-days' element={<ManageWorkingDays />} />
         {/* <Route path='profile' render={(props) => <Redirect to='app/company-app/employee/detail/0'></Redirect>} />*/}
         {/* <Route path='leave' component={Leave} /> */}
         {employeeId > 0 ? (
            <Route path='my-profile' element={<Navigate to='/app/company-app/employee/detail/0' />} />
         ) : (
            <Route path='my-profile' element={<EmployeeDetail />} />
         )}
         <Route path='my-team' element={<TeamEmployeeList />} />
         <Route path='organization' element={<EmployeeList />} />
         <Route path='support/*' element={<SupportModuleSetupRoute />} />
         <Route path='access-setup' element={<CompanyAccessSetupRoute />} />
         <Route path='module-setup/*' element={<CompanyModuleSetupRoute />} />
         <Route path='employee/*' element={<EmployeeModuleSetupRoute />} />
         <Route path='company' element={<EmployeeModuleSetupRoute />} />
         <Route path='settings' element={<CompanySettingModuleSetupRoute />} />
         <Route path='attendance' element={<EmployeeAttendanceList />} />
         <Route path='entitlements/*' element={<EntitlementRoute />} />
         <Route path='team-approvals' element={<TeamApprovalSetupRoute />} />
         <Route path='payroll/*' element={<PayrollRoute />} />
         <Route path='report/*' element={<ReportRoute />} />
         <Route path='performance/*' element={<PerformanceRoute />} />
         <Route path='workforceplan' element={<WorkforceplanRoute />} />
         <Route path='projects' element={<ProjectsRoute />} />
         <Route path='Organisationchart/*' element={<OrganisationchartRoute />} />
         <Route path='document-request' element={<DocumentRequest />} />
         <Route path='Onboarding/*' element={<Onboarding />} />
         <Route path='Recognition' element={<RecognitionRoute />} />
         <Route path='RecognitionList' element={<RecognitionListIndex />} />
         <Route path='leave' element={<LeaveLanding />} />
         <Route path='hire/*' element={<HireLanding />} />
         <Route path='Roster' element={<RosterLanding />} />
         <Route path='Tasks' element={<TasksLanding />} />
         <Route path='TaskForm' element={<TasksForm />} />
         <Route path='LeaveTrackView' element={<LeaveTrackView />} />
         <Route path='modulesetup' element={<ModuleSetupLanding />} />
         <Route path='rewards/*' element={<Rewards />} />
         <Route path='survey/*' element={<SurveySetupRoute />} />
         <Route path='attendanceList' element={<AttendanceMonthList />} />
         <Route path='eventList' element={<UpComingEventList />} />
         <Route path='documentExpiry' element={<ExpiryDocumentList />} />
         <Route path='missing-information' element={<MissingInfoList />} />
         <Route path='workflow' element={<WorkflowLanding />} />
         <Route path='access' element={<AccessSetupLanding />} />
         <Route path='system' element={<SystemSetupLanding />} />
         <Route path='Assets' element={<Assets />} />
         <Route path='develop/*' element={<DevelopLanding />} />
         <Route path='employee-document-request' element={<DocumentRequestView />} />
         <Route path='configuration' element={<ConfigurationRoute />} />
      </Routes>
   );
};

export default CompanyAppRoute;
