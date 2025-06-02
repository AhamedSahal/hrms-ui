import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getUserType, toUTCCalendarTime,verifyApprovalPermission, getPermission,convertToUTC, toDateWithGMT } from '../../utility';
import EmployeeDropdown from '../ModuleSetup/Dropdown/EmployeeDropdown';
import { saveAttendance } from './service';
import { attendanceByAdminSchema } from './validation';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';

export default class AttendanceForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            attendance: props.attendance || {
               employeeId:'',
               date:'',
               inTiming :'',
               outTiming:'',
            }
        }
    }
    save = (data, action) => {
        data["date"] = new Date(toDateWithGMT(data["date"])); 
        data["inTiming"] = toDateWithGMT(convertToUTC(data["inTiming"]));
        data["outTiming"] = toDateWithGMT(convertToUTC(data["outTiming"]));
        action.setSubmitting(true);
        saveAttendance(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.error(err);
            toast.error("Error while saving attendance");

            action.setSubmitting(false);
        })
    }
    handleYearInput = (event) => {
        const value = event.target.value;
        const match = value.match(/^(\d{4})(\d*)(-\d{2}-\d{2}T\d{2}:\d{2})$/);
        if (match) {
          const year = match[1];
          if (match[2].length > 0) {
            event.target.value = `${year}${match[3]}`;
          }
        }
      };
    render() {
        const { attendance } = this.state;
        const currentDate = new Date().toISOString().split('T')[0];
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={attendance}
                    onSubmit={this.save}
                    validationSchema={attendanceByAdminSchema}
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
                        <Form>

                            {verifyApprovalPermission("ATTENDANCE") &&
                                <FormGroup>
                                    <label>Employee
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="employeeId" render={field => {
                                        return <EmployeeDropdown permission={getPermission("ATTENDANCE","EDIT")}  onChange={e => {
                                            setFieldValue("employeeId", e.target.value);
                                        }}></EmployeeDropdown>
                                    }}></Field>
                                </FormGroup>}
                            <ErrorMessage name="employeeId">
                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                            </ErrorMessage>
                            <FormGroup>
                                <label>Date
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="date" type="date"  max={currentDate} className="form-control"></Field>
                                <ErrorMessage name="date">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>In Time
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="inTiming">{({ field }) => ( <input {...field} type="datetime-local" className="form-control" onInput={this.handleYearInput} /> )}</Field>
                                <ErrorMessage name="inTiming">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Out Time
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="outTiming">{({ field }) => ( <input {...field} type="datetime-local"   min={values.inTiming}className="form-control" onInput={this.handleYearInput} /> )}</Field>
                                <ErrorMessage name="outTiming">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value="Save" />

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
