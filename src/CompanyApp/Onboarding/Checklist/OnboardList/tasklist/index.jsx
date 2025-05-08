import { Checkbox, Empty, Popover, Progress, Avatar, Slider, Table, Tooltip } from 'antd';
import React, { Component } from 'react';
import { Anchor, Button, Modal, ProgressBar } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { getReadableDate, getTitle, getUserType, verifyApprovalPermission, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission, verifySelfViewPermission, verifyViewPermissionForTeam, convertToUserTimeZone } from '../../../../../utility';
import EmployeeProfilePhoto from '../../../../Employee/widgetEmployeePhoto';
import BranchDropdown from '../../../../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../../../../ModuleSetup/Dropdown/DepartmentDropdown';
import JobTitlesDropdown from '../../../../ModuleSetup/Dropdown/JobTitlesDropdown';
import { IoIosGitMerge } from "react-icons/io";
import { updateAllTaskStatus, updateTaskStatus, getTaskList,getSubtaskList,updateSubTaskStatus} from './service';
import { toast } from 'react-toastify';
import { updateAllPayslipStatus } from '../../../../Payroll/PaySlip/service';
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import { AiOutlineFolderView } from "react-icons/ai";
import TaskAuditHistory from './viewHistory';
import { confirmAlert } from 'react-confirm-alert';
import TaskEditForm from './taskEditForm';
import { getBranchLists } from '../../../../Performance/ReviewCycle/CycleForms/service';
import { getDepartmentLists } from '../../../../Performance/ReviewCycle/CycleForms/service';



