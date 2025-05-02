import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import Checkbox from "@mui/material/Checkbox";
import EnumDropdown from '../ModuleSetup/Dropdown/EnumDropdown';
import { saveEmployee } from './service';
import {  NewEmployeeSchema } from './validation';
import { BLOOD_GROUP, GENDER, MARITAL_STATUS } from '../../Constant/enum';
import { Helmet } from 'react-helmet';
import NationalityDropdown from './../ModuleSetup/Dropdown/NationalityDropdown';
import ReligionDropdown from './../ModuleSetup/Dropdown/ReligionDropdown';
import LanguageDropdown from '../ModuleSetup/Dropdown/LanguageDropdown';
import { getTitle } from '../../utility';
import PasswordField from '../../initialpage/PasswordField';
import BranchDropdown from '../ModuleSetup/Dropdown/BranchDropdown';


export default class CreateEmployeeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            employee: props.employee || {
                bloodGroup: "A_POSITIVE",
                dob: "",
                email: "",
                autoGenerateEmployeeId: true,
                fatherName: "",
                firstName: "",
                gender: "MALE",
                id: 0,
                languages: [],
                lastName: "",
                maritalStatus: "SINGLE",
                middleName: "",
                nationalityId: 0,
                password: "",
                phone: "",
                religionId: 0,
                status: "PENDING",
                totalExperience: 0,
                locationId:0,
                orgSetupId: 1,
                orgSetup:{
                    id: 1,
                }
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.employee && nextProps.employee != prevState.employee) {
            return ({ employee: nextProps.employee })
        } else if (!nextProps.employee) {

            return prevState.employee || ({
                employee: {
                    doj: "",
                    email: "",
                    firstName: "",
                    id: 0,
                    lastName: "",
                    password: "",
                    status: "PENDING",
                    locationId: 0,
                    orgSetupId: 1,
                    orgSetup:{
                        id: 1,
                    }
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        const capitalizeFirstLetter = (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        };
        data.firstName = capitalizeFirstLetter(data.firstName);
        data.lastName = capitalizeFirstLetter(data.lastName);

        data["doj"] = new Date(data["doj"]);
        data["orgSetupId"] = data["orgSetup"]["id"];
        action.setSubmitting(true);
        saveEmployee(data).then(res => {
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
        let {employee} = this.state;
        return (
            <div className="page-wrapper page-wrapper-margin-top">
                <Helmet>
                    <title>Create Employee | {getTitle()}</title>
                    <meta name="description" content="Login page" />
                </Helmet>
                <div className="content container-fluid">
                    <div className="row">

                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">New Employee</h5>
                                </div>
                                <div className="card-body">
                                    <Formik
                                        enableReinitialize={true}
                                        initialValues={this.state.employee}
                                        onSubmit={this.save}
                                        validationSchema={NewEmployeeSchema}
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
                                                {/* auto generate */}
                                                <div className="row">
                                                    <div className="col-md-12" style={{display:"flex", alignItems:"end", justifyContent:"end"}}>
                                                        <div className="col-md-3" style={{display:"flex", alignItems:"end", justifyContent:"end"}}>
                                                            <FormGroup>
                                                            
                                                                <Checkbox
                                                                    checked = {employee.autoGenerateEmployeeId}
                                                                    onChange={(e) => {
                                                                        setFieldValue("autoGenerateEmployeeId", employee.autoGenerateEmployeeId?false:true)
                                                                        employee.autoGenerateEmployeeId =  employee.autoGenerateEmployeeId?false:true
                                                                      
                                                                    }}
                                                                    inputProps={{ "aria-label": "controlled" }}
                                                                />
                                                                <label>Auto-Generate Employee Id  </label>
                                                               

                                                            </FormGroup>
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* auto generate */}
                                                <div className="row">
                                                    {/* employee id */}
                                                  {!employee.autoGenerateEmployeeId &&  <div className="col-md-3">
                                                        <FormGroup>
                                                            <label>Employee Id
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field name="employeeId" className="form-control" required></Field>
                                                            <ErrorMessage name="employeeId">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>}


                                                    <div className="col-md-3">
                                                        <FormGroup>
                                                            <label>First Name
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field name="firstName" capitalize-first-letter className="form-control"></Field>
                                                            <ErrorMessage name="firstName">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-3">

                                                        <FormGroup>
                                                            <label>Last Name
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field name="lastName" capitalize-first-letter className="form-control"></Field>
                                                            <ErrorMessage name="lastName">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-3">
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
                                                    <div className="col-md-3">
                                                        <FormGroup>
                                                            <label>Location <span style={{ color: "red" }} required>*</span>
                                                            </label>
                                                            <Field  name="branchId" render={field => {
                                                                return <BranchDropdown defaultValue={values.branch?.id} onChange={e => {
                                                                    setFieldValue("branchId", e.target.value);
                                                                    setFieldValue("branch", { id: e.target.value });
                                                                }}></BranchDropdown>
                                                            }}></Field>
                                                            <ErrorMessage name="branchId">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <FormGroup>
                                                            <label>Date of Joining
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field name="doj" type="date" className="form-control"></Field>
                                                            <ErrorMessage name="doj">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>
                                                    </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <h3>Credentials</h3>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <FormGroup>
                                                            <label>User Name
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field name="email" className="form-control" readOnly="readonly"></Field>

                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <FormGroup>
                                                            <label>Password
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <PasswordField name="password" type = 'password' onChange={(value) => {
                                                                setFieldValue("password", value);
                                                            }} />
                                                        </FormGroup>
                                                    </div>
                                                </div>

                                                <input type="submit" className="btn btn-primary" value="Create" />
                                                &nbsp;
                                                <input type="button" className="btn btn-secondary btn-sm" onClick={this.redirectToList} value="Cancel"></input>
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
