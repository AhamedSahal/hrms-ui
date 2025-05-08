import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';  
import { saveJobDescription } from './service';
import JobTitlesDropdown from '../../ModuleSetup/Dropdown/JobTitlesDropdown';
import DepartmentDropdown from '../../ModuleSetup/Dropdown/DepartmentDropdown'; 
import GradesDropdown from '../../ModuleSetup/Dropdown/GradesDropdown';
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
 import { JobDescriptionSchema } from './validation'; 

export default class JobDescriptionForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            JobDescription: props.JobDescription || {
                id: 0,
                name: "",  
                departmentId: 0,
                gradesId: 0,
                branchId: 0,
                jobTitlesId: 0,
                repToId: 0,
                jobTitles:{
                    id: 0,
                },
                department :{
                    id: 0 
                },
                grades :{
                    id: 0 
                },
                branch: {
                    id: 0,
                },
                repTo: {
                    id: 0,
                },
                jobpurpose: "",
                noofreports: "",
                financialParameters: "",
                externalInterfaces: "",
                internalInterfaces: "",
                keyAccResp: "",
                qualiExper: "",
                keyskills: "",
                addReq: "",
                disclaimer: "",
            } 
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.JobDescription && nextProps.JobDescription != prevState.JobDescription) {
            return ({ JobDescription: nextProps.JobDescription })
        } else if (!nextProps.JobDescription ) { 
            return prevState.JobDescription || ({
                JobDescription: {
                    id: 0,
                    name: "", 
                    departmentId: 0,
                    gradesId: 0,
                    branchId: 0,
                    jobTitlesId: 0,
                    repToId: 0,
                    jobTitles:{
                        id: 0,
                    },
                    department :{
                        id: 0 
                    },
                    grades :{
                        id: 0 
                    },
                    branch: {
                        id: 0,
                    },
                    repTo: {
                        id: 0,
                    },
                    jobpurpose: "",
                    noofreports: "",
                    financialParameters: "",
                    externalInterfaces: "",
                    externalInterfaces: "",
                    keyAccResp: "",
                    qualiExper: "",
                    keyskills: "",
                    addReq: "",
                    disclaimer: "",
                }
            })
        }
        return null;
    }
    save = (data, action) => {
         
        action.setSubmitting(true);  
        saveJobDescription(data).then(res => { 
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
               
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error(err);  
            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.JobDescription}
                    onSubmit={this.save}
                    validationSchema={JobDescriptionSchema}  
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue,
                        setSubmitting
                        /* and other goodies */
                    }) => (
                        <Form autoComplete='off'>
                        <div className="col-sm-12">
                         <div className="card">
                            <div className="card-header">
                                <div className="row align-items-center"><div className="col"><h4>Position Information</h4> </div>
                                </div>
                            </div>
                        <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                            <FormGroup>
                               <label>Job Code
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            </div>
                            <div className="col-md-6">
                            <FormGroup>
                                <label>Job Titles
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field  name="jobTitlesId" render={field => {
                                    
                                    return <JobTitlesDropdown defaultValue={values.jobTitles?.id} onChange={e => {
                                        setFieldValue("jobTitlesId", e.target.value);
                                        setFieldValue("jobTitles", { id: e.target.value });
                                    }}></JobTitlesDropdown>
                                }}></Field>
                                <ErrorMessage name="jobTitlesId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Department
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="departmentId" render={field => {
                                        return <DepartmentDropdown defaultValue={values.department?.id} onChange={e => {
                                            setFieldValue("departmentId", e.target.value);
                                            setFieldValue("department", { id: e.target.value }); 
                                        }}></DepartmentDropdown>
                                    }}></Field> 
                                    <ErrorMessage name="departmentId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                            <FormGroup>
                               <label>Reporting To
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field  name="repToId"  render={field => {
                                    return <EmployeeDropdown defaultValue={values.repTo?.id} onChange={e => {
                                        setFieldValue("repToId", e.target.value);
                                        setFieldValue("repTo", { id: e.target.value });
                                    }}></EmployeeDropdown>
                                }}></Field>
                                <ErrorMessage name="repToId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            </div>
                        </div>
                        <div className="row">
                             <div className="col-md-6">
                                <FormGroup>
                                    <label>Grades
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="gradesId" render={field => {
                                        return <GradesDropdown defaultValue={values.grades?.id} onChange={e => {
                                            setFieldValue("gradesId", e.target.value);
                                            setFieldValue("grades", { id: e.target.value }); 
                                        }}></GradesDropdown>
                                    }}></Field> 
                                    <ErrorMessage name="gradesId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                             </div>
                             <div className="col-md-6">
                                <FormGroup>
                                    <label>Location
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="branchId" render={field => {
                                        return <BranchDropdown defaultValue={values.branch?.id} onChange={e => {
                                            setFieldValue("branchId", e.target.value);
                                            setFieldValue("branch", { id: e.target.value }); 
                                        }}></BranchDropdown>
                                    }}></Field> 
                                    <ErrorMessage name="branchId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                             </div>
                        </div>
                        </div> 
                        </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="row align-items-center"><div className="col"><h4>Job Purpose</h4> </div>
                                </div>
                            </div>
                        <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                            <FormGroup>
                                {/* <label>Job Purpose
                                        <span style={{ color: "red" }}>*</span>
                                    </label> */}
                                    <Field name="jobpurpose" className="form-control" placeholder="Job Purpose" component="textarea" rows="5"></Field>
                                    <ErrorMessage name="jobpurpose">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                            </FormGroup>
                            </div>
                        </div>
                        </div>
                        </div>
                        </div>
                        <div className="col-sm-12">
                         <div className="card">
                            <div className="card-header">
                                <div className="row align-items-center"><div className="col"><h4>Dimensions</h4> </div>
                                </div>
                            </div>
                        <div className="card-body">
                              
                            <div className="row">
                            <div className="col-md-6">
                            <FormGroup>
                               <label>No of Reports
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="noofreports" className="form-control"></Field>
                                <ErrorMessage name="noofreports">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            </div>
                            <div className="col-md-6">
                            <FormGroup>
                               <label>Financial Parameters
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <div className="radio" >
                                        <label>
                                            <input type="radio" value="Yes"  name="financialParameters"
                                               onChange={e => {
                                                setFieldValue("financialParameters", e.target.value)}}
                                            />&nbsp;Yes
                                        </label>&nbsp;&nbsp;&nbsp;
                                        <label> 
                                            <input type="radio" 
                                            value="No"  name="financialParameters"
                                            onChange={e => {
                                                setFieldValue("financialParameters", e.target.value)}}
                                            />&nbsp;No
                                        </label>
                                </div>
                                <ErrorMessage name="financialParameters">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            </div>
                            </div>
                            <div className="row">
                            <div className="col-md-6">
                            <FormGroup>
                               <label>External Interface(s)
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="externalInterfaces" className="form-control"></Field>
                                <ErrorMessage name="externalInterfaces">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            </div>
                            <div className="col-md-6">
                            <FormGroup>
                               <label>Internal Interface(s)
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="internalInterfaces" className="form-control"></Field>
                                <ErrorMessage name="internalInterfaces">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            </div>
                            </div>
                            </div> 
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="row align-items-center"><div className="col"><h4>Key Accountabilities And Responsibilities</h4> </div>
                                </div>
                            </div>
                        <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                            <FormGroup>
                                    <Field name="keyAccResp" className="form-control" placeholder="Key Accountabilities And Responsibilities" component="textarea" rows="20"></Field>
                                    <ErrorMessage name="keyAccResp">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                            </FormGroup>
                            </div>
                        </div>
                        </div>
                        </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="row align-items-center"><div className="col"><h4>Job Requirements </h4> </div>
                                </div>
                            </div>
                        <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                            <FormGroup>
                                <label>Minimum Qualifications and Experience
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                    <Field name="qualiExper" className="form-control" component="textarea" rows="10"></Field>
                                    <ErrorMessage name="qualiExper">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                            </FormGroup>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                            <FormGroup>
                                <label>Key Skills and Competencies
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                    <Field name="keyskills" className="form-control" component="textarea" rows="10"></Field>
                                    <ErrorMessage name="keyskills">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                            </FormGroup>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                            <FormGroup>
                                <label>Additional Requirements
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                    <Field name="addReq" className="form-control" component="textarea" rows="5"></Field>
                                    <ErrorMessage name="addReq">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                            </FormGroup>
                            </div>
                        </div>
                        </div>
                        </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="row align-items-center"><div className="col"><h4>Disclaimer</h4> </div>
                                </div>
                            </div>
                        <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                            <FormGroup>
                                    <Field name="disclaimer" className="form-control" placeholder="Disclaimer" component="textarea" rows="5"></Field>
                                    <ErrorMessage name="disclaimer">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                            </FormGroup>
                            </div>
                        </div>
                        </div>
                        </div>
                        </div> 
                            <input type="submit" className="btn btn-primary" value={this.state.JobDescription.id>0?"Update":"Generate"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
