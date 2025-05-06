import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Step, StepLabel, Stepper } from '@mui/material';
import ReviewMeetingInfo from './meetingInfo/form';
import MeetingInvite from './invitee/form';
import MeetingSchedule from './schedule/form';

const ReviewMeetingForm = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [formScreen, setFormScreen] = useState(0);
    const [formData, setFormData] = useState(location.state || {});

    const handleFormData = (data) => {
        setFormData((prevData) => ({ ...prevData, ...data }));
    };

    const redirectToList = () => {
        navigate(-1);
    };

    const nextStep = () => {
        setFormScreen((prevScreen) => prevScreen + 1);
    };

    const prevStep = () => {
        setFormScreen((prevScreen) => prevScreen - 1);
    };

    const steps = [
        'Meeting Info',
        'Invite',
        'Schedule',
    ];

    return (
        <div className="page-wrapper">
            <div className="pb-4 p-5 content container-fluid">
                <div className="surveyFormBody tab-content">
                    <div className="">
                        <div className="row user-tabs">
                            <div style={{ borderRadius: '10px 10px 0px 0px', height: '64px' }} className="card tab-box tab-position">
                                <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                                    <h1 className="mt-2 modal-title">
                                        Talent Review Meeting</h1>
                                    <p className="ml-auto mb-3" onClick={redirectToList}>
                                        <i className="surveyCloseBtn fa fa-times" aria-hidden="true"></i>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-3 mb-2'>
                        <Stepper alternativeLabel activeStep={formScreen}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel style={{ marginTop: '1px' }} >{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </div>
                    <div className="content container-fluid mt-2">
                        {formScreen === 0 && <ReviewMeetingInfo handleFormData={handleFormData} formData={formData} nextStep={nextStep} ></ReviewMeetingInfo>}
                        {formScreen === 1 && <MeetingInvite handleFormData={handleFormData} formData={formData} prevStep={prevStep} nextStep={nextStep}></MeetingInvite>}
                        {formScreen === 2 && <MeetingSchedule handleFormData={handleFormData} formData={formData} prevStep={prevStep} ></MeetingSchedule>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewMeetingForm;
