import { Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FormGroup } from 'reactstrap';
import { getProfilePicture, getCustomizedDate,  getUserType, getUserName, getUserTitleName, toLocalTime, getReadableDate, getDefaultProfilePicture, verifyEditPermission, verifyOrgLevelViewPermission, verifyViewPermission, verifyViewPermissionForTeam, getEmployeeId } from '../../../utility.jsx';
import MediaComponent from '../../MediaComponent.jsx';
import { PlainBg,  socialmediapost, topBG } from '../../../Entryfile/imagepath.jsx';
import InputEmoji from 'react-input-emoji';
import "../../SocialShare.css";
import { fileDownload } from '../../../HttpRequest';
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { CONSTANT } from '../../../constant';
import { getSocialShareList, getCompanyAdminDashboardDetail, postSocialShare, putSocialShareComment, putSocialShareLike, putRecognitionLike, putRecognitionComment, getEmployeeDashboardDetail, postAttendance } from './service.jsx';
import { getRecognitionList } from '../../../CompanyApp/RecognitionMain/service.jsx';
import EmployeeListColumn from '../../../CompanyApp/Employee/employeeListColumn';
import LeaveForm from './../../../CompanyApp/Employee/leave/form';
import CreateTimesheetForm from './../../../CompanyApp/Timesheet/form';
import DocumentRequestForm from '../../../CompanyApp/ModuleSetup/DocumentRequest/form.jsx';
import { getPoliciesDocumentList } from '../../../CompanyApp/ModuleSetup/PoliciesDocuments/service.jsx';
import { getLeaveList } from '../../../CompanyApp/Employee/leave/service.jsx';
import { Tooltip } from '@mui/material';

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const isEmployee = getUserType() == 'EMPLOYEE';
const { Header, Body, Footer, Dialog } = Modal;

const defaultCommentCount = 5;
function LoginButton(props) {
    return <button className="btn btn-primary"
        style={{ backgroundColor: "#1DA8D5", width: "95%" }} onClick={props.onClick} title="Clock In">Clock In</button>;
}

function LogoutButton(props) {
    return <button className="btn btn-primary"
        style={{ backgroundColor: "#1DA8D5", width: "95%" }} onClick={props.onClick} title="Clock Out">Clock Out</button>;
}
export default class SocialShare extends Component {

