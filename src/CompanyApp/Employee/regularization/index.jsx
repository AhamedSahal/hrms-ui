import { Table } from 'antd';
import React, { Component } from 'react';
import { Button, Modal, Col, Row, ButtonGroup } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import EmployeeListColumn from '../employeeListColumn';
import { itemRender } from '../../../paginationfunction';
import { BsSliders } from "react-icons/bs";
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getRegularizationList, updateSelectedStatus } from './service';
import { getTitle, getUserType, verifySelfViewPermission,verifyOrgLevelEditPermission, verifyEditPermission,formatDateTime, verifyViewPermission, verifyViewPermissionForTeam, getReadableDate, verifyApprovalPermission, convertToUserTimeZone, toDateTime,toLocalDateTime,toDateWithGMT,convertToUTC,fallbackLocalDateTime } from '../../../utility';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import TableDropDown from '../../../MainPage/tableDropDown';
import RegularizeAttendance from './form';
import RegularizationAction from './regularizationAction';
import AttendaceRegularizationView from './view';
import Bowser from 'bowser';

const browser = Bowser.getParser(window.navigator.userAgent);
const browserName = browser.getBrowserName();
const isSafari = browserName === 'Safari';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const isEmployee = getUserType() == 'EMPLOYEE';
const { Header, Body, Footer, Dialog } = Modal;
export default class Regularization extends Component {
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
            selected: [],
            showViewForm: false,
            status: ""
        };

    }
    componentDidMount() {

         this.fetchList();
    }

    fetchList = () => {
        if (verifyViewPermission("ATTENDANCE")) {
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

    // update list 
    updateList = () => {

        this.setState({
            showForm: false,
            showActionForm: false
        }, this.fetchList())

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
    onSelect = (data) => {
        
        let { selected } = this.state;
        let index = selected.indexOf(data.id);
        if (index > -1) {
          selected.splice(index, 1);
        } else {
          selected.push(data.id);
        }
        this.setState({ selected });
    
      }
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
                  let test = data.map((d) => {
                    if (d.regularizationStatus == "REGULARIZED" && d.approvalstatus == "PENDING") {
                      selected.push(d.id)
                      return d.id;
                    }
                  });
    
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
            Regularization: undefined,
            showViewForm: false
        })
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
            // view
            if (verifyViewPermission("ATTENDANCE")) {
                items.push(<div>
                    <a className="muiMenu_item" href="#" onClick={() => {
                        let { Regularization } = this.state;
                        Regularization = text;
                        
                        this.setState({ Regularization, showViewForm: true })
                    }} >
                        <i className="fa fa-eye m-r-5" /> View</a>
                </div>
                );
            }
            if (verifyEditPermission("ATTENDANCE") && (record.regularizationStatus == "NOT_REGULARIZED" || record.approvalstatus == "REJECTED")) {
                items.push(<div> <a className="muiMenu_item" href="#" onClick={() => {
                    let { Regularization } = this.state;
                    Regularization = text;
                    
                    this.setState({ Regularization, showForm: true })
                }} >
                    <i className="las la-check-double m-r-5"></i> Regularize </a>
                </div>
                );
            }
            if (verifyApprovalPermission("ATTENDANCE") && this.state.self != 1 && record.regularizationStatus == "REGULARIZED" && record.approvalstatus == "PENDING") {
                items.push(<div>
                    <a className="muiMenu_item" href="#" onClick={() => {
                        let { Regularization } = this.state;
                        Regularization = text;
                        
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
                render: (text, record) => {
                    return <EmployeeListColumn
                        id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
                }
            }, {
                title: 'Date & Assigned Shift',
                // dataIndex: 'date',
                sorter: true,
                render: (text, record) => {
                    return <>
                    <div>{getReadableDate(record.date)} {record.settingClockIn != null ? (isSafari ? fallbackLocalDateTime(convertToUserTimeZone(record.settingClockIn)) : convertToUserTimeZone(toDateTime(record.date, record.settingClockIn))) : "-"} to {record.settingClockOut != null ? (isSafari ? fallbackLocalDateTime(convertToUserTimeZone(record.settingClockOut)) : convertToUserTimeZone(toDateTime(record.date, record.settingClockOut))) : "-"}</div>
                    </>
                }
            },

           
            {
                title: 'Recorded Clock-In Time & Clock-Out Time',
                sorter: true,
                render: (text, record) => {
                    return <div>{record.actualInTimeBeforeRegularize != null ? convertToUserTimeZone(record.actualInTimeBeforeRegularize) : "-"} to {record.actualOutTimeBeforeRegularize != null ? convertToUserTimeZone(record.actualOutTimeBeforeRegularize) : "-"}</div>
                }
            },
           


            {
                title: 'System Reason',
                sorter: true,
                className: 'pre-wrap',
                render: (text, record) => {
                    return <>
                        <div>{record.systemReason}</div>
                    </>
                }
            },

            {
                title: 'Requested Clock-In Time & Clock-Out Time',
                render: (text, record) => {
                      return <>
                        <div>{text.regularizedInTime != null?formatDateTime(toLocalDateTime(text.regularizedInTime)):"-"} to {text.regularizedOutTime != null?formatDateTime(toLocalDateTime(text.regularizedOutTime)):"-"}</div>
                      </>
                }
            },
           
            {
                title: 'Reason For Regularization',
                render: (text, record) => {
                       return <div>{text.regularizationRemarks}</div>
                }
            },
            {
                title: 'Request Submission Status',
                width: 100,
                sorter: true,
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
                render: (text, record) => {
                    return <div>{this.getStyle(text.approvalstatus)}</div>
                }
            },
            {
                title: 'Action',
                width: 100,
                render: (text, record) => (
                    <Row>
                        <Col md={4}>
                            {verifyApprovalPermission("ATTENDANCE") && <input
                                type="checkbox"
                                disabled={text.regularizationStatus != "REGULARIZED" || text.approvalstatus != "PENDING"}
                                checked={selected && selected.length > 0 && selected.indexOf(record.id) > -1}
                                className="pointer"
                                onClick={e => {
                                    
                                    this.onSelect(record);
                                }}></input>}
                        </Col>
                        <Col md={8}>
                            <TableDropDown menuItems={menuItems(text, record)} />
                        </Col>
                    </Row>
                ),
            },
        ]
        return (<>
            <div className="content container-fluid">
                <div id='page-head' >
                    <div className="float-right col-md-5 btn-group btn-group-sm">
                        {verifyViewPermissionForTeam("ATTENDANCE") && !isCompanyAdmin && <>
                            <div class="btn-group btn-cust-group" role="group" aria-label="Basic example">
                                {verifySelfViewPermission("ATTENDANCE") && <button type="button" className={this.state.self == 1 ? 'btn btn-sm btn-success btn-selected self-btn' : 'btn btn-sm btn-secondary'} onClick={e => {
                                    this.updateSelf()
                                }} > Self </button>}

                                <button type="button" className={this.state.self != 1 ? 'btn btn-sm btn-primary btn-selected' : 'btn btn-sm btn-secondary'} onClick={e => {
                                    verifySelfViewPermission("ATTENDANCE") && this.updateSelf()
                                }} > Team </button>
                            </div>
                        </>}
                        {verifyViewPermission("ATTENDANCE") && <BsSliders className='filter-btn' size={30} onClick={() => this.setState({ showFilter: !this.state.showFilter })} />}
                    </div>
                </div>
                {this.state.showFilter && <div className='mt-4 filterCard p-3'>
                    {verifyViewPermission("ATTENDANCE") &&
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
                        </div>}
                </div>}
                <div className='Table-card'>
                    <div className="tableCard-body">
                        {verifyViewPermission("ATTENDANCE") && <div className=" p-12 m-0">
                            <div className="row " >
                                <div className="mt-3 col">
                                    <h3 className="page-titleText">{!isCompanyAdmin ? this.state.self == 1 ? "My Regularization" : "Team Regularization" : "Regularization List"}</h3>
                                </div>

                               {(this.state.self != 1  || isCompanyAdmin ) &&  <div className='col-md-auto'  >
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
                                </div>}
                            </div>
                        </div>}
                        <div className="row pageTitle-section">
                        <div className="col">
                            {/* <h3 className="tablePage-title">{!isCompanyAdmin ? "My Regularization" : "Regularization List"}</h3> */}
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                                <li className="breadcrumb-item active">Regularization</li>
                            </ul>
                        </div>

                         <div className="mt-1 float-right col">
    
                  </div> 
                    </div>
                        <div className="tableCard-container row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    {verifyViewPermission("ATTENDANCE") &&
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
                                            // bordered
                                            dataSource={[...data]}
                                            rowKey={record => record.id}
                                            onChange={this.onTableDataChange}
                                        />}

                                    {!verifyViewPermission("ATTENDANCE") && <AccessDenied></AccessDenied>}

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
                    <RegularizeAttendance regularize={this.state.Regularization} id={this.state.id} updateList={this.updateList}>
                    </RegularizeAttendance>
                </Body>


            </Modal>
            <Modal enforceFocus={false} size={"md"} show={this.state.showActionForm} onHide={this.hideActionForm} >


                <Header closeButton>
                    <h5 className="modal-title">Regularization Action</h5>

                </Header>
                <Body>
                    <RegularizationAction regularize={this.state.Regularization} id={this.state.id} updateList={this.updateList}>
                    </RegularizationAction>
                </Body>


            </Modal>

            {/* view */}
            <Modal enforceFocus={false} size={"xl"} show={this.state.showViewForm} onHide={this.hideActionForm} >


                <Header closeButton>
                    <h5 className="modal-title"> View</h5>

                </Header>
                <Body>
                    <AttendaceRegularizationView regularize={this.state.Regularization} id={this.state.id}>
                    </AttendaceRegularizationView>
                </Body>


            </Modal>
            {/* </div> */}
        </>
        );
    }
}