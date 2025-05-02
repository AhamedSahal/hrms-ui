import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TalentProfile from './talentProfile';
import SuccessionPlanLanding from './succesionLanding';
import SuccessionPlanFormLanding from './SuccessionPlan/PlanForms/formLanding';
import ReviewMeetingForm from './ReviewMeeting/form';
const DevelopLanding = () => {
    return (
        <Routes>
            <Route path="Profile" element={<TalentProfile />} />
            <Route path="Succession" element={<SuccessionPlanLanding />} />
            <Route path="successionPlanForm" element={<SuccessionPlanFormLanding />} />
            <Route path="talentReviewMeeting" element={<ReviewMeetingForm />} />
        </Routes>
    )
};

export default DevelopLanding;
