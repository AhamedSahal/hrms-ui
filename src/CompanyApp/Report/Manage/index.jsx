import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle,getCompanyId } from '../../.././utility';
import { Button, Modal, Col, Row, ButtonGroup } from 'react-bootstrap';
import AssetsReport from './Assets';

import TimeSheetReportLanding from './Timesheet';

import AttendanceReportsLanding from './AttendanceReport';

import LeaveReportLanding from './Leave';

import { Route } from 'react-router-dom'
import TaskReportLanding from './Task';
import RosterReportLanding from './Roster';
import { BsDropbox } from "react-icons/bs";
import { getReportAccessByCompanyId } from '../../../AdminApp/Company/service';



const { Header, Body, Footer, Dialog } = Modal;
export default class ManageReportLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showForm: false,
            value: 0,
            activeArray: ["Timesheet Report","Attendance Report","Leave Report","Roster Report","Task Report","Assets Report"],
            activeTab: "",
            moduleSetup: [],
            companyId: getCompanyId(),
        };
    }

    componentDidMount() {
        this.fetchReportsStatus();
    }

    closeForm = (data) => {
        this.hideForm()

    }

    hideForm = () => {
        this.setState({
            showForm: false,
        })
    }

    fetchReportsStatus = () => {
        getReportAccessByCompanyId(this.state.companyId).then(res => {
            if (res.status === 'OK') {
                this.setState({
                    moduleSetup: res.data,
                })
                const firstActiveModule = res.data.find(module => module.isActive === "1");
                let name = (res.data).find((datas) => datas.isActive === "1" && this.state.activeArray.includes(datas.moduleName))
                if (firstActiveModule) {
                this.setState({ activeTab: name.moduleName });
                }
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    }

    handleTabChange = (tab) => {
        this.setState({ activeTab: tab });
    };

    render() {
        const { showForm,activeTab } = this.state
        return (
            <>
                <div style={{ backgroundColor: '#f5f5f5' }} className="page-wrapper">
                    <Helmet>
                        <title>Manage | {getTitle()}</title>
                    </Helmet>

                    <div className="content container-fluid">


                        <div className="mt-4 tab-content">
                            <div className="row user-tabs">
                                <div className="nav-box">
                                    <div className="page-headerTab">

                                        <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                            <h3 style={{ color: "white" }}>Manage</h3>
                                            <ul className="nav nav-items">
                                            {this.state.moduleSetup.map((item, index) => (<>
                                                {item.moduleName === "Timesheet Report" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#timesheet" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Timesheet Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Timesheet Report')}>Timesheet</a></li>
                                                </>}
                                                {item.moduleName === "Attendance Report" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#attendanceReport" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Attendance Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Attendance Report')}>Attendance</a> </li>
                                                </>}
                                                {item.moduleName === "Leave Report" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#leaveReport" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Leave Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Leave Report')}>Leave</a> </li>
                                                </>}
                                               
                                                {item.moduleName === "Roster Report" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#rosterReport" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Roster Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Roster Report')}>Roster</a> </li>
                                                </>}
                                                {item.moduleName === "Task Report" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#taskReport" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Task Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Task Report')}>Task</a> </li>
                                                </>}
                                                {item.moduleName === "Assets Report" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#assetsReport" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Assets Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Assets Report')}>Assets</a> </li>
                                                </>}
                                            </>))}
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {activeTab == 'Timesheet Report' && <div id="timesheetReport" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <TimeSheetReportLanding></TimeSheetReportLanding>
                            </div>}

                            {activeTab == 'Attendance Report' && <div id="attendanceReport" style={{padding: "0px"}} className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <AttendanceReportsLanding></AttendanceReportsLanding>
                            </div>}

                            {activeTab == 'Leave Report' &&  <div id="leaveReport" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <LeaveReportLanding></LeaveReportLanding>
                            </div>}

                           

                            {activeTab == 'Roster Report' && <div id="rosterReport" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <RosterReportLanding></RosterReportLanding>
                            </div> }

                            {activeTab == 'Task Report' &&  <div id="taskReport" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <TaskReportLanding></TaskReportLanding>
                            </div> }

                            {activeTab == 'Assets Report' && <div id="assetsReport" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <AssetsReport></AssetsReport>
                            </div> }

                            {activeTab == "" &&  <div className='verticalCenter' style={{textAlign:"center",paddingTop: "200px"}}>
                        <BsDropbox size={60} />
                         <h3>No Data Found</h3>
                            </div>}



                        </div>
                    </div>

                </div>

            </>
        )
    }
}