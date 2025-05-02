import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { getEmployeeId, getTitle, verifyOrgLevelViewPermission, verifyViewPermissionForTeam } from '../../../utility';
import { RiDashboardLine, RiEqualizerLine, RiGitPullRequestLine } from "react-icons/ri";
import Mydashboard from './MyAttendance/dashboard';
import MyAttendancelist from './MyAttendance/Attendancelist';
import MyCalender from './MyAttendance/calender';
import TeamDashboard from './TeamAttendance/teamDashboard'
import TeamAttendanceList from './TeamAttendance/teamAttendanceList';
import OrgDashboard from './OrgAttendance/orgDashboard';
import OrgAttendanceList from './OrgAttendance/orgAttendanceList';
import { FcOvertime } from 'react-icons/fc';
import MyOvertimeApproval from './MyAttendance/MyOvertime';
import TeamOvertimeApproval from './TeamAttendance/TeamOvertime';
import MyRegularization from './MyAttendance/MyRegularize';
import OrgOvertimeApproval from './OrgAttendance/OrgOvertime';
import OrgRegularization from './OrgAttendance/OrgRegularize';
import TeamRegularization from './TeamAttendance/TeamRegularize';
import TeamCalendar from './TeamAttendance/TeamCalendar';
import OrgCalendar from './OrgAttendance/orgCalendar';
import { getList } from '../../ModuleSetup/Regularization/service';
import { getEmployeeDashboardDetail } from '../../../MainPage/Main/Dashboard/service';
import MyPermission from './MyAttendance/myPermission';
import OrgPermission from './OrgAttendance/OrgPermission';
import TeamPermission from './TeamAttendance/TeamPermission';

export default class EmployeeAttendanceModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonState: true,
            activeMenu: 'dashboard',
            RegularizationSettings: false,
            dashboard: {},
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
        if(EmployeeId > 0){
            getEmployeeDashboardDetail(new Date().toISOString().substring(0, 16)).then(res => {
                this.setState({ dashboard: res.data });
            });
        }else{
            this.setState({ dashboard: false });
        }
        
    }

    handleMenuClick = (menu) => {
        this.setState({ activeMenu: menu });
    }

    isActive = (item) => {
        this.setState({ activeMenu: item })
    }


    render() {
        const { activeMenu, dashboard } = this.state
        const EmployeeId = getEmployeeId()

        return (
            <>
                <div className="page-wrapper">
                    <Helmet>
                        <title>Employee Attendance | {getTitle()}</title>
                        <meta name="description" content="Attendance" />
                    </Helmet>
                    <div className="mt-4 content container-fluid">
                        <div className="tab-content">
                            <div className="subMenu_box row user-tabs">
                                <div className="nav-box">
                                    <div className="page-headerTab">
                                        <h3 style={{ color: 'white' }} className="page-title">Employee Attendance</h3>
                                        <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                            <ul className="nav nav-items">
                                                {<li className="nav-item"><a href="#my_div" data-toggle="tab" className="nav-link active"><i class="fa fa-user" aria-hidden="true"></i> My Attendance</a></li>}
                                                {verifyViewPermissionForTeam("ATTENDANCE") && <li className="nav-item"><a href="#team_div" data-toggle="tab" className="nav-link"><i class="fa fa-users" aria-hidden="true"></i> Team Attendance</a></li>}
                                                {verifyOrgLevelViewPermission("ATTENDANCE") && <li className="nav-item"><a href="#org_div" data-toggle="tab" className="nav-link"><i class="fa fa-sitemap" aria-hidden="true"></i> Organization Attendance</a></li>}
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
                                    className={activeMenu === 'attendanceList' ? 'active' : ''}
                                    onClick={() => this.handleMenuClick('attendanceList')}
                                >
                                    <i class="fa fa-list mr-2" aria-hidden="true"></i>
                                    Attendance List
                                </button>
                                <button
                                    className={activeMenu === 'calendar' ? 'active' : ''}
                                    onClick={() => this.handleMenuClick('calendar')}
                                >
                                    <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                                    Calendar
                                </button>

                                {dashboard?.overtimeEnable == true && <button
                                    className={activeMenu === 'overtime' ? 'active' : ''}
                                    onClick={() => this.handleMenuClick('overtime')}
                                >
                                    <FcOvertime className=" mr-1" size={20} />
                                    Overtime
                                </button>}
                                {this.state.RegularizationSettings && <button
                                    className={activeMenu === 'regularize' ? 'active' : ''}
                                    onClick={() => this.handleMenuClick('regularize')}
                                >
                                    <RiEqualizerLine className=" mr-1" size={20} />
                                    Regularize
                                </button>}
                                <button
                                    className={activeMenu === 'permission' ? 'active' : ''}
                                    onClick={() => this.handleMenuClick('permission')}
                                >
                                    <RiGitPullRequestLine className=" mr-1" size={20} />
                                    Permission
                                </button>
                            </div>
                            <div id='my_div' className="pl-0 pro-overview ant-table-background tab-pane fade show active" >
                                {activeMenu === 'dashboard' && <Mydashboard isActive={this.isActive} />}
                                {activeMenu === 'attendanceList' && <MyAttendancelist />}
                                {activeMenu === 'calendar' && <MyCalender />}
                                {activeMenu === 'overtime' && <MyOvertimeApproval />}
                                {activeMenu === 'regularize' && <MyRegularization />}
                                {activeMenu === 'permission' && <MyPermission />}
                            </div>
                            <div id='team_div' className="pl-0 pro-overview ant-table-background tab-pane fade">
                                {activeMenu === 'dashboard' && <TeamDashboard />}
                                {activeMenu === 'attendanceList' && <TeamAttendanceList />}
                                {activeMenu === 'calendar' && <TeamCalendar />}
                                {activeMenu === 'overtime' && <TeamOvertimeApproval />}
                                {activeMenu === 'regularize' && <TeamRegularization />}
                                {activeMenu === 'permission' && <TeamPermission />}
                            </div>
                            <div id='org_div' className="pl-0 pro-overview ant-table-background tab-pane fade">
                                {activeMenu === 'dashboard' && <OrgDashboard />}
                                {activeMenu === 'attendanceList' && <OrgAttendanceList />}
                                {activeMenu === 'calendar' && <OrgCalendar />}
                                {activeMenu === 'overtime' && <OrgOvertimeApproval />}
                                {activeMenu === 'regularize' && <OrgRegularization />}
                                {activeMenu === 'permission' && <OrgPermission />}
                            </div>
                        </div>
                    </div>
                </div >

            </>
        );
    }
}
