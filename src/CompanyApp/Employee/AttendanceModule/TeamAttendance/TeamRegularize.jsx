import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal, ButtonGroup } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { BsSliders } from "react-icons/bs";
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getRegularizationList, updateSelectedStatus } from '../regularization/service';
import EmployeeListColumn from '../../employeeListColumn';
import { itemRender } from '../../../../paginationfunction';
import RegularizeAttendance from '../regularization/form';
import RegularizationAction from '../regularization/regularizationAction';
import {  getUserType, verifyViewPermission, getReadableDate, verifyApprovalPermission, convertToUserTimeZone, toDateTime, toLocalDateTime } from '../../../../utility';
import TableActionDropDown from '../../../ModuleSetup/Dropdown/TableActionDropDown';
import { Button } from '@mui/material';


const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const { Header, Body, Footer, Dialog } = Modal;
export default class TeamRegularization extends Component {
    constructor(props) {
        super(props);
        var today = new Date();
        var yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        var firstDay = new Date(today.getFullYear(), today.getMonth(), 2);
        var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        this.state = {
            // employeeId: props.match.params.id || 0,
            data: [],
            q: "",
            page: 0,
            size: 10,
            sort: "id,desc",
            regularizedDate: yesterday.toISOString().split('T')[0],
            fromDate: isCompanyAdmin? yesterday.toISOString().split('T')[0] : firstDay.toISOString().split('T')[0],
            toDate: isCompanyAdmin?yesterday.toISOString().split('T')[0] : lastDay.toISOString().split('T')[0],
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            showFilter: false,
            self: isCompanyAdmin ? 0 : 1,
            selected: []
        };

    }
    componentDidMount() {
        this.fetchList();
    }

