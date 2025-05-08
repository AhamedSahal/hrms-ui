import React, { Component } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import OffboardTaskForm from './taskForm';
import { Avatar, Empty, Tooltip } from 'antd';
import OffboardSubTaskForm from './subTaskFrom';
import OffboardMSTaskForm from './taskForm';
import EmployeeProfilePhoto from '../../../Employee/widgetEmployeePhoto';
const { Header, Body } = Modal;

const tasks = [
    {
        id: 1,
        name: "Exit Interview",
        description: "Conduct an exit interview to gather feedback and insights.",
        active: true,
        assign: "2",
        taskCreationTime: "3",
        departments: [56, 76],
    },
    {
        id: 2,
        name: "System Access Revocation",
        description: "Disable email, revoke software access, and remove workstation credentials.",
        active: true,
        assign: "location",
        taskCreationTime: "onExit",
        branches: [35, 44],
    },
    {
        id: 3,
        name: "Final Clearance & Asset Return",
        description: "Ensure return of company assets and complete final HR paperwork.",
        active: false,
        assign: "employee",
        taskCreationTime: "onExit",
        employeeId: [409, 413],
    },
];

const subtasks = [
    {
        id: 1.1,
        taskId: 1,
        name: "Complete Exit Interview Form",
        active: false,
    },
    {
        id: 1.2,
        taskId: 1,
        name: "Attend Exit Interview Meeting",
        active: true,
    },
    {
        id: 2.1,
        taskId: 2,
        name: "Deactivate Work Email",
        active: true,
    },
    {
        id: 2.2,
        taskId: 2,
        name: "Remove Software Access",
        active: false,
    },
    {
        id: 3.1,
        taskId: 3,
        name: "Return Company Laptop & ID",
        active: true,
    },
    {
        id: 3.2,
        taskId: 3,
        name: "Submit Final Paperwork",
        active: true,
    },
];


