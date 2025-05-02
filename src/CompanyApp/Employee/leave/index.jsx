
import { Table } from 'antd';
import React, { Component } from 'react';
import {  Modal, Col, Row, ButtonGroup, Anchor } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { BsFillInfoCircleFill, BsSliders } from "react-icons/bs";
import { itemRender } from '../../../paginationfunction';
import { getReadableDate, getUserType, verifyEditPermission, verifySelfViewPermission, verifySelfEditPermission, verifyViewPermission, verifyApprovalPermission, verifyViewPermissionForTeam, toLocalDateTime, getCompanyId } from '../../../utility';
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../../ModuleSetup/Dropdown/DepartmentDropdown';
import DesignationDropdown from '../../ModuleSetup/Dropdown/DesignationDropdown';
import EmployeeListColumn from '../employeeListColumn';
import JobTitlesDropdown from '../../ModuleSetup/Dropdown/JobTitlesDropdown';
import LeaveForm from './form';

import LeaveAction from './leaveAction';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { deleteLeave, getLeaveList } from './service';
import { updateSelectedStatus } from './service';
import { fileDownload } from '../../../HttpRequest';
import TableDropDown from '../../../MainPage/tableDropDown';
import LeaveViewForm from './leaveViewForm';
import successimg from '../../../assets/img/successimg.gif';
import checkimg from '../../../assets/img/tickmarkimg.gif';
import reject from '../../../assets/img/rejectimg.gif';
import { getModuleSetupByCompanyId } from '../../../AdminApp/Company/service';
import { getMultiApprovalMasterList } from '../../ModuleSetup/MultiApprove/LeaveMultiApproval/service';
import { Tooltip } from 'antd';
import { getHalfdayCount } from '../../ModuleSetup/LeaveType/service';

