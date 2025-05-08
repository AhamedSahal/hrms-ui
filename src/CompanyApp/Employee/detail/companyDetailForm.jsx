import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Modal, Anchor } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getUserType, toLocalTime, toLocalCalendarTime, toUTCCalendarTime, verifyEditPermission, getPermission, getRoleId, verifyViewPermission, verifyRoleEditPermissionforSelf, verifyViewPermissionForTeam, verifyOrgLevelViewPermission, getReadableDate } from '../../../utility';
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../../ModuleSetup/Dropdown/DepartmentDropdown';
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
import WeekDaysDropdown from '../../ModuleSetup/Dropdown/WeekDaysDropdown';
import DivisionDropdown from '../../ModuleSetup/Dropdown/DivisionDropdown';
import JobTitlesDropdown from '../../ModuleSetup/Dropdown/JobTitlesDropdown';
import GradesDropdown from '../../ModuleSetup/Dropdown/GradesDropdown';
import SectionDropdown from '../../ModuleSetup/Dropdown/SectionDropdown';
import FunctionDropdown from '../../ModuleSetup/Dropdown/FunctionDropdown';
import { getCompanyInformation, updateCompanyInformation } from './service';
import { getOrgSettings, updateOrgSettings } from '../../ModuleSetup/OrgSetup/service';
import { PERMISSION_LEVEL } from '../../../Constant/enum';
import EmploymentStatusDropdown from '../../ModuleSetup/Dropdown/EmploymentStatusDropdown';
import EntityDropdown from '../../ModuleSetup/Dropdown/EntityDropdown';

