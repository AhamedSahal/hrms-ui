import React, { Component } from 'react';
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

import { FcTodoList } from "react-icons/fc";

const { Header, Body, Footer } = Modal;
export default class EmployeePerfomanceCycle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cycleSetupScreen: 0,
            cycleData: '',
            step: 0,
            formData: {
                id:0
            },
            
        }
    }
    hideForm = () => {
        this.setState({
            showForm: false,
            formData: {},
            id:0,
            cycleSetupScreen:0,
        })
    }


    handleFormData = (data) => {
        this.setState((prevState) => ({
            formData: { ...prevState.formData, ...data },
        }));
    };

    refreshActiveCycle = () => {
      
        window.location.reload();
    
    }



    updateCycle = (data) => {
   

    const formData = {
        id:data.id,
        appraisalCycletime5: {
            id: data.appraisalCycleTimeId,
            cycleStartDate: data.cycleStartDate,
            cycleEndDate: data.cycleEndDate,
            instancename: data.instanceName,
            regular: data.regular,
            regularCheck_ins: data.regularCheckIns,
        },
        cycleDetails1: {
            id: data.cycleDetailsId,
            assign: data.assign,
            branchId: data.branchId,
            departmentId: data.departmentId,
            functionId: data.functionId,
            cyclename: data.cyclename,
            description: data.description,
            // branches: data.branchId ? data.branchId.split(',').map(id => ({
            //     id: parseInt(id.trim()),
            //     name: '', 
            // })) : [],
        },
        feedbackFlow4: {
            id: data.feedbackId,
            reviewer1: data.reviewer1,
            reviewer2: data.reviewer2,
            reviewer3: data.reviewer3,
            reviewer4: data.reviewer4,
            reviewer5: data.reviewer5,
            roleId: data.roleId,
            feedback: [
                data.reviewer1 ? '1' : null,
                data.reviewer2 ? '2' : null,
                data.reviewer3 ? '3' : null,
                data.reviewer4 ? '4' : null,
                data.reviewer5 ? '5' : null,
            ].filter(Boolean),
            roleName:data.roleName

        },
        performanceValue2: {
            id: data.performFactorId,
            factorField: data.factorField,
            performanceScore: data.performanceScore,
        },
        repetitionValue6: {
            id: data.repetitionId,
            repetitionSettings: {
                id: 0,
                active: data.active,
                frequencyType: data.frequencyType,
                recurrence: data.recurrence,
            },
            repetitionPeriods: [], 
        },
    };

        this.setState({
            formData: formData,
            showForm: true,
        });
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
            // 'Templateize',
            'Participants',
            'Set Timelines',
            'Repetitions',

        ];
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Review Cycle | {getTitle()}</title>
                </Helmet>
                <div className="mt-4 content container-fluid">
                    <div className="tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    {/* <h3 style={{ color: 'white' }} className="page-title">Performance Cycle</h3> */}
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            {<li className="nav-item"><a href="#list" data-toggle="tab" className="nav-link active"><FcTodoList /> List</a></li>}
                                        
                                            {/* <li className="nav-item"><a href="#planned" data-toggle="tab" className="nav-link ">Planned(1)</a></li>
                                            <li className="nav-item"><a href="#drafts" data-toggle="tab" className="nav-link ">Drafts(0)</a></li>
                                            <li className="nav-item"><a href="#completed" data-toggle="tab" className="nav-link ">Completed(1)</a></li> */}
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

                        <div id="list" className="pro-overview insidePageDiv tab-pane fade show active">
                            <ActiveCycle updateCycle={this.updateCycle} ></ActiveCycle>
                        </div>
                        {/* <div id="planned" className="pro-overview insidePageDiv tab-pane fade">
                            <PlannedCycle ></PlannedCycle>
                        </div>
                        <div id="drafts" className="pro-overview insidePageDiv tab-pane fade">
                            <DraftsCycle ></DraftsCycle>
                        </div>
                        <div id="completed" className="pro-overview insidePageDiv tab-pane fade ">
                            <CompletedCycle ></CompletedCycle>
                        </div> */}
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
                                    <h5 className="modal-title">
                                        {(this.state.formData && this.state.formData.id) ? 'Edit' : 'New'} Cycle</h5>
                                        
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
                                    {/* {cycleSetupScreen === 2 && <TemplatesForReviewers formData={formData}
                                        nextStep={this.nextStep}
                                        prevStep={this.prevStep}
                                        handleFormData={this.handleFormData} />} */}
                                    {cycleSetupScreen === 2 && <FeedbackFlow formData={formData} nextStep={this.nextStep} prevStep={this.prevStep}
                                        handleFormData={this.handleFormData} />}
                                    {cycleSetupScreen === 3 && <AppraisalCycleTime formData={formData}
                                        nextStep={this.nextStep}
                                        prevStep={this.prevStep}
                                        handleFormData={this.handleFormData} />}
                                    {cycleSetupScreen === 4 && <RepetitionsSettings cycleData={this.state.cycleData} formData={formData}
                                        nextStep={this.nextStep}
                                        prevStep={this.prevStep}
                                        hideForm={this.hideForm}
                                        handleFormData={this.handleFormData} 
                                        refreshActiveCycle={this.refreshActiveCycle}/>}

                                </Body>

                            </Modal >
                        </Form>
                    )}
                </Formik>
            </div>
        )
    }
}