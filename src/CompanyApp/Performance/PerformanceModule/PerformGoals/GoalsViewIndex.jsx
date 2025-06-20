import { Button } from "@mui/material";
import React, { Component } from "react";
import { Anchor } from "react-bootstrap";
import EmployeeProfilePhoto from "../../../Employee/widgetEmployeePhoto";
import { BsThreeDots } from "react-icons/bs";
import { getgoalsViewHistory, getPerformanceGoalsList, getSubGoalsList, getsubgoalsViewHistory } from "./service";
import { getReadableDate, toGoalsLocalDateTime, toLocalDateTime, getUserType, getEmployeeId } from "../../../../utility";
import { FcCalendar, FcHighPriority, FcLowPriority, FcMediumPriority } from "react-icons/fc";
import { Modal } from 'react-bootstrap';
import PerformanceGoalsForm from "./form";
import { toDate } from "date-fns";
import PerformanceSubGoalsForm from "./subGoalsform";
import SubGoalsEditWeigthage from "./subGoalsEditWeightage";
import ProgressValueForm from "./progressValueForm";
import { Popover } from "antd";
import { fileDownload } from "../../../../HttpRequest";


const { Header, Body, Footer, Dialog } = Modal;


class GoalDetails extends Component {
    constructor(props) {
        super(props);
        var today = new Date();
        var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        this.state = {
            data: [],
            goalData: this.props.goalData?.item || '',
            editedGoals: [],
            showForm: false,
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            q: "",
            branchId: "",
            departmentId: "",
            designationId: "",
            jobTitleId: "",
            fromDate: '2024-12-01',
            toDate: lastDay.toISOString().split('T')[0],
            showUpdateWeigthage: false,
            showDropdown: false,
            visiblePopover: false,
            goalStatusValidation: false,
        };
    }


    componentDidMount() {
        if (this.props.goalsData?.type == 'goal') {
            this.fetchList()
        } else {
            this.subGoalfetchList()
        }
    }

    fetchList = () => {
        getgoalsViewHistory(this.props.goalsData?.item.id).then(res => {
            if (res.status == "OK") {
                this.setState({ data: res.data, goalStatusValidation: res.data.length > 0 ? true : false })
            }
        });
    }
    subGoalfetchList = () => {
        getsubgoalsViewHistory(this.props.goalsData?.item.id).then(res => {

            if (res.status == "OK") {
                this.setState({ data: res.data })

            }

        });
    }