const { Header, Body, Footer, Dialog } = Modal;
export default class OnboardTasklist extends Component {
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
            expandedRows: {},
            selectedTasks: [],
            selectedSubTasks: [],
            taskData: [],
            subTasks: [],
            historyId: 0,
            historyTaskId: 0,
            historyStatus: false,
            editable: false
        };
    }
    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        getBranchLists().then(res => {
                           if (res.status === "OK") {
                               this.setState({
                                   branches: res.data,
                               });
                           }
                       });
                       getDepartmentLists().then(res => {
                           if (res.status === "OK") {
                               this.setState({
                                   department: res.data,
                               });
                           }
                       });
                       setTimeout(() => {this.fetchList()},1000) 
       
   }

    fetchList = () => {
        getTaskList( this.props.employeeInfo.employeeId).then(res => {
               if (res.status == "OK") {
               
                // for assing
                if(res.data.length > 0 ){
                    let data = res.data.map((res) => {
                        if(res.assign == 0 &&  this.state.department.length > 0){
                            let department =  this.state.department.filter((dept) => res.assignInfo?.split(',').map(Number).includes(dept.id)) 
                            let arrname = department.map(dept => dept.name);
                            let applicableFor = arrname.join(", ");
                            return {...res,applicableFor : applicableFor}
                        }
                        if(res.assign == 1 &&  this.state.branches.length > 0){
                            let branches =  this.state.branches.filter((dept) => res.assignInfo?.split(',').map(Number).includes(dept.id))
                        let arrname = branches.map(dept => dept.name);
                        let applicableFor = arrname.join(", ");
                        return {...res,applicableFor : applicableFor}
                        }
                        if(res.assign == 2){
                            return {...res,employeeId: res.assignInfo.split(",").map(Number)} ;
                        }
                    })
                      this.setState({
                    taskData: data,
             
                 })
                }else{
                    this.setState({
                        taskData: [],
                 
                     })
                }

                 // for assing
               }
             })

    }
    fetchSubTask = (id) => {
        getSubtaskList(id,this.props.employeeInfo.employeeId).then(res => {
               if (res.status == "OK") {
               
                if(res.data.length > 0 ){
                    let data = res.data.map((res) => {
                        if(res.assign == 0 &&  this.state.department.length > 0){
                            let department =  this.state.department.filter((dept) => res.assignInfo?.split(',').map(Number).includes(dept.id)) 
                            let arrname = department.map(dept => dept.name);
                            let applicableFor = arrname.join(", ");
                            return {...res,applicableFor : applicableFor}
                        }
                        if(res.assign == 1 &&  this.state.branches.length > 0){
                            let branches =  this.state.branches.filter((dept) => res.assignInfo?.split(',').map(Number).includes(dept.id))
                        let arrname = branches.map(dept => dept.name);
                        let applicableFor = arrname.join(", ");
                        return {...res,applicableFor : applicableFor}
                        }
                        if(res.assign == 2){
                            return {...res,employeeId: res.assignInfo.split(",").map(Number)} ;
                        }
                    })
                    console.log("datadatadata",data)
                      this.setState({
                        subTasks: data,
             
                 })
                }else{
                    this.setState({
                        subTasks: [],
                 
                     })
                }
               }
             })

    }

    reduceString = (str, maxLength) => {
        if (typeof str !== 'string' || str.length <= maxLength) {
            return str || '';
        } else {
            return str.slice(0, maxLength) + '...';
        }
    }

    subGoalExpand = (id) => {
        this.fetchSubTask(id);
    };


    handleSelectAll = (e) => {
        confirmAlert({
            message: 'Are you sure you want to complete all the Task?',
            buttons: [
                {
                    label: 'Cancel',
                    onClick: () => { }
                },
                {
                    label: "I'm Sure",
                    className: "confirm-alert",
                    onClick: () => {
                        const { checked } = e.target;
                        const allTaskIds = this.state.taskData.map(task => task.id);
                        const allSubTaskIds = this.state.subTasks.map(subtask => subtask.id);
                        const saveTasks = { id: allTaskIds, status: checked };
                       

                        if (checked) {
                            if(allTaskIds.length > 0){
                            let data = allTaskIds.map((res) => {
                                updateTaskStatus(res,true).then(res => {
                                    if (res.status == "OK") {
                                        toast.success(res.message);
                                        // this.fetchList();
                                    } else {
                                        toast.error(res.message);
                                    }
                                })
                            })
                        
                            }

                            this.setState({
                               
                                taskData: this.state.taskData.map(task => ({ ...task, progress: 100 })) // Set all task progress to 100
                            });
                            this.fetchList();
                        } else {
                            if(allTaskIds.length > 0){
                                let data = allTaskIds.map((res) => {
                                    updateTaskStatus(res,false).then(res => {
                                        if (res.status == "OK") {
                                            toast.success(res.message);
                                            // this.fetchList();
                                        } else {
                                            toast.error(res.message);
                                        }
                                    })
                                })
                            
                                }
                            this.setState({
                               
                                taskData: this.state.taskData.map(task => ({ ...task, progress: 0 })) // Reset all task progress to 0
                            });
                            this.fetchList();
                        }
                    },
                }
            ]
        });
    };

    handleTaskSelect = (taskId,completed) => {
        this.setState((prevState) => {
           
            updateTaskStatus(taskId,completed).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                    this.fetchList();
                } else {
                    toast.error(res.message);
                }
            })

           
        });
    };

    handleSubTaskSelect = (subTaskId,completed,taskId) => {
        this.setState((prevState) => {
           
            updateSubTaskStatus(subTaskId,completed).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                   
                    window.location.reload();
                } else {
                    toast.error(res.message);
                }
            })

           
        });
    };

    updateTaskProgress = () => {
        const taskProgress = this.state.taskData.map(task => {
            const relatedSubTasks = this.state.subTasks.filter(subtask => subtask.taskId === task.id);
            const completedSubTasks = relatedSubTasks.filter(subtask => this.state.selectedSubTasks.includes(subtask.id));
            const progress = (completedSubTasks.length / relatedSubTasks.length) * 100;
            return { ...task, progress: progress || 0 };
        });
        this.setState({ taskData: taskProgress });
    };

    hideForm = () => {
        this.setState({
            showForm: false,
            editable: false
        });
    }


    render() {

        const isAdmin = (verifyOrgLevelViewPermission("Onboard") || getUserType() == 'COMPANY_ADMIN');

        const { expandedRows, totalPages, totalRecords, currentPage, size } = this.state
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
            return "#65d0f2";
        };


        return (
            <div >
                <Helmet>
                    <title>Onboard Tasklist  | {getTitle()}</title>
                    <meta name="description" content="Branch page" />
                </Helmet>
                {this.state.showFilter && <div style={{ margin: '15px' }} className='mt-3 filterCard p-3'>
                    {this.state.showFilter && isAdmin && <div className="row">
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
                <div className="p-0 content container-fluid" >
                    < div className='goalPageHead' id='page-head' >

                        <div className="checklistTaskHeader-container">
                            {/* Left Side: Profile & Details */}
                            <div className="checklistTaskHeader-left">
                                <EmployeeProfilePhoto className="checklistTaskProf" id={this.props.employeeInfo.employeeId} />
                                <div className="checklistTaskHeader-details">
                                    <span className="checklistTaskHeader-name">{this.props.employeeInfo.employeeName}</span>
                                    <span className="checklistTaskHeader-title">{this.props.employeeInfo.jobTitle}</span>
                                </div>
                            </div>

                            <div className="checklistTaskHeader-right">

                                <p onClick={() => this.props.handlePage('checklist')} className="checklistTaskViewHeaderBtn">
                                    <i className="fa fa-arrow-left" aria-hidden="true"></i> Back
                                </p>
                                <div className="checklistTask_progress-section">
                                    <div className='checklistProgHead'>
                                        <span className="checklistTask_progress-title">OVERALL PROGRESS :</span>
                                        <span className="checklistTask_progress-percentage">{(this.props.employeeInfo?.progress == null?0:this.props.employeeInfo?.progress).toFixed(2)}%</span>
                                    </div>

                                    <div className="checklistTask_progress-bar">
                                        <div className="checklistTask_progress-fill" style={{ backgroundColor: getColorByAchievement(this.props.employeeInfo?.progress == null?0:this.props.employeeInfo?.progress), width: `${this.props.employeeInfo?.progress == null?0:this.props.employeeInfo?.progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>




                        <div className="Goals_table-container">
                            <table className="goals-table">
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'center' }}>
                                            <Checkbox
                                                onChange={this.handleSelectAll}
                                                checked={this.state.selectedTasks.length === this.state.taskData.length && this.state.selectedSubTasks.length === this.state.subTasks.length}
                                            />
                                        </th>
                                        <th></th>
                                        <th>Task Name</th>
                                        <th style={{ textAlign: 'center' }}>Due Date</th>
                                        <th style={{ textAlign: 'center' }}>Date Of Completion</th>
                                        <th>Progress</th>
                                        <th style={{ textAlign: 'center' }}>Assign To</th>
                                        <th style={{ textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.taskData.length >  0 ? null : (
                                        <tr>
                                            <td colSpan="8">
                                                <Empty />
                                            </td>
                                        </tr>
                                    )}
                                    {this.state.taskData.length > 0 &&this.state.taskData?.map((item, index) => {
                                        const isExpanded = expandedRows[item.id];
                                        const taskStyle = item.completedDate != null ? { textDecoration: 'line-through' } : {};
                                        const isFirstTaskOfChecklist = index === 0 || this.state.taskData[index - 1].checklistName !== item.checklistName;
                                        return (
                                            <>
                                                {isFirstTaskOfChecklist && (
                                                    <tr key={`header-${item.checklistName}`}>
                                                        <td colSpan="6" style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                                            {item.checklistName}
                                                        </td>
                                                    </tr>
                                                )}
                                                <tr className='Goals_table_row' key={item.id}>
                                                    <td style={{ width: '0px' }}>
                                                        <Checkbox
                                                            onChange={() => this.handleTaskSelect(item.id,item.completedDate == null?true:false)}
                                                            checked={item.completedDate}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div style={{ cursor: 'pointer', placeSelf: 'center', fontSize: '20px' }}>
                                                            <i onClick={() => {
                                                                this.subGoalExpand(item.taskId)
                                                                this.setState((prevState) => ({
                                                                    expandedRows: {
                                                                        [item.id]: !prevState.expandedRows[item.id], // Toggle the state for the clicked ID
                                                                    },
                                                                }));
                                                            }
                                                            } className={`fa ${isExpanded ? 'fa-angle-up' : 'fa-angle-down'}`} aria-hidden="true"></i>
                                                        </div>
                                                    </td>
                                                    <td style={{ width: '380px', ...taskStyle }} className='GoalName_tab' >
                                                        <div>

                                                            <div className="goal-title ">{this.reduceString(item.taskName, 45)}</div>


                                                            <div className="goal-details">
                                                                <IoIosGitMerge /> {item?.subtaskCount} Subtask
                                                            </div>

                                                        </div>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>{item.dueDate != null   ? getReadableDate(item.dueDate) : item?.subtaskCount == 0? <Anchor style={{ borderRadius: "50%" }} className="btn btn-success btn-sm" onClick={() => {
                                                        this.setState({ editable: true, historyId:item.id,historyStatus: true})
                                                    }}><i className="fa fa-edit"></i></Anchor>:"-"}</td>
                                                    <td style={{ textAlign: 'center' }}>{getReadableDate(item.completedDate)}</td>
                                                    <td style={{ width: '235px' }}>
                                                        <div >
                                                            <Slider
                                                                value={item?.subtaskCount == 0 && item.completedDate != null?100: item.subtaskCompletedCount > 0?item.subtaskCompletedCount/item.subtaskCount*100:0}
                                                                tooltip={{ open: false }}
                                                                trackStyle={{ borderRadius: '20px', backgroundColor: getColorByAchievement(item?.subtaskCount == 0 && item.completedDate != null?100: item.subtaskCompletedCount > 0?item.subtaskCompletedCount/item.subtaskCount*100:0), height: 8 }}
                                                                handleStyle={{
                                                                    borderColor: getColorByAchievement(item?.subtaskCount == 0 && item.completedDate != null?100: item.subtaskCompletedCount > 0?item.subtaskCompletedCount/item.subtaskCount*100:0),
                                                                    backgroundColor: "#fff",
                                                                    borderWidth: 2,
                                                                    width: 20,
                                                                    height: 20,

                                                                }}
                                                                railStyle={{ backgroundColor: "#f0f0f0", height: 8 }}
                                                            />
                                                            <div className='m-1 text-right'>
                                                                <span className="last-updated">{item?.subtaskCount == 0 && item.completedDate != null?100: item.subtaskCompletedCount > 0?item.subtaskCompletedCount/item.subtaskCount*100:0}%</span>
                                                            </div>

                                                        </div>
                                                    </td>
                                                    {/* <td style={{ textAlign: 'center' }}><EmployeeProfilePhoto className='multiSelectImgSize' id={982}></EmployeeProfilePhoto></td> */}
                                                    {item.employeeId ?  <td style={{ textAlign: 'center' }}>
                                                       <Avatar.Group
                                                            max={{
                                                                count: 4,
                                                                style: { color: '#f56a00', backgroundColor: '#fde3cf' },
                                                            }}
                                                        >
                                                            {item?.employeeId && item?.employeeId.slice(0, 3).map((memberId, index) => (
                                                                <Avatar style={{ backgroundColor: '#87d068' }} icon={<EmployeeProfilePhoto className="" id={memberId} />} />
                                                            ))}

                                                            { item?.employeeId.length > 3 && (
                                                                <Tooltip
                                                                    title={item?.members && item?.members.slice(3).map((memberId, index) => (
                                                                        <Avatar key={index} style={{ backgroundColor: '#1677ff' }} icon={<EmployeeProfilePhoto className="" id={memberId} />} />
                                                                    ))}
                                                                    placement="top"
                                                                >
                                                                    <Avatar style={{ backgroundColor: '#ffb586', color: '#5f4115' }}>
                                                                        +{ item?.employeeId.length - 3}
                                                                    </Avatar>
                                                                </Tooltip>
                                                            )}
                                                        </Avatar.Group>
                                                    </td>:<td>{item.applicableFor}</td>}
                                                    <td onClick={() => this.setState({ showForm: true,historyId:item.id,historyStatus: true })} style={{ textAlign: 'center', cursor: 'pointer' }}><AiOutlineFolderView className='checklistViewBtn' size={25} /></td>

                                                </tr>
                                                {isExpanded && (
                                                    this.state.subTasks?.filter((sub) => sub.taskId === item.taskId).map((sub) => {
                                                        const subTaskStyle = sub.completedDate != null ? { textDecoration: 'line-through' } : {};
                                                        return (
                                                            <tr className='subGoals_table_row' key={sub.id}>
                                                                <td className='p-1' colSpan={6}>
                                                                    <div className="sub-CheckListTask">
                                                                        <table style={{ width: '100%' }}>

                                                                            <tbody style={{ height: '40px' }}>
                                                                                <td style={{ textAlign: 'center', width: '40px' }}>
                                                                                    <Checkbox
                                                                                        onChange={() => this.handleSubTaskSelect(sub.id,sub.completedDate == null?true:false,item.id)}
                                                                                        checked={sub.completedDate != null}
                                                                                    />
                                                                                </td>
                                                                                <td style={{ width: '280px', ...subTaskStyle }} className='GoalName_tab p-0' >
                                                                                    <div className='ml-3'>
                                                                                        <div className="goal-title">{this.reduceString(sub.subTaskName, 30)}</div>


                                                                                    </div>
                                                                                </td>
                                                                                <td >{sub.dueDate != null ? getReadableDate(sub.dueDate) : <Anchor style={{ borderRadius: "50%" }} className="btn btn-success btn-sm" onClick={() => {
                                                                                    this.setState({ editable: true, historyId: sub.id, historyStatus: false, historyTaskId: item.id })
                                                                                }}><i className="fa fa-edit"></i></Anchor>}</td>
                                                                                <td>{sub.completedDate != null?getReadableDate(sub.completedDate):"-"}</td>
                                                                               {sub.employeeId ? <td style={{ textAlign: 'center' }}>
                                                                                    <Avatar.Group
                                                                                        max={{
                                                                                            count: 4,
                                                                                            style: { color: '#f56a00', backgroundColor: '#fde3cf' },
                                                                                        }}
                                                                                    >
                                                                                        {sub?.employeeId && sub?.employeeId.slice(0, 3).map((memberId, index) => (
                                                                                            <Avatar style={{ backgroundColor: '#87d068' }} icon={<EmployeeProfilePhoto className="" id={memberId} />} />
                                                                                        ))}

                                                                                        {sub?.employeeId && sub?.employeeId.length > 3 && (
                                                                                            <Tooltip
                                                                                                title={sub?.employeeId && sub?.employeeId.slice(3).map((memberId, index) => (
                                                                                                    <Avatar key={index} style={{ backgroundColor: '#1677ff' }} icon={<EmployeeProfilePhoto className="" id={memberId} />} />
                                                                                                ))}
                                                                                                placement="top"
                                                                                            >
                                                                                                <Avatar style={{ backgroundColor: '#ffb586', color: '#5f4115' }}>
                                                                                                    +{sub?.employeeId && sub?.employeeId.length - 3}
                                                                                                </Avatar>
                                                                                            </Tooltip>
                                                                                        )}
                                                                                    </Avatar.Group>
                                                                                </td>: <td>{sub.applicableFor}</td>}
                                                                                <td onClick={() => this.setState({ showForm: true,historyId:sub.id,historyStatus: false })} style={{ textAlign: 'center', cursor: 'pointer' }}><AiOutlineFolderView className='checklistViewBtn' size={25} /></td>



                                                                            </tbody>

                                                                        </table>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </>
                                        );
                                    })}



                                </tbody >

                            </table>
                        </div >
                    </div>
                    {/* /Page Content */}
                </div>
                <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm}>
                    <Header closeButton>
                        <h5 className="modal-title">Audit History</h5>
                    </Header>
                    <Body>
                        <TaskAuditHistory historyId={this.state.historyId}  historyStatus={this.state.historyStatus}>
                        </TaskAuditHistory>
                    </Body>
                </Modal>

                {/* edit date */}
                <Modal enforceFocus={false} size={"md"} show={this.state.editable} onHide={this.hideForm}>
                    <Header closeButton>
                        <h5 className="modal-title">Edit Due Date</h5>
                    </Header>
                    <Body>
                    <TaskEditForm historyId={this.state.historyId}  historyStatus={this.state.historyStatus} historyTaskId={this.state.historyTaskId}>
                    </TaskEditForm>
                    {/* <input type="date"  onChange={(e) => handle}/> */}

                    </Body>
                </Modal>
            </div>
        );
    }
}