import SuccessAlert from '../../../MainPage/successToast';

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const { Header, Body, Footer, Dialog } = Modal;
export default class Leave extends Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 2);
    var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    this.state = {
      employeeId: props.match?.params.id,
      data: [],
      q: "",
      branchId: "",
      departmentId: "",
      jobTitleId: "",
      designationId: "",
      fromDate: firstDay.toISOString().split('T')[0],
      toDate: lastDay.toISOString().split('T')[0],
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      showFilter: false,
      self: isCompanyAdmin ? 0 : 1,
      showViewForm: false,
      selected: [],
      companyId: getCompanyId(),
      multiApproveValidation: false,
      leaveModuleValidation: false,
      multiApproveMasterData: [],
      showAlert: false,
      alertMsg: '',
      imgTag: '',
      buttonState: true,
      preferredMethod: 'Self',
      halfDayCount: 0
    };
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    if (verifyViewPermission("LEAVE")) {
      getLeaveList(this.state.employeeId, this.state.branchId, this.state.departmentId, this.state.jobTitleId, this.state.q, this.state.fromDate, this.state.toDate, this.state.page, this.state.size, this.state.sort, this.state.self).then(res => {
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

    // multi approve master list
    getMultiApprovalMasterList().then(res => {
      if (res.status === 'OK') {
        this.setState({
          multiApproveMasterData: res.data,
          leaveModuleValidation: res.data.moduleIsActive
        })
      }
    })

    // get module setup date
    getModuleSetupByCompanyId(this.state.companyId).then(res => {
      if (res.status === 'OK') {
        this.setState({
          moduleSetup: res.data,
        })
        let firstActiveModule = res.data.find(module => module.isActive === "1" && module.moduleName === "Multi Approve");
        if (firstActiveModule) {
          this.setState({ multiApproveValidation: firstActiveModule.moduleName == "Multi Approve" ? true : false });
        }
      }
    })
      .catch(error => { console.log("Error: " + error); });

      // halfday check
      getHalfdayCount().then(res => {
      if (res.status === 'OK') {
        this.setState({
          halfDayCount: res.data,
          
        })
      }
    })
  }

  updateList = (leave) => {
    this.hideLeaveAction();
    this.hideForm();
     setTimeout(function () {
      window.location.reload()
   }, 2000)
  }
  hideForm = () => {
    this.setState({
      showForm: false,
      leave: undefined
    })
  }

  // view hide
  hideViewForm = () => {
    this.setState({
      showViewForm: false,
      leave: undefined
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
  onTableDataChange = (d, filter, sorter) => {
    this.setState({
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
    }, () => {
      this.fetchList();
    })
  }
  hideLeaveAction = () => {
    this.setState({
      showLeaveAction: false,
      leave: undefined
    })
  }
  showAlert = (status) => {
    if (status === 'APPROVED') {
      this.setState({
        alertMsg: 'Approved!',
        imgTag: successimg,
        showAlert: true
      });
    } else if (status === 'REJECTED') {
      this.setState({
        alertMsg: 'Rejected!',
        imgTag: reject,
        showAlert: true
      });
    } else if (status === 'submit') {
      this.setState({
        alertMsg: 'Submited!',
        imgTag: checkimg,
        showAlert: true
      });
    }

    setTimeout(() => {
      this.setState({ showAlert: false });
    }, 3000);
  }
  delete = (data) => {
    confirmAlert({
      title: `Delete Leave`,
      message: 'Are you sure, you want to delete this Leave?',
      buttons: [
        {
          className: "btn btn-danger",
          label: 'Yes',
          onClick: () => deleteLeave(data.id).then(res => {
            if (res.status == "OK") {
              toast.success(res.message);
              this.fetchList();
            } else {
              toast.error(res.message)
            }
          })
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  }
  updateSelf = () => {

    this.setState({
      self: this.state.self == 1 ? 0 : 1
    }, () => {
      this.fetchList();
    })
  }
  updateStatus = (selected, status) => {
    updateSelectedStatus(selected, status).then(res => {
      if (res.status == "OK") {
        toast.success(res.message);
        window.location.reload();
      } else {
        toast.error(res.message);
      }
    })
  }
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
                if (!d.approvalStatus) {
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

  handleButtonClick = () => {
    this.setState((prevState) => ({
      buttonState: !prevState.buttonState,
      preferredMethod: prevState.buttonState ? 'Self' : 'Team'
    }));
  };

  getStyle(text) {
    if (text === 'REQUESTED') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Requested</span>;
    }
    if (text === 'CANCELED') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Canceled</span>;
    }
    if (text === 'APPROVED') {
      return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Approved</span>;
    }
    if (text === 'REJECTED') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Rejected</span>;
    }
    if (text === 'PENDING') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Pending</span>;
    }
    if (text === 2){
      return <span className='p-1 badge bg-inverse-success'>FH</span>;
    }
    if (text === 3){
      return <span className='p-1 badge bg-inverse-success'>SH</span>;
    }
    return ' ';
  }
  render() {
    const { buttonState, preferredMethod, data, totalPages, totalRecords, currentPage, size, selected } = this.state

    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const menuItems = (text, record) => {
      const items = [];
      if (verifyApprovalPermission("LEAVE") && this.state.self != 1 && ((!text.approvalStatus && text.status != "REJECTED" && text.status != "APPROVED" && !text.multiApprovalNextLevelStatus) || !this.state.leaveModuleValidation)) {
        items.push(<div> <a className="muiMenu_item" href="#" onClick={() => {
          let { leave } = this.state;
          leave = text;
          try {
            leave.startDate = leave.startDate.substr(0, 10);
            leave.endDate = leave.endDate.substr(0, 10);
          } catch (error) {
            console.error(error)
          }
          this.setState({ leave, showLeaveAction: true, showForm: false })
        }} >
          <i className="las la-check-double m-r-5"></i> Leave Action</a>
        </div>
        );
      }
      // view
      if (verifyEditPermission("LEAVE") && this.state.multiApproveValidation && this.state.leaveModuleValidation) {
        items.push(<div> <a className="muiMenu_item" href="#" onClick={() => {
          let { leave } = this.state;
          leave = text;
          
          this.setState({ leave, showLeaveAction: false, showForm: false,showViewForm: true })
        }} >
          <i className="fa fa-eye m-r-5" />View</a>
        </div>
        );
      }

      // view
      if (verifyEditPermission("LEAVE") && text.status != "APPROVED" && text.status != "REJECTED" && text.multiApprovalStatus <=1) {
        items.push(<div>
          <a className="muiMenu_item" href="#" onClick={() => {
            let { leave } = this.state;
            leave = text;
            try {
              leave.startDate = leave.startDate.substr(0, 10);
              leave.endDate = leave.endDate.substr(0, 10);
            } catch (error) {
              console.error(error)
            }
            this.setState({ leave, showForm: true })
          }} >
            <i className="fa fa-pencil m-r-5"></i> Edit</a>
        </div>
        );
      }
      if (verifyEditPermission("LEAVE") && text.status != "APPROVED" && text.status != "REJECTED" && text.multiApprovalStatus <=1) {
        items.push(<div>
          <a className="muiMenu_item" href="#" onClick={() => {
            this.delete(text);
          }}>
            <i className="fa fa-trash-o m-r-5"></i> Delete</a>
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
        title: 'Leave',
        dataIndex: 'leaveType.name',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{record.leaveType?.name}</div>
          </>
        }
      },
      {
        title: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>Start Date</span>
          {this.state.halfDayCount > 0 && <span style={{ paddingLeft: '8px' }}>
              <Tooltip title="FH = First Half; SH = Second Half">
                <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
              </Tooltip><br />
            </span>}
          </div>
        ),
        dataIndex: 'startDate',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{getReadableDate(record.startDate)} {this.getStyle(record.startDateDayType)}</div>
          </>
        }
      },
      {
        title: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>End Date</span>
            {this.state.halfDayCount > 0 &&    <span style={{ paddingLeft: '8px' }}>
            <Tooltip title="FH = First Half; SH = Second Half">
                <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
              </Tooltip><br />
            </span>}
          </div>
        ),
        dataIndex: 'endDate',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{getReadableDate(record.endDate)}  {this.getStyle(record.endDateDayType)}</div>
          </>
        }
      }, {
        title: 'Leave Count',
        dataIndex: 'totalDays',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{record.totalDays}</div>
          </>
        }
      },
      {
        title: 'Reason',
        dataIndex: 'leaveReason',
        sorter: true,
        className: 'pre-wrap',
        render: (text, record) => {
          return <>
            <div>{record.leaveReason}</div>
          </>
        }
      },
      {
        title: 'Attachment',
        sorter: true,
        width: 50,
        render: (text, record) => {
          return <> {text.attachment && <Anchor style={{color: 'black'}} onClick={() => {
            fileDownload(text.id, text.employee.id, "LEAVE_DOCUMENT", text.attachment);
          }} title={text.attachment}>
            <i style={{color: '#45C56D'}} className='fa fa-download'></i> Download
          </Anchor>}
            {!text.attachment && <>-</>
            }
          </>
        }
      },   
      {
        title: 'Applied On',
        render: (text, record) => {
          return <>
            <div>{toLocalDateTime(text.createdDate)}</div>
          </>
        }
      },
      {
        title: 'Approved By',
        render: (text, record) => {
          return <>
            {text.approvedBy != null?<EmployeeListColumn
            id={text.approvedBy.id} name={text.approvedBy.name} employeeId={text.approverId}></EmployeeListColumn>:text.status == "APPROVED" || text.status== 'REJECTED'?"Admin":"-"}
          </>
        }
      },
      {
        title: 'Approved on',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{text.approvedOn != null?toLocalDateTime(text.approvedOn):"-"}</div>
          </>
        }
      },
      {
        title: 'Remarks',
        render: (text, record) => {
          return <>
            <div>{text.status == "REJECTED" && text.status != "undefined"?text.remark:"-"}</div>
          </>
        }
      },
      {
        title: 'Status',
        dataIndex: 'status',
        sorter: true,
        render: (text, record) => {
          return <div>{this.getStyle(record.status)}</div>
        }
      },
      {
        title: 'Action',
        width: 50,
        render: (text, record) => (
          <div>
            <Row>
              <Col md={4}>
                {verifyApprovalPermission("LEAVE") && <input
                  type="checkbox"
                  disabled={text.approvalStatus}
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
          </div>
        ),
      },
    ]
    if (this.state.multiApproveValidation && this.state.leaveModuleValidation) {
      const index = columns.length - 1;
      const value = {
        title: 'Approval Status',
        sorter: true,
        className: 'pre-wrap',
        render: (text, record) => {
          return <div>{text.status == "APPROVED" ? <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Approved</span> : text.status == "REJECTED" ? <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Rejected</span> : text.multiApprovalNextLevelStatus ? <span className='p-1 badge bg-inverse-warning' style={{ whiteSpace: "pre-wrap" }}><i className="pr-2 fa fa-hourglass-o text-warning"></i>Moved to next level</span> : text.status == "PENDING" ? <span className='p-1 badge bg-inverse-warning' style={{ whiteSpace: "pre-wrap" }}><i className="pr-2 fa fa-hourglass-o text-warning"></i>Waiting for approval level {text.multiApprovalStatus}</span> : "-"}</div>
        }
      }
      columns.splice(index, 0, value);


    }
    return (
      <>
        {this.state.showAlert && (
          <SuccessAlert
            headText={this.state.alertMsg}
            img={this.state.imgTag}
          />
        )}
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div id='page-head' >


            <div className="float-right col-md-6 btn-group btn-group-sm">
              {/* {verifyViewPermissionForTeam("LEAVE") && !isCompanyAdmin && <>
                <div class="btn-group btn-cust-group" role="group" aria-label="Basic example">
                  {verifySelfViewPermission("LEAVE") && <button  type="button" className={this.state.self == 1 ? 'btn btn-sm btn-success btn-selected self-btn' : 'btn btn-sm btn-secondary'} onClick={e => {
                    this.updateSelf()
                  }} > Self </button>}

                  <button  type="button" className={this.state.self != 1 ? 'btn btn-sm btn-primary btn-selected' : 'btn btn-sm btn-secondary'} onClick={e => {
                    verifySelfViewPermission("LEAVE") && this.updateSelf()
                  }} > Team </button>
                </div>
              </>} */}

              {verifyViewPermissionForTeam("LEAVE") && !isCompanyAdmin && <div className="mr-2">
                <div onClick={e => {
                  this.updateSelf()
                  this.handleButtonClick()
                }} className="toggles-btn-view" id="button-container" >

                  <div id="my-button" className="toggle-button-element" style={{ transform: buttonState ? 'translateX(0px)' : 'translateX(80px)' }}>
                    <p className='m-0 self-btn'>{buttonState ? 'Self' : 'Team'}</p>

                  </div>
                  <p className='m-0 team-btn' style={{ transform: buttonState ? 'translateX(0px)' : 'translateX(-80px)' }}>{buttonState ? 'Team' : 'Self'}</p>
                </div>

              </div>}


              {verifyEditPermission("LEAVE") && <button className="apply-button btn-primary mr-2" onClick={() => {
                this.setState({
                  showForm: true
                })
              }}><i className="fa fa-plus" /> Apply</button>}
              {verifyViewPermission("LEAVE") && <BsSliders className='filter-btn' size={30} onClick={() => this.setState({ showFilter: !this.state.showFilter })} />}
            </div>

          </div>
          {this.state.showFilter && <div className='mt-4 filterCard p-3'>
            {verifyViewPermissionForTeam("LEAVE") && <div className="row">
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
            <div className="row">
              <div className="col-md-3">
                <div className="form-group form-focus">
                  <input onChange={e => {
                    this.setState({
                      q: e.target.value,
                      page:0
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
          <div className='Table-card'>
            <div className="tableCard-body">

              {verifyViewPermission("LEAVE") && <div className=" p-12 m-0">
                <div className="row " >
                  <div className="mt-3 col">
                    <h3 className="page-titleText">Leave List</h3>
                  </div>

                  <div className='col-md-auto'  >
                    {verifyApprovalPermission("LEAVE") && data && data.length > 0 && <ButtonGroup className='pull-right my-3'>
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
              </div>}
              {/* /Page Header */}
              <div className="tableCard-container row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    {verifyViewPermission("LEAVE") && <Table id='Table-style' className="table-striped "
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
                    {!verifyViewPermission("LEAVE") && <AccessDenied></AccessDenied>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
          <Header closeButton>
            <h5 className="modal-title">{this.state.leave ? 'Edit' : 'Apply'} Leave</h5>
          </Header>
          <Body>
            <LeaveForm showAlert={this.showAlert} updateList={this.updateList} leave={this.state.leave} employeeId={this.state.employeeId}>
            </LeaveForm>
          </Body>
        </Modal>
        <Modal enforceFocus={false} size={"md"} show={this.state.showLeaveAction && verifyApprovalPermission("LEAVE") && this.state.self != 1} onHide={this.hideLeaveAction} >
          <Header closeButton>
            <h5 className="modal-title">Leave Action</h5>
          </Header>
          <Body>
            <LeaveAction showAlert={this.showAlert} updateList={this.updateList} leave={this.state.leave} employeeId={this.state.employeeId}>
            </LeaveAction>
          </Body>
        </Modal>
        {/* view */}
        <Modal enforceFocus={false} size={"xl"} show={this.state.showViewForm} onHide={this.hideViewForm} >
          <Header closeButton>
            <h5 className="modal-title">Leave Details</h5>
          </Header>
          <Body>
            <LeaveViewForm  leave={this.state.leave}></LeaveViewForm>
          </Body>
        </Modal>
      </>
    );
  }
}