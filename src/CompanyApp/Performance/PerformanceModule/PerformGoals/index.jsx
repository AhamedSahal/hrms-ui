import { Empty, Popover, Progress, Slider, Table, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Button, Modal, ProgressBar } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { deletePerformanceReview } from '../../Review/service';
import { getReadableDate, getTitle, getUserType, verifyOrgLevelViewPermission, convertToUserTimeZone } from '../../../../utility';
import PerformanceGoalsForm from './form';
import { getPerformanceGoalsList, getSubGoalsList } from './service';
import PerformanceSubGoalsForm from './subGoalsform';
import SubGoalListViewer from './SubGoalsGrpList';
import EmployeeListColumn from '../../../Employee/employeeListColumn';
import DepartmentDropdown from '../../../ModuleSetup/Dropdown/DepartmentDropdown';
import BranchDropdown from '../../../ModuleSetup/Dropdown/BranchDropdown';
import TableDropdown from '../../../../MainPage/tableDropDown';
import JobTitlesDropdown from '../../../ModuleSetup/Dropdown/JobTitlesDropdown';
import { BsSliders } from 'react-icons/bs';
import PerformanceReviewDetailsForm from '../../Review/detailsForm';
import SuccessAlert from '../../../../MainPage/successToast';
import checkimg from '../../../../assets/img/tickmarkimg.gif';
import SubGoalsStatusAction from './subGoalsStatusAction';
import GoalsStatusHistory from './GoalsStatusViewHistory';
import { getDashboardData } from './service';
import { formatDistanceToNow, parse } from "date-fns";
import EmployeeProfilePhoto from '../../../Employee/widgetEmployeePhoto';
import ProgressValueForm from './progressValueForm';
import { FcHighPriority, FcLowPriority, FcMediumPriority } from 'react-icons/fc';
import InfiniteScroll from 'react-infinite-scroll-component';


