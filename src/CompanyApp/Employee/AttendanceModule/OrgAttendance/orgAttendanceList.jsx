import React, { Component } from 'react'
import { Table, Tag } from 'antd';
import { BsSliders } from 'react-icons/bs';
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { getEmployeeAttendanceList } from '../../service';
import { convertToUserTimeZoneForAttendance, getUserType, verifyOrgLevelEditPermission, verifyViewPermission } from '../../../../utility';
import LocationListColumn from '../../locationListColumn';
import { itemRender } from '../../../../paginationfunction';
import EmployeeListColumn from '../../employeeListColumn';
import JobTitlesDropdown from '../../../ModuleSetup/Dropdown/JobTitlesDropdown';
import DepartmentDropdown from '../../../ModuleSetup/Dropdown/DepartmentDropdown';
import BranchDropdown from '../../../ModuleSetup/Dropdown/BranchDropdown';
import AttendanceForm from '../../attendanceForm';
import { Button } from '@mui/material';

const { Header, Body, Footer, Dialog } = Modal;

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class OrgAttendanceList extends Component {
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
            designationId: "",
            jobTitleId: "",
            fromDate: firstDay.toISOString().split('T')[0],
            toDate: lastDay.toISOString().split('T')[0],
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            gridView: false,
            showFilter: false,
            self: isCompanyAdmin ? 0 : 1,
            employeeId: "",
            calenderData: [],
            calenderDate: undefined,
            buttonState: true,
            dashboard: {},
            onTime: true,
        };
    }

    componentDidMount() {
        this.fetchList();

    }
    fetchList = () => {
        if (verifyViewPermission("ATTENDANCE")) {
            getEmployeeAttendanceList(this.state.branchId, this.state.departmentId, this.state.jobTitleId, this.state.q, this.state.fromDate, this.state.toDate, this.state.page, this.state.size, this.state.sort, this.state.self).then(res => {

                if (res.status == "OK") {
                    this.setState({
                        data: res.data.list,
                        totalPages: res.data.totalPages,
                        totalRecords: res.data.totalRecords,
                        currentPage: res.data.currentPage + 1
                    })
                }
            })
        }
    }

    updateList = (attendance) => {
        let { data } = this.state;
        let index = data.findIndex(d => d.id == attendance.id);
        if (index > -1)
            data[index] = attendance;
        else {
            data = [attendance, ...data];
        }
        this.setState({ data },
            () => {
                this.hideForm();
            });
    }
    hideForm = () => {
        this.setState({
            showForm: false
        })
    }
    render() {
        const { data, totalRecords, currentPage, size, } = this.state

        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        let columns = [
            {
                title: 'Employee',
                sorter: false,
                render: (text) => {
                    return <EmployeeListColumn id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
                }
            },
            {
                title: 'Date',
                dataIndex: 'date',
                sorter: true,
                className: "text-center",
                render: (text) => {
                    const date = moment(text);
                    return <>
                        <div>{date.isSame(moment(), 'day') ? <span style={{ fontWeight: '600', color: '#4DC2DD' }}>Today</span> : date.format('ddd, DD MMMM YYYY')}</div>
                    </>
                }
            },
            {
                title: 'Clock In',
                sorter: false,
                className: "text-center",
                render: (text) => {
                    return (
                        <div style={{ fontWeight: '600' }}>
                            {text.clockInSource === "WEB" && <i className="fa fa-desktop" aria-hidden="true" title="WEB" style={{ fontSize: '15px' }}></i>}
                            {text.clockInSource === "ANDROID" && <i className="fa fa-android" title="ANDROID" style={{ fontSize: '20px' }}></i>}
                            {text.clockInSource === "IOS" && <i className='fa fa-apple' title="IOS" style={{ fontSize: '18px' }}></i>}
                            {text.clockInSource === "SYSTEM" && <i className='fa fa-clock-o' title="AUTO CLOCK IN" style={{ fontSize: '18px' }}></i>}
                            {text.clockInSource === "MANUAL" && <i className='fa fa-user-plus' aria-hidden="true" title="MANUAL" style={{ fontSize: '18px' }}></i>}
                            {text.clockInSource === "BULK_UPLOAD" && <i className='fa fa-cloud-upload' aria-hidden="true" title="BULK UPLOAD" style={{ fontSize: '18px' }}></i>}
                            {text.clockInSource === "REGULARIZATION" && <i className='fa fa-history' aria-hidden="true" title="REGULARIZATION" style={{fontSize:'18px'}}></i>}
                            &nbsp;&nbsp;  <FiArrowDownRight size={15} style={{ color: '#45C56D' }} />  {convertToUserTimeZoneForAttendance(text.actualClockIn)}
                        </div>
                    )
                }
            },
            {
                title: 'Clock Out',
                sorter: true,
                className: "text-center",
                render: (text) => {
                    return <div style={{ fontWeight: '600' }}>  {text.actualClockOut ? <>
                        {text.clockOutSource === "WEB" && <i className="fa fa-desktop" aria-hidden="true" title="WEB" style={{ fontSize: '15px' }}></i>}
                        {text.clockOutSource === "ANDROID" && <i className="fa fa-android" title="ANDROID" style={{ fontSize: '20px' }}></i>}
                        {text.clockOutSource === "IOS" && <i className='fa fa-apple' title="IOS" style={{ fontSize: '18px' }}></i>}
                        {text.clockOutSource === "SYSTEM" && <i className='fa fa-clock-o' title="AUTO CLOCK IN" style={{ fontSize: '18px' }}></i>}
                        {text.clockOutSource === "MANUAL" && <i className='fa fa-user-plus' aria-hidden="true" title="MANUAL" style={{ fontSize: '18px' }}></i>}
                        {text.clockOutSource === "BULK_UPLOAD" && <i className='fa fa-cloud-upload' aria-hidden="true" title="BULK UPLOAD" style={{ fontSize: '18px' }}></i>}
                        {text.clockOutSource === "REGULARIZATION" && <i className='fa fa-history' aria-hidden="true" title="REGULARIZATION" style={{fontSize:'18px'}}></i>}
                        &nbsp;&nbsp;

                        <FiArrowUpRight size={15} style={{ color: '#f88535' }} />{convertToUserTimeZoneForAttendance(text.actualClockOut)}
                    </> : '-'}
                    </div>
                }
            },
            {
                title: 'Actual Hours',
                className: "text-center",
                render: (text, record) => {
                    return <>
                        <span style={{ fontWeight: '600' }}>{record.actualHoursDisplay}</span>
                    </>
                }
            },
            {
                title: 'Status',
                className: "text-center",
                render: () => {
                    const color = 'green'
                    return (
                        <Tag style={{ borderRadius: '5px' }} color={color}>
                            {('Ontime').toUpperCase()}
                        </Tag>
                    );
                },
            },
            {
                title: 'Location & Selfie',
                className: "text-center",
                render: (text) => {
                    return <LocationListColumn location={text.location} locationOut={text.locationOut} id={text.id}></LocationListColumn>
                }
            },

        ];
        return (
            <div style={{ marginTop: '-40px' }} className='pl-0' id='page-head' >
                <div className="float-right col-md-5 btn-group btn-group-sm">
                    {verifyOrgLevelEditPermission("ATTENDANCE") && <button className="apply-button btn-primary mr-2" onClick={() => {
                        this.setState({
                            showForm: true
                        })
                    }}><i className="fa fa-plus" /> Add</button>}

                    <Button onClick={() => this.setState({ showFilter: !this.state.showFilter })}
                        sx={{ p: '1px', textTransform: 'none', backgroundColor: "#2e5984" }} size="small" variant="contained"  >
                        <BsSliders style={{ padding: '2px' }} className='filter-btn' size={30} />
                    </Button>
                </div>

                {this.state.showFilter && <div className='mt-5 filterCard p-3'>
                    {isCompanyAdmin && <div className="row">
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
                        {/* job title */}
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
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group form-focus">
                                <input onChange={e => {
                                    this.setState({
                                        q: e.target.value,
                                        page: 0
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
                    </div>
                </div>}
                < div className='mt-5 Table-card' >
                    <div className="tableCard-body">
                        <div className="row " >
                            <div className="mt-3 col">
                                <h3 className="page-titleText">Employee Attendance</h3>
                            </div>
                        </div>
                        <div className="tableCard-container row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <Table id='Table-style' className="table-striped"
                                        pagination={{
                                            total: totalRecords,
                                            showTotal: () => {
                                                return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                                            },
                                            showSizeChanger: true, onShowSizeChange: this.pageSizeChange,
                                            itemRender: itemRender,
                                            pageSizeOptions: [10, 20, 50, 100],
                                            current: currentPage,
                                            defaultCurrent: 1,
                                        }}
                                        style={{ overflowX: 'auto' }}
                                        columns={columns}
                                        dataSource={[...data]}
                                        rowKey={record => record.id}
                                        onChange={this.onTableDataChange}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title">Add Attendance </h5>
                    </Header>
                    <Body>
                        {<AttendanceForm updateList={this.updateList} leave={this.state.leave} employeeId={this.state.employeeId}>
                        </AttendanceForm>}
                    </Body>
                </Modal>
            </div>
        )
    }
}
