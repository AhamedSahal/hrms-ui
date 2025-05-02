import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { Form, Formik } from 'formik';
import { FormGroup } from 'reactstrap';
import { Row } from 'antd';
import { getConfiguration, updateConfiguration } from './service';


export default class AttendanceConfiguration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            attendanceConfig: {
                id: '',
                webAttendance: false,
                mobileAttendance: false,
                biometricIntegration: false,
                autoAttendance: false,
            },
            data: [],
        }
    }

    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        getConfiguration().then(res => {
            this.setState({
                attendanceConfig: res.data,
            })
        })
    }
    save = (data, action) => {
        action.setSubmitting(true);
        updateConfiguration(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.fetchList();
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while updating configuration");

            action.setSubmitting(false);
        })
    }
    render() {
        const { data, attendanceConfig } = this.state;
        return (
            <>
                <div className="page-container content container-fluid" >
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col-md-10">
                                <h3 className="tablePage-title">Manage Default Attendance Configuration</h3>
                            </div>
                        </div>
                    </div>
                    <Formik
                        enableReinitialize={true}
                        initialValues={attendanceConfig}
                        onSubmit={this.save}
                    //validationSchema={}
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
                                <Row>
                                    <FormGroup className="col-md-3">
                                        <div type="checkbox" name="active" >
                                            <label>Auto Attendance</label><br />
                                            <i className={`fa fa-2x ${attendanceConfig.autoAttendance ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                                onClick={e => {
                                                    let { attendanceConfig } = this.state;
                                                    attendanceConfig.autoAttendance = !attendanceConfig.autoAttendance;
                                                    setFieldValue("autoAttendance", attendanceConfig.autoAttendance);
                                                    this.setState({
                                                        attendanceConfig
                                                    });
                                                }}></i>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="col-md-3">
                                        <div type="checkbox" name="active" >
                                            <label>Web Attendance</label><br />
                                            <i className={`fa fa-2x ${attendanceConfig.webAttendance ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                                onClick={e => {
                                                    let { attendanceConfig } = this.state;
                                                    attendanceConfig.webAttendance = !attendanceConfig.webAttendance;
                                                    setFieldValue("webAttendance", attendanceConfig.webAttendance);
                                                    this.setState({
                                                        attendanceConfig
                                                    });
                                                }}></i>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="col-md-3">
                                        <div type="checkbox" name="active" >
                                            <label>Mobile Attendance</label><br />
                                            <i className={`fa fa-2x ${attendanceConfig.mobileAttendance ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                                onClick={e => {
                                                    let { attendanceConfig } = this.state;
                                                    attendanceConfig.mobileAttendance = !attendanceConfig.mobileAttendance;
                                                    setFieldValue("mobileAttendance", attendanceConfig.mobileAttendance);
                                                    this.setState({
                                                        attendanceConfig
                                                    });
                                                }}></i>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="col-md-3">
                                        <div type="checkbox" name="active" >
                                            <label>Biometric Integration</label><br />
                                            <i className={`fa fa-2x ${attendanceConfig && attendanceConfig.biometricIntegration ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                                onClick={e => {
                                                    let { attendanceConfig } = this.state;
                                                    attendanceConfig.biometricIntegration = !attendanceConfig.biometricIntegration;
                                                    setFieldValue("biometricIntegration", attendanceConfig.biometricIntegration);
                                                    this.setState({
                                                        attendanceConfig
                                                    });
                                                }}></i>
                                        </div>
                                    </FormGroup>
                                </Row>
                                <input type="submit" className="btn btn-primary" style={{ marginBottom: "10px" }} value={this.state.attendanceConfig.id > 0 ? "Update" : "Save"}
                                    disabled={!attendanceConfig.autoAttendance && !attendanceConfig.biometricIntegration && !attendanceConfig.mobileAttendance && !attendanceConfig.webAttendance} />
                            </Form>
                        )}
                    </Formik>
                </div>
            </>)
    }
}