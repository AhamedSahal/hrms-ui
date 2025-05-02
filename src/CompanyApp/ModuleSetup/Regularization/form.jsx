import React, { Component } from 'react';
import { ErrorMessage, Field, Formik, Form } from "formik"

import { toLocalCalendarTime, toUTCCalendarTime, verifyViewPermission,verifyOrgLevelViewPermission } from "../../../utility"
import AccessDenied from "../../../MainPage/Main/Dashboard/AccessDenied"
import { FormGroup } from 'reactstrap';
import { toast } from 'react-toastify';
import { updateRegularizationSettings,getList } from './service';


export default class RegularizationSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            RegularizationSettings: props.RegularizationSettings || {
                id: 0,
                regularizationEnabled: false,
                regResetAttEnable: true
            }
        }
    }
    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        if (verifyOrgLevelViewPermission("Module Setup Manage")) {
            getList().then(res => {
                if (res.status == "OK") {
                   this.setState({RegularizationSettings: res.data})
                }
            })
        }
    }
    save = (data, action) => {
        
        updateRegularizationSettings(data).then(res => {
            if (res.status == "OK") {
                // this.fetchList();
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            // console.log({ err });
            toast.error("Error while saving regularization");
            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div className="mt-4 content container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Regularization</h5>
                            </div>
                            <div className="card-body">
                                {/* {verifyViewPermission("ATTENDANCE") && */}
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={this.state.RegularizationSettings}
                                    onSubmit={this.save}
                                // validationSchema={FormatSchema}
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
                                    }) => (
                                        <Form>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <div type="checkbox" name="regularizationEnabled" onClick={e => {
                                                            let { RegularizationSettings } = this.state;
                                                            RegularizationSettings.regularizationEnabled = !RegularizationSettings.regularizationEnabled;
                                                            setFieldValue("regularizationEnabled", RegularizationSettings.regularizationEnabled);

                                                        }} >
                                                            <label>Enable Regularization</label><br />
                                                            <i className={`fa fa-2x ${this.state.RegularizationSettings
                                                                && this.state.RegularizationSettings.regularizationEnabled
                                                                ? 'fa-toggle-on text-success' :
                                                                'fa fa-toggle-off text-danger'}`}></i>
                                                        </div>
                                                    </FormGroup>
                                                </div>
                                                {/* <div className="col-md-4">
                                                    <FormGroup>
                                                        <div type="checkbox" name="regResetAttEnable" onClick={e => {
                                                            let { RegularizationSettings } = this.state;
                                                            RegularizationSettings.regResetAttEnable = !RegularizationSettings.regResetAttEnable;
                                                            setFieldValue("regResetAttEnable", RegularizationSettings.regResetAttEnable);
                                                        }} >
                                                            <label>Enable Reset Attendance</label><br />
                                                            <i className={`fa fa-2x ${this.state.RegularizationSettings
                                                                && this.state.RegularizationSettings.regResetAttEnable
                                                                ? 'fa-toggle-on text-success' :
                                                                'fa fa-toggle-off text-danger'}`}></i>
                                                        </div>
                                                    </FormGroup>
                                                </div> */}
                                            </div>
                                            <input type="submit" className="btn btn-primary" value="Save" />
                                        </Form>
                                    )}
                                </Formik>
                                
                                {!verifyViewPermission("ATTENDANCE") && <AccessDenied></AccessDenied>} 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}




