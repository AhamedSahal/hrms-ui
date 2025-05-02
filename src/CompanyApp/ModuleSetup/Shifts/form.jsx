import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { convertToUTC, toUTCCalendarTime } from '../../../utility';
import { saveShifts } from './service';
import { ShiftsSchema } from './validation';
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { BsFillInfoCircleFill } from "react-icons/bs";


const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#fff',
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 14,
        width: "auto",
        height: "auto",
        padding: "5px",
        border: "1px solid black"
    },
}));


export default class Shifts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shifts: props.shifts || {
                id: 0,
                shiftname: "",
                shiftcodename: "",
                description: "",
                shiftstarttime: "",
                shiftendtime: "",
                breaktime: 0,
                noShift: false,
                totalhoursfulldaypresentinhours: 0,
                totalhoursfulldaypresentinmins: 0,
                totalfulldayflexiblehours: 0,
                totalhourshalfdaypresentinhours: 0,
                totalhourshalfdaypresentinmins: 0,
                totalhalfdayflexiblehours: 0
            }
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.shifts && nextProps.shifts != prevState.shifts) {
            return ({ shifts: nextProps.shifts })
        } else if (!nextProps.shifts) {
            return prevState.shifts || ({
                shifts: {
                    id: 0,
                    shiftname: "",
                    shiftcodename: "",
                    description: "",
                    shiftstarttime: "",
                    shiftendtime: "",
                    breaktime: 0,
                    noShift: false,
                    totalhoursfulldaypresentinhours: 0,
                    totalhoursfulldaypresentinmins: 0,
                    totalfulldayflexiblehours: 0,
                    totalhourshalfdaypresentinhours: 0,
                    totalhourshalfdaypresentinmins: 0,
                    totalhalfdayflexiblehours: 0
                }
            })
        }
        return null;
    }
    updateTime = () => {
        let currentTime = new Date();
        let currentTimeMillis = currentTime.getTime();
        let currentUTCTime = currentTime.toUTCString();
        let hour = currentTime.getUTCHours();

    }

    save = (data, action) => {
        let tmpData = {};
        tmpData.id = data.id;
        if (data.noShift == false) {
            tmpData.shiftstarttime = toUTCCalendarTime(data.shiftstarttime);
            tmpData.shiftendtime = toUTCCalendarTime(data.shiftendtime);
            tmpData.breaktime = data.breaktime;
        }
        tmpData.description = data.description;
        tmpData.shiftcodename = data.shiftcodename;
        tmpData.shiftname = data.shiftname;
        tmpData.noShift = data.noShift;
        tmpData.totalhoursfulldaypresentinhours = data.totalhoursfulldaypresentinhours;
        tmpData.totalhoursfulldaypresentinmins = data.totalhoursfulldaypresentinmins;
        tmpData.totalfulldayflexiblehours = data.totalfulldayflexiblehours;
        tmpData.totalhourshalfdaypresentinhours = data.totalhourshalfdaypresentinhours;
        tmpData.totalhourshalfdaypresentinmins = data.totalhourshalfdaypresentinmins;
        tmpData.totalhalfdayflexiblehours = data.totalhalfdayflexiblehours;
        action.setSubmitting(true);
        console.log(tmpData);
        saveShifts(tmpData).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Shifts");
            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div >

                {/* Page Content */}

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.shifts}
                    onSubmit={this.save}
                    validationSchema={ShiftsSchema}
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
                            <div className="row" style={{ paddingTop: "25px" }} >
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Shift Name
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="shiftname" className="form-control" placeholder="Shift Name"></Field>
                                        <ErrorMessage name="shiftname">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Shift Code Name
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="shiftcodename" className="form-control" placeholder="Shift Code Name"></Field>
                                        <ErrorMessage name="shiftcodename">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row" >
                                <div className="col-md-12">
                                    <FormGroup>
                                        <label>Description</label>
                                        <Field name="description" className="form-control" placeholder="Description" component="textarea" rows="3"></Field>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row" >
                                <div className="col-md-4">
                                    <FormGroup>
                                        <div type="checkbox" name="noShift" onClick={e => {
                                            let { shifts } = this.state;
                                            shifts.noShift = !shifts.noShift;
                                            setFieldValue("noShift", shifts.noShift);
                                            this.setState({
                                                shifts
                                            });
                                        }} >
                                            <label>Enable No Shift</label><br />
                                            <i className={`fa fa-2x ${this.state.shifts
                                                && this.state.shifts.noShift
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`}></i>
                                        </div>
                                    </FormGroup>
                                </div>
                            </div>

                            {!values.noShift && <div className="row">
                                <div className="col-md-4">
                                    <FormGroup>
                                        <label>Shift Start Time
                                            <span style={{ color: "red" }}>*</span>
                                        </label> &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Field type="time" name="shiftstarttime" placeholder="Select time" className="form-control"></Field>
                                        <ErrorMessage name="shiftstarttime">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-4">
                                    <FormGroup>
                                        <label>Shift End Time
                                            <span style={{ color: "red" }}>*</span>
                                        </label>&nbsp;&nbsp;&nbsp;&nbsp;
                                        <Field type="time" name="shiftendtime" placeholder="Select time" className="form-control"></Field>
                                        <ErrorMessage name="shiftendtime">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-4">
                                    <FormGroup>
                                        <label>Break Time (In Minutes)</label>
                                        <Field name="breaktime" className="form-control" placeholder="Break Time(In Minutes)" />
                                    </FormGroup>
                                </div>
                            </div>}
                            {values.noShift && <div className="row">
                                <div className="col-md-4">
                                    <FormGroup>
                                        <label>Total Hours
                                            <span style={{ color: "red" }}>*</span>
                                            <span style={{ paddingLeft: "5px" }}>
                                                <>
                                                    <LightTooltip title="Full Day Present" placement="top" style={{ margin: "-10px" }}>
                                                        <IconButton>
                                                            <BsFillInfoCircleFill size={20} style={{ color: "#1DA8D5" }} />
                                                        </IconButton>
                                                    </LightTooltip>
                                                </>
                                            </span>
                                        </label> &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Field type="number" name="totalhoursfulldaypresentinhours" placeholder="Enter Total Hours" className="form-control"></Field>
                                        <ErrorMessage name="totalhoursfulldaypresentinhours">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-4">
                                    <FormGroup>
                                        <label>Total Mins
                                            <span style={{ color: "red" }}>*</span>
                                            <span style={{ paddingLeft: "5px" }}>
                                                <>
                                                    <LightTooltip title="Full Day Present" placement="top" style={{ margin: "-10px" }}>
                                                        <IconButton>
                                                            <BsFillInfoCircleFill size={20} style={{ color: "#1DA8D5" }} />
                                                        </IconButton>
                                                    </LightTooltip>
                                                </>
                                            </span>
                                        </label> &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Field type="number" name="totalhoursfulldaypresentinmins" placeholder="Enter Total Mins" className="form-control"></Field>
                                        <ErrorMessage name="totalhoursfulldaypresentinmins">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-4">
                                    <FormGroup>
                                        <label>Flexible Mins
                                            <span style={{ color: "red" }}>*</span>
                                            <span style={{ paddingLeft: "5px" }}>
                                                <>
                                                    <LightTooltip title="Full Day Present" placement="top" style={{ margin: "-10px" }}>
                                                        <IconButton>
                                                            <BsFillInfoCircleFill size={20} style={{ color: "#1DA8D5" }} />
                                                        </IconButton>
                                                    </LightTooltip>
                                                </>
                                            </span>
                                        </label> &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Field type="number" name="totalfulldayflexiblehours" placeholder="Enter Flexible Mins" className="form-control"></Field>
                                        <ErrorMessage name="totalfulldayflexiblehours">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-4">
                                    <FormGroup>
                                        <label>Total Hours
                                            <span style={{ color: "red" }}>*</span>
                                            <span style={{ paddingLeft: "5px" }}>
                                                <>
                                                    <LightTooltip title="Half Day Present" placement="top" style={{ margin: "-10px" }}>
                                                        <IconButton>
                                                            <BsFillInfoCircleFill size={20} style={{ color: "#1DA8D5" }} />
                                                        </IconButton>
                                                    </LightTooltip>
                                                </>
                                            </span>
                                        </label> &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Field type="number" name="totalhourshalfdaypresentinhours" placeholder="Enter Total Hours" className="form-control"></Field>
                                        <ErrorMessage name="totalhourshalfdaypresentinhours">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-4">
                                    <FormGroup>
                                        <label>Total Mins
                                            <span style={{ color: "red" }}>*</span>
                                            <span style={{ paddingLeft: "5px" }}>
                                                <>
                                                    <LightTooltip title="Half Day Present" placement="top" style={{ margin: "-10px" }}>
                                                        <IconButton>
                                                            <BsFillInfoCircleFill size={20} style={{ color: "#1DA8D5" }} />
                                                        </IconButton>
                                                    </LightTooltip>
                                                </>
                                            </span>
                                        </label> &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Field type="number" name="totalhourshalfdaypresentinmins" placeholder="Enter Total Mins" className="form-control"></Field>
                                        <ErrorMessage name="totalhourshalfdaypresentinmins">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-4">
                                    <FormGroup>
                                        <label>Flexible Mins
                                            <span style={{ color: "red" }}>*</span>
                                            <span style={{ paddingLeft: "5px" }}>
                                                <>
                                                    <LightTooltip title="Half Day Present" placement="top" style={{ margin: "-10px" }}>
                                                        <IconButton>
                                                            <BsFillInfoCircleFill size={20} style={{ color: "#1DA8D5" }} />
                                                        </IconButton>
                                                    </LightTooltip>
                                                </>
                                            </span>
                                        </label> &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Field type="number" name="totalhalfdayflexiblehours" placeholder="Enter Flexible Mins" className="form-control"></Field>
                                        <ErrorMessage name="totalhalfdayflexiblehours">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>}
                            < div>
                                <input type="submit" className="btn btn-primary" value={this.state.shifts.id > 0 ? "Update" : "Create"} /> </div>

                        </Form>
                    )
                    }
                </Formik>
            </div>


        )
    }
}
