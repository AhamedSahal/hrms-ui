import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUserType,getTitle } from  '../../utility';
import { FormGroup } from 'reactstrap';
import EnumDropdown from '../ModuleSetup/Dropdown/EnumDropdown';
import BranchDropdown from '../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../ModuleSetup/Dropdown/DepartmentDropdown';
import DesignationDropdown from '../ModuleSetup/Dropdown/DesignationDropdown';
import EmployeeDropdown from '../ModuleSetup/Dropdown/EmployeeDropdown'; 
import { QuickAdd } from './service';
import { updateCompanyInformationQuickAdd} from '../Employee/detail/service';
import { EmployeeSchema } from './validation';
import { GENDER,STATUS } from '../../Constant/enum';
import { Helmet } from 'react-helmet';   
 

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const isEmployee = getUserType() == 'EMPLOYEE';
export default class CreateQuickAddForm extends Component{
    constructor(props) {
        super(props)
        this.state = {editable: false,
            company:  { 
                branchId: 0,
                departmentId: 0,
                designationId: 0,
                branch: {
                    id: 0,
                },
                dapartment: {
                    id: 0,
                },
                designation: {
                    id: 0,
                },
            },
            employee: props.employee || {
                bloodGroup: "B_POSITIVE",
                    dob: "",
                    email: "",
                    fatherName: "",
                    firstName: "",
                    gender: "MALE",
                    id: 0,
                    languages: [],
                    lastName: "",
                    maritalStatus: "SINGLE",
                    middleName: "",
                    nationalityId: 1,
                    password: "",
                    phone: "",
                    religionId: 1,
                    status: "PENDING",
                    totalExperience: 0
            }
        }
    
    
    
    
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.employee && nextProps.employee != prevState.employee) {
            return ({ employee: nextProps.employee })
        } else if (!nextProps.employee) {

            return prevState.employee || ({
                employee: {
                    dob: "",
                    email: "",
                    firstName: "",
                    gender: "MALE",
                    id: 0,
                    lastName: "",
                    middleName: "",
                    password: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => { 
        data["dob"] = new Date(data["dob"]);
        data["doj"] = new Date(`${data["doj"]} GMT`);
        action.setSubmitting(true);
        QuickAdd(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.redirectToList();
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.log({ err });
            toast.error("Error while saving employee");
            action.setSubmitting(false);
        })
         
    }
    redirectToList = () => {
        this.props.history.goBack();
    }
    render() {
        
        const { editable } = this.state;
        return (
            

            <div className="page-wrapper">
                <Helmet>
                    <title>Quick Add Employee | {getTitle()}</title>
                    <meta name="description" content="Login page" />
                </Helmet>
                <div className="content container-fluid">
                    <div className="row">

                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">Quick Append </h5>
                                </div>
                                <div className="card-body">
                                    <Formik
                                        enableReinitialize={true}
                                        initialValues={this.state.employee}
                                        onSubmit={this.save}
                                        validationSchema={EmployeeSchema}
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
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <h3>Employee Details</h3>
                                                    </div>
                                                        <div className="col-md-4">
                                                            <FormGroup >
                                                                <label>First Name
                                                                  <span style={{ color: "red" }}>*</span>
                                                                </label>
                                                                <Field name="firstName" className="form-control"></Field>
                                                                <ErrorMessage name="firstName">
                                                                   {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                </ErrorMessage>
                                                            </FormGroup>
                                                        </div>
                                                        
                                                        <div className="col-md-4">
                                                            <FormGroup>
                                                                <label>Middle Name
                                                                </label>
                                                                <Field name="middleName" className="form-control"></Field>
                                                                <ErrorMessage name="middleName">
                                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                </ErrorMessage>
                                                            </FormGroup>
                                                        </div>
                                                        <div className="col-md-4">
                                                            
                                                            <FormGroup>
                                                                <label>Last Name
                                                                    <span style={{ color: "red" }}>*</span>
                                                                </label>
                                                                <Field name="lastName" className="form-control"></Field>
                                                                <ErrorMessage name="lastName">
                                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                </ErrorMessage>
                                                            </FormGroup>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <FormGroup>
                                                                <label>Email
                                                                    <span style={{ color: "red" }}>*</span>
                                                                </label>
                                                                <Field name="email" className="form-control"></Field>
                                                                <ErrorMessage name="email">
                                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                </ErrorMessage>
                                                            </FormGroup>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <FormGroup>
                                                                <label>Date of Birth
                                                                    <span style={{ color: "red" }}>*</span>
                                                                </label>
                                                                <Field name="dob" type="date"    className="form-control" ></Field>
                                                                <ErrorMessage name="dob">
                                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                </ErrorMessage>
                                                            </FormGroup>
                                                        </div>
                                                    
                                                        <div className="col-md-4">
                                                            <FormGroup>
                                                                <label>Gender
                                                                    <span style={{ color: "red" }}>*</span>
                                                                </label>
                                                                <Field name="gender" className="form-control"
                                                                    render={field => {
                                                                        return <EnumDropdown label={"GENDER"} enumObj={GENDER} defaultValue={this.state.employee.gender} onChange={e => {
                                                                            setFieldValue("gender", e.target.value)
                                                                        }}>
                                                                        </EnumDropdown>
                                                                    }}
                                                                ></Field>
                                                                <ErrorMessage name="gender">
                                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                </ErrorMessage>
                                                            </FormGroup>
                                                        </div>
                                                </div> 
                                                <div className="row">
                                                        <div className="col-md-12">
                                                                    <h3>Company Details</h3>
                                                                </div>
                                                            <div className="col-md-4">
                                                                <FormGroup>
                                                                    <label>Employee ID
                                                                        <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <Field   name="employeeId" className="form-control" ></Field>
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <FormGroup>
                                                                    <label>Company Date Of Joining
                                                                        <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <Field   name="doj" type="date" defaultValue={values.doj} className="form-control"></Field>
                                                                    <ErrorMessage name="doj">
                                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <FormGroup>
                                                                    <label>Branch
                                                                        <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <Field   name="branchId" render={field => {
                                                                        return <BranchDropdown  defaultValue={values.branch?.id} onChange={e => {
                                                                            setFieldValue("branchId", e.target.value);
                                                                            setFieldValue("branch", { id: e.target.value });
                                                                        }}></BranchDropdown>
                                                                    }}></Field>
                                                                    <ErrorMessage name="branchId">
                                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <FormGroup>
                                                                    <label>Department
                                                                        <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <Field   name="departmentId" render={field => {
                                                                        return <DepartmentDropdown  defaultValue={values.department?.id} onChange={e => {
                                                                            setFieldValue("departmentId", e.target.value);
                                                                            setFieldValue("department", { id: e.target.value });
                                                                        }}></DepartmentDropdown>
                                                                    }}></Field>
                                                                    <ErrorMessage name="departmentId">
                                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <FormGroup>
                                                                    <label>Designation
                                                                        <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <Field  name="designationId" render={field => {
                                                                        return <DesignationDropdown  defaultValue={values.designation?.id} onChange={e => {
                                                                            setFieldValue("designationId", e.target.value);
                                                                            setFieldValue("designation", { id: e.target.value });
                                                                        }}></DesignationDropdown>
                                                                    }}></Field>
                                                                    <ErrorMessage name="designationId">
                                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <FormGroup>
                                                                    <label>Reporting Manager</label>
                                                                    <Field   name="reportingManagerId" render={field => {
                                                                        return <EmployeeDropdown excludeId={values.id}   defaultValue={values.reportingManager?.id} onChange={e => {
                                                                            setFieldValue("reportingManagerId", e.target.value)
                                                                        }}></EmployeeDropdown>
                                                                    }}></Field>
                                                                    <ErrorMessage name="reportingManagerId">
                                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                            </div>
                                                </div>
                                               
                                                {/* <div className="row">
                                                        <div className="col-md-12">
                                                                    <h3>Shift / Attendance / Leave </h3>
                                                        </div>
                                                        <div className="col-md-4">
                                                                <FormGroup>
                                                                    <label>Shift 
                                                                        <span style={{Color:"red"}}>*</span>
                                                                    </label> */}
                                                                   {/*  <Field readOnly={!editable} name="designationId" render={field => {
                                                                        return <DesignationDropdown readOnly={!editable} defaultValue={values.designation?.id} onChange={e => {
                                                                            setFieldValue("designationId", e.target.value);
                                                                            setFieldValue("designation", { id: e.target.value });
                                                                        }}></DesignationDropdown>
                                                                    }}></Field> */}
                                                                    {/*<ErrorMessage name="ShiftType">
                                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                         </div>
                                                        <div className="col-md-4">
                                                                <FormGroup>
                                                                    <label>Attendance 
                                                                        <span style={{Color:"red"}}>*</span>
                                                                    </label> */}
                                                                   {/*  <Field readOnly={!editable} name="designationId" render={field => {
                                                                        return <DesignationDropdown readOnly={!editable} defaultValue={values.designation?.id} onChange={e => {
                                                                            setFieldValue("designationId", e.target.value);
                                                                            setFieldValue("designation", { id: e.target.value });
                                                                        }}></DesignationDropdown>
                                                                    }}></Field> */}
                                                                    {/* <ErrorMessage name="AttendanceType">
                                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                        </div>
                                                        <div className="col-md-4">
                                                                <FormGroup>
                                                                    <label>Leave 
                                                                        <span style={{Color:"red"}}>*</span>
                                                                    </label> */}
                                                                   {/*  <Field readOnly={!editable} name="designationId" render={field => {
                                                                        return <DesignationDropdown readOnly={!editable} defaultValue={values.designation?.id} onChange={e => {
                                                                            setFieldValue("designationId", e.target.value);
                                                                            setFieldValue("designation", { id: e.target.value });
                                                                        }}></DesignationDropdown>
                                                                    }}></Field> */}
                                                                    {/* <ErrorMessage name="LeaveType">
                                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                        </div> */}
                                                       {/*  <div className="col-md-4">
                                                                <FormGroup>
                                                                    <label> WeekOff
                                                                        <span style={{Color:"red"}}>*</span>
                                                                    </label> */}
                                                                   {/*  <Field readOnly={!editable} name="designationId" render={field => {
                                                                        return <DesignationDropdown readOnly={!editable} defaultValue={values.designation?.id} onChange={e => {
                                                                            setFieldValue("designationId", e.target.value);
                                                                            setFieldValue("designation", { id: e.target.value });
                                                                        }}></DesignationDropdown>
                                                                    }}></Field> */}
                                                                    {/* <ErrorMessage name="WeekOffType">
                                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                        </div>
                                                </div> */}
                                                <div className="row">
                                                            <div className="col-md-12">
                                                                <h3>Credentials</h3>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <FormGroup>
                                                                    <label>User Name
                                                                       <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                <Field name="email" className="form-control" readonly="readonly"></Field>
                                                        
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <FormGroup>
                                                                    <label>Password
                                                                        <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <Field name="password" className="form-control" type="password"></Field>
                                                                    <ErrorMessage name="password">
                                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                            </div>
                                                </div>
                                                        
                                                <input type="submit" className="btn btn-primary" value="save" />
                                                &nbsp;
                                                <input type="button" className="btn btn-secondary" onClick={this.redirectToList} value="Cancel"></input>
                                            </Form>
                                        )
                                        }
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
        
}