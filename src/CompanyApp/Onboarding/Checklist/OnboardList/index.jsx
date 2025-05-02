import { Empty, Popover, Progress, Slider, Table, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Button, Modal, ProgressBar } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { getReadableDate, getUserType, verifyOrgLevelViewPermission, getTitle } from '../../../../utility';


import DepartmentDropdown from '../../../ModuleSetup/Dropdown/DepartmentDropdown';
import BranchDropdown from '../../../ModuleSetup/Dropdown/BranchDropdown';
import JobTitlesDropdown from '../../../ModuleSetup/Dropdown/JobTitlesDropdown';
import { BsSliders } from 'react-icons/bs';
import EmployeeProfilePhoto from '../../../Employee/widgetEmployeePhoto';



const onboardTask = [
    {
        id: 1,
        employeeName: "John Doe",
        title: "Software Engineer",
        startDate: "2025-02-01",
        managerName: "Alice Smith",
        subtaskCount: 5,
        taskCount: 5,
        taskProgress: 18, // Percentage
    },
    {
        id: 2,
        employeeName: "Jane Smith",
        title: "UI/UX Designer",
        startDate: "2025-02-05",
        managerName: "Bob Johnson",
        subtaskCount: 4,
        taskCount: 5,
        taskProgress: 50, // Percentage
    },
    {
        id: 3,
        employeeName: "Mike Brown",
        title: "HR Specialist",
        startDate: "2025-02-10",
        managerName: "Sarah Lee",
        subtaskCount: 6,
        taskCount: 5,
        taskProgress: 90, // Percentage
    }
];



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
        // getOnboardChecklist(this.state.branchId,this.state.departmentId,this.state.jobTitleId, this.state.q, this.state.page, this.state.size, this.state.sort, this.state.fromDate ,this.state.toDate).then(res => {
        //        if (res.status == "OK") {
        //          this.setState({
        //            data: res.data.list,
        //            totalRecords: res.data.totalRecords,
        //          })
        //        }
        //      })

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
        const {  totalRecords, currentPage, size } = this.state
       
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
                                    {onboardTask.length > 0 ? null : (
                                        <tr>
                                            <td colSpan="6">
                                                <Empty />
                                            </td>
                                        </tr>
                                    )}
                                    {onboardTask?.map((item) => {
                                        return (
                                            <>
                                                <tr onClick={() => this.props.handlePage('tasklist')} className='Goals_table_row' key={item.id}>
                                                    <td style={{ width: '300px' }} className='GoalName_tab' >
                                                        <div >
                                                            <div className="goal-title"><EmployeeProfilePhoto className='multiSelectImgSize' id={item.employeeId}></EmployeeProfilePhoto>{item.employeeName}</div>

                                                        </div>
                                                    </td>
                                                    <td>{item.title}</td>
                                                    <td style={{ textAlign: 'center' }}>{getReadableDate(item.startDate)}</td>
                                                    <td><EmployeeProfilePhoto className='multiSelectImgSize' id={item.employeeId}></EmployeeProfilePhoto>{item.managerName}</td>
                                                    <td style={{ textAlign: 'center' }}>{item.taskCount}</td>
                                                    <td style={{ textAlign: 'center' }}>{item.subtaskCount}</td>

                                                    <td>
                                                        <div className="onboardList_progress-bar">
                                                            <div className="goal_progress-fill" style={{ backgroundColor: getColorByAchievement(item.taskProgress), width: `${item.taskProgress}%` }}></div>
                                                        </div>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <span className='badge bg-inverse-info'><i class="pr-2 fa fa-circle text-info"></i>In-Progress</span>


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
