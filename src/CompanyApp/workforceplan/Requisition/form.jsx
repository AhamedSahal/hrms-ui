import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveRequisition } from './service';
import { RequisitionSchema } from './validation';
import JobTitleDropdown from '../../ModuleSetup/Dropdown/JobTitleDropdown'; 
import DepartmentDropdown from '../../ModuleSetup/Dropdown/DepartmentDropdown'; 
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
import { event } from 'jquery';


export default class RequisitionForm extends Component {
    constructor(props) {
        super(props)

        this.state  = {
            requisition: props.requisition || {
                id: 0,
                employeeId:0,
                departmentId: 0,
                    department :{
                        id: 0 
                }, 
                req_type : "Nonbudgeted",
                forecastId: 1,
                forecast: {
                    id: 1
                },
                role: " ",
                reqinitiateddate:"",
                resneeddate:"",
                noofresources : 0, 
                rec_reason:"NewPosition",
                res_type:"InHouse",
                pos_type:"PartTime",
                noofmonths: 0

            }  
           
            
        }  
    }
   
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.requisition && nextProps.requisition != prevState.requisition) {
            return ({ requisition: nextProps.requisition })
        } else if (!nextProps.requisition ) { 
            return prevState.requisition || ({

                requisition: this.props.requisition || {
                    id: 0,
                    departmentId: 0,
                    department :{
                        id: 0
                }, 
                req_type : "Nonbudgeted",
                forecastId: 1,
                forecast: {
                    id: 1
                },
                role: " ",
                reqinitiateddate:"",
                resneeddate:"", 
                noofresources : 0,
                rec_reason:"",
                res_type:"",
                pos_type:"",
                noofmonths: 0
                
                
                }    
            })
        }
        return null;
    }   
    save = (data, action) => { 
        action.setSubmitting(true);   
      saveRequisition(data).then(res => {
            if (res.status == "OK") { 
                toast.success(res.message); 
                this.props.updateList(res.data);
            } else { 
                toast.error(res.message);
            }
        }) .catch(err => {
            console.log(err)
            toast.error("Error while saving requisition");
            action.setSubmitting(false);
        }) 
    }
    
    render() {
        let { requisition } = this.state;
        const { value } = this.state; 
        return (
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={requisition}
                    onSubmit={this.save}
                    validationSchema={RequisitionSchema}
                >
                    {({
                        values,
                        errors,
                        setSubmitting,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue
                        /* and other goodies */
                    }) => (
                        <Form autoComplete='off'> 
                         
                           <div className="row">
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Requisition Date
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="reqinitiateddate" className="form-control" type="date"></Field>
                                        <ErrorMessage name="reqinitiateddate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Expected Start Date
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="resneeddate" className="form-control" type="date"></Field>
                                        <ErrorMessage name="resneeddate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                            <div className="col-md-6">
                                    <FormGroup>
                                        <label>Requisition Type
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div className="radio" >
                                        <label>
                                            <input type="radio" value="Budgeted"  name="req_type"
                                               onChange={e => {
                                                setFieldValue("req_type", e.target.value)}}
                                            />&nbsp;Budgeted
                                        </label>&nbsp;&nbsp;&nbsp;
                                        <label> 
                                            <input type="radio" 
                                            value="Nonbudgeted"  name="req_type"
                                            checked={values.req_type == "Nonbudgeted"?true:false}
                                            onChange={e => {
                                                setFieldValue("req_type", e.target.value)}}
                                            />&nbsp;Non budgeted
                                        </label>
                                        </div>
                                        <ErrorMessage name="req_type">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                {values.req_type == "Budgeted"  &&  <><div className="col-md-6">
                                <FormGroup>
                                    <label>Job Titles
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="forecastId" render={field => {
                                        return <JobTitleDropdown defaultValue={values.forecast?.id} onChange={e => {
                                            setFieldValue("forecastId", e.target.value)
                                            setFieldValue("forecast", { id: e.target.value }); 
                                        }}></JobTitleDropdown>
                                    }}></Field>
                                    <ErrorMessage name="forecastId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                </div></>}
                                {values.req_type == "Nonbudgeted" && <><div className="col-md-6">
                                    <FormGroup>
                                        <label>Job Titles
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="role" className="form-control"></Field>
                                        <ErrorMessage name="role">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div></>}
                                <div className="col-md-12">
                                <FormGroup>
                                    <label>Department
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="departmentId" render={field => {
                                        return <DepartmentDropdown defaultValue={values.department?.id} onChange={e => {
                                            setFieldValue("departmentId", e.target.value);
                                            setFieldValue("department", { id: e.target.value }); 
                                        }}></DepartmentDropdown>
                                    }}></Field> 
                                    <ErrorMessage name="departmentId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                </div>
                                <div className="col-md-12">
                                <FormGroup>
                                    <label>Recruitment Reason
                                        <span style={{ color: "red" }}>*</span>
                                    </label><br></br>
                                    <div className="radio">
                                    <label>
                                        <input type="radio" value="NewPosition" name="rec_reason" 
                                        checked = {values.rec_reason == "NewPosition"?true:false}
                                         onChange={e => {
                                            setFieldValue("rec_reason", e.target.value)}}
                                        />&nbsp;New Position
                                    </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <label>
                                        <input type="radio"  value="TurnOver" name="rec_reason"  
                                         onChange={e => {
                                            setFieldValue("rec_reason", e.target.value)}}
                                        />&nbsp;Turn Over
                                    </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <label>
                                        <input type="radio"  value="Promotion" name="rec_reason"  
                                         onChange={e => {
                                            setFieldValue("rec_reason", e.target.value)}}
                                        />&nbsp;Promotion
                                    </label>&nbsp;&nbsp;&nbsp;
                                    <label>
                                        <input type="radio" name="rec_reason" value="LongTermAbsence"    
                                        onChange={e => {
                                            setFieldValue("rec_reason", e.target.value)}} 
                                        />&nbsp;Long Term Absence
                                    </label>
                                    <label>
                                        <input type="radio"  value="Projects/OpsRequirement" name="rec_reason" 
                                         onChange={e => {
                                            setFieldValue("rec_reason", e.target.value)}}
                                        />&nbsp;Projects / Ops Requirement
                                    </label>&nbsp;&nbsp;&nbsp;
                                    </div>
                                    <ErrorMessage name="rec_reason">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Resource Type
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div className="radio">
                                        <label>
                                            <input type="radio" name="res_type" value="InHouse" 
                                            checked={values.res_type == "InHouse"?true:false}
                                             onChange={e => {
                                                setFieldValue("res_type", e.target.value)}}
                                            />&nbsp;In House
                                        </label>&nbsp;&nbsp;&nbsp;
                                        <label>
                                            <input type="radio" name="res_type" value="Outsourced"  
                                            onChange={e => {
                                                setFieldValue("res_type", e.target.value)}}
                                            />&nbsp;Outsourced
                                        </label>
                                        </div>
                                        <ErrorMessage name="res_type">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Position Type
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div className="radio">
                                        <label>
                                            <input type="radio" name="pos_type"  value="PartTime" 
                                            checked={values.pos_type == "PartTime"?true:false} 
                                            onChange={e => {
                                                setFieldValue("pos_type", e.target.value)}}
                                            />&nbsp;Part Time
                                        </label>&nbsp;&nbsp;&nbsp;
                                        <label>
                                            <input type="radio" name="pos_type" value="FullTime"  
                                            onChange={e => {
                                                setFieldValue("pos_type", e.target.value)}}
                                            />&nbsp;Full Time
                                        </label>&nbsp;&nbsp;&nbsp;
                                        <label>
                                            <input type="radio" name="pos_type" value="Temporary"  
                                            onChange={e => {
                                                setFieldValue("pos_type", e.target.value)}}
                                            />&nbsp;Temporary
                                        </label>
                                        </div>
                                        <ErrorMessage name="positiontype">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                </div>
                                {values.pos_type == "Temporary" && <><div className="row"> 
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>No of Months
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="noofmonths" className="form-control"></Field>
                                        <ErrorMessage name="noofmonths">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                </div></>}
                                <div className="row"> 
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>No of Resources
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="noofresources" className="form-control"></Field>
                                        <ErrorMessage name="noofresources">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div> 
                             <div className="col-md-6">
                                <FormGroup>
                                    <label>Reporting Manager
                                    </label>
                                    <Field name="reportingManagerId" render={field => {
                                        return <EmployeeDropdown permission="ORGANIZATION"  defaultValue={values.reportingManager?.id} onChange={e => {
                                            setFieldValue("reportingManagerId", e.target.value)
                                        }}></EmployeeDropdown>
                                    }}></Field>
                                    <ErrorMessage name="reportingManagerId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                            </div>  
                            <input type="submit" className="btn btn-primary" value={this.state.requisition.id>0?"Update Request":"Send Request"} 
                            />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
