import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { saveCompanySSOKey } from './service';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getByCompanyId } from '../../CompanyApp/Settings/Theme/service';

export default class ManageSSOForm extends Component {
    constructor(props) {
        super(props);
        let companyId = this.props.company?.id;
        this.state = {
            manageSSOKey:{
            isSsoKeyEnabled:'',
        },
            manageSSOKey:{},
            companyId: this.props.company?.id,
        };
    }
    componentDidMount (){
        this.fetchList();
    }
    fetchList = (companyId) => {
        getByCompanyId(this.state.companyId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    manageSSOKey: res.data,
                })
            }
        })
    }
    save = (data,action) => {
        action.setSubmitting(true);
        const companyId = this.state.companyId;
        const ssoKeyEnabled = data.ssoEnabled; 
        saveCompanySSOKey(ssoKeyEnabled, companyId )
            .then(res => {
                if (res.status === "OK") {
                    toast.success(res.message);
                    this.fetchList();
                } else {
                    this.props.FetchList();
                    toast.error(res.message);
                }
                action.setSubmitting(false);
            }).catch(err => {
                toast.error("Error while saving SSO Key");
               action.setSubmitting(false);
            });
        }

    render() {
        return (
            <div className="page-container content container-fluid" style={{ marginTop: "50px" }}>
            <div className="tablePage-header">
                <div className="row pageTitle-section">
                    <div className="col-md-10">
                        <h3 className="tablePage-title">Manage SSO </h3>
                    </div>
                </div>
            </div>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.manageSSOKey}
                    onSubmit={this.save}
                //validationSchema={CompanySchema}
                >
                    {({
                        setFieldValue,
                        /* and other goodies */
                    }) => (
                        <Form>
                            <FormGroup className="col-md-4">
                                <div type="checkbox" name="active" onClick={() => {
                                    let { manageSSOKey } = this.state;
                                    manageSSOKey.ssoEnabled = !manageSSOKey.ssoEnabled;
                                    setFieldValue("ssoEnabled", manageSSOKey.ssoEnabled);
                                    this.setState({
                                        manageSSOKey
                                    });

                                }} >
                                    <label> SSO Enabled</label><br />
                                    <i className={`fa fa-2x ${this.state.manageSSOKey && this.state.manageSSOKey.ssoEnabled ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                            {this.state.manageSSOKey.ssoEnabled && <>
                            <FormGroup className="col-md-4">
                                <label>SSO Key
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="ssoKey" className="form-control" readOnly></Field>
                                <ErrorMessage name="ssoKey">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            </>}
                            <input type="submit" className="btn btn-primary" style={{marginBottom:"10px"}} value={this.state.companyId > 0 ? "Update" : "Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
