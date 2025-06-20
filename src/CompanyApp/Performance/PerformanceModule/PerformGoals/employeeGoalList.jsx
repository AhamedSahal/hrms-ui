import { Empty, Popover, Progress, Slider, Table, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { deletePerformanceReview } from '../../Review/service';
import { getReadableDate, getTitle, getUserType, verifyOrgLevelViewPermission, verifySelfViewPermission, verifyViewPermissionForTeam, convertToUserTimeZone } from '../../../../utility';
import { getEmployeeGoalsList, getSubGoalsList , getPerformanceGoalsListByEmployee} from './service';
import DepartmentDropdown from '../../../ModuleSetup/Dropdown/DepartmentDropdown';
import BranchDropdown from '../../../ModuleSetup/Dropdown/BranchDropdown';
import JobTitlesDropdown from '../../../ModuleSetup/Dropdown/JobTitlesDropdown';
import { BsSliders } from 'react-icons/bs';
import SuccessAlert from '../../../../MainPage/successToast';
import checkimg from '../../../../assets/img/tickmarkimg.gif';
import { formatDistanceToNow, parse } from "date-fns";
import InfiniteScroll from 'react-infinite-scroll-component';
import EmployeeProfilePhoto from '../../../Employee/widgetEmployeePhoto';
import PerformanceGoalsForm from './form';
import PerformanceSubGoalsForm from './subGoalsform';

const { Header, Body, Footer, Dialog } = Modal;




export default class EmployeePerformGoalsList extends Component {
    constructor(props) {
        super(props);
        var today = new Date();
        var firstDay = new Date(today.getFullYear(), 0, 1); // January 1st of the current year
        var lastDay = new Date(today.getFullYear(), 11, 31); // December 31st of the current year
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
            isSubform: true,
            buttonState: true,
            status:0,
            empData: []
        };
    }
    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        getPerformanceGoalsListByEmployee(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.branchId, this.state.departmentId, this.state.jobTitleId, this.state.fromDate, this.state.toDate, this.state.self,this.props.goalStatus).then(res => {   
            if (res.status == "OK") {            
                this.setState({
                    empData: res.data,
                    
                })
            } 
        }) 

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
    updateList = (data) => {
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
                alertMsg: 'Submitted!',
                imgTag: checkimg,
                desc: 'Submitted successfully',
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




    RelativeTime = (timestamp) => {
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

    handleButtonClick = () => {
        this.setState((prevState) => ({
            buttonState: !prevState.buttonState,
            preferredMethod: prevState.buttonState ? 'Emp' : 'List'
        }));
    };



    render() {
      let {empData} = this.state;

        const isAdmin = (verifyOrgLevelViewPermission("Performance Review") || getUserType() == 'COMPANY_ADMIN');

        const { data, buttonState, filteredData, visiblePopover, subGoalsList, expandedRows, totalPages, totalRecords, currentPage, size, goalsView, goalsViewHistory, subGoalsData, hasMore } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
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
                            <div style={{ height: '75px' }} className="goalHeader-container">
                                {this.props.goalStatus === 0 ? null : <div className="add-goals-dropdown">
                                    <button className="add-goals-btn"><i class="fa fa-plus" aria-hidden="true"></i> Add </button>
                                    <div className="Goal_dropdown-menu">
                                        <button onClick={() => {
                                            this.setState({
                                                showForm: true
                                            })
                                        }}>Add Goal</button>
                                        {/* <button onClick={() => {
                                            this.setState({
                                                showSubGoalsForm: true,
                                                isSubform: false
                                            })
                                        }}>Add Sub Goal</button> */}
                                    </div>
                                </div>}
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
                                            <th>Employee Name</th>
                                            <th >Title</th>
                                            <th >Reporting Manager</th>
                                            <th style={{ textAlign: 'center' }}>Review Cycle Date</th>
                                            <th style={{ textAlign: 'center' }}>Goal Count</th>
                                            <th style={{ textAlign: 'center' }}>SubGoal Count</th>
                                            <th >Goal Progress</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {empData.length > 0 ? null : (
                                            <tr>
                                                <td colSpan="6">
                                                    <Empty />
                                                </td>
                                            </tr>
                                        )}
                                        {empData?.map((item) => {                                            
                                            let weightStatusValidation = (item.goalsStatusWeightage !=null && item.subGoalsStatusWeightage != null) ? (item.goalsStatusWeightage + item.subGoalsStatusWeightage) : item.subGoalsStatusWeightage != null? item.subGoalsStatusWeightage : item.goalsStatusWeightage != null ? item.goalsStatusWeightage : 0;
                                            return (
                                                <>
                                                    <tr className='Goals_table_row' key={item.id}>
                                                        <td onClick={() => this.props.handleOpenEmpGoal(item, 'empGoals')} style={{ cursor: 'pointer' }} >
                                                            <div >
                                                                <div className="goal-title"><EmployeeProfilePhoto className='multiSelectImgSize' id={item.employeeId}></EmployeeProfilePhoto>{item.employeeName}</div>

                                                            </div>
                                                        </td>
                                                        <td>
                                                            {item.jobTitle}
                                                        </td>
                                                        <td className='GoalName_tab' >
                                                              <div >
                                                                <div className="goal-title">{item.reportingManagerId?<><EmployeeProfilePhoto className='multiSelectImgSize' id={item.reportingManagerId}></EmployeeProfilePhoto>{item.reportingManagerName}</>:"-"}</div>

                                                            </div>
                                                      
                                                        </td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            -
                                                        </td>

                                                        <td style={{ textAlign: 'center' }}>{item.goalsCount}</td>

                                                        <td style={{ textAlign: 'center' }}>
                                                            {item.subgoalsCount}
                                                        </td>
                                                        <td>
                                                            {/* <div className="onboardList_progress-bar">
                                                                <div className="goal_progress-fill" style={{ backgroundColor: getColorByAchievement(item.progress), width: `${item.progress}%` }}></div>
                                                            </div> */}
                                                            <div >
                                                                <Slider
                                                                    value={item.progress}
                                                                    tooltip={{ open: false }}
                                                                    trackStyle={{ borderRadius: '20px', backgroundColor: getColorByAchievement(item.progress), height: 8 }}
                                                                    handleStyle={{
                                                                        borderColor: getColorByAchievement(item.progress),
                                                                        backgroundColor: "#fff",
                                                                        borderWidth: 2,
                                                                        width: 20,
                                                                        height: 20,

                                                                    }}
                                                                    railStyle={{ backgroundColor: "#f0f0f0", height: 8 }}
                                                                />
                                                                <div className='m-1 text-right'>
                                                                    <span className="last-updated">{item.progress}%</span>
                                                                </div>

                                                            </div>
                                                        </td>

                                                    </tr>


                                                </>
                                            );
                                        })}



                                    </tbody >

                                </table>
                            </div >
                        </InfiniteScroll>

                    </div>

                </div>
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
                        <PerformanceSubGoalsForm multiForm={false} enableGoalDropdown={true} goalDataItem={this.state.goalDataItem} updateList={this.updateList} goalsStatusPopupMessage={this.goalsStatusPopupMessage}>
                        </PerformanceSubGoalsForm>
                    </Body>


                </Modal>
                
                

               

               
            </div>
        );
    }
}
