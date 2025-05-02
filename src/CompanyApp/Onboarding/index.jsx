import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Offerletter from './Offerletter';
import CandidateInfo from './Candidateinfo';
import CandidateInfoform from './Candidateinfo/form';
import JobResponse from '../Hire/hApplicants/hApplicantForm/JobResponse';
import OnboardChecklistModule from './Checklist';
import OffboardChecklistModule from './Separation';

const Onboarding = () => {
   return (
   <Routes>
      <Route path="offerletter" element={<Offerletter />} />
      <Route path="Candidate" element={<CandidateInfo />} />
      <Route path="CandidateForm" element={<CandidateInfoform />} />
      <Route path="successMessage" element={<JobResponse />} />
      <Route path="Checklist" element={<OnboardChecklistModule />} />
      <Route path="Separation" element={<OffboardChecklistModule />} />

      {/* <Route path="requisition" element={<Requisition />} /> */}
   </Routes>
)};

export default Onboarding;