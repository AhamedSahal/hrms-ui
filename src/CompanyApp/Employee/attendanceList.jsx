import { Table, Calendar, Badge } from 'antd';
import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import AccessDenied from '../../MainPage/Main/Dashboard/AccessDenied';
import { itemRender } from '../../paginationfunction';
import { getTitle, getUserType, toLocalTime, verifyViewPermission, verifyApprovalPermission, verifyViewPermissionForTeam, getEmployeeId, getReadableDate, convertToUserTimeZone } from '../../utility';
import BranchDropdown from '../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../ModuleSetup/Dropdown/DepartmentDropdown';
import AttendanceForm from './attendanceForm';
import EmployeeListColumn from './employeeListColumn';
import LocationListColumn from './locationListColumn';
import { getEmployeeAttendanceList, getEmployeeCalender,getOvertimeActive } from './service';
import { getEmployeeDashboardDetail } from '../../MainPage/Main/Dashboard/service';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FormGroup } from 'reactstrap';
import EmployeeDropdown from '../ModuleSetup/Dropdown/EmployeeDropdown';
import { getPermission } from '../../utility';
import moment from 'moment';
import './attendanceList.css';
import { getList } from '../ModuleSetup/Regularization/service.jsx';
import { BsSliders } from 'react-icons/bs';
import JobTitlesDropdown from '../ModuleSetup/Dropdown/JobTitlesDropdown';
import RegularizationLanding from './regularization/index.jsx';
import OvertimeApproval from '../Payroll/Overtime';
import EmployeeAttendanceModule from './AttendanceModule/index.jsx';
const { Header, Body, Footer, Dialog } = Modal;
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class EmployeeAttendanceList extends Component {
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
      fromDate: isCompanyAdmin?today.toISOString().split('T')[0]:firstDay.toISOString().split('T')[0],
      toDate: isCompanyAdmin?today.toISOString().split('T')[0]:lastDay.toISOString().split('T')[0],
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
      RegularizationSettings: false,
      overtimeEnable: false,
      isChecked: true
    };
  }
  updateSelf = () => {
   let today = new Date();
    this.setState({
      fromDate: this.state.self == 0?(new Date(today.getFullYear(), today.getMonth(), 2)).toISOString().split('T')[0]:(new Date()).toISOString().split('T')[0],
      toDate:this.state.self == 0?(new Date(today.getFullYear(), today.getMonth() + 1, 1)).toISOString().split('T')[0]:(new Date()).toISOString().split('T')[0],
      self: this.state.self == 1 ? 0 : 1,
      currentPage: 1,
      page: 0
    }, () => {
      this.fetchList();

    })
  }
  componentDidMount() {
    this.fetchList();
    this.fetchListData();
    this.getEmployeeDashList();
    if (this.state.self == 1) {
      this.fetchCalender();
    }
    if (this.props?.location?.teamPermission && !isCompanyAdmin) {
      this.updateSelf();
    }
  }

  fetchListData = () => {
  
  // regularization validation
    getList().then(res => {
        if (res.status == "OK") {
           this.setState({RegularizationSettings: res.data.regularizationEnabled})
        }
    })

    // overtime

    getOvertimeActive().then(res => {
      if (res.status == "OK") {
         this.setState({overtimeEnable: res.data})
      }
  })
    

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
  fetchCalender = (date) => {
    if (verifyViewPermission("ATTENDANCE")) {
      var empId = this.state.employeeId;
      let { calenderDate } = this.state;
      if (date) {
        calenderDate = new Date(date);
      }
      else if (!calenderDate) {
        calenderDate = new Date();
      }
      this.setState({
        calenderDate
      })
      var year = calenderDate.getFullYear();
      var month = calenderDate.getMonth();
      var firstDayOfMonth = moment([year, month, 1]);
      firstDayOfMonth = firstDayOfMonth.format('YYYY-MM-DD');
      if (this.state.self == 1) {
        empId = getEmployeeId()
      }
      empId > 0 && getEmployeeCalender(empId, firstDayOfMonth).then(res => {
        if (res.status == "OK") {
          this.setState({
            calenderData: res.data ? res.data : [],
            employeeId: empId,
          })
        }
      })
    }
  }
  getEmployeeDashList = () => {
    getEmployeeDashboardDetail(new Date().toISOString().substring(0, 16)).then(res => {
      this.setState({ dashboard: res.data });
    });
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
  handleNewUpdates = () => {
    this.setState({ isChecked: !this.state.isChecked });
  };
  handleButtonClick = () => {
    this.setState((prevState) => ({
      buttonState: !prevState.buttonState,
      preferredMethod: prevState.buttonState ? 'Self' : 'Team'
    }));
  };
  dateCellRender = (date) => {

    const selectedData = this.state.calenderData.find((item) => {
      return item.calenderDate === date.format('YYYY-MM-DD');
    });

    return (
      <div>
        {selectedData && (
          <div>
            {selectedData.inTime && <span className="badge bg-info text-dark" style={{ width: '100%', height: '20px', fontSize: '12px' }}>In Time: {convertToUserTimeZone(selectedData.inTime)}</span>} <br />
            {selectedData.outTime && <span className="badge bg-info text-dark" style={{ width: '100%', height: '20px', fontSize: '12px' }}>Out Time: {convertToUserTimeZone(selectedData.outTime)}</span>} <br />
            <span className={selectedData.typeOfDay == 'Present' ? "badge bg-present" :
              selectedData.typeOfDay == 'Holiday' ? "badge bg-holiday" :
                selectedData.typeOfDay == 'Weekoff' ? "badge bg-week-off" :
                  selectedData.typeOfDay == 'Leave' ? "badge bg-leave" :
                    selectedData.typeOfDay == 'Halfday' ? "badge bg-half-day" : "badge bg-absent"}
              style={{ width: '100%', height: '20px', fontSize: '12px' }}>{selectedData.typeOfDay}</span>
          </div>
        )}
      </div>
    );
  };

  render() {
    console.log("cell state", this.props)
    const { data,isChecked , totalRecords, currentPage, size, buttonState, } = this.state
    const dashboardOvertime = this.props?.location?.fromDashboardOvertime;
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    let columns = [
      {
        title: 'Employee',
        sorter: false,
        render: (text, record) => {
          return <EmployeeListColumn id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
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
        title: 'Clock In',
        sorter: false,
        render: (text, record) => {
          return <div>
            {text.clockInSource === "WEB" && <i className="fa fa-desktop" aria-hidden="true" title="WEB" style={{fontSize:'15px'}}></i>}
            {text.clockInSource === "ANDROID" && <i className="fa fa-android" title="ANDROID" style={{fontSize:'20px'}}></i>}
            {text.clockInSource === "IOS" && <i className='fa fa-apple' title="IOS" style={{fontSize:'18px'}}></i>}
            {text.clockInSource === "SYSTEM" && <i className='fa fa-clock-o' title="AUTO CLOCK IN" style={{fontSize:'18px'}}></i>}
            {text.clockInSource === "MANUAL" && <i className='fa fa-user-plus' aria-hidden="true" title="MANUAL" style={{fontSize:'18px'}}></i>}
            {text.clockInSource === "BULK_UPLOAD" && <i className='fa fa-cloud-upload' aria-hidden="true" title="BULK UPLOAD" style={{fontSize:'18px'}}></i>}
            {text.clockInSource === "REGULARIZATION" && <i className='fa fa-history' aria-hidden="true" title="REGULARIZATION" style={{fontSize:'18px'}}></i>}
            &nbsp;&nbsp; {convertToUserTimeZone(text.actualClockIn)} 
          </div>
        }
      },
      {
        title: 'Clock Out',
        sorter: true,
        render: (text, record) => {
          return <div>
            {text.clockOutSource === "WEB" && <i className="fa fa-desktop" aria-hidden="true" title="WEB" style={{fontSize:'15px'}}></i>}
            {text.clockOutSource === "ANDROID" && <i className="fa fa-android" title="ANDROID" style={{fontSize:'20px'}}></i>}
            {text.clockOutSource === "IOS" && <i className='fa fa-apple' title="IOS" style={{fontSize:'18px'}}></i>}
            {text.clockOutSource === "SYSTEM" && <i className='fa fa-clock-o' title="AUTO CLOCK OUT" style={{fontSize:'18px'}}></i>}
            {text.clockOutSource === "MANUAL" && <i className='fa fa-user-plus' aria-hidden="true" title="MANUAL" style={{fontSize:'18px'}}></i>}
            {text.clockOutSource === "BULK_UPLOAD" && <i className='fa fa-cloud-upload' aria-hidden="true" title="BULK UPLOAD" style={{fontSize:'18px'}}></i>}
            {text.clockOutSource === "REGULARIZATION" && <i className='fa fa-history' aria-hidden="true" title="REGULARIZATION" style={{fontSize:'18px'}}></i>}
            &nbsp;&nbsp; <span>{text.actualClockOut ? convertToUserTimeZone(text.actualClockOut) : '-'} </span>
          </div>
        }
      },
      
      {
        title: 'Actual Hours',
        render: (text, record) => {
          return <>
            <span>{record.actualHoursDisplay}</span>
          </>
        }
      },
      {
        title: 'Action',
        align: 'center',
        render: (text, record) => {
          return <LocationListColumn location={text.location} locationOut={text.locationOut} clockInIp={text.clockInIp} clockOutIp={text.clockOutIp}id={text.id}></LocationListColumn>
        }
      }
    ];
    return (
      <>
        <div className='tempBtn' >
          <span onClick={this.handleNewUpdates}>New</span>
        </div>
        
       {!isChecked ? <EmployeeAttendanceModule /> : <div className="page-wrapper">
          <Helmet>
            <title>Employee Attendance | {getTitle()}</title>
            <meta name="description" content="Attendance" />
          </Helmet>
          <div className="mt-4 content container-fluid">
            <div className="tab-content">
              <div className="subMenu_box row user-tabs">
                <div className="nav-box">
                  <div className="page-headerTab">
                    <h3 style={{ color: 'white' }} className="page-title">Employee Attendance</h3>
                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                      <ul className="nav nav-items">
                        {(verifyViewPermission("ATTENDANCE") || verifyApprovalPermission("ATTENDANCE")) && <li className="nav-item"><a href="#divList" data-toggle="tab" className={!dashboardOvertime ? "nav-link active" : "nav-link"}>Attendance List</a></li>}
                        {verifyApprovalPermission("ATTENDANCE") && <li className="nav-item"><a href="#divCalendar" data-toggle="tab" className="nav-link">Attendance Calender</a></li>}
                        {(isCompanyAdmin || this.state.overtimeEnable) && (verifyViewPermission("ATTENDANCE") || verifyApprovalPermission("ATTENDANCE")) && this.state.overtimeEnable && <li className="nav-item"><a href="#divOvertime" data-toggle="tab" className={dashboardOvertime ? "nav-link active" : "nav-link"}>Overtime</a></li>}
			                  {(verifyViewPermission("ATTENDANCE") || verifyApprovalPermission("ATTENDANCE")) && this.state.RegularizationSettings && <li className="nav-item"><a href="#divRegularization" data-toggle="tab" className="nav-link">Regularization</a></li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div id="divCalendar" className="pro-overview ant-table-background tab-pane fade  attendanceBadge">
                {verifyViewPermissionForTeam("ATTENDANCE") && this.state.self == 0 && <div className="row">
                  <div className="col-md-4">
                    <label>Employee
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <EmployeeDropdown onChange={e => {
                      this.setState({
                        employeeId: e.target.value
                      }, () => {
                        this.fetchCalender();
                      })

                    }} permission={getPermission("Payroll Pay Variance", "VIEW")} ></EmployeeDropdown>
                  </div>
                  <div className="col-md-8 mt-3">
                    <div className="row chart-list">
                      <div className="col-md-2">
                        <span className="badge bg-present p-2">Present</span>
                      </div>
                      <div className="col-md-2">
                        <span className="badge bg-absent p-2">Absent</span>
                      </div>
                      <div className="col-md-2">
                        <span className="badge bg-leave p-2">Leave</span>
                      </div>
                      <div className="col-md-2">
                        <span className="badge bg-week-off text-dark p-2">WeekOff</span>
                      </div>
                      <div className="col-md-2">
                        <span className="badge bg-holiday text-dark p-2">Holiday</span>
                      </div>
                      <div className="col-md-2">
                        <span className="badge bg-half-day text-dark p-2">Half Day</span>
                      </div>
                    </div>
                  </div>
                </div>}

                <div className="row">
                  <div className="col-md-12">
                    <Calendar mode='month' dateCellRender={this.dateCellRender} onChange={this.fetchCalender} />
                  </div>
                </div>
              </div>
              <div id="divList" className={!dashboardOvertime ? "pro-overview insidePageDiv tab-pane fade show active" : "pro-overview insidePageDiv tab-pane fade"}>
                <div id='page-head' >
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <ul hidden className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                        <li className="breadcrumb-item active">Employee Attendance</li>
                      </ul>
                    </div>
                    <div className="col-md-4 btn-group btn-group-sm text-right">
                      {verifyViewPermissionForTeam("ATTENDANCE") && !isCompanyAdmin && <div className="mr-2">
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

                      {verifyApprovalPermission("ATTENDANCE") && <button className="apply-button btn-primary mr-2" onClick={() => {
                        this.setState({
                          showForm: true
                        })
                      }}><i className="fa fa-plus" /> Add</button>}

                      {verifyViewPermission("ATTENDANCE") &&
                        <BsSliders className='filter-btn' size={30} onClick={() => this.setState({ showFilter: !this.state.showFilter })} />}
                    </div>
                  </div>
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
                < div className='mt-1 Table-card' >
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

                          {verifyViewPermission("ATTENDANCE") && <Table id='Table-style' className="table-striped "
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
                          />}   {!verifyViewPermission("ATTENDANCE") && <AccessDenied></AccessDenied>}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div id="divOvertime" className={dashboardOvertime ? "pro-overview insidePageDiv tab-pane fade show active" : "pro-overview insidePageDiv tab-pane fade"}>
                {verifyViewPermission("ATTENDANCE") && this.state.overtimeEnable && <OvertimeApproval />}

              </div>
              <div id="divRegularization" className="pro-overview tab-pane  insidePageDiv fade">
                {verifyViewPermission("ATTENDANCE") && <RegularizationLanding />}

              </div>
            </div>
          </div>
        </div>
}        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
          <Header closeButton>
            <h5 className="modal-title">Add Attendance </h5>
          </Header>
          <Body>
            {<AttendanceForm updateList={this.updateList} leave={this.state.leave} employeeId={this.state.employeeId}>
            </AttendanceForm>}
          </Body>
        </Modal>
      </>
    );
  }
}
