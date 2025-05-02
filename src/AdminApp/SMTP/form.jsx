import React, { Component } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { save, get, saveSmtp } from './service';
import { FormGroup } from 'reactstrap';
import { SMTPSchema } from './validation';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class SMTPForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            smtp: {}
        }

    }
    componentDidMount() {
        this.getSMTPDetails();
    }
    getSMTPDetails() {
        get().then(res => {
            if (res.status == "OK") {
                this.setState({ smtp: res.data })
            }
        })
    }
    save = (data, action) => {
        action.setSubmitting(true);
        save(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.log(err)
            toast.error("Error while saving SMTP details");
            action.setSubmitting(false);
        })
        saveSmtp(data).then(res => {
            if (res.status == "OK") {
                //toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.log(err)
            toast.error("Error while saving SMTP details");
            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Application Configuration Management - WorkPlus</title>
                    <meta name="description" content="SMTP page" />
                </Helmet>
                {/* Page Content */}
                <div className="moduleSetupPageContainer">
                    <div className="page-container content container-fluid">
                        {/* Page Header */}
                        <div className="tablePage-header">
                            <div className="row pageTitle-section">
                                <div className="col">
                                    <h3 className="tablePage-title">Application Configuration Management</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                                        <li className="breadcrumb-item active">Configuration</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-12'>

                                <Formik
                                    enableReinitialize={true}
                                    initialValues={this.state.smtp}
                                    onSubmit={this.save}
                                    validationSchema={SMTPSchema}
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
                                        <Form autoComplete="off" ><div className="card-body">
                                            <div className="row">
                                                <h3 className="tablePage-title">SMTP <small> SMTP server address for sending emails</small> </h3>
                                                <div className="col-md-6">
                                                    <FormGroup>
                                                        <label>User Name
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field name="userName" className="form-control" autoComplete="off"></Field>
                                                        <ErrorMessage name="userName">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-6">
                                                    <FormGroup>
                                                        <label>Password
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field name="password" className="form-control" type="password" autoComplete="off"></Field>
                                                        <ErrorMessage name="password">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <FormGroup>
                                                        <label>
                                                            Host
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field name="host" className="form-control" autoComplete="off"></Field>
                                                        <ErrorMessage name="host">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-6">
                                                    <FormGroup>
                                                        <label>
                                                            Port
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field name="port" className="form-control" autoComplete="off"></Field>
                                                        <ErrorMessage name="port">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <FormGroup>
                                                <label>
                                                    From Email
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field name="fromEmail" className="form-control" autoComplete="off"></Field>
                                                <ErrorMessage name="fromEmail">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                            <hr />
                                            <h3 className="tablePage-title">WhatsApp <small>WhatsApp API Key for sending messages via WhatsApp</small></h3>
                                            <FormGroup>
                                                <label>WhatsApp Key </label>
                                                <Field name="whatsAppKey" className="form-control" type="password" autoComplete="off"></Field>
                                            </FormGroup>
                                            <hr />
                                            <h3 className="tablePage-title">SSO <small>Single Sign-On settings for Microsoft & Google </small></h3>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Microsoft Client Id </label>
                                                        <Field name="ssoMicrosoftClientId" className="form-control" type="password" autoComplete="off"></Field>
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Microsoft Client Secret </label>
                                                        <Field name="ssoMicrosoftClientSecret" className="form-control" type="password" autoComplete="off"></Field>
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Microsoft Tenant Id </label>
                                                        <Field name="ssoMicrosoftTenantId" className="form-control" type="password" autoComplete="off"></Field>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Google Client Id </label>
                                                        <Field name="ssoGoogleClientId" className="form-control" type="password" autoComplete="off"></Field>
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Google Client Secret </label>
                                                        <Field name="ssoGoogleClientSecret" className="form-control" type="password" autoComplete="off"></Field>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <hr />
                                                <h3 className="tablePage-title"> Map </h3>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Google Map API Key </label>
                                                        <Field name="googleMapApiKey" className="form-control" type="password" autoComplete="off"></Field>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <input type="submit" className="btn btn-primary" value="Update" />
                                        </div>
                                        </Form>
                                    )
                                    }
                                </Formik>
                            </div>
                        </div >
                    </div >
                </div>
            </div >
        )
    }
}
