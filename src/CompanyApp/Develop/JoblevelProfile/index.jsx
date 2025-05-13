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
import { FormGroup } from 'react-bootstrap';
import { Field } from 'formik';
import DepartmentDropdown from '../../ModuleSetup/Dropdown/DepartmentDropdown';
import GradesDropdown from '../../ModuleSetup/Dropdown/GradesDropdown';
import { confirmAlert } from 'react-confirm-alert';
import { Empty } from 'antd';
import { getBehaviouralList, getHonoursList, getLanguageList, getLeadershipList, getLicenseList, getMembershipList, getQualificationList, getTechnicalList, getTrainingList } from './service';

export default class IndividualProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBodyVisible: false,
            employeeGrade: '',
            employeeId: '',
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
        }
    }

    getProfileByGrade = (id) => {
        this.setState({ employeeGrade: id })
        // this.fetchList();
    }



    fetchList = () => {
        const { employeeGrade } = this.state
        getQualificationList(employeeGrade).then(res => {
            if (res.status == "OK") {
                this.setState({
                    qualification: res.data.list,
                })
            }
        })
        getTrainingList(employeeGrade).then(res => {
            if (res.status == "OK") {
                this.setState({
                    training: res.data.list,
                })
            }
        })
        getTechnicalList(employeeGrade).then(res => {
            if (res.status == "OK") {
                this.setState({
                    technical: res.data.list,
                })
            }
        })
        getLeadershipList(employeeGrade).then(res => {
            if (res.status == "OK") {
                this.setState({
                    leadership: res.data.list,
                })
            }
        })
        getBehaviouralList(employeeGrade).then(res => {
            if (res.status == "OK") {
                this.setState({
                    behavioural: res.data.list,
                })
            }
        })
        getHonoursList(employeeGrade).then(res => {
            if (res.status == "OK") {
                this.setState({
                    honours: res.data.list,
                })
            }
        })
        getLicenseList(employeeGrade).then(res => {
            if (res.status == "OK") {
                this.setState({
                    license: res.data.list,
                })
            }
        })
        getMembershipList(employeeGrade).then(res => {
            if (res.status == "OK") {
                this.setState({
                    membership: res.data.list,
                })
            }
        })
        getLanguageList(employeeGrade).then(res => {
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
        const { isBodyVisible, formNames, employeeGrade, qualification, training, technical, leadership, behavioural, honours, license, membership, language } = this.state;

        const data =
            [
                { degree: 'BA litrature', date: '20-10-2024', major: 'English', country: 'United Arab Emirates' },
                { degree: 'B.Com', date: '5-10-2017', major: 'Accounting', country: 'India' },
                { degree: 'Human Resource Management', date: '20-10-2014', major: 'HR', country: 'Qatar' }
            ]
        const trainingCourse =
            [
                { certificate: 'Language', date: '20-10-2024', course: 'English', hour: '6 Months' },
                { certificate: 'Accounting', date: '5-10-2017', course: 'Tally', hour: 'One Year' },
            ]

        return (
            <>
                <>
                    <div style={{ marginLeft: '60%' }} className=' mt-3 col-md-4'>
                        <label className='overtime-label'>Grade
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <GradesDropdown defaultValue={0} onChange={e => {
                            this.getProfileByGrade(e.target.value)
                        }} ></GradesDropdown>
                    </div>
                    {this.state.employeeGrade == '' && <div className="mt-3 p-3 alert alert-warning alert-dismissible fade show" role="alert">
                        <span>Please select Grade to view the Profile .</span>
                    </div>}
                </>
                {this.state.employeeGrade != '' &&
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
                                    <QualificationForm employeeGrade={this.state.employeeGrade} onClose={this.closeForm}></QualificationForm>
                                </div>
                            )}
                            {formNames.qualification &&
                                <>
                                    {!qualification.length ?
                                        <div className='profileBody' ><Empty /></div> :
                                        qualification.map((item, index) => (
                                            <div className="mt-3 mb-0 card">
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
                                                                <span className='dvlp-view-span' >Major</span>
                                                                <p>{item.major}</p>
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
                                    <TrainingCourse employeeGrade={this.state.employeeGrade} onClose={this.closeForm}></TrainingCourse>
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
                                                                <p>{item.certificate}</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span'>Issued By</span>
                                                                <p>Manager</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Course Name</span>
                                                                <p>{item.course}</p>
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
                                    <BehaviouralCompetencies employeeGrade={this.state.employeeGrade} onClose={this.closeForm}></BehaviouralCompetencies>
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
                                                                <p>Customer Orientation</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span'>Proficiency Level</span>
                                                                <p>Advanced</p>
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
                                    <LeadershipCompetencies employeeGrade={this.state.employeeGrade} onClose={this.closeForm}></LeadershipCompetencies>
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
                                                                <p>Self Confidence</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span'>Proficiency Level</span>
                                                                <p>Role Model</p>
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
                                    <TechnicalCompetencies employeeGrade={this.state.employeeGrade} onClose={this.closeForm}></TechnicalCompetencies>
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
                                                                <p>Customer Orientation</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span'>Proficiency Level</span>
                                                                <p>Advanced</p>
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
                                    <HonoursAndAward employeeGrade={this.state.employeeGrade} onClose={this.closeForm}></HonoursAndAward>
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
                                                                <p>Customer Orientation</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Organization</span>
                                                                <p>2 Point Scale</p>
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
                                    <LicenseAndCertificate employeeGrade={this.state.employeeGrade} onClose={this.closeForm}></LicenseAndCertificate>
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
                                                                <p>Customer Orientation</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span'>Issued By</span>
                                                                <p>Manager</p>
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
                                    <Membership employeeGrade={this.state.employeeGrade} onClose={this.closeForm}></Membership>
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
                                                                <p>Customer Orientation</p>
                                                            </div>
                                                            <div class="col-6">
                                                                <span className='dvlp-view-span' >Community Name</span>
                                                                <p>Sample Text</p>
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
                                    <Language employeeGrade={this.state.employeeGrade} onClose={this.closeForm}></Language>
                                </div>
                            )}

                        </div>

                    </div >}
            </>
        )
    }
}