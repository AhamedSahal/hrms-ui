import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import EmployeeDropDownByAdmin from '../../CompanyApp/ModuleSetup/Dropdown/EmployeeDropDownByAdmin';
import CompanyDropDownByAdmin from '../../CompanyApp/ModuleSetup/Dropdown/CompanyDropDownByAdmin';
import { saveAdmin } from './service';
import EmployeeDropDownByCompany from '../../CompanyApp/ModuleSetup/Dropdown/EmployeeDropDownByCompany';

export default class AdminOwnerForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            company : this.props.company || {},
            ownerDetails: props.ownerDetails || {
                id: 0,
                employeeId: '',
                defaultOwner: false,
                reportingHeadId: '',
                reportingHeadCompanyId: '',
                autoApproval: false,
                companyId: props.companyId,
            }
        }
    }
    save = (data, action) => {
        action.setSubmitting(true);
        if(this.state.company.multiEntity && !data.autoApproval && (!data.reportingHeadCompanyId ||!data.reportingHeadId )){
            return toast.error("Please select the Reporting head company and Employee for the Owner");
        }

        saveAdmin(data).then(res => {
                if (res.status === "OK") {
                    toast.success(res.message);
                    this.props.updateList();
                    this.props.hideForm();
                } else {
                    toast.error(res.message);
                }
                action.setSubmitting(false)
        }).catch(() => {
                toast.error("Please select the Employee to add Owner/Admin");
                action.setSubmitting(false);
            });
    }
    handleEmployeeIdChange = (e) => {
        const newValue = e.target.value;
        this.setState(prevState => ({
            ownerDetails: {
                ...prevState.ownerDetails,
                employeeId: newValue
            }
        }));
    };
    handleReportingHeadCompanyIdChange = (e) => {
        const newValue = e.target.value;
        this.setState(prevState => ({
            ownerDetails: {
                ...prevState.ownerDetails,
                reportingHeadCompanyId: newValue,
                reportingHeadId: 0
            }
        }));
    };

    handleReportingHeadIdChange = (e) => {
        const newValue = e.target.value;
        this.setState(prevState => ({
            ownerDetails: {
                ...prevState.ownerDetails,
                reportingHeadId: newValue
            }
        }));
    };

    render() {
        let { ownerDetails , company} = this.state;
        return (
            <Formik
                enableReinitialize={true}
                initialValues={ownerDetails}
                onSubmit={this.save}
            // validationSchema={CompanySchema}
            >
                {({
                    setFieldValue,
                    /* and other goodies */
                }) => (
                    <Form>
                        <div className="row">
                            <FormGroup  className="col-md-4">
                                <label> Owner
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="employeeId" className="form-control"
                                    render={() => {
                                        return <EmployeeDropDownByAdmin
                                            readOnly={ownerDetails.id > 0}
                                            onChange={this.handleEmployeeIdChange}
                                            defaultValue={ownerDetails.employeeId}
                                            companyId={ownerDetails.companyId}
                                        ></EmployeeDropDownByAdmin>
                                    }}
                                ></Field>
                            </FormGroup>
                            {company.multiEntity && (<>
                            <FormGroup className="col-md-4">
                                <div type="checkbox" name="active" >
                                    <label> Default Owner </label><br />
                                    <i className={`fa fa-2x ${this.state.ownerDetails && this.state.ownerDetails.defaultOwner ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                        onClick={() => {
                                            let { ownerDetails } = this.state;
                                            ownerDetails.defaultOwner = !ownerDetails.defaultOwner
                                            setFieldValue("defaultOwner", ownerDetails.defaultOwner);
                                            this.setState({
                                                ownerDetails
                                            });
                                        }}></i>
                                </div>
                            </FormGroup>
                            <FormGroup className="col-md-4">
                                <div type="checkbox" name="active" >
                                    <label> Auto Approval Required </label><br />
                                    <i className={`fa fa-2x ${this.state.ownerDetails && this.state.ownerDetails.autoApproval ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                        onClick={() => {
                                            let { ownerDetails } = this.state;
                                            ownerDetails.autoApproval = !ownerDetails.autoApproval
                                            setFieldValue("autoApproval", ownerDetails.autoApproval);
                                            this.setState({
                                                ownerDetails
                                            });
                                        }}></i>
                                </div>
                            </FormGroup>
                            <FormGroup className="col-md-4">
                                <label> Reporting Head Company
                                     {!ownerDetails.autoApproval && <span style={{ color: "red" }}>*</span> }
                                </label>
                                <Field required={!ownerDetails.autoApproval} name="reportingHeadCompanyId" className="form-control"
                                    render={() => {
                                        return <CompanyDropDownByAdmin
                                            nodefault={false}
                                            onChange={e => {
                                                setFieldValue("reportingHeadCompanyId", e.target.value);
                                                setFieldValue("reportingHeadId", 0);
                                                this.handleReportingHeadCompanyIdChange(e)
                                            }}
                                            defaultValue={ownerDetails.reportingHeadCompanyId}
                                            companyId={ownerDetails.companyId}
                                            allCompany={false}
                                            title ={"Select Reporting Head Company"}
                                        ></CompanyDropDownByAdmin>
                                    }}
                                ></Field>
                            </FormGroup>
                            {ownerDetails.reportingHeadCompanyId && (
                                <FormGroup className="col-md-4">
                                    <label> Reporting Head
                                        {!ownerDetails.autoApproval && <span style={{ color: "red" }}>*</span> }
                                    </label>
                                    <Field required={!ownerDetails.autoApproval} name="reportingHeadId" className="form-control"
                                        render={() => {
                                            return <EmployeeDropDownByCompany
                                                nodefault={false}
                                                onChange={this.handleReportingHeadIdChange}
                                                defaultValue={ownerDetails.reportingHeadId}
                                                companyId={ownerDetails.reportingHeadCompanyId}
                                                title ={'Select Reporting Head'}
                                            ></EmployeeDropDownByCompany>
                                        }}
                                    ></Field>
                                </FormGroup>
                            )}
                            </>)}
                        </div>
                        <input type="submit" className="btn btn-primary" style={{ marginBottom: "10px" }} value={this.state.ownerDetails.id > 0 ? "Update" : "Save"} />

                    </Form>
                )
                }
            </Formik>
        )
    }
}