import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import GradesDropdown from '../../ModuleSetup/Dropdown/GradesDropdown';
import { saveBenefitsType } from './service';
import { BenefitsModuleSetupSchema } from './validation';


export default class BenefitsForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Benefits: props.Benefits || {
                id: 0,
                name: "",
                gradesId: 0,
                grades: {
                    id: 0,
                },
                paymenttype: null,
                paymentcycle: null,
                eligibility: null,
                maxperson: 0,
                maxemployee: 0
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.Benefits && nextProps.Benefits != prevState.Benefits) {
            return ({ Benefits: nextProps.Benefits })
        } else if (!nextProps.Benefits) {

            return prevState.Benefits || ({
                Benefits: {
                    id: 0,
                    name: "",
                    gradesId: 0,
                    grades: {
                        id: 0,
                    },
                    paymenttype: null,
                    paymentcycle: null,
                    eligibility: null,
                    maxperson: 0,
                    maxemployee: 0
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        data["gradesId"] = data["grades"]["id"];

            saveBenefitsType(data).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
                if (res.status == "OK") { this.props.updateList(res.data) }
                action.setSubmitting(false)
            }).catch(err => {
                toast.error("Error while saving Benefit Type");
                action.setSubmitting(false);
            })     
    }
    render() {
        return (
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.Benefits}
                    onSubmit={this.save}
                validationSchema={BenefitsModuleSetupSchema}
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
                            <div className='row'>
                                <div className='col-md-6'>
                                    <FormGroup>
                                        <label>Grade <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="gradesId" render={field => {
                                            return <GradesDropdown defaultValue={values.grades?.id} onChange={e => {
                                                setFieldValue("gradesId", e.target.value);
                                                setFieldValue("grades", { id: e.target.value });
                                            }}></GradesDropdown>
                                        }}></Field>
                                        <ErrorMessage name="gradesId">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Start Date <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="startDate" type="date" defaultValue={values.startDate} className="form-control" required></Field>
                                        <ErrorMessage name="startDate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>

                            <FormGroup>
                                <label>Name <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" defaultValue={values.name} className="form-control" required></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <div className="row">
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Payment Type <span style={{ color: "red" }}>*</span></label>
                                        <select id="paymenttype" className="form-control" name="paymenttype"
                                            onChange={e => {
                                                setFieldValue("paymenttype", e.target.value)
                                            }} defaultValue={values.paymenttype}>
                                            <option value="">Select Payment Type</option>
                                            <option selected={this.state.Benefits && this.state.Benefits.paymenttype == 0} value="0">Payroll</option>
                                            <option selected={this.state.Benefits && this.state.Benefits.paymenttype == 1} value="1">Provided</option>
                                            <option selected={this.state.Benefits && this.state.Benefits.paymenttype != 0 && this.state.Benefits.paymenttype != 1} value="2">Reimbursed</option>
                                        </select>
                                    </FormGroup>
                                    <ErrorMessage name="paymenttype">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Payment Cycle <span style={{ color: "red" }}>*</span></label>
                                        <select id="paymentcycle" className="form-control" name="paymentcycle"
                                            onChange={e => {
                                                setFieldValue("paymentcycle", e.target.value)
                                            }} defaultValue={values.paymentcycle}>
                                            <option value="">Select Payment Cycle</option>
                                            <option selected={this.state.Benefits && this.state.Benefits.paymentcycle == 0} value="0">Monthly</option>
                                            <option selected={this.state.Benefits && this.state.Benefits.paymentcycle == 1} value="1">Quarterly</option>
                                            <option selected={this.state.Benefits && this.state.Benefits.paymentcycle == 2} value="2">Half Yearly</option>
                                            <option selected={this.state.Benefits && this.state.Benefits.paymentcycle == 3} value="3">Annually</option>
                                            <option selected={this.state.Benefits && this.state.Benefits.paymentcycle != 0 && this.state.Benefits.paymentcycle != 1 && this.state.Benefits.paymentcycle != 2 && this.state.Benefits.paymentcycle != 3} value="4">24 Months</option>
                                        </select>
                                    </FormGroup>
                                    <ErrorMessage name="paymentcycle">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Due Date <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="dueDate" type="date" defaultValue={values.dueDate} className="form-control" required></Field>
                                        <ErrorMessage name="dueDate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Eligibility <span style={{ color: "red" }}>*</span></label>
                                        <select id="eligibility" className="form-control" name="eligibility"
                                            onChange={e => {
                                                setFieldValue("eligibility", e.target.value)
                                            }} defaultValue={values.eligibility}>
                                            <option value="">Select Eligibility</option>
                                            <option selected={this.state.Benefits && this.state.Benefits.eligibility == 0} value="0">Employee</option>
                                            <option selected={this.state.Benefits && this.state.Benefits.eligibility == 1} value="1">Employee + Spouse</option>
                                            <option selected={this.state.Benefits && this.state.Benefits.eligibility != 0 && this.state.Benefits.eligibility != 1} value="2">Employee + Spouse + 1 child</option>
                                            <option selected={this.state.Benefits && this.state.Benefits.eligibility != 0 && this.state.Benefits.eligibility != 1 && this.state.Benefits.eligibility != 2} value="3">Employee + Spouse + 2 child</option>
                                            <option selected={this.state.Benefits && this.state.Benefits.eligibility != 0 && this.state.Benefits.eligibility != 1 && this.state.Benefits.eligibility != 2 && this.state.Benefits.eligibility != 3} value="4">Employee + Spouse + 3 child</option>
                                        </select>
                                    </FormGroup>
                                    <ErrorMessage name="eligibility">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </div>
                                <div className='col-md-6'>
                                    <FormGroup>
                                        <label>Max Limit Per Person <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="maxperson" defaultValue={values.maxperson} className="form-control" required type="number"></Field>
                                        <ErrorMessage name="maxperson">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className='col-md-6'>
                                    <FormGroup>
                                        <label>Max Benefits Limit <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="maxemployee" defaultValue={values.maxemployee} className="form-control" required type="number"></Field>
                                        <ErrorMessage name="maxemployee">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>

                            <input type="submit" className="btn btn-primary" value={this.state.Benefits.id > 0 ? "Update" : "Add"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
