import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import PlanDropdown from '../../CompanyApp/ModuleSetup/Dropdown/PlanDropdown';
import PasswordField from '../../initialpage/PasswordField';
import { saveCompany } from './service';
import { CompanySchema } from './validation';

export default class CompanyForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            company: props.company || {
                id: 0,
                companyName: "",
                contactName: "",
                email: "",
                password: "",
                active: true,
                planId: 0,
                planEntity: { id: 0 },
                address: ""
            }
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.company && nextProps.company != prevState.company) {
            return ({ company: nextProps.company })
        } else if (!nextProps.company) {
            return ({
                company: {
                    id: 0,
                    companyName: "",
                    contactName: "",
                    email: "",
                    password: "",
                    active: true,
                    planId: 0,
                    planEntity: { id: 0 },
                    address: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveCompany(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
                this.props.getCompanyDetails(res.data);
                this.props.onFormSave();
            } else {
                throw new Error(res.message);
            }
        }).catch(err => {
            toast.error(err.message || "Error while saving company");
        })
        .finally(() => {
            action.setSubmitting(false);
        });
    }
    render() {
        return (
            <div className="page-container content container-fluid" style={{ marginTop: "50px" }}>
                <div className="tablePage-header">
                    <div className="row pageTitle-section">
                        <div className="col-md-10">
                            <h3 className="tablePage-title">Company Details</h3>
                        </div>
                    </div>
                </div>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.company}
                    onSubmit={this.save}
                    validationSchema={CompanySchema}
                >
                    {({
                        setFieldValue,
                        /* and other goodies */
                    }) => (
                        <Form>
                            <div className="row">
                            <FormGroup className="col-md-4">
                                <label>Company Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="companyName" className="form-control"></Field>
                                <ErrorMessage name="companyName">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            <FormGroup className="col-md-4">
                                <label>Contact Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field  name="contactName" className="form-control"></Field>
                                <ErrorMessage name="contactName">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>

                            </FormGroup>

                            <FormGroup className="col-md-4">
                                <label>
                                    Email
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="email"
                                    readOnly={this.state.company.id > 0} className="form-control"></Field>
                                <ErrorMessage name="email">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup className="col-md-4">
                                <label>
                                    Address
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="address"
                                    className="form-control"></Field>
                                <ErrorMessage name="address">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup className="col-md-4">
                                <label>Plan
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="planId" render={() => {
                                    return <PlanDropdown defaultValue={this.state.company.planId} onChange={e => {
                                        setFieldValue("planId", e.target.value);
                                        setFieldValue("planEntity", { id: e.target.value });
                                    }}></PlanDropdown>
                                }}></Field>
                                <ErrorMessage name="planId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            {this.state.company.id == 0 ?
                                <FormGroup className="col-md-4">
                                    <label>
                                        Password
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <PasswordField name="password" type = 'password' onChange={(value) => {
                                        setFieldValue("password", value);
                                    }} />
                                    <ErrorMessage name="password">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup> : <></>}

                            <FormGroup className="col-md-4">

                                <div type="checkbox" name="active" onClick={() => {
                                    let { company } = this.state;
                                    company.active = !company.active;
                                    setFieldValue("active", company.active);
                                    this.setState({
                                        company
                                    });

                                }} >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.company && this.state.company.active ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                        </div>
                            <input type="submit" className="btn btn-primary" style={{marginBottom:"10px"}} value={this.state.company.id > 0 ? "Update" : "Save"} />

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
