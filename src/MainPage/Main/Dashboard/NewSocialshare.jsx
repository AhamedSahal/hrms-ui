import { Button, Tooltip, styled } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Modal, Anchor } from 'react-bootstrap';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { AiOutlineLike, AiOutlinePlusCircle } from "react-icons/ai";
import { BiCommentDots, BiDotsHorizontalRounded, BiMedal, BiTask } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaBirthdayCake, FaChevronRight, FaFileDownload } from "react-icons/fa";
import { MdOutlineCelebration } from "react-icons/md";
import { TbCheckbox } from "react-icons/tb";
import InputEmoji from 'react-input-emoji';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormGroup } from 'reactstrap';
import { getOvertimeActive } from '../../../CompanyApp/Employee/service.jsx';
import EmployeeListColumn from '../../../CompanyApp/Employee/employeeListColumn.jsx';
import EmployeePhoto from '../../../CompanyApp/Employee/employeePhoto.jsx';
import LeaveForm from '../../../CompanyApp/Employee/leave/form.jsx';
import { getLeaveList } from '../../../CompanyApp/Employee/leave/service.jsx';
import DocumentRequestForm from '../../../CompanyApp/ModuleSetup/DocumentRequest/form.jsx';
import { getPoliciesDocumentList } from '../../../CompanyApp/ModuleSetup/PoliciesDocuments/service.jsx';
import { getRecognitionList } from '../../../CompanyApp/RecognitionMain/service.jsx';
import { getMyTasksList, updateStatus } from '../../../CompanyApp/Tasks/service.jsx';
import { getTeamLeaveList } from '../../../CompanyApp/TeamApproval/leave/service.jsx';
import CreateTimesheetForm from '../../../CompanyApp/Timesheet/form.jsx';
import { fileDownload } from '../../../HttpRequest.jsx';
import greatWorkBg from '../../../assets/img/randomImg/GreatWork.png';
import customerService from '../../../assets/img/randomImg/CustomerService.png';
import teamPlayer from '../../../assets/img/randomImg/BestTeamPlayer.png';
import EmployeeOftheMonth from '../../../assets/img/randomImg/EmployeeofTheMonth.png';
import { convertToUserTimeZone, getCustomizedDate, getCustomizedWidgetDate, getDefaultProfilePicture, getEmployeeId, getPermission, getProfilePicture, getReadableDate, getRoleId, getUserName, getUserType, toLocalTime, verifyViewPermission, verifyViewPermissionForTeam, verifyOrgLevelViewPermission, getLogo, verifyApprovalPermission } from '../../../utility.jsx';
import MediaComponent from '../../MediaComponent.jsx';
import "../../SocialShare.css";
import { deleteSocialPost, getAttendanceCount, getCompanyAdminDashboardDetail, getDocumentExpiryByMonth, getEmployeeDashboardDetail, getEmployeeMissingInfoCount, getMissingDocumentCount, getRoles, getSocialShareList, getTimesheet, getUpComingAnnouncements, getUpComingCelebration, getUpComingDocumentExpiry, getUpComingHire, getUpComingHolidays, getUpComingLeaving, postAttendance, postSocialShare, putRecognitionComment, putRecognitionLike, putSocialShareComment, putSocialShareLike, putSocialShareReactions, updateLeaveStatus, updateTimesheetStatus } from './service.jsx';
import { PERMISSION_LEVEL } from '../../../Constant/enum.js';
import Baloon from "../../../assets/img/baloon4.png"
import confetti from "../../../assets/img/confetti.png"
import { confirmAlert } from 'react-confirm-alert';
import { getLeaveBalanceShowOnDashboard } from '../../../CompanyApp/MyEntitlements/Leave/service.jsx';
import { getLeaveBalance } from '../../../CompanyApp/MyEntitlements/Leave/service.jsx';
import { getTimeinLieuStatus, updateTimeinLieuStatus } from '../../../CompanyApp/MyEntitlements/TimeInLieu/service.jsx';
import { getDashboardOtStatus, updateOverTimeForAttendance } from '../../../CompanyApp/Payroll/Overtime/service.jsx';
import { Empty } from 'antd';
import TodaysAttendanceList from './todayAttendaceList.jsx';
import { IoMdCheckmarkCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";
import EmployeeProfilePhoto from '../../../CompanyApp/Employee/widgetEmployeePhoto.jsx';
import successimg from '../../../assets/img/successimg.gif';
import reject from '../../../assets/img/rejectimg.gif';
import SuccessAlert from '../../successToast.jsx';
import Chart from "react-apexcharts";
import ReactionList from './ReactionsList.jsx';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { BsStopwatch } from "react-icons/bs";
import { Card, Avatar, Typography, Input } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons'
import moment from 'moment';
import { Sticky } from 'react-sticky';
import UploadDocsEmployeeForm from './uploadDocsForm.jsx';
import checkimg from '../../../assets/img/tickmarkimg.gif'
import HolidayCalendar from './HolidaysList.jsx';

const { Text } = Typography;

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 3000, min: 1450 },
        items: 4
    },
    desktop: {
        breakpoint: { max: 1450, min: 1200 },
        items: 3
    },
    tablet: {
        breakpoint: { max: 1200, min: 800 },
        items: 5
    },
    mobile: {
        breakpoint: { max: 800, min: 0 },
        items: 2
    }
};

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN' || getPermission("Employee", "VIEW") == PERMISSION_LEVEL.ORGANIZATION;;
const isEmployee = getUserType() == 'EMPLOYEE';
const employeeRoleId = getRoleId()
const { Header, Body, Footer, Dialog } = Modal;


const defaultCommentCount = 5;
function LoginButton(props) {
    return <button onClick={() => {
        props.onClick();
    }} className="clockIn_Btn">
        <BsStopwatch className="clockIn_Btn_icon" size={25} />
        <span className="clockIn_Btn_Text">Clock-In</span>
    </button>
}


function LogoutButton(props) {
    return <button onClick={() => {
        props.onClick();
    }} className="clockOut_Btn">
        <BsStopwatch className="clockOut_Btn_icon" size={25} />
        <span className="clockOut_Btn_Text">Clock-Out</span>
    </button>
}

export default class NewSocialShare extends Component {

    constructor(props) {
        super(props);
        var today = new Date();
        var firstDay = new Date(today.getFullYear(), 0, 2);
        var lastDay = new Date(today.getFullYear(), 11, 31);
        var currYear = today.getFullYear()
        this.state = {
            employeeId: isEmployee ? getEmployeeId() : undefined,
            searchText: "",
            pageNumber: 0,
            LeaveTracksize: 5,
            size: 10,
            pageSize: 10,
            page: 0,
            sort: "id,desc",
            self: isCompanyAdmin ? 0 : 1,
            branchId: "",
            departmentId: "",
            designationId: "",
            fromDate: firstDay.toISOString().split('T')[0],
            toDate: lastDay.toISOString().split('T')[0],
            loadNewSocialShare: false,
            newHire: false,
            dashboard: {},
            socialShare: [],
            RecognitionMain: [],
            RecognitionSetup: [],
            policiesdocument: [],
            myTaskList: [],
            status: true,
            isLoggedIn: false,
            isClockBtn: false,
            date1: new Date().toLocaleString(),
            q: "",
            statusname: "PENDING",
            statname: "REJECTED",
            todayAttendance: {},
            upComingHolidays: [],
            upComingAnnouncement: [],
            upComingCelebration: [],
            upComingHire: [],
            upComingLeaving: [],
            upComingDocumentExpiry: [],
            documentExpiryByMonth: [],
            missingInfoCount: '',
            showComments: false,
            clickedCommentId: null,
            clickedShareCommentId: null,
            missingDocumentCount: '',
            commentText: {},
            totalPages: 0,
            totalRecords: 0,
            currentPage: 0,
            hasMoreData: false,
            hideLoadMore: false,
            dashboardView: true,
            commentBox: '',
            commentCount: 2,
            socialCommentBox: '',
            socialCommentCount: 2,
            activeButton: 0,
            leaveList: [],
            leaveSize: 30,
            defaultEmployeeId: getEmployeeId(),
            defaultYear: currYear,
            leaveBalanceList: [],
            timeSheetList: '',
            overTimeList: '',
            timeInLieu: '',
            remark: "",
            // attendanceToggle: true,
            roleName: 'admin',
            selfPermission: 0,
            showAlert: false,
            alertMsg: '',
            imgTag: '',
            alertDesc: '',
            showEmojis: false,
            logo: getLogo(),
            showLikeList: false,
            likeControl: 'like',
            attendanceToggle: getEmployeeId() > 0 ? 0 : 2,
            likeId: 0,
            options: {

                labels: ['On Time', 'Absent', 'Late'],
                colors: ['#4fbe74', '#8c5fe8', '#f88535'],
                chart: {
                    type: 'donut',
                },

                legend: {
                    show: false
                },
                tooltip: {
                    enabled: false
                },
                dataLabels: {
                    enabled: false
                },
                fill: {
                    type: 'gradient',
                },
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                show: true,
                                total: {
                                    show: true,
                                    label: 'Total',
                                    color: '#000',
                                    fontSize: '12px',
                                    fontFamily: 'Arial, sans-serif',
                                    fontWeight: 600,
                                    formatter: () => {
                                        return this.state.todayAttendance.total ?? 0;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        this.timeoutId = null;
    }
    componentDidMount() {
        this.getAttendance();
        this.getPoliciesDocumentList();
        this.getSocialShareList();
        this.fetchList();
        this.getTodayAttendance(getEmployeeId() > 0 ? 0 : 2);
        this.getupComingHolidays();
        this.getupComingAnnouncement();
        this.getUpComingCelebration();
        this.getUpComingHire();
        this.getUpComingLeaving();
        this.getDocumentExpiry();
        this.getDocumentExpiryMonth();
        this.getMissingInfoCount();
        this.fetchMissingDocumentCount();
        this.fetchApprovalList();
        this.getOvertimeEnable();
    }

    getOvertimeEnable = () => {
        getOvertimeActive().then(res => {
            if (res.status == "OK") {
                this.setState({ overtimeEnable: res.data })
            }
        });
    }

    fetchApprovalList = () => {
        getRoles().then(res => {
            if (res.status == "OK") {
                const empRoles = res.data
                empRoles.forEach(role => {
                    if (role.id === employeeRoleId) {
                        this.setState({ roleName: role.name })
                    }
                });
            }
        })
        {
            verifyViewPermission("TIMESHEET") && getTimesheet(this.state.q, this.state.fromDate, this.state.toDate, this.state.page, this.state.size, this.state.sort, 0).then(res => {
                if (res.status == "OK") {
                    const filterdList = res.data.list.filter(item => item.approvalStatus === "PENDING")
                    this.setState({ timeSheetList: filterdList })
                }
            })
        }
        {
            verifyViewPermission("LEAVE") && getLeaveList(this.state.employeeId, this.state.branchId, this.state.departmentId, this.state.designationId, this.state.searchText, this.state.fromDate, this.state.toDate, this.state.page, this.state.leaveSize, this.state.sort, 0).then(res => {
                if (res.status == "OK") {
                    const pendingLeaveList = res.data.list.filter(item => item.status === "PENDING");
                    this.setState({ leaveList: pendingLeaveList })
                }
            })
        }
        {
            verifyViewPermission("LEAVE") && getLeaveBalanceShowOnDashboard(this.state.defaultEmployeeId, this.state.defaultYear).then(res => {
                if (res.status == "OK") {
                    this.setState({ leaveBalanceList: res.data.details })
                }
            })
        }
        {
            verifyViewPermission("ATTENDANCE") && getDashboardOtStatus().then(res => {
                if (res.status == "OK") {
                    this.setState({ overTimeList: res.data })
                }
            })
        }

        {
            verifyViewPermission("LEAVE") && getTimeinLieuStatus().then(res => {
                if (res.status == "OK") {
                    this.setState({ timeInLieu: res.data })
                }
            })
        }

    }
    fetchList = () => {
        {
            getMyTasksList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.statusname, this.state.statname, this.state.dashboardView).then(res => {
                if (res.data != null) {
                    const sortedArray = res.data.list
                    const array1 = sortedArray.sort((a, b) => a.enddate - b.enddate)
                }

                if (res.status == "OK") {
                    this.setState({
                        myTaskList: res.data != null ? res.data.list : [],

                    })
                }

            })
        }

    }
    getTodayAttendance = (permission) => {
        this.setState({ selfPermission: permission })
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        getAttendanceCount(formattedDate, permission).then(res => {
            if (res.status === 'OK') {
                this.setState({
                    todayAttendance: res.data,
                });
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    };
    getupComingHolidays = () => {
        getUpComingHolidays().then(res => {
            if (res.status === 'OK') {
                this.setState({
                    upComingHolidays: res.data,
                });
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    };
    getupComingAnnouncement = () => {
        getUpComingAnnouncements().then(res => {
            if (res.status === 'OK') {
                this.setState({
                    upComingAnnouncement: res.data,
                })
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    };
    getUpComingCelebration = () => {
        getUpComingCelebration().then(res => {
            if (res.status === 'OK') {
                this.setState({
                    upComingCelebration: res.data,
                })
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    };
    getUpComingHire = () => {
        getUpComingHire().then(res => {
            if (res.status === 'OK') {
                this.setState({
                    upComingHire: res.data,
                })
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    };
    getUpComingLeaving = () => {
        getUpComingLeaving().then(res => {
            if (res.status === 'OK') {
                this.setState({
                    upComingLeaving: res.data,
                })
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    };

    getDocumentExpiry = () => {
        getUpComingDocumentExpiry().then(res => {
            if (res.status === 'OK') {
                this.setState({
                    upComingDocumentExpiry: res.data,
                })
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    };

    getMissingInfoCount = () => {
        getEmployeeMissingInfoCount().then(res => {
            if (res.status === 'OK') {
                this.setState({
                    missingInfoCount: res.data,
                })
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    };

    getDocumentExpiryMonth = async (month) => {
        try {
            const res = await getDocumentExpiryByMonth(month);
            if (res.status === 'NOT_FOUND' && res.data === null) {
                this.setState({
                    documentExpiryByMonth: null,
                });
            } else if (res.status === 'OK') {
                this.setState({
                    documentExpiryByMonth: res.data,
                });
            } else {
                console.log("Error: " + res.message);
            }
        } catch (error) {
            console.log("Error: " + error);
            this.setState({
                documentExpiryByMonth: null,
            });
        }
    };

    fetchMissingDocumentCount = (month) => {
        getMissingDocumentCount(month).then(res => {
            if (res.status === 'OK') {
                this.setState({
                    missingDocumentCount: res.data,
                })
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    };

    updateStatus = (id, status) => {
        updateStatus(id, status).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.fetchList();
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            console.error(err);
            toast.error("Error while updating status");
        })
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.loadNewSocialShare !== prevState.loadNewSocialShare) {
            this.getSocialShareList();
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.loadNewSocialShare !== state.loadNewSocialShare) {
            return {
                loadNewSocialShare: props.loadNewSocialShare

            };
        }

        // Return null to indicate no change to state.
        return null;
    }

    getSocialShareList = () => {

        const { currentPage, searchText, pageNumber, pageSize, sort, totalPages } = this.state;
        const { socialShare } = this.state;
        if (this.state.currentPage < this.state.totalPages) {
            this.setState({ hasMore: false })

        }
        const startIndex = socialShare.length;
        return getSocialShareList(searchText, pageNumber, pageSize, sort, startIndex, pageSize).then(res => {
            const newSocialShare = res.data.list;
            const hasMoreData = newSocialShare && newSocialShare.length > 0;
            this.setState({ hasMoreData });

            const uniqueRecords = newSocialShare.filter(item => socialShare.findIndex(record => record.id === item.id) === -1);
            this.setState(prevState => ({
                socialShare: newSocialShare,
                totalPages: res.data.totalPages,
                totalRecords: res.data.totalRecords,
                currentPage: res.data.currentPage,
                pageSize: this.state.pageSize + 10,
            })
            );
            return uniqueRecords.length;
        });
    };
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


    hideForm = () => {
        this.setState({
            showForm: false,
            company: undefined
        })
    }
    login = () => {
        var today = new Date();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        this.postAttendance();
        this.setState({
            isLoggedIn: true,
        })
    }
    logout = () => {
        var today = new Date();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

        const startDate = moment.utc(this.state.dashboard.actualClockIn + "Z")
        const endDate = moment.utc();
        const duration = moment.duration(endDate.diff(startDate));
        const timeDifference = Math.floor(duration.asMinutes());

        if (timeDifference < 120) {
            confirmAlert({
                message: `Are you sure you want to clock-out?`,
                buttons: [
                    {
                        label: 'Cancel',
                        onClick: () => { }
                    },
                    {
                        label: "I'm Sure",
                        className: "confirm-alert",
                        onClick: () => {
                            this.postAttendance();
                            this.setState({
                                isLoggedIn: false,
                                isClockBtn: true
                            })
                        },
                    }
                ]
            });
        } else {
            this.postAttendance();
            this.setState({
                isLoggedIn: false,
                isClockBtn: true
            })
        }
    }
    getAttendance = () => {
        getEmployeeDashboardDetail(new Date().toISOString().substring(0, 16)).then(res => {
            this.setState({ dashboard: res.data });
        });
    }
    postAttendance = () => {
        postAttendance().then(res => {
            if (res.status != "OK") {
                toast.error(res.message);
            }
            this.getAttendance();
        });
    }
    hideLeaveForm = () => {
        this.setState({
            showLeaveForm: false
        })
    }
    hideAttendanceList = () => {
        this.setState({
            showAttendanceList: false
        })
    }
    hideExpiringDocumentTab = () => {
        this.setState({
            showExpiringDocument: false
        })
    }

    hideTimesheetForm = () => {
        this.setState({
            showTimesheetForm: false
        })
    }
    hideUploadDocsForm = () => {
        this.setState({
            showUploadDocsForm: false
        })
    }
    hideDocumentRequestForm = () => {
        this.setState({
            showDocumentRequestForm: false
        })
    }
    hideLeaveAction = () => {
        this.setState({
            showLeaveAction: false
        })
    }
    hideReactionList = () => {
        this.setState({
            showReactionList: false
        })
    }
    hideHolidays = () => {
        this.setState({
            showHolidays: false
        })
    }
    responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4,
        },
        tablet: {
            breakpoint: { max: 1024, min: 768 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 768, min: 0 },
            items: 1,
        },

    };

    handleCommentClick(commentId) {
        this.setState((prevState) => ({
            clickedCommentId: commentId,
            showComments: !prevState.showComments
        }));
    }

    handleCommentClickShare = (commentId) => {
        this.setState((prevState) => ({
            showComments: prevState.clickedCommentId !== commentId || !prevState.showComments,
            clickedShareCommentId: prevState.clickedShareCommentId !== commentId ? commentId : null,
        }));
    };
    handleDeletePost = (item) => {
        const datas = {
            id: item.id,
            type: item.type
        }
        confirmAlert({
            title: `Delete Social post`,
            message: 'Are you sure, you want to delete this social post?',
            buttons: [
                {
                    className: "btn btn-danger",
                    label: 'Yes',
                    onClick: () => deleteSocialPost(datas).then(res => {
                        if (res.status == "OK") {
                            toast.success(res.message);
                            // this.fetchList();
                            window.location.reload();
                        } else {
                            toast.error(res.message)
                        }
                    })
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }
    handleMouseEnter = () => {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.setState({ showEmojis: true });
    };

    handleMouseLeave = () => {
        this.timeoutId = setTimeout(() => {
            this.setState({ showEmojis: false });
        }, 500);
    };
    handleLikeEnter = () => {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.setState({ showLikeList: true });
    };

    handleLikeLeave = () => {
        this.timeoutId = setTimeout(() => {
            this.setState({ showLikeList: false });
        }, 500);
    };
    loadMoreComments = () => {

        this.setState({ commentCount: this.state.commentCount + 5 })
    }
    loadMoreSocialComments = () => {
        this.setState({ socialCommentCount: this.state.socialCommentCount + 5 })
    }
    handleLikeClick = (value) => {
        this.setState({ likeControl: value })
        const reactionId = { iconId: value.id, id: value.postId }
        putSocialShareReactions(reactionId.id, reactionId.iconId).then(res => {
            if (res.status == "OK") {
                // toast.success(res.message);
                this.getSocialShareList()
            } else {
                toast.error(res.message);
            }
        }).catch(err => {
            console.log(err)
            toast.error("Error while put Like");
        })
    }


    handleButtonClick(index) {
        this.setState({ activeButton: index });
    }
    updateLeaveStatus = (id, status) => {
        if ((status == "REJECTED" && this.state.remark != "") || status == "APPROVED") {
            updateLeaveStatus(id, status, this.state.remark).then(res => {
                if (res.status == "OK") {
                    // toast.success(res.message);
                    this.showAlert(status)
                    setTimeout(function () {
                        window.location.reload()
                    }, 3000)
                } else {
                    toast.error(res.message);
                }
            })
        } else {
            toast.error("Remark is required");
        }
    }
    updateTimeSheetStatus = (id, status, hour) => {
        updateTimesheetStatus(id, hour, status).then(res => {
            if (res.status == "OK") {
                // toast.success(res.message);
                this.showAlert(status)
                setTimeout(function () {
                    window.location.reload()
                }, 4000)
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            console.error(err);
            toast.error("Error while updating status");
        })
    }
    showAlert = (status) => {
        if (status === 'APPROVED') {
            this.setState({
                alertMsg: 'Approved!',
                imgTag: successimg,
                showAlert: true
            });
        } else if (status === 'REJECTED') {
            this.setState({
                alertMsg: 'Rejected!',
                imgTag: reject,
                showAlert: true
            });
        } else if (status === 'submit') {
            this.setState({
                alertMsg: 'Submitted!',
                imgTag: checkimg,
                desc: 'Submitted successfully',
                showAlert: true
            });
        } else { }

        setTimeout(() => {
            this.setState({ showAlert: false });
        }, 3000);
    }

    updateOverTimeForAttendanceStatus = (id, hours, status, employeeId) => {
        updateOverTimeForAttendance(id, hours, status, employeeId).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                setTimeout(function () {
                    window.location.reload()
                }, 4000)
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            console.error(err);
            toast.error("Error while updating status");
        })
    }
    updateStatusForTimeinLieu = (id, status, approvedHours) => {
        updateTimeinLieuStatus(id, status, approvedHours).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                setTimeout(function () {
                    window.location.reload()
                }, 4000)
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            console.error(err);
            toast.error("Error while updating status");
        })
    }
    reduceString = (str, maxLength) => {
        if (typeof str !== 'string' || str.length <= maxLength) {
            return str || '';
        } else {
            return str.slice(0, maxLength) + '...';
        }
    }


    getLeaveDaytype = (type) => {
        if (type == 2) return "FH";
        else if (type == 3) return "SH";
        return "";

    }

    getLeaveDaytypeHover = (type) => {
        if (type == 2) return "First Half";
        else if (type == 3) return "Second Half";
        return "";

    }

    handleMouseOver = (id) => {
        this.setState({ likeId: id })
    }

    handleForm = (id) => {
        this.setState({ likeId: id }, () => {
            this.setState({ showReactionList: true })
        })
    }

    render() {
        const { documentExpiryByMonth, likeControl, logo, upComingDocumentExpiry, upComingBirthday, upComingAnniversary, upComingHolidays, todayAttendance, upComingAnnouncement, dashboard, dashboardData, socialShare, RecognitionSetup, policiesdocument, LeaveTrack, LeaveTrackSelf, LeaveTrackTeam, totalPages, currentPage, totalRecords, clockin, clockout, isLoggedIn } = this.state;
        const { item } = this.props;
        const { hideLoadMore } = this.state;
        const { timeSheetList, attendanceToggle, roleName, newHire, showComments, clickedCommentId, clickedShareCommentId, leaveList, leaveBalanceList, overTimeList, timeInLieu, hasMore } = this.state;

        const buttons = ['Leave', 'Timesheet', 'Overtime', 'Time in Lieu'];
        const { activeButton } = this.state;
        const colors = ['#8C5FE4', '#4DC2DD', '#45C56D', '#f88535', '#EBBF4C'];
        const celebrationColors = ['#E6F7E8', '#ECE7FB', '#E6F7E8', '#ECE7FB', '#E6F7E8', '#ECE7FB'];
        const MeetingDashboardTooltip = styled(({ className, ...props }) => (
            <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
        ))(`
              color: black;
              background-color: #ededed;
              font-size: 1em;
              width: 17em;
              box-shadow: 0px 0px 2px 0px;
          `);

        const series = [
            this.state.todayAttendance.onTime ?? 0,
            this.state.todayAttendance.absent ?? 0,
            this.state.todayAttendance.onLate ?? 0
        ];



        return (
            <div>
                {this.state.showAlert && (
                    <SuccessAlert
                        headText={this.state.alertMsg}
                        img={this.state.imgTag}
                    />
                )}
                <img src="" alt="" />
                <div className='quickAccess'>
                    <div className="vertical-text">
                        Quick Actions
                    </div>
                    <div className='accessActionDiv'>
                        <Tooltip title="Add Timesheet" componentsProps={{
                            tooltip: {
                                sx: {
                                    fontSize: '15px',
                                    bgcolor: 'common.black',
                                    '& .MuiTooltip-arrow': {
                                        color: 'common.black',
                                    },
                                },
                            },
                        }} placement="left">
                            <i onClick={() => { this.setState({ showTimesheetForm: true }) }}
                                className="quickAccess_icon mr-3 fa fa-calendar lg" aria-hidden="true"></i>
                        </Tooltip>
                        <Tooltip title="Request Document" componentsProps={{
                            tooltip: {
                                sx: {
                                    fontSize: '15px',
                                    bgcolor: 'common.black',
                                    '& .MuiTooltip-arrow': {
                                        color: 'common.black',
                                    },
                                },
                            },
                        }} placement="left">
                            <i onClick={() => { this.setState({ showDocumentRequestForm: true }) }}
                                className="quickAccess_icon mr-3 fa fa-book lg" aria-hidden="true"></i>
                        </Tooltip>
                        <Tooltip title="Apply Leave" componentsProps={{
                            tooltip: {
                                sx: {
                                    fontSize: '15px',
                                    bgcolor: 'common.black',
                                    '& .MuiTooltip-arrow': {
                                        color: 'common.black',
                                    },
                                },
                            },
                        }} placement="left">
                            <i onClick={() => { this.setState({ showLeaveForm: true }) }}
                                className="quickAccess_icon fa fa-arrow-circle-o-right" aria-hidden="true"></i>
                        </Tooltip>
                        <Tooltip title="Upload Document" componentsProps={{
                            tooltip: {
                                sx: {
                                    fontSize: '15px',
                                    bgcolor: 'common.black',
                                    '& .MuiTooltip-arrow': {
                                        color: 'common.black',
                                    },
                                },
                            },
                        }} placement="left">
                            <i onClick={() => { this.setState({ showUploadDocsForm: true }) }}
                                className="quickAccess_icon mr-3 fa fa-upload lg" aria-hidden="true"></i>
                        </Tooltip>
                    </div>
                </div>
                <div style={{ padding: '15px 17px 25px 32px' }} className="mt-5 container-fluid">
                    <div className="row">
                        {/* Left Section */}
                        <div className="col-xs-auto col-xl-homeLeft col-md-12 col-lg-12  col-sm-12 mb-3">
                            {/* Attendance ClockIn/Out */}
                            <div className='AdminProfile' >
                                <div className='adminInfocss'>
                                    <div className="cardBgcss"></div>
                                    <img className="float-left attendanceWidgetproPic" alt={getUserName()} src={'data:image/jpeg;base64,' + getProfilePicture()} />
                                    <div className='mb-2'>
                                        <p className='user-profile'>{getUserName()}</p>
                                    </div>
                                </div>

                                <div >
                                    <div className="time-entry">
                                        <span>Clock-In:</span>
                                        <span className='clockInText'  > {getEmployeeId() != 0 && dashboard?.actualClockIn ? convertToUserTimeZone(dashboard.actualClockIn) : ' -'}</span>
                                    </div>
                                    <div className="time-entry">
                                        <span>Clock-Out:</span>
                                        <span className='clockOutText' >{getEmployeeId() != 0 && dashboard?.actualClockOut ? convertToUserTimeZone(dashboard.actualClockOut) : ' -'} </span>
                                    </div>
                                </div>
                                {
                                    getEmployeeId() != 0 && dashboard && dashboard.currentAction != 2 && <>
                                        {dashboard.currentAction == 0 && <LoginButton onClick={this.login}  >Clock In</LoginButton>}
                                        {dashboard.currentAction == 1 && <LogoutButton onClick={this.logout}>Clock Out</LogoutButton>}
                                    </>
                                }
                            </div>
                            {/* Monthly Attendance */}
                            {roleName === 'admin' || roleName === 'HR' || roleName === 'Manager' ? <div className='AttendanceCards' >
                                <div className='attendanceTitle Title' >
                                    <div>
                                        {attendanceToggle == 0 && roleName != "Employee" ? <h2 className='newDashboardTitleAction'>Monthly Attendance</h2> :
                                            <h2 className='newDashboardTitleAction'>Today's Attendance</h2>
                                        }

                                    </div>
                                    {roleName == 'admin' || roleName == 'HR' ? <Link to={`/app/company-app/attendance`}>
                                        <p className='viewAllBtn'>View All</p>
                                    </Link> :
                                        this.state.selfPermission == 1 ? <Link
                                            to='/app/company-app/attendance'
                                            state={{ teamPermission: true }}
                                        >
                                            <p className='viewAllBtn'>View All</p>
                                        </Link> :
                                            <Link to={`/app/company-app/attendance`}>
                                                <p className='viewAllBtn'>View All</p>
                                            </Link>}
                                </div>
                                <div className='attendance-body'>
                                    < div className='divBtnAtd d-flex'>

                                        {this.state.defaultEmployeeId > 0 && <span
                                            onClick={() => {
                                                this.setState({ attendanceToggle: 0 }, this.getTodayAttendance(0))

                                            }} className={`teamBtnText ${attendanceToggle == 0 ? 'teamBtnTextActive' : ''}`}>Self</span>}
                                        {this.state.defaultEmployeeId > 0 && verifyViewPermissionForTeam("ATTENDANCE") && <span onClick={() => { this.setState({ attendanceToggle: 1 }, this.getTodayAttendance(1)) }} className={`teamBtnText ${attendanceToggle == 1 ? 'teamBtnTextActive' : ''}`}>Team</span>}
                                        {verifyOrgLevelViewPermission("ATTENDANCE") && <span onClick={() => { this.setState({ attendanceToggle: 2 }, this.getTodayAttendance(2)) }} className={`teamBtnText ${attendanceToggle == 2 ? 'teamBtnTextActive' : ''}`}>Org</span>}

                                    </div>
                                    <div style={{ justifyContent: 'center' }} className='d-flex'>
                                        <div className="attendance-total">
                                            <Chart options={this.state.options} series={series} type="donut" width="110" height="110" />
                                        </div>
                                        <div className="attendance-details">
                                            <div onClick={() => {
                                                this.setState({ showAttendanceList: true, presentsList: 'onTime' });
                                            }} className="onTimeAttend attendance-item">
                                                <span>On Time</span>
                                                <span ><b>{this.state.todayAttendance.onTime}</b></span>
                                            </div>
                                            <div onClick={() => {
                                                this.setState({ showAttendanceList: true, presentsList: 'absent' });
                                            }} className="absentAttend attendance-item">
                                                <span>Absent</span>
                                                <span ><b>{this.state.todayAttendance.absent}</b></span>
                                            </div>
                                            <div onClick={() => {
                                                this.setState({ showAttendanceList: true, presentsList: 'late' });
                                            }} className="lateAttend attendance-item">
                                                <span>Late</span>
                                                <span ><b>{this.state.todayAttendance.onLate}</b></span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div> : <div className='AttendanceCards' >
                                <div className='attendanceTitle Title' >
                                    <div>
                                        <h2 className='newDashboardTitleAction'>Monthly Attendance</h2>
                                    </div>
                                    <Link to={`/app/company-app/attendance`}>
                                        <p className='viewAllBtn'>View All</p>
                                    </Link>
                                </div>
                                <div className='attendance-body'>

                                    <div style={{ justifyContent: 'center' }} className='d-flex'>
                                        <div className="attendance-total">
                                            <Chart options={this.state.options} series={series} type="donut" width="110" height="110" />
                                        </div>
                                        <div className="attendance-details">
                                            <div onClick={() => {
                                                this.setState({ showAttendanceList: true, presentsList: 'onTime' });
                                            }} className="onTimeAttend attendance-item">
                                                <span>On Time</span>
                                                <span ><b>{this.state.todayAttendance.onTime}</b></span>
                                            </div>
                                            <div onClick={() => {
                                                this.setState({ showAttendanceList: true, presentsList: 'absent' });
                                            }} className="absentAttend attendance-item">
                                                <span>Absent</span>
                                                <span ><b>{this.state.todayAttendance.absent}</b></span>
                                            </div>
                                            <div onClick={() => {
                                                this.setState({ showAttendanceList: true, presentsList: 'late' });
                                            }} className="lateAttend attendance-item">
                                                <span>Late</span>
                                                <span ><b>{this.state.todayAttendance.onLate}</b></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}

                            {/* Employee Leave balance Widget */}
                            {
                                <div className='AttendanceCards' >
                                    <div className='attendanceTitle Title' >
                                        <h2 className='newDashboardTitleAction' >Leave Balance</h2>
                                        <Link to='/app/company-app/leave'
                                            state={{ fromDashboard: true }}
                                        >
                                            <p className='viewAllBtn'>View All</p>
                                        </Link>
                                    </div>
                                    <div style={{ placeContent: 'space-evenly', marginBottom: '25px' }} className="d-flex">
                                        {this.state.leaveBalanceList?.length > 0 ? leaveBalanceList.map((data) => {

                                            return (
                                                <div className='leaveCircle'>
                                                    <CircularProgressbarWithChildren
                                                        value={Math.round(data?.leaveBalance)}
                                                        maxValue={Math.round(data?.totalEligible)}
                                                        styles={buildStyles({
                                                            strokeLinecap: 'butt',
                                                            pathTransitionDuration: 0.5,
                                                            pathColor: '#22b6ff',
                                                            trailColor: '#c3c3c3',
                                                            backgroundColor: '#3e98c7',

                                                        })}
                                                    >
                                                        <div >
                                                            <p style={{ marginBottom: '-10px', fontSize: '20px', fontWeight: 700 }}>{(data?.leaveBalance.toFixed(2)) > 0 ? (data?.leaveBalance.toFixed(2)) : '0'}</p>
                                                            <span style={{ fontSize: '13px' }}>Balance</span>
                                                        </div>
                                                    </CircularProgressbarWithChildren>
                                                    <div style={{ fontSize: '12px', width: '100px', marginLeft: '-16px' }}>
                                                        <span>{this.reduceString(data?.leaveType.name, 15)}</span>
                                                    </div>

                                                </div>)
                                        }) : <span><Empty /></span>}


                                    </div>
                                </div>
                            }
                            {/* Emp policyCard */}
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

                                                    <Anchor className="saActionval" onClick={() => {
                                                        fileDownload(item.id, item.id, "POLICY_DOCUMENT", item.fileName);
                                                    }} title={item.fileName}>
                                                        <FaFileDownload className='policyIcon' /> <span className='policyName'>{item.policiesName}</span>
                                                    </Anchor>
                                                </div>)
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Expiring Documents */}

                            <div className='ExpiringDocuments' >
                                <div className='attendanceTitle Title' >
                                    {!isEmployee ? <h2 className='newDashboardTitleAction'>Expiring Documents</h2>
                                        : <h2 className='newEmpDashboardTitleAction'>My Expiring Documents</h2>}
                                    <Link to={`/app/company-app/documentExpiry`}>
                                        <p className='viewAllBtn'>View All</p>
                                    </Link>
                                </div>
                                <div id='ExpireDocElements' className="container" >
                                    {this.state.upComingDocumentExpiry.length === 0 ? (
                                        <div>No Upcoming Expiring Document.

                                        </div>
                                    ) : (

                                        this.state.upComingDocumentExpiry.map((data, index) => (


                                            <div onClick={() => {
                                                this.getDocumentExpiryMonth(data.month);
                                                this.setState({ showExpiringDocument: true });
                                            }}

                                                className="expireDocs item col">

                                                <span className='p-1 float-left' >  {new Date(data.month + '-01').toLocaleString('default', { month: 'long' }) + ' '}
                                                </span><b className='float-right' style={{ fontSize: '16px' }}>{data.expiryDocuments}</b>

                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className='InformationCards' >
                                <div className='attendanceTitle Title'>
                                    {!isEmployee ? <h2 className='newDashboardTitleAction'>Missing Information</h2>
                                        : <h2 className='newEmpDashboardTitleAction'>My Missing Information</h2>}
                                    <Link to="/app/company-app/missing-information?activeTab=missingInfo">
                                        <p className='viewAllBtn'>View All</p>
                                    </Link>
                                </div>
                                <div className='p-2 col-12 d-flex'>
                                    <div className="countBox">
                                        <p>{this.state.missingInfoCount}</p>
                                    </div>
                                    <p id='infoCardText' >Employees Missing Information</p>
                                </div>
                                <div className='attendanceTitle Title'>
                                    {!isEmployee ? <h2 className='newDashboardTitleAction'>Missing Documents</h2>
                                        : <h2 className='newEmpDashboardTitleAction'>My Missing Documents</h2>}
                                    <Link to="/app/company-app/missing-information?activeTab=missingDoc">
                                        <p className='viewAllBtn'>View All</p>
                                    </Link>
                                </div>

                                <div className='borderDivExpireDoc' ></div>
                                <div className='mb-2 p-2 col-12 d-flex'>
                                    <div className="countBox">
                                        <p>{this.state.missingDocumentCount}</p>
                                    </div>
                                    <p id='infoCardText' >Employees Missing Documents</p>
                                </div>
                            </div>


                        </div>
                        {/* Center Section */}
                        <div className="col-xs-auto col-xl-homeCenter col-md-12 col-lg-12 col-sm-12 mb-3">
                            <div className={upComingAnnouncement?.length === 0 ? 'noAnnouncement' : 'newAnnouncementCard'} >
                                <div className="Title d-flex">
                                    <h2 className='newDashboardTitleAction'>Organizational Announcements</h2>
                                    <Link to={`/app/company-app/module-setup/announcement`}>
                                        <p className='viewAllBtn'>View All</p>
                                    </Link>
                                </div>
                                <div className='announcementSection'>
                                    {upComingAnnouncement?.map((item, index) => {
                                        return (
                                            <div className='announcementData'>
                                                <div key={index}>
                                                    <div className='mt-1'>
                                                        <p className='annoucementTitle'>{item.title}</p>
                                                    </div>
                                                    <p className='annoucementDescr'>{item.description}</p>
                                                </div>
                                                <div style={{ fontSize: '13px' }} className=''>
                                                    <p className='mb-0 text-secondary float-left'>{getCustomizedWidgetDate(new Date(item.validFrom))} - {getCustomizedWidgetDate(new Date(item.validTill))}</p>
                                                    <p className='m-0 text-secondary text-right'>By: HR Department</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {(!upComingAnnouncement || upComingAnnouncement?.length == 0) && <span> No Announcement</span>}
                                </div>
                            </div>
                            <div className='myTaskWidget'>
                                <div className="Title d-flex">
                                    <h2 className='newDashboardTitleAction'>My Task</h2>
                                    <Link to={`/app/company-app/Tasks`}>
                                        <p className='viewAllBtn'>View All</p>
                                    </Link>
                                </div>
                                <div className="p-2 scroll-div">
                                    {this.state.myTaskList.length > 0 ? this.state.myTaskList.map((item, index) => (
                                        <>
                                            {index < 5 ?
                                                <div className="container myTask">
                                                    <div className='float-left myTaskDiv'>
                                                        <p className='myTaskName'><BiTask size={20} /> {item.taskname}</p>

                                                        <p className='myTaskStatus'>Status : <span>{item.status == "REJECTED" ? "OVERDUE" : item.status}</span></p>
                                                    </div>
                                                    <div className='d-flex float-right'>

                                                        <p className='text-dark'>Due : <span>{getCustomizedWidgetDate(item.enddate)}</span></p>
                                                        <Tooltip title="Mark as complete" componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    fontSize: '15px',
                                                                    bgcolor: 'common.black',
                                                                    '& .MuiTooltip-arrow': {
                                                                        color: 'common.black',
                                                                    },
                                                                },
                                                            },
                                                        }} placement="top">
                                                            <p><TbCheckbox onClick={() => {
                                                                let { status } = this.state;
                                                                status = (item.status == "PENDING" ? "APPROVED" : "PENDING");
                                                                this.updateStatus(item.id, status);
                                                            }} className='ml-5 myTaskCheckBtn' size={25} /></p>
                                                        </Tooltip>
                                                    </div>
                                                </div> : null}
                                        </>
                                    )) : <span><Empty /></span>}
                                </div>
                            </div>
                            {roleName === 'admin' || roleName === 'HR' || roleName === 'Manager' ? <div className='approvalsWidget' >
                                <div className="approvalWidgetTitle d-flex">
                                    <h2 className='newDashboardTitleAction'>Approvals</h2>
                                    {activeButton === 0 &&
                                        <Link to="/app/company-app/leave">
                                            <p className='viewAllBtn'>View All</p>
                                        </Link>
                                    }
                                    {activeButton === 1 &&
                                        <Link to="/app/company-app/timesheet">
                                            <p className='viewAllBtn'>View All</p>
                                        </Link>
                                    }
                                    {this.state.overtimeEnable && activeButton === 2 &&
                                        <Link to='/app/company-app/attendance'
                                            state={{ fromDashboardOvertime: true }}
                                        >
                                            <p className='viewAllBtn'>View All</p>
                                        </Link>
                                    }
                                    {activeButton === 3 &&
                                        <Link to='/app/company-app/leave'
                                            state={{ fromDashboardTimeInLieu: true }}
                                        >
                                            <p className='viewAllBtn'>View All</p>
                                        </Link>
                                    }
                                </div>
                                <div className=''>
                                    <div className='approvalWidgetBtn'>
                                        {buttons.map((button, index) => (
                                            <>
                                                <span
                                                    key={index}
                                                    className={`btnText ${activeButton === index ? 'btnTextActive' : ''}`}
                                                    onClick={() => this.handleButtonClick(index)}
                                                >
                                                    {button}

                                                </span>

                                            </>
                                        ))}
                                    </div>
                                    <div className="p-2 aprvScroll-div">
                                        {/* Leave Action */}

                                        {activeButton === 0 ? leaveList.length > 0 ? leaveList.map((leave, index) => (
                                            <>
                                                {index < 5 ?
                                                    <MeetingDashboardTooltip title={
                                                        <div>
                                                            <div className='pt-2 pb-2'>
                                                                <div className='float-left'>
                                                                    <EmployeeProfilePhoto className='poolImg' id={leave.employee.id}></EmployeeProfilePhoto>
                                                                </div>
                                                                <div className='ml-2 float-left'>
                                                                    <span className='font-weight-bold'>{this.reduceString(leave.employee.name, 20)}</span> <br />
                                                                    <span className="headTxt">{this.reduceString(leave.employeeJobTitle, 20)}</span>
                                                                </div>
                                                            </div> <br />
                                                            <div className='ratingBody'>
                                                                <div className='ratingContent'>
                                                                    <span> Leave Type :<b> {leave.leaveType?.name ? leave.leaveType.name.length > 10 ? leave.leaveType.name.slice(0, 10) + '...' : leave.leaveType.name : null} </b></span>
                                                                    <div>From: <b>{getCustomizedWidgetDate(leave.startDate)} {this.getLeaveDaytypeHover(leave.startDateDayType)}</b></div>
                                                                    <div>To: <b>{getCustomizedWidgetDate(leave.endDate)} {this.getLeaveDaytypeHover(leave.endDateDayType)}</b></div>
                                                                </div>
                                                                <div>No. of days: <b>{leave.totalDays} </b> </div>
                                                                <div>Leave Reason: <b>{leave.leaveReason} </b></div>
                                                                <div>Attachment: <> <b>  {leave.attachment && <Anchor style={{ color: 'black' }} onClick={() => {
                                                                    fileDownload(leave.id, leave.employee.id, "LEAVE_DOCUMENT", leave.attachment);
                                                                }} title={leave.attachment}>
                                                                    <i style={{ color: '#45C56D' }} className='fa fa-download'></i> Download
                                                                </Anchor>}
                                                                    {!leave.attachment && <>-</>
                                                                    }
                                                                </b>
                                                                </></div>
                                                            </div>
                                                        </div>
                                                    } >


                                                        <div key={index} className="leave-request">
                                                            <div className="widget-user-info">
                                                                <EmployeeProfilePhoto className='user-avatar' id={leave.employee.id}></EmployeeProfilePhoto>
                                                                <div className="approvalUser-details">
                                                                    <div className="user-name-aprv">{this.reduceString(leave.employee.name, 16)}</div>
                                                                    <div>From: <b>{getCustomizedWidgetDate(leave.startDate)} {this.getLeaveDaytype(leave.startDateDayType)} </b></div>
                                                                    <div>To: <b>{getCustomizedWidgetDate(leave.endDate)} {this.getLeaveDaytype(leave.endDateDayType)} </b></div>

                                                                </div>
                                                            </div>
                                                            <div style={{ width: '95px' }} className="text-left">
                                                                <span className='headTxt'>Leave Type</span> <br />
                                                                <span className='aprv_items'> <b> {leave.leaveType?.name ? leave.leaveType.name.length > 10 ? leave.leaveType.name.slice(0, 10) + '...' : leave.leaveType.name : null} </b></span>

                                                            </div>

                                                            <div className="leave-actions">
                                                                <Tooltip placement="top" title="Approve" arrow>
                                                                    <a onClick={() => {
                                                                        this.updateLeaveStatus(leave.id, "APPROVED");
                                                                    }} > <IoMdCheckmarkCircleOutline className='widgetApproveIcon' size={26} /> </a>

                                                                </Tooltip>
                                                                <Tooltip placement="top" title="Reject" arrow>
                                                                    <a onClick={() => {
                                                                        this.setState({ showLeaveAction: true, showForm: false, leaveId: leave.id })
                                                                    }} > <IoMdCloseCircleOutline className='widgetRejectIcon' size={26} /> </a>

                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    </MeetingDashboardTooltip> : null}
                                            </>

                                        )) : <span ><Empty style={{ marginTop: '35px' }} /></span> : null}
                                        {/* Timesheet Action */}

                                        {activeButton === 1 ? timeSheetList.length > 0 ? timeSheetList.map((list, index) => (
                                            <>
                                                {index < 5 ?
                                                    <MeetingDashboardTooltip title={
                                                        <div>
                                                            <div className='pt-2 pb-2'>
                                                                <div className='float-left'>
                                                                    <EmployeeProfilePhoto className='poolImg' id={list.employeeId}></EmployeeProfilePhoto>
                                                                </div>
                                                                <div className='ml-2 float-left'>
                                                                    <span className='font-weight-bold'>{list.employeeName}</span> <br />
                                                                    <span className="headTxt">{this.reduceString(list.jobTitle, 25)}</span>

                                                                </div>
                                                            </div> <br />
                                                            <div className='ratingBody'>
                                                                <div className='ratingContent'>
                                                                    <span > Project Name :<b> {list.projectName}</b> </span><br />
                                                                    <div>Activity Name: <b>{list.activityName} </b> </div>


                                                                    <div>No. of Hours: <b>{list.hours} </b> </div>
                                                                    <div>Description: <b>{list.description} </b> </div>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    }>
                                                        <div className="leave-request">
                                                            <div className="widget-user-info">
                                                                <EmployeeProfilePhoto className='user-avatar' id={list.employeeId}></EmployeeProfilePhoto>

                                                                <div className="approvalUser-details">
                                                                    <div className="user-name-aprv">{list.employeeName}</div>
                                                                    <div className="leave-date">{getCustomizedWidgetDate(list.date)}</div>

                                                                </div>
                                                            </div>
                                                            <div style={{ width: '115px' }} className="text-left">
                                                                <span className='headTxt'>Project</span> <br />
                                                                <span> <b>{list.projectName} </b></span>

                                                            </div>
                                                            <div className="leave-actions">
                                                                <Tooltip placement="top" title="Approve" arrow>
                                                                    <a onClick={() => {
                                                                        this.updateTimeSheetStatus(list.id, "APPROVED", list.hours);
                                                                    }}  > <IoMdCheckmarkCircleOutline className='widgetApproveIcon' size={26} /> </a>

                                                                </Tooltip>
                                                                <Tooltip placement="top" title="Reject" arrow>
                                                                    <a onClick={() => {
                                                                        this.updateTimeSheetStatus(list.id, "REJECTED", list.hours);
                                                                    }}  > <IoMdCloseCircleOutline className='widgetRejectIcon' size={26} /> </a>

                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    </MeetingDashboardTooltip> : null}
                                            </>
                                        )) : <span><Empty style={{ marginTop: '35px' }} /></span> : null}
                                        {/* Overtime Action */}

                                        {this.state.overtimeEnable && activeButton === 2 ? overTimeList.length > 0 ? overTimeList.map((data, index) => (
                                            <MeetingDashboardTooltip title={

                                                <div>
                                                    <div className='pt-2 pb-2'>
                                                        <div className='float-left'>
                                                            <EmployeeProfilePhoto className='poolImg' id={data.employeeId}></EmployeeProfilePhoto>
                                                        </div>
                                                        <div className='ml-2 float-left'>
                                                            <span className='font-weight-bold'>{data?.employee.name}</span> <br />
                                                            <span className="headTxt">{this.reduceString(data.employeeJobTitle, 25)}</span>
                                                        </div>
                                                    </div> <br />
                                                    <div className='ratingBody'>
                                                        <div className='ratingContent'>

                                                            <span > Plan Hour :<b> {data.plannedHours}</b> </span><br />
                                                            <div>Actual Hours: <b>{data.actualHours.toFixed(2)} </b> </div>
                                                            <div>Overtime Hours: <b>{data.hours.toFixed(2)}</b> </div>

                                                        </div>


                                                    </div>
                                                </div>
                                            }>
                                                <div className="leave-request">
                                                    <div className="widget-user-info">
                                                        <EmployeeProfilePhoto className='user-avatar' id={data.employeeId}></EmployeeProfilePhoto>

                                                        <div className="approvalUser-details">
                                                            <div className="user-name-aprv">{data?.employee.name}</div>
                                                            <div className="overtime-date">{getCustomizedWidgetDate(data.forDate)}</div>

                                                        </div>
                                                    </div>
                                                    <div style={{ width: '115px' }} className="text-left">
                                                        <span className='headTxt'>Overtime Hours</span> <br />
                                                        <span><b>{data.hours.toFixed(2)}</b></span>
                                                    </div>
                                                    <div className="leave-actions">
                                                        <Tooltip placement="top" title="Approve" arrow>
                                                            <a onClick={() => {
                                                                this.updateOverTimeForAttendanceStatus(data.id, data.hours, "APPROVED", data.employee.id);
                                                            }}  > <IoMdCheckmarkCircleOutline className='widgetApproveIcon' size={26} /> </a>

                                                        </Tooltip>
                                                        <Tooltip placement="top" title="Reject" arrow>
                                                            <a onClick={() => {
                                                                this.updateOverTimeForAttendanceStatus(data.id, data.hours, "REJECTED", data.employee.id);
                                                            }}  > <IoMdCloseCircleOutline className='widgetRejectIcon' size={26} /> </a>

                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </MeetingDashboardTooltip>)) : <span><Empty style={{ marginTop: '35px' }} /></span> : null
                                        }
                                        {/* Time In Lieu Action */}
                                        {activeButton === 3 ? timeInLieu.length > 0 ? timeInLieu.map((data, index) => (
                                            <MeetingDashboardTooltip title={

                                                <div>
                                                    <div className='pt-2 pb-2'>
                                                        <div className='float-left'>
                                                            <EmployeeProfilePhoto className='poolImg' id={data.employeeId}></EmployeeProfilePhoto>
                                                        </div>
                                                        <div className='ml-2 float-left'>
                                                            <span className='font-weight-bold'>{data?.employee.name}</span> <br />
                                                            <span className="headTxt">{this.reduceString(data.employeeJobTitle, 25)}</span>

                                                        </div>
                                                    </div> <br />
                                                    <div className='ratingBody'>
                                                        <div className='ratingContent'>
                                                            <span >Hours :<b> {data.hours.toFixed(2)}</b> </span><br />


                                                        </div>


                                                    </div>
                                                </div>
                                            }>
                                                <div className="leave-request">
                                                    <div className="widget-user-info">
                                                        <EmployeeProfilePhoto className='user-avatar' id={data.employeeId}></EmployeeProfilePhoto>

                                                        <div className="approvalUser-details">
                                                            <div className="user-name-aprv">{data?.employee.name}</div>
                                                            <div className="leave-date">{getCustomizedWidgetDate(data.forDate)}</div>

                                                        </div>
                                                    </div>
                                                    <div style={{ width: '115px' }} className="text-left">
                                                        <span className='headTxt'>Hours</span> <br />
                                                        <span><b>{data.hours.toFixed(2)}</b></span>
                                                    </div>
                                                    <div className="leave-actions">
                                                        <Tooltip placement="top" title="Approve" arrow>
                                                            <a onClick={() => {
                                                                this.updateStatusForTimeinLieu(data.id, "APPROVED", data.hours);
                                                            }}  > <IoMdCheckmarkCircleOutline className='widgetApproveIcon' size={26} /> </a>

                                                        </Tooltip>
                                                        <Tooltip placement="top" title="Reject" arrow>
                                                            <a onClick={() => {
                                                                this.updateStatusForTimeinLieu(data.id, "REJECTED", data.approvedHours);
                                                            }}  > <IoMdCloseCircleOutline className='widgetRejectIcon' size={26} /> </a>

                                                        </Tooltip>
                                                    </div>

                                                </div>
                                            </MeetingDashboardTooltip>)) : <span><Empty style={{ marginTop: '35px' }} /></span> : null
                                        }
                                    </div>
                                </div>
                            </div> : null}

                            {/* Upcoming Celebrations */}

                            <div className='celebrationCard'>
                                <div className="Title d-flex">
                                    <h2 className='newDashboardTitleAction'>Upcoming Celebrations</h2>

                                </div>
                                <div>
                                    {this.state.upComingCelebration.length > 0 ?
                                        <Carousel responsive={responsive}>
                                            {this.state.upComingCelebration.map((data, index) => {
                                                const nameArray = data.employeeName.split(" ");
                                                const firstName = nameArray[0];
                                                const lastName = nameArray[nameArray.length - 1];;
                                                const fullName = `${firstName} ${lastName}`;
                                                return (
                                                    <div style={{ background: celebrationColors[index % celebrationColors.length] }} className="col-xs-auto col-xl-homeLeft ml-2 mb-3" key={data.id} id='birthdayCard' >
                                                        <p id='celeCardHead' style={{ fontSize: '13px', display: "flex" }}>
                                                            {data.title === 'Birthday' ? <FaBirthdayCake /> : <MdOutlineCelebration />}
                                                            {data.title}
                                                        </p>
                                                        <div >
                                                            <EmployeeProfilePhoto className="celebrationProPic" id={data.employeeId} alt={data.employeeName?.name} />
                                                        </div>
                                                        <label>{this.reduceString(fullName, 13)}<br />{getCustomizedWidgetDate(data.dateOf)}</label>

                                                    </div>
                                                )

                                            })}
                                        </Carousel>
                                        : <span><Empty style={{ marginTop: '15px' }} /></span>}
                                </div>
                            </div>

                            {/* UpComing Events everyone need to show */}
                            <div className='eventCardBody mr-0 ml-0 row'>
                                <div className='col-xl-upComingEvents'>
                                    <div className="Title d-flex">
                                        <h2 className='newDashboardTitleAction newDashboardTitleActionEvent'>Upcoming Events </h2>
                                        <Link to={`/app/company-app/eventList`}>
                                            <p className='viewAllBtn viewAllBtnEvent'>View All</p>
                                        </Link>
                                    </div>
                                    <div style={{ gap: '10px', placeContent: 'center', marginTop: '-6px' }} className='d-flex'>
                                        <p onClick={() => this.setState({ newHire: false })} className={`btnText ${!newHire ? 'btnTextActive' : ''}`}>New Hires</p>
                                        <p onClick={() => this.setState({ newHire: true })} className={`btnText ${newHire ? 'btnTextActive' : ''}`} >Leaving</p>
                                    </div>
                                    <div className='eventScroll'>
                                        {this.state.upComingLeaving.length > 0 ? this.state.upComingLeaving.map((data, index) => (
                                            <div hidden={!this.state.newHire} className='container-fluid' id='eventElements'>
                                                <Tooltip className='d-flex' title={`${data.firstName} ${data.middleName} ${data.lastName}`}
                                                    placement="top">
                                                    <div >
                                                        <EmployeeProfilePhoto className="events-proPic" id={data.id} alt={data.firstName} />
                                                    </div>
                                                    <label className='cardsProPicLabel'>{this.reduceString(`${data.firstName} ${data.middleName} ${data.lastName}`, 14)}<br />{data.date && getCustomizedWidgetDate(data.date)}</label>
                                                </Tooltip>
                                            </div>)) : <div style={{ placeSelf: 'center' }} hidden={!this.state.newHire}><Empty /></div>
                                        }

                                        {this.state.upComingHire.length > 0 ? this.state.upComingHire.map((data, index) => (
                                            <div hidden={this.state.newHire} className='container-fluid' id='eventElements'>
                                                <Tooltip className='d-flex' title={`${data.firstName} ${data.middleName} ${data.lastName}`} placement="top">
                                                    <div >
                                                        <EmployeeProfilePhoto className="events-proPic" id={data.id} alt={data.firstName} />
                                                    </div>
                                                    <label className='cardsProPicLabel'>{this.reduceString(`${data.firstName} ${data.middleName} ${data.lastName}`, 15)}<br />{data.date && getCustomizedWidgetDate(data.date)}</label>
                                                </Tooltip>
                                            </div>)) : <div style={{ placeSelf: 'center' }} hidden={this.state.newHire}><Empty /></div>
                                        }
                                    </div>
                                </div>
                                <div className=' upCommingHolidays'>
                                    <div className='Title d-flex upCommingHolidaysTitle' >
                                        <h2 className='newDashboardTitleAction'>Upcoming Holidays </h2>
                                        <div style={{ cursor: 'pointer' }} onClick={() => this.setState({ showHolidays: true })} >
                                            <p className='viewAllBtn viewAllBtnEvent'>View All</p>
                                        </div>
                                    </div>
                                    {this.state.upComingHolidays.length > 0 ? <div>
                                        {this.state.upComingHolidays.slice(0, 4).map((data, index) => {
                                            const dateObj = new Date(data.date);
                                            const dayOfWeek = dateObj.toLocaleString('en-US', { weekday: 'long' });
                                            return (
                                                <div style={{ borderLeftColor: colors[index % colors.length] }} className='upCommingHolidaysCard' key={index}>
                                                    <div className='holidaysElements'>

                                                        <div className='fcontainer d-flex createPostInsideDivlex-container' >
                                                            <h5 style={{ color: colors[index % colors.length] }} className='mb-0'>{data.occasion}</h5>
                                                            { }

                                                            <h5 style={{ color: colors[index % colors.length], paddingLeft: "6px" }} className='mb-0'>{`(${data.branch?.name ? data.branch?.name : " - "})`}</h5>

                                                        </div>
                                                        <p>{`${getCustomizedWidgetDate(data.date)} ${dayOfWeek}`}</p>
                                                    </div>
                                                    <div className='mb-2' id='borderDiv' ></div>
                                                </div>)
                                        })}
                                    </div> : <div style={{ placeSelf: 'center', marginTop: '48px' }} ><Empty /></div>}
                                </div>
                            </div>

                        </div>
                        {/* right Section */}
                        <div className="col-xs-auto col-xl-homeRight col-md-12 col-lg-12 col-sm-12 mb-3">
                            <div className="status-widget-container">
                                <div className="status-input-container">
                                    <img
                                        alt={getUserName()} src={'data:image/jpeg;base64,' + getProfilePicture()}
                                        className="profile-image"
                                    />
                                    <input
                                        type="text"
                                        className="status-input"
                                        readOnly
                                        placeholder={`What's on your mind, ${getUserName()}?`}
                                        onClick={() => this.setState({ showForm: true })}
                                    />

                                </div>
                                <div className="action-buttons">
                                    <button onClick={() => this.setState({ showForm: true })} className="action-button live-video">
                                        <i className="icon live-video-icon"></i> Write article
                                    </button>
                                    <button onClick={() => this.setState({ showForm: true })} className="action-button photo-video">
                                        <i className="icon photo-video-icon"></i> Photo/video
                                    </button>
                                    <button onClick={() => this.setState({ showForm: true })} className="action-button feeling-activity">
                                        <i className="icon feeling-activity-icon"></i> Feeling/activity
                                    </button>
                                </div>
                            </div>
                            {this.state.socialShare?.map((item, index) => {
                                let reactionIdByemployee = 0
                                // get employee reaction Id
                                if (item.reactions != null && item.reactions?.length > 0) {
                                    let reactionmap = item.reactions?.find((element) => {
                                        if (element.employee == null && this.state.defaultEmployeeId == 0) {
                                            reactionIdByemployee = element.iconId
                                            return true;
                                        }
                                        else if (element.employee?.id == this.state.defaultEmployeeId) {
                                            reactionIdByemployee = element.iconId
                                            return true;
                                        }

                                    })
                                }
                                if (item.type == "RECOGNITION") {
                                    let showComment = item.comments;
                                    if (item.commentCount) {
                                        showComment = showComment.slice(0, item.commentCount > 0 ? item.commentCount : defaultCommentCount);
                                    }
                                    const recognitionImages = {
                                        'Customer Service Superstar!': customerService,
                                        'Great Work!': greatWorkBg,
                                        'Employee of the Month!': EmployeeOftheMonth,
                                        'Best Team Player!': teamPlayer,
                                    };
                                    const defaultImage = customerService
                                    const recognitionName = item.recognitionSetup?.name;
                                    const imageSrc = recognitionImages[recognitionName] || defaultImage;
                                    return (
                                        <div className='newRecognitionShare' key={index}>
                                            <div className="m-0">
                                                <div className='col=md-4' id='SocialSharePostHeader'>
                                                    <div className='m-2 mt-2 d-flex'>
                                                        <EmployeeProfilePhoto className='createPostProPic' id={parseInt(item.recognizer?.profilePicture || 0)}></EmployeeProfilePhoto>
                                                        <p className='ml-2'> <b style={{ color: '#102746' }}>{item?.createdBy?.name || "WorkPlus"}</b>  <br />{getCustomizedWidgetDate(item.createdOn)}</p>

                                                    </div>

                                                </div>
                                                <div className='mr-2 float-right align-self-center mt-3 d-flex'>
                                                    <p role="button" className='p-0' id='socialPost'><BiMedal /> Recognition</p>

                                                    <div className="dropdow dropup">
                                                        <a href="#" className="action-icon" data-toggle="dropdown" aria-expanded="false">
                                                            <p className='postOptionMenu ml-2'><BiDotsHorizontalRounded size={25} /> </p>
                                                        </a>
                                                        {isCompanyAdmin && <div className="dropdown-menu dropdown-menu-right">
                                                            <>

                                                                <a
                                                                    onClick={() =>
                                                                        this.handleDeletePost(item)
                                                                    }
                                                                    className="dropdown-item" href="#" >
                                                                    <i className="fa fa-trash-o m-r-5"></i> Delete</a>
                                                            </>
                                                        </div>}
                                                    </div>

                                                </div>
                                                <div className="recognitionBody" >
                                                    <div className=''>
                                                        <div className="recHeadImg">
                                                            <img className="recognitionbgImg" src={imageSrc} alt="responsive image" />
                                                        </div>
                                                        <div className='recognitionHeadText'>
                                                            <p className='recognitionText'>{item && item.recognitionSetup?.name}</p>
                                                        </div>
                                                    </div>

                                                    <div className='text-center'>
                                                        <div className='mb-3' style={{ textAlign: "center" }}>

                                                            <div >
                                                                <EmployeeProfilePhoto className='recEmployeePic' id={item.awardee?.id}></EmployeeProfilePhoto>
                                                            </div>
                                                            <h4 className='m-0'>{item.awardee && item.awardee?.name}</h4>
                                                            <h6 >
                                                                <MediaComponent mediaPath={item.mediaPath} mediaType={item.mediaType} />
                                                                &nbsp;{item.recognitionSetup?.name}</h6>
                                                        </div>
                                                    </div>


                                                    <div style={{ fontSize: '13px' }} className="mb-3 justify-content-center d-flex">
                                                        <div className='mr-2 recBy' >
                                                            <EmployeeProfilePhoto className='createPostProPic' id={parseInt(item.recognizer?.profilePicture || 0)}></EmployeeProfilePhoto>
                                                            <p className='ml-2 text-center'>Recognized by: <br /><strong> {item.recognizer?.name}</strong></p>
                                                        </div>
                                                        <div className='recCreatedDate' >
                                                            <p className='text-center'>Recognized Date <br /><strong >{getCustomizedWidgetDate(item?.createdOn)}</strong></p>
                                                        </div>


                                                    </div>

                                                </div>
                                                {/* my code  s*/}
                                                {/* my code */}
                                                <div className='p-2 postLike_sec'>
                                                    <div onClick={() => this.handleForm(item.id)} className='likes_Hover d-flex'>
                                                        <div className='d-flex'>
                                                            <span onClick={() => this.handleForm(item.id)} onMouseEnter={this.handleLikeEnter}
                                                                style={{ fontSize: '20px', cursor: 'pointer' }}>👍</span>
                                                            <span style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '-4px' }}>❤️</span>
                                                            <span style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '-4px' }}>👏</span>
                                                        </div>

                                                        <span onClick={() => this.handleForm(item.id)} className="totalLike" style={{ fontSize: '23px' }}> {item.reactions?.length || 0}</span>
                                                    </div>
                                                    <div>
                                                        <span className='totalCmd' onClick={() => {
                                                            this.handleCommentClickShare(item.id);
                                                            this.setState({ socialCommentBox: item.id == this.state.socialCommentBox ? 0 : item.id })
                                                        }} >{item.comments?.length || 0} <BiCommentDots size={20} /></span>


                                                    </div>

                                                </div>
                                                <div className='d-flex recIconsRow' ><ul className="m-0 p-2">


                                                    <li className='h5 likeHover'>
                                                        <div
                                                            className="like-button-container"
                                                            onMouseEnter={this.handleMouseEnter}
                                                            onMouseLeave={this.handleMouseLeave}
                                                            onMouseOver={() => this.handleMouseOver(item.id)}
                                                            style={{ position: 'relative', display: 'inline-block' }}
                                                        >
                                                            {reactionIdByemployee == 0 ?
                                                                <li onClick={() => this.handleLikeClick({ icon: '👍', text: 'Like', id: 1, postId: item.id })} className='h5 likeHover'>
                                                                    <span className=' mr-1 p-0' > <AiOutlineLike size={25} /></span> Likes

                                                                </li> : <li className='p-0 h5 likeHover' style={{ fontSize: '13px' }}>

                                                                    <span className=' mr-1 p-0' >{reactionIdByemployee == 1 ? '👍' : reactionIdByemployee == 2 ? '👏' : reactionIdByemployee == 3 ? '🤲' : reactionIdByemployee == 4 ? '❤️' : reactionIdByemployee == 5 ? '💡' : reactionIdByemployee == 6 ? '😄' : <AiOutlineLike size={25} />}</span> {reactionIdByemployee == 1 ? 'Like' : reactionIdByemployee == 2 ? 'Celebrate' : reactionIdByemployee == 3 ? 'Support' : reactionIdByemployee == 4 ? 'Love' : reactionIdByemployee == 5 ? 'Insightful' : reactionIdByemployee == 6 ? 'Funny' : 'Likes'}


                                                                </li>}

                                                            {this.state.showEmojis && item.id == this.state.likeId && (
                                                                <div className="emoji-popup">
                                                                    <Tooltip title="Like" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">

                                                                        <span onClick={() => this.handleLikeClick({ icon: '👍', text: 'Like', id: 1, postId: item.id })} role="img" aria-label="like">
                                                                            👍 <span className="popup_imoji_desc">Like</span>
                                                                        </span>
                                                                    </Tooltip>
                                                                    <Tooltip title="Celebrate" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">
                                                                        <span onClick={() => this.handleLikeClick({ icon: '👏', text: 'Celebrate', id: 2, postId: item.id })} role="img" aria-label="clap">
                                                                            👏
                                                                            <span className="popup_imoji_desc">Celebrate</span>
                                                                        </span>
                                                                    </Tooltip>
                                                                    <Tooltip title="Support" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">
                                                                        <span onClick={() => this.handleLikeClick({ icon: '🤲', text: 'Support', id: 3, postId: item.id })} role="img" aria-label="hand">
                                                                            🤲
                                                                            <span className="popup_imoji_desc">Support</span>
                                                                        </span>
                                                                    </Tooltip>

                                                                    <Tooltip title="Love" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">
                                                                        <span onClick={() => this.handleLikeClick({ icon: '❤️', text: 'Love', id: 4, postId: item.id })} role="img" aria-label="heart">
                                                                            ❤️
                                                                            <span className="popup_imoji_desc">Love</span>
                                                                        </span>
                                                                    </Tooltip>
                                                                    <Tooltip title="Insightful" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">
                                                                        <span onClick={() => this.handleLikeClick({ icon: '💡', text: 'Insightful', id: 5, postId: item.id })} role="img" aria-label="lightbulb">
                                                                            💡
                                                                            <span className="popup_imoji_desc">Insightful</span>
                                                                        </span>
                                                                    </Tooltip>
                                                                    <Tooltip title="Funny" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">
                                                                        <span onClick={() => this.handleLikeClick({ icon: '😄', text: 'Funny', id: 6, postId: item.id })} role="img" aria-label="laugh">
                                                                            😄
                                                                            <span className="popup_imoji_desc">Funny</span>
                                                                        </span>
                                                                    </Tooltip>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </li>

                                                    {/* my code */}

                                                    <li onClick={() => {
                                                        this.handleCommentClickShare(item.id);
                                                        this.setState({ socialCommentBox: item.id == this.state.socialCommentBox ? 0 : item.id })
                                                    }} className='h5 ml-3 likeHover' style={{ fontSize: '13px' }}><span className='mr-1' ><BiCommentDots size={25} /></span>&nbsp;
                                                        Comments </li>

                                                </ul>

                                                </div>


                                                {/* my code e */}
                                            </div>
                                            {item.id === this.state.socialCommentBox ?
                                                <>
                                                    <div className='p-2'>

                                                        <div style={{ display: "flex" }}>
                                                            <img className='createPostProPic' alt={getUserName()} src={'data:image/jpeg;base64,' + getProfilePicture()} />

                                                            <InputEmoji
                                                                className="inputEmojiBox"
                                                                value={this.state.commentText[item.id] || ""}
                                                                onChange={(val) => {
                                                                    this.setState((prevState) => ({
                                                                        commentText: {
                                                                            ...prevState.commentText,
                                                                            [item.id]: val
                                                                        }
                                                                    }));
                                                                }}
                                                                cleanOnEnter
                                                                placeholder="Write a comment..."
                                                            />
                                                            <div className="input-group-append recComment-group">
                                                                <p className="p-2 btn btn-secondary send-btn" type="button" onClick={e => {
                                                                    putRecognitionComment(item.id, this.state.commentText[item.id]).then(res => {
                                                                        if (res.status === "OK") {
                                                                            this.getSocialShareList();
                                                                            let { socialShare } = this.state;
                                                                            let index = socialShare.findIndex(x => x.id === res.data.id);
                                                                            socialShare[index] = res.data;
                                                                            this.setState({
                                                                                socialShare: socialShare,
                                                                                commentText: {
                                                                                    ...this.state.commentText,
                                                                                    [item.id]: ""
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }}>Send</p>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div style={{ borderRadius: '10px' }} className=" card post mb-3">
                                                        <div className="comments-area clearfix meta pb-0">
                                                            {
                                                                item.comments.map((comment, index) => (
                                                                    <div className="socialPostCmd pt-1 pb-1" key={index}>
                                                                        <strong>{comment.userName}&nbsp;<small>{getCustomizedWidgetDate(comment.createdOn)}</small></strong>
                                                                        <br />
                                                                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{comment.comment}</span>
                                                                    </div>
                                                                ))
                                                            }
                                                            {item.comments?.length > 1 && <div className="p-2">

                                                                <center>
                                                                    <Anchor onClick={() => {
                                                                        let { socialShare } = this.state;
                                                                        let index = socialShare.findIndex(x => x.id === item.id);
                                                                        let commentCount = socialShare[index].commentCount ? socialShare[index].commentCount + defaultCommentCount : defaultCommentCount * 2;
                                                                        if (commentCount > item.comments.length) {
                                                                            commentCount = item.comments.length;
                                                                        }
                                                                        socialShare[index].commentCount = commentCount;
                                                                        this.setState({
                                                                            socialShare: socialShare
                                                                        })
                                                                    }}></Anchor>
                                                                </center>
                                                            </div>
                                                            }
                                                        </div></div>
                                                </>
                                                : null}
                                        </div>)
                                    // Birthday Post
                                } else if (item.type == "BIRTHDAY" || item.type == "ANNIVERSARY") {
                                    let showComments = item.comments;
                                    if (item.commentCount) {
                                        showComments = showComments.slice(0, item.commentCount);
                                    } else {
                                        showComments = showComments.slice(0, defaultCommentCount);
                                    }
                                    const inputDate = new Date(item.createdOn);
                                    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
                                    const formattedDate = inputDate.toLocaleDateString('en-US', options);
                                    return (
                                        <div className='newRecognitionShare' key={index}>
                                            <div className="m-0">
                                                <div className="mb-3 recognitionTop" >
                                                    <div className='col=md-4' id='SocialSharePostHeader'>
                                                        <div className='m-2 mt-2 d-flex'>
                                                            <EmployeeProfilePhoto className='createPostProPic' id={parseInt(item.recognizer?.profilePicture || 0)}></EmployeeProfilePhoto>
                                                            <p className='ml-2'> <b style={{ color: '#102746' }}>{item?.createdBy?.name || "WorkPlus"}</b>  <br />{getCustomizedWidgetDate(item.createdOn)}</p>

                                                        </div>
                                                    </div>
                                                    <div className='mr-2 float-right align-self-center mt-3 d-flex'>
                                                        <p className='p-0' id='socialPost'>
                                                            {item.type === "BIRTHDAY" ? (
                                                                <>
                                                                    <AiOutlinePlusCircle size={15} /> Birthday
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <AiOutlinePlusCircle size={15} /> Anniversary
                                                                </>
                                                            )}
                                                        </p>
                                                        <div className="dropdow dropup">
                                                            <a href="#" className="action-icon" data-toggle="dropdown" aria-expanded="false">
                                                                <p className='postOptionMenu ml-2'><BiDotsHorizontalRounded size={25} /> </p>
                                                            </a>
                                                            {isCompanyAdmin && <div className="dropdown-menu dropdown-menu-right">
                                                                <>

                                                                    <a onClick={() => this.handleDeletePost(item)} className="dropdown-item" href="#" >
                                                                        <i className="fa fa-trash-o m-r-5"></i> Delete</a>
                                                                </>
                                                            </div>}
                                                        </div>
                                                    </div>
                                                    <div className={item.type == "BIRTHDAY" ? 'socialShareArticleBirthday' : 'socialShareArticleAnniversary'}>

                                                        <article className='card-body socialShareArticleDivBirthday' >

                                                            <h3 className='birthdayPostTittle' >{item.type == "BIRTHDAY" ? 'HAPPY BIRTHDAY' : 'HAPPY WORK ANNIVERSARY'}</h3>

                                                            <div className='birthdaypostName'>
                                                                <EmployeeProfilePhoto className='createbirthdayPostProPic' id={item.employeeId}></EmployeeProfilePhoto>
                                                                <p className='mt-3 birthdayname'>{item.awardee?.name}</p>
                                                            </div>
                                                            {item.type == "BIRTHDAY" && <img className='birthdayimg' src={Baloon} alt="" />}
                                                            <img className='birthdayimg' src={confetti} alt="" />

                                                            <h5 style={{ wordSpacing: '5px', color: ' #fff27d' }} className="m-0">{formattedDate}</h5>
                                                            <p className='mb-0 BirthdaypostDiscription' style={{ fontFamily: "sans-serif" }}>{item.description}</p>
                                                        </article>
                                                    </div>
                                                </div>
                                                {/* my code */}
                                                <div className='p-2 postLike_sec'>
                                                    <div onClick={() => this.handleForm(item.id)} className='likes_Hover d-flex'>
                                                        <div className='d-flex'>
                                                            <span onClick={() => this.handleForm(item.id)} onMouseEnter={this.handleLikeEnter}
                                                                style={{ fontSize: '20px', cursor: 'pointer' }}>👍</span>
                                                            <span style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '-4px' }}>❤️</span>
                                                            <span style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '-4px' }}>👏</span>
                                                        </div>

                                                        <span onClick={() => this.handleForm(item.id)} className="totalLike" style={{ fontSize: '23px' }}> {item.reactions?.length || 0}</span>
                                                    </div>
                                                    <div>
                                                        <span className='totalCmd' onClick={() => {
                                                            this.handleCommentClickShare(item.id);
                                                            this.setState({ socialCommentBox: item.id == this.state.socialCommentBox ? 0 : item.id })
                                                        }} >{item.comments?.length || 0} <BiCommentDots size={20} /></span>


                                                    </div>

                                                </div>

                                                {/* my code */}
                                                <div className='d-flex recIconsRow' ><ul className="m-0 p-2">

                                                    {/* my code */}
                                                    <li className='h5 likeHover'>
                                                        <div
                                                            className="like-button-container"
                                                            onMouseEnter={this.handleMouseEnter}
                                                            onMouseLeave={this.handleMouseLeave}
                                                            onMouseOver={() => this.handleMouseOver(item.id)}
                                                            style={{ position: 'relative', display: 'inline-block' }}
                                                        >
                                                            {reactionIdByemployee == 0 ?
                                                                <li onClick={() => this.handleLikeClick({ icon: '👍', text: 'Like', id: 1, postId: item.id })} className='h5 likeHover'>
                                                                    <span className=' mr-1 p-0' > <AiOutlineLike size={25} /></span> Likes

                                                                </li> : <li className='p-0 h5 likeHover' style={{ fontSize: '13px' }}>

                                                                    <span className=' mr-1 p-0' >{reactionIdByemployee == 1 ? '👍' : reactionIdByemployee == 2 ? '👏' : reactionIdByemployee == 3 ? '🤲' : reactionIdByemployee == 4 ? '❤️' : reactionIdByemployee == 5 ? '💡' : reactionIdByemployee == 6 ? '😄' : <AiOutlineLike size={25} />}</span> {reactionIdByemployee == 1 ? 'Like' : reactionIdByemployee == 2 ? 'Celebrate' : reactionIdByemployee == 3 ? 'Support' : reactionIdByemployee == 4 ? 'Love' : reactionIdByemployee == 5 ? 'Insightful' : reactionIdByemployee == 6 ? 'Funny' : 'Likes'}


                                                                </li>}

                                                            {this.state.showEmojis && item.id == this.state.likeId && (
                                                                <div className="emoji-popup">
                                                                    <Tooltip title="Like" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">

                                                                        <span onClick={() => this.handleLikeClick({ icon: '👍', text: 'Like', id: 1, postId: item.id })} role="img" aria-label="like">
                                                                            👍 <span className="popup_imoji_desc">Like</span>
                                                                        </span>
                                                                    </Tooltip>
                                                                    <Tooltip title="Celebrate" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">
                                                                        <span onClick={() => this.handleLikeClick({ icon: '👏', text: 'Celebrate', id: 2, postId: item.id })} role="img" aria-label="clap">
                                                                            👏
                                                                            <span className="popup_imoji_desc">Celebrate</span>
                                                                        </span>
                                                                    </Tooltip>
                                                                    <Tooltip title="Support" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">
                                                                        <span onClick={() => this.handleLikeClick({ icon: '🤲', text: 'Support', id: 3, postId: item.id })} role="img" aria-label="hand">
                                                                            🤲
                                                                            <span className="popup_imoji_desc">Support</span>
                                                                        </span>
                                                                    </Tooltip>

                                                                    <Tooltip title="Love" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">
                                                                        <span onClick={() => this.handleLikeClick({ icon: '❤️', text: 'Love', id: 4, postId: item.id })} role="img" aria-label="heart">
                                                                            ❤️
                                                                            <span className="popup_imoji_desc">Love</span>
                                                                        </span>
                                                                    </Tooltip>
                                                                    <Tooltip title="Insightful" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">
                                                                        <span onClick={() => this.handleLikeClick({ icon: '💡', text: 'Insightful', id: 5, postId: item.id })} role="img" aria-label="lightbulb">
                                                                            💡
                                                                            <span className="popup_imoji_desc">Insightful</span>
                                                                        </span>
                                                                    </Tooltip>
                                                                    <Tooltip title="Funny" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">
                                                                        <span onClick={() => this.handleLikeClick({ icon: '😄', text: 'Funny', id: 6, postId: item.id })} role="img" aria-label="laugh">
                                                                            😄
                                                                            <span className="popup_imoji_desc">Funny</span>
                                                                        </span>
                                                                    </Tooltip>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </li>

                                                    {/* my code */}

                                                    <li onClick={() => {
                                                        this.handleCommentClickShare(item.id);
                                                        this.setState({ socialCommentBox: item.id == this.state.socialCommentBox ? 0 : item.id })
                                                    }} className='h5 ml-3 likeHover' style={{ fontSize: '13px' }}><span className='mr-1' ><BiCommentDots size={25} /></span>&nbsp;
                                                        Comments </li>

                                                </ul>

                                                </div>

                                            </div>
                                            {item.id === this.state.socialCommentBox ?
                                                <>
                                                    <div className='p-2'>
                                                        <div style={{ display: "flex" }}>
                                                            <EmployeeProfilePhoto className='createPostProPic' id={item.createdBy?.id}></EmployeeProfilePhoto>
                                                            <InputEmoji
                                                                className="inputEmojiBox"
                                                                value={this.state.commentText[item.id] || ""}
                                                                onChange={(val) => {
                                                                    this.setState((prevState) => ({
                                                                        commentText: {
                                                                            ...prevState.commentText,
                                                                            [item.id]: val
                                                                        }
                                                                    }));
                                                                }}
                                                                cleanOnEnter
                                                                placeholder="Write a comment..."
                                                            />
                                                            <div className="input-group-append recComment-group">
                                                                <p className="p-2 btn btn-secondary send-btn" type="button" onClick={e => {
                                                                    putSocialShareComment(item.id, this.state.commentText[item.id]).then(res => {
                                                                        if (res.status === "OK") {
                                                                            this.getSocialShareList();
                                                                            let { socialShare } = this.state;
                                                                            let index = socialShare.findIndex(x => x.id === res.data.id);
                                                                            socialShare[index] = res.data;
                                                                            this.setState({
                                                                                socialShare: socialShare,
                                                                                commentText: {
                                                                                    ...this.state.commentText,
                                                                                    [item.id]: ""
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }}>Send</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ borderRadius: '10px' }} className="card post mb-3">
                                                        <div className="comments-area clearfix meta pb-0">
                                                            {
                                                                item.comments.map((comment, index) => (
                                                                    <div className="socialPostCmd pt-1 pb-1" key={index}>
                                                                        <strong>{comment.userName}&nbsp;<small>{getCustomizedWidgetDate(comment.createdOn)}</small></strong>
                                                                        <br />
                                                                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{comment.comment}</span>
                                                                    </div>
                                                                ))
                                                            }
                                                            {item.comments?.length > 1 && <div className="p-2">

                                                                <center>
                                                                    <Anchor onClick={() => {
                                                                        let { socialShare } = this.state;
                                                                        let index = socialShare.findIndex(x => x.id === item.id);
                                                                        let commentCount = socialShare[index].commentCount ? socialShare[index].commentCount + defaultCommentCount : defaultCommentCount * 2;
                                                                        if (commentCount > item.comments.length) {
                                                                            commentCount = item.comments.length;
                                                                        }
                                                                        socialShare[index].commentCount = commentCount;
                                                                        this.setState({
                                                                            socialShare: socialShare
                                                                        })
                                                                    }}></Anchor>
                                                                </center>
                                                            </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </>
                                                : null}


                                        </div>)
                                } else {
                                    {/* socialShare */ }

                                    let showComments = item.comments;
                                    if (item.commentCount) {
                                        showComments = showComments.slice(0, item.commentCount);
                                    } else {
                                        showComments = showComments.slice(0, defaultCommentCount);
                                    }
                                    return (
                                        <div className='newRecognitionShare' key={index}>
                                            <div className="m-0">
                                                <div className="mb-3 recognitionTop" >
                                                    <div className='col=md-4' id='SocialSharePostHeader'>
                                                        <div className='m-2 mt-2 d-flex'>
                                                            <EmployeeProfilePhoto className='createPostProPic' id={parseInt(item.recognizer?.profilePicture || 0)}></EmployeeProfilePhoto>
                                                            <p className='ml-2'> <b style={{ color: '#102746' }}>{item.recognizer?.name || "WorkPlus"}</b>  <br />{getCustomizedWidgetDate(item.createdOn)}</p>

                                                        </div>
                                                    </div>
                                                    <div className='mr-2 float-right align-self-center mt-3 d-flex'>
                                                        <p role="button" className='p-0' id='socialPost'><AiOutlinePlusCircle size={15} /> Social Post</p>
                                                        <div className="dropdow dropup">
                                                            <a href="#" className="action-icon" data-toggle="dropdown" aria-expanded="false">
                                                                <p className='postOptionMenu ml-2'><BiDotsHorizontalRounded size={25} /> </p>
                                                            </a>
                                                            {isCompanyAdmin && <div className="dropdown-menu dropdown-menu-right">
                                                                <>
                                                                    <a onClick={() => this.handleDeletePost(item)} className="dropdown-item" href="#" >
                                                                        <i className="fa fa-trash-o m-r-5"></i> Delete</a> </>
                                                            </div>}
                                                        </div>
                                                    </div>
                                                    <div className='socialShareArticle'>
                                                        <article className='mb-2 card-body socialShareArticleDiv' >

                                                            <h5 className="post-title">{item.title}</h5>
                                                            <p className='socialpostDiscription' style={{ fontFamily: "sans-serif" }}>{item.description}</p>
                                                            <MediaComponent mediaPath={item.mediaPath} mediaType={item.mediaType} />
                                                        </article>
                                                    </div>
                                                </div>
                                                {/* my code */}
                                                <div className='p-2 postLike_sec'>
                                                    <div onClick={() => this.handleForm(item.id)} className='likes_Hover d-flex'>
                                                        <div className='d-flex'>
                                                            <span onClick={() => this.handleForm(item.id)} onMouseEnter={this.handleLikeEnter}
                                                                style={{ fontSize: '20px', cursor: 'pointer' }}>👍</span>
                                                            <span style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '-4px' }}>❤️</span>
                                                            <span style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '-4px' }}>👏</span>
                                                        </div>

                                                        <span onClick={() => this.handleForm(item.id)} className="totalLike" style={{ fontSize: '23px' }}> {item.reactions?.length || 0}</span>
                                                    </div>
                                                    <div>
                                                        <span className='totalCmd' onClick={() => {
                                                            this.handleCommentClickShare(item.id);
                                                            this.setState({ socialCommentBox: item.id == this.state.socialCommentBox ? 0 : item.id })
                                                        }} >{item.comments?.length || 0} <BiCommentDots size={20} /></span>


                                                    </div>

                                                </div>
                                                {/* my code */}
                                                <div className='d-flex recIconsRow' ><ul className="m-0 p-2">

                                                    {/* my code */}
                                                    <li className='h5 likeHover'>
                                                        <div
                                                            className="like-button-container"
                                                            onMouseEnter={this.handleMouseEnter}
                                                            onMouseLeave={this.handleMouseLeave}
                                                            onMouseOver={() => this.handleMouseOver(item.id)}
                                                            style={{ position: 'relative', display: 'inline-block' }}
                                                        >
                                                            {reactionIdByemployee == 0 ?
                                                                <li onClick={() => this.handleLikeClick({ icon: '👍', text: 'Like', id: 1, postId: item.id })} className='h5 likeHover'>
                                                                    <span className=' mr-1 p-0' > <AiOutlineLike size={25} /></span> Likes

                                                                </li> : <li className='p-0 h5 likeHover' style={{ fontSize: '13px' }}>

                                                                    <span className=' mr-1 p-0' >{reactionIdByemployee == 1 ? '👍' : reactionIdByemployee == 2 ? '👏' : reactionIdByemployee == 3 ? '🤲' : reactionIdByemployee == 4 ? '❤️' : reactionIdByemployee == 5 ? '💡' : reactionIdByemployee == 6 ? '😄' : <AiOutlineLike size={25} />}</span> {reactionIdByemployee == 1 ? 'Like' : reactionIdByemployee == 2 ? 'Celebrate' : reactionIdByemployee == 3 ? 'Support' : reactionIdByemployee == 4 ? 'Love' : reactionIdByemployee == 5 ? 'Insightful' : reactionIdByemployee == 6 ? 'Funny' : 'Likes'}
                                                                </li>}

                                                            {this.state.showEmojis && item.id == this.state.likeId && (
                                                                <div className="emoji-popup">
                                                                    <Tooltip title="Like" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">

                                                                        <span onClick={() => this.handleLikeClick({ icon: '👍', text: 'Like', id: 1, postId: item.id })} role="img" aria-label="like">
                                                                            👍 <span className="popup_imoji_desc">Like</span>
                                                                        </span>
                                                                    </Tooltip>
                                                                    <Tooltip title="Celebrate" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">
                                                                        <span onClick={() => this.handleLikeClick({ icon: '👏', text: 'Celebrate', id: 2, postId: item.id })} role="img" aria-label="clap">
                                                                            👏
                                                                            <span className="popup_imoji_desc">Celebrate</span>
                                                                        </span>
                                                                    </Tooltip>
                                                                    <Tooltip title="Support" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">
                                                                        <span onClick={() => this.handleLikeClick({ icon: '🤲', text: 'Support', id: 3, postId: item.id })} role="img" aria-label="hand">
                                                                            🤲
                                                                            <span className="popup_imoji_desc">Support</span>
                                                                        </span>
                                                                    </Tooltip>

                                                                    <Tooltip title="Love" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">
                                                                        <span onClick={() => this.handleLikeClick({ icon: '❤️', text: 'Love', id: 4, postId: item.id })} role="img" aria-label="heart">
                                                                            ❤️
                                                                            <span className="popup_imoji_desc">Love</span>
                                                                        </span>
                                                                    </Tooltip>
                                                                    <Tooltip title="Insightful" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">
                                                                        <span onClick={() => this.handleLikeClick({ icon: '💡', text: 'Insightful', id: 5, postId: item.id })} role="img" aria-label="lightbulb">
                                                                            💡
                                                                            <span className="popup_imoji_desc">Insightful</span>
                                                                        </span>
                                                                    </Tooltip>
                                                                    <Tooltip title="Funny" componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                fontSize: '15px',
                                                                                bgcolor: 'common.black',
                                                                                borderRadius: '20px',
                                                                                '& .MuiTooltip-arrow': {
                                                                                    color: 'common.black',
                                                                                },
                                                                            },
                                                                        },
                                                                    }} placement="top">
                                                                        <span onClick={() => this.handleLikeClick({ icon: '😄', text: 'Funny', id: 6, postId: item.id })} role="img" aria-label="laugh">
                                                                            😄
                                                                            <span className="popup_imoji_desc">Funny</span>
                                                                        </span>
                                                                    </Tooltip>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </li>

                                                    {/* my code */}

                                                    <li onClick={() => {
                                                        this.handleCommentClickShare(item.id);
                                                        this.setState({ socialCommentBox: item.id == this.state.socialCommentBox ? 0 : item.id })
                                                    }} className='h5 ml-3 likeHover' style={{ fontSize: '13px' }}><span className='mr-1' ><BiCommentDots size={25} /></span>&nbsp;
                                                        Comments </li>

                                                </ul>

                                                </div>

                                            </div>
                                            {item.id === this.state.socialCommentBox ?
                                                <>
                                                    <div className='p-2'>
                                                        <div style={{ display: "flex" }}>
                                                            <img className='createPostProPic' alt={getUserName()} src={'data:image/jpeg;base64,' + getProfilePicture()} />
                                                            <InputEmoji
                                                                className="inputEmojiBox"
                                                                value={this.state.commentText[item.id] || ""}
                                                                onChange={(val) => {
                                                                    this.setState((prevState) => ({
                                                                        commentText: {
                                                                            ...prevState.commentText,
                                                                            [item.id]: val
                                                                        }
                                                                    }));
                                                                }}
                                                                cleanOnEnter
                                                                placeholder="Write a comment..."
                                                            />
                                                            <div className="input-group-append recComment-group">
                                                                <p className="p-2 btn btn-secondary send-btn" type="button" onClick={e => {
                                                                    putSocialShareComment(item.id, this.state.commentText[item.id]).then(res => {
                                                                        if (res.status === "OK") {
                                                                            let { socialShare } = this.state;
                                                                            let index = socialShare.findIndex(x => x.id === res.data.id);
                                                                            socialShare[index] = res.data;
                                                                            this.setState({
                                                                                socialShare: socialShare,
                                                                                commentText: {
                                                                                    ...this.state.commentText,
                                                                                    [item.id]: ""
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }}>Send</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div style={{ borderRadius: '10px' }} className="card post mb-3">
                                                        <div className="comments-area clearfix meta pb-0">

                                                            {
                                                                item.comments.map((comment, index) => (
                                                                    <div className="socialPostCmd pt-1 pb-1" key={index}>
                                                                        <strong>{comment.userName}&nbsp;<small>{getCustomizedWidgetDate(comment.createdOn)}</small></strong>
                                                                        <br />
                                                                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{comment.comment}</span>
                                                                    </div>

                                                                )
                                                                )
                                                            }
                                                            {item.comments?.length > 1 && <div className="p-2">
                                                                <center>
                                                                    <Anchor onClick={() => {
                                                                        let { socialShare } = this.state;
                                                                        let index = socialShare.findIndex(x => x.id === item.id);
                                                                        let commentCount = socialShare[index].commentCount ? socialShare[index].commentCount + defaultCommentCount : defaultCommentCount * 2;
                                                                        if (commentCount > item.comments.length) {
                                                                            commentCount = item.comments.length;
                                                                        }
                                                                        socialShare[index].commentCount = commentCount;
                                                                        this.setState({
                                                                            socialShare: socialShare
                                                                        })
                                                                    }}></Anchor>
                                                                </center>
                                                            </div>
                                                            }
                                                        </div>
                                                    </div> </>
                                                : null}


                                        </div>)
                                }
                            })}
                            {totalRecords !== this.state.socialShare.length &&
                                <div className="text-center">
                                    <p className="socialPostloadMoreBtn" onClick={() => {
                                        this.setState({
                                            pageNumber: currentPage
                                        }, this.getSocialShareList,
                                            this.getRecognitionList)
                                    }}>Load More..</p>
                                </div>
                            }
                        </div>

                    </div>
                    {/* my code */}
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
                            //validationSchema={DashboardSchema}
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
                                    setSubmitting,

                                    /* and other goodies */
                                }) => (
                                    <Form encType="multipart/form-data">
                                        <FormGroup className='text-center'>
                                            <Field name="title" className="form-control" placeholder="Title" required pattern=".*\S+.*" title="Title is required"></Field>
                                        </FormGroup>
                                        <FormGroup className='text-center'>
                                            <Field name="description" className="form-control" placeholder="Description" component="textarea" required pattern=".*\S+.*" title="Description is required"></Field>
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
                    {/* my code */}
                </div>

                <Modal enforceFocus={false} size={"lg"} show={this.state.showExpiringDocument} onHide={this.hideExpiringDocumentTab} >
                    <Header closeButton>
                        <h5 className="modal-title">Expiring Documents</h5>
                    </Header>
                    <Body>
                        <div className="chatBot-table">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Employee</th>
                                        <th>Document No</th>
                                        <th>Document Type</th>
                                        <th>Issue Date</th>
                                        <th>Expiry Date</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {documentExpiryByMonth && documentExpiryByMonth.map((item, index) => (
                                        <tr key={item.day} className="table-row">
                                            <td className="table-column">{index + 1}</td>
                                            <td className="table-column">
                                                <EmployeeListColumn
                                                    key={item.empId}
                                                    id={item.empId}
                                                    name={`${item.employeeName}`}
                                                    employeeId={item.employeeId}
                                                />
                                            </td>
                                            <td className="table-column">{item.docNumber}</td>
                                            <td className="table-column">{item.documentTypeName}

                                            </td>
                                            <td className="table-column">{getCustomizedWidgetDate(item.issuedOn)}</td>
                                            <td className="table-column">{getCustomizedWidgetDate(item.expiredOn)}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                            {documentExpiryByMonth == null && <span><Empty /></span>}
                        </div>
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"lg"} show={this.state.showAttendanceList} onHide={this.hideAttendanceList} >


                    <Header closeButton>
                        <h5 className="modal-title">{this.state.presentsList == "absent" ? "Absent" : this.state.presentsList == "onTime" ? "On Time" : "Late"}</h5>
                    </Header>
                    <Body>
                        <TodaysAttendanceList presentsList={this.state.presentsList} selfPermission={this.state.selfPermission}></TodaysAttendanceList>
                    </Body>


                </Modal>
                <Modal enforceFocus={false} size={"lg"} show={this.state.showLeaveForm} onHide={this.hideLeaveForm} >
                    <Header closeButton>
                        <h5 className="modal-title">Apply Leave</h5>
                    </Header>
                    <Body>
                        <LeaveForm showAlert={this.showAlert} updateList={this.hideLeaveForm}>
                        </LeaveForm>
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"lg"} show={this.state.showTimesheetForm} onHide={this.hideTimesheetForm} >
                    <Header closeButton>
                        <h5 className="modal-title">Add Timesheet</h5>
                    </Header>
                    <Body>
                        <CreateTimesheetForm showAlert={this.showAlert} updateList={this.hideTimesheetForm}>
                        </CreateTimesheetForm>
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"lg"} show={this.state.showUploadDocsForm} onHide={this.hideUploadDocsForm} >
                    <Header closeButton>
                        <h5 className="modal-title">Add Documents</h5>
                    </Header>
                    <Body>
                        <UploadDocsEmployeeForm showAlert={this.showAlert} updateList={this.hideUploadDocsForm}>
                        </UploadDocsEmployeeForm>
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"lg"} show={this.state.showDocumentRequestForm} onHide={this.hideDocumentRequestForm}>
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
                <Modal enforceFocus={false} size={"md"} show={this.state.showLeaveAction} onHide={this.hideLeaveAction} >
                    <Header closeButton>
                        <h5 className="modal-title">
                            Remarks
                        </h5>
                    </Header>
                    <Body>
                        <FormGroup>
                            <label>Remark
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <input onChange={(e) => this.setState({ remark: e.target.value })} className="form-control" />

                        </FormGroup>
                        <Button sx={{ textTransform: 'none', float: 'right' }} size="small" onClick={() => {
                            this.updateLeaveStatus(this.state.leaveId, "REJECTED")
                            this.hideLeaveAction()
                        }} variant="contained" color="error">
                            Reject
                        </Button>
                    </Body>


                </Modal>
                <Modal dialogClassName='reaction-modal' enforceFocus={false} show={this.state.showReactionList} onHide={this.hideReactionList}>
                    <Header closeButton>
                        <h5 className="modal-title">
                            Reactions
                        </h5>
                    </Header>

                    <Body className='reaction-modal-body'>


                        <ReactionList closeButton postId={this.state.likeId}></ReactionList>
                    </Body>


                </Modal>
                <Modal enforceFocus={false} size={"lg"} show={this.state.showHolidays} onHide={this.hideHolidays}>
                    <Header closeButton>
                        <h5 className="modal-title">
                            Holidays
                        </h5>
                    </Header>
                    <Body>
                        <HolidayCalendar ></HolidayCalendar>
                    </Body>
                </Modal>

            </div >
        )
    }
}
