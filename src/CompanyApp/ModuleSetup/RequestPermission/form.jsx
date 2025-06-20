import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { savePermissionType } from './service';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { IconButton, styled } from '@mui/material';
import { PermissionTypeSchema } from './validation';
import { LightTooltip } from './tootip';


export default class AttendancePermissionForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            permissionType: props.permissionType || {
                id: 0,
                name: "",
                permissionCriteria: '1',
                lateClockIn: true,
                earlyClockIn: false,
                earlyClockOut: false,
                totalAllowedTime: '0',
                minReq: '0',
                maxReq: '0',
                allowedReq: '0',
                applicablePeriod: 'Weekly',
                isEnableReqLimit: false,
                generalShift: false,
                restrictShiftHour: false,

            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.permissionType && nextProps.permissionType != prevState.permissionType) {
            return ({ permissionType: nextProps.permissionType })
        } else if (!nextProps.permissionType) {

            return prevState.permissionType || ({
                permissionType: {
                    id: 0,
                    name: "",
                    permissionCriteria: '1',
                    lateClockIn: false,
                    earlyClockIn: false,
                    earlyClockOut: false,

                    totalAllowedTime: '0',
                    minReq: '0',
                    maxReq: '0',
                    allowedReq: '0',
                    applicablePeriod: '0',
                    isEnableReqLimit: false,
                    generalShift: false,
                    restrictShiftHour: false,
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        // action.setSubmitting(true);
        // savePermissionType(data).then(res => {
        //     if (res.status == "OK") {
        //         toast.success(res.message);
        //         this.props.updateList(res.data);
        //     } else {
        //         toast.error(res.message);
        //     }
        //     action.setSubmitting(false)
        // }).catch(err => {
        //     toast.error("Error while saving Permission Type");
        //     action.setSubmitting(false);
        // })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.permissionType}
                    onSubmit={this.save}
                    // validationSchema={PermissionTypeSchema}
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
                            <FormGroup>
                                <label>Permission Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <span className='permissionFormTitle'>Permission Criteria:</span>
                            <div className="row mt-1">
                                <FormGroup className="col">
                                    <label className="question-radio ">
                                        <Field type="radio" name="permissionCriteria" onClick={() => setFieldValue("isEnableReqLimit", false)} value="1" className="mr-1 mt-1" />
                                        <span className="checkmark" />
                                        Unlimited Requests
                                        <LightTooltip title="Employees can request permissions an unlimited number of times, with no restrictions on total hours or number of requests. Permissions are approved based on the discretion of the manager or HR" placement="top" style={{ margin: "-10px" }}>
                                            <IconButton>
                                                <BsFillInfoCircleFill className='ml-2' size={16} style={{ color: "#1DA8D5" }} />
                                            </IconButton>
                                        </LightTooltip>
                                    </label>
                                </FormGroup>
                                <FormGroup className="col-md-auto">
                                    <label className="question-radio ">
                                        <Field type="radio" name="permissionCriteria" onClick={() => setFieldValue("isEnableReqLimit", true)} value="2" className="mr-1 mt-1" />
                                        <span className="checkmark" />
                                        Number of Requests
                                        <LightTooltip title="Employees can request permission a limited number of times per week or month. Once the cap is reached, additional requests are not allowed unless approved by HR" placement="top" style={{ margin: "-10px" }}>
                                            <IconButton>
                                                <BsFillInfoCircleFill className='ml-2' size={16} style={{ color: "#1DA8D5" }} />
                                            </IconButton>
                                        </LightTooltip>
                                    </label>
                                </FormGroup>
                                <FormGroup className="col">
                                    <label className="question-radio ">
                                        <Field type="radio" name="permissionCriteria" value="3" onClick={() => setFieldValue("isEnableReqLimit", false)} className="mr-1 mt-1" />
                                        <span className="checkmark" />
                                        Allocated Hours
                                        <LightTooltip title="Permissions are based on a fixed number of hours allocated per week or month. Employees can request within the allowed hours, with restrictions on minimum and maximum time per request, as well as total number of allowed requests." placement="top" style={{ margin: "-10px" }}>
                                            <IconButton>
                                                <BsFillInfoCircleFill className='ml-2' size={16} style={{ color: "#1DA8D5" }} />
                                            </IconButton>
                                        </LightTooltip>
                                    </label>
                                </FormGroup>
                            </div>
                            {values.permissionCriteria === '3' && <div className='row'>
                                <FormGroup className='col-md-4'>
                                    <label>Total Allowed Time
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field type="number" name="totalAllowedTime" className="form-control"></Field>
                                    <ErrorMessage name="totalAllowedTime">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className='col-md-4'>
                                    <label>Min Time Per Request
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field type="number" name="minReq" className="form-control"></Field>
                                    <ErrorMessage name="minReq">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className='col-md-4'>
                                    <label>Max Time Per Request
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field type="number" name="maxReq" className="form-control"></Field>
                                    <ErrorMessage name="maxReq">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>}

                            <>
                                <span className='permissionFormTitle'>Shift-Based Rules:</span>
                                <div className="row mt-1">
                                    <div className="col-md-4">
                                        <FormGroup>
                                            <div type="checkbox" name="generalShift"  >
                                                <label>Apply General Shift
                                                    <LightTooltip title="Ignore the roster and applies the system-defined general shift for this employee." placement="top" style={{ margin: "-10px" }}>
                                                        <IconButton>
                                                            <BsFillInfoCircleFill className='ml-2' size={16} style={{ color: "#1DA8D5" }} />
                                                        </IconButton>
                                                    </LightTooltip>
                                                </label><br />
                                                <i onClick={e => {
                                                    let { permissionType } = this.state;
                                                    permissionType.generalShift = !permissionType.generalShift;
                                                    setFieldValue("generalShift", permissionType.generalShift);
                                                    this.setState({
                                                        permissionType
                                                    });
                                                }} className={`fa fa-2x ${this.state.permissionType
                                                    && this.state.permissionType.generalShift
                                                    ? 'fa-toggle-on text-success' :
                                                    'fa fa-toggle-off text-danger'}`}></i>
                                            </div>

                                        </FormGroup>
                                    </div> <div className="col-md-4">
                                        <FormGroup>
                                            <div type="checkbox" name="restrictShiftHour" onClick={e => {
                                                let { permissionType } = this.state;
                                                permissionType.restrictShiftHour = !permissionType.accrual;
                                                setFieldValue("accrual", permissionType.restrictShiftHour);
                                                this.setState({
                                                    permissionType
                                                });
                                            }} >
                                                <label>Restrict to Shift Hours
                                                    <LightTooltip title="Ensure that the permission request is valid only within the employee's assigned shift hours, whether it's a general or custom shift." placement="top" style={{ margin: "-10px" }}>
                                                        <IconButton>
                                                            <BsFillInfoCircleFill className='ml-2' size={16} style={{ color: "#1DA8D5" }} />
                                                        </IconButton>
                                                    </LightTooltip>
                                                </label><br />
                                                <i className={`fa fa-2x ${this.state.permissionType
                                                    && this.state.permissionType.restrictShiftHour
                                                    ? 'fa-toggle-on text-success' :
                                                    'fa fa-toggle-off text-danger'}`}></i>
                                            </div>
                                        </FormGroup>
                                    </div>
                                </div>
                            </>

                            <span className='permissionFormTitle'>Request Type:</span>
                            <div className="row mt-1">
                                <div className="col-md-4">
                                    <FormGroup>
                                        <div type="checkbox" name="lateClockIn" onClick={e => {
                                            let { permissionType } = this.state;
                                            permissionType.lateClockIn = !permissionType.lateClockIn;
                                            setFieldValue("lateClockIn", permissionType.lateClockIn);
                                            this.setState({
                                                permissionType
                                            });
                                        }} >
                                            <label>Late Clock-In</label><br />
                                            <i className={`fa fa-2x ${this.state.permissionType
                                                && this.state.permissionType.lateClockIn
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`}></i>
                                        </div>

                                    </FormGroup>
                                </div>
                                <div className="col-md-4">
                                    <FormGroup>
                                        <div type="checkbox" name="earlyClockIn" onClick={e => {
                                            let { permissionType } = this.state;
                                            permissionType.earlyClockIn = !permissionType.earlyClockIn;
                                            setFieldValue("earlyClockIn", permissionType.earlyClockIn);
                                            this.setState({
                                                permissionType
                                            });
                                        }} >
                                            <label>Early Clock-In</label><br />
                                            <i className={`fa fa-2x ${this.state.permissionType
                                                && this.state.permissionType.earlyClockIn
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`}></i>
                                        </div>
                                    </FormGroup>
                                </div>
                                <div className="col-md-4">
                                    <FormGroup>
                                        <div type="checkbox" name="earlyClockOut" onClick={e => {
                                            let { permissionType } = this.state;
                                            permissionType.earlyClockOut = !permissionType.earlyClockOut;
                                            setFieldValue("earlyClockOut", permissionType.earlyClockOut);
                                            this.setState({
                                                permissionType
                                            });
                                        }} >
                                            <label>Early Clock-Out</label><br />
                                            <i  className={`fa fa-2x ${this.state.permissionType
                                                && this.state.permissionType.earlyClockOut
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`}></i>
                                        </div>
                                    </FormGroup>
                                </div>

                                <ErrorMessage name="permissionType">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </div>



                            {values.permissionCriteria !== '1' && <div className='row'>
                                <FormGroup className='col-md-6'>
                                    <div type="checkbox" name="isEnableReqLimit" onClick={e => {
                                        let { permissionType } = this.state;
                                        permissionType.isEnableReqLimit = !permissionType.isEnableReqLimit;
                                        setFieldValue("isEnableReqLimit", permissionType.isEnableReqLimit);
                                        this.setState({
                                            permissionType
                                        });
                                    }} >
                                        <label>Enable Request Limit
                                            <LightTooltip title="When enabled, this option sets a cap on the number of requests an employee can make within the defined period, in addition to limiting the total number of hours." placement="top" style={{ margin: "-10px" }}>
                                                <IconButton>
                                                    <BsFillInfoCircleFill className='ml-2' size={16} style={{ color: "#1DA8D5" }} />
                                                </IconButton>
                                            </LightTooltip>
                                        </label><br />
                                        <i className={`fa fa-2x ${this.state.permissionType
                                            && (this.state.permissionType.isEnableReqLimit || values.permissionCriteria == '2')
                                            ? 'fa-toggle-on text-success' :
                                            'fa fa-toggle-off text-danger'}`} ></i>
                                    </div>
                                </FormGroup>
                                {values.isEnableReqLimit  && <FormGroup className='col-md-6'>
                                    <label>Number of Allowed Requests
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field type="number" name="allowedReq" className="form-control"></Field>
                                    <ErrorMessage name="allowedReq">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>}
                            </div>}
                            {values.permissionCriteria !== '1' && <>
                                <span className='permissionFormTitle'>Applicable Period:</span>
                                <div className="row mt-1">
                                    <div className="col-md-4">
                                        <label className="question-radio">
                                            <Field type="radio" name="applicablePeriod" value='Weekly' className="mr-1" />
                                            <span className="checkmark" />
                                            Week
                                        </label>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="question-radio ">
                                            <Field type="radio" name="applicablePeriod" value='Monthly' className="mr-1" />
                                            <span className="checkmark" />
                                            Month
                                        </label>
                                    </div>
                                </div>
                            </>}


                            <input type="submit" className="mt-3 btn btn-primary" value={this.state.permissionType.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
