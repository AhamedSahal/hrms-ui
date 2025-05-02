import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SurveyParticipantList from './manageSurvey/SurveyParticipant/surveyParticipant';
import ManageActionsLanding from './manageSurvey/manage';
import SurveyReport from './manageSurvey/surveyReport/report';
import ViewResponse from './manageSurvey/surveyReport/viewResponse';
import { getUserType, verifyOrgLevelViewPermission } from '../../utility';
import Landing from './manageSurvey/landing';
import Template from './manageSurvey/Template';
import AccessDenied from '../../MainPage/Main/Dashboard/AccessDenied';

const CommonSurveyRoutes = () => {
  console.log(getUserType() ,"Common Survey Routes",getUserType() ,  verifyOrgLevelViewPermission("Survey"))
  return ( 
   <Routes>
    <Route path="invitee/:id" element={<SurveyParticipantList />} />
    <Route path="manage" element={<ManageActionsLanding />} />
    <Route path="report/view-response" element={<ViewResponse />} />
    <Route path="report" element={<SurveyReport />} />
    <Route path="" element={
      verifyOrgLevelViewPermission("Survey") ? (
        getUserType() === 'COMPANY_ADMIN' || verifyOrgLevelViewPermission("Survey") ? (
          <Landing />
        ) : getUserType() === 'SUPER_ADMIN' ? (
          <div className='adminInsidePageDiv'>
            <Template />
          </div>
        ) : null
      ) : (
        <AccessDenied />
      )
    } />
  </Routes>
  )
};

const SurveySetupRoute = () => {
  return (
    <Routes>
      <Route path="/*" element={<CommonSurveyRoutes />} />
      <Route path="/*" element={<CommonSurveyRoutes />} />
    </Routes>
  );
};
export default SurveySetupRoute;