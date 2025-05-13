import { Empty, Popover, Progress, Slider, Table, Tooltip } from 'antd';
import React, { Component } from 'react';
import { Button, Modal, ProgressBar, Anchor } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { getReadableDate, getUserType, verifyApprovalPermission, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission, verifySelfViewPermission, verifyViewPermissionForTeam, convertToUserTimeZone, getTitle, toLocalDate } from '../../../../utility';


import DepartmentDropdown from '../../../ModuleSetup/Dropdown/DepartmentDropdown';
import BranchDropdown from '../../../ModuleSetup/Dropdown/BranchDropdown';
import JobTitlesDropdown from '../../../ModuleSetup/Dropdown/JobTitlesDropdown';
import { BsSliders } from 'react-icons/bs';
import SuccessAlert from '../../../../MainPage/successToast';
import EmployeeProfilePhoto from '../../../Employee/widgetEmployeePhoto';
import { FcHighPriority, FcLowPriority, FcMediumPriority } from 'react-icons/fc';
import { getOnboardChecklist } from './tasklist/service';








const { Header, Body, Footer, Dialog } = Modal;
export default class OnboardList extends Component {
    constructor(props) {
        super(props);
        var today = new Date();
        var firstDay = new Date(today.getFullYear(), today.getMonth(), 2);
        var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        this.state = {
            data: [],
            q: "",
            branchId: "",
            departmentId: "",
            jobTitleId: "",
            fromDate: firstDay.toISOString().split('T')[0],
            toDate: lastDay.toISOString().split('T')[0],
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            showFilter: false,
        };
    }
    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        getOnboardChecklist(this.state.branchId, this.state.departmentId, this.state.jobTitleId, this.state.q, this.state.fromDate, this.state.toDate).then(res => {
            if (res.status == "OK") {
                this.setState({
                    data: res.data,
                    //    totalRecords: res.data.totalRecords,
                })
            }
        })

    }



    reduceString = (str, maxLength) => {
        if (typeof str !== 'string' || str.length <= maxLength) {
            return str || '';
        } else {
            return str.slice(0, maxLength) + '...';
        }
    }


    render() {

        const isAdmin = (verifyOrgLevelViewPermission("Onboard") || getUserType() == 'COMPANY_ADMIN');
        const { formData, screenCount, visiblePopover, subGoalsList, expandedRows, totalPages, totalRecords, currentPage, size, goalsView, goalsViewHistory, subGoalsData } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const getColorByAchievement = (achievement) => {
            if (achievement < 25) return "#f76d6d";
            if (achievement >= 25 && achievement < 50) return "#f2ce5a ";
            if (achievement >= 50 && achievement < 75) return "#65d0f2";
            if (achievement > 75) return "#7ae58d";
            return "#f26565";
        };




        return (
            <div >
                <Helmet>
                    <title>Onboard Checklist  | {getTitle()}</title>
                    <meta name="description" content="Branch page" />
                </Helmet>
                <div style={{ cursor: 'pointer', textAlign: 'right' }} className='ml-2 mb-2' onClick={() => this.setState({ showFilter: !this.state.showFilter })} > <BsSliders className='' size={30} /></div>
                {this.state.showFilter && <div style={{ margin: '15px' }} className='mt-3 filterCard p-3'>
                    {this.state.showFilter && isAdmin && <div className="row">
                        <div className="col-md-4">
                            <div className="form-group form-focus">
                                <BranchDropdown defaultValue={this.state.branchId} onChange={e => {
                                    this.setState({
                                        branchId: e.target.value
                                    })
                                }}></BranchDropdown>
                                <label className="focus-label">Location</label>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group form-focus">
                                <DepartmentDropdown defaultValue={this.state.departmentId} onChange={e => {
                                    this.setState({
                                        departmentId: e.target.value
                                    })
                                }}></DepartmentDropdown>
                                <label className="focus-label">Department</label>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group form-focus">
                                <JobTitlesDropdown defaultValue={this.state.jobTitleId} onChange={e => {
                                    this.setState({
                                        jobTitleId: e.target.value
                                    })
                                }}></JobTitlesDropdown>
                                <label className="focus-label">Job Titles</label>
                            </div>
                        </div>

                    </div>}
                    {this.state.showFilter && <div className="row">
                        <div className="col-md-3">
                            <div className="form-group form-focus">
                                <input onChange={e => {
                                    this.setState({
                                        q: e.target.value
                                    })
                                }} type="text" className="form-control floating" />
                                <label className="focus-label">Search</label>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group form-focus">
                                <input value={this.state.fromDate} onChange={e => {
                                    this.setState({
                                        fromDate: e.target.value
                                    })
                                }} type="date" className="form-control floating" />
                                <label className="focus-label">From Date</label>
                            </div>

                        </div>

                        <div className="col-md-3">
                            <div className="form-group form-focus">
                                <input value={this.state.toDate} onChange={e => {
                                    this.setState({
                                        toDate: e.target.value
                                    })
                                }} type="date" className="form-control floating" />
                                <label className="focus-label">To Date</label>
                            </div>

                        </div>
                        <div className="col-md-3">
                            <a href="#" onClick={() => {
                                this.fetchList();
                            }} className="btn btn-success btn-block"> Search </a>
                        </div>
                    </div>}
                </div>}
                < div className="p-0 content container-fluid" >

                    < div className='goalPageHead' id='page-head' >

                        <div className=''>
                            <div style={{ height: '70px' }} className="goalHeader-container">
                                <div className="goalHeaderInnerContent-section">
                                    <div className=" goal_status-indicators">
                                        <div onClick={() => this.handleFilteredData('all')} className="filteredGoalsBtn">
                                            <i style={{ color: '#BF40BF' }} class="fa fa-list " aria-hidden="true"> </i> All
                                        </div>
                                        <div onClick={() => this.handleFilteredData('overdue')} className="filteredGoalsBtn">
                                            <i class="fa fa-circle text-info" aria-hidden="true"> </i> In-progress
                                        </div>
                                        <div onClick={() => this.handleFilteredData('completed')} className="filteredGoalsBtn">
                                            <i class="fa fa-check-circle text-success" aria-hidden="true"> </i> Completed
                                        </div>
                                        <div onClick={() => this.handleFilteredData('overdue')} className="filteredGoalsBtn">
                                            <i class="fa fa-calendar-times-o text-danger" aria-hidden="true"> </i> Overdue
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="Goals_table-container">
                            <table className="goals-table">
                                <thead>
                                    <tr>
                                        <th>Employee Name</th>
                                        <th>Title</th>
                                        <th style={{ textAlign: 'center' }}>Date of joining</th>
                                        <th>Reporting Manager</th>
                                        <th style={{ textAlign: 'center' }}>Task Count</th>
                                        <th style={{ textAlign: 'center' }}>Subtask Count</th>
                                        <th>Task Progress</th>
                                        <th style={{ textAlign: 'center' }}>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.data.length > 0 ? null : (
                                        <tr>
                                            <td colSpan="6">
                                                <Empty />
                                            </td>
                                        </tr>
                                    )}
                                    {this.state.data.length > 0 && this.state.data?.map((item) => {
                                        return (
                                            <>
                                                <tr onClick={() => this.props.handlePage('tasklist', item)} className='Goals_table_row' key={item.id}>
                                                    <td style={{ width: '300px' }} className='GoalName_tab' >
                                                        <div >
                                                            <div className="goal-title"><EmployeeProfilePhoto className='multiSelectImgSize' id={item.employeeId}></EmployeeProfilePhoto>{item.employeeName}</div>

                                                        </div>
                                                    </td>
                                                    <td>{(item.jobTitle) ? (item?.jobTitle) : '-'}</td>
                                                    <td style={{ textAlign: 'center' }}>{getReadableDate(item.dateOfJoining)}</td>
                                                    <td>{item?.managerName ? <><EmployeeProfilePhoto className='multiSelectImgSize' id={item.employeeId} />{item.managerName}</> : '-'}</td>

                                                    <td style={{ textAlign: 'center' }}>{item.taskCount}</td>
                                                    <td style={{ textAlign: 'center' }}>{item.subTaskCount}</td>

                                                    <td>
                                                        <div className="onboardList_progress-bar">
                                                            <div className="goal_progress-fill" style={{ backgroundColor: getColorByAchievement(item.progress == null ? 0 : item.progress), width: `${item.progress == null ? 0 : item.progress}%` }}></div>
                                                        </div>
                                                    </td>

                                                    {/* <div >
                                                        <Slider
                                                            value={item.progress == null ? 0 : item.progress}
                                                            tooltip={{ open: false }}
                                                            trackStyle={{ borderRadius: '20px', backgroundColor: getColorByAchievement(item.progress == null ? 0 : item.progress), height: 8 }}
                                                            handleStyle={{
                                                                borderColor: getColorByAchievement(item.progress == null ? 0 : item.progress),
                                                                backgroundColor: "#fff",
                                                                borderWidth: 2,
                                                                width: 20,
                                                                height: 20,

                                                            }}
                                                            railStyle={{ backgroundColor: "#f0f0f0", height: 8 }}
                                                        />
                                                        <div className='m-1 text-right'>
                                                            <span className="last-updated">{(item.progress == null ? 0 : item.progress).toFixed(2)}%</span>
                                                        </div>

                                                    </div> */}

                                                    <td style={{ textAlign: 'center' }}>
                                                        {(item.progress == null ? 0 : item.progress) == 100 ? <span className='badge bg-inverse-success'><i class="pr-2 fa fa-circle text-info"></i>Completed</span> : item.dueDate == null || toLocalDate(item.dueDate) >= toLocalDate(new Date()) ? <span className='badge bg-inverse-info'><i class="pr-2 fa fa-circle text-info"></i>In progress</span> : <span className='badge bg-inverse-danger'><i class="pr-2 fa fa-circle text-info"></i>OverDue</span>}


                                                    </td>
                                                </tr>

                                            </>
                                        );
                                    })}



                                </tbody >

                            </table>
                        </div >


                    </div>

                </div>

            </div>
        );
    }
}
