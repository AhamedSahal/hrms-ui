import React, { Component } from 'react';
import { ErrorMessage, Field, Formik, Form } from "formik"
import { getFormat, updateFormat } from "./service"
import { FormatSchema } from "./validation"
import { toLocalCalendarTime, toUTCCalendarTime, verifyOrgLevelViewPermission } from "../../../utility"
import AccessDenied from "../../../MainPage/Main/Dashboard/AccessDenied"
import { FormGroup } from 'reactstrap';
import { toast } from 'react-toastify';


export default class AttendanceFormatForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            attendanceFormat: {}
        }
    }
    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        if (verifyOrgLevelViewPermission("Module Setup Manage")) {
            getFormat().then(res => {
                if (res.status == "OK") {
                    if (res.data.holidayWeeklyOffOtEnd) {
                        res.data.holidayWeeklyOffOtEnd = toLocalCalendarTime(res.data.holidayWeeklyOffOtEnd)
                    }
                    if (res.data.holidayWeeklyOffOtStart) {
                        res.data.holidayWeeklyOffOtStart = toLocalCalendarTime(res.data.holidayWeeklyOffOtStart)
                    }
                    this.setState({ attendanceFormat: res.data })
                }
            })
        }
    }
    save = (data, action) => {

        data["holidayWeeklyOffOtEnd"] = toUTCCalendarTime(data["holidayWeeklyOffOtEnd"]);
        data["holidayWeeklyOffOtStart"] = toUTCCalendarTime(data["holidayWeeklyOffOtStart"]);

        updateFormat(data).then(res => {
            if (res.status == "OK") {
                this.fetchList();
                toast.success(res.message);
            } else {
                data["holidayWeeklyOffOtEnd"] = toLocalCalendarTime(data["holidayWeeklyOffOtEnd"]);
                data["holidayWeeklyOffOtStart"] = toLocalCalendarTime(data["holidayWeeklyOffOtStart"]);
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.log({ err });
            toast.error("Error while saving format");
            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div className="mt-4 content container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Attendance</h5>
                            </div>
                            <div className="card-body">
                                {verifyOrgLevelViewPermission("Module Setup Manage") &&
                                    <Formik
                                        enableReinitialize={true}
                                        initialValues={this.state.attendanceFormat}
                                        onSubmit={this.save}
                                        validationSchema={FormatSchema}
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
                                                    <div className="col-md-4">
                                                        <FormGroup>
                                                            <label>Flexible Shift Start Time(In Minutes)
                                                                {/* <span style={{ color: "red" }}>*</span> */}
                                                            </label>
                                                            <Field type="number" name="flexibleShiftStart" className="form-control"></Field>
                                                            <ErrorMessage name="flexibleShiftStart">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <FormGroup>
                                                            <label>Flexible Shift End Time(In Minutes)
                                                                {/* <span style={{ color: "red" }}>*</span> */}
                                                            </label>
                                                            <Field type="number" name="flexibleShiftEnd" className="form-control"></Field>
                                                            <ErrorMessage name="flexibleShiftEnd">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>

                                                    <div className="col-md-4">
                                                        <FormGroup>
                                                            <label>Absent After X Min
                                                                {/* <span style={{ color: "red" }}>*</span> */}
                                                            </label>
                                                            <Field type="number" name="absentXMinutes" className="form-control"></Field>
                                                            <ErrorMessage name="absentXMinutes">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div></div>
                                                {/* overtime  */}
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <div type="checkbox" name="overtimeEnable" >
                                                            <label>Enable Overtime</label><br />
                                                            <i className={`fa fa-2x ${this.state.attendanceFormat
                                                                && this.state.attendanceFormat.overtimeEnable
                                                                ? 'fa-toggle-on text-success' :
                                                                'fa fa-toggle-off text-danger'}`}
                                                                onClick={e => {
                                                                    let { attendanceFormat } = this.state;
                                                                    attendanceFormat.overtimeEnable = !attendanceFormat.overtimeEnable;
                                                                    setFieldValue("overtimeEnable", attendanceFormat.overtimeEnable);
                                                                    this.setState({
                                                                        attendanceFormat
                                                                    });
                                                                }}></i>
                                                        </div>
                                                    </FormGroup>
                                                </div>
                                                {/* overtime  */}
                                                <div className="row">
                                                    {values.overtimeEnable &&
                                                        <div className="col-md-4">
                                                            <FormGroup>
                                                                <label>Holiday/Weekly Off OT Start Time
                                                                    <span style={{ color: "red" }}>*</span>
                                                                </label>
                                                                <Field type="time" name="holidayWeeklyOffOtStart" className="form-control" required></Field>
                                                                <ErrorMessage name="holidayWeeklyOffOtStart">
                                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                </ErrorMessage>
                                                            </FormGroup>
                                                        </div>}
                                                    {values.overtimeEnable && <div className="col-md-4">
                                                        <FormGroup>
                                                            <label>Holiday/Weekly Off OT End Time
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field type="time" name="holidayWeeklyOffOtEnd" className="form-control" required></Field>
                                                            <ErrorMessage name="holidayWeeklyOffOtEnd">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>}
                                                </div>

                                                <input type="submit" className="btn btn-primary" value="Save" />
                                            </Form>
                                        )}
                                    </Formik>}
                                {!verifyOrgLevelViewPermission("Module Setup Manage") && <AccessDenied></AccessDenied>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}




