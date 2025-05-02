import React, { Component } from 'react';
import QualificationForm from './qualificationForm';
import TrainingCourse from './trainingCourse';
import TechnicalCompetencies from './technicalCompetencies';
import HonoursAndAward from './honours&Award';
import BehaviouralCompetencies from './behaviouralCompetencies';
import LeadershipCompetencies from './leadershipCompetencies';
import LicenseAndCertificate from './license&Certificate';
import Membership from './membership';
import Language from './language';
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
import { getEmployeeId, getUserType } from '../../../utility';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { Empty } from 'antd';
import { getBehaviouralList, getHonoursList, getLanguageList, getLeadershipList, getLicenseList, getMembershipList, getQualificationList, getTechnicalList, getTrainingList } from './service';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';

export default class IndividualProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBodyVisible: false,
            employeeId: getUserType() === 'EMPLOYEE' ? getEmployeeId() : 0,
            qualification: [],
            training: [],
            technical: [],
            leadership: [],
            behavioural: [],
            honours: [],
            license: [],
            membership: [],
            language: [],
            formNames: {
                qualification: false, qualificationForm: false, training: false,
                trainingForm: false, technical: false, technicalForm: false, leadership: false,
                leadershipForm: false,
                behavioural: false, behaviouralForm: false, honours: false, honoursForm: false,
                license: false, licenseForm: false, membership: false, membershipForm: false,
                language: false, languageForm: false,
            },
            formData: [],
            empProfile: false
        }
    }

    componentDidMount() {
        if (getUserType() === "EMPLOYEE") {
            this.setState({
                employeeId: getEmployeeId(),
            })
            // this.fetchList();
        }
    }
    getProfileByEmployee = (empId) => {
        this.setState({ employeeId: empId })
        // this.fetchList();
    }
    fetchList = () => {
        const { employeeId } = this.state
        getQualificationList(employeeId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    qualification: res.data.list,
                })
            }
        })
        getTrainingList(employeeId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    training: res.data.list,
                })
            }
        })
        getTechnicalList(employeeId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    technical: res.data.list,
                })
            }
        })
        getLeadershipList(employeeId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    leadership: res.data.list,
                })
            }
        })
        getBehaviouralList(employeeId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    behavioural: res.data.list,
                })
            }
        })
        getHonoursList(employeeId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    honours: res.data.list,
                })
            }
        })
        getLicenseList(employeeId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    license: res.data.list,
                })
            }
        })
        getMembershipList(employeeId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    membership: res.data.list,
                })
            }
        })
        getLanguageList(employeeId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    language: res.data.list,
                })
            }
        })
    }



    formHandling = (val) => {
        this.setState((prevState) => ({
            formNames: {
                ...prevState.formNames,
                [val]: !prevState.formNames[val],
            },
        }));
    };

    deleteProfile = (item, name) => {
        confirmAlert({
            title: `Delete ${name}`,
            message: 'Are you sure, you want to delete this Data?',
            buttons: [
                {
                    label: 'Yes',
                    // onClick: () => deleteIndividualProfile(item.id).then(res => {
                    //   if (res.status == "OK") {
                    //     toast.success(res.message);
                    //     this.fetchList();
                    //   } else {
                    //     toast.error(res.message)
                    //   }
                    // })
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    handleEdit = (item, form) => {
        if (form === 1) {
            this.setState({ formData: item })
            this.formHandling('qualificationForm')
        } else if (form === 2) {
            this.setState({ formData: item })
            this.formHandling('trainingForm')
        }
        else if (form === 3) {
            this.setState({ formData: item })
            this.formHandling('behaviouralForm')
        }
        else if (form === 4) {
            this.setState({ formData: item })
            this.formHandling('leadershipForm')
        }
        else if (form === 5) {
            this.setState({ formData: item })
            this.formHandling('technicalForm')
        }
        else if (form === 6) {
            this.setState({ formData: item })
            this.formHandling('honoursForm')
        }
        else if (form === 7) {
            this.setState({ formData: item })
            this.formHandling('licenseForm')
        }
        else if (form === 8) {
            this.setState({ formData: item })
            this.formHandling('membershipForm')
        }
    }

    closeForm = (value) => {
        this.formHandling(value)
    }

    render() {
        const { isBodyVisible, formNames, empProfile } = this.state;

        const qualification =
            [
                { id: 0, degree: 'High School', dateAcquired: '2024-10-20', date: '20-10-2024', major: 'BA English', country: 'United Arab Emirates' },
                { id: 1, degree: 'B.Com', dateAcquired: '2017-10-25', major: 'Accounting', country: 'India' },
                { id: 2, degree: 'Human Resource Management', dateAcquired: '2014-10-13', major: 'HR', country: 'Qatar' }
            ]
        const training =
            [
                { id: 0, license: 'Language', issueDate: '2024-05-11', courseName: 'English', trainingHours: '6 Months' },
                { id: 1, license: 'Accounting', issueDate: '2025-10-17', courseName: 'Tally', trainingHours: 'One Year' },
            ]
        const technical =
            [
                { id: 0, competencies: 'Customer Orientation', proficiencyLevel: 'Advance', proficiencyRating: '3 Point', evaluationComment: 'Sample' },
                { id: 1, competencies: 'Customer Orientation', proficiencyLevel: 'Advance', proficiencyRating: '4 Point', evaluationComment: 'Sample' },
            ]
        const behavioural =
            [
                { id: 0, competencies: 'Customer Orientation', proficiencyLevel: 'Basic', proficiencyRating: '1 Point', evaluationComment: 'Sample' },
                { id: 1, competencies: 'Customer Orientation', proficiencyLevel: 'Advance', proficiencyRating: '4 Point', evaluationComment: 'Sample' },
            ]
        const leadership =
            [
                { id: 0, competencies: 'Customer Orientation', proficiencyLevel: 'Advance', proficiencyRating: '4 Point', evaluationComment: 'Sample' },
                { id: 1, competencies: 'Customer Orientation', proficiencyLevel: 'Advance', proficiencyRating: '2 Point', evaluationComment: 'Sample' },
            ]
        const honours =
            [
                { id: 0, name: 'Customer Orientation', dateAwarded: '2024-10-21', organization: '4 Point', attachment: '' },
                { id: 1, name: 'Customer Orientation', dateAwarded: '2024-01-21', organization: '4 Point', attachment: '' },
            ]
        const license =
            [
                {
                    id: 0, license: 'Language', issuedBy: 'RBI', issueDate: 'English', renewalDate: '6 Months',
                    expireDate: '20-10-2024', attachment: 'English', certificateNumber: '6 Months'
                },
                {
                    id: 1, license: 'Language', issuedBy: 'RTA', issueDate: '2024-05-23', renewalDate: '2023-09-06',
                    expireDate: '2023-06-06', attachment: '', certificateNumber: '00452555'
                },
            ]
        const membership =
            [
                {
                    affiliantion: 'Language', membershipStartDate: '2024-05-23',
                    membershipEndDate: '2024-05-23', membershipNumber: '66699933', communityName: 'Test'
                },
                {
                    affiliantion: 'Language', membershipStartDate: '2024-05-23',
                    membershipEndDate: '2024-05-23', membershipNumber: '66699933', communityName: 'Test'
                },
            ]
        const language =
            [
                { certificate: 'Language', date: '20-10-2024', course: 'English', hour: '6 Months' },
                { certificate: 'Accounting', date: '5-10-2017', course: 'Tally', hour: 'One Year' },
            ]


        return (
            <>
                {isCompanyAdmin &&
                    <>
                        <div style={{ marginLeft: '60%' }} className=' mt-3 col-md-4'>
                            <label className='overtime-label'>Employee
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <EmployeeDropdown nodefault={false} onChange={e => {
                                this.getProfileByEmployee(e.target.value)
                            }}></EmployeeDropdown>
                        </div>
                        {this.state.employeeId == '' && <div className="mt-3 p-3 alert alert-warning alert-dismissible fade show" role="alert">
                            <span>Please select Employee to view the Individual Profile .</span>
                        </div>}
                    </>
                }
                {this.state.employeeId != '' &&
                    <div className="dvlp-form page-wrapper">
                        <div className='profileFormHead' >
                            <div className='profileFormHeadContent'>
                                <h3 className='dvlp-left-align'>Qualification</h3>
                                <div className='dvlp-right-align'>
                                    {formNames.qualification && <a onClick={() => this.formHandling('qualificationForm')} style={{ textAlignLast: 'center' }} href="#" className="btn apply-button btn-primary"><i className="fa fa-plus" /> Add </a>}
                                    <i onClick={() => this.formHandling('qualification')}
                                        className={`dvlpCardIcon ml-2 fa fa-xl ${formNames.qualification ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                                        aria-hidden='true'
                                    ></i>
                                </div>
                            </div>
                            {formNames.qualificationForm && (
                                <div className={`mt-2 profileFormBody ${formNames.qualification ? 'profileFormBodyVisible' : ''}`}>
                                    <QualificationForm formData={this.state.formData} employeeId={this.state.employeeId} onClose={this.closeForm}></QualificationForm>
                                </div>
                            )}
                            {formNames.qualification &&
                                <>
                                    {!qualification.length ?
                                        <div className='profileBody' ><Empty /></div> :
                                        qualification.map((item, index) => (
                                            <div key={index} className="mt-3 mb-0 card">
                                             
                                                <div className="card-body">
                                                    <div className="float-right">
                                                        <i onClick={() => this.handleEdit(item, 1)} className="dvlpCardIcon fa-xl fa fa-pencil-square-o" aria-hidden="true"></i>
                                                        <i onClick={() => this.deleteProfile(item, 'Qualification')} className="dvlpCardIcon ml-2 fa fa-xl fa-trash-o" aria-hidden="true"></i>
                                                    </div>
                                                    <div className='dvlp-profile-card border-0 container'>
                                                        <div class="row justify-content-start">
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Degree</span>
                                                                <p>{item.degree}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span'>Aquired Date</span>
                                                                <p>{item.dateAcquired}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Major</span>
                                                                <p>{item.major}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span'>Country</span>
                                                                <p>{item.country}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>))}
                                </>}
                        </div>
                        {/* Training Courses */}
                        <div className='profileFormHead' >
                            <div className='profileFormHeadContent'>
                                <h3 className='dvlp-left-align'>Training Courses</h3>
                                <div className='dvlp-right-align'>
                                    {formNames.training && <a onClick={() => this.formHandling('trainingForm')} style={{ textAlignLast: 'center' }} href="#" className="btn apply-button btn-primary"><i className="fa fa-plus" /> Add </a>}
                                    <i onClick={() => this.formHandling('training')}
                                        className={`dvlpCardIcon ml-2 fa fa-xl ${formNames.training ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                                        aria-hidden='true'
                                    ></i>
                                </div>
                            </div>
                            {formNames.trainingForm && (
                                <div className={`mt-2 profileFormBody ${formNames.training ? 'profileFormBodyVisible' : ''}`}>
                                    <TrainingCourse formData={this.state.formData} employeeId={this.state.employeeId} onClose={this.closeForm}></TrainingCourse>
                                </div>
                            )}
                            {formNames.training &&
                                <>
                                    {!training.length ?
                                        <div className='profileBody' ><Empty /></div> :
                                        training.map((item, index) => (
                                            <div className="mt-3 mb-0 card">
                                                <div className="card-body">
                                                    <div className="float-right">
                                                        <i onClick={() => { this.handleEdit(item, 2) }} className="dvlpCardIcon fa-xl fa fa-pencil-square-o" aria-hidden="true"></i>
                                                        <i onClick={() => this.deleteProfile(item, 'Training Course')} className="dvlpCardIcon ml-2 fa fa-xl fa-trash-o" aria-hidden="true"></i>
                                                    </div>
                                                    <div className='dvlp-profile-card border-0 container'>
                                                        <div class="row justify-content-start">
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >License/Certificate</span>
                                                                <p>{item.license}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span'>Issue Date</span>
                                                                <p>{item.issueDate}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Course Name</span>
                                                                <p>{item.courseName}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span'>Training Duration</span>
                                                                <p>{item.trainingHours}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>))}
                                </>}
                        </div>
                        {/* Behavioural Competencies */}
                        <div className='profileFormHead' >
                            <div className='profileFormHeadContent'>
                                <h3 className='dvlp-left-align'>Behavioural Competencies</h3>
                                <div className='dvlp-right-align'>
                                    {formNames.behavioural && <a onClick={() => this.formHandling('behaviouralForm')} style={{ textAlignLast: 'center' }} href="#" className="btn apply-button btn-primary"><i className="fa fa-plus" /> Add </a>}
                                    <i onClick={() => this.formHandling('behavioural')}
                                        className={`dvlpCardIcon ml-2 fa fa-xl ${formNames.behavioural ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                                        aria-hidden='true'
                                    ></i>
                                </div>
                            </div>
                            {formNames.behaviouralForm && (
                                <div className={`mt-2 profileFormBody ${formNames.behavioural ? 'profileFormBodyVisible' : ''}`}>
                                    <BehaviouralCompetencies formData={this.state.formData} employeeId={this.state.employeeId} onClose={this.closeForm}></BehaviouralCompetencies>
                                </div>
                            )}
                            {formNames.behavioural &&
                                <>
                                    {!behavioural.length ?
                                        <div className='profileBody' ><Empty /></div> :
                                        behavioural.map((item, index) => (
                                            <div className="mt-3 mb-0 card">
                                                <div className="card-body">
                                                    <div className="float-right">
                                                        <i onClick={() => this.handleEdit(item, 3)} className="dvlpCardIcon fa-xl fa fa-pencil-square-o" aria-hidden="true"></i>
                                                        <i onClick={() => this.deleteProfile(item, 'Behavioural Compitency')} className="dvlpCardIcon ml-2 fa fa-xl fa-trash-o" aria-hidden="true"></i>
                                                    </div>
                                                    <div className='dvlp-profile-card border-0 container'>
                                                        <div class="row justify-content-start">
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Competency</span>
                                                                <p>{item.competencies}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span'>Proficiency Level</span>
                                                                <p>{item.proficiencyLevel}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Proficiency Rating</span>
                                                                <p>{item.proficiencyRating}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>))}
                                </>}
                        </div>

                        {/* Leadership competencies */}

                        <div className='profileFormHead' >
                            <div className='profileFormHeadContent'>
                                <h3 className='dvlp-left-align'>Leadership Competencies</h3>
                                <div className='dvlp-right-align'>
                                    {formNames.leadership && <a onClick={() => this.formHandling('leadershipForm')} style={{ textAlignLast: 'center' }} href="#" className="btn apply-button btn-primary"><i className="fa fa-plus" /> Add </a>}
                                    <i onClick={() => this.formHandling('leadership')}
                                        className={`dvlpCardIcon ml-2 fa fa-xl ${formNames.leadership ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                                        aria-hidden='true'
                                    ></i>
                                </div>
                            </div>
                            {formNames.leadershipForm && (
                                <div className={`mt-2 profileFormBody ${formNames.leadership ? 'profileFormBodyVisible' : ''}`}>
                                    <LeadershipCompetencies formData={this.state.formData} employeeId={this.state.employeeId} onClose={this.closeForm}></LeadershipCompetencies>
                                </div>
                            )}
                            {formNames.leadership &&
                                <>
                                    {!leadership.length ?
                                        <div className='profileBody' ><Empty /></div> :
                                        leadership.map((item, index) => (
                                            <div className="mt-3 mb-0 card">
                                                <div className="card-body">
                                                    <div className="float-right">
                                                        <i onClick={() => this.handleEdit(item, 4)} className="dvlpCardIcon fa-xl fa fa-pencil-square-o" aria-hidden="true"></i>
                                                        <i onClick={() => this.deleteProfile(item, 'Leadership Competancy')} className="dvlpCardIcon ml-2 fa fa-xl fa-trash-o" aria-hidden="true"></i>
                                                    </div>
                                                    <div className='dvlp-profile-card border-0 container'>
                                                        <div class="row justify-content-start">
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Competency</span>
                                                                <p>{item.competencies}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span'>Proficiency Level</span>
                                                                <p>{item.proficiencyLevel}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Proficiency Rating</span>
                                                                <p>{item.proficiencyRating}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>))}
                                </>}
                        </div>
                        {/* technical Competencies */}
                        <div className='profileFormHead' >
                            <div className='profileFormHeadContent'>
                                <h3 className='dvlp-left-align'>Technical Competencies</h3>
                                <div className='dvlp-right-align'>
                                    {formNames.technical && <a onClick={() => this.formHandling('technicalForm')} style={{ textAlignLast: 'center' }} href="#" className="btn apply-button btn-primary"><i className="fa fa-plus" /> Add </a>}
                                    <i onClick={() => this.formHandling('technical')}
                                        className={`dvlpCardIcon ml-2 fa fa-xl ${formNames.technical ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                                        aria-hidden='true'
                                    ></i>
                                </div>
                            </div>
                            {formNames.technicalForm && (
                                <div className={`mt-2 profileFormBody ${formNames.technical ? 'profileFormBodyVisible' : ''}`}>
                                    <TechnicalCompetencies employeeId={this.state.employeeId} onClose={this.closeForm}></TechnicalCompetencies>
                                </div>
                            )}
                            {formNames.technical &&
                                <>
                                    {!technical.length ?
                                        <div className='profileBody' ><Empty /></div> :
                                        technical.map((item, index) => (
                                            <div className="mt-3 mb-0 card">
                                                <div className="card-body">
                                                    <div className="float-right">
                                                        <i onClick={() => this.handleEdit(item, 5)} className="dvlpCardIcon fa-xl fa fa-pencil-square-o" aria-hidden="true"></i>
                                                        <i onClick={() => this.deleteProfile(item, 'Technical Competency')} className="dvlpCardIcon ml-2 fa fa-xl fa-trash-o" aria-hidden="true"></i>
                                                    </div>
                                                    <div className='dvlp-profile-card border-0 container'>
                                                        <div class="row justify-content-start">
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Competency</span>
                                                                <p>{item.competencies}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span'>Proficiency Level</span>
                                                                <p>{item.proficiencyLevel}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Proficiency Rating</span>
                                                                <p>{item.proficiencyRating}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>))}
                                </>}
                        </div>
                        {/* Honours and Award */}
                        <div className='profileFormHead' >
                            <div className='profileFormHeadContent'>
                                <h3 className='dvlp-left-align'>Honours and Award</h3>
                                <div className='dvlp-right-align'>
                                    {formNames.honours && <a onClick={() => this.formHandling('honoursForm')} style={{ textAlignLast: 'center' }} href="#" className="btn apply-button btn-primary"><i className="fa fa-plus" /> Add </a>}
                                    <i onClick={() => this.formHandling('honours')}
                                        className={`dvlpCardIcon ml-2 fa fa-xl ${formNames.honours ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                                        aria-hidden='true'
                                    ></i>
                                </div>
                            </div>
                            {formNames.honoursForm && (
                                <div className={`mt-2 profileFormBody ${formNames.honours ? 'profileFormBodyVisible' : ''}`}>
                                    <HonoursAndAward employeeId={this.state.employeeId} onClose={this.closeForm}></HonoursAndAward>
                                </div>
                            )}
                            {formNames.honours &&
                                <>
                                    {!honours.length ?
                                        <div className='profileBody' ><Empty /></div> :
                                        honours.map((item, index) => (
                                            <div className="mt-3 mb-0 card">
                                                <div className="card-body">
                                                    <div className="float-right">
                                                        <i onClick={() => this.handleEdit(item, 6)} className="dvlpCardIcon fa-xl fa fa-pencil-square-o" aria-hidden="true"></i>
                                                        <i onClick={() => this.deleteProfile(item, 'Honour')} className="dvlpCardIcon ml-2 fa fa-xl fa-trash-o" aria-hidden="true"></i>
                                                    </div>
                                                    <div className='dvlp-profile-card border-0 container'>
                                                        <div class="row justify-content-start">
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Name</span>
                                                                <p>{item.name}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span'>Date Awarded</span>
                                                                <p>{item.dateAwarded}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Organization</span>
                                                                <p>{item.organization}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>))}
                                </>}
                        </div>
                        {/* Licences and Certificates */}
                        <div className='profileFormHead' >
                            <div className='profileFormHeadContent'>
                                <h3 className='dvlp-left-align'>Licences and Certificates</h3>
                                <div className='dvlp-right-align'>
                                    {formNames.license && <a onClick={() => this.formHandling('licenseForm')} style={{ textAlignLast: 'center' }} href="#" className="btn apply-button btn-primary"><i className="fa fa-plus" /> Add </a>}
                                    <i onClick={() => this.formHandling('license')}
                                        className={`dvlpCardIcon ml-2 fa fa-xl ${formNames.license ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                                        aria-hidden='true'
                                    ></i>
                                </div>
                            </div>
                            {formNames.licenseForm && (
                                <div className={`mt-2 profileFormBody ${formNames.license ? 'profileFormBodyVisible' : ''}`}>
                                    <LicenseAndCertificate employeeId={this.state.employeeId} onClose={this.closeForm}></LicenseAndCertificate>
                                </div>
                            )}
                            {formNames.license &&
                                <>
                                    {!license.length ?
                                        <div className='profileBody' ><Empty /></div> :
                                        license.map((item, index) => (
                                            <div className="mt-3 mb-0 card">
                                                <div className="card-body">
                                                    <div className="float-right">
                                                        <i onClick={() => this.handleEdit(item, 7)} className="dvlpCardIcon fa-xl fa fa-pencil-square-o" aria-hidden="true"></i>
                                                        <i onClick={() => this.deleteProfile(item, 'Licence')} className="dvlpCardIcon ml-2 fa fa-xl fa-trash-o" aria-hidden="true"></i>
                                                    </div>
                                                    <div className='dvlp-profile-card border-0 container'>
                                                        <div class="row justify-content-start">
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >License/Certificate</span>
                                                                <p>{item.license}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span'>Issued By</span>
                                                                <p>{item.issuedBy}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Issue Date </span>
                                                                <p>{item.issueDate}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Attachments </span>
                                                                <p>{item.attachment}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>))}
                                </>}
                        </div>

                        {/* Membership */}
                        <div className='profileFormHead' >
                            <div className='profileFormHeadContent'>
                                <h3 className='dvlp-left-align'>Membership</h3>
                                <div className='dvlp-right-align'>
                                    {formNames.membership && <a onClick={() => this.formHandling('membershipForm')} style={{ textAlignLast: 'center' }} href="#" className="btn apply-button btn-primary"><i className="fa fa-plus" /> Add </a>}
                                    <i onClick={() => this.formHandling('membership')}
                                        className={`dvlpCardIcon ml-2 fa fa-xl ${formNames.membership ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                                        aria-hidden='true'
                                    ></i>
                                </div>
                            </div>
                            {formNames.membershipForm && (
                                <div className={`mt-2 profileFormBody ${formNames.membership ? 'profileFormBodyVisible' : ''}`}>
                                    <Membership employeeId={this.state.employeeId} onClose={this.closeForm}></Membership>
                                </div>
                            )}
                            {formNames.membership &&
                                <>
                                    {!membership.length ?
                                        <div className='profileBody' ><Empty /></div> :
                                        membership.map((item, index) => (
                                            <div className="mt-3 mb-0 card">
                                                <div className="card-body">
                                                    <div className="float-right">
                                                        <i onClick={() => this.handleEdit(item, 8)} className="dvlpCardIcon fa-xl fa fa-pencil-square-o" aria-hidden="true"></i>
                                                        <i onClick={() => this.deleteProfile(item, 'Membership')} className="dvlpCardIcon ml-2 fa fa-xl fa-trash-o" aria-hidden="true"></i>
                                                    </div>
                                                    <div className='dvlp-profile-card border-0 container'>
                                                        <div class="row justify-content-start">
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Affiliation or Professional Body</span>
                                                                <p>{item.affiliantion}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span'>Membership Start Date </span>
                                                                <p>{item.membershipStartDate}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Membership Number</span>
                                                                <p>{item.membershipNumber}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Community Name</span>
                                                                <p>{item.communityName}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>))}
                                </>}
                        </div>

                        {/* Language */}
                        <div className='profileFormHead' >
                            <div className='profileFormHeadContent'>
                                <h3 className='dvlp-left-align'>Language</h3>
                                <div className='dvlp-right-align'>
                                    <i onClick={() => this.formHandling('language')}
                                        className={`dvlpCardIcon ml-2 fa fa-xl ${formNames.language ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                                        aria-hidden='true'
                                    ></i>
                                </div>
                            </div>
                            {formNames.language && (
                                <div className={`mt-2 profileFormBody ${formNames.language ? 'profileFormBodyVisible' : ''}`}>
                                    <Language employeeId={this.state.employeeId} onClose={this.closeForm}></Language>
                                </div>
                            )}

                        </div>

                    </div >}
            </>
        )
    }
}