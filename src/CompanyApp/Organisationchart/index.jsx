import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Division from './Division';
import Grades from './Grades';
import Section from './Section';
import Function from './Function';
import JobTitles from './JobTitles';
import Jobdescription from './Jobdescription';
import OrgSetupMain from './OrgSetupMain';
import JobDescription from './Jobdescription/JobdescriptionApproval';
import OrganizationChartLanding from './OrganizationChartLading';

const OrganisationchartRoute = () => {
   return (
      <Routes>
         <Route path="orgchart" element={<OrgSetupMain />} /> 
         <Route path="Grades" element={<Grades />} /> 
         <Route path="JobTitles" element={<JobTitles />} />
         <Route path="Jobdescription" element={<Jobdescription />} />  
         <Route path="jobdescription-approval" element={<JobDescription />} />
         <Route path="Section" element={<Section />} /> 
         <Route path="Function" element={<Function />} />  
         <Route path="organisationchart" element={<OrganizationChartLanding />} /> 
      </Routes>
   );
};

export default OrganisationchartRoute;