class OffboardMSTaskView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subTaskData: [],
            active: true,
            isEditing: false,
            taskList: tasks || [],
            expandedRows: {},
        };
    }

    componentDidMount() {
        this.fetchList();
    }

    fetchList = () => {
        // getOffboardMSTaskList(this.props.id).then(res => {
        //     if (res.status == "OK") {
        //       this.setState({
        //         taskList: res.data.list,
        //       })
        //     }
        //   })
    }

    toggleEdit = () => {
        this.setState(prevState => ({
            isEditing: !prevState.isEditing
        }));
    }

    hideForm = () => {
        this.setState({
            showForm: false,
            taskData: undefined
        });
    }

    updateList = (taskData) => {
        let { taskList } = this.state;
        let index = taskList.findIndex(d => d.id === taskData.id);
        if (index > -1)
            taskList[index] = taskData;
        else {
            taskList = [taskData, ...taskList];
        }
        this.setState({ taskList }, () => {
            this.hideForm();
        });
    }
    updateTaskList = (subTask) => {
        let { subTaskData } = this.state;
        let index = subTaskData.findIndex(d => d.id === subTask.id);
        if (index > -1)
            subTaskData[index] = subTask;
        else {
            subTaskData = [subTask, ...subTaskData];
        }
        this.setState({ subTaskData }, () => {
            this.hidesubtaskForm();
        });
    }

    hidesubtaskForm = () => {
        this.setState({
            showSubtaskForm: false,
            subTask: undefined

        });
    }

    handleInputChange = (e, id) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            taskList: prevState.taskList.map(task =>
                task.id === id ? { ...task, [name]: value } : task
            ),
        }));
    };

    subTaskExpand = (id) => {
        // getOffboardSubtaskList(id).then(res => {
        //     if (res.status == "OK") {
        //         this.setState({
        //             subTaskData: res.data.list,
        //         })
        //     }
        // })
    };



    reduceString = (str, length) => {
        return str.length > length ? str.substring(0, length) + '...' : str;
    }

    render() {
        const { isEditing, taskList, expandedRows } = this.state;
        const checklist = this.props.viewData;
        return (
            <div className="">
                <div className='onboardPageHead ' >
                    <div className=''>
                        <div style={{ height: '80px' }} className="goalHeader-container">
                            <div className="onboardTaskHead-section">
                                <div>
                                    <h3 className='mb-0'>Tasks</h3>
                                    <span style={{ color: '#39649d' }}>
                                        Under: {checklist.name}</span>
                                </div>

                                <div className="mt-2 d-flex float-right col-auto ml-auto">
                                    <div className="add-goals-dropdown">
                                        <button style={{width: '95px'}} className="add-goals-btn">+ Add</button>
                                        <div className="Goal_dropdown-menu">
                                            <button onClick={() => {
                                                this.setState({
                                                    showForm: true
                                                })
                                            }}>Add Task</button>
                                            <button onClick={() => {
                                                this.setState({
                                                    showSubtaskForm: true
                                                })
                                            }}>Add Subtask</button>
                                        </div>
                                    </div>
                                    <div className="goalAuditTopBtn">
                                        <p onClick={() => this.props.openChecklistView(null, 'table')} className="goalsViewHeaderBtn">
                                            <i className="fa fa-arrow-left" aria-hidden="true"></i> Back
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="Goals_table-container">
                        <table className="goals-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Due date</th>
                                    <th>Assign To</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {taskList.length > 0 ? null : (
                                    <tr>
                                        <td colSpan="6">
                                            <Empty />
                                        </td>
                                    </tr>
                                )}
                                {taskList.map((item) => {
                                    const isExpanded = expandedRows[item.id];
                                    return (
                                        <>
                                            <tr className='Goals_table_row' key={item.id}>
                                                <td>
                                                    <div style={{ cursor: 'pointer', placeSelf: 'center', fontSize: '20px' }}>
                                                        <i onClick={() => {
                                                            this.subTaskExpand(item.id)
                                                            this.setState((prevState) => ({
                                                                expandedRows: {
                                                                    [item.id]: !prevState.expandedRows[item.id], // Toggle the state for the clicked ID
                                                                },
                                                            }));
                                                        }
                                                        } className={`fa ${isExpanded ? 'fa-angle-up' : 'fa-angle-down'}`} aria-hidden="true"></i>
                                                    </div>
                                                </td>
                                                <td style={{ width: '380px' }} className='GoalName_tab'>
                                                    <div>
                                                        <Tooltip title={<><strong style={{ textDecoration: 'underline' }}>{item.name}</strong><br />{item.description}</>}>
                                                            <div className="goal-title">{this.reduceString(item.name, 45)}</div>
                                                        </Tooltip>
                                                        <div className="goal-details">
                                                            2 Subtask
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>5 days After LWD</td>
                                                {item.employeeId ? <td >
                                                    <Avatar.Group
                                                        max={{
                                                            count: 3,
                                                            style: { color: '#f56a00', backgroundColor: '#fde3cf' },
                                                        }}
                                                    >
                                                        {item.employeeId.slice(0, 3).map((memberId, index) => (
                                                            <Avatar key={index} style={{ backgroundColor: '#1677ff' }} icon={<EmployeeProfilePhoto className="" id={memberId} />} />
                                                        ))}

                                                        {item.employeeId.length > 3 && (
                                                            <Tooltip
                                                                title={item.members.slice(3).map((memberId, index) => (
                                                                    <Avatar key={index} style={{ backgroundColor: '#1677ff' }} icon={<EmployeeProfilePhoto className="" id={memberId} />} />
                                                                ))}
                                                                placement="top"
                                                            >
                                                                <Avatar style={{ backgroundColor: '#ffb586', color: '#5f4115' }}>
                                                                    +{item.employeeId.length - 3}
                                                                </Avatar>
                                                            </Tooltip>
                                                        )}
                                                    </Avatar.Group>
                                                </td> : <td>HR Department</td>}
                                                <td >
                                                    <span
                                                        className={item.active
                                                            ? "badge bg-inverse-info"
                                                            : "badge bg-inverse-secondary"
                                                        }
                                                    >
                                                        {item.active ? (
                                                            <i className="pr-2 fa fa-circle text-info"></i>
                                                        ) : (
                                                            <i className="pr-2 fa fa-remove text-secondary"></i>
                                                        )}
                                                        {item.active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div className="">
                                                        <i className="menuIconFa fa fa-pencil-square-o"
                                                            onClick={() => { this.setState({ showForm: true, taskData: item }) }} aria-hidden="true"></i>
                                                    </div>
                                                </td>
                                            </tr>

                                            {isExpanded && (
                                                subtasks?.filter(sub => sub.taskId === item.id).map((sub) => (
                                                    <tr key={sub.id}>
                                                        <td className='p-1' colSpan={5}>
                                                            <div className="Onboardsub-Task">
                                                                <table style={{ width: '100%' }} >
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ width: '300px' }} className='GoalName_tab p-0'>
                                                                                <div className='ml-3'>
                                                                                    <Tooltip title={sub.name}>
                                                                                        <div className="goal-title">{this.reduceString(sub.name, 30)}</div>
                                                                                    </Tooltip>
                                                                                </div>
                                                                            </td>
                                                                            <td>Due Date: 20-07-2025</td>
                                                                            {item.employeeId ? <td >
                                                                                <Avatar.Group
                                                                                    max={{
                                                                                        count: 3,
                                                                                        style: { color: '#f56a00', backgroundColor: '#fde3cf' },
                                                                                    }}
                                                                                >
                                                                                    {item.employeeId.slice(0, 3).map((memberId, index) => (
                                                                                        <Avatar key={index} style={{ backgroundColor: '#1677ff' }} icon={<EmployeeProfilePhoto className="" id={memberId} />} />
                                                                                    ))}

                                                                                    {item.employeeId.length > 3 && (
                                                                                        <Tooltip
                                                                                            title={item.members.slice(3).map((memberId, index) => (
                                                                                                <Avatar key={index} style={{ backgroundColor: '#1677ff' }} icon={<EmployeeProfilePhoto className="" id={memberId} />} />
                                                                                            ))}
                                                                                            placement="top"
                                                                                        >
                                                                                            <Avatar style={{ backgroundColor: '#ffb586', color: '#5f4115' }}>
                                                                                                +{item.employeeId.length - 3}
                                                                                            </Avatar>
                                                                                        </Tooltip>
                                                                                    )}
                                                                                </Avatar.Group>
                                                                            </td> : <td>HR Department</td>}
                                                                            <td style={{ textAlign: 'center' }}>
                                                                                <span
                                                                                    className={sub.active
                                                                                        ? "badge bg-inverse-info"
                                                                                        : "badge bg-inverse-secondary"
                                                                                    }
                                                                                >
                                                                                    {sub.active ? (
                                                                                        <i className="pr-2 fa fa-circle text-info"></i>
                                                                                    ) : (
                                                                                        <i className="pr-2 fa fa-remove text-secondary"></i>
                                                                                    )}
                                                                                    {sub.active
                                                                                        ? "Active"
                                                                                        : "Inactive"}
                                                                                </span>
                                                                            </td>
                                                                            <td style={{ textAlign: 'center' }}>
                                                                                <div className="">
                                                                                    <i className="menuIconFa fa fa-pencil-square-o" onClick={() => this.setState({ showSubtaskForm: true, subTask: sub })} aria-hidden="true"></i>
                                                                                </div>
                                                                            </td>

                                                                        </tr>
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
                            </tbody>
                        </table>
                    </div>
                </div>
                <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm}>
                    <Header closeButton>
                        <h5 className="modal-title">{this.state.taskData ? 'Edit' : 'Add'} Task</h5>
                    </Header>
                    <Body>
                        <OffboardMSTaskForm taskData={this.state.taskData} updateList={this.updateTaskList} >
                        </OffboardMSTaskForm>
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"md"} show={this.state.showSubtaskForm} onHide={this.hidesubtaskForm}>
                    <Header closeButton>
                        <h5 className="modal-title">{this.state.subTask ? 'Edit' : 'Add'} Subtask</h5>
                    </Header>
                    <Body>
                        <OffboardSubTaskForm updateList={this.updateList} subTask={this.state.subTask}>
                        </OffboardSubTaskForm>
                    </Body>
                </Modal>
            </div >
        );
    }
}

export default OffboardMSTaskView;