    fetchList = () => {
        if (verifyViewPermission("ATTENDANCE")) {
            getRegularizationList(this.state.q, this.state.regularizedDate, this.state.page, this.state.size, this.state.sort, this.state.self, this.state.fromDate, this.state.toDate).then(res => {
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
    updateSelf = () => {

        this.setState({
            self: this.state.self == 1 ? 0 : 1,
            currentPage: 1,
            page: 0
        }, () => {
            this.fetchList();

        })
    }
    // mark all as approver and select as approved api
    updateStatus = (selected, status) => {
        updateSelectedStatus(selected, status).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.fetchList();
            } else {
                toast.error(res.message);
            }
        })
    }
    //   select as approve
    rowSelection = {
        onChange: (data) => {
            let { selected } = this.state;
            data.forEach(data => {
                let index = selected.indexOf(data.id);
                if (index > -1) {
                    selected.splice(index, 1);
                } else {
                    selected.push(data);
                }
                this.setState({ selected });
            });

        },
        getCheckboxProps: (record) => ({
            disabled: record.regularizationStatus !== 'REGULARIZED',
        })
    };

    // mark all as approve or reject
    updateAll = (status) => {
        const { data } = this.state
        if (data && data.length > 0) {
            confirmAlert({
                title: `Update Status for all as ${status}`,
                message: 'Are you sure, you want to update status for all records on page?',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            let selected = []
                            this.updateStatus(selected, status);
                            this.setState({ selected: [] })
                        }
                    },
                    {
                        label: 'No',
                        onClick: () => { }
                    }
                ]
            });
        }
    }

    //   mark selected as approve
    updateSelected = (status) => {
        const { selected } = this.state;
        confirmAlert({
            title: `Update Status for selected as ${status}`,
            message: 'Are you sure, you want to update status for selected?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        this.updateStatus(selected, status);
                        this.setState({ selected: [] })
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }
    // status ui
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

    hideForm = () => {
        this.setState({
            showForm: false,
            Regularization: undefined
        })
    }
    hideActionForm = () => {
        this.setState({
            showActionForm: false,
            Regularization: undefined
        })
    }


    render() {
        const { data, totalRecords, currentPage, size, selected } = this.state
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
            if (record.regularizationStatus == "REGULARIZED") {
                items.push(<div>
                    <a className="muiMenu_item" href="#" onClick={() => {
                        let { Regularization } = this.state;
                        Regularization = record;

                        this.setState({ Regularization, showActionForm: true })
                    }} >
                        <i className="fa fa-pencil m-r-5"></i> Regularization Action </a>
                </div>
                );
            }


            return items;
        };


        const columns = [
            {
                title: 'Employee',
                sorter: false,
                fixed: 'left',
                hidden: true,
                width: 250,
                render: (text) => {
                    return <EmployeeListColumn
                        id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
                }
            }, {
                title: 'Date',
                width: 100,
                sorter: true,
                className: "text-center",
                render: (text, record) => {
                    return <>
                        <div>{getReadableDate(record.date)}</div>
                    </>
                }
            },

            {
                title: 'Assigned Shift',
                sorter: true,
                width: 150,
                className: "text-center",
                render: (text, record) => {
                    return <div>{record.settingClockIn != null ? convertToUserTimeZone(toDateTime(record.date, record.settingClockIn)) : "-"} to {record.settingClockOut != null ? convertToUserTimeZone(toDateTime(record.date, record.settingClockOut)) : "-"}</div>
                }
            },
            {
                title: 'Attendance Status',
                sorter: true,
                width: 150,
                className: "text-center",
                render: (text, record) => {
                    return <div>{record.systemClockIn != null ? convertToUserTimeZone(record.systemClockIn) : "-"} - {record.systemClockOut != null ? convertToUserTimeZone(record.systemClockOut) : "-"}</div>
                }
            },
            {
                title: () => (
                    <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
                        Recorded <br /> Clock-In Time
                    </div>
                ),
                sorter: true,
                width: 200,
                className: "text-center",
                render: (text, record) => {
                    return <div>{record.actualInTimeBeforeRegularize != null ? convertToUserTimeZone(record.actualInTimeBeforeRegularize) : "-"}</div>
                }
            },
            {
                title: () => (
                    <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
                        Recorded <br /> Clock-Out Time
                    </div>
                ),
                sorter: true,
                width: 200,
                className: "text-center",
                // className: 'pre-wrap',
                render: (text, record) => {
                    return <div>{record.actualOutTimeBeforeRegularize != null ? convertToUserTimeZone(record.actualOutTimeBeforeRegularize) : "-"}</div>
                }
            },


            {
                title: () => (
                    <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
                        Reason <br /> for Regularization
                    </div>
                ),
                sorter: true,
                width: 200,
                className: "text-center",
                render: (text, record) => {
                    return <>
                        <div>{record.systemReason}</div>
                    </>
                }
            },

            {
                title: () => (
                    <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
                        Requested <br /> Clock-In Time
                    </div>
                ),
                width: 200,
                className: "text-center",
                render: (text) => {
                    return <>
                        <div>{toLocalDateTime(text.regularizedInTime)}</div>
                    </>
                }
            },
            {
                title: () => (
                    <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
                        Requested <br /> Clock-Out Time
                    </div>
                ),
                sorter: true,
                width: 210,
                className: "text-center",
                render: (text) => {
                    return <>
                        <div>{toLocalDateTime(text.regularizedOutTime)}</div>
                    </>
                }
            },
            {
                title: () => (
                    <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
                        Requested <br /> Submission Status
                    </div>
                ),
                width: 210,
                className: "text-center",
                render: (text) => {
                    return <div>{text.regularizationRemarks}</div>
                }
            },
            {
                title: 'Regularization Status',
                width: 200,
                className: "text-center",
                sorter: true,
                render: (text) => {
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
                width: 150,
                className: "text-center",
                render: (text) => {
                    return <div>{this.getStyle(text.approvalstatus)}</div>
                }
            },

            {
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
                align: 'center',
                width: 100,
                render: (text, record) => {
                    return <>
                        <div className="menuIconDiv">
                            <i onClick={() => {
                                this.setState({ regularize: record, showRegularize: true })
                            }} className="menuIconFa fa fa-eye" aria-hidden="true"></i>
                            {verifyApprovalPermission("ATTENDANCE") && <TableActionDropDown menuItems={menuItems(text, record)} />}
                        </div>
                    </>
                }
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
                    </div>
                </div>}
                <div className='mt-5 Table-card'>
                    <div className="tableCard-body">
                        <div className="row " >
                            <div className="mt-3 col">
                                <h3 className="page-titleText">Regularization</h3>
                            </div>

                            <div className='col-md-auto'  >
                                {verifyApprovalPermission("ATTENDANCE") && data && data.length > 0 && <ButtonGroup className='pull-right my-3'>
                                    <button
                                        disabled={!data || data.length == 0}
                                        className='markAll-btn btn-sm btn-outline-secondary mr-3'
                                        onClick={() => {
                                            this.updateAll('APPROVED');
                                        }}>Mark All As Approved</button>
                                    <button
                                        disabled={!data || data.length == 0}
                                        className='markAll-btn-rejected btn-sm btn-outline-secondary mr-3'
                                        onClick={() => {
                                            this.updateAll('REJECTED');
                                        }}>Mark All As Rejected</button>
                                    <button
                                        disabled={!selected || selected.length == 0}
                                        className='markAll-btn btn-sm btn-outline-secondary mr-3'
                                        onClick={() => {
                                            this.updateSelected('APPROVED');
                                        }}>Mark Selected As Approved</button>
                                    <button
                                        disabled={!selected || selected.length == 0}
                                        className='markAll-btn-rejected btn-sm btn-outline-secondary'
                                        onClick={() => {
                                            this.updateSelected('REJECTED');
                                        }}>Mark Selected As Rejected</button>
                                </ButtonGroup>}
                            </div>
                        </div>
                        <div className="tableCard-container row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <Table id='Table-style' className="table-striped"
                                        rowSelection={this.rowSelection}
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
                                        scroll={{ x: 1500, y: 350 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Page Content */}
            <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
                <Header closeButton>
                    <h5 className="modal-title"> Regularize Your Attendance </h5>
                </Header>
                <Body>
                    <RegularizeAttendance regularize={this.state.Regularization} id={this.state.id}>
                    </RegularizeAttendance>
                </Body>
            </Modal>
            <Modal enforceFocus={false} size={"md"} show={this.state.showActionForm} onHide={this.hideActionForm} >
                <Header closeButton>
                    <h5 className="modal-title"> Approval Regularization </h5>

                </Header>
                <Body>
                    <RegularizationAction regularize={this.state.Regularization} id={this.state.id}>
                    </RegularizationAction>
                </Body>
            </Modal>
            {/* </div> */}
        </>
        );
    }
}