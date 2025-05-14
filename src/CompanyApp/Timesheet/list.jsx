import { Table } from 'antd';
import React, { Component } from 'react';
import { Button, Modal, Col, Row, ButtonGroup } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { itemRender } from "../../paginationfunction";
import { getTitle, getUserType, verifyEditPermission, verifyViewPermission, verifyApprovalPermission, verifyViewPermissionForTeam, getReadableDate } from '../../utility';
import CreateTimesheetForm from './form';
import TimesheetAction from './timesheetAction';
import { deleteTimesheet, getTimesheet, updateSelectedStatus } from './service';
import EmployeeListColumn from '../Employee/employeeListColumn';
import BranchDropdown from '../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../ModuleSetup/Dropdown/DepartmentDropdown';
import DesignationDropdown from '../ModuleSetup/Dropdown/DesignationDropdown';
import AccessDenied from '../../MainPage/Main/Dashboard/AccessDenied';
import { BsSliders } from 'react-icons/bs';
import JobTitlesDropdown from '../ModuleSetup/Dropdown/JobTitlesDropdown';
import TableDropDown from '../../MainPage/tableDropDown';
import successimg from '../../assets/img/successimg.gif';
import checkimg from '../../assets/img/tickmarkimg.gif';
import reject from '../../assets/img/rejectimg.gif';
import SuccessAlert from '../../MainPage/successToast';

