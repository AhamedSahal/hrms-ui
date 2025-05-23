import React, { Component } from 'react'
import {  convertToUserTimeZoneForAttendance, getEmailId } from '../../../../utility';
import { getEmployeeAttendanceList } from '../../service';
import LocationListColumn from '../../locationListColumn';
import { itemRender } from '../../../../paginationfunction';
import { Table, Tag } from 'antd';
import { BsSliders } from 'react-icons/bs';
import moment from 'moment';
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { Button } from '@mui/material';

const emailId = getEmailId()
export default class MyAttendancelist extends Component {
    constructor(props) {
        super(props);
        var today = new Date();
        var firstDay = new Date(today.getFullYear(), today.getMonth(), 2);
        var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        this.state = {
            data: [],
            q: emailId || '',
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
            self: 1,
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


    render() {
        const { data, totalRecords, currentPage, size, } = this.state

        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        let columns = [
            {
                title: 'Date',
                render: (text, record) => {
                    const date = moment(text.date);
                    const formattedDate = date.format('ddd , DD MMMM YYYY');
                    const [day, restOfDate] = formattedDate.split(' , ');
                    return (
                        <>
                            <div className='d-flex'>
                                {date.isSame(moment(), 'day') ? (
                                    <span style={{ fontWeight: '600', color: '#4DC2DD' }}>Today</span>
                                ) : (
                                    <>
                                        <div style={{ width: '34px' }}>
                                            <span>{day},</span>
                                        </div>
                                        <div>
                                            <span className="ml-1">{restOfDate}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    );
                },
            },
            {
                title: 'Clock In',
                sorter: false,
                className: "text-center",
                render: (text, record) => {
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
                render: (text, record) => {
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
                render: (text, record) => {
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
                render: (text, record) => {
                    return <LocationListColumn location={text.location} locationOut={text.locationOut} id={text.id}></LocationListColumn>
                }
            },

        ];
        return (
            < div style={{ marginTop: '-40px' }} className='pl-0' id='page-head' >
                <div className="float-right col-md-5 btn-group btn-group-sm">
                    {/* filter */}
                    <Button onClick={() => this.setState({ showFilter: !this.state.showFilter })}
                        sx={{ p: '1px', textTransform: 'none', backgroundColor: "#2e5984" }} size="small" variant="contained"  >
                        <BsSliders style={{ padding: '2px' }} className='filter-btn' size={30} />
                    </Button>
                </div>

                {this.state.showFilter && <div className='mt-5 filterCard p-3'>
                    <div className="row">
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
                        <div className="form-group p-12 m-0 pb-2">
                            <div className="row " >
                                <div className="mt-3 col">
                                    <h3 className="page-titleText">Employee Attendance</h3>
                                </div>
                            </div>
                        </div>
                        {/* /Page Header */}
                        <div className="tableCard-container row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <Table id='Table-style' className="table-striped "
                                        pagination={{
                                            total: totalRecords,
                                            showTotal: (total, range) => {
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
            </div>
        )
    }
}
