import { ErrorMessage, Field, Form, Formik } from 'formik';
import EnumDropdown from '../../ModuleSetup/Dropdown/EnumDropdown';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { Helmet } from 'react-helmet';
import {  verifyOrgLevelEditPermission } from '../../../utility';
import { GENDER } from '../../../Constant/enum';
import {  saveCandidateInfo } from './externalService';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';



export default class CandidateInfoForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            CandidateInfoForm: props.CandidateInfoForm || {
                id: 0,
                candidateId: 0,
                offerletterId: 0,
                candidatePosition: "",
                dob: "",
                personalemailid: "",
                fathername: "",
                firstname: "",
                gender: "MALE",
                lastname: "",
                middlename: "",
                fileName: "",
                phone: ""

            }
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.CandidateInfoForm && nextProps.CandidateInfoForm != prevState.CandidateInfoForm) {
            return ({ CandidateInfoForm: nextProps.CandidateInfoForm })
        } else if (!nextProps.CandidateInfoForm) {
            return prevState.CandidateInfoForm || ({
                CandidateInfoForm: nextProps.CandidateInfoForm || {
                    id: 0,
                    candidateId: 0,
                    offerletterId: 0,
                    candidatePosition: "",
                    dob: "",
                    personalemailid: "",
                    fathername: "",
                    firstname: "",
                    gender: "MALE",
                    lastname: "",
                    middlename: "",
                    phone: "",
                    fileName: "",
                }
            })
        }
        return null;
    }

    save = (data, action) => {
        const capitalizeFirstLetter = (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        };
        data.firstname = capitalizeFirstLetter(data.firstname);
        data.lastname = capitalizeFirstLetter(data.lastname);
        data.middlename = data.middlename ? capitalizeFirstLetter(data.middlename) : '';
        data.fathername = data.fathername ? capitalizeFirstLetter(data.fathername) : '';
        action.setSubmitting(true);
        saveCandidateInfo(data).then(res => {

            if (res.status == "OK") {
                if(res.data.applicantId > 0){
                    window.location.href = "/successMessage"
                }
                if(res.data.applicantId == 0){
                    toast.success(res.message);
                    window.location.reload();
                }
                
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.log(err);
            toast.error("Error while saving candidateInfo");

            action.setSubmitting(false);
        })
    }
    render() {
        const { CandidateInfoForm } = this.state;
        CandidateInfoForm.file = "";
        return (


            <div className="insidePageDiv">

                <div className="page-containerDocList content container-fluid">
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Candidate Information Details</h3>

                            </div>


                        </div>
                    </div>
                    <div className="row">
                    {verifyOrgLevelEditPermission("Onboard Candidate Info Form") &&
                        <Formik
                            enableReinitialize={true}
                            initialValues={this.state.CandidateInfoForm}
                            onSubmit={this.save}
                        // validationSchema={overtimeSchema}
                        >
                            {({
                                setFieldValue,
                                /* and other goodies */
                            }) => (
                                <Form autoComplete="off">
                                    <div className="m-0 row ant-table-wrapper" style={{ paddingTop: "25px", maxWidth: "none" }}>
                                        <div className="col-md-4">
                                            <FormGroup >
                                                <label>Candidate Id
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field name="candidateId" className="form-control"></Field>
                                                <ErrorMessage name="candidateId">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Offer Letter Number
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field name="offerletterId" className="form-control"></Field>
                                                <ErrorMessage name="offerletterId">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Candidate Position
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field name="candidatePosition" className="form-control"></Field>
                                                <ErrorMessage name="candidatePosition">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup >
                                                <label>First Name
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field name="firstname" className="form-control"></Field>
                                                <ErrorMessage name="firstname">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Middle Name
                                                </label>
                                                <Field name="middlename" className="form-control"></Field>
                                                <ErrorMessage name="middlename">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Last Name
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field name="lastname" className="form-control"></Field>
                                                <ErrorMessage name="lastname">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Email
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field name="personalemailid" className="form-control"></Field>
                                                <ErrorMessage name="personalemailid">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Father Name
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field name="fathername" className="form-control"></Field>
                                                <ErrorMessage name="fathername">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Phone
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field name="phone" className="form-control"></Field>
                                                <ErrorMessage name="phone">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>

                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Gender
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field name="gender" className="form-control"
                                                    render={field => {
                                                        return <EnumDropdown label={"GENDER"} enumObj={GENDER} defaultValue={this.state.CandidateInfoForm.gender} onChange={e => {
                                                            setFieldValue("gender", e.target.value)
                                                        }}>
                                                        </EnumDropdown>
                                                    }}
                                                ></Field>
                                                <ErrorMessage name="gender">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Signed Offer Letter
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input name="file" type="file" className="form-control" onChange={e => {
                                                    setFieldValue('file', e.target.files[0]);
                                                }}></input>
                                                <ErrorMessage name="file">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                                {/* <p style={{fontSize:"10px",fontFamily:"Arial"}}>You can upload files of size upto 2MB each. Supported file formats are .pdf</p> */}
                                            </FormGroup>
                                        </div>
                                        <div className='col-sm-4 col-md-12 my-3 d-flex float-left'>
                                            <input type="submit" className="btn btn-primary" value={this.state.CandidateInfoForm.id > 0 ? "Update" : "Submit"} />
                                        </div>

                                    </div>
                                </Form>
                            )
                            }
                        </Formik>}
                        {!verifyOrgLevelEditPermission("Onboard Candidate Info Form") && <AccessDenied></AccessDenied>}
                    </div>
                </div>
                </div>







                    

                )
    }
}
