import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getgratuitySettings, updategratuitySettings } from './service';
import { GratuitySchema } from './validation';
import { verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../utility';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { confirmAlert } from 'react-confirm-alert';

export default class GratuitySettingForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            gratuity: this.props.gratuityData?.[0] || {} 
        }
    }

    

    componentDidUpdate(prevProps) {
        if (prevProps.gratuityData !== this.props.gratuityData) {
            this.setState({
                gratuity: this.props.gratuityData?.[0] || {}
            });
        }
    }

    save = (data, action) => {
        const payload = {
            ...data,
            branchId: this.props.gratuityData[0]?.branchId,
            id: 0 
        };
        action.setSubmitting(true);
        confirmAlert({
            message: `Are you sure you want to Save?`,
            buttons: [
                {
                    label: 'Cancel',
                    onClick: () => { }
                },
                {
                    label: "I'm Sure",
                    className: "confirm-alert",
                    onClick: () => {
                        updategratuitySettings(payload).then(res => {
                            if (res.status === "OK") {
                                toast.success(res.message);
                            } else {
                                toast.error(res.message);
                            }
                            action.setSubmitting(false);
                        }).catch(err => {
                            console.error({ err });
                            toast.error("Error while saving gratuity");
                            action.setSubmitting(false);
                        });
                    },
                }
            ]
        });

    }

    render() {
        const { gratuity } = this.state;
        return (
            <>
                <div className='endofService-form'>
                    <div className="row ">
                        <div className="col">
                            <p className="endofService-title">Gratuity</p>
                        </div>
                    </div>
                    {/* /Page Body */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card-body">
                                {verifyOrgLevelViewPermission("Module Setup Pay") && <Formik
                                    enableReinitialize={true}
                                    initialValues={{
                                        gratuityServiceRequired: gratuity.gratuityServiceRequired || '',
                                        gratuityAmountPer: gratuity.gratuityAmountPer || '',
                                        gratuityServiceRequiredMax: gratuity.gratuityServiceRequiredMax || '',
                                        gratuityAmountPerMax: gratuity.gratuityAmountPerMax || ''
                                    }}
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
                                        isSubmitting
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
                                    )}
                                </Formik>}
                                {!verifyOrgLevelViewPermission("Module Setup Pay") && <AccessDenied></AccessDenied>}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
