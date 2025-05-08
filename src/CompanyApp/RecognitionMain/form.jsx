import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { getTitle, verifyOrgLevelViewPermission } from '../../utility';
import { getRecognitionList, saveRecognition } from './service';
import { RecognitionSchema } from './validation';
import EmployeeDropdown from '../ModuleSetup/Dropdown/EmployeeDropdown';
import RecognitionCategoryDropdown from '../ModuleSetup/Dropdown/RecognitionCategoryDropdown';
import AccessDenied from '../../MainPage/Main/Dashboard/AccessDenied';

export default class RecognitionMain extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recognitionMain: props.recognitionMain || {
                id: 0,
                employeeId: props.employeeId,
                recognitionId: 0,
                recognition: {
                    id: 0
                },
                reccommentss: ""

            }
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.recognitionMain && nextProps.recognitionMain != prevState.recognitionMain) {
            return ({ recognitionMain: nextProps.recognitionMain })
        } else if (!nextProps.recognitionMain) {
            return prevState.recognitionMain || ({
                recognitionMain: nextProps.recognitionMain || {
                    id: 0,
                    employeeId: nextProps.employeeId,
                    recognitionId: 0,
                    recognition: {
                        id: 0
                    },
                    reccommentss: ""
                }
            })
        }
        return null;
    }

    save = (data, action) => {
        action.setSubmitting(true);
        saveRecognition(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                window.location.reload();
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.log(err);
            toast.error("Error while saving Recognition");
            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div className="m-0 page-containerDocList content container-fluid">
        <div className="tablePage-header">

                {/* Page Content */}
                {verifyOrgLevelViewPermission("Engage Recognition") && 
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.recognitionMain}
                    onSubmit={this.save}
                    validationSchema={RecognitionSchema}
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
                        <Form autoComplete="off">
                            <div className="row">
                                <div style={{ textAlign: "center", backgroundColor: "#E8E1E1", fontFamily: "Tahoma", borderRadius: "20px", margin: "auto", width: "60%", padding: "10px" }}>
                                    <h3 className="las la-medal">Recognize</h3>
                                </div>
                            </div>
                            <div className="row" style={{ paddingTop: "25px", paddingLeft: "10px" }}>
                                <div className="col-md-12">
                                    <FormGroup>
                                        <label>Whom do you want to recognize?
                                            <span style={{ color: "red" }}>*</span>
                                        </label><br />
                                        <Field name="employeeId" className="col-md-12" render={field => {
                                            return <EmployeeDropdown permission="ORGANIZATION" defaultValue={values.employee?.id} onChange={e => {
                                                setFieldValue("employeeId", e.target.value);
                                                setFieldValue("employee", { id: e.target.value });
                                            }}></EmployeeDropdown>
                                        }}></Field>
                                        <ErrorMessage name="employeeId">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row" style={{ paddingTop: "25px", paddingLeft: "10px" }}>
                                <div className="col-md-12">
                                    <FormGroup>
                                        <label>Select category
                                            <span style={{ color: "red" }}>*</span>
                                        </label><br />
                                        <Field name="recognitionId" render={field => {
                                            return <RecognitionCategoryDropdown defaultValue={values.recognition?.id} onChange={e => {
                                                setFieldValue("recognitionId", e.target.value);
                                                setFieldValue("recognition", { id: e.target.value });
                                            }}></RecognitionCategoryDropdown>
                                        }}></Field>
                                        <ErrorMessage name="recognitionId">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row" style={{ paddingTop: "25px", paddingLeft: "10px" }}>
                                <div className="col-md-12">
                                    <FormGroup>
                                        <label>Reason for recognition?
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="reccommentss" className="form-control" ></Field>
                                        <ErrorMessage name="reccommentss">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            < div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: "25px" }}>
                                <input type="submit" className="btn btn-primary" value="Recognize" /> </div>

                        </Form>
                    )
                    }
                </Formik>}
                {!verifyOrgLevelViewPermission("Engage Recognition") && <AccessDenied></AccessDenied>}
            </div>

            </div>
        )
    }
}
