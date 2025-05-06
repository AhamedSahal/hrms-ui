import { Table } from 'antd';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import EmployeeListColumn from '../../../Employee/employeeListColumn';
import { BsEyeFill, BsFillBookFill } from "react-icons/bs";

import { itemRender } from "../../../../paginationfunction";

import { getReadableDate, getTitle, getUserType, toLocalDateTime, verifyOrgLevelViewPermission, verifySelfViewPermission, verifyViewPermissionForTeam,getEmployeeId,getUserName } from '../../../../utility';

import DepartmentDropdown from '../../../ModuleSetup/Dropdown/DepartmentDropdown';
import BranchDropdown from '../../../ModuleSetup/Dropdown/BranchDropdown';
import TableDropdown from '../../../../MainPage/tableDropDown';
import JobTitlesDropdown from '../../../ModuleSetup/Dropdown/JobTitlesDropdown';
import AccessDenied from '../../../../MainPage/Main/Dashboard/AccessDenied';
import { BsSliders } from 'react-icons/bs';

import SuccessAlert from '../../../../MainPage/successToast';
import checkimg from '../../../../assets/img/tickmarkimg.gif'
import MeetingScheduleForm from './meetingScheduleForm';
import { getOneOnOneMeeting, updateStatus } from './service';
import EvaluvationForm from './evaluationForm';
import { toast } from 'react-toastify';
import EmployeePerformanceCommentForm from './EmployeePerformanceCommentForm';
import { deletePerformanceReview } from '../../Review/service';
import PerformanceReviewDetailsForm from '../../Review/detailsForm';


