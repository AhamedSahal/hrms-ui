import { Checkbox, Empty, Popover, Progress, Avatar, Slider, Table, Tooltip } from 'antd';
import React, { Component } from 'react';
import { Button, Modal, ProgressBar } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { getReadableDate, getTitle, getUserType, verifyApprovalPermission, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission, verifySelfViewPermission, verifyViewPermissionForTeam, convertToUserTimeZone } from '../../../../../utility';
import EmployeeProfilePhoto from '../../../../Employee/widgetEmployeePhoto';
import BranchDropdown from '../../../../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../../../../ModuleSetup/Dropdown/DepartmentDropdown';
import JobTitlesDropdown from '../../../../ModuleSetup/Dropdown/JobTitlesDropdown';
import { IoIosGitMerge } from "react-icons/io";
import { updateAllTaskStatus, updateTaskStatus } from './service';
import { toast } from 'react-toastify';
import { updateAllPayslipStatus } from '../../../../Payroll/PaySlip/service';
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import { AiOutlineFolderView } from "react-icons/ai";
import TaskAuditHistory from './viewHistory';
import { confirmAlert } from 'react-confirm-alert';

const taskData = [
    {
        id: 1,
        checklistName: "Payroll Checklist",
        taskName: "Complete Employee Onboarding",
        dueDate: "2025-02-10",
        completionDate: "2025-02-15",
        progress: 80, // Percentage
        members: [982, 983, 984, 985, 982, 983],
        subCount: 3
    },
    {
        id: 2,
        checklistName: "Payroll Checklist",
        taskName: "Payroll Processing",
        dueDate: "2025-02-15",
        completionDate: "",
        progress: 60, // Percentage
        members: [986, 987, 988, 989],
        subCount: 2
    },
    {
        id: 3,
        checklistName: "Onboarding Checklist",
        taskName: "Intern Orientation",
        dueDate: "2025-02-20",
        completionDate: "2025-02-12",
        progress: 40, // Percentage
        members: [990, 991, 992, 993],
        subCount: 3
    },
    {
        id: 4,
        checklistName: "Onboarding Checklist",
        taskName: "IT System Setup",
        dueDate: "2025-02-25",
        completionDate: "",
        progress: 90, // Percentage
        members: [994, 995, 996, 997],
        subCount: 2
    },
    {
        id: 5,
        checklistName: "Onboarding Checklist",
        taskName: "HR Policy Review",
        dueDate: "2025-02-28",
        completionDate: "2025-02-06",
        progress: 50, // Percentage
        members: [998, 999, 1000, 1001],
        subCount: 2
    }
];


