import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';  
import { saveOfferLetter } from './service';
import { OfferLetterSchema } from './Validation'; 
import SignatureDropdown from '../../ModuleSetup/Dropdown/SignatureDropdown';

export default class OfferletterForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isInternal: props.isInternal || "",
            applicantId: props.applicantId || 0,
            offerletter: props.offerletter || {
                id: 0,
               candidatename: "",
               candidateemailid: "",
               candidateposition: "",
               offerletterdate: "",
               joiningdate: "",
               salary: "",
               basicsalary: "",
               allowances: "",
               workplace: "",
               worktype: "",
               weekworkhours: "",
               workingdays: "",
               weekoffdays: "",
               annualleave:"",
               probationdays: "",
               noticeperiod: "",
               businesslanguages: "",
               signatureholdername: "",
               signatureholderposition: ""
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.offerletter && nextProps.offerletter != prevState.offerletter) {
            return ({ offerletter: nextProps.offerletter })
        } else if (!nextProps.offerletter ) { 
            return prevState.offerletter || ({
                offerletter: {
                    id: 0,
                    candidatename: "",
                    candidateemailid: "",
                    candidateposition: "",
                    offerletterdate: "",
                    joiningdate: "",
                    salary: "",
                    basicsalary: "",
                    allowances: "",
                    workplace: "",
                    worktype: "",
                    weekworkhours: "",
                    workingdays: "",
                    weekoffdays: "",
                    annualleave:"",
                    probationdays: "",
                    noticeperiod: "",
                    businesslanguages: "",
                    signatureholdername: "",
                    signatureholderposition: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true); 
        let offerData = {...data, internal: this.state.isInternal == "internalApplicant"?true:false}
        saveOfferLetter(offerData).then(res => {
           
            if (res.status == "OK") {
                toast.success(res.message);
                if(this.state.applicantId == 0){
                this.props.updateList(res.data);
                     
                }
                if(this.state.applicantId > 0){ 
                    this.props.handleStatusUpdate(this.state.applicantId,this.state.isInternal,"OFFERED",res.data);
                }
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
                    initialValues={this.state.offerletter}
                    onSubmit={this.save}
                    validationSchema={OfferLetterSchema}  
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
                          <div className="row">
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Candidate Name
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="candidatename" className="form-control"></Field>
                                    <ErrorMessage name="candidatename">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Candidate Email Id
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="candidateemailid" className="form-control"></Field>
                                    <ErrorMessage name="candidateemailid">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Candidate Position
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="candidateposition" className="form-control"></Field>
                                    <ErrorMessage name="candidateposition">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Issue Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="offerletterdate" className="form-control" type="date"></Field>
                                    <ErrorMessage name="offerletterdate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                          </div>   
                          <div className="row">
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Joining Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="joiningdate" className="form-control" type="date"></Field>
                                    <ErrorMessage name="joiningdate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Salary
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="salary" className="form-control"></Field>
                                    <ErrorMessage name="salary">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Basic Salary
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="basicsalary" className="form-control"></Field>
                                    <ErrorMessage name="basicsalary">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Allowances
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="allowances" className="form-control"></Field>
                                    <ErrorMessage name="allowances">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Place of Work
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="workplace" className="form-control" placeholder="Eg:Dubai,Abu Dhabi"></Field>
                                    <ErrorMessage name="workplace">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Work Type
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="worktype" className="form-control" placeholder="Eg:Full Time or Part Time"></Field>
                                    <ErrorMessage name="worktype">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Weekly Working Hours
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="weekworkhours" className="form-control" placeholder="Eg:40 hours or 48 hours"></Field>
                                    <ErrorMessage name="weekworkhours">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Working Days
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="workingdays" className="form-control" placeholder="Eg:Mon to Fri from 08.30 am to 5.30pm" ></Field>
                                    <ErrorMessage name="workingdays">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Weekoff Days
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="weekoffdays" className="form-control" placeholder="Eg:Sat&Sun or Thu&Fri"></Field>
                                    <ErrorMessage name="weekoffdays">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Annual Leave
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="annualleave" className="form-control" type="number"></Field>
                                    <ErrorMessage name="annualleave">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                            </div>
                          <div className="row">
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>On Probation Days
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="probationdays" className="form-control" type="number"></Field>
                                    <ErrorMessage name="probationdays">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                          
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Notice Period
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="noticeperiod" className="form-control" type="number"></Field>
                                    <ErrorMessage name="noticeperiod">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                            </div>
                          <div className="row">
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Business Languages
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="businesslanguages" className="form-control" placeholder="Eg:Arabic and English"></Field>
                                    <ErrorMessage name="businesslanguages">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                           
                            <div className="col-md-6">
                             
                                    <FormGroup className="p-0 mb-0">
                                    <label>Signatory Name
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                        <Field
                                            className="form-control"
                                            name="signatureholder"
                                            render={(field) => {
                                                return (
                                                    <SignatureDropdown
                                                        defaultValue={values.division?.id}
                                                        onChange={(e) => {
                                                            setFieldValue("signatureholderId", e.target.value);
                                                            setFieldValue("signatureholder", { id: e.target.value });
                                                        }}
                                                    ></SignatureDropdown>
                                                );
                                            }}
                                        ></Field>
                                    </FormGroup>
                            </div>
                            </div>         
                            <input type="submit" className="btn btn-primary" value={this.state.offerletter.id>0?"Update":"Generate"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>                                                                                                                                                  
        )
    }
}
