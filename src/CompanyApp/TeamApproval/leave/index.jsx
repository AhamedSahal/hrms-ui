import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal, Col, Row, ButtonGroup } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { itemRender } from '../../../paginationfunction';
import { getReadableDate, getTitle,toLocalDateTime } from '../../../utility';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import LeaveAction from '../../Employee/leave/leaveAction';
import { getTeamLeaveList, updateSelectedStatus } from './service';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import JobTitlesDropdown from '../../ModuleSetup/Dropdown/JobTitlesDropdown';
import DepartmentDropdown from '../../ModuleSetup/Dropdown/DepartmentDropdown';
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import { BsFillInfoCircleFill,BsSliders } from 'react-icons/bs';
import SuccessAlert from '../../../MainPage/successToast';
import successimg from '../../../assets/img/successimg.gif';
import reject from '../../../assets/img/rejectimg.gif';
import checkimg from '../../../assets/img/tickmarkimg.gif';
import { Tooltip } from 'antd';
import { getHalfdayCount } from '../../ModuleSetup/LeaveType/service';

const { Header, Body, Footer, Dialog } = Modal;


export default class LeaveApproval extends Component {
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
      designationId: "",
      fromDate: firstDay.toISOString().split('T')[0],
      toDate: lastDay.toISOString().split('T')[0],
      page: 0,
      size: 10,
      sort: "leaveStatus,asc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      selected: [],
      showFilter: false,
      showAlert: false,
      alertMsg: '',
      imgTag: '',
      halfDayCount: 0

    };
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    getTeamLeaveList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.fromDate, this.state.toDate, this.state.branchId, this.state.departmentId, this.state.jobTitleId).then(res => {

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

     // halfday check
     getHalfdayCount().then(res => {
      if (res.status === 'OK') {
        
        this.setState({
          halfDayCount: res.data,
          
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
  updateList = (leave) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == leave.id);
    if (index > -1)
      data[index] = leave;
    else {
      data.push(leave);
    }
    this.setState({ data },
      () => {
        this.hideLeaveAction();
      });
  }


  hideLeaveAction = () => {
    this.setState({
      showLeaveAction: false,
      leave: undefined
    })
  }

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
  pageSizeChange = (currentPage, pageSize) => {
    this.setState({
      size: pageSize,
      page: 0
    }, () => {
      this.fetchList();

    })

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
              let selected = data.map(d => d.id);
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

  getStyle(text) {
    if (text === 2){
      return <span className='p-1 badge bg-inverse-success'>FH</span>;
    }
    if (text === 3){
      return <span className='p-1 badge bg-inverse-success'>SH</span>;
    }
    return ' ';
  }

  render() {
    const { data, totalPages, totalRecords, currentPage, size, selected } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const columns = [
      {
        title: 'Employee',
        render: (text, record) => {
          return <EmployeeListColumn id={text.employee.id} name={text.employee.name} employeeId={text.employeeId} ></EmployeeListColumn>
        },
        sorter: false,
      },
      {
        title: 'Leave',
        dataIndex: 'leaveType.name',
        sorter: (a, b) => {
          const nameA = a.leaveType?.name || '';
          const nameB = b.leaveType?.name || '';
          return nameA.localeCompare(nameB);
        },
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
        render: (text, record) => {
          return <>
            <div>{getReadableDate(record.endDate)}  {this.getStyle(record.endDateDayType)}</div>
          </>
        }
      },
      {
        title: 'Reason',
        dataIndex: 'leaveReason',
        render: (text, record) => {
          return <>
            <div>{record.leaveReason}</div>
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
        render: (text, record) => {
          return <>
            <div>{text.approvedOn != null?toLocalDateTime(text.approvedOn):"-"}</div>
          </>
        }
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: (text, record) => {
          return <>
            <div>{record.status}</div>
          </>
        }
      },
      {
        title: 'Action',
        width: 50,
        render: (text, record) => (
          <Row>
            <Col md={4}>
              {<input
                type="checkbox"
                checked={selected && selected.length > 0 && selected.indexOf(record.id) > -1}
                className="pointer"
                onClick={e => {
                  this.onSelect(record);
                }}></input>}
            </Col>
            <Col md={8}>
              <div className="dropdow">
                <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                  <i className="las la-bars"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right">
                  <a className="dropdown-item" href="#" onClick={() => {
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
              </div>
            </Col>
          </Row>
        ),
      },
    ]
    return (
      <>
      {this.state.showAlert && (
          <SuccessAlert
            headText={this.state.alertMsg}
            img={this.state.imgTag}
          />
        )}
        <div className="content container-fluid" >
          < div id='page-head' >
          <div className="float-right col-md-5 btn-group btn-group-sm">
              <BsSliders className='filter-btn' size={30} onClick={() => this.setState({ showFilter: !this.state.showFilter })} />
            </div>
          </div>
            {this.state.showFilter && 
            <div className='mt-4 filterCard p-3'>
              <div className="row">
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
              </div>
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
            </div>
            }
      <div className="">
        <Helmet>
          <title>Leave  | {getTitle()}</title>
          <meta name="description" content="Team Leave Approval" />
        </Helmet>
        {/* Page Content */}
          {/* Page Header */}
          < div className='Table-card' >
              <div className="tableCard-body">
                <div className="row " >
                  <div className="mt-3 col">
                    <h3 className="page-titleText">Leave</h3>
                  </div>

                  <div className='col-md-auto'  >
                    {data && data.length > 0 && <ButtonGroup className='pull-right my-3'>
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


          <Modal enforceFocus={false} size={"md"} show={this.state.showLeaveAction} onHide={this.hideLeaveAction} >


            <Header closeButton>
              <h5 className="modal-title">Leave Action</h5>
            </Header>
            <Body>
              <LeaveAction showAlert={this.showAlert} updateList={this.updateList} leave={this.state.leave} employeeId={this.state.employeeId}>
              </LeaveAction>
            </Body>


          </Modal>
            </div>
        </div>
      </>
    );
  }
}
