import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { getEmployeeId, getTitle, verifyOrgLevelViewPermission, verifyViewPermissionForTeam } from '../../../utility';
import { RiDashboardLine, RiEqualizerLine, RiGitPullRequestLine } from "react-icons/ri";
import { FcFeedback, FcOvertime, FcQuestions } from 'react-icons/fc';
import { getList } from '../../ModuleSetup/Regularization/service';
import { getEmployeeDashboardDetail } from '../../../MainPage/Main/Dashboard/service';
import { GoGoal } from "react-icons/go";
import { FaChartLine, FaPencilRuler } from 'react-icons/fa';
import MyPerformDashboard from './MyPerformance/dashboard';
import TeamPerformDashboard from './TeamPerformance/teamDashboard';
import OrgPerformDashboard from './OrgPerformance/orgDashboard';
import EmployeePerformanceReview from '../Review';
import { TbBrandTeams } from "react-icons/tb";
import PerformGoals from './PerformGoals/index.jsx';
import EmployeePerformance1on1MeetingModule from './1on1Meeting';
import EmployeePerformance1on1MeetingView from './1on1Meeting/view';
import GoalDetails from './PerformGoals/GoalsViewIndex.jsx';

export default class EmployeePerformanceModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonState: true,
            activeMenu: 'dashboard',
            RegularizationSettings: false,
            dashboard: {},
            thirdLevelMenu: false,
            meetingView: false,
            meetingId: 0,
            goalDetailsData: null,
        };
    }

    componentDidMount() {
        this.fetchListData()
        this.getEmployeeDashList()
    }

    fetchListData = () => {
        getList().then(res => {
            if (res.status == "OK") {
                this.setState({ RegularizationSettings: res.data.regularizationEnabled })
            }
        })

    }
    getEmployeeDashList = () => {
        const EmployeeId = getEmployeeId()
        if (EmployeeId > 0) {
            getEmployeeDashboardDetail(new Date().toISOString().substring(0, 16)).then(res => {
                this.setState({ dashboard: res.data });
            });
        } else {
            this.setState({ dashboard: false });
        }

    }

    handleMenuSection = (menu) => {
        this.setState({ thirdLevelMenu: menu })
    }

    handleMenuClick = (menu) => {
        this.setState({ meetingView: false })
        this.setState({ activeMenu: menu });
    }

    isActive = (item) => {
        this.setState({ activeMenu: item })
    }

    updateList = (id) => {
        this.setState({ meetingId: id, meetingView: true })
    }

    updateView = () => {
        this.setState({ meetingView: false })
    }

    updateActiveMenu = () => {
        this.setState({ activeMenu: "Reviews" });
    }

    handleOpenGoalDetails = (item, type) => {
        this.setState({ activeMenu: 'goalsView', goalDetailsData: { item, type } });

    };
    handleBackToGoals = () => {
        this.setState({ activeMenu: 'Goals', goalDetailsData: null });
    };


    render() {
        const { activeMenu, dashboard, goalDetailsData, thirdLevelMenu } = this.state
        const EmployeeId = getEmployeeId()

        return (
            <>
                <div className="page-wrapper">
                    <Helmet>
                        <title>Perfomance | {getTitle()}</title>
                        <meta name="description" content="Attendance" />
                    </Helmet>
                    <div className="mt-4 content container-fluid">
                        <div className="tab-content">
                            <div className="subMenu_box row user-tabs">
                                <div className="nav-box">
                                    <div className="page-headerTab">
                                        <h3 style={{ color: 'white' }} className="page-title">Performance</h3>
                                        <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                            <ul className="nav nav-items">
                                                {<li onClick={() => {
                                                    this.handleMenuSection(false)
                                                    this.handleMenuClick('dashboard')
                                                }} className="nav-item"><a href="#my_div" data-toggle="tab" className="nav-link active"><i class="fa fa-user" aria-hidden="true"></i> My Performance</a></li>}
                                                {verifyViewPermissionForTeam("ATTENDANCE") && <li onClick={() => {
                                                    this.handleMenuSection(true)
                                                    this.handleMenuClick('dashboard')
                                                }} className="nav-item"><a href="#team_div" data-toggle="tab" className="nav-link"><i class="fa fa-users" aria-hidden="true"></i> Team Performance</a></li>}
                                                {verifyOrgLevelViewPermission("ATTENDANCE") && <li onClick={() => {
                                                    this.handleMenuSection(true)
                                                    this.handleMenuClick('dashboard')
                                                }} className="nav-item"><a href="#org_div" data-toggle="tab" className="nav-link"><i class="fa fa-sitemap" aria-hidden="true"></i> Organization Performance</a></li>}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="menu-toggle">
                                <button
                                    className={activeMenu === 'dashboard' ? 'active' : ''}
                                    onClick={() => this.handleMenuClick('dashboard')}
                                >
                                    <RiDashboardLine className='mr-1' />
                                    Dashboard
                                </button>
                                <button
                                    className={activeMenu === 'Goals' ? 'active' : ''}
                                    onClick={() => this.handleMenuClick('Goals')}
                                >

                                    <GoGoal className=" mr-1" size={20} />
                                    Goals
                                </button>
                                <button
                                    className={activeMenu === 'Reviews' ? 'active' : ''}
                                    onClick={() => this.handleMenuClick('Reviews')}
                                >
                                    <i class="fa fa-bar-chart mr-2" aria-hidden="true"></i>
                                    Reviews
                                </button>
                                {thirdLevelMenu &&
                                    <>
                                        <button
                                            className={activeMenu === 'probation' ? 'active' : ''}
                                            onClick={() => this.handleMenuClick('probation')}
                                        >

                                            <FcQuestions className=" mr-1" size={20} />
                                            Probation
                                        </button>
                                        <button
                                            className={activeMenu === '1on1Meeting' ? 'active' : ''}
                                            onClick={() => this.handleMenuClick('1on1Meeting')}
                                        >
                                            <TbBrandTeams className=" mr-1" size={20} />
                                            1-on-1 Meeting
                                        </button>
                                    </>
                                }

                                <button
                                    className={activeMenu === 'overtime' ? 'active' : ''}
                                    onClick={() => this.handleMenuClick('overtime')}
                                >
                                    <FcFeedback className=" mr-1" size={20} />
                                    Feedback
                                </button>
                                <button
                                    className={activeMenu === 'regularize' ? 'active' : ''}
                                    onClick={() => this.handleMenuClick('regularize')}
                                >
                                    <FaPencilRuler className=" mr-1" size={20} />
                                    Skill
                                </button>
                                <button
                                    className={activeMenu === 'permission' ? 'active' : ''}
                                    onClick={() => this.handleMenuClick('permission')}
                                >
                                    <FaChartLine className=" mr-1" size={20} />
                                    PIP
                                </button>
                            </div>
                            <div id='my_div' className="pl-0 pro-overview ant-table-background tab-pane fade show active" >
                                {activeMenu === 'dashboard' && <MyPerformDashboard updateActiveMenu={this.updateActiveMenu} />}
                                {/* {activeMenu === 'employeereview' && <EmployeePerformance1on1Review /> } */}
                                {activeMenu === 'Reviews' && (!this.state.meetingView ? <EmployeePerformance1on1MeetingModule oneOnOneStatus={0} updateList={this.updateList} /> : <EmployeePerformance1on1MeetingView meetingId={this.state.meetingId} updateView={this.updateView} viewStatus={false} />)}
                                {activeMenu === 'Goals' && <PerformGoals onOpenGoalDetails={this.handleOpenGoalDetails} goalStatus={0} />}
                                {activeMenu === 'goalsView' && <GoalDetails goalStatus={0} goalsData={goalDetailsData} onBack={this.handleBackToGoals} />}


                            </div>
                            <div id='team_div' className="pl-0 pro-overview ant-table-background tab-pane fade  ">
                                {activeMenu === 'dashboard' && <TeamPerformDashboard />}
                                {activeMenu === 'Reviews' && <EmployeePerformanceReview />}
                                {activeMenu === '1on1Meeting' && (!this.state.meetingView ? <EmployeePerformance1on1MeetingModule oneOnOneStatus={1} updateList={this.updateList} /> : <EmployeePerformance1on1MeetingView meetingId={this.state.meetingId} updateView={this.updateView} viewStatus={true} />)}
                                {activeMenu === 'Goals' && <PerformGoals onOpenGoalDetails={this.handleOpenGoalDetails} goalStatus={1} />}
                                {activeMenu === 'goalsView' && <GoalDetails goalStatus={1} goalsData={goalDetailsData} onBack={this.handleBackToGoals} />}
                            </div>
                            <div id='org_div' className="pl-0 pro-overview ant-table-background tab-pane fade ">
                                {activeMenu === 'dashboard' && <OrgPerformDashboard />}

                                {activeMenu === 'Reviews' && <EmployeePerformanceReview />}
                                {activeMenu === '1on1Meeting' && (!this.state.meetingView ? <EmployeePerformance1on1MeetingModule oneOnOneStatus={2} updateList={this.updateList} /> : <EmployeePerformance1on1MeetingView meetingId={this.state.meetingId} updateView={this.updateView} viewStatus={true} />)}
                                {activeMenu === 'Goals' && <PerformGoals onOpenGoalDetails={this.handleOpenGoalDetails} goalStatus={2} />}
                                {activeMenu === 'goalsView' && <GoalDetails goalStatus={2} goalsData={goalDetailsData} onBack={this.handleBackToGoals} />}
                            </div>
                        </div>
                    </div>
                </div >

            </>
        );
    }
}
