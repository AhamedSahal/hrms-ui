import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveCompanySetting } from './service';
import { getByCompanyId, getDefaultRolePermission, updateDefaultRolePermission } from '../../CompanyApp/Settings/Theme/service';



export default class CompanySettingForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companySetting: {
                employerUniqueId: '',
                routingCode: '',
                payrollType: '',
                isApiEnabaled: '',
                thirdPartyClientId: '',
                thirdPartyVendorName: '',
                thirdPartyVendorSettingName: '',
                thirdPartyAuthToken: '',
                whatsAppAuthorizationKey: '',
                whatsAppClientId: '',
                isSyncPeoplehumCustomFields: '',
            },
            companyId: this.props.company?.id,
            defaultPermissionAccess:false,
            enable:false,
        };
    }
    componentDidMount() {
        this.fetchList();
        this.fetchPermissionList();
    } 
    handleDefaultPermission = () => {
       updateDefaultRolePermission(this.state.companyId).then(res => {
        if(res.status === "OK"){
            toast.success(res.message);
            this.fetchList();
            this.setState({ defaultPermissionAccess: false })
        }
        else {
            this.setState({ enable: false })
            this.fetchList();
            toast.error(res.message);
        }
       })
    }; 
    
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.company && nextProps.company != prevState.company) {
            return ({ company: nextProps.company })
        } else if (!nextProps.company) {
            return ({
                companySetting: {
                    employerUniqueId: '',
                    routingCode: '',
                    payrollType: '',
                    apiEnabaled: '',   
                },
                companyId: '',
            })
        }
        return null;
    }
    save = (data, action) => {
        console.log(data);
        action.setSubmitting(true);
            const companyId = this.state.companyId;
        saveCompanySetting({ ...data, companyId })
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
                toast.error("Error while saving company setting");
                action.setSubmitting(false);
            });
    }

    fetchList = () => {
        getByCompanyId(this.state.companyId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    companySetting: res.data,
                })
            }
        })
    }
    fetchPermissionList = () => {
        getDefaultRolePermission(this.state.q, this.state.page, this.state.size, this.state.sort,this.state.companyId).then(res => {
        if (res.status === "OK") {
            let roles = res.data.list;
            const allRolesHaveEmpty = roles.every(role => role.roleActionEntities.length === 0);
            this.setState({ defaultPermissionAccess: allRolesHaveEmpty });
        }
        })
    }

    render() {
        console.log(this.state.defaultPermissionAccess);
        console.log(this.state.companySetting);
        return (
            <div>
            <div className="page-container content container-fluid" style={{ marginTop: "50px" }}>
                <div className="tablePage-header">
                    <div className="row pageTitle-section">
                        <div className="col-md-10">
                            <h3 className="tablePage-title">Company Setting </h3>
                        </div>
                    </div>
                </div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.companySetting}
                    onSubmit={this.save}
                //validationSchema={CompanySchema}
                >
                    {({
                        setFieldValue,
                        /* and other goodies */
                    }) => (
                        <Form>
                        <div className="row">
                            <FormGroup className="col-md-4">
                                <label>Employer Unique ID
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="employerUniqueId" className="form-control"></Field>
                                <ErrorMessage name="employerUniqueId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup className="col-md-4">
                                <label>Routing Code
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="routingCode" className="form-control"></Field>
                                <ErrorMessage name="routingCode">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup className="col-md-4">
                                <div type="checkbox" name="active" onClick={() => {
                                    let { companySetting } = this.state;
                                    companySetting.apiEnabaled = !companySetting.apiEnabaled;
                                    setFieldValue("apiEnabaled", companySetting.apiEnabaled);
                                    this.setState({
                                        companySetting
                                    });

                                }} >
                                    <label> Api Enabaled</label><br />
                                    <i className={`fa fa-2x ${this.state.companySetting && this.state.companySetting.apiEnabaled ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                                {this.state.companySetting.apiEnabaled && <>
                                    <FormGroup className="col-md-4">
                                        <label>Api Key
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="apiKey" className="form-control" readOnly></Field>
                                    </FormGroup>
                                </>}
                                <FormGroup className="d-none md-col-4">
                                    <label>WhatsApp Authorization Key
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="whatsAppAuthorizationKey" className="form-control"></Field>
                                    <ErrorMessage name="whatsAppAuthorizationKey">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                {/* Temporary Hidden */}
                                <FormGroup className="d-none md-col-4">
                                    <label>WhatsApp Client Id
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="whatsAppClientId" className="form-control"></Field>
                                    <ErrorMessage name="whatsAppClientId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className="col-md-4">
                                    <label>Third Party Client Id
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="thirdPartyClientId" className="form-control"></Field>
                                    <ErrorMessage name="thirdPartyClientId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className="col-md-4">
                                    <label>Third Party Vendor Name
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="thirdPartyVendorName" className="form-control"></Field>
                                    <ErrorMessage name="thirdPartyVendorName">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className="col-md-4">
                                    <label>Third Party Vendor Setting Name
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="thirdPartyVendorSettingName" className="form-control"></Field>
                                    <ErrorMessage name="thirdPartyVendorSettingName">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className="col-md-4">
                                    <label>Third Party Auth token
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="thirdPartyAuthToken" className="form-control"></Field>
                                    <ErrorMessage name="thirdPartyAuthToken">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>

                                <FormGroup className="col-md-4">
                                    <div type="checkbox" name="active" onClick={() => {
                                        let { companySetting } = this.state;
                                        companySetting.syncPeoplehumCustomFields = !companySetting.syncPeoplehumCustomFields;
                                        setFieldValue("syncPeoplehumCustomFields", companySetting.syncPeoplehumCustomFields);
                                        this.setState({
                                            companySetting
                                        });

                                    }} >
                                        <label>Sync Peoplehum Custom Fields</label><br />
                                        <i className={`fa fa-2x ${this.state.companySetting && this.state.companySetting.syncPeoplehumCustomFields ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}></i>
                                    </div>
                                </FormGroup>
                            </div>
                            <input type="submit" className="btn btn-primary" style={{marginBottom:"10px"}} value={this.state.companyId > 0 ? "Update" : "Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
            {this.state.defaultPermissionAccess && 
            <div className="page-container content container-fluid" style={{ marginTop: "50px" }}>
                <div className="col-md-10">
                    <h3 className="tablePage-title" style={{paddingTop:"12px"}}>Company Default Role Permission Access </h3>
                </div>
            <Formik
                    enableReinitialize={true}
                    initialValues={this.state}
                    onSubmit={this.save}
                //validationSchema={CompanySchema}
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
                        <FormGroup className="col-md-4">
                            <div className="row">
                                <div type="checkbox" name="active" onClick={e => {
                                        let { enable } = this.state;
                                        this.handleDefaultPermission();
                                        enable= ! enable;
                                            setFieldValue("enable", enable);
                                            this.setState({ enable });
                                        }
                                    }>
                                    <label>Set Default Permission Access</label><br />
                                        <i className={`fa fa-2x ${this.state && this.state.enable ?'fa-toggle-on text-success' :'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </div>
                        </FormGroup>
                        </Form>
                    )
                }
                </Formik>
                </div>}
         </div>
        )
    }
}
