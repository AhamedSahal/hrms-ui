/**
 * Tables Routes
 */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Users from './users';
import Activities from './activities';
import Assets from './assets';
import Knowledgebase from './knowledgebase';
import KnowledgebaseView from './knowledgebase-view';
import Jobs from './Jobs/managejobs';
import JobApplicants from './Jobs/appliedcandidate';
import JobDetails from './Jobs/jobdetails';

const Uiinterfaceroute = () => (
    <Routes>
        <Route path="users" element={<Users />} />
        <Route path="activities" element={<Activities />} />
        <Route path="assets" element={<Assets />} />
        <Route path="knowledgebase" element={<Knowledgebase />} />
        <Route path="knowledgebase-view" element={<KnowledgebaseView />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="job-details" element={<JobDetails />} />
        <Route path="job-applicants" element={<JobApplicants />} />
        <Route path="*" element={<Navigate to="users" replace />} />
    </Routes>
);

export default Uiinterfaceroute;
