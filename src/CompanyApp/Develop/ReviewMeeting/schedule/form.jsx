import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { talentMeetingSchema } from './validation';
import { saveTalentReviewMeeting } from './service';

export default class MeetingSchedule extends Component {
    constructor(props) {
        super(props)

        this.state = {
            talentMeetingSchedule: props.formData.schedules || {
                startDate: new Date(),
                startTime: new Date(),
                endDate: '',
                endTime: '',
                startReminder: "",
                endReminder: "",
            },
        }
    }



    save = (data, action) => {

        this.props.handleFormData({ schedules: data, id: 0 })
        const meetingData = this.props.formData
        saveTalentReviewMeeting(meetingData).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.error(err);
            toast.error("Error while saving Review Meeting");

            action.setSubmitting(false);
        })
    }



    render() {
        return (
            <Formik
                enableReinitialize={true}
                initialValues={this.state.talentMeetingSchedule}
                onSubmit={this.save}
                validationSchema={talentMeetingSchema}
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
                        <div className="row px-4 mx-2">
                            <div className="row col-md-5">
                                <fieldset className='row border border-dark p-2'>
                                    <legend className='float-none w-auto p-2'>Time Schedule</legend>
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <label className='survey-label'>Start Date
                                                <span className='ml-1' style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="startDate" className="form-control" type="date" ></Field>
                                            <ErrorMessage name="startDate">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">

                                        <FormGroup>
                                            <label className='survey-label'>Start Time
                                                <span className='ml-1' style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="startTime" type="time" className="form-control" ></Field>
                                            <ErrorMessage name="startTime">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <label className='survey-label'>End Date
                                                <span className='ml-1' style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="endDate" className="form-control" type="date"></Field>
                                            <ErrorMessage name="endDate">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <label className='survey-label'>End Time
                                                <span className='ml-1' style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="endTime" type="time" className="form-control" ></Field>
                                            <ErrorMessage name="endTime">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                </fieldset>
                            </div>
                            <div className="col-md-7">
                                <div className="row mt-3">
                                    <div className="col-md-12">
                                        <FormGroup>
                                            <label className='survey-label'>How many days before the review meeting starts do you want to be reminded?
                                                <span className='ml-1' style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="startReminder" type="number" className="form-control" ></Field>
                                            <ErrorMessage name="startReminder">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-12">
                                        <FormGroup>
                                            <label className='survey-label'>How many days before the review meeting due date do you want to remind participants to submit feedback?
                                                <span className='ml-1' style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="endReminder" type="number" className="form-control" ></Field>
                                            <ErrorMessage name="endReminder">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="mt-3 col-lg-12 ml-3">
                                <input type="submit" className="mr-5 mt-2 float-right btn btn-success" value="Publish" />
                                <input onClick={this.props.prevStep} style={{ width: '68px', marginRight: '18px', height: '32px' }} className="col-md-2 float-right mt-2 btn btn-dark" value={"Back"} />
                            </div>
                        </div>
                    </Form>
                )
                }
            </Formik>
        )
    }
}
