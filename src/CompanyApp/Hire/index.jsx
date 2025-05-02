import React from 'react';
import { Route, Routes } from 'react-router-dom';
import JobLanding from './Job';
import HJobFormView from './Job/ViewPage/HJobFormView';
import ApplicantLandingPage from './hApplicants';
import JobCandidateFormIndex from './hApplicants/hApplicantForm/JobCandidateFormIndex';
import ApplicantForm from './hApplicants/ApplicantForm/ApplicantForm';
import HApplicantViewPage from './hApplicants/AView/HApplicantViewPage';

const HireLanding = () => {
    return (
        <Routes>
            <Route path="Job" element={<JobLanding />} />
            <Route path="viewForm/:id" element={<HJobFormView />} />
            {/* Applicants */}
            <Route path="Applicants" element={<ApplicantLandingPage />} />
            {/* <Route path="candidateinfo/:id/:sourcetype" element={<JobCandidateFormIndex />} /> */}
            {/* Applicant Internal Form */}
            <Route path="internalApplicantForm" element={<ApplicantForm />} />
            <Route path="applicantviewForm/:id" element={<HApplicantViewPage />} />
        </Routes>
    );
};

export default HireLanding;
