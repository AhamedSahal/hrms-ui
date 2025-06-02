import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getUserType, getEmployeeId, getPermission, verifyApprovalPermission, toDateWithGMT } from '../../../utility';
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
import LeaveTypeDropdown from '../../ModuleSetup/Dropdown/LeaveTypeDropdown';
import { saveLeave,getEmployeeLeaveInformation } from './service';
import { LeaveSchema } from './validation';
import { differenceInDays } from 'date-fns'
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';

export default class LeaveForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            leaveId: 0,
            leaveBalance: -1,
            leaveEmployeeId: 0,
            employeeLeaveCount: 0,
            employeeStartDate: "",
            employeeEndDate: "",
            leaveTypeIds: 0,
            startDateDayType: 0,
            endDateDayType: 0,
            leave: props.leave || {
                id: 0,
                employeeId: props.employeeId || getEmployeeId(),
                employee: { id: props.employeeId || getEmployeeId() },
                attachmentRequired: "",
                halfDay: ""

            }
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.leave && nextProps.leave != prevState.leave) {
            return ({ leave: nextProps.leave })
        } else if (!nextProps.leave) {
            return ({
                leave: {
                    id: 0,
                    employeeId: nextProps.employeeId || getEmployeeId(),
                    employee: { id: nextProps.employeeId || getEmployeeId() }
                }
            })
        }

        return null;
    }

  save = (data, action) => {
         data["startDate"] = toDateWithGMT(data["startDate"]);
        data["endDate"] = toDateWithGMT(data["endDate"]);

        action.setSubmitting(true);
        let leaveData = {...data, startDateDayType: data.startDateDayType == null?1:data.startDateDayType, endDateDayType: data.endDateDayType == null?1:data.endDateDayType}
        saveLeave(leaveData).then(res => {
            if (res.status == "OK") {
               // toast.success(res.message);
                this.props.showAlert('submit');
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.error(err);
            toast.error("Error while applying leave");

            action.setSubmitting(false);
        })
    }
    // employee leave count
    handleEmployeeLeaveCount = (startDate,endDate,startDateDayType,endDateDayType) => {
        let {employeeStartDate,employeeEndDate} = this.state;
        let result = 0;
        this.setState({startDateDayType: startDateDayType != "" && startDateDayType != null?startDateDayType:0})
        this.setState({endDateDayType: endDateDayType != "" && endDateDayType != null?endDateDayType:0})
        if(startDate != ""){
            this.setState({employeeStartDate: startDate})
           let now = new Date();
           let curretYear = now.getFullYear();
           let userDate = new Date(startDate);
           let userYear = userDate.getFullYear();
           if(this.state.leaveTypeIds > 0){
            this.handleLeaveBalance(this.state.leaveTypeIds,startDate);
           }
        }
        if(endDate != ""){
            this.setState({employeeEndDate: endDate})
        }
        if((employeeStartDate != "" || startDate != "") && (employeeEndDate != "" || endDate != "" )){
            const date1 = new Date(endDate != ""?endDate:employeeEndDate);
            const date2 = new Date(startDate != ""?startDate:employeeStartDate);
             result = differenceInDays(date1, date2)+1;
            this.setState({employeeLeaveCount: result})
        
        if(startDateDayType == 2 || startDateDayType == 3){
            result = result-0.5;
            this.setState({employeeLeaveCount: result});
        }
        if(endDateDayType == 2 || endDateDayType == 3){
            result = result-0.5;
            this.setState({employeeLeaveCount: result});
        }
    }
        

    }
    handleLeaveBalance = (leaveTypeId,year) => {
        getEmployeeLeaveInformation(leaveTypeId,this.state.leaveEmployeeId,year).then(res => {
            if (res.status == "OK") {
                this.setState({leaveBalance: res.data.leaveBalance})
            }
          })
         

    }
    handleLeaveDropdownChange = (leaveTypeId, attachmentRequired, halfDay) => {
       this.setState({
            isHalfDay: halfDay,
            isAttachmentRequired: attachmentRequired,
            leaveTypeIds: leaveTypeId
            });
        if(this.state.employeeStartDate != null && this.state.employeeStartDate != ""){
         this.handleLeaveBalance(leaveTypeId, this.state.employeeStartDate);
            }
    }
    render() {
        const { leave, isAttachmentRequired, isHalfDay } = this.state;
        let HalfDay = isHalfDay || leave.halfDay;
        let AttachmentRequired = isAttachmentRequired || leave.attachmentRequired;
        leave.file = "";
        leave.leaveTypeId = leave.leaveType?.id;
        leave.employeeId = leave.employee?.id || getEmployeeId();
        let isHidden = leave.employeeId != 0 ? true : false;
        isHidden = isCompanyAdmin ? false : isHidden;
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={leave}
                    onSubmit={this.save}
                    validationSchema={LeaveSchema}
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

                            {(verifyApprovalPermission("LEAVE") || isCompanyAdmin) &&
                                <FormGroup hidden={isHidden}>
                                    <label>Employee
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="employeeId" render={field => {
                                        return <EmployeeDropdown permission={getPermission("LEAVE", "EDIT")} defaultValue={values.employee?.id} onChange={e => {
                                            setFieldValue("employeeId", e.target.value);
                                            this.setState({leaveEmployeeId: e.target.value})
                                            this.setState({leaveBalance: -1})
                                            setFieldValue("employee", { id: e.target.value });
                                        }}></EmployeeDropdown>
                                    }}></Field>
                                    <ErrorMessage name="employeeId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>}


                            <FormGroup>
                                <label>Leave Type
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="leaveTypeId" render={field => {
                                    return <LeaveTypeDropdown employeeId={values.employee?.id} defaultValue={values.leaveType?.id} setFieldValue={setFieldValue} onChange={ 
                                        this.handleLeaveDropdownChange  
                                     
                                    } ></LeaveTypeDropdown>
                                }}></Field>
                                <ErrorMessage name="leaveTypeId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            {this.state.leaveBalance > -1 && 
                              <div style={{display: "flex", justifyContent: "flex-end", paddingRight: "10px"}}>
                                <h5 style={{color:"#3498db"}}>Available Balance : <span style={{color: "black"}}><b>{parseFloat(this.state.leaveBalance).toFixed(2)}</b></span></h5>
                                
                              </div>
                            }

                            <FormGroup>
                                <label>Leave Reason
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="leaveReason" defaultValue={values.leaveReason} required className="form-control"></Field>
                                <ErrorMessage name="leaveReason">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <div className="row">
                            {!HalfDay ? (<div className="col-md-12">
                                    <FormGroup>
                                        <label>Start Date
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="startDate" type="date" defaultValue={values.startDate} className="form-control"
                                            onChange={(e) => {
                                                setFieldValue('startDate', e.target.value);
                                                this.handleEmployeeLeaveCount(e.target.value, values.endDate, values.startDateDayType, values.endDateDayType);
                                            }}></Field>
                                        <ErrorMessage name="startDate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>)
                                 : (<div className="row"> <div className="col-md-6">
                                <FormGroup><label>Start Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="startDate" type="date" defaultValue={values.startDate} className="form-control"
                                        onChange={(e) => {
                                            setFieldValue('startDate', e.target.value);
                                            this.handleEmployeeLeaveCount(e.target.value, values.endDate, values.startDateDayType, values.endDateDayType)
                                        }}></Field>
                                    <ErrorMessage name="startDate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                </div> 
                                <div className="col-md-6">
                                <FormGroup>
                                 <label> Select Half Day
                                 <span style={{ color: "red" }}>*</span>
                                </label>
                                <select
                                    className="form-control"
                                    name="startDateDayType"
                                    id="startDateDayType"
                                    required
                                    defaultValue={values.startDateDayType}
                                    onChange={(e) => {
                                        setFieldValue("startDateDayType", e.target.value);
                                        this.handleEmployeeLeaveCount(values.startDate, values.endDate, e.target.value, values.endDateDayType)
                                    }}
                                >
                                    <option value="">Select</option>
                                    <option value="1">Full Day</option>
                                    <option value="2">First Half</option>
                                    <option value="3">Second Half</option>
                                </select>
                                <ErrorMessage name="startDateDayType">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                            </FormGroup>
                            </div>
                            </div>)}
                            </div>
                            <div className="row">
                               {!HalfDay ? (<div className="col-md-12">
                                    <FormGroup>
                                        <label>End Date
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="endDate" type="date" defaultValue={values.endDate} className="form-control"
                                            onChange={(e) => {
                                                setFieldValue('endDate', e.target.value);
                                                this.handleEmployeeLeaveCount(values.startDate, e.target.value, values.startDateDayType, values.endDateDayType);
                                            }}
                                        ></Field>
                                        <ErrorMessage name="endDate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>) :(<div className="row"> <div className="col-md-6">
                                <FormGroup><label>End Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="endDate" type="date" defaultValue={values.endDate} className="form-control"
                                        onChange={(e) => {
                                            setFieldValue('endDate', e.target.value);
                                            this.handleEmployeeLeaveCount(values.startDate, e.target.value, values.startDateDayType, values.endDateDayType);
                                        }}></Field>
                                    <ErrorMessage name="endDate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                </div> 
                                {(values.endDate && values.endDate !== values.startDate)&&<div className="col-md-6">
                                 <FormGroup>
                                 <label> Select Half Day
                                 <span style={{ color: "red" }}>*</span>
                                </label>
                                <select
                                    className="form-control"
                                    name="endDateDayType"
                                    id="endDateDayType"
                                    required
                                    defaultValue={values.endDateDayType}
                                    onChange={(e) => {
                                        setFieldValue("endDateDayType", e.target.value);
                                        this.handleEmployeeLeaveCount(values.startDate,values.endDate, values.endDateDayType,e.target.value)
                                    }}
                                >
                                    <option value="">Select</option>
                                    <option value="1">Full Day</option>
                                    <option value="2">First Half</option>
                                    <option value="3">Second Half</option>
                                </select>
                                <ErrorMessage name="endDateDayType">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                            </FormGroup>
                            </div>}
                            </div>)} 
                            </div>
                            {this.state.employeeLeaveCount > 0 && 
                              <div style={{display: "flex", justifyContent: "flex-end", paddingRight: "10px"}}>
                                <h5 style={{color:"#3498db"}}>Day(s) Count : <span style={{color: "black"}}><b>{this.state.employeeLeaveCount}</b></span></h5>
                                
                              </div>
                            }
                            {AttachmentRequired && <FormGroup>
                                <label>Leave Document
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <input name="file" type="file" className="form-control" onChange={e => {
                                    setFieldValue('file', e.currentTarget.files[0]);
                                }}></input>
                                <ErrorMessage name="file">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>}
                            <input type="submit" className="btn btn-primary" value={this.state.leave.id > 0 ? "Update" : "Apply"} />

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
