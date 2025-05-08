import { Table } from 'antd';
import React, { Component } from 'react';
import { BsSliders } from "react-icons/bs";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getRegularizationList } from '../regularization/service';
import { itemRender } from '../../../../paginationfunction';
import { convertToUserTimeZone, toDateTime, toLocalDateTime, getCustomizedWidgetDate } from '../../../../utility';
import TableActionDropDown from '../../../ModuleSetup/Dropdown/TableActionDropDown';
import { Button } from '@mui/material';


export default class MyRegularization extends Component {
    constructor(props) {
        super(props);
        var today = new Date();
        this.state = {
            // employeeId: props.match.params.id || 0,
            data: [],
            q: "",
            page: 0,
            size: 10,
            sort: "id,desc",
            regularizedDate: today.toISOString().split('T')[0],
            fromDate: today.toISOString().split('T')[0],
            toDate: today.toISOString().split('T')[0],
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            showFilter: false,
            self: 1 || 0,
            selected: [],
            status: ""
        };

    }
    componentDidMount() {
        this.fetchList();
    }

    fetchList = () => {
        getRegularizationList(this.state.q, this.state.regularizedDate, this.state.page, this.state.size, this.state.sort, this.state.self, this.state.fromDate, this.state.toDate,this.state.status).then(res => {
            if (res.status == "OK") {
                this.setState({
                    data: res.data.list,
                    totalPages: res.data.totalPages,
                    totalRecords: res.data.totalRecords,
                    currentPage: res.data.currentPage + 1,
                    employeeName: res.data.employeeName
                })
            }
        })
    }
    onTableDataChange = (d, filter, sorter) => {
        this.setState({
            page: d.current - 1,
            size: d.pageSize,
            sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
        }, () => {
            this.fetchList();
        })
    }
    pageSizeChange = (currentPage, pageSize) => {
        this.setState({
            size: pageSize,
            page: 0
        }, () => {
            this.fetchList();

        })

    }

    getStyle(text) {

        if (text === 'APPROVED') {
            return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Approved</span>;
        }
        if (text === 'REJECTED') {
            return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Rejected</span>;
        }
        if (text === 'PENDING') {
            return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Pending</span>;
        }
        return '-';
    }


    render() {
        const { data, totalPages, totalRecords, currentPage, size, selected } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }

        const menuItems = (text, record) => {
            const items = [];
            if (record.regularizationStatus == "NOT_REGULARIZED") {
                items.push(<div> <a className="muiMenu_item" href="#" onClick={() => {
                    let { Regularization } = this.state;
                    Regularization = record;

                    this.setState({ Regularization, showForm: true })
                }} >
                    <i className="las la-check-double m-r-5"></i> Regularize </a>
                </div>
                );
            }
            return items;
        };

        const columns = [
            {
                title: 'Date',
                sorter: true,
                render: (text, record) => {
                    return <>
                        <div>{getCustomizedWidgetDate(record.date)}</div>
                    </>
                }
            },

            {
                title: 'Assigned Shift',
                sorter: true,
                className: "text-center",
                render: (text, record) => {
                    return <div>{record.settingClockIn != null ? convertToUserTimeZone(toDateTime(record.date, record.settingClockIn)) : "-"} to {record.settingClockOut != null ? convertToUserTimeZone(toDateTime(record.date, record.settingClockOut)) : "-"}</div>
                }
            },
            {
                title: 'Attendance Status',
                sorter: true,
                className: "text-center",
                render: (text, record) => {
                    return <div>{record.systemClockIn != null ? convertToUserTimeZone(record.systemClockIn) : "-"} - {record.systemClockOut != null ? convertToUserTimeZone(record.systemClockOut) : "-"}</div>
                }
            },
            {
                title: 'Recorded Clock-In Time',
                sorter: true,
                className: "text-center",
                render: (text, record) => {
                    return <div>{record.actualInTimeBeforeRegularize != null ? convertToUserTimeZone(record.actualInTimeBeforeRegularize) : "-"}</div>
                }
            },
            {
                title: 'Recorded Clock-Out Time',
                sorter: true,
                className: "text-center",
                render: (text, record) => {
                    return <div>{record.actualOutTimeBeforeRegularize != null ? convertToUserTimeZone(record.actualOutTimeBeforeRegularize) : "-"}</div>
                }
            },


            {
                title: 'Reason for Regularization',
                sorter: true,
                className: "text-center",
                className: 'pre-wrap',
                render: (text, record) => {
                    return <>
                        <div>{record.systemReason}</div>
                    </>
                }
            },

            {
                title: 'Requested Clock-In Time',
                className: "text-center",
                render: (text, record) => {
                    return <>
                        <div>{toLocalDateTime(text.regularizedInTime)}</div>
                    </>
                }
            },
            {
                title: 'Requested Clock-Out Time',
                sorter: true,
                className: "text-center",
                render: (text, record) => {
                    return <>
                        <div>{toLocalDateTime(text.regularizedOutTime)}</div>
                    </>
                }
            },
            {
                title: 'Request Submission Status',
                className: "text-center",
                render: (text, record) => {
                    return <div>{text.regularizationRemarks}</div>
                }
            },
            {
                title: 'Regularization Status',
                width: 100,
                sorter: true,
                className: "text-center",
                render: (text, record) => {
                    return <>
                        {<span className={text.regularizationStatus == "NOT_REGULARIZED" ? "badge bg-inverse-secondary " : text.regularizationStatus == "PENDING" ? "badge bg-inverse-warning " : text.regularizationStatus == "REGULARIZED" ? "badge bg-inverse-success " : "-"}>
                            {text.regularizationStatus == "NOT_REGULARIZED" ? <i className="pr-2 fa fa-ban text-secondary"></i> : text.regularizationStatus == "PENDING" ? <i className="pr-2 fa fa-hourglass-o text-warning"></i> : text.regularizationStatus == "REGULARIZED" ? <i className="pr-2 fa fa-check text-success"></i> : "-"}{
                                text.regularizationStatus == "NOT_REGULARIZED" ? 'Not Regularized' : text.regularizationStatus == "PENDING" ? 'Pending' : text.regularizationStatus == "REGULARIZED" ? 'Regularized' : "-"
                            }</span>}
                    </>
                }
            },
            // approval status
            {
                title: 'Approval Status',
                width: 100,
                className: "text-center",
                render: (text, record) => {
                    return <div>{this.getStyle(text.approvalstatus)}</div>
                }
            },
            {
                title: 'Action',
                width: 100,
                className: "text-center",
                render: (text, record) => {
                    return <>
                        <div className="menuIconDiv">
                            <i onClick={() => {
                                this.setState({ viewPage: record, showViewPage: true })
                            }} className="menuIconFa fa fa-eye" aria-hidden="true"></i>
                            <TableActionDropDown menuItems={menuItems(text, record)} />
                        </div>
                    </>
                },
            },
        ]
        return (<>
            < div style={{ marginTop: '-40px' }} className='pl-0' id='page-head' >
                <div className="float-right col-md-5 btn-group btn-group-sm">
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
                                    <h3 className="page-titleText">Regularization</h3>
                                </div>
                            </div>
                        </div>
                        <div className="tableCard-container row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <Table id='Table-style' className="table-striped"
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
                                        // bordered
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
        </>
        );
    }
}