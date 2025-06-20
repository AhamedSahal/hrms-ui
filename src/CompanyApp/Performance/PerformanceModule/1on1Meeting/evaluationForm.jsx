import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import EmployeeDropdown from '../../../ModuleSetup/Dropdown/EmployeeDropdown';
import { createOneOnOneEvaluvationForm } from './service';
import { Button, Stack } from '@mui/material';

export default class EvaluvationForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            meetingInfo : props.meetingInfo || {},
            evaluvationForm: {
                id: 0,
                currentPerformancelevel: null,
                hiddenComments: '',
                reviewerComment: '',
                employeeId: null,
                reviewer: null,
                agenda: null,
                meetingInfoId: props.meetingInfo?.id || 0
            },
            reviewStatus: "",
            self: props.self || false,

        }

    }


    save = (data, action) => {
        action.setSubmitting(true);
        
        createOneOnOneEvaluvationForm(data,0).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList();
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Performance Review");

            action.setSubmitting(false);
        })
    }
    render() {

        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.evaluvationForm}
                    onSubmit={this.save}
                // validationSchema={PerformanceReviewSchema}
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
                    }) => (
                        <Form>
                            <div className="row">
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Review Status
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div className="radio" >
                                            <label>
                                                <input type="radio" value="yes" name="rotationReq"
                                                    checked={this.state.reviewStatus == "yes"}
                                                    onChange={e => {
                                                        setFieldValue("rotationReq", e.target.value)
                                                        this.setState({ reviewStatus: e.target.value })
                                                    }}
                                                />&nbsp;Completed
                                            </label>&nbsp;&nbsp;&nbsp;
                                            <label>
                                                <input type="radio"
                                                    value="no" name="rotationReq"
                                                    checked={this.state.reviewStatus == "no"}
                                                    onChange={e => {
                                                        setFieldValue("rotationReq", e.target.value)
                                                        this.setState({ reviewStatus: e.target.value })
                                                    }}
                                                />&nbsp;Not Completed
                                            </label>
                                        </div>

                                    </FormGroup>
                                </div>

                                {/* completed */}
                                {this.state.reviewStatus == "yes" &&
                                    <div className="row">
                                        {/* Current Performance level */}
                                        <div className="col-md-12">
                                            <FormGroup>
                                                <label>Current Performance level <span style={{ color: "red" }}>*</span></label>
                                                <select id="currentPerformancelevel" className="form-control" name="currentPerformancelevel"
                                                    onChange={e => {
                                                        setFieldValue("currentPerformancelevel", e.target.value)
                                                        // this.setState({ currentPerformancelevel: e.target.value })
                                                    }} defaultValue={values.meetingType}>
                                                    <option value="">Select Performance Level</option>
                                                    <option value="0">Needs Improvement</option>
                                                    <option value="1">Upto Par</option>
                                                    <option value="2">OutStanding</option>
                                                </select>
                                            </FormGroup>
                                            <ErrorMessage name="currentPerformancelevel">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </div>
                                        {/* reviewerComment */}
                                        <div className="col-md-12">
                                            <FormGroup>
                                                <label>Reviewer Comment</label>
                                                <Field name={'description'} defaultValue={this.state.reviewerComment}
                                                    onChange={e => {
                                                        setFieldValue("reviewerComment", e.target.value)
                                                        // this.setState({ reviewerComment: e.target.value })
                                                    }}
                                                    component="textarea" rows="4"
                                                    className="form-control"
                                                    placeholder="Description"
                                                    maxLength="250"
                                                >
                                                </Field>
                                            </FormGroup>
                                        </div>
                                        {/* Hidden Comments  */}
                                        <div className="col-md-12">
                                            <FormGroup>
                                                <label>Hidden Comments</label>
                                                <Field name={'description'} defaultValue={this.state.hiddenComments}
                                                    onChange={e => {
                                                        setFieldValue("hiddenComments", e.target.value)
                                                        // this.setState({ hiddenComments: e.target.value })
                                                    }}
                                                    component="textarea" rows="4"
                                                    className="form-control"
                                                    placeholder="Description"
                                                    maxLength="250"
                                                >
                                                </Field>
                                            </FormGroup>
                                        </div>

                                        {/* Save button */}
                                        <div className="row mt-3">
                                            <div className="col">
                                                <input type="submit" className="btn btn-primary" value="Save" />
                                            </div>

                                        </div>

                                    </div>
                                }

                                {/* not completed */}
                                {this.state.reviewStatus == "no" &&
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Stack direction="row" spacing={1}>
                                                <Button sx={{ textTransform: 'none' }} size="small" onClick={() => {
                                                    this.props.updateStatus(this.state.evaluvationForm.meetingInfoId, "RESCHEDULE");
                                                }} variant="contained" style={{backgroundColor: "#f39c12"}}>
                                                    Re-schedule
                                                </Button>
                                                <Button sx={{ textTransform: 'none' }} size="small" onClick={() => {
                                                    this.props.updateStatus(this.state.evaluvationForm.meetingInfoId, "CANCEL");
                                                }} variant="contained" color="error">
                                                    Cancel
                                                </Button>
                                            </Stack>
                                        </div>

                                    </div>
                                }


                            </div>


                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
