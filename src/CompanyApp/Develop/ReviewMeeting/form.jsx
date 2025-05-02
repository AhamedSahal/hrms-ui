
import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FormGroup, Label } from 'reactstrap';
import { Step, StepLabel, Stepper } from '@mui/material';
import ReviewMeetingInfo from './meetingInfo/form';
import MeetingInvite from './invitee/form';
import MeetingSchedule from './schedule/form';
 

export default class ReviewMeetingForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formScreen: 0,
            formData: this.props.location.state || {},
        };
    }

    
    handleFormData = (data) => {
        this.setState((prevState) => ({
            formData: { ...prevState.formData, ...data },
        }));
    };

    redirectToList = () => {
        this.props.history.goBack();
    }

    nextStep = () => {
        this.setState((prevState) => ({
            formScreen: prevState.formScreen + 1,
        }));
    };

    prevStep = () => {
        this.setState((prevState) => ({
            formScreen: prevState.formScreen - 1,
        }));
    };

    render() {
        const { formScreen , formData } = this.state
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
                                        <p className="ml-auto mb-3" onClick={this.redirectToList}>
                                            <i className="surveyCloseBtn fa fa-times" aria-hidden="true"></i>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-3 mb-2'>
                            <Stepper alternativeLabel activeStep={this.state.formScreen}>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel style={{ marginTop: '1px' }} >{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </div>
                        <div className="content container-fluid mt-2">
                            {formScreen === 0 && <ReviewMeetingInfo handleFormData={this.handleFormData} formData={formData}  nextStep={this.nextStep} ></ReviewMeetingInfo>}
                            {formScreen === 1 && <MeetingInvite handleFormData={this.handleFormData} formData={formData}  prevStep={this.prevStep} nextStep={this.nextStep}></MeetingInvite>}
                            {formScreen === 2 && <MeetingSchedule handleFormData={this.handleFormData} formData={formData}  prevStep={this.prevStep} ></MeetingSchedule>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
