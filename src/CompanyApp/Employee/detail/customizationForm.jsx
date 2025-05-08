import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Anchor } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { PERMISSION_LEVEL, SALARY_MODE } from '../../../Constant/enum';
import { getUserType, getCurrency, verifyEditPermission, getPermission } from '../../../utility';
import EnumDropdown from '../../ModuleSetup/Dropdown/EnumDropdown';
import { getSalaryEmploymentStatusIdInformation,updateSalaryEmploymentStatusIdInformation} from './service';
//import {getEmploymentStatusList} from './service';

import { SalaryBasicAndModeSchema } from '../validation';
import ComparatioMap from './comparatioMap';
import { getEmploymentStatusList } from '../../ModuleSetup/EmploymentStatus/service';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN' || getPermission("Employee", "EDIT") == PERMISSION_LEVEL.ORGANIZATION;
const isEmployee = getUserType() == 'EMPLOYEE';

export default class CustomizationForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            editable: false,

            customizationForm : {
                perdaySalary: ""
            },
            id: props.employeeId || 0,
            employee: props.employee || {
                id: 0,
                name: "",
                active: true,
            },

            salaryCalculationMode: "TIMESHEET",
        }
    }
    componentDidMount() {
     
        this.fetchList(this.state.id);

    }

    
    fetchList = (id) => {
        getSalaryEmploymentStatusIdInformation(id).then(res => {
            if (res.status == "OK") {
                this.setState({
                    customizationForm: res.data,
                
                })
              }
        })
    }
    save = (data, action) => {
        
        data.salaryCalculationMode = "TIMESHEET";
    
        action.setSubmitting(true);
        updateSalaryEmploymentStatusIdInformation(data,this.state.id).then(res => {
            if (res.status == "OK") {
             
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving salary detail");

            action.setSubmitting(false);
        })
    }
    render() {

        let { editable } = this.state;
        const isEditAllowed = getPermission("Employee", "EDIT") == PERMISSION_LEVEL.ORGANIZATION
        if (editable && !isEditAllowed) {
            editable = false;
        }
        return (
            <>
                <div className="row">
                    <div className="pt-3 col-sm-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="alert alert-info alert-dismissible fade show" role="alert">
                                    <span>Monthy Salary: <strong> {this.state.customizationForm.perdaySalary} {getCurrency()} </strong></span>
                                </div>
                                {!editable && isCompanyAdmin && <Anchor className="edit-icon" onClick={() => {
                                    this.setState({ editable: true })
                                }}><i className="fa fa-edit"></i></Anchor>}
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={this.state.customizationForm}
                                    onSubmit={this.save}
                                  //  validationSchema={SalaryBasicAndModeSchema}
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
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Per Hour Salary
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field readOnly={!editable} name="perdaySalary" className="form-control"></Field>
                                                        <ErrorMessage name="perdaySalary">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>

                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Salary Calculation Mode
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field readOnly={true} name="salaryCalculationMode" className="form-control"
                                                            render={field => {
                                                                return <EnumDropdown readOnly={true} label={"Salary Calculation Mode"} enumObj={SALARY_MODE} defaultValue={this.state.salaryCalculationMode} onChange={e => {
                                                                    setFieldValue("salaryCalculationMode", e.target.value)
                                                                }}>
                                                                </EnumDropdown>
                                                            }}
                                                        ></Field>
                                                        {/* <ErrorMessage name="salaryCalculationMode">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage> */}
                                                    </FormGroup>
                                                </div>
                                                {(isCompanyAdmin || editable) && <div className='col-md-12'>
                                                    <input disabled={!isCompanyAdmin || !editable}  type="submit" className="btn btn-primary btn-sm" value="Update" />
                                                    &nbsp;
                                                    <Anchor onClick={() => { this.setState({ editable: false }) }} className="btn btn-secondary btn-sm" ><span>Cancel</span></Anchor>
                                                </div>}
                                            </div>
                                        </Form>
                                    )
                                    }
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
              
            </>
        )
    }
}
