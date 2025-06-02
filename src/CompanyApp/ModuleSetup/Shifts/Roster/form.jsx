import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { saveRoster } from './service';
import { RosterSchema } from './validation';
import WeekOffDropdown from '../../../ModuleSetup/Dropdown/WeekOffDropdown';
import ShiftsDropdown from '../../../ModuleSetup/Dropdown/ShiftsDropdown';
import {toDateWithGMT} from '../../../../utility';


export default class Roster extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Roster: props.Roster || {
                id: 0,
                rostername: "",
                description: "",
                rotationReq: "",
                shiftrepeat: "0",
                weekoffId: 0,
                weekoff: {
                    id: 0
                },
                shiftId: 0,
                shifts: {
                    id: 0
                },
                effectivedate: "",
                enddate: "",
                enddatenever: ""
            }
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.Roster && nextProps.Roster != prevState.Roster) {
            return ({ Roster: nextProps.Roster })
        } else if (!nextProps.Roster) {
            return prevState.Roster || ({
                Roster: {
                    id: 0,
                    rostername: "",
                    description: "",
                    rotationReq: "",
                    shiftrepeat: "0",
                    weekoffId: 0,
                    weekoff: {
                        id: 0
                    },
                    shiftId: 0,
                    shift: {
                        id: 0
                    },
                    effectivedate: "",
                    enddate: "",
                    enddatenever: ""
                }
            })
        }
        return null;
    }

    save = (data, action) => {
        data["weekoffId"] = data["weekoff"]["id"];
        if( data["shifts"] == null){
            data["shiftId"] = 0;
        }else{
            data["shiftId"] = data["shifts"]["id"];
 
        }
        data.enddate = toDateWithGMT(data.enddate)
        data.effectivedate = toDateWithGMT(data.effectivedate)
        action.setSubmitting(true);
        saveRoster(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            if (res.state == "OK") {
                setTimeout(function () {
                    window.location.reload()
                }, 6000)
            }
            action.setSubmitting(false);
        }).catch(err => {
            console.log(err);
            toast.error("Error while saving Roster");
            action.setSubmitting(false);
        })
    }
    render() {
        const { Roster } = this.state;
        Roster.shiftId = Roster.shifts?.id;
        Roster.weekoffId = Roster.weekoff?.id;
        return (
            <div >

                {/* Page Content */}

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.Roster}
                    onSubmit={this.save}
                    validationSchema={RosterSchema}
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
                            <div className="row" style={{ paddingTop: "25px" }}>
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Roster Name
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="rostername" className="form-control" placeholder="General Roster"></Field>
                                        <ErrorMessage name="rostername">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <FormGroup>
                                        <label>Description</label>
                                        <Field name="description" className="form-control" placeholder="General Roster for the week" component="textarea" rows="3"></Field>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Rotation Required
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div className="radio" >
                                            <label>
                                                <input type="radio" value="yes" name="rotationReq"
                                                    checked={values.rotationReq === 'yes'}
                                                    // selected={values.rotationReq == "yes"}
                                                    onChange={e => {
                                                        setFieldValue("rotationReq", e.target.value)
                                                    }}
                                                />&nbsp;Yes
                                            </label>&nbsp;&nbsp;&nbsp;
                                            <label>
                                                <input type="radio"
                                                    value="no" name="rotationReq"
                                                    checked={values.rotationReq === 'no'}
                                                    // selected={values.rotationReq == "no"}
                                                    // defaultValue={values.rotationReq}
                                                    onChange={e => {
                                                        setFieldValue("rotationReq", e.target.value)
                                                    }}
                                                />&nbsp;No
                                            </label>
                                        </div>
                                        <ErrorMessage name="rotationReq">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    {values.rotationReq == 'yes' && <><div className="inline-block-vertical-middle">
                                        <FormGroup>
                                            <label>Shift repetition days
                                                <span style={{ color: "red" }}>*</span>
                                                <span style={{ fontSize: "12px", fontWeight: "bolder" }}>
                                                    (Max. 31 days) </span>
                                            </label>
                                            <Field name="shiftrepeat" className="form-control" placeholder="1"></Field>
                                            <ErrorMessage name="shiftrepeat">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div></>}
                                </div>
                            </div>
                            <div className="row" >
                                {values.rotationReq == 'no' && <><div className="col-md-6">
                                    <FormGroup>
                                        <label>Set Shifts
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="shiftId" render={field => {
                                            return <ShiftsDropdown defaultValue={values.shiftId} onChange={e => {
                                                setFieldValue("shiftId", e.target.value);
                                                setFieldValue("shifts", { id: e.target.value });
                                            }}></ShiftsDropdown>
                                        }}></Field>
                                       
                                        <ErrorMessage name="shiftId">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div></>}
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Set Weekly Off
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="weekoffId" render={field => {
                                            return <WeekOffDropdown defaultValue={values.weekoffId} onChange={e => {
                                                setFieldValue("weekoffId", e.target.value);
                                                setFieldValue("weekoff", { id: e.target.value });
                                            }}></WeekOffDropdown>
                                        }}></Field>
                                        <ErrorMessage name="weekoffId">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row" >
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Effective Date
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="effectivedate" className="form-control" type="date"></Field>
                                        <ErrorMessage name="effectivedate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row" >
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>End Date
                                            {values.enddatenever == "yes" && <><span style={{ color: "red" }}>*</span></>}
                                        </label>
                                        <Field name="enddate" className="form-control" type="date"></Field>
                                        <ErrorMessage name="enddate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <label>Roster Ends
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <div className="radio" style={{ paddingTop: "10px" }} >
                                        <label>
                                            <input type="radio" value="yes" name="enddatenever"
                                                checked={values.enddatenever === "yes"}
                                                onChange={e => {
                                                    setFieldValue("enddatenever", e.target.value)
                                                }}
                                            />&nbsp;Yes
                                        </label>&nbsp;&nbsp;&nbsp;
                                        <label>
                                            <input type="radio"
                                                value="no" name="enddatenever"
                                                checked={values.enddatenever === "no"}
                                                onChange={e => {
                                                    setFieldValue("enddatenever", e.target.value)
                                                }}
                                            />&nbsp;No
                                        </label>
                                    </div>
                                    <ErrorMessage name="enddatenever">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </div>
                            </div>
                            < div  >
                                <input type="submit" className="btn btn-primary" value={this.state.Roster.id > 0 ? "Update" : "Create"} /> </div>

                        </Form>
                    )
                    }
                </Formik>
            </div>


        )
    }
}
