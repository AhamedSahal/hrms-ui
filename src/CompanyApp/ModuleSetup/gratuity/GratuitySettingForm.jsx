import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getgratuitySettings, updategratuitySettings } from './service';
import { GratuitySchema } from './validation';
import { verifyOrgLevelViewPermission, verifyOrgLevelEditPermission } from '../../../utility';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';

export default class GratuitySettingForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            gratuity: {}
        }
    }
    componentDidMount() {
        if (verifyOrgLevelViewPermission("Module Setup Pay")) {
            getgratuitySettings().then(res => {
                if (res.status == "OK") {
                    this.setState({ gratuity: res.data })
                }
            })
        }
    }
    save = (data, action) => {
        action.setSubmitting(true);
        updategratuitySettings(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.log({ err });
            toast.error("Error while saving gratuity");
            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <>
                <div className="page-container content container-fluid">
                    {/* Page Header */}
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Gratuity</h3>
                            </div>



                        </div>
                    </div>

                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card-body">
                                {verifyOrgLevelViewPermission("Module Setup Pay") && <Formik
                                    enableReinitialize={true}
                                    initialValues={this.state.gratuity}
                                    onSubmit={this.save}
                                    validationSchema={GratuitySchema}
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
                                        <Form>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Minimum Service Duration (Years)
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field name="gratuityServiceRequired" type="number" className="form-control"></Field>
                                                        <ErrorMessage name="gratuityServiceRequired">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Amount (Days of Basic Salary)
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field name="gratuityAmountPer" type="number" className="form-control"></Field>
                                                        <ErrorMessage name="gratuityAmountPer">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Minimum Service Duration (Years)
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field name="gratuityServiceRequiredMax" type="number" className="form-control"></Field>
                                                        <ErrorMessage name="gratuityServiceRequiredMax">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Amount (Days of Basic Salary)
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field name="gratuityAmountPerMax" type="number" className="form-control"></Field>
                                                        <ErrorMessage name="gratuityAmountPerMax">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            {verifyOrgLevelEditPermission("Module Setup Pay") && <input type="submit" style={{ color: 'white', background: '#102746' }} className="btn" value="Save" />}
                                        </Form>
                                    )
                                    }
                                </Formik>}
                                {!verifyOrgLevelViewPermission("Module Setup Pay") && <AccessDenied></AccessDenied>}
                            </div>
                        </div>
                    </div>
                </div>


            </>
        )
    }
}