const { Header, Body, Footer, Dialog } = Modal;

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class Timesheet extends Component {
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
      showFilter: false,
      self: isCompanyAdmin ? 0 : 1,
      selected: [],
      showAlert: false,
      alertMsg: '',
      imgTag: '',
      desc: ' ',
      buttonState: true
    };
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    if (verifyViewPermission("TIMESHEET")) {
      getTimesheet(this.state.branchId, this.state.departmentId, this.state.jobTitleId, this.state.q, this.state.fromDate, this.state.toDate, this.state.page, this.state.size, this.state.sort, this.state.self).then(res => {

        if (res.status == "OK") {
          this.setState({
            data: res.data.list,
            totalPages: res.data.totalPages,
            totalRecords: res.data.totalRecords,
            currentPage: res.data.currentPage + 1
          })
        } else {
          this.setState({
            data: [],
            totalPages: 0,
            totalRecords: 0,
            currentPage: 0 + 1
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

  updateList = (timesheetObj) => {
    this.fetchList();
    let { data } = this.state;
    let index = data.findIndex(d => d.id == timesheetObj.id);
    if (index > -1)
      data[index] = timesheetObj;
    else {
      data = [timesheetObj, ...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
        this.fetchList();
      });
  }
  showAlert = (status) => {
    if (status === 'APPROVED') {
      this.setState({
        alertMsg: 'Approved!',
        imgTag: successimg,
        desc: 'Timesheet approved successfully',
        showAlert: true
      });
    } else if (status === 'REJECTED') {
      this.setState({
        alertMsg: 'Rejected!',
        imgTag: reject,
        desc: 'Timesheet rejected successfully',
        showAlert: true
      });
    } else if (status === 'submit') {
      this.setState({
        alertMsg: 'Submited!',
        imgTag: checkimg,
        desc: 'Timesheet submited successfully',
        showAlert: true
      });
    } else { }

    setTimeout(() => {
      this.setState({ showAlert: false });
    }, 3000);
  }
  pageSizeChange = (currentPage, pageSize) => {
    this.setState({
      size: pageSize,
      page: 0
    }, () => {
      this.fetchList();

    })

  }
  hideForm = () => {
    this.setState({
      showForm: false,
      showTimesheetAction: false,
      timesheet: undefined
    })
  }
  updateSelf = () => {
    this.setState({
      self: this.state.self == 1 ? 0 : 1
    }, () => {
      this.fetchList();
    })
  }
  hideTimesheetAction = () => {
    this.setState({
      showTimesheetAction: false,
      timesheet: undefined
    })
  }
  delete = (timesheet) => {
    confirmAlert({
      title: `Delete Timesheet`,
      message: 'Are you sure, you want to delete this timesheet?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteTimesheet(timesheet.id).then(res => {
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
  updateStatus = (selected, status) => {
    updateSelectedStatus(selected, status).then(res => {
      if (res.status == "OK") {
        this.showAlert(status)
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
    return 'black';
  }
  render() {
    const { data, totalPages, totalRecords, currentPage, size, selected, buttonState } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const menuItems = (timesheetObj, record) => {
      const items = [];

      if (verifyApprovalPermission("TIMESHEET") && this.state.self != 1) {
        items.push(
          <div>
            <a className="muiMenu_item" href="#" onClick={() => {
              let { timesheet } = this.state;
              timesheet = timesheetObj;
              this.setState({ timesheet, showTimesheetAction: true, showForm: false })
            }} >
              <i className="las la-check-double m-r-5"></i>Timesheet Action</a>
          </div>
        );
      }
      if (timesheetObj.approvalStatus == "PENDING" && verifyEditPermission("TIMESHEET")) {
        items.push(<div>
          <a className="muiMenu_item" href="#" onClick={() => {
            let { timesheet } = this.state;
            timesheet = timesheetObj;
            this.setState({ timesheet, showForm: true })
          }} >
            <i className="fa fa-pencil m-r-5"></i> Edit</a>

        </div>
        );
        items.push(<div>  <a className="muiMenu_item" href="#" onClick={() => {
          this.delete(timesheetObj);
        }}>
          <i className="fa fa-trash-o m-r-5"></i> Delete</a>
        </div>
        )
      }
      return items;
    };
    const columns = [
      {
        title: 'Employee',
        sorter: false,
        render: (text, record) => {
          return <EmployeeListColumn id={text.employeeId} name={text.employeeName} employeeId={text.empId} ></EmployeeListColumn>
        }
      },
      {
        title: 'Date',
        dataIndex: 'date',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{getReadableDate(text)}</div>
          </>
        }
      },
      {
        title: 'Project',
        dataIndex: 'projectName',
        sorter: false,
      },
      {
        title: 'Activity',
        dataIndex: 'activityName',
        className: 'pre-wrap',
        sorter: false,
      },
      {
        title: 'Hours',
        dataIndex: 'hours',
        sorter: false,
      },
      {
        title: 'Approved Hours',
        dataIndex: 'approvedHours',
        sorter: false,
      },
      {
        title: 'Status',
        dataIndex: 'approvalStatus',
        sorter: true,

        render: (text, record) => {
          return <><div >{this.getStyle(text)}</div>
          </>
        }
      },
      {
        title: 'Description',
        dataIndex: 'description',
        className: 'pre-wrap',
      },
      {
        title: 'Action',
        width: 50,
        render: (timesheetObj, record) => (
          <Row>
            <Col md={4}>
              {verifyApprovalPermission("TIMESHEET") && <input
                type="checkbox"
                checked={selected && selected.length > 0 && selected.indexOf(record.id) > -1}
                className="pointer"
                onClick={e => {
                  this.onSelect(record);
                }}></input>}
            </Col>
            <Col md={8}>
              <div className="">
                <TableDropDown menuItems={menuItems(timesheetObj, record)} />
              </div>

            </Col>
          </Row>
        ),
      },
    ]
    return (
      <div className="page-wrapper">
        {this.state.showAlert && (
          <SuccessAlert
            headText={this.state.alertMsg}
            desc={this.state.desc}
            img={this.state.imgTag}
          />
        )}
        <Helmet>
          <title>Timesheet | {getTitle()}</title>
          <meta name="description" content="Timesheet page" />
        </Helmet>
        {/* Page Content */}
        < div className="pr-5 pl-5 content container-fluid" >
          {/* Page Header */}
          < div id='page-head' >


            <div className="float-right col-md-5 btn-group btn-group-sm">

              {/* {verifyViewPermissionForTeam("TIMESHEET") && !isCompanyAdmin && <>
                <div class="btn-group btn-cust-group" role="group" aria-label="Basic example">
                  <button type="button" className={this.state.self == 1 ? ' btn btn-sm btn-success btn-selected self-btn' : 'btn btn-sm btn-secondary'} onClick={e => {
                    this.updateSelf()
                  }} > Self </button>

                  <button type="button" className={this.state.self != 1 ? ' btn btn-sm btn-primary btn-selected' : 'btn btn-sm btn-secondary'} onClick={e => {
                    this.updateSelf()
                  }} > Team </button>
                </div>
              </>} */}
              {verifyViewPermissionForTeam("TIMESHEET") && !isCompanyAdmin && <div className="mr-2">
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
              {verifyEditPermission("TIMESHEET") && <button className="apply-button btn-primary mr-2" onClick={() => {
                this.setState({
                  showForm: true
                })

              }}><i className="fa fa-plus" /> Create</button>}
              {verifyViewPermission("TIMESHEET") &&
                <BsSliders className='filter-btn' size={30} onClick={() => this.setState({ showFilter: !this.state.showFilter })} />}
            </div>

            {
              this.state.showFilter && <div className='mt-5 filterCard p-3'>
                {verifyViewPermissionForTeam("TIMESHEET") && <div className="row">
                  <div className="col-md-4">
                    <div className="form-group form-focus">
                      <BranchDropdown defaultValue={this.state.branchId} onChange={e => {
                        this.setState({
                          branchId: e.target.value
                        })
                      }}></BranchDropdown>
                      <label className="focus-label">Branch</label>
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
              </div>
            }
            < div className='mt-5 Table-card' >
              <div className="tableCard-body">
                {verifyViewPermission("TIMESHEET") && <div className="form-group p-12 m-0 pb-2">
                  <div className="row " >
                    <div className="mt-3 col">
                      <h3 className="page-titleText">Timesheet</h3>
                    </div>

                    <div className='col-md-auto'  >
                      {verifyApprovalPermission("TIMESHEET") && data && data.length > 0 && <ButtonGroup className='pull-right my-3'>
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
                      {verifyViewPermission("TIMESHEET") && <Table id='Table-style' className="table-striped "

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
                      {!verifyViewPermission("TIMESHEET") && <AccessDenied></AccessDenied>}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>





          {/* /Page Content */}

          <Modal className='fullWidth' enforceFocus={false} size={"xl"} show={this.state.showForm} onHide={this.hideForm} >
            <Header closeButton>
              <h5 className="modal-title">{this.state.timesheet ? 'Edit' : 'Add'} Timesheet</h5>
            </Header>
            <Body>
              <CreateTimesheetForm showAlert={this.showAlert} updateList={this.updateList} self={this.state.self} timesheet={this.state.timesheet}>
              </CreateTimesheetForm>
            </Body>
          </Modal>

          <Modal enforceFocus={false} size={"md"} show={this.state.showTimesheetAction && verifyApprovalPermission("TIMESHEET") && this.state.self != 1} onHide={this.hideTimesheetAction} >
            <Header closeButton>
              <h5 className="modal-title">Timesheet Action</h5>
            </Header>
            <Body>
              <TimesheetAction showAlert={this.showAlert} updateList={this.updateList} timesheet={this.state.timesheet} id={this.state.id}>
              </TimesheetAction>
            </Body>
          </Modal>
        </div>
      </div>
    );
  }
}