const { Header, Body, Footer, Dialog } = Modal;
export default class PerformGoals extends Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 2);
    var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    this.state = {
      data: [],
      subGoalsList: [],
      subGoalsData: {},
      q: "",
      branchId: "",
      departmentId: "",
      designationId: "",
      jobTitleId: "",
      fromDate: firstDay.toISOString().split('T')[0],
      toDate: lastDay.toISOString().split('T')[0],
      page: 0,
      size: 0,
      subSize: 1000,
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
      showSubGoalsAction: false,
      goalStatuId: 0,
      subGoalsStatusId: 0,
      dashboard: [],
      lastUpdatedTime: "",
      expandedRows: {},
      progressValue: 50,
      visible: false,
      visiblePopover: '',
      filteredData: 'all',
      hasMore: true,
      totalLength: 0,
      isSubform: true
    };
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    const { filteredData } = this.state
    if (this.state.size > this.state.totalLength) {
      this.setState({ hasMore: false })
    }
    setTimeout(() => {
      this.setState({ size: this.state.size + 10 }, () => {
        getPerformanceGoalsList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.self, this.state.branchId, this.state.departmentId, this.state.jobTitleId, this.state.fromDate, this.state.toDate, this.props.goalStatus).then(res => {
          if (res.status == "OK") {
            if (filteredData == 'all') {
              this.setState({
                data: res.data.list,
                totalLength: res.data.totalRecords
              })
            } else if (filteredData == 'active') {
              this.setState({
                data: res.data.list.filter((item) => item.active == true),
              })
            } else if (filteredData == 'overdue') {
              this.setState({
                data: res.data.list.filter((item) => {
                  let weightStatusValidation = item.subGoalsStatusWeightage != null
                    ? item.subGoalsStatusWeightage
                    : item.goalsStatusWeightage != null
                      ? item.goalsStatusWeightage
                      : 0;
                  return new Date(item.deadline) < new Date() && weightStatusValidation < 100 && item.active == true
                }),
              });
            } else if (filteredData == 'completed') {
              this.setState({
                data: res.data.list.filter((item) => {
                  let weightStatusValidation = item.subGoalsStatusWeightage != null ? item.subGoalsStatusWeightage : item.goalsStatusWeightage != null ? item.goalsStatusWeightage : 0;
                  return weightStatusValidation === 100;
                }),
              });
            } else if (filteredData == 'inactive') {
              this.setState({
                data: res.data.list.filter((item) => item.active == false),
              })
            }
            this.setState({
              totalPages: res.data.totalPages,
              totalRecords: res.data.totalRecords,
              currentPage: res.data.pageNumber + 1,
            })
          }
        })
      })
    }, 500);

    getDashboardData(this.props.goalStatus).then(res => {
      if (res.status == "OK") {
        this.setState({ dashboard: res.data }, () => {
          this.RelativeTime(this.state.dashboard.lastUpdate)
        })
        //  last update


      }
    })
    // }

  }

  handleFilteredData = (filteredData) => {
    this.setState({ filteredData }, () => {
      this.fetchList();
    });
  }

  fetchSubGoals = (id) => {
    getSubGoalsList(this.state.q, this.state.page, this.state.subSize, this.state.sort, id).then(res => {
      if (res.status == "OK") {
        this.setState({
          subGoalsList: res.data.list,
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
  updateList = () => {
    this.setState({
      showForm: false,
      performanceTemplate: undefined,
      PerformanceGoalsForm: undefined,
      showSubGoalsForm: false,
      showSubGoalsAction: false,
      goalData: undefined
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
  hideForm = () => {
    this.setState({
      showForm: false,
      performanceTemplate: undefined,
      PerformanceGoalsForm: undefined
    })
  }
  hideSubGoalsForm = () => {
    this.setState({
      showSubGoalsForm: false,
      performanceTemplate: undefined,
    })
  }
  hideReviewForm = () => {
    this.setState({
      showReviewForm: false,
    })
  }

  hideSubGoalsAction = () => {
    this.setState({
      showSubGoalsAction: false,
      subgoalsEditView: undefined
    })
  }

  hideSubGoalsView = () => {
    this.setState({
      showSubGoalsView: false,
      goalsView: undefined
    }, () => {
      this.fetchList();
    })
  }

  hideGoalsViewChanges = () => {
    this.setState({
      showGoalsViewChanges: false
    })

  }
  updateSelf = () => {
    this.setState({ self: !this.state.self }, () => {
      this.fetchList();
    })
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
      title: `Delete Performance Review ${performanceReview.name}`,
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




  RelativeTime = () => {
    if (this.state.dashboard.lastUpdate != null && this.state.dashboard.lastUpdate != "") {


      let date = getReadableDate(this.state.dashboard.lastUpdate);
      let time = convertToUserTimeZone(this.state.dashboard.lastUpdate);
      let dateAndTime = date + "-" + time
      let parsedDate = parse(dateAndTime, "dd-MM-yyyy-hh:mm a", new Date());
      const formattedTime = formatDistanceToNow(new Date(parsedDate), {
        addSuffix: true,
      });
      this.setState({ lastUpdatedTime: formattedTime })
    } // if end
  };



  reduceString = (str, maxLength) => {
    if (typeof str !== 'string' || str.length <= maxLength) {
      return str || '';
    } else {
      return str.slice(0, maxLength) + '...';
    }
  }

  subGoalExpand = (id) => {
    this.setState({ addGoalId: id })
    getSubGoalsList(this.state.q, this.state.page, this.state.subSize, this.state.sort, id).then(res => {
      if (res.status == "OK") {
        this.setState({
          subGoalsList: res.data.list,
        })
      }
    })
  };


  updateProgressList = () => {
    this.subGoalExpand(this.state.addGoalId);
  }

  updateGoalsProgressList = () => {
    this.fetchList();
  }





  handleProgressValueChange = (newValue) => {
    this.setState({ progressValue: newValue, visible: true });
  };

  handleCloseProgressForm = (visible, subGoalId) => {
    this.setState((prevState) => ({
      visiblePopover: {
        ...prevState.visiblePopover,
        [subGoalId]: false,
      },
    }));
  }

  handleVisibleChange = (visible, subGoalId) => {

    this.setState((prevState) => ({
      visiblePopover: {
        ...prevState.visiblePopover,
        [subGoalId]: visible,
      },
    }));
  };



  render() {


    const isAdmin = (verifyOrgLevelViewPermission("Performance Review") || getUserType() == 'COMPANY_ADMIN');

    const { data, filteredData, visiblePopover, subGoalsList, expandedRows, totalRecords, currentPage, size, goalsView, goalsViewHistory, hasMore } = this.state
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const getColorByAchievement = (achievement) => {
      if (achievement < 25) return "#f76d6d";
      if (achievement >= 25 && achievement < 50) return "#f2ce5a ";
      if (achievement >= 50 && achievement < 75) return "#65d0f2";
      if (achievement > 75) return "#7ae58d";
      return "#f26565";
    };



    return (
      <div >
        {this.state.showAlert && (
          <SuccessAlert
            headText={this.state.alertMsg}
            img={this.state.imgTag}
          />
        )}
        <Helmet>
          <title>Performance Goals  | {getTitle()}</title>
          <meta name="description" content="Branch page" />
        </Helmet>
        <div style={{ cursor: 'pointer', textAlign: 'right', marginTop: '-35px', }} className='ml-2 mb-2' onClick={() => this.setState({ showFilter: !this.state.showFilter })} > <BsSliders className='' size={30} /></div>
        {this.state.showFilter && <div style={{ margin: '15px' }} className='mt-3 filterCard p-3'>
          {this.state.showFilter && isAdmin && this.props.goalStatus == 2 && <div className="row">
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
          {this.state.showFilter && <div className="row">
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
        < div className="p-0 content container-fluid" >

          < div className='goalPageHead' id='page-head' >

            <div className=''>
              <div className="goalHeader-container">
                <div className="goalHeaderInnerContent-section">

                  <div>
                    {this.props.goalStatus === 0 ? null : <div className="add-goals-dropdown">
                      <button className="add-goals-btn"><i class="fa fa-plus" aria-hidden="true"></i> Add Goal</button>
                      <div className="Goal_dropdown-menu">
                        <button onClick={() => {
                          this.setState({
                            showForm: true
                          })
                        }}>Add Goal</button>
                        <button onClick={() => {
                          this.setState({
                            showSubGoalsForm: true,
                            isSubform: false
                          })
                        }}>Add Sub Goal</button>
                      </div>
                    </div>}
                    <div className="mt-4 goal_status-indicators">
                      <div onClick={() => this.handleFilteredData('all')} className="filteredGoalsBtn">
                        <i style={{ color: '#BF40BF' }} class="fa fa-list " aria-hidden="true"> </i> All
                      </div>
                      <div onClick={() => this.handleFilteredData('active')} className="filteredGoalsBtn">
                        <i class="fa fa-circle text-info" aria-hidden="true"> </i> Active
                      </div>
                      <div onClick={() => this.handleFilteredData('overdue')} className="filteredGoalsBtn">
                        <i class="fa fa-calendar-times-o text-danger" aria-hidden="true"> </i> Overdue
                      </div>
                      <div onClick={() => this.handleFilteredData('completed')} className="filteredGoalsBtn">
                        <i class="fa fa-check-circle text-success" aria-hidden="true"> </i> Completed
                      </div>
                      <div onClick={() => this.handleFilteredData('inactive')} className="filteredGoalsBtn">
                        <i class="fa fa-times-circle text-secondary" aria-hidden="true"> </i> Inactive
                      </div>
                    </div>
                  </div>
                </div>

                <div className="goal_progress-section">
                  <div className="goal_progress-info">
                    <span>OVERALL PROGRESS</span>
                    <span className="goal_progress-percentage">{this.state.dashboard.progress != null ? this.state.dashboard.progress : 0}%</span>
                    <div className="goal_progress-bar">
                      <div className="goal_progress-fill" style={{ backgroundColor: getColorByAchievement(this.state.dashboard.progress), width: `${this.state.dashboard.progress != null ? this.state.dashboard.progress : 0}%` }}></div>
                    </div>
                    <span className="last-updated">Last updated: {this.state.lastUpdatedTime}</span>
                  </div>
                  <div>

                  </div>

                </div>
              </div>
            </div>
            <InfiniteScroll
              dataLength={this.state.size}
              next={this.fetchList}
              loader={<h4 style={{ marginTop: '11px', textAlign: 'center' }}></h4>}
              hasMore={hasMore}
              endMessage={
                <p style={{ marginTop: '11px', textAlign: 'center' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
            >
              <div className="Goals_table-container">

                <table className="goals-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Goals</th>
                      <th>Deadline</th>
                      <th>Goal Progress</th>
                      <th style={{ textAlign: 'center' }}>Priority</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.length > 0 ? null : (
                      <tr>
                        <td colSpan="6">
                          <Empty />
                        </td>
                      </tr>
                    )}
                    {data?.map((item) => {
                      const isExpanded = expandedRows[item.id];
                      let weightStatusValidation = item.subGoalsStatusWeightage != null ? item.subGoalsStatusWeightage : item.goalsStatusWeightage != null ? item.goalsStatusWeightage : 0;
                      return (
                        <>
                          <tr className='Goals_table_row' key={item.id}>
                            <td>
                              <div style={{ cursor: 'pointer', placeSelf: 'center', fontSize: '20px' }}>
                                <i onClick={() => {
                                  this.subGoalExpand(item.id)
                                  this.setState((prevState) => ({
                                    expandedRows: {
                                      [item.id]: !prevState.expandedRows[item.id], // Toggle the state for the clicked ID
                                    },
                                  }));
                                }
                                } className={`fa ${isExpanded ? 'fa-angle-up' : 'fa-angle-down'}`} aria-hidden="true"></i>
                              </div>
                            </td>
                            <td style={{ width: '380px' }} className='GoalName_tab' >
                              <div onClick={() => this.props.onOpenGoalDetails(item, 'goal')}>
                                <Tooltip title={item.name}>
                                  <div className="goal-title">{this.reduceString(item.name, 45)}</div>
                                </Tooltip>

                                <div className="goal-details">
                                  {item.subGoalsCount} Sub-goals |
                                  {this.props.goalStatus > 0 && <span className=""> <EmployeeProfilePhoto className='multiSelectImgSize' id={item.employeeId}></EmployeeProfilePhoto> {item.employeeName}</span>}

                                </div>

                              </div>
                              {!item.subGoalsCount > 0 && this.props.goalStatus > 0 && <div>
                                <span onClick={() => {
                                  this.setState({
                                    showSubGoalsForm: true, goalDataItem: item, isSubform: true
                                  })
                                }} style={{ color: '#007bff', fontSize: '13px' }}>+ Add Sub Goal</span>
                              </div>}
                            </td>
                            <td>{getReadableDate(item.deadline)}</td>

                            <td style={{ width: '250px' }}>
                              <Popover
                                content={<ProgressValueForm progressValue={weightStatusValidation} GoalsStatusValidation={true} updateProgressList={this.updateGoalsProgressList} goalId={item.id} onClose={(visible) => this.handleCloseProgressForm(visible, item.id)} />}
                                title='Progress and status'
                                trigger="click"
                                visible={item.subGoalsCount > 0 ? false : visiblePopover[item.id]}
                                onVisibleChange={(visible) => this.handleVisibleChange(visible, item.id)}
                                placement="top"
                              >
                                <div >
                                  {item.subGoalsCount > 0 ? <Tooltip title={'Progress for Goals with Sub-Goals cannot be updated directly, kindly update progress of Sub-Goal to change this.'}>

                                    <div>
                                      <Slider
                                        value={weightStatusValidation}
                                        tooltip={{ open: false }}
                                        trackStyle={{ cursor: 'no-drop', borderRadius: '20px', backgroundColor: getColorByAchievement(weightStatusValidation), height: 8 }}
                                        handleStyle={{
                                          borderColor: getColorByAchievement(weightStatusValidation),
                                          backgroundColor: "#fff",
                                          borderWidth: 2,
                                          width: 20,
                                          height: 20,
                                          cursor: 'no-drop',
                                        }}
                                        railStyle={{ cursor: 'no-drop', backgroundColor: "#f0f0f0", height: 8 }}
                                      />
                                    </div>
                                  </Tooltip> :
                                    <Slider
                                      value={weightStatusValidation}
                                      tooltip={{ open: false }}
                                      trackStyle={{ cursor: 'pointer', borderRadius: '20px', backgroundColor: getColorByAchievement(weightStatusValidation), height: 8 }}
                                      handleStyle={{
                                        borderColor: getColorByAchievement(weightStatusValidation),
                                        backgroundColor: "#fff",
                                        borderWidth: 2,
                                        width: 20,
                                        height: 20,
                                        cursor: 'pointer',
                                      }}
                                      railStyle={{ cursor: 'pointer', backgroundColor: "#f0f0f0", height: 8 }}
                                    />}
                                  <div className='m-1'>
                                    <span className="last-updated">{weightStatusValidation}%</span>
                                    <span className="last-updated float-right">Last updated: {this.state.lastUpdatedTime}</span>
                                  </div>

                                </div>
                              </Popover>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span>
                                {item.priority == "0" ? (
                                  <> <FcLowPriority size={17} /> Low  </>
                                ) : item.priority == "1" ? (
                                  <> <FcMediumPriority size={17} /> Medium </>
                                ) : (
                                  <><FcHighPriority size={17} /> High </>
                                )}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {filteredData === 'active' ? <span className='badge bg-inverse-info'><i class="pr-2 fa fa-circle text-info"></i>Active</span>

                                : <span
                                  className={weightStatusValidation == 100 ? "badge bg-inverse-success" :
                                    new Date(item.deadline) < new Date() && item.active == true
                                      ? "badge bg-inverse-danger"
                                      : item.active
                                        ? "badge bg-inverse-info"
                                        : "badge bg-inverse-secondary"
                                  }
                                >
                                  {weightStatusValidation === 100 ? <i class="fa fa-check-circle text-success"></i> : new Date(item.deadline) < new Date() && item.active == true ? (
                                    <i className="pr-2 fa fa-clock-o text-danger"></i>
                                  ) : item.active ? (
                                    <i className="pr-2 fa fa-circle text-info"></i>
                                  ) : (
                                    <i className="pr-2 fa fa-remove text-secondary"></i>
                                  )}
                                  {weightStatusValidation === 100 ? ' Completed' : new Date(item.deadline) < new Date() && item.active == true
                                    ? "Overdue"
                                    : item.active
                                      ? "Active"
                                      : "Inactive"}
                                </span>}
                            </td>
                          </tr>

                          {isExpanded && (
                            subGoalsList?.map((subGoal) => (
                              <tr className='subGoals_table_row' key={subGoal.id}>
                                <td className='p-1' colSpan={5}>
                                  <div className="sub-goals">
                                    <table style={{ width: '100%' }}>
                                      <tbody>
                                        <td onClick={() => this.props.onOpenGoalDetails(subGoal, 'subGoal')} style={{ width: '300px' }} className='GoalName_tab p-0' >
                                          <div className='ml-3'>
                                            <Tooltip title={subGoal.name}>
                                              <div className="goal-title">{this.reduceString(subGoal.name, 30)}</div>
                                            </Tooltip>

                                          </div>
                                        </td>
                                        <td>{getReadableDate(subGoal.deadline)}</td>
                                        <td style={{ width: '200px' }}>
                                          <div >
                                            <Popover
                                              content={<ProgressValueForm progressValue={subGoal.achievement} updateProgressList={this.updateProgressList} goalId={subGoal.id} onClose={(visible) => this.handleCloseProgressForm(visible, subGoal.id)} />}
                                              title="Progress and status"
                                              trigger="click"
                                              visible={visiblePopover[subGoal.id]}
                                              onVisibleChange={(visible) => this.handleVisibleChange(visible, subGoal.id)}
                                              placement="bottom"
                                            >
                                              <div>
                                                <Slider
                                                  value={subGoal.achievement}
                                                  tooltip={{ open: false }}
                                                  trackStyle={{
                                                    borderRadius: '20px',
                                                    backgroundColor: getColorByAchievement(subGoal.achievement),
                                                    height: 8
                                                  }}
                                                  handleStyle={{
                                                    borderColor: getColorByAchievement(subGoal.achievement),
                                                    backgroundColor: "#fff",
                                                    borderWidth: 2,
                                                    width: 20,
                                                    height: 20,
                                                  }}
                                                  railStyle={{ backgroundColor: "#f0f0f0", height: 8 }}
                                                />
                                                <div style={{ float: 'right', fontSize: '12px' }}>{subGoal.achievement}%</div>
                                              </div>
                                            </Popover>
                                          </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                          <span>
                                            {subGoal.priority == "0" ? (
                                              <> <FcLowPriority size={17} /> Low  </>
                                            ) : subGoal.priority == "1" ? (
                                              <> <FcMediumPriority size={17} /> Medium </>
                                            ) : (
                                              <><FcHighPriority size={17} /> High </>
                                            )}
                                          </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                          <span
                                            className={
                                              new Date(subGoal.deadline) < new Date()
                                                ? "badge bg-inverse-danger"
                                                : subGoal.active
                                                  ? "badge bg-inverse-success"
                                                  : "badge bg-inverse-secondary"
                                            }
                                          >
                                            {new Date(subGoal.deadline) < new Date() ? (
                                              <i className="pr-2 fa fa-clock-o text-danger"></i>
                                            ) : subGoal.active ? (
                                              <i className="pr-2 fa fa-check text-success"></i>
                                            ) : (
                                              <i className="pr-2 fa fa-remove text-secondary"></i>
                                            )}
                                            {new Date(subGoal.deadline) < new Date()
                                              ? "Overdue"
                                              : subGoal.active
                                                ? "Active"
                                                : "Inactive"}
                                          </span>
                                        </td>
                                      </tbody>

                                    </table>

                                  </div>
                                </td>
                              </tr>

                            ))

                          )}
                        </>
                      );
                    })}



                  </tbody >

                </table>
              </div >
            </InfiniteScroll>


          </div>





          {/* /Page Content */}


          <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


            <Header closeButton>
              <h5 className="modal-title">{(this.state.PerformanceGoalsForm == undefined || this.state.PerformanceGoalsForm?.id == 0) ? 'Create' : 'Edit'} Goals</h5>

            </Header>
            <Body>
              <PerformanceGoalsForm PerformanceGoalsForm={this.state.PerformanceGoalsForm} updateList={this.updateList}>
              </PerformanceGoalsForm>
            </Body>


          </Modal>
          <Modal enforceFocus={false} size={"md"} show={this.state.showSubGoalsForm} onHide={this.hideSubGoalsForm} >


            <Header closeButton>
              <h5 className="modal-title">{this.state.performanceTemplate ? 'Edit' : 'Create'} Sub Goals</h5>

            </Header>
            <Body>
              {!this.state.isSubform ? <PerformanceSubGoalsForm multiForm={false} updateList={this.updateList} goalsStatusPopupMessage={this.goalsStatusPopupMessage} >

              </PerformanceSubGoalsForm> :

                <PerformanceSubGoalsForm multiForm={false} goalDataItem={this.state.goalDataItem} updateList={this.updateList} goalsStatusPopupMessage={this.goalsStatusPopupMessage}>
                </PerformanceSubGoalsForm>}
            </Body>


          </Modal>
          <Modal enforceFocus={false} size={"xl"} show={this.state.showReviewForm} onHide={this.hideReviewForm} >


            <Header closeButton>
              <h5 className="modal-title"> Performance Goals</h5>

            </Header>
            <Body>
              <PerformanceReviewDetailsForm showAlert={this.showAlert} hideReviewForm={this.hideReviewForm} reviewId={this.state.reviewId}>
              </PerformanceReviewDetailsForm>
            </Body>


          </Modal>
          <Modal enforceFocus={false} size={"xl"} show={this.state.showSubGoalsView} onHide={this.hideSubGoalsView} >
            <Header closeButton>
              <h5 className="modal-title">Detailed Sub Goals View </h5>
            </Header>
            <Body>
              <SubGoalListViewer goalsView={goalsView} goalStatus={this.props.goalStatus}></SubGoalListViewer>
            </Body>
          </Modal>

          {/* sub goals action */}
          <Modal enforceFocus={false} size={"md"} show={this.state.showSubGoalsAction} onHide={this.hideSubGoalsAction} >
            <Header closeButton>
              <h5 className="modal-title">Goals Action </h5>
            </Header>
            <Body>
              <SubGoalsStatusAction GoalsStatusValidation={true} subgoalsEditView={this.state.subgoalsEditView} subGoalValidationStatus={false} subGoalsStatusId={this.state.subGoalsStatusId} updateList={this.updateList}></SubGoalsStatusAction>
            </Body>
          </Modal>

          <Modal enforceFocus={false} size={"xl"} show={this.state.showGoalsViewChanges} onHide={this.hideGoalsViewChanges} >
            <Header closeButton>
              <h5 className="modal-title">Goals Status History </h5>
            </Header>
            <Body>
              <GoalsStatusHistory goalsViewHistory={goalsViewHistory}></GoalsStatusHistory>
            </Body>
          </Modal>
        </div>
      </div>
    );
  }
}