    constructor(props) {
        super(props);
        var today = new Date();
        var firstDay = new Date(today.getFullYear(), 0, 2);
        var lastDay = new Date(today.getFullYear(), 11, 31);
        this.state = {
            employeeId: isEmployee ? getEmployeeId() : undefined,
            searchText: "",
            pageNumber: 0,
            LeaveTracksize: 5,
            size: 10,
            pageSize: 10000,
            page: 0,
            sort: "id,desc",
            self: isCompanyAdmin ? 0 : 1,
            branchId: "",
            departmentId: "",
            designationId: "",
            fromDate: firstDay.toISOString().split('T')[0],
            toDate: lastDay.toISOString().split('T')[0],
            loadSocialShare: false,
            dashboard: {},
            dashboardData: {},
            socialShare: [],
            RecognitionMain: [],
            RecognitionSetup: [],
            policiesdocument: [],
            LeaveTrack: [],
            LeaveTrackSelf: [],
            LeaveTrackTeam: [],
            isLoggedIn: false,
            isClockBtn: false,
            date1: new Date().toLocaleString()
        };
    }
    componentDidMount() {
        this.getAttendance();
        this.getDashboardData();
        this.getPoliciesDocumentList();
        this.getLeaveTrackerList();
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.loadSocialShare !== prevState.loadSocialShare) {
            this.getSocialShareList();
            this.getRecognitionList();
        }
    }
    static getDerivedStateFromProps(props, state) {
        if (props.loadSocialShare !== state.loadSocialShare) {
            return {
                loadSocialShare: props.loadSocialShare
            };
        }
        // Return null to indicate no change to state.
        return null;
    }
    getSocialShareList = () => {
        const { searchText, pageNumber, pageSize, sort } = this.state;
        getSocialShareList(searchText, pageNumber, pageSize, sort).then(res => {

            let { socialShare } = this.state;
            let newSocialShare = res.data.list;
            socialShare = [...socialShare, ...newSocialShare];

            socialShare = socialShare.filter(function (item, index, array) {
                return array.indexOf(item) === index;
            });
            this.setState({
                socialShare,
                totalPages: res.data.totalPages,
                totalRecords: res.data.totalRecords,
                currentPage: res.data.currentPage + 1
            })

        }
        )
    }
    postSocialShare = (data, action) => {
        action.setSubmitting(true);
        postSocialShare(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.setState({
                    comment: "",
                    description: "",
                    file: null,
                    showForm: false,
                    company: undefined
                })
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        });
    }
    getRecognitionList = () => {
        const { searchText, pageNumber, pageSize, sort } = this.state;
        getRecognitionList(searchText, pageNumber, pageSize, sort, 0, 0).then(res => {

            let { RecognitionMain } = this.state;
            let newRecognitionMain = res.data.list;
            RecognitionMain = [...RecognitionMain, ...newRecognitionMain];

            RecognitionMain = RecognitionMain.filter(function (item, index, array) {
                return array.indexOf(item) === index;
            });
            this.setState({
                RecognitionMain,
                totalPages: res.data.totalPages,
                totalRecords: res.data.totalRecords,
                currentPage: res.data.currentPage + 1
            })

        }

        )
    }

    getPoliciesDocumentList = () => {
        const { searchText, pageNumber, pageSize, sort } = this.state;
        getPoliciesDocumentList(searchText, pageNumber, pageSize, sort).then(res => {
            let { policiesdocument } = this.state;
            let newpoliciesdocument = res.data.list;
            policiesdocument = [...policiesdocument, ...newpoliciesdocument];

            policiesdocument = policiesdocument.filter(function (item, index, array) {
                return array.indexOf(item) === index;
            });
            if (res.status == "OK") {
                this.setState({
                    policiesdocument,
                    totalPages: res.data.totalPages,
                    totalRecords: res.data.totalRecords,
                    currentPage: res.data.currentPage + 1
                })
            }
        })
    }

    getLeaveTrackerList = () => {
        {
            isCompanyAdmin && getLeaveList(this.state.employeeId, this.state.branchId, this.state.departmentId, this.state.designationId, this.state.searchText, this.state.fromDate, this.state.toDate, this.state.page, this.state.LeaveTracksize, this.state.sort, this.state.self).then(res => {
                let { LeaveTrack } = this.state;
                let newLeaveTrack = res.data.list;
                LeaveTrack = [...LeaveTrack, ...newLeaveTrack];

                LeaveTrack = LeaveTrack.filter(function (item, index, array) {
                    return array.indexOf(item) === index;
                });
                if (res.status == "OK") {
                    this.setState({
                        LeaveTrack,
                        totalPages: res.data.totalPages,
                        totalRecords: res.data.totalRecords,
                        currentPage: res.data.currentPage + 1
                    })
                }
            })
        }
        {
            isEmployee && getLeaveList(this.state.employeeId, this.state.branchId, this.state.departmentId, this.state.designationId, this.state.searchText, this.state.fromDate, this.state.toDate, this.state.page, this.state.LeaveTracksize, this.state.sort, this.state.self).then(res => {
                let { LeaveTrackSelf } = this.state;
                let newLeaveTrackSelf = res.data.list;
                LeaveTrackSelf = [...LeaveTrackSelf, ...newLeaveTrackSelf];

                LeaveTrackSelf = LeaveTrackSelf.filter(function (item, index, array) {
                    return array.indexOf(item) === index;
                });
                if (res.status == "OK") {
                    this.setState({
                        LeaveTrackSelf,
                        totalPages: res.data.totalPages,
                        totalRecords: res.data.totalRecords,
                        currentPage: res.data.currentPage + 1
                    })
                }
            })
        }
    }

    hideForm = () => {
        this.setState({
            showForm: false,
            company: undefined
        })
    }
    login = () => {
       this.postAttendance();
        this.setState({
            isLoggedIn: true,
        })
    }
    logout = () => {  this.postAttendance();
        this.setState({
            isLoggedIn: false,
            isClockBtn: true
        })
    }
    getDashboardData = () => {
        {
            isCompanyAdmin && getCompanyAdminDashboardDetail().then(res => {
                this.setState({ dashboardData: res.data }, () => {
                });
            });
        }
        {
            isEmployee && getEmployeeDashboardDetail(new Date().toISOString().substring(0, 16)).then(res => {
                this.setState({ dashboardData: res.data });
            });
        }
    }
    getAttendance = () => {

        getEmployeeDashboardDetail(new Date().toISOString().substring(0, 16)).then(res => {
            this.setState({ dashboard: res.data });
        });
    }
    postAttendance = () => {
        postAttendance().then(() => {
            this.getAttendance();
        });
    }
    hideLeaveForm = () => {
        this.setState({
            showLeaveForm: false
        })
    }

    hideTimesheetForm = () => {
        this.setState({
            showTimesheetForm: false
        })
    }
    hideDocumentRequestForm = () => {
        this.setState({
            showDocumentRequestForm: false
        })
    }
    render() {
        const { dashboard, dashboardData, RecognitionMain, RecognitionSetup, LeaveTrack, LeaveTrackSelf, LeaveTrackTeam, totalPages, currentPage } = this.state;
        let button;
        if (isEmployee && dashboard?.currentAction == 1) {
            button = isEmployee ? <LogoutButton onClick={this.logout} disabled={dashboard?.currentAction == 1}>Clock Out</LogoutButton> : "";
        } else {
            button = isEmployee ? dashboard?.currentAction == 0 && <><LoginButton onClick={this.login} disabled={dashboard?.currentAction == 0} >Clock In</LoginButton></> : "";
        }
        return (
            <div className='row' id="MainDiv">
                <div className="new-backgroundImg"><img className="img-fluid" src={topBG} alt="responsive image" /></div>
                <Tooltip style={{marginLeft: '95%'}} title="New View"

                    componentsProps={{
                        tooltip: {
                            sx: {
                                fontSize: '15px',
                                bgcolor: 'common.black',
                                '& .MuiTooltip-arrow': {
                                    color: 'common.black',
                                },
                            },
                        },
                    }} placement="top-start">
                    <Link
                        to={`/app/main/NewSocialShare`}
                    >
                        <MdOutlineDashboardCustomize className='mt-2' style={{
                            position: 'absolute',
                            right: '13px',
                            top: '1.1%',
                            color: '#e9e9e9'
                        }} />
                    </Link>
                </Tooltip>

                <img src="" alt="" />
                <div className="Layout" >
                    <div className="left">
                        <div className={isEmployee ? "leftheadArtCard" : "leftCompheadArtCard"}>
                            <div className="userInfocss">
                                <div className="cardBgcss"></div>
                                <img className="proPic" alt={getUserName()} src={'data:image/jpeg;base64,' + getProfilePicture()} />
                                <div className="userDetails">
                                    <p className='user-name'>{getUserName()}</p>
                                    <p className='user-name user-title'>{getUserTitleName()} </p>
                                </div>
                            </div>
                            {isEmployee && <><div className="ClockInOutBtn" style={{}}>
                                {button}
                            </div>
                                <div className="ClockInOutDesc">
                                    {<p className='clockIn'><p>Today's Clock-in:</p> <span className="clockInOutSpan">  {toLocalTime(dashboard.actualClockIn)}</span></p>}
                                    {<p className='clockOut'><p>Today's Clock-out:</p> <span className="clockInOutSpan">  {toLocalTime(dashboard.actualClockOut)}</span> </p>}
                                    {/* <i className="fa fa-clock-o mr-1"></i>
                                    <i className="fa fa-clock-o mr-1"></i> */}
                                </div></>}
                        </div>
                        <div className="policyCard">
                            <div className="Title">
                                <h2 className="TitleAction">Policies & Documents</h2>
                                {/* <img src={quickActionIcon} alt="" /> */}
                            </div>
                            <div className="qui">
                                <div className="prog">
                                    {this.state.policiesdocument?.map((item, index) => {
                                        return (

                                            <div className="Actionval" key={index}>

                                                <a className="saActionval" onClick={() => {
                                                    fileDownload(item.id, item.id, "POLICY_DOCUMENT", item.fileName);
                                                }} title={item.fileName}>
                                                    <i className="fa fa-external-link" aria-hidden="true"></i> <span className='policyName'>{item.policiesName}</span>
                                                </a>
                                            </div>)
                                    })}

                                </div>
                            </div>
                        </div>
                        <div className="LeaveTrack">
                            <div className="Title d-flex">
                                <h2 className="TitleAction">Leave Tracker</h2>
                                <a>View All <i className="fa fa-long-arrow-right" aria-hidden="true" ></i></a>
                                {/* <i class="fa fa-caret-right" aria-hidden="true"></i> */}
                            </div>
                            <div className="card" id="leaveNav">
                                <div className="card-body p-0">
                                    <ul className="nav nav-pills nav-fill">
                                        {verifyOrgLevelViewPermission("LEAVE") && isCompanyAdmin && <li className="nav-item" id="leaveHeadNav"><a className="nav-link active" id="leave" href="#step0" data-toggle="tab" data-step={0} title="All Leave">All Leave</a></li>}
                                        {verifyViewPermission("LEAVE") && isEmployee && <li className="nav-item" id="leaveHeadNav"><a className="nav-link active" id="leave" href="#step1" data-toggle="tab" data-step={1} title="My Leave">My Leave</a></li>}
                                        {verifyViewPermissionForTeam("LEAVE") && isEmployee && <li className="nav-item" id="leaveHeadNav"><a className="nav-link " id="leave" href="#step2" data-toggle="tab" data-step={2} title="Team">My Team</a></li>}
                                    </ul>
                                </div>
                            </div>
                            <div className="tab-content pt-0">
                                {verifyOrgLevelViewPermission("LEAVE") && <div className="tab-pane active" id="step0">

                                    {this.state.LeaveTrack?.map((item, index) => {
                                        return (
                                            <div className="Actionval leave-tracker" key={index} >
                                                <div>
                                                    <span className='employeeName'> {item.employee?.name}</span>
                                                </div>
                                                <div className='leaveDetails'>
                                                    {/* <div className="leftContent" style={{ paddingTop: "10px" }} >
                                                        {item.status == "PENDING" ? <>
                                                            <img style={{ width: "16px", height: "16px", backgroundPosition: "0 0", backgroundSize: "100%", backgroundRepeat: "no-repeat" }} className="img-fluid" src={leaveapplied} alt="responsive image" /></> :
                                                            item.status == "APPROVED" ? <><img style={{ width: "16px", height: "16px", backgroundPosition: "0 0", backgroundSize: "100%", backgroundRepeat: "no-repeat" }} className="img-fluid" src={leaveapproved} alt="responsive image" /></> :
                                                                <><img style={{ width: "16px", height: "16px", backgroundPosition: "0 0", backgroundSize: "100%", backgroundRepeat: "no-repeat" }} className="img-fluid" src={leavecancelled} alt="responsive image" /></>

                                                        }
                                                    </div> */}
                                                    
                                                    <div className="image-content">
                                                            <img className="proPic secondary-proPic ternery-proPic leave-proPic"
                                                                onError={({ currentTarget }) => {
                                                                    currentTarget.onerror = null;
                                                                    currentTarget.src = getDefaultProfilePicture();
                                                                }} src={'data:image/jpeg;base64,' + item.profileImg} />
                                                    </div>
                                                    <div className="" >
                                                        <div className="leaveAction">
                                                            {/* <Link
                                                                to={'/app/company-app/LeaveTrackView/' + item.id}
                                                                title="view"><i iconSize="16" className="fa fa-angle-right"></i>{item.id}</Link> */}
                                                            <div className="leavedays">
                                                                {item.status == "PENDING" ? <><span className='badge badge-pill badge-primary applied-badge'>Applied</span><br /></> :
                                                                    item.status == "APPROVED" ? <><span className='badge badge-pill badge-primary approved-badge'>Approved</span><br /></> :
                                                                        <><span className='badge badge-pill badge-primary rejected-badge'>Rejected</span><br /></>}
                                                                     <div className='no-of-leaves'> {item.totalDays} day's</div>
                                                                
                                                            </div>
                                                            <div className="leavedate">{getCustomizedDate(item.startDate)} <i className="fa fa-arrow-right"></i> {getCustomizedDate(item.endDate)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="arrow-link-div">
                                                        <Link
                                                            to={{ pathname: "/app/company-app/LeaveTrackView", state: { id: item.id } }}
                                                            title="view">
                                                            <i iconSize="16" className="fa fa-angle-right"></i>
                                                        </Link>
                                                    </div>
                                                </div>
                                                
                                            </div>)
                                    })}
                                </div>}
                                {verifyViewPermission("LEAVE") && isEmployee && <div className="tab-pane active" id="step1">
                                    {this.state.LeaveTrackSelf?.map((item, index) => {
                                        return (
                                            <div className="Actionval leave-tracker" key={index} >
                                                <div>
                                                    <span className='employeeName'> {item.employee?.name}</span>
                                                </div>
                                                <div className='leaveDetails'>
                                                    {/* <div className="leftContent" style={{ paddingTop: "10px" }} >
                                                        {item.status == "PENDING" ? <>
                                                            <img style={{ width: "16px", height: "16px", backgroundPosition: "0 0", backgroundSize: "100%", backgroundRepeat: "no-repeat" }} className="img-fluid" src={leaveapplied} alt="responsive image" /></> :
                                                            item.status == "APPROVED" ? <><img style={{ width: "16px", height: "16px", backgroundPosition: "0 0", backgroundSize: "100%", backgroundRepeat: "no-repeat" }} className="img-fluid" src={leaveapproved} alt="responsive image" /></> :
                                                                <><img style={{ width: "16px", height: "16px", backgroundPosition: "0 0", backgroundSize: "100%", backgroundRepeat: "no-repeat" }} className="img-fluid" src={leavecancelled} alt="responsive image" /></>

                                                        }
                                                    </div> */}
                                                    
                                                    <div className="image-content">
                                                            <img className="proPic secondary-proPic ternery-proPic leave-proPic"
                                                                onError={({ currentTarget }) => {
                                                                    currentTarget.onerror = null; 
                                                                    currentTarget.src = getDefaultProfilePicture();
                                                                }} src={'data:image/jpeg;base64,' + item.profileImg} />
                                                    </div>
                                                    <div className="" >
                                                        <div className="leaveAction">
                                                            {/* <Link
                                                                to={'/app/company-app/LeaveTrackView/' + item.id}
                                                                title="view"><i iconSize="16" className="fa fa-angle-right"></i>{item.id}</Link> */}
                                                            <div className="leavedays">
                                                                {item.status == "PENDING" ? <><span className='badge badge-pill badge-primary applied-badge'>Applied</span><br /></> :
                                                                    item.status == "APPROVED" ? <><span className='badge badge-pill badge-primary approved-badge'>Approved</span><br /></> :
                                                                        <><span className='badge badge-pill badge-primary rejected-badge'>Rejected</span><br /></>}
                                                                     <div className='no-of-leaves'> {item.totalDays} day's</div>
                                                                
                                                            </div>
                                                            <div className="leavedate">{getCustomizedDate(item.startDate)} <i className="fa fa-arrow-right"></i> {getCustomizedDate(item.endDate)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="arrow-link-div">
                                                        <Link
                                                            to={{ pathname: "/app/company-app/LeaveTrackView", state: { id: item.id } }}
                                                            title="view">
                                                            <i iconSize="16" className="fa fa-angle-right"></i>
                                                        </Link>
                                                    </div>
                                                </div>
                                                
                                            </div>)
                                    })}
                                </div>}
                                {verifyViewPermissionForTeam("LEAVE") && isEmployee && <div className="tab-pane" id="step2">
                                    {this.state.LeaveTrackTeam?.map((item, index) => {
                                        return (
                                            <div className="Actionval leave-tracker" key={index} >
                                                <div>
                                                    <span className='employeeName'> {item.employee?.name}</span>
                                                </div>
                                                <div className='leaveDetails'>
                                                    {/* <div className="leftContent" style={{ paddingTop: "10px" }} >
                                                        {item.status == "PENDING" ? <>
                                                            <img style={{ width: "16px", height: "16px", backgroundPosition: "0 0", backgroundSize: "100%", backgroundRepeat: "no-repeat" }} className="img-fluid" src={leaveapplied} alt="responsive image" /></> :
                                                            item.status == "APPROVED" ? <><img style={{ width: "16px", height: "16px", backgroundPosition: "0 0", backgroundSize: "100%", backgroundRepeat: "no-repeat" }} className="img-fluid" src={leaveapproved} alt="responsive image" /></> :
                                                                <><img style={{ width: "16px", height: "16px", backgroundPosition: "0 0", backgroundSize: "100%", backgroundRepeat: "no-repeat" }} className="img-fluid" src={leavecancelled} alt="responsive image" /></>

                                                        }
                                                    </div> */}
                                                    
                                                    <div className="image-content">
                                                            <img className="proPic secondary-proPic ternery-proPic leave-proPic"
                                                                onError={({ currentTarget }) => {
                                                                    currentTarget.onerror = null; 
                                                                    currentTarget.src = getDefaultProfilePicture();
                                                                }} src={'data:image/jpeg;base64,' + item.profileImg} />
                                                    </div>
                                                    <div className="" >
                                                        <div className="leaveAction">
                                                            {/* <Link
                                                                to={'/app/company-app/LeaveTrackView/' + item.id}
                                                                title="view"><i iconSize="16" className="fa fa-angle-right"></i>{item.id}</Link> */}
                                                            <div className="leavedays">
                                                                {item.status == "PENDING" ? <><span className='badge badge-pill badge-primary applied-badge'>Applied</span><br /></> :
                                                                    item.status == "APPROVED" ? <><span className='badge badge-pill badge-primary approved-badge'>Approved</span><br /></> :
                                                                        <><span className='badge badge-pill badge-primary rejected-badge'>Rejected</span><br /></>}
                                                                     <div className='no-of-leaves'> {item.totalDays} day's</div>
                                                                
                                                            </div>
                                                            <div className="leavedate">{getCustomizedDate(item.startDate)} <i className="fa fa-arrow-right"></i> {getCustomizedDate(item.endDate)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="arrow-link-div">
                                                        <Link
                                                            to={{ pathname: "/app/company-app/LeaveTrackView", state: { id: item.id } }}
                                                            title="view">
                                                            <i iconSize="16" className="fa fa-angle-right"></i>
                                                        </Link>
                                                    </div>
                                                </div>
                                                
                                            </div>)
                                    })}
                                </div>}
                            </div>

                        </div>

                    </div>
                    <div className="rightHead">

                        <div className="announcementCard">
                            <div className="Title d-flex">
                                <h2 className="TitleAction">Organizational Announcements</h2>
                                <a>View All <i className="fa fa-long-arrow-right" aria-hidden="true" ></i></a>
                                {/* <i class="fa fa-caret-right" aria-hidden="true"></i> */}
                            </div>
                            <div className="announcementContent">
                                {/* Temporary */}
                                <div className="userInfocss">
                                    <div className="d-flex">
                                        <div className="cardBgcss"></div>
                                        <img className="proPic secondary-proPic" alt={getUserName()} src={'data:image/jpeg;base64,' + getProfilePicture()} />
                                        <div className="userDetails">
                                            <p className='user-name'>{getUserName()}</p>
                                            <p className='user-name user-title'>{getUserTitleName()} </p>
                                        </div>
                                    </div>
                                    <div className="announcement-badge">
                                        <span class="badge badge-pill badge-primary new-badge">Announcement</span>
                                        <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                                    </div>
                                </div>
                                {/* Temporary */}
                                {dashboardData?.announcements?.map((item, index) => {
                                    return (

                                        <div key={index} className="border-bottom">
                                            <h5><i><small>{getReadableDate(new Date(item.validFrom))} - {getReadableDate(new Date(item.validTill))}</small></i>
                                                <br />{item.title}</h5>
                                            <p><small>{item.description}</small></p>
                                        </div>
                                    )
                                })}
                                {(!dashboardData?.announcements || dashboardData?.announcements?.length == 0) && <span>No Announcement</span>}
                            </div>
                        </div>

                        <div className="followcard">
                            <div className="Title d-flex">
                                <h2 className="TitleAction">My Tasks</h2>
                                <a>View All <i className="fa fa-long-arrow-right" aria-hidden="true" ></i></a>
                                {/* <i class="fa fa-caret-right" aria-hidden="true"></i> */}
                            </div>
                            <div className="scroll-div">
                            <div className="qui">
                                <div className="prog inside-div-dashboard" >
                                    {verifyEditPermission("TIMESHEET") && <div className="Actionval" role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" >
                                        <a className="saActionval" onClick={() => {
                                            this.setState({
                                                showTimesheetForm: true
                                            })
                                        }}>
                                            <i className="fa fa-clock-o mr-1"></i>
                                            <span>Add Timesheet</span>
                                        </a>
                                    </div>}
                                    {verifyEditPermission("LEAVE") && <div className="Actionval" role="progressbar" aria-valuenow="18" aria-valuemin="0" aria-valuemax="100" >
                                        <a className="saActionval" onClick={() => {
                                            this.setState({
                                                showLeaveForm: true
                                            })
                                        }}>
                                            <i className="fa fa-calendar-check-o mr-1"></i>
                                            <span>Apply Leave</span>
                                        </a>
                                    </div>}
                                    <div className="Actionval" role="progressbar" aria-valuenow="12" aria-valuemin="0" aria-valuemax="100" >
                                        <a className="saActionval" onClick={() => {
                                            this.setState({
                                                showDocumentRequestForm: true
                                            })
                                        }}>
                                            <i className="fa fa-file-text-o mr-1"></i>
                                            <span>Request Document</span>
                                        </a>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="qui">
                                <div className="prog inside-div-dashboard" >
                                    {verifyEditPermission("TIMESHEET") && <div className="Actionval" role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" >
                                        <a className="saActionval" onClick={() => {
                                            this.setState({
                                                showTimesheetForm: true
                                            })
                                        }}>
                                            <i className="fa fa-clock-o mr-1"></i>
                                            <span>Add Timesheet</span>
                                        </a>
                                    </div>}
                                    {verifyEditPermission("LEAVE") && <div className="Actionval" role="progressbar" aria-valuenow="18" aria-valuemin="0" aria-valuemax="100" >
                                        <a className="saActionval" onClick={() => {
                                            this.setState({
                                                showLeaveForm: true
                                            })
                                        }}>
                                            <i className="fa fa-calendar-check-o mr-1"></i>
                                            <span>Apply Leave</span>
                                        </a>
                                    </div>}
                                    <div className="Actionval" role="progressbar" aria-valuenow="12" aria-valuemin="0" aria-valuemax="100" >
                                        <a className="saActionval" onClick={() => {
                                            this.setState({
                                                showDocumentRequestForm: true
                                            })
                                        }}>
                                            <i className="fa fa-file-text-o mr-1"></i>
                                            <span>Request Document</span>
                                        </a>
                                    </div>
                                </div>
                                
                            </div>
                            </div>
                        </div>


                    </div>
                    <div className="center">
                        {/* Add Comment to post textarea and submit button */}
                        <div className='addPost-div'>
                            <div className="div">
                                <img className="proPic secondary-proPic ternery-proPic" alt={getUserName()} src={'data:image/jpeg;base64,' + getProfilePicture()} />
                            </div>
                            <div className="input-group">
                                <input type="text" className="form-control post-form-input" style={{borderRadius: "25px"}} placeholder="Photo/Video/Announcement" aria-label="Recipient's post" aria-describedby="basic-addon2"/>
                                    <div className="input-group-append post-btn-group">
                                        {/* <button className="btn btn-success" type="button">Create Post</button> */}
                                        <a className="btn btn-success post-btn" onClick={() => this.setState({ showForm: true })}>Create Post
                            </a>
                                    </div>
                            </div>
                            {/* <a className="saActionval" onClick={() => this.setState({ showForm: true })}>
                                <i className="fa fa-edit"></i> Add Post
                            </a> */}
                        </div>
                        
                        {/* Social Share List */}
                        {this.state.RecognitionMain?.map((item, index) => {
                            let showComment = item.comments;
                            if (item.commentCount) {
                                showComment = showComment.slice(0, item.commentCount > 0 ? item.commentCount : defaultCommentCount);
                            }
                            return (
                                <div className="recognitionShare" key={index}>
                                    <div className="recognitionWrapper" style={{backgroundImage:"../assets/img/social-post-bg.png"}}>
                                        {/* <img src={PlainBg} alt="responsive image" /> */}
                                        <div className="recognitionTop" >
                                            <div className="recognitionHead">
                                                <div className="recognitionMedal">
                                                    <img className="img-fluid" src={PlainBg} alt="responsive image" />
                                                    <h2 className='recomments' >{item.reccommentss}</h2>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className='col-md-4'>
                                                </div>
                                                <div className="col-md-4 text-center">
                                                    <Link className="recEmployeePic" to={`/app/company-app/employee/detail/${item.awardee?.id}`}>
                                                            <img onError={({ currentTarget }) => {
                                                                currentTarget.onerror = null; // prevents looping
                                                                currentTarget.src = getDefaultProfilePicture();
                                                            }} src={'data:image/jpeg;base64,' + item.profileImg} />
                                                            <p className='employeeName post-empName'>{item.awardee?.name}</p>
                                                            <p ><b>
                                                    <MediaComponent mediaPath={item.mediaPath} mediaType={item.mediaType} />
                                                    &nbsp;{item.recognitionSetup?.name}</b></p>
                                                    </Link>
                                                </div>
                                                <div className="col-md-4">
                                                    {/* <img style={{ height: "35px", width: "45px", paddingTop: "10px", paddingLeft: "10px", color: "#55687D" }} className="img-fluid" src={StarMedal} alt="responsive image" /> */}
                                                    <span className='badge badge-pill badge-primary new-badge' >
                                                        <i class="fa fa-certificate mr-2" aria-hidden="true"></i>Recognition
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="row recognitionEmployee text-center mt-5">
                                                <div className="col-md-6 d-flex align-items-center justify-content-end">
                                                    <div className="" >
                                                        <EmployeeListColumn
                                                            id={item.recognizer?.id} ></EmployeeListColumn>

                                                    </div>
                                                    <div >
                                                        <p >Recognized by:</p>
                                                        <p className='user-name user-title'>{item.recognizer?.name}</p>
                                                    </div>
                                                </div>
                                                <div className="recognizedDate col-md-6">
                                                    {/* <h3 style={{ textAlign: "center", color: "#55687D", fontfamily: "wotfard", fontSize: "16px", fontWeight: "normal" }}>{item.jobtitles?.name}</h3> */}
                                                    <span>Created Date:</span>
                                                    <h6 style={{ display: "block", color: "#55687D", paddingTop: "5px", fontfamily: "wotfard", fontSize: "14px", fontWeight: "normal" }}>
                                                         {getCustomizedDate(item.createdOn)}
                                                    </h6>
                                                    {/* {item.recognizer?.name} */}
                                                </div>
                                            </div>
                                            
                                        </div>
                                        <div className="card post">
                                            <ul className="meta">
                                                <li>
                                                    <span>
                                                        <i class="fa fa-smile-o" aria-hidden="true"></i>
                                                    </span>
                                                </li>
                                                <li>
                                                    <span> <a onClick={() => {
                                                        putRecognitionLike(item.id).then(res => {
                                                            if (res.status == "OK") {
                                                                let { RecognitionMain } = this.state;
                                                                let index = RecognitionMain.findIndex(x => x.id == res.data.id);
                                                                RecognitionMain[index] = res.data;
                                                                this.setState({
                                                                    RecognitionMain: RecognitionMain,
                                                                })
                                                            }
                                                        });
                                                    }}><i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                                    </a></span> <p>{item.likes?.length || 0} Likes</p>
                                                </li>
                                                <li className='comment-pill'>
                                                    <span><i class="fa fa-commenting-o" aria-hidden="true"></i></span> &nbsp;
                                                     <p>{item.comments?.length || 0} Comments</p>
                                                </li>

                                            </ul>
                                        </div>
                                    </div>
                                    <div className='p-2'>

                                        <div className='d-flex'>
                                            <InputEmoji
                                            
                                                value={this.state.postcomments}
                                                onChange={(val) => {
                                                    this.setState({
                                                        postcomments: val
                                                    });
                                                }}
                                                cleanOnEnter
                                                placeholder="Type a message"
                                            />
                                            <div class="input-group-append comment-group">
                                                <button class="btn btn-secondary send-btn" type="button" onClick={() => {
                                                    putRecognitionComment(item.id, this.state.postcomments).then(res => {
                                                        if (res.status == "OK") {
                                                            let { RecognitionMain } = this.state;
                                                            let index = RecognitionMain.findIndex(x => x.id == res.data.id);
                                                            RecognitionMain[index] = res.data;
                                                            this.setState({
                                                                RecognitionMain: RecognitionMain,
                                                                postcomments: ""
                                                            })
                                                        }
                                                    });
                                                }}>
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card post">
                                        <div className="comments-area clearfix meta">

                                            {showComment?.map((comment, index) => {
                                                return (

                                                    <div className="pt-1 pb-1" key={index}>
                                                        <div className="comment-name-date">
                                                            <strong>{comment.userName}&nbsp;</strong><small>{getReadableDate(comment.createdOn)}</small>
                                                        </div>
                                                        <br />
                                                        <span>{comment.comments}</span>
                                                    </div>

                                                )
                                            }
                                            )}
                                            {(item.comments?.length > showComment.length) && <div className="p-2">

                                                <center>
                                                    <a onClick={() => {
                                                        let { RecognitionMain } = this.state;
                                                        let index = RecognitionMain.findIndex(x => x.id == item.id);
                                                        let commentCount = RecognitionMain[index].commentCount ? RecognitionMain[index].commentCount + defaultCommentCount : defaultCommentCount * 2;
                                                        if (commentCount > item.Reccomment.length) {
                                                            commentCount = item.Reccomment.length;
                                                        }
                                                        RecognitionMain[index].commentCount = commentCount;
                                                        this.setState({
                                                            RecognitionMain: RecognitionMain
                                                        })
                                                    }}>Load More...</a>
                                                </center>
                                            </div>
                                            }
                                        </div></div>
                                </div>)
                        })}
                        {this.state.socialShare?.map((item, index) => {
                            let showComments = item.comments;
                            if (item.commentCount) {
                                showComments = showComments.slice(0, item.commentCount);
                            } else {
                                showComments = showComments.slice(0, defaultCommentCount);
                            }
                            return (
                                <div className="recognitionShare" key={index}>
                                    <div className="recognitionWrapper">
                                        <div className="recognitionTop" >
                                            <div className="recognitionHead">
                                                <div className="recognitionMedal">
                                                    <div className="d-flex">
                                                    <img className="img-fluid social-post-propic" src={socialmediapost} alt="responsive image" />
                                                    <div className="social-post-details">
                                                        <h6>Social Posts</h6>
                                                        <small>{getCustomizedDate(item.createdOn)}</small>
                                                    </div>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <span className='badge badge-pill badge-primary social-badge mr-2'><i class="fa fa-plus-circle mr-1" aria-hidden="true"></i>Social Post</span>
                                                        <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <article className="card-body social-post-pic mb-0">

                                                <h3 className="post-title">{item.title}</h3>
                                                <p>{item.description}</p>
                                                <MediaComponent mediaPath={item.mediaPath} mediaType={item.mediaType} />
                                            </article>
                                        </div>
                                        <div className="card post">
                                            <ul className="meta">
                                                <li>
                                                    <span>
                                                        <i class="fa fa-smile-o" aria-hidden="true"></i>
                                                    </span>
                                                </li>
                                            <li><span> <a onClick={() => {
                                                putSocialShareLike(item.id).then(res => {
                                                    if (res.status == "OK") {
                                                        let { socialShare } = this.state;
                                                        let index = socialShare.findIndex(x => x.id == res.data.id);
                                                        socialShare[index] = res.data;
                                                        this.setState({
                                                            socialShare: socialShare,
                                                        })
                                                    }
                                                });
                                            }}><i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                            </a></span> <p> {item.likes?.length || 0} Likes</p>
                                                &nbsp;

                                            </li>
                                            <li className='comment-pill'>
                                                <span><i class="fa fa-commenting-o" aria-hidden="true"></i></span>&nbsp;
                                                <p>{item.comments?.length || 0} Comments</p>
                                            </li>

                                        </ul>
                                        </div>
                                    </div>
                                    <div className='p-2'>

                                        <div className='d-flex'>
                                            <InputEmoji
                                                value={this.state.postcomment}
                                                onChange={(val) => {
                                                    this.setState({
                                                        postcomment: val
                                                    });
                                                }}
                                                cleanOnEnter
                                                placeholder="Type a message" />
                                            <div class="input-group-append comment-group">
                                                <button class="btn btn-secondary send-btn" type="button" onClick={() => {
                                                    putSocialShareComment(item.id, this.state.postcomment).then(res => {
                                                        if (res.status == "OK") {
                                                            let { socialShare } = this.state;
                                                            let index = socialShare.findIndex(x => x.id == res.data.id);
                                                            socialShare[index] = res.data;
                                                            this.setState({
                                                                socialShare: socialShare,
                                                                postcomment: ""
                                                            })
                                                        }
                                                    });
                                                }}>Send</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card post">
                                        <div className="comments-area clearfix meta">

                                            {showComments?.map((comment, index) => {
                                                return (

                                                    <div className="pt-1 pb-1" key={index}>
                                                        <div className="comment-name-date">
                                                        <strong>{comment.userName}&nbsp;</strong><small>{getReadableDate(comment.createdOn)}</small>
                                                        </div>
                                                        <br />
                                                        <span>{comment.comment}</span>
                                                    </div>

                                                )
                                            }
                                            )}
                                            {(item.comments?.length > showComments.length) && <div className="p-2">

                                                <center>
                                                    <a onClick={() => {
                                                        let { socialShare } = this.state;
                                                        let index = socialShare.findIndex(x => x.id == item.id);
                                                        let commentCount = socialShare[index].commentCount ? socialShare[index].commentCount + defaultCommentCount : defaultCommentCount * 2;
                                                        if (commentCount > item.comments.length) {
                                                            commentCount = item.comments.length;
                                                        }
                                                        socialShare[index].commentCount = commentCount;
                                                        this.setState({
                                                            socialShare: socialShare
                                                        })
                                                    }}>Load More...</a>
                                                </center>
                                            </div>
                                            }
                                        </div></div>


                                </div>)
                        })}

                        {/* Load More button when totalPages greater than currentpage+1*/}
                        {totalPages > currentPage &&
                            <div className="text-center">
                                <button className="btn btn-primary" onClick={() => {
                                    this.setState({
                                        pageNumber: currentPage
                                    }, this.getSocialShareList,
                                        this.getRecognitionList)
                                }}>Load More</button>
                            </div>
                        }




                        {/* Manage Department Modal */}
                        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
                            <Header closeButton>
                                <h5 className="modal-title">Add Post</h5>
                            </Header>
                            <Body>
                                <Formik
                                    enableReinitialize={true}
                                    onSubmit={this.postSocialShare}
                                    initialValues={{
                                        title: this.state.title,
                                        description: this.state.description,
                                        file: this.state.file
                                    }}
                                >
                                    {({
                                        setFieldValue,

                                        /* and other goodies */
                                    }) => (
                                        <Form encType="multipart/form-data">
                                            <FormGroup className='text-center'>
                                                <Field name="title" className="form-control" placeholder="Title"></Field>
                                            </FormGroup>
                                            <FormGroup className='text-center'>
                                                <Field name="description" className="form-control" placeholder="Description" component="textarea"></Field>
                                            </FormGroup>
                                            <FormGroup>
                                                <input type="file" className="form-control" accept="image/x-png,image/jpeg,image/jpg,video/mp4" onChange={(event) => {
                                                    if (event.currentTarget.files.length > 0)
                                                        setFieldValue('file', event.currentTarget.files[0]);
                                                }} />
                                            </FormGroup>
                                            <input type="submit" className="btn btn-primary" value={"Post"} />
                                        </Form>
                                    )
                                    }
                                </Formik>
                            </Body>
                        </Modal>
                    </div >

                </div>
                <Modal enforceFocus={false} size={"lg"} show={this.state.showLeaveForm} onHide={this.hideLeaveForm} >
                    <Header closeButton>
                        <h5 className="modal-title">Add Leave</h5>
                    </Header>
                    <Body>
                        <LeaveForm updateList={this.hideLeaveForm}>
                        </LeaveForm>
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"lg"} show={this.state.showTimesheetForm} onHide={this.hideTimesheetForm} >
                    <Header closeButton>
                        <h5 className="modal-title">Add Timesheet</h5>
                    </Header>
                    <Body>
                        <CreateTimesheetForm updateList={this.hideTimesheetForm}>
                        </CreateTimesheetForm>
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"xl"} show={this.state.showDocumentRequestForm} onHide={this.hideDocumentRequestForm}>
                    <Header closeButton>
                        <h5 className="modal-title">
                            Add DocumentRequest
                        </h5>
                    </Header>
                    <Body>
                        <DocumentRequestForm
                            updateList={this.hideDocumentRequestForm}
                        ></DocumentRequestForm>
                    </Body>
                </Modal>
            </div >
        )
    }
}