const { Header, Body, Footer, Dialog } = Modal;
export default class EmployeePerformance1on1MeetingModule extends Component {
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
      self: (getUserType()) == 'EMPLOYEE' && !verifyOrgLevelViewPermission("Performance Review") ? true : false,
      showFilter: false,
      msgAlert: false,
      alertMsg: '',
      imgTag: '',
      desc: '',
      showAlert: false,
      rescheduleId: 0,
      oneOnOneStatus: props.oneOnOneStatus || 0,
      showEmployeeCommentForm: false,
      meetingId: 0,
      showReviewForm: false
    };
  }
  componentDidMount() {
    if(this.props.oneOnOneStatus == 1 || this.state.oneOnOneStatus == 1){
      this.setState({meetingSchedule : {reviewer: getEmployeeId(),name:getUserName(),id:0,teamValidation: true}})
    }
    this.fetchList();
  }
  fetchList = () => {
    getOneOnOneMeeting(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.self, this.state.branchId, this.state.departmentId, this.state.jobTitleId, this.state.fromDate, this.state.toDate, this.state.oneOnOneStatus).then(res => {
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
  onTableDataChange = (d, filter, sorter) => {
    this.setState({
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
    }, () => {
      this.fetchList();
    })
  }

  // updated - meeting page
  updateList = () => {
    this.setState({ showForm: false, showEmployeeCommentForm: false, showEvaluationForm: false });
    this.fetchList()
  }

  // update status 
  updateStatus = (id, status) => {
    this.setState({ showEvaluationForm: false })
    if (status == "RESCHEDULE") {
      this.setState({ showForm: true, rescheduleId: id })
    } else {
      updateStatus(id, status).then(res => {
        if (res.status == "OK") {
          toast.success(res.message);
          this.fetchList()

        } else {
          toast.error(res.message);
        }

      }).catch(err => {
        console.error(err);
        toast.error("Error while updating status");
      })

    }


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
    if(this.props.oneOnOneStatus == 1 || this.state.oneOnOneStatus == 1){
      this.setState({meetingSchedule : {reviewer: getEmployeeId(),name:getUserName(),id:0,teamValidation: true}})
    }
    this.setState({
      showForm: false,
      showEvaluationForm: false,
      showEmployeeCommentForm: false,
      performanceTemplate: undefined,
     
    })
  }
  hideReviewForm = () => {
    this.setState({
      showReviewForm: false,
    })
  }
  updateSelf = () => {
    this.setState({ self: !this.state.self }, () => {
      this.fetchList();
    })
  }

  getStyle(text) {
    if (text === 'RESCHEDULE') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Rescheduled</span>;
    }
    if (text === 'CANCEL') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Cancel</span>;
    }
    if (text === 'COMPLETED') {
      return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Completed</span>;
    }
    if (text === 'PENDING') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Pending</span>;
    }
    return 'black';
  }

  getStyle1(text) {
    if (text == 3) {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Rescheduled</span>;
    }
    if (text == 2) {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Cancel</span>;
    }
    if (text == 1) {
      return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Completed</span>;
    }
    if (text == 0) {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Pending</span>;
    }
    return 'black';
  }

  getStyleReview(text) {
    if (text == 0) {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Draft</span>;
    }
  
    if (text == 1) {
      return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Completed</span>;
    }
    if (text == 2) {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Review Pending</span>;
    }
    return 'black';
  }

  showAlert = (status) => {
    if (status === 'submit') {
      this.setState({
        alertMsg: 'Submited!',
        imgTag: checkimg,
        desc: 'Submited successfully',
        showAlert: true
      });
    }

    setTimeout(() => {
      this.setState({ showAlert: false });
    }, 3000);
  }

  delete = (performanceReview) => {
      confirmAlert({
        title: `Delete Performance Review `,
        message: 'Are you sure, you want to delete this Performance Review?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => deletePerformanceReview(performanceReview.id).then(res => {
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

  render() {
    const isAdmin = (verifyOrgLevelViewPermission("Performance Review") || getUserType() == 'COMPANY_ADMIN');
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const menuItems = (text) => {
      const items = [];
      {/* edit */ }

      {
        this.state.oneOnOneStatus != 0 && (new Date().toISOString().split('.')[0] <= text.dateAndTime) && (text.status != "COMPLETED" && text.status != "CANCEL") && items.push(<div> <a className="muiMenu_item" href="#" onClick={() => {
          this.setState({ showForm: true, meetingSchedule: { ...text, reviewer: text.reviewer?.id, employeeId: text.employee?.id } })
        }} >
          <i className="fa fa-pencil m-r-5"></i> Edit</a></div>)
      }
      {/* view */ }
      items.push(<div> <a className="muiMenu_item" href="#" onClick={() => {
        this.props.updateList(text.id)
      }} >
        <i className="fa fa-eye m-r-5" aria-hidden="true"></i>  View</a></div>)
      {
        this.state.oneOnOneStatus != 0 && (text.status != "COMPLETED" && text.status != "CANCEL") && items.push(<div> <a className="muiMenu_item" href="#" onClick={() => {
          this.setState({ meetingInfo: text, showEvaluationForm: true })
        }} >
          <BsFillBookFill className="fa fa-pencil m-r-5" />  Evaluation</a> </div>)
      }

      {/* employee comment */ }
      {
        this.state.oneOnOneStatus == 0 && !text.employeeStatus && text.status == "COMPLETED" && items.push(<div> <a className="muiMenu_item" href="#" onClick={() => {
          this.setState({ meetingId: text.id, showEmployeeCommentForm: true })
        }} >
          <i className="las la-check-double m-r-5"></i>  Employee Comment</a> </div>)
      }

      return items;


    }


     const menuItems1 = (text) => [
          <div key="1">
            <Link
              className="muiMenu_item"
              state={{ empId: text.employeeId }}
              to={
                text.submited == 0
                  ? '#'
                  : `/app/company-app/performance/report/details/${text.id}`
                    
                  
              }
              onClick={() => {
                if (text.submited == 0) {
                  this.setState({ showReviewForm: true, reviewId: text.id });
                }
              }}
            >
              <i className="fa fa-eye m-r-5"></i> {text.submited == 1 ? 'Report' : 'View'}
            </Link>
          </div>,
          <div key="2">{text.deleteAlloweed && <a className="muiMenu_item" href="#" onClick={() => {
            this.delete(text);
          }}>
            <i className="fa fa-trash-o m-r-5"></i> Delete</a>}</div>,
        ]



//  my performance
  const columns1  = [
    {
      title: 'Review Type',
      sorter: false,
      dataIndex: 'reviewType',
    },
    {
      title: 'Title',
      sorter: false,
      dataIndex: 'title',
    },
    {
            title: 'Review Period',
            sorter: true,
            render: (text, record) => {
              return <>
                <div>{text.reviewPeriodFrom == '-'?'-':getReadableDate(text.reviewPeriodFrom)} to {text.reviewPeriodTo == '-'?'-':getReadableDate(text.reviewPeriodTo)}</div>
              </>
            }
          },
    {
      title: 'Date & Time',
      sorter: false,
      render: (text, record) => {
        return <>
          <div>{text.dateAndTime != '-'?toLocalDateTime(text.dateAndTime):'-'}</div>
        </>


      }
    },

    {
      title: 'Status',
      sorter: true,
      render: (text, record) => {
        return <>
          <div>{text.reviewType == '1 on 1 Review'?this.getStyle1(text.status):this.getStyleReview(text.status)}</div>
          {/* <div>{text.status == "PENDING"?"Pending":text.status == "COMPLETED"?"Completed":text.status == "CANCEL"?"Cancel":text.status == "RESCHEDULE"?"Rescheduled": "-"}</div> */}
        </>
      }
    },
    {
      title: 'Action',
      width: 50,
      className: "text-center",

      render: (text, record) => (
        <div className="">
          <TableDropdown menuItems={text.reviewType == '1 on 1 Review'?menuItems(text):menuItems1(text)} />
        </div>
      ),
    },
  ]


// team and org
  const columns = [
    {
      title: 'Title',
      sorter: false,
      dataIndex: 'title',
    },
    {
      title: 'Date & Time',
      sorter: false,
      render: (text, record) => {
        return <>
          <div>{toLocalDateTime(text.dateAndTime)}</div>
        </>


      }
    },

    {
      title: "Type Of Meeting",
      sorter: true,
      render: (text, record) => {
        return <>
          <div>{text.status != "COMPLETED" ? (text.meetingType == 0 ? "In-person" : text.meetingType == 1 ? "MS Teams" : text.meetingType == 2 ? "Zoom" : text.other) : "-"}</div>
        </>
      }
    },
    {
      title: 'Employee',
      sorter: true,
      render: (text, record) => {
        return <>
          <EmployeeListColumn id={text.employee.id} name={text.employee.name}  ></EmployeeListColumn>
        </>
      }
    },
    {
      title: 'Reviewer',
      sorter: true,
      render: (text, record) => {
        return <>
          <EmployeeListColumn id={text.reviewer.id} name={text.reviewer.name}  ></EmployeeListColumn>
        </>
      }
    },
    {
      title: 'Agenda',
      dataIndex: 'agenda',
    },
    {
      title: 'Mode Of Meeting',
      sorter: false,
      render: (text, record) => {
        return <>
          <div>{text.status == "COMPLETED" ? (text.meetingType == 0 ? "In-person" : text.meetingType == 1 ? "MS Teams" : text.meetingType == 2 ? "Zoom" : text.other) : "-"}</div>
        </>
      }
    },
    {
      title: 'Status',
      sorter: true,
      render: (text, record) => {
        return <>
          <div>{this.getStyle(text.status)}</div>
          {/* <div>{text.status == "PENDING"?"Pending":text.status == "COMPLETED"?"Completed":text.status == "CANCEL"?"Cancel":text.status == "RESCHEDULE"?"Rescheduled": "-"}</div> */}
        </>
      }
    },
    {
      title: 'Action',
      width: 50,
      className: "text-center",

      render: (text, record) => (
        <div className="">
          <TableDropdown menuItems={menuItems(text)} />
        </div>
      ),
    },
  ]




  
    return (
      <div >
        {this.state.showAlert && (
          <SuccessAlert
            headText={this.state.alertMsg}
            img={this.state.imgTag}
          />
        )}
        <Helmet>
          <title>1-on-1 Meeting  | {getTitle()}</title>
          <meta name="description" content="Branch page" />
        </Helmet>
        {/* Page Content */}
        < div className="p-0 content container-fluid" >
          {/* Page Header */}
          < div id='page-head' >


            <div className="float-right col-md-5 btn-group btn-group-sm">

              <div className="col-3 ">
                <div style={{ justifyContent: 'right' }} className="row">

                  <div className={this.state.showFilter ? 'col-4 btn-group btn-group-sm' : 'col-2 btn-group btn-group-sm'}>
                    {(this.state.oneOnOneStatus == 2 || this.state.oneOnOneStatus == 1) &&
                      <Button className="btn apply-button btn-primary" onClick={() => {
                        this.setState({
                          showForm: true
                        })
                      }}><i className="fa fa-plus" /> Create</Button>}
                    <div style={{ cursor: 'pointer' }} className='ml-2' onClick={() => this.setState({ showFilter: !this.state.showFilter })} > <BsSliders className='' size={30} /></div>
                  </div>
                </div>

              </div>
            </div>

            {this.state.showFilter && <div className='mt-5 filterCard p-3'>
              {this.state.showFilter && isAdmin && this.state.oneOnOneStatus == 2 && <div className="row">
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
            < div className='mt-5 Table-card' >
              <div className="tableCard-body">
                <div className="row " >
                  <div className="mt-3 col">
                    <h3 className="page-titleText">{this.state.oneOnOneStatus == 0?"Reviews":"1-on-1 Meeting"} </h3>
                  </div>
                  {/* {!isAdmin && <div className='mt-2 float-right col-md-auto'>``
                        <i onClick={() => this.updateSelf()} className={this.state.self ? 'fa-2x fa fa-toggle-on text-success' : 'fa-2x fa fa-toggle-off text-danger'}></i>
                        <label className="pl-2 text-dark" style={{ color: 'white' }}>{this.state.self ? 'Self' : 'Team Members'}</label>
                      </div>} */}
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
                        columns={this.state.oneOnOneStatus == 0?columns1:columns}
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





          {/* /Page Content */}


          <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


            <Header closeButton>
              <h5 className="modal-title">Meeting Schedule Form</h5>

            </Header>
            <Body>
              <MeetingScheduleForm rescheduleId={this.state.rescheduleId} updateList={this.updateList} meetingSchedule={this.state.meetingSchedule}> </MeetingScheduleForm>
            </Body>


          </Modal>

          {/* EVALUVATION form */}

          <Modal enforceFocus={false} size={"md"} show={this.state.showEvaluationForm} onHide={this.hideForm} >


            <Header closeButton>
              <h5 className="modal-title">Evaluation Form</h5>

            </Header>
            <Body>
              <EvaluvationForm updateStatus={this.updateStatus} meetingInfo={this.state.meetingInfo} updateList={this.updateList}> </EvaluvationForm>
            </Body>


          </Modal>

          {/* get employee data */}

          <Modal enforceFocus={false} size={"md"} show={this.state.showEmployeeCommentForm} onHide={this.hideForm} >


            <Header closeButton>
              <h5 className="modal-title">Employee Comment</h5>

            </Header>
            <Body>
              <EmployeePerformanceCommentForm meetingId={this.state.meetingId} updateList={this.updateList}> </EmployeePerformanceCommentForm>
            </Body>


          </Modal>

          {/* REVIEW form */}
           <Modal enforceFocus={false} size={"xl"} show={this.state.showReviewForm} onHide={this.hideReviewForm} >
          
          
                      <Header closeButton>
                        <h5 className="modal-title"> Performance Review</h5>
          
                      </Header>
                      <Body>
                        <PerformanceReviewDetailsForm showAlert={this.showAlert} hideReviewForm={this.hideReviewForm} reviewId={this.state.reviewId}>
                        </PerformanceReviewDetailsForm>
                      </Body>
          
          
                    </Modal>

        </div>
      </div>
    );
  }

}