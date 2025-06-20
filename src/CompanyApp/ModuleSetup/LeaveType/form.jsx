import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveLeaveType } from './service';
import { LeaveTypeSchema } from './validation';
import { Tooltip } from 'antd';


export default class LeaveTypeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            locationId: props.locationId || 0,
            locationName: props.locationName || "",
            leaveType: props.leaveType || {
                id: 0,
                title: "",
                days: 1,
                paid: true,
                accrual: true,
                encashment: true,
                attachmentRequired: true,
                applicableGender: null,
                branchId: props.locationId,
                showOnApp: false,
	            showOnDashboard: true,
                carryForward: false,
                carrymaxLimit: 0,
                carryexpiryDate: "",
                entOpeningDate: "",
                negativeBalance: false,
                estimateLeaveBalance: false,
                futureYearLeave: false,
                futureexpiryDate: "",
                negativebalmaxLimit: 0,
                entStartMode:0,
                futureOpeningMonth: "",
                carryexpirymonth: "",
		        halfDay: true,
                active: true,
                mobileDefaultLeave: false,
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.leaveType && nextProps.leaveType != prevState.leaveType) {
            return ({ leaveType: nextProps.leaveType })
        } else if (!nextProps.leaveType) {

            return prevState.leaveType || ({
                leaveType: {
                    id: 0,
                    title: "",
                    days: 1,
                    paid: true,
                    accrual: true,
                    encashment: true,
                    attachmentRequired: true,
                    applicableGender: null,
                    branchId: prevState.locationId,
                    showOnDashboard: true,
                    showOnApp: false,
                    carryForward: false,
                    carrymaxLimit: 0,
                    carryexpiryDate: "",
                    entOpeningDate: "",
                    negativeBalance: false,
                    estimateLeaveBalance: false,
                    futureYearLeave: false,
                    futureexpiryDate: "",
                    negativebalmaxLimit: 0,
                    entStartMode:0,
                    futureOpeningMonth: "",
                    carryexpirymonth: "",
		            halfDay: true,
                    mobileDefaultLeave: false,
                }
            })
        }
        return null;
    }
    componentDidMount () {
        if(this.props.LeaveType != undefined){
         
            this.setState({isactive: this.props.LeaveType.isactive})
        }
    }
    save = (data, action) => {
        console.log("cell --- data", data);
        
        action.setSubmitting(true);
        saveLeaveType(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Leave Type");
            action.setSubmitting(false);
        })
    }

    

    render() { 
        const {active} = this.state.leaveType;
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.leaveType}
                    onSubmit={this.save}
                    validationSchema={LeaveTypeSchema}
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
                            <div className="row">
                            <div className="col-6">
                            <FormGroup>
                                <label>Location
                                </label><p>
                                    <span style={{ fontWeight: 'bold' }}>{this.state.locationName}</span></p>

                            </FormGroup></div>
                            <div className="col-6">
                            <FormGroup>
                                <label></label>
                                <div onClick={e => {  
                                    let { leaveType } = this.state;
                                    leaveType.active = !leaveType.active;
                                    setFieldValue("active", leaveType.active);
                                    this.setState({
                                        active

                                    });
                                    }} className="toggles-btn-view" id="button-container">

                                    <div id="my-button" className="toggle-button-element" style={{ transform: active ? 'translateX(0px)' : 'translateX(80px)' }}>
                                        <p className='m-0 self-btn'>{active ? 'Active' : 'Inactive'}</p>

                                    </div>
                                    <p className='m-0 team-btn' style={{ transform: active ? 'translateX(-10px)' : 'translateX(-80px)' }}>{active ? 'Inactive' : 'Active'}</p>
                                    </div>
                                
                                    
                                </FormGroup>
                            </div></div>
                            <FormGroup>
                                <label>Title
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="title" className="form-control"></Field>
                                <ErrorMessage name="title">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <div className="row">
                                <div className="col-md-6">
                            <FormGroup>
                                <label>Days
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="days" className="form-control" type="number" min="1"></Field>
                                <ErrorMessage name="days">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            </div> <div className="col-md-6">
                            <FormGroup>
                                <label>Applicable To</label>
                                <select id="applicableGender" disabled={this.state.leaveType.id > 0} className="form-control" name="applicableGender"
                                    onChange={e => {
                                        setFieldValue("applicableGender", e.target.value)
                                    }}>
                                    <option value="">Select Applicable To</option>
                                    <option selected={this.state.leaveType && this.state.leaveType.applicableGender == 0} value="0">Male</option>
                                    <option selected={this.state.leaveType && this.state.leaveType.applicableGender == 1} value="1">Female</option>
                                    <option selected={this.state.leaveType && this.state.leaveType.applicableGender != 0 && this.state.leaveType.applicableGender != 1} value="2">All</option>
                                </select>
                            </FormGroup>
                            </div></div>
                            <div className="row">
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Leave Cycle
                                        <span style={{ color: "red" }}>*</span>
                                        <span style={{ paddingLeft: "5px" }}>
                                        <>
                                        <Tooltip title="Set the month to begin the leave calendar, or choose ‘Work Anniversary’ to align with each employee’s joining date.">
                                        <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
                                        </Tooltip><br />
                                        </></span>
                                    </label>
                                    <select id="entStartMode" disabled={this.state.leaveType.id > 0} className="form-control" name="entStartMode"
                                    onChange={e => {
                                        setFieldValue("entStartMode", e.target.value)
                                    }} required>
                                    <option value="">Select Leave Cycle</option>
                                    <option selected={this.state.leaveType && this.state.leaveType.entStartMode == 0} value="0" title="Leave period is from Date of Joining to 31st December in the first year, then January to December in following years.">
                                    Calendar</option>
                                    <option selected={this.state.leaveType && this.state.leaveType.entStartMode == 1} value="1" title="Entitlement period is from Date of Joining each year to the same date the next year, repeating annually.">Work Anniversary</option>
                                </select>
                                </FormGroup>
                            </div>
                            {values.entStartMode != 1 && <div className="col-md-6">
                                <FormGroup>
                                    <label>Entitlement Opening Date
                                        <span style={{ color: "red" }}>*</span>
                                        <span style={{ paddingLeft: "5px" }}>
                                        <>
                                        <Tooltip title="Set the date when leave entitlement begins. We recommend setting this to 1st January for consistency">
                                        <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
                                        </Tooltip><br />
                                        </></span>
                                    </label>
                                    <Field type="date" name="entOpeningDate" className="form-control" value={"2024-01-01"} disabled={values.entStartMode==0}required></Field>
                                    <ErrorMessage name="entOpeningDate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>}
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    <FormGroup>
                                        <div type="checkbox" name="paid">
                                            <label>Paid</label><br />
                                            <i className={`fa fa-2x ${this.state.leaveType
                                                && this.state.leaveType.paid
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`} onClick={e => {
                                                    let { leaveType } = this.state;
                                                    leaveType.paid = !leaveType.paid;
                                                    setFieldValue("paid", leaveType.paid);
                                                    this.setState({
                                                        leaveType
                                                    });
                                                }}></i>
                                        </div>

                                    </FormGroup>
                                </div>
				
				
				                <div className="col-md-3">
                                    <FormGroup>
                                        <div type="checkbox" name="accrual"  >
                                            <label>Accrual <span style={{ paddingLeft: "5px" }}>
                                                    <>
                                                    <Tooltip title="Turn on for leave to accrue progressively, off for full entitlement at once.">
                                                    <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
                                                    </Tooltip><br />
                                                    </></span>
                                                </label><br />
                                            <i className={`fa fa-2x ${this.state.leaveType
                                                && this.state.leaveType.accrual
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`} onClick={e => {
                                                    let { leaveType } = this.state;
                                                    leaveType.accrual = !leaveType.accrual;
                                                    setFieldValue("accrual", leaveType.accrual);
                                                    this.setState({
                                                        leaveType
                                                    });
                                                }}></i>
                                        </div>
                                    </FormGroup>
                                </div> <div className="col-md-3">
                                    <FormGroup>
                                        <div type="checkbox" name="accrual">
                                            <label>Encashment</label><br />
                                            <i className={`fa fa-2x ${this.state.leaveType
                                                && this.state.leaveType.encashment
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`}  onClick={e => {
                                                    let { leaveType } = this.state;
                                                    leaveType.encashment = !leaveType.encashment;
                                                    setFieldValue("encashment", leaveType.encashment);
                                                    this.setState({
                                                        leaveType
                                                    });
                                                }} ></i>
                                        </div>
                                    </FormGroup>
                                </div>
                                <div className="col-md-3">
                                    <FormGroup>
                                        <div type="checkbox" name="accrual" >
                                            <label>Attachment</label><br />
                                            <i className={`fa fa-2x ${this.state.leaveType
                                                && this.state.leaveType.attachmentRequired
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`} onClick={e => {
                                                    let { leaveType } = this.state;
                                                    leaveType.attachmentRequired = !leaveType.attachmentRequired;
                                                    setFieldValue("attachmentRequired", leaveType.attachmentRequired);
                                                    this.setState({
                                                        leaveType
                                                    });
                                                }} ></i>
                                        </div>
                                    </FormGroup>
                                </div>
                                
                            </div>
                            <div className="row">
                            <div className="col-md-3">
                                    <FormGroup>
                                        <div type="checkbox" name="halfDay" >
                                            <label>Half Day
                                                <span style={{ color: "red" }}>*</span>
                                                <span style={{ paddingLeft: "5px" }}>
                                                    <>
                                                        <Tooltip title="Allows users to apply for half-day leave. Calculated as (Shift Hours - Break Hours) ÷ 2.">
                                                            <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
                                                        </Tooltip><br />
                                                    </></span>
                                            </label><br />
                                            <i className={`fa fa-2x ${this.state.leaveType
                                                && this.state.leaveType.halfDay
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`} onClick={e => {
                                                    let { leaveType } = this.state;
                                                    leaveType.halfDay = !leaveType.halfDay;
                                                    setFieldValue("halfDay", leaveType.halfDay);
                                                    this.setState({
                                                        leaveType
                                                    });
                                                }} ></i>
                                        </div>
                                    </FormGroup>
                                </div>
                                <div className="col-md-3">
                                    <FormGroup>
                                        <div type="checkbox" name="showOnDashboard"  >
                                            <label>Show on Dashboard<span style={{ paddingLeft: "5px" }}>
                                                    <>
                                                    <Tooltip title="Display this leave type and balance on the employee’s dashboard.">
                                                    <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
                                                    </Tooltip><br />
                                                    </></span>
                                            </label><br />
                                            <i className={`fa fa-2x ${this.state.leaveType
                                                && this.state.leaveType.showOnDashboard
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`} onClick={e => {
                                                    let { leaveType } = this.state;
                                                    leaveType.showOnDashboard = !leaveType.showOnDashboard;
                                                    setFieldValue("showOnDashboard", leaveType.showOnDashboard);
                                                    this.setState({
                                                        leaveType
                                                    });
                                                }}></i>
                                        </div>
                                    </FormGroup>
                                </div>
                                <div className="col-md-3">
                                    <FormGroup>
                                        <div type="checkbox" name="showOnApp"  >
                                            <label>Show on App<span style={{ paddingLeft: "5px" }}>
                                                    <>
                                                    <Tooltip title="Enable leave details to appear in the mobile application homepage.">
                                                    <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
                                                    </Tooltip><br />
                                                    </></span>
                                            </label><br />
                                            <i className={`fa fa-2x ${this.state.leaveType
                                                && this.state.leaveType.showOnApp
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`} onClick={e => {
                                                    let { leaveType } = this.state;
                                                    leaveType.showOnApp = !leaveType.showOnApp;
                                                    setFieldValue("showOnApp", leaveType.showOnApp);
                                                    this.setState({
                                                        leaveType
                                                    });
                                                }}></i>
                                        </div>
                                    </FormGroup>
                                </div>
                                <div className="col-md-3">
                                    <FormGroup>
                                        <div type="checkbox" name="carryForward"  >
                                            <label>Carry Forward<span style={{ paddingLeft: "5px" }}>
                                                    <>
                                                    <Tooltip title="Allow leave balance to carry over to the next year, subject to limits">
                                                    <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
                                                    </Tooltip><br />
                                                    </></span>
                                             </label><br />
                                            <i className={`fa fa-2x ${this.state.leaveType
                                                && this.state.leaveType.carryForward
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`}  onClick={e => {
                                                    let { leaveType } = this.state;
                                                    leaveType.carryForward = !leaveType.carryForward;
                                                    setFieldValue("carryForward", leaveType.carryForward);
                                                    this.setState({
                                                        leaveType
                                                    });
                                                }}></i>
                                        </div>
                                    </FormGroup>
                                </div>
                            </div>
                            
                            { this.state.leaveType.carryForward && <div className="row">
                                <div className="col-md-4">
                                    <FormGroup>
                                    <label>Max Limit
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="carrymaxLimit" className="form-control" type="number" min="0"></Field>
                                    <ErrorMessage name="carrymaxLimit">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                    </FormGroup>
                                </div>
                                {values.entStartMode == 0 && <div className="col-md-4">
                                    <FormGroup>
                                    <label>Expiry Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field type="date" name="carryexpiryDate" className="form-control"></Field>
                                    <ErrorMessage name="carryexpiryDate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        
                                    </ErrorMessage>
                                    </FormGroup>
                                </div>}
                                {values.entStartMode == 1 && <div className="col-md-4">
                                    <FormGroup> 
                                    <label>Expiry Month
                                        <span style={{ color: "red" }}>*</span><Tooltip title="Select the number of months after the work anniversary that carried forward leave will remain valid before expiring.">
                                        <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
                                        </Tooltip><br />
                                    </label>
                                    <Field name="carryexpirymonth" className="form-control" type="number" min="0"></Field>
                                    <ErrorMessage name="carryexpirymonth">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        
                                    </ErrorMessage>
                                    </FormGroup>
                                </div>}
                            </div>}
                            <div className="row">
                                <div className={values.futureYearLeave == true ? "col-md-2" : "col-md-4"}>
                                    <FormGroup>
                                        <div type="checkbox" name="futureYearLeave" >
                                            <label>Future year Leave<span style={{ paddingLeft: "5px" }}>
                                                    <>
                                                    <Tooltip title="Permit employees to apply for next year’s leave in the current year.">
                                                    <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
                                                    </Tooltip><br />
                                                    </></span>
                                                </label><br />
                                            <i className={`fa fa-2x ${this.state.leaveType
                                                && this.state.leaveType.futureYearLeave
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`} onClick={e => {
                                                    let { leaveType } = this.state;
                                                    leaveType.futureYearLeave = !leaveType.futureYearLeave;
                                                    setFieldValue("futureYearLeave", leaveType.futureYearLeave);
                                                    this.setState({
                                                        leaveType
                                                    });
                                                }} ></i>
                                        </div>
                                    </FormGroup>
                                </div>
                                {values.futureYearLeave == true && values.entStartMode == 0 && <div className="col-md-2">
                                    <FormGroup>
                                    <label>Opening Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field type="date" name="futureexpiryDate" className="form-control"></Field>
                                    <ErrorMessage name="futureexpiryDate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        
                                    </ErrorMessage>
                                    </FormGroup>
                                </div>}
                                {values.futureYearLeave == true && values.entStartMode == 1 && <div className="col-md-2">
                                    <FormGroup>
                                    <label>Advance Availability
                                        <span style={{ color: "red" }}>*</span><Tooltip title="Set the number of months before the work anniversary when leave for the next year becomes available to apply.">
                                        <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
                                        </Tooltip><br />
                                    </label>
                                    <Field name="futureOpeningMonth" className="form-control" type="number" min="0"></Field>
                                    <ErrorMessage name="futureOpeningMonth">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        
                                    </ErrorMessage>
                                    </FormGroup>
                                </div>}
                                <div className="col-md-4">
                                    <FormGroup>
                                        <div type="checkbox" name="estimateLeaveBalance"  >
                                            <label>Estimate Leave Balance
                                                    <>
                                                    <Tooltip title="Show future leave balance when applying for leave on future dates.">
                                                    <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
                                                    </Tooltip>
                                                    </> 
                                            </label><br />
                                            <i className={`fa fa-2x ${this.state.leaveType
                                                && this.state.leaveType.estimateLeaveBalance
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`} onClick={e => {
                                                    let { leaveType } = this.state;
                                                    leaveType.estimateLeaveBalance = !leaveType.estimateLeaveBalance;
                                                    setFieldValue("estimateLeaveBalance", leaveType.estimateLeaveBalance);
                                                    this.setState({
                                                        leaveType
                                                    });
                                                }} ></i>
                                        </div>
                                    </FormGroup>
                                </div>
                                <div className={values.negativeBalance == true ? "col-md-2" : "col-md-4"}>
                                    <FormGroup>
                                        <div type="checkbox" name="negativeBalance">
                                            <label>Negative Balance</label>
                                                    <Tooltip title="Allow employees to apply for leave in advance, exceeding their available balance.">
                                                    <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
                                                    </Tooltip><br />
                                                     
                                            <i className={`fa fa-2x ${this.state.leaveType
                                                && this.state.leaveType.negativeBalance
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`}  onClick={e => {
                                                    let { leaveType } = this.state;
                                                    leaveType.negativeBalance = !leaveType.negativeBalance;
                                                    setFieldValue("negativeBalance", leaveType.negativeBalance);
                                                    this.setState({
                                                        leaveType
                                                    });
                                                }}  ></i>
                                        </div>
                                    </FormGroup>
                                </div>

                                
                                {this.state.leaveType.negativeBalance && <div className="col-md-2">
                                    <FormGroup>
                                    <label>Max Limit
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="negativebalmaxLimit" className="form-control" type="number" min="0"></Field>
                                    <ErrorMessage name="negativebalmaxLimit">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                    </FormGroup>
                                </div>}
                                <div className={values.mobileDefaultLeave == true ? "col-md-2" : "col-md-4"}>
                                    <FormGroup>
                                        <div type="checkbox" name="mobileDefaultLeave">
                                            <label>Default Mobile Leave</label>
                                                    <Tooltip title="Enable to set this leave type as the default selection when applying for leave via the mobile app. Only one leave type can be set as default.">
                                                    <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
                                                    </Tooltip><br />
                                                     
                                            <i className={`fa fa-2x ${this.state.leaveType
                                                && this.state.leaveType.mobileDefaultLeave
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`}  onClick={e => {
                                                    let { leaveType } = this.state;
                                                    leaveType.mobileDefaultLeave = !leaveType.mobileDefaultLeave;
                                                    setFieldValue("mobileDefaultLeave", leaveType.mobileDefaultLeave);
                                                    this.setState({
                                                        leaveType
                                                    });
                                                }}  ></i>
                                        </div>
                                    </FormGroup>
                                </div>
                               
                                
                            </div>
                            
                            
                            
                            <input type="submit" className="btn btn-primary" value={this.state.leaveType.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