    goalFetchList = () => {
        if (this.props.goalsData?.type == 'goal') {
            getPerformanceGoalsList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.self, this.state.branchId, this.state.departmentId, this.state.jobTitleId, this.state.fromDate, this.state.toDate, this.props.goalStatus).then(res => {
                if (res.status == "OK") {

                    this.setState({
                        editedGoals: res.data.list,
                    })
                }
            })
        } else {
            getSubGoalsList(this.state.q, this.state.page, this.state.size, this.state.sort, this.props.goalsData?.item.goalsId).then(res => {
                if (res.status == "OK") {
                    this.setState({
                        editedGoals: res.data.list,
                    })
                }
            })
        }

    }


    updateList = () => {
        this.setState({
            showForm: false,
            PerformanceGoalsForm: undefined,
            showSubGoalsForm: false,
            showUpdateWeigthage: false
        }, () => {
            this.goalFetchList();
        })

    }

    updateGoalsProgressList = () => {
        this.goalFetchList();
    }


    hideSubGoalsForm = () => {
        this.setState({ showSubGoalsForm: false, showUpdateWeigthage: false })
    }

    hideForm = () => {
        this.setState({
            showForm: false,
        })
    }
    handleMouseLeave = () => {
        this.setState({ showDropdown: false });
    };
    render() {
        const { showForm, visiblePopover } = this.state;
        const auditData = this.state.data;
        let goalDisc
        if (this.state.editedGoals.length > 0) {
            this.state.editedGoals.map((goal) => {
                if (goal.id == this.props.goalsData?.item.id) {
                    goalDisc = goal;
                }
            })
        } else {
            goalDisc = this.props.goalsData?.item || '';
        }
        const goalType = this.props.goalsData?.type;
        const getColorByAchievement = (achievement) => {
            if (achievement < 25) return "#f76d6d";
            if (achievement >= 25 && achievement < 50) return "#f2ce5a ";
            if (achievement >= 50 && achievement < 75) return "#65d0f2";
            if (achievement > 75) return "#7ae58d";
            return "#f26565";
        };
        return (
            <div className="goalViewPage-details-container">
                <div className="goalViewPage-header">
                    <h3 className="m-0">{goalType == 'goal' ? 'View Goal' : "View Sub Goal"}</h3>
                    <div className="goalAuditTopBtn">
                        {((getUserType() == 'COMPANY_ADMIN') || (getEmployeeId()==goalDisc.createdBy)) && <p
                            onClick={() => {
                                let { PerformanceGoalsForm } = this.state;
                                if (this.props.goalsData.type === 'subGoal') {
                                    PerformanceGoalsForm = goalDisc;
                                    PerformanceGoalsForm.subgoalWeightage = goalDisc.goalWeightage;
                                    PerformanceGoalsForm.issubGoalWeightage = goalDisc.weightage;
                                    PerformanceGoalsForm.employeeId = goalDisc.employeeId;
                                    this.setState({ PerformanceGoalsForm, showSubGoalsForm: true });
                                } else {
                                    PerformanceGoalsForm = goalDisc;
                                    PerformanceGoalsForm.isWeightage = goalDisc.weightage;
                                    this.setState({ PerformanceGoalsForm, showForm: true });
                                }
                            }} className="goalsViewHeaderBtn "><i style={{ fontSize: '25px' }} class="fa fa-pencil-square-o" aria-hidden="true"></i></p>}

                        <p onClick={() => this.setState({ showDropdown: !this.state.showDropdown })} className="goalsViewHeaderBtn "><BsThreeDots size={23} /></p>

                        {this.state.showDropdown && goalDisc?.subGoalsCount > 0 && <div onMouseLeave={this.handleMouseLeave} className="viewGoalMenuBtnDiv">
                            <p className="viewGoalBtn" onClick={() => this.setState({ showUpdateWeigthage: true, subGoalsWeightageData: goalDisc.id })}>
                                Add Weightage
                            </p>
                        </div>}
                        <p onClick={() => this.props.onBack()} className="goalsViewHeaderBtn "><i class="fa fa-arrow-left" aria-hidden="true"></i> Back</p>
                    </div>

                </div>
                <div className="GoalsSubHead">
                    <div className="mb-0 goalsSubHeadContent">
                        <span style={{ color: '#102746', fontSize: '20px' }}>  {goalDisc.name}  </span>
                        <span style={{ marginLeft: '10px' }} className={new Date(goalDisc.deadline) < new Date() && goalDisc.active == true ? "badge bg-inverse-danger" : goalDisc.active ? "badge bg-inverse-success " : "badge bg-inverse-secondary"}>
                            {new Date(goalDisc.deadline) < new Date() && goalDisc.active == true ? <i className="pr-2 fa fa-clock-o text-danger"></i> : goalDisc.active ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-secondary"></i>}
                            {new Date(goalDisc.deadline) < new Date() && goalDisc.active == true ? "Overdue" : goalDisc.active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="goalsViewUnderGoal">
                            {goalType === 'subGoal' ? `Under: ${goalDisc.goalsName}` : null}
                        </span>
                    </div>
                    <div className="mb-0 goalsDeadLineHead"> <FcCalendar size={23} /> Deadline : {getReadableDate(goalDisc.deadline)}</div>
                </div>

                <div style={{ padding: '30px' }} className="goalViewPage-content">
                    <div className="goalViewPage-details">
                        <div className="goalViewPage-row">
                            <strong>Description</strong>
                            <div className="goalsViewDiscriptionTag">
                                <span>{goalDisc.description}</span>
                            </div>

                            {/* <span>{goalDisc.description}</span> */}
                        </div>
                        <div className="goalViewPage-row">
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <strong>Progress</strong>
                                <Popover
                                    content={<ProgressValueForm GoalsStatusValidation={goalType == 'goal' ? true : false} updateProgressList={this.updateGoalsProgressList} goalId={goalDisc.id} onClose={() => this.setState({ visiblePopover: !visiblePopover })} />}
                                    title="Progress and status"
                                    trigger="click"
                                    visible={visiblePopover}
                                    onVisibleChange={() => this.setState({ visiblePopover: !visiblePopover })}
                                    placement="bottom"
                                >
                                    {!goalDisc?.subGoalsCount > 0 && <span style={{ color: '#258eff', cursor: 'pointer' }}> <i class="fa fa-refresh" aria-hidden="true"></i> Update Progress</span>}
                                </Popover>

                            </div>

                            <span className="goal_progress-percentage">{goalType === 'goal' ? goalDisc.subGoalsStatusWeightage == null ? goalDisc.goalsStatusWeightage : goalDisc.subGoalsStatusWeightage : goalDisc.achievement}%</span>
                            <div style={{ width: '90%' }} className="goal_progress-bar">
                                <div className="goal_progress-fill" style={{ backgroundColor: getColorByAchievement(goalType === 'goal' ? goalDisc.subGoalsStatusWeightage == null ? goalDisc.goalsStatusWeightage : goalDisc.subGoalsStatusWeightage : goalDisc.achievement), width: `${goalType === 'goal' ? goalDisc.subGoalsStatusWeightage == null ? goalDisc.goalsStatusWeightage : goalDisc.subGoalsStatusWeightage : goalDisc.achievement}%` }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="goalViewPage-meta">
                        <div className="goalViewPage-row">
                            <strong>Assigned To:</strong>
                            <span className=""> <EmployeeProfilePhoto className='multiSelectImgSize' id={goalDisc.employeeId}></EmployeeProfilePhoto> {goalDisc.employeeName}</span>
                        </div>
                        <div className="goalViewPage-row">
                            <strong>Modified On</strong>
                            <span>{getReadableDate(goalDisc.modifiedOn)}</span>
                        </div>
                        <div className="goalViewPage-row">
                            <strong>Weightage</strong>
                            <span className="goalViewWeightage">{goalDisc.goalWeightage}</span>
                        </div>
                    </div>
                    <div className="goalViewPage-meta">
                        <div className="goalViewPage-row">
                            <strong>Assigned by:</strong>
                            <span className=""> <EmployeeProfilePhoto className='multiSelectImgSize' id={goalDisc.createdBy}></EmployeeProfilePhoto> {goalDisc.createdName}</span>
                        </div>
                        <div className="goalViewPage-row">
                            <strong>Created On:</strong>
                            <span>{getReadableDate(goalDisc.createdOn)}</span>
                        </div>
                        <div className="goalViewPage-row">
                            <strong>Priority</strong>
                            <span>
                                {goalDisc.priority == "0" ? (
                                    <> <FcLowPriority size={20} /> Low  </>
                                ) : goalDisc.priority == "1" ? (
                                    <> <FcMediumPriority size={20} /> Medium </>
                                ) : (
                                    <><FcHighPriority size={20} /> High </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {this.state.data.length > 0 && <div className="GoalAudit-container">
                    <div>
                        <h3 className="GoalAudit-title">Audit History</h3>
                    </div>
                    <div className="GoalAudit-timeline">
                        {auditData.map((audit, index) => {
                            const { date, time } = toGoalsLocalDateTime(audit.createdOn);
                            const descendingIndex = auditData.length - index;
                            return (
                                <div className="GoalAudit-timelineItem" key={index}>
                                    <div className="GoalAudit-dot">
                                        <span className="GoalAudit-index">{descendingIndex}</span>
                                    </div>
                                    <div className="mt-2 GoalAudit-dotBar"></div>
                                    <div className="GoalAudit-content">
                                        <div style={{ width: '170px' }} className="GoalAudit-dateTime">
                                            <span className="GoalAudit-date">{date}</span>
                                            <span className="GoalAudit-time">{time}</span>
                                        </div>
                                        <div style={{ width: '170px' }} className="GoalAudit-info">
                                            <div className="goal-title"><EmployeeProfilePhoto className='multiSelectImgSize' id={audit.employeeId}></EmployeeProfilePhoto>{audit.createdBy}</div>                                                               
                                        </div>
                                        <div style={{ width: '170px' }}>
                                            <span className="text-muted">Achievement</span>
                                            <div>{audit.achievement}</div>
                                        </div>
                                         <div style={{ width: '170px' }} className="GoalAudit-dateTime">
                                            <span className="text-muted">Deadline</span>
                                            <div>{audit.deadline}</div>
                                        </div>
                                        <div style={{ width: '500px' }}>
                                            <span className="text-muted">Comments</span>
                                            <div>{audit.comments === 'undefined' ? 'N/A' : audit.comments}</div>
                                        </div>

                                        <div style={{ textAlign: 'center', width: '170px' }}>
                                            <span className="">
                                                {this.state.goalStatusValidation ?
                                                    <Anchor style={audit.attachFile == null ? { color: 'grey', cursor: 'no-drop' } : { color: '#258eff', cursor: 'pointer' }} title={'download'} onClick={() => { fileDownload(audit.id, audit.subGoalsId, "GOALS_STATUS", audit.attachFile); }}>
                                                        <i className="fa fa-download"></i> Download
                                                    </Anchor>
                                                    :
                                                    <Anchor style={audit.attachFile == null ? { color: 'grey', cursor: 'no-drop' } : { color: '#258eff', cursor: 'pointer' }} title={'download'} onClick={() => { fileDownload(audit.id, audit.subGoalsId, "SUBGOALS_STATUS", audit.attachFile); }}>
                                                        <i className="fa fa-download"></i> Download
                                                    </Anchor>
                                                }

                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>}

                <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


                    <Header closeButton>
                        <h5 className="modal-title">{'Edit'} Goals</h5>

                    </Header>
                    <Body>
                        <PerformanceGoalsForm PerformanceGoalsForm={this.state.PerformanceGoalsForm} updateList={this.updateList}>
                        </PerformanceGoalsForm>
                    </Body>


                </Modal>
                <Modal enforceFocus={false} size={"md"} show={this.state.showSubGoalsForm} onHide={this.hideSubGoalsForm} >


                    <Header closeButton>
                        <h5 className="modal-title">Edit Sub Goals</h5>

                    </Header>
                    <Body>
                        <PerformanceSubGoalsForm multiForm={false} subGoalsEdit={true} PerformanceSubGoalsForm={this.state.PerformanceGoalsForm} updateList={this.updateList}>
                        </PerformanceSubGoalsForm>
                    </Body>


                </Modal>
                <Modal enforceFocus={false} size={"xl"} show={this.state.showUpdateWeigthage} onHide={this.hideSubGoalsForm} >


                    <Header closeButton>
                        <h5 className="modal-title">Upgrade Attributes</h5>

                    </Header>
                    <Body>
                        <SubGoalsEditWeigthage updateList={this.updateList} subGoalsWeightageData={this.state.subGoalsWeightageData} goalStatus={this.props.goalStatus}>
                        </SubGoalsEditWeigthage>
                    </Body>


                </Modal>
            </div>
        );
    }
}

export default GoalDetails;
