import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getOvertimeSettings, updateOvertimeSettings } from './service';
import { verifyOrgLevelViewPermission, verifyOrgLevelEditPermission } from '../../../utility';
import { overtimeSchema } from './validation';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
export default class OvertimeSettingForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            overtime: {}
        }
    }
    componentDidMount() {
        if (verifyOrgLevelViewPermission("Module Setup Pay")) {
            getOvertimeSettings().then(res => {
                if (res.status == "OK") {
                    this.setState({ overtime: res.data })
                }
            })
        }
    }
    save = (data, action) => {
        action.setSubmitting(true);
        updateOvertimeSettings(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.log({ err });
            toast.error("Error while saving overtime");
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
                                <h3 className="tablePage-title">Overtime</h3>
                            </div>



                        </div>
                    </div>

                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card-body">
                                {verifyOrgLevelViewPermission("Module Setup Pay") && <Formik
                                    enableReinitialize={true}
                                    initialValues={this.state.overtime}
                                    onSubmit={this.save}
                                    validationSchema={overtimeSchema}
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
                                                <div className="col-md-6">
                                                    <FormGroup>
                                                        <label>Overtime Amount (% of Basic Salary) on Holidays
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field name="overtimePayOnHoliday" type="number" className="form-control"></Field>
                                                        <ErrorMessage name="overtimePayOnHoliday">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-6">
                                                    <FormGroup>
                                                        <label>Overtime Amount (% of Basic Salary) on Working days
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field name="overtimePayOnWorkingDay" type="number" className="form-control"></Field>
                                                        <ErrorMessage name="overtimePayOnWorkingDay">
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
