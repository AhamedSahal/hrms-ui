import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { CONSTANT } from '../../../constant';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { getDefaultProfilePicture, getEmployeeId, getPermission, getReadableDate, getTitle, getUserType, verifyViewPermissionForTeam } from '../../../utility';
import Academic from './academic';
import AddressDetailEmployeeForm from './addressDetailForm';
import AllowanceForm from './allowanceForm';
import BankAccountDetailEmployeeForm from './bankAccountDetailForm';
import CompanyDetailEmployeeForm from './companyDetailForm';
import DocumentDetailList from './documentDetailList';
import Experience from './experience';
import PersonalDetailEmployeeForm from './personalDetailForm';
import ProfessionalReference from './reference';
import ChangeStatus from './statusChange';
import SalaryDetailEmployeeForm from './salaryDetailForm';
import CustomizationForm from './customizationForm';
import { getPersonalInformation, getEmployementStatusById } from './service';
import Skill from './skill';
import StatusDetailEmployeeForm from './statusDetailForm';
import BenefitsDetail from './benefits';
import SystemLog from './auditTrail';
import { employeeProfilePhotoURL } from '../../../HttpRequest';
import EmployeeProfilePhoto from '../widgetEmployeePhoto';
import { PERMISSION_LEVEL } from '../../../Constant/enum';
import { Button, Modal } from 'react-bootstrap';
import ChangeProfilePicture from '../changeProfilePicture';
import Family from './family';
import Assets from '../../Assets/index';
import PeoplejobDescription from './jobDescription';
import { getOrgSettings } from '../../ModuleSetup/OrgSetup/service';

const isCompanyAdmin = getUserType() === 'COMPANY_ADMIN' || getPermission("PEOPLE", "EDIT") === PERMISSION_LEVEL.ORGANIZATION;
const canMangerViewable = verifyViewPermissionForTeam("Peoples My Team");