const subTasks = [
    { id: 1, taskId: 1, subtaskName: "Submit ID Proof", dueOn: "2025-02-05", assignTo: "John Doe", validator: "HR Manager", progress: 100 },
    { id: 2, taskId: 1, subtaskName: "Upload Resume", dueOn: "2025-02-06", assignTo: "Alice Smith", validator: "HR Manager", progress: 80 },
    { id: 3, taskId: 1, subtaskName: "Set Up Laptop", dueOn: "2025-02-22", assignTo: "Emma Wilson", validator: "IT Team", progress: 90 },
    { id: 4, taskId: 1, subtaskName: "Create Email Account", dueOn: "2025-02-23", assignTo: "David Clark", validator: "IT Team", progress: 50 },
    { id: 5, taskId: 2, subtaskName: "Verify Salary Details", dueOn: "2025-02-10", assignTo: "Jane Smith", validator: "Finance Team", progress: 10 },
    { id: 6, taskId: 2, subtaskName: "Update Tax Forms", dueOn: "2025-02-12", assignTo: "Bob Johnson", validator: "Finance Team", progress: 10 },
    { id: 7, taskId: 3, subtaskName: "Update Tax Forms", dueOn: "2025-02-12", assignTo: "Bob Johnson", validator: "Finance Team", progress: 60 },
    { id: 8, taskId: 3, subtaskName: "Assign Mentor", dueOn: "2025-02-15", assignTo: "Mike Brown", validator: "HR Team", progress: 80 },
    { id: 9, taskId: 3, subtaskName: "Complete Training", dueOn: "2025-02-18", assignTo: "Sarah Lee", validator: "HR Team", progress: 90 },
    { id: 10, taskId: 5, subtaskName: "Review Leave Policy", dueOn: "2025-02-26", assignTo: "Olivia Taylor", validator: "HR Manager", progress: 100 },
    { id: 11, taskId: 5, subtaskName: "Update Handbook", dueOn: "2025-02-27", assignTo: "Chris Martin", validator: "HR Manager", progress: 25 }
];

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
            taskData: taskData,
        };
    }
    // componentDidMount() {
    //     this.fetchList();
    // }

    fetchList = () => {
        // getTaskList(this.state.q, this.state.page, this.state.size, this.state.sort, this.props.employyeId).then(res => {
        //        if (res.status == "OK") {
        //          this.setState({
        //            data: res.data.list,
        //            totalPages: res.data.totalPages,
        //            totalRecords: res.data.totalRecords,
        //            currentPage: res.data.currentPage + 1
        //          })
        //        }
        //      })

    }
    fetchSubTask = (id) => {
        // getSubtaskList(this.state.q, this.state.page, this.state.size, this.state.sort , id).then(res => {
        //        if (res.status == "OK") {
        //          this.setState({
        //            data: res.data.list,
        //            totalPages: res.data.totalPages,
        //            totalRecords: res.data.totalRecords,
        //            currentPage: res.data.currentPage + 1
        //          })
        //        }
        //      })

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
                        const allTaskIds = taskData.map(task => task.id);
                        const allSubTaskIds = subTasks.map(subtask => subtask.id);
                        const saveTasks = { id: allTaskIds, status: checked };
                        // updateAllTaskStatus(saveTasks).then(res => {
                        //     if (res.status == "OK") {
                        //         toast.success(res.message);
                        //         this.fetchList();
                        //     } else {
                        //         toast.error(res.message)
                        //     }
                        // })

                        if (checked) {
                            this.setState({
                                selectedTasks: allTaskIds,
                                selectedSubTasks: allSubTaskIds,
                                taskData: taskData.map(task => ({ ...task, progress: 100 })) // Set all task progress to 100
                            });
                        } else {
                            this.setState({
                                selectedTasks: [],
                                selectedSubTasks: [],
                                taskData: taskData.map(task => ({ ...task, progress: 0 })) // Reset all task progress to 0
                            });
                        }
                    },
                }
            ]
        });
    };

    handleTaskSelect = (taskId) => {
        this.setState((prevState) => {
            const isSelected = prevState.selectedTasks.includes(taskId);
            const selectedTasks = isSelected
                ? prevState.selectedTasks.filter(id => id !== taskId)
                : [...prevState.selectedTasks, taskId];

            const relatedSubTasks = subTasks.filter(subtask => subtask.taskId === taskId).map(subtask => subtask.id);
            const selectedSubTasks = isSelected
                ? prevState.selectedSubTasks.filter(id => !relatedSubTasks.includes(id))
                : [...prevState.selectedSubTasks, ...relatedSubTasks];
            const saveTask = { id: taskId, status: !isSelected };
            updateTaskStatus(saveTask).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                    this.fetchList();
                } else {
                    toast.error(res.message);
                }
            })

            return { selectedTasks, selectedSubTasks };
        }, this.updateTaskProgress);
    };

    handleSubTaskSelect = (subTaskId) => {
        this.setState((prevState) => {
            const isSelected = prevState.selectedSubTasks.includes(subTaskId);
            const selectedSubTasks = isSelected
                ? prevState.selectedSubTasks.filter(id => id !== subTaskId)
                : [...prevState.selectedSubTasks, subTaskId];
            const saveTask = { id: subTaskId, status: !isSelected };
            updateTaskStatus(saveTask).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                    this.fetchList();
                } else {
                    toast.error(res.message);
                }
            })

            return { selectedSubTasks };
        }, this.updateTaskProgress);
    };

    updateTaskProgress = () => {
        const taskProgress = taskData.map(task => {
            const relatedSubTasks = subTasks.filter(subtask => subtask.taskId === task.id);
            const completedSubTasks = relatedSubTasks.filter(subtask => this.state.selectedSubTasks.includes(subtask.id));
            const progress = (completedSubTasks.length / relatedSubTasks.length) * 100;
            return { ...task, progress: progress || 0 };
        });
        this.setState({ taskData: taskProgress });
    };

    hideForm = () => {
        this.setState({
            showForm: false,
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
                                <EmployeeProfilePhoto className="checklistTaskProf" id={982} />
                                <div className="checklistTaskHeader-details">
                                    <span className="checklistTaskHeader-name">John Doe</span>
                                    <span className="checklistTaskHeader-title">Software Engineer</span>
                                </div>
                            </div>

                            <div className="checklistTaskHeader-right">

                                <p onClick={() => this.props.handlePage('checklist')} className="checklistTaskViewHeaderBtn">
                                    <i className="fa fa-arrow-left" aria-hidden="true"></i> Back
                                </p>
                                <div className="checklistTask_progress-section">
                                    <div className='checklistProgHead'>
                                        <span className="checklistTask_progress-title">OVERALL PROGRESS</span>
                                        <span className="checklistTask_progress-percentage">{75}%</span>
                                    </div>

                                    <div className="checklistTask_progress-bar">
                                        <div className="checklistTask_progress-fill" style={{ backgroundColor: getColorByAchievement(75), width: `${75}%` }}></div>
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
                                                checked={this.state.selectedTasks.length === taskData.length && this.state.selectedSubTasks.length === subTasks.length}
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
                                    {taskData.length > 0 ? null : (
                                        <tr>
                                            <td colSpan="8">
                                                <Empty />
                                            </td>
                                        </tr>
                                    )}
                                    {this.state.taskData?.map((item, index) => {
                                        const isExpanded = expandedRows[item.id];
                                        const taskStyle = this.state.selectedTasks.includes(item.id) ? { textDecoration: 'line-through' } : {};
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
                                                            onChange={() => this.handleTaskSelect(item.id)}
                                                            checked={this.state.selectedTasks.includes(item.id)}
                                                        />
                                                    </td>
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
                                                    <td style={{ width: '380px', ...taskStyle }} className='GoalName_tab' >
                                                        <div>

                                                            <div className="goal-title ">{this.reduceString(item.taskName, 45)}</div>


                                                            <div className="goal-details">
                                                                <IoIosGitMerge /> {item.subCount} Subtask
                                                            </div>

                                                        </div>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>{getReadableDate(item.dueDate)}</td>
                                                    <td style={{ textAlign: 'center' }}>{getReadableDate(item.completionDate)}</td>
                                                    <td style={{ width: '235px' }}>
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
                                                    {/* <td style={{ textAlign: 'center' }}><EmployeeProfilePhoto className='multiSelectImgSize' id={982}></EmployeeProfilePhoto></td> */}
                                                    <td style={{ textAlign: 'center' }}>
                                                        <Avatar.Group
                                                            max={{
                                                                count: 4,
                                                                style: { color: '#f56a00', backgroundColor: '#fde3cf' },
                                                            }}
                                                        >
                                                            {item.members.slice(0, 3).map((memberId, index) => (
                                                                <Avatar style={{ backgroundColor: '#87d068' }} icon={<EmployeeProfilePhoto className="" id={memberId} />} />
                                                            ))}

                                                            {item.members.length > 3 && (
                                                                <Tooltip
                                                                    title={item.members.slice(3).map((memberId, index) => (
                                                                        <Avatar key={index} style={{ backgroundColor: '#1677ff' }} icon={<EmployeeProfilePhoto className="" id={memberId} />} />
                                                                    ))}
                                                                    placement="top"
                                                                >
                                                                    <Avatar style={{ backgroundColor: '#ffb586', color: '#5f4115' }}>
                                                                        +{item.members.length - 3}
                                                                    </Avatar>
                                                                </Tooltip>
                                                            )}
                                                        </Avatar.Group>
                                                    </td>
                                                    <td onClick={() => this.setState({ showForm: true })} style={{ textAlign: 'center', cursor: 'pointer' }}><AiOutlineFolderView className='checklistViewBtn' size={25} /></td>

                                                </tr>
                                                {isExpanded && (
                                                    subTasks?.filter((sub) => sub.taskId === item.id).map((sub) => {
                                                        const subTaskStyle = this.state.selectedSubTasks.includes(sub.id) ? { textDecoration: 'line-through' } : {};
                                                        return (
                                                            <tr className='subGoals_table_row' key={sub.id}>
                                                                <td className='p-1' colSpan={6}>
                                                                    <div className="sub-CheckListTask">
                                                                        <table style={{ width: '100%' }}>

                                                                            <tbody style={{ height: '40px' }}>
                                                                                <td style={{ textAlign: 'center', width: '40px' }}>
                                                                                    <Checkbox
                                                                                        onChange={() => this.handleSubTaskSelect(sub.id)}
                                                                                        checked={this.state.selectedSubTasks.includes(sub.id)}
                                                                                    />
                                                                                </td>
                                                                                <td style={{ width: '280px', ...subTaskStyle }} className='GoalName_tab p-0' >
                                                                                    <div className='ml-3'>
                                                                                        <div className="goal-title">{this.reduceString(sub.subtaskName, 30)}</div>


                                                                                    </div>
                                                                                </td>
                                                                                <td >{getReadableDate(sub.dueOn)}</td>
                                                                                <td>{getReadableDate(item.completionDate)}</td>
                                                                                <td style={{ textAlign: 'center' }}>
                                                                                    <Avatar.Group
                                                                                        max={{
                                                                                            count: 4,
                                                                                            style: { color: '#f56a00', backgroundColor: '#fde3cf' },
                                                                                        }}
                                                                                    >
                                                                                        {item.members.slice(0, 3).map((memberId, index) => (
                                                                                            <Avatar style={{ backgroundColor: '#87d068' }} icon={<EmployeeProfilePhoto className="" id={memberId} />} />
                                                                                        ))}

                                                                                        {item.members.length > 3 && (
                                                                                            <Tooltip
                                                                                                title={item.members.slice(3).map((memberId, index) => (
                                                                                                    <Avatar key={index} style={{ backgroundColor: '#1677ff' }} icon={<EmployeeProfilePhoto className="" id={memberId} />} />
                                                                                                ))}
                                                                                                placement="top"
                                                                                            >
                                                                                                <Avatar style={{ backgroundColor: '#ffb586', color: '#5f4115' }}>
                                                                                                    +{item.members.length - 3}
                                                                                                </Avatar>
                                                                                            </Tooltip>
                                                                                        )}
                                                                                    </Avatar.Group>
                                                                                </td>
                                                                                <td onClick={() => this.setState({ showForm: true })} style={{ textAlign: 'center', cursor: 'pointer' }}><AiOutlineFolderView className='checklistViewBtn' size={25} /></td>



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
                        <TaskAuditHistory  >
                        </TaskAuditHistory>
                    </Body>
                </Modal>
            </div>
        );
    }
}
