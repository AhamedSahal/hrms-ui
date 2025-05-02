import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getUserType, getEmployeeId, getPermission, verifyApprovalPermission } from '../../../../utility';
import { differenceInDays } from 'date-fns'
import { NewPermissionSchema } from './validation'
import EmployeeDropdown from '../../../ModuleSetup/Dropdown/EmployeeDropdown';
import PermissionTypeDropdown from '../../../ModuleSetup/Dropdown/PermissionDropdown';
import { DatePicker } from 'antd';
import moment from 'moment';
import { LightTooltip } from '../../../ModuleSetup/RequestPermission/tootip';
import { IconButton } from '@mui/material';

const { RangePicker } = DatePicker;

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';



export default class PermissionForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            daysBetween: 0,
            permission: props.permission || {
                id: 0,
                employeeId: props.employeeId || getEmployeeId(),
                employee: { id: props.employeeId || getEmployeeId() },
                permissionType: '',
                startDate: '',
                endDate: '',
                startTime: '',
                endTime: '',
                reason: '',
                attachment: '',


            }
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.permission && nextProps.permission != prevState.permission) {
            return ({ permission: nextProps.permission })
        } else if (!nextProps.permission) {
            return ({
                permission: {
                    id: 0,
                    employeeId: nextProps.employeeId || getEmployeeId(),
                    employee: { id: nextProps.employeeId || getEmployeeId() },
                    permissionType: '',
                    startDate: '',
                    endDate: '',
                    hours: '0',
                    minutes: '0',
                    startTime: '',
                    endTime: '',
                    reason: '',
                    attachment: '',

                }
            })
        }

        return null;
    }
    selectedDays(startDate, endDate) {
        if (startDate && endDate) {
            const start = moment(startDate, 'DD/MM/YYYY');
            const end = moment(endDate, 'DD/MM/YYYY');
            return end.diff(start, 'days') + 1;
        }
        return 0;
    }

    selectedTime = (startTime, endTime) => {
        if (startTime && endTime) {
            const start = new Date(`1970-01-01T${startTime}:00`);
            const end = new Date(`1970-01-01T${endTime}:00`);
            const diff = (end - start) / (1000 * 60 * 60);
            return diff > 0 ? diff : 0;
        }
        return 0;
    };
    save = (data, action) => {
        action.setSubmitting(true);
        // saveReqPermission(permissionData).then(res => {
        //     if (res.status == "OK") {
        //         toast.success(res.message);
        //         this.props.showAlert('submit');
        //         this.props.updateList(res.data);
        //     } else {
        //         toast.error(res.message);
        //     }
        //     action.setSubmitting(false)
        // }).catch(err => {
        //     console.error(err);
        //     toast.error("Error while applying Permission");
        //     action.setSubmitting(false);
        // })
    }



    render() {
        const { permission } = this.state;
        const myPermission = this.props.myPermission || false
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={permission}
                    onSubmit={this.save}
                    validationSchema={NewPermissionSchema}
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
                    }) => {
                        const daysDifference = this.selectedDays(values.startDate, values.endDate);
                        const timeDifference = this.selectedTime(values.startTime, values.endTime);

                        return (
                            <Form autoComplete='off'>
                                {!myPermission && <FormGroup>
                                    <label>Employee
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="employeeId" render={field => {
                                        return <EmployeeDropdown defaultValue={values.employee?.id} onChange={e => {
                                            setFieldValue("employeeId", e.target.value);
                                            setFieldValue("employee", { id: e.target.value });
                                        }}></EmployeeDropdown>
                                    }}></Field>
                                    <ErrorMessage name="employeeId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>}
                                <FormGroup>
                                    <label>Permission Type
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="permissionType" render={({ field }) => (
                                        <select
                                            defaultValue={values.permissionType}
                                            onChange={(e) => setFieldValue('permissionType', e.target.value)}
                                            className="form-control"
                                        >
                                            <option value="">Select Permission Type</option>
                                            <option value="1">Late Arrival</option>
                                            <option value="2">Early Exit</option>
                                            <option value="3">Early In & Early Out</option>
                                            <option value="4">Flexible Hours</option>
                                        </select>
                                    )} />
                                    <ErrorMessage name="permissionType">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>

                                <div className='d-flex'>

                                    <FormGroup className='ml-0 pl-0 mr-0 pr-0 col'>
                                        <label>
                                            Date
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <LightTooltip title="Click to choose the start and end dates. For a single-day request, click the same date twice to set both start and end dates" placement="top" style={{ margin: "-10px" }}>
                                            <i style={{ cursor: 'pointer', color: "#1DA8D5", float: 'right', marginTop: '12px' }} className="fa fa-question-circle" aria-hidden="true"></i>
                                        </LightTooltip>

                                        <RangePicker format="DD/MM/YYYY" onChange={(dates, dateStrings) => {
                                            if (dates) {
                                                setFieldValue('startDate', dateStrings[0]);
                                                setFieldValue('endDate', dateStrings[1]);
                                            } else {
                                                setFieldValue('startDate', '');
                                                setFieldValue('endDate', '');
                                            }
                                        }} className="form-control" />

                                        <ErrorMessage name='startDate'>
                                            {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>

                                </div>
                                {daysDifference > 0 &&
                                    <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "10px" }}>
                                        <h5 style={{ color: "#3498db" }}>Selected Days : <span style={{ color: "black" }}><b>{daysDifference}</b></span></h5>

                                    </div>
                                }
                                <div className='d-flex'>
                                    {values.permissionType === '4' ?
                                        <>
                                            <FormGroup className='ml-0 pl-0 col-md-6'>
                                                <label>Enter Hours
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field type="number" name="hours" className="form-control"></Field>
                                                <ErrorMessage name="hours">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                            <FormGroup className='ml-0 pl-0 col-md-6'>
                                                <label>Enter Minutes
                                                <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field type="number" name="minutes" className="form-control"></Field>
                                                <ErrorMessage name="minutes">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </> :
                                        <>
                                            {(values.permissionType === '1' || values.permissionType === '3') && <FormGroup className='ml-0 pl-0 col-md-6'>
                                                <label>Request Clock-in Time
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field style={{ lineHeight: 'normal', padding: '0.5em' }} name="startTime" type="time" className="form-control" />
                                                <ErrorMessage name="startTime">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>}
                                            {(values.permissionType === '2' || values.permissionType === '3') && <FormGroup className='mr-0 pl-0 pr-0 col-md-6'>
                                                <label>Request Clock-out Time
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field style={{ lineHeight: 'normal', padding: '0.5em' }} name="endTime" type="time" className="form-control" />
                                                <ErrorMessage name="endTime">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>}
                                        </>}
                                </div>
                                {timeDifference > 0 &&
                                    <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "10px" }}>
                                        <h5 style={{ color: "#3498db" }}>Selected Hours : <span style={{ color: "black" }}><b>{timeDifference.toFixed(2)}</b></span></h5>

                                    </div>
                                }
                                <FormGroup>
                                    <label>Reason For Request<span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="reason" defaultValue={values.reason} className="form-control" ></Field>
                                    <ErrorMessage name="reason">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup>
                                    <label>Attachments
                                    </label>
                                    <input name="file" type="file" className="form-control" onChange={e => {
                                        setFieldValue('file', e.currentTarget.files[0]);
                                    }}></input>
                                    <ErrorMessage name="file">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <input type="submit" className="btn btn-primary" value={this.state.permission.id > 0 ? "Update" : "Apply"} />
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        )
    }
}