const { Header, Body, Footer, Dialog } = Modal;

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const isEmployee = getUserType() == 'EMPLOYEE';
export default class CompanyDetailEmployeeForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editable: false,
            id: props.employeeId || 0,
            orgsetup: false,
            company: {
                id: 0,
                branchId: 0,
                departmentId: 0,
                divisionId: 0,
                jobTitleId: 0,
                gradesId: 0,
                sectionId: 0,
                functionId: 0,
                entityId: 0,
                branch: {
                    id: 0,
                },
                dapartment: {
                    id: 0,
                },
                division: {
                    id: 0,
                },
                jobTitle: {
                    id: 0,
                },
                grades: {
                    id: 0,
                },
                section: {
                    id: 0,
                },
                functions: {
                    id: 0,
                },
                employmentStatus:{
                    id: 0,
                },
                entity: {
                    id: 0,
                },
            }
        }
    }

    componentDidMount() {
        getCompanyInformation(this.state.id).then(res => {
            if (res.status == "OK") {
                this.bindState(res.data)
            } else {
                toast.error(res.message);
            }

        })

        // entity is present validation
        getOrgSettings().then(res => {
            if (res.status == "OK") {
              this.setState({ orgsetup: res.data.entity })
            }
          })
    }

    bindState = (company) => {
        try {
            company.doj = company.doj.substr(0, 10);
        } catch (err) {
            console.log(err);
        }
        this.setState({
            company: company
        })
    }

    save = (data, action) => {
        data["doj"] = new Date(`${data["doj"]} GMT`);
        try {
            data["jobTitleId"] = data["jobTitle"]["id"];
            data["branchId"] = data["branch"]["id"];
            data["gradesId"] = data["grades"]["id"];
            data["divisionId"] = data["division"]["id"];
            data["departmentId"] = data["department"]["id"];
            data["sectionId"] = data["section"]["id"];
            data["functionId"] = data["functions"]["id"];
            data["employmentStatus"] = data["employmentStatus"]["id"];
            data["entity"] = data["entity"]["id"]
        } catch (err) {
            console.log(err);
        }
        action.setSubmitting(true);
        updateCompanyInformation(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                window.location.reload();
                // this.bindState(res.data);
                // this.setState({
                //     editable: false
                // })
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Company Detail");

            action.setSubmitting(false);
        })
    }
    render() {
        const { company, orgsetup } = this.state;
        let { editable } = this.state;
        const isEditAllowed = getPermission("PEOPLE", "EDIT") == PERMISSION_LEVEL.ORGANIZATION;
        if (editable && !isEditAllowed) {
            editable = false;
        }
        return (
            <>
                <div className="pt-3 col-md-6 d-flex">
                    <div className="card profile-box flex-fill">
                        <div className="card-body">
                        <h3 className="card-title">Company Information {!editable && getPermission("PEOPLE", "EDIT") == PERMISSION_LEVEL.ORGANIZATION  && <Anchor style={{ borderRadius: "50%" }} className="btn btn-success btn-sm" onClick={() => {
                                this.setState({ editable: true })
                            }}><i className="fa fa-edit"></i></Anchor>}</h3>
                            <ul className="personal-info">
                                <li>
                                    <div className="title">Employee ID</div>
                                    <div className="text">{company.employeeId}</div>
                                </li>
                                <li>
                                    <div className="title">Role</div>
                                    <div className="text">{company.role?.name ?? "-"}</div>
                                </li>
                              { orgsetup &&  <li>
                                    <div className="title">Entity</div>
                                    <div className="text">{company.entity?.name ?? "-"}</div>
                                </li>}
                                <li>
                                    <div className="title">Division</div>
                                    <div className="text">{company.division?.name ?? "-"}</div>
                                </li>
                                <li>
                                    <div className="title">Department</div>
                                    <div className="text">{company.department?.name ?? "-"}</div>
                                </li>
                                <li>
                                    <div className="title">Grades</div>
                                    <div className="text">{company.grades?.name ?? "-"}</div>
                                </li>
                                <li>
                                    <div className="title">Section</div>
                                    <div className="text">{company.section?.name ?? "-"}</div>
                                </li>
                                <li>
                                    <div className="title">Function</div>
                                    <div className="text">{company.functions?.name ?? "-"}</div>
                                </li>
                                <li>
                                    <div className="title">Job Titles</div>
                                    <div className="text">{company.jobTitle?.name ?? "NA"}</div>
                                </li>
                                <li>
                                    <div className="title">Location</div>
                                    <div className="text">{company.branch?.name ?? "-"}</div>
                                </li>
                                <li>
                                    <div className="title">Date of Joining</div>
                                    <div className="text">{getReadableDate (company.doj) ?? "-"}</div>
                                </li>

                                <li>
                                    <div className="title">Employment Status</div>
                                    <div className="text">{company.employmentStatus?.name ?? "-"}</div>
                                </li>

                                <li>
                                    <div className="title">Probation Period</div>
                                    <div className="text">{company.probationPeriod ?? "-"} Days</div>
                                </li>
                                <li>
                        
                                    <div className="title">Notice Period</div>
                                    <div className="text">{company.noticePeriod ?? "-"} Days</div>
                                </li>
                                <li>
                                    <div className="title">Reporting Manager</div>
                                    <div className="text">{company.reportingManager?.name ? company.reportingManager?.name : "-"}</div>
                                </li>
                               
                            </ul>
                        </div>
                    </div>
                </div>
                <Modal enforceFocus={false} size={"xl"} show={editable} onHide={() => { this.setState({ editable: false }) }}>
                    <Header closeButton>
                        <h5 className="modal-title">Edit Company Information</h5>
                    </Header>
                    <Body>
                        <Formik
                            enableReinitialize={true}
                            initialValues={this.state.company}
                            onSubmit={this.save}
                        // validationSchema={EmployeeSchema}
                        >
                            {({
                                values,
                                setFieldValue,
                            }) => (
                                <Form autoComplete='off'>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Employee ID
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field readOnly="readonly" name="employeeId" className="form-control"></Field>

                                            </FormGroup>
                                        </div>
                                         {   orgsetup &&    <div className="col-md-4">
                                            <FormGroup>
                                                <label>Entity
                                                </label>
                                                <Field readOnly={!editable} name="entityId" render={field => {
                                                    return <EntityDropdown readOnly={!editable} defaultValue={values.entity?.id} onChange={e => {
                                                        setFieldValue("entityId", e.target.value);
                                                        setFieldValue("entity", { id: e.target.value });
                                                    }}></EntityDropdown>
                                                }}></Field>
                                            </FormGroup>
                                        </div>}
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Division
                                                </label>
                                                <Field readOnly={!editable} name="divisionId" render={field => {
                                                    return <DivisionDropdown readOnly={!editable} defaultValue={values.division?.id} onChange={e => {
                                                        setFieldValue("divisionId", e.target.value);
                                                        setFieldValue("division", { id: e.target.value });
                                                    }}></DivisionDropdown>
                                                }}></Field>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Department
                                                </label>
                                                <Field readOnly={!editable} name="departmentId" render={field => {
                                                    return <DepartmentDropdown readOnly={!editable} defaultValue={values.department?.id} onChange={e => {
                                                        setFieldValue("departmentId", e.target.value);
                                                        setFieldValue("department", { id: e.target.value });
                                                    }}></DepartmentDropdown>
                                                }}></Field>

                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Grade
                                                </label>
                                                <Field readOnly={!editable} name="gradesId" render={field => {
                                                    return <GradesDropdown readOnly={!editable} defaultValue={values.grades?.id} onChange={e => {
                                                        setFieldValue("gradesId", e.target.value);
                                                        setFieldValue("grades", { id: e.target.value });
                                                    }}></GradesDropdown>
                                                }}></Field>

                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Section
                                                </label>
                                                <Field readOnly={!editable} name="sectionId" render={field => {
                                                    return <SectionDropdown readOnly={!editable} defaultValue={values.section?.id} onChange={e => {
                                                        setFieldValue("sectionId", e.target.value);
                                                        setFieldValue("section", { id: e.target.value });
                                                    }}></SectionDropdown>
                                                }}></Field>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Function
                                                </label>
                                                <Field readOnly={!editable} name="functionId" render={field => {
                                                    return <FunctionDropdown readOnly={!editable} defaultValue={values.functions?.id} onChange={e => {
                                                        setFieldValue("functionId", e.target.value);
                                                        setFieldValue("functions", { id: e.target.value });
                                                    }}></FunctionDropdown>
                                                }}></Field>
                                            </FormGroup>
                                        </div>
                                        {/* } */}
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Job Titles
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field readOnly={!editable} name="jobTitleId" render={field => {
                                                    return <JobTitlesDropdown readOnly={!editable} defaultValue={values.jobTitle?.id} onChange={e => {
                                                        setFieldValue("jobTitleId", e.target.value);
                                                        setFieldValue("jobTitle", { id: e.target.value });
                                                    }}></JobTitlesDropdown>
                                                }}></Field>
                                                <ErrorMessage name="jobTitleId">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Location <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field readOnly={!editable} name="branchId" render={field => {
                                                    return <BranchDropdown readOnly={!editable} defaultValue={values.branch?.id} onChange={e => {
                                                        setFieldValue("branchId", e.target.value);
                                                        setFieldValue("branch", { id: e.target.value });
                                                    }}></BranchDropdown>
                                                }}></Field>
                                            </FormGroup>
                                        </div>
                                        {/* } */}
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Company Date Of Joining
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field readOnly={!editable} name="doj" type="date" defaultValue={values.doj} className="form-control"></Field>
                                                <ErrorMessage name="doj">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Probation Period (days)
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field readOnly={!editable}  type ="number" min="0" name="probationPeriod" className="form-control"></Field>
                                                <ErrorMessage name="probationPeriod">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Notice Period (days)
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field readOnly={!editable} type ="number" min="0" name="noticePeriod" className="form-control"></Field>
                                                <ErrorMessage name="noticePeriod">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Reporting Manager

                                                </label>
                                                <Field readOnly={!editable} name="reportingManagerId" render={field => {
                                                    return <EmployeeDropdown excludeId={values.id} readOnly={!editable} defaultValue={values.reportingManager?.id} onChange={e => {
                                                        setFieldValue("reportingManagerId", e.target.value)
                                                    }}></EmployeeDropdown>
                                                }}></Field>
                                                <ErrorMessage name="reportingManagerId">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Employment Status
                                                </label>
                                                <Field readOnly={!editable} name="employmentStatusId" render={field => {
                                                    return <EmploymentStatusDropdown readOnly={!editable} defaultValue={values.employmentStatus?.id} onChange={e => {
                                                        setFieldValue("employmentStatusId", e.target.value);
                                                        setFieldValue("employmentStatus", { id: e.target.value });
                                                    }}></EmploymentStatusDropdown>
                                                }}></Field>
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <input type="submit" className="btn btn-primary" value={values.id > 0 ? "Update" : "Save"} />
                                    &nbsp;
                                    <Anchor onClick={() => { this.setState({ editable: false }) }} className="btn btn-secondary btn-sm" ><span>Cancel</span></Anchor>
                                </Form>
                            )
                            }
                        </Formik>
                    </Body>
                </Modal>
            </>
        )
    }
}