const EmployeeDetail = (props) => {
    const { id } = useParams();
    const employeeId = id === "0" ? getEmployeeId() : id;
    const [state, setState] = useState({
        id: employeeId,
        employee: props.employee || {
            id: employeeId,
            name: "",
            active: true,
        },
        profileImg: getDefaultProfilePicture(),
        activeTab: 0,
        allowToViewDetails: isCompanyAdmin || canMangerViewable || employeeId === getEmployeeId(),
        employmentStatus: [],
        showForm: false,
        orgsetup: false
    });

    useEffect(() => {
        fetchList(state.id);
        if (!state.allowToViewDetails) {
            return;
        }
        getPersonalInformation(state.id).then(res => {
            if (res.status === "OK") {
                const employee = res.data;
                employee.dob = employee?.dob?.substr(0, 10);
                setState(prevState => ({ ...prevState, employee }));
            }
        });
    }, [state.id, state.allowToViewDetails]);

    const fetchList = (id) => {
        getEmployementStatusById(id).then(res => {
            if (res.status === "OK") {
                setState(prevState => ({ ...prevState, employmentStatus: res.data }));
            }
        });

        getOrgSettings().then(res => {
            if (res.status === "OK") {
                setState(prevState => ({ ...prevState, orgsetup: res.data.entity }));
            }
        });
    };

    const handelActiveTab = (index) => {
        setState(prevState => ({ ...prevState, activeTab: index }));
    };

    const hideForm = () => {
        setState(prevState => ({ ...prevState, showForm: false }));
    };

    const { employee, activeTab, allowToViewDetails } = state;

    return (
        <div className="insidePageDiv">
            <Helmet>
                <title>Employee Detail | {getTitle()}</title>
            </Helmet>
            <div className="page-containerDocList content container-fluid">
                <div className="tablePage-header">
                    <div className="row pageTitle-section">
                        <div className="col">
                            <h3 className="tablePage-title">Profile</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                                <li className="breadcrumb-item"><Link to={"/app/company-app/employee"}>Employee</Link></li>
                                <li className="breadcrumb-item active">Profile</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="card mb-0">
                    <div className="card-body">
                        {allowToViewDetails ? (
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="profile-view">
                                        <div className="profile-img-wrap">
                                            <div className="profile-img">
                                                <a href="#"> <EmployeeProfilePhoto id={employee.id} alt={employee.name}></EmployeeProfilePhoto></a>
                                            </div>
                                            <div style={{ position: "absolute", top: "80px", left: "80px" }}>
                                                <a href="#" onClick={() => setState(prevState => ({ ...prevState, showForm: true }))}><i className="fa fa-pencil m-r-5" /></a>
                                            </div>
                                        </div>
                                        <div className="profile-basic">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <div className="profile-info-left">
                                                        <h3 className="profile-user-name m-t-0 mb-0">{employee.name}</h3>
                                                        {state.orgsetup && <small className="text-muted">{employee.entity?.name || " "}</small>}
                                                        <small className="text-muted">{employee.division?.name ? " / " + employee.division?.name : " "}</small>
                                                        <small className="text-muted">{employee.department?.name ? " / " + employee.department?.name : " "}</small>
                                                        <small className="text-muted">{employee.grades?.name ? " / " + employee.grades?.name : " "}</small>
                                                        <small className="text-muted">{employee.branch?.name ? " / " + employee.branch?.name : " "}</small>
                                                        <small className="text-muted">{employee.jobTitle?.name ? " / " + employee.jobTitle?.name : " "}</small>
                                                        <div className="staff-id">Employee ID : {employee.employeeId}</div>
                                                        <div className="small doj text-muted">Date of Join : {getReadableDate(employee?.doj) || "-"}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-7">
                                                    <ul className="personal-info">
                                                        <li>
                                                            <div className="title">Phone:</div>
                                                            <div className="text">{employee.phone ? <a href={'tel:' + employee.phone}>{employee.phone}</a> : "NA"}</div>
                                                        </li>
                                                        <li>
                                                            <div className="title">Email:</div>
                                                            <div className="text">{employee.email ? <a href={'mailto:' + employee.email}>{employee.email}</a> : "NA"}</div>
                                                        </li>
                                                        <li>
                                                            <div className="title">Birthday:</div>
                                                            <div className="text">{getReadableDate(employee.dob) || "NA"}</div>
                                                        </li>
                                                        <li>
                                                            <div className="title">Gender:</div>
                                                            <div className="text">{employee.gender || "NA"}</div>
                                                        </li>
                                                        <li>
                                                            <div className="title">Blood Group:</div>
                                                            <div className="text">{employee.bloodGroup || "NA"}</div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : <AccessDenied />}
                    </div>
                </div>
                {allowToViewDetails && (
                    <div className="tab-content">
                        <div className="row user-tabs">
                            <div className="nav-box">
                                <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                    <ul className="nav nav-items">
                                        <li className="nav-item"><a href="#emp_profile" data-toggle="tab" className="nav-link active">Profile</a></li>
                                        <li className="nav-item" onClick={() => handelActiveTab(1)}><a href="#emp_salary" data-toggle="tab" className="nav-link">Salary</a></li>
                                        <li className="nav-item" onClick={() => handelActiveTab(2)}><a href="#emp_doc" data-toggle="tab" className="nav-link">Documents</a></li>
                                        <li className="nav-item" onClick={() => handelActiveTab(3)}><a href="#emp_jobDescription" data-toggle="tab" className="nav-link">Job Description</a></li>
                                        <li className="nav-item" onClick={() => handelActiveTab(4)}><a href="#emp_qualification" data-toggle="tab" className="nav-link">Qualification</a></li>
                                        <li className="nav-item" onClick={() => handelActiveTab(5)}><a href="#emp_skill" data-toggle="tab" className="nav-link">Skill</a></li>
                                        <li className="nav-item" onClick={() => handelActiveTab(6)}><a href="#emp_experiance" data-toggle="tab" className="nav-link">Experience</a></li>
                                        <li className="nav-item" onClick={() => handelActiveTab(7)}><a href="#emp_family" data-toggle="tab" className="nav-link">Family</a></li>
                                        <li className="nav-item" onClick={() => handelActiveTab(8)}><a href="#emp_reference" data-toggle="tab" className="nav-link">Reference</a></li>
                                        <li className="nav-item" onClick={() => handelActiveTab(9)}><a href="#emp_benefits" data-toggle="tab" className="nav-link">Benefits</a></li>
                                        <li className="nav-item" onClick={() => handelActiveTab(10)}><a href="#status_change" data-toggle="tab" className="nav-link">Change Status</a></li>
                                        <li className="nav-item" onClick={() => handelActiveTab(11)}><a href="#system_log" data-toggle="tab" className="nav-link">Audit Trail</a></li>
                                        <li className="nav-item" onClick={() => handelActiveTab(12)}><a href="#my_asset" data-toggle="tab" className="nav-link">My Asset</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div id="emp_profile" className="pro-overview tab-pane fade show active">
                            <div className="row">
                                <PersonalDetailEmployeeForm employeeId={state.id}></PersonalDetailEmployeeForm>
                                <CompanyDetailEmployeeForm employeeId={state.id}></CompanyDetailEmployeeForm>
                                <BankAccountDetailEmployeeForm employeeId={state.id}></BankAccountDetailEmployeeForm>
                                <StatusDetailEmployeeForm employeeId={state.id}></StatusDetailEmployeeForm>
                                <AddressDetailEmployeeForm employeeId={state.id}></AddressDetailEmployeeForm>
                            </div>
                        </div>
                        {(state.employmentStatus.modeOfPay === "yes" || state.employmentStatus.length === 0) && (
                            <div id="emp_salary" className="pro-overview tab-pane fade">
                                {activeTab === 1 && (
                                    (getEmployeeId() === state.id || isCompanyAdmin) ? <SalaryDetailEmployeeForm employeeId={state.id}></SalaryDetailEmployeeForm> : <AccessDenied />
                                )}
                            </div>
                        )}
                        {(state.employmentStatus.modeOfPay === "no" && (
                            <div id="emp_salary" className="pro-overview tab-pane fade">
                                {activeTab === 1 && (
                                    (getEmployeeId() === state.id || isCompanyAdmin) ? <CustomizationForm employeeId={state.id}></CustomizationForm> : <AccessDenied />
                                )}
                            </div>
                        ))}
                        <div id="emp_doc" className="pro-overview tab-pane fade">
                            {activeTab === 2 && <DocumentDetailList employeeId={state.id}></DocumentDetailList>}
                        </div>
                        <div id="emp_jobDescription" className="pro-overview tab-pane fade">
                            {activeTab === 3 && <PeoplejobDescription employeeId={state.id}></PeoplejobDescription>}
                        </div>
                        <div id="emp_qualification" className="pro-overview tab-pane fade">
                            {activeTab === 4 && <Academic employeeId={state.id}></Academic>}
                        </div>
                        <div id="emp_skill" className="pro-overview tab-pane fade">
                            {activeTab === 5 && <Skill employeeId={state.id}></Skill>}
                        </div>
                        <div id="emp_experiance" className="pro-overview tab-pane fade">
                            {activeTab === 6 && <Experience employeeId={state.id}></Experience>}
                        </div>
                        <div id="emp_family" className="pro-overview tab-pane fade">
                            {activeTab === 7 && <Family employeeId={state.id}></Family>}
                        </div>
                        <div id="emp_reference" className="pro-overview tab-pane fade">
                            {activeTab === 8 && <ProfessionalReference employeeId={state.id}></ProfessionalReference>}
                        </div>
                        <div id="emp_benefits" className="pro-overview tab-pane fade">
                            {activeTab === 9 && (
                                (getEmployeeId() === state.id || isCompanyAdmin) ? <BenefitsDetail employeeId={state.id}></BenefitsDetail> : <AccessDenied />
                            )}
                        </div>
                        <div id="status_change" className="pro-overview tab-pane fade">
                            {activeTab === 10 && (
                                (getEmployeeId() === state.id || isCompanyAdmin) ? <ChangeStatus employeeId={state.id}></ChangeStatus> : <AccessDenied />
                            )}
                        </div>
                        <div id="system_log" className="pro-overview tab-pane fade">
                            {activeTab === 11 && (
                                (getEmployeeId() === state.id || isCompanyAdmin) ? <SystemLog employeeId={state.id}></SystemLog> : <AccessDenied />
                            )}
                        </div>
                        <div id="my_asset" className="pro-overview tab-pane fade">
                            {activeTab === 12 && <Assets employeeId={employee.id || getEmployeeId()}></Assets>}
                        </div>
                    </div>
                )}
            </div>
            <Modal enforceFocus={false} size={"md"} show={state.showForm} onHide={hideForm}>
                <Modal.Header closeButton>
                    <h5 className="modal-title">Change Profile Picture</h5>
                </Modal.Header>
                <Modal.Body>
                    <ChangeProfilePicture updateList={hideForm} employee={state.employee}></ChangeProfilePicture>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EmployeeDetail;
