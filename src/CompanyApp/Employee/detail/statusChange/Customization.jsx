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

import { getSalaryInformation, updateSalaryInformation } from './service';

import { SalaryBasicAndModeSchema } from '../validation';
import ComparatioMap from './comparatioMap';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN' || getPermission("Employee", "EDIT") == PERMISSION_LEVEL.ORGANIZATION;
const isEmployee = getUserType() == 'EMPLOYEE';

export default class Customization extends Component {
    constructor(props) {
        super(props)

        this.state = {
            editable: false,
            id: props.employeeId || 0,
            employee: props.employee || {
                id: 0,
                name: "",
                active: true,
            },
            salaryCalculationMode: "",
        }
    }
    componentDidMount() {
        this.reloadSalary(this.state.id);

    }

   

    
    reloadSalary = (id) => {
        getSalaryInformation(id).then(res => {
            let employee = res.data;
            this.setState({
                employee,
                salaryCalculationMode: res.data.salaryCalculationMode
            })
        })
    }
    save = (data, action) => {
        action.setSubmitting(true);
        updateSalaryInformation(data).then(res => {
            if (res.status == "OK") {
                this.reloadSalary(this.state.id);
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
                                    <span>Monthy Salary: <strong> {this.state.employee.monthyPayment} {getCurrency()} </strong></span>
                                </div>
                                {!editable && isCompanyAdmin && <Anchor className="edit-icon" onClick={() => {
                                    this.setState({ editable: true })
                                }}><i className="fa fa-edit"></i></Anchor>}
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={this.state.employee}
                                    onSubmit={this.save}
                                    validationSchema={SalaryBasicAndModeSchema}
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
                                                        <Field readOnly={!editable} name="basicSalary" className="form-control"></Field>
                                                        <ErrorMessage name="basicSalary">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>

                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Salary Calculation Mode
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field readOnly={!editable} name="salaryCalculationMode" className="form-control"
                                                            render={field => {
                                                                return <EnumDropdown readOnly={!editable} label={"Salary Calculation Mode"} enumObj={SALARY_MODE} defaultValue={this.state.salaryCalculationMode} onChange={e => {
                                                                    setFieldValue("salaryCalculationMode", e.target.value)
                                                                }}>
                                                                </EnumDropdown>
                                                            }}
                                                        ></Field>
                                                        <ErrorMessage name="salaryCalculationMode">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                                {(isCompanyAdmin || editable) && <div className='col-md-12'>
                                                    <input disabled={!isCompanyAdmin || !editable} type="submit" className="btn btn-primary btn-sm" value="Update" />
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
               {/* {isCompanyAdmin && <ComparatioMap empSalary={this.state.employee.monthyPayment} employeeId={this.state.id} ></ComparatioMap>}  */}
            </>
        )
    }
}
