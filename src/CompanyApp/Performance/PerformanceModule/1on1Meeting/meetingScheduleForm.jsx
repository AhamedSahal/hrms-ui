import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import EmployeeDropdown from '../../../ModuleSetup/Dropdown/EmployeeDropdown';
import { createOneOnOneScheduleMeeting } from './service';
import { oneOnOneSchema } from './Validation';
import { getPermission } from '../../../../utility';


export default class MeetingScheduleForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            meetingSchedule: props.meetingSchedule || {
                id: 0,
                title: '',
                Date: '',
                meetingType: '',
                other:'',
                employeeId: null,
                reviewer: null,
                agenda: null,
                rescheduleId: props.rescheduleId 
            },
            meetingType: 0,
            self: props.self || false,
           

        }

    }
componentDidMount () {
    console.log("this.state.meetingSchedule",this.state.meetingSchedule)
    console.log("this.state.meetingSchedule",this.props.meetingSchedule)
}

    save = (data, action) => {
        action.setSubmitting(true);
        console.log("datadata",this.state.meetingSchedule)
        console.log("datadata",this.props.meetingSchedule)

        let tempData = data;
        // if(this.state.meetingSchedule.id > 0){
        //  tempData = {...data,reviewer: data.reviewer?.id,employeeId: data.employee?.id}
        // }
        createOneOnOneScheduleMeeting(tempData,this.state.meetingSchedule.id).then(res => {
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
                    initialValues={this.state.meetingSchedule}
                    onSubmit={this.save}
                validationSchema={oneOnOneSchema}
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
                            <div className="col-md-12">
                                    <FormGroup>
                                        <label>Title <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="title" defaultValue={values.title} className="form-control" required></Field>
                                        <ErrorMessage name="title">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-12">
                                    <FormGroup>
                                        <label>Date & Time <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="dateAndTime">{({ field }) => (<input {...field} type="datetime-local" className="form-control" onInput={this.handleYearInput} />)}</Field>
                                        <ErrorMessage name="dateAndTime">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                {/* 	Type of meeting */}
                                <div className="col-md-12">
                                    <FormGroup>
                                        <label>Type Of Meeting <span style={{ color: "red" }}>*</span></label>
                                        <select id="meetingType" className="form-control" name="meetingType"
                                            onChange={e => {
                                                setFieldValue("meetingType", e.target.value)
                                                this.setState({ meetingType: e.target.value })
                                            }} defaultValue={values.meetingType}>
                                            <option value="">Select Meeting Type</option>
                                            <option value="0">In-person</option>
                                            <option value="1">MS Teams</option>
                                            <option value="2">Zoom</option>
                                            <option value="3">Other</option>
                                        </select>
                                    </FormGroup>
                                    <ErrorMessage name="meetingType">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </div>
                                {/* other text */}
                                {this.state.meetingType == 3 && <div className="col-md-12">
                                    <FormGroup>
                                        <label>Other <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="other" defaultValue={values.other} className="form-control" ></Field>
                                        <ErrorMessage name="other">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>}
                            </div>
                            {/* employee */}
                          {this.state.meetingSchedule?.teamValidation?
                          <div className="row">
                            {/* employee */}
                            <div className="col-12">
                                    <label>Employee <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="employeeId"  render={field => {
                                        return <EmployeeDropdown  readOnly={this.state.meetingSchedule?.dashboardValidation} defaultValue={values.employee?.id} onChange={e => {
                                            setFieldValue("employeeId", e.target.value);
                                        }}></EmployeeDropdown>
                                    }}></Field>
                                    <ErrorMessage name="employeeId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </div>


                          </div>
                          
                          : <div className="row">
                                {/* ALL */}
                                <div className="col-12">
                                    <label>Employee <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="employeeId"  render={field => {
                                        return <EmployeeDropdown permission="NONE"  readOnly={this.state.meetingSchedule?.dashboardValidation} defaultValue={values.employee?.id} onChange={e => {
                                            setFieldValue("employeeId", e.target.value);
                                        }}></EmployeeDropdown>
                                    }}></Field>
                                    <ErrorMessage name="employeeId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </div>
                                {/* reviwer  */}
                                <div className="col-12">
                                    <label>Reviewer <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="reviewer" render={field => {
                                        return <EmployeeDropdown permission="ORGANIZATION" readOnly={this.state.meetingSchedule?.teamValidation} defaultValue={values.reviewer} onChange={e => {
                                            setFieldValue("reviewer", e.target.value);
                                        }}></EmployeeDropdown>
                                    }}></Field>
                                    <ErrorMessage name="reviewer">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </div>
                                </div> }

                                <div className="row">
                                {/* agenta */}
                                <div className="col-md-12">
                                    <FormGroup>
                                        <label>Agenda
                                        </label>
                                        <Field name="agenda" defaultValue={values.agenda} className="form-control"></Field>
                                        <ErrorMessage name="agenda">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col">
                                    <input type="submit" className="btn btn-primary" value="Save" />
                                </div>

                            </div>

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
