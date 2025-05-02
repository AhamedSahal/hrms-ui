import React, { Component, createRef } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Helmet } from 'react-helmet';
import { getTitle, verifyOrgLevelEditPermission } from '../../../utility';
import { Button, Modal } from 'react-bootstrap';
import CycleDetails from './CycleForms/cycleDetails';
import { Step, StepLabel, Stepper } from '@mui/material';
import PerformanceFactors from './CycleForms/performanceFactors';
import FeedbackFlow from './CycleForms/feedback';
import TemplatesForReviewers from './CycleForms/templatesForReviewers';
import AppraisalCycleTime from './CycleForms/appraisalCycleTime';
import RepetitionsSettings from './CycleForms/repetitionsSettings';
import CompletedCycle from './completeCycle/index';
import ActiveCycle from './activeCycle/index';
import PlannedCycle from './plannedCycle/index';
import DraftsCycle from './draftCycle/index';


const { Header, Body, Footer } = Modal;
export default class EmployeePerfomanceCycle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cycleSetupScreen: 0,
            cycleData: '',
            step: 0,
            formData: {},
        }
    }
    hideForm = () => {
        this.setState({
            showForm: false,
        })
    }


    handleFormData = (data) => {
        this.setState((prevState) => ({
            formData: { ...prevState.formData, ...data },
        }));
    };

    nextStep = () => {
        this.setState((prevState) => ({
            cycleSetupScreen: prevState.cycleSetupScreen + 1,
        }));
    };

    prevStep = () => {
        this.setState((prevState) => ({
            cycleSetupScreen: prevState.cycleSetupScreen - 1,
        }));
    };

    render() {
        const { cycleSetupScreen } = this.state
        const { step, formData } = this.state;
        const steps = [
            'Cycle Define',
            'Compose Score',
            'Templateize',
            'Participants',
            'Set Timelines',
            'Repetitions',

        ];
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Performance Cycle | {getTitle()}</title>
                </Helmet>
                <div className="mt-4 content container-fluid">
                    <div className="tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Performance Cycle</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item"><a href="#active" data-toggle="tab" className="nav-link active">Active(2)</a></li>
                                            <li className="nav-item"><a href="#planned" data-toggle="tab" className="nav-link ">Planned(1)</a></li>
                                            <li className="nav-item"><a href="#drafts" data-toggle="tab" className="nav-link ">Drafts(0)</a></li>
                                            <li className="nav-item"><a href="#completed" data-toggle="tab" className="nav-link ">Completed(1)</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-end">
                            <div className="mt-2 d-flex float-right col-auto ml-auto" style={{ paddingRight: "60px" }}>
                            {verifyOrgLevelEditPermission("Performance Cycle") && 
                                <p onClick={() => this.setState({ showForm: true, cycleSetupScreen: 0, formData: {} })} className='btn apply-button btn-primary mt-2'><i className="fa fa-plus" /> New Cycle</p>}
                            </div>
                        </div>

                        <div id="active" className="pro-overview insidePageDiv tab-pane fade show active">
                            <ActiveCycle ></ActiveCycle>
                        </div>
                        <div id="planned" className="pro-overview insidePageDiv tab-pane fade">
                            <PlannedCycle ></PlannedCycle>
                        </div>
                        <div id="drafts" className="pro-overview insidePageDiv tab-pane fade">
                            <DraftsCycle ></DraftsCycle>
                        </div>
                        <div id="completed" className="pro-overview insidePageDiv tab-pane fade ">
                            <CompletedCycle ></CompletedCycle>
                        </div>
                    </div>
                </div>
                <Formik
                    initialValues={this.state.formValues}
                    onSubmit={this.handleSubmit}
                >
                    {({ handleSubmit }) => (
                        <Form>

                            < Modal className='cycleModal' enforceFocus={false} size={"lg"} show={this.state.showForm} onHide={this.hideForm} >
                                <Header closeButton>
                                    <h5 className="modal-title">New Cycle</h5>
                                </Header>
                                <div className='cycle-modal-header'>
                                    <div className=''>
                                        <Stepper style={{ width: '54em', marginTop: '-16px' }} alternativeLabel activeStep={this.state.cycleSetupScreen}>
                                            {steps.map((label) => (
                                                <Step key={label}>
                                                    <StepLabel style={{ marginTop: '1px' }} >{label}</StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </div>
                                </div>
                                <Body className='cycle-modal-body'>
                                    {cycleSetupScreen === 0 && <CycleDetails formData={formData} nextStep={this.nextStep} handleFormData={this.handleFormData} />}
                                    {cycleSetupScreen === 1 && <PerformanceFactors formData={formData}
                                        nextStep={this.nextStep}
                                        prevStep={this.prevStep}
                                        handleFormData={this.handleFormData} />}
                                    {cycleSetupScreen === 2 && <TemplatesForReviewers formData={formData}
                                        nextStep={this.nextStep}
                                        prevStep={this.prevStep}
                                        handleFormData={this.handleFormData} />}
                                    {cycleSetupScreen === 3 && <FeedbackFlow formData={formData} nextStep={this.nextStep} prevStep={this.prevStep}
                                        handleFormData={this.handleFormData} />}
                                    {cycleSetupScreen === 4 && <AppraisalCycleTime formData={formData}
                                        nextStep={this.nextStep}
                                        prevStep={this.prevStep}
                                        handleFormData={this.handleFormData} />}
                                    {cycleSetupScreen === 5 && <RepetitionsSettings cycleData={this.state.cycleData} formData={formData}
                                        nextStep={this.nextStep}
                                        prevStep={this.prevStep}
                                        hideForm={this.hideForm}
                                        handleFormData={this.handleFormData} />}

                                </Body>

                            </Modal >
                        </Form>
                    )}
                </Formik>
            </div>
        )
    }
}