import React, { Component } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getOnboardSubtaskList, getOnboardMSTaskList,getJobTitles } from './service';
import { getBranchLists, getDepartmentLists } from '../../../Performance/ReviewCycle/CycleForms/service';
import OnboardTaskForm from './taskForm';
import { Avatar, Empty, Tooltip } from 'antd';
import OnboardSubTaskForm from './subTaskFrom';
import OnboardMSTaskForm from './taskForm';
import { sub } from 'date-fns';
import EmployeeProfilePhoto from '../../../Employee/widgetEmployeePhoto';
const { Header, Body } = Modal;



class OnboardMSTaskView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subTaskData: [],
            jobtitle: [],
            department: [],
            branches: [],
            active: true,
            isEditing: false,
            taskList:  [],
            expandedRows: {},
        };
    }

    componentDidMount() {
        // this.fetchList();
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
        getOnboardMSTaskList(this.props.viewData.id).then(res => {
            if (res.status == "OK") {
            //   this.setState({
            //     taskList: res.data,
            //   })
            if(res.data.length > 0 ){
                let data = res.data.map((res) => {
                    if(res.assignId == 0 &&  this.state.department.length > 0){
                        let department =  this.state.department.filter((dept) => res.departments?.split(',').map(Number).includes(dept.id))
                        let arrname = department.map(dept => dept.name);
                        let applicableFor = arrname.join(", ");
                        return {...res,applicableFor : applicableFor}

                    }
                    if(res.assignId == 1 &&  this.state.branches.length > 0){
                        let branches =  this.state.branches.filter((dept) => res.branches?.split(',').map(Number).includes(dept.id))
                        let arrname = branches.map(dept => dept.name);
                        let applicableFor = arrname.join(", ");
                        return {...res,applicableFor : applicableFor}
                    }
                    if(res.assignId == 2){
                        return {...res,employeeId: res.employeeId.split(",").map(Number)} ;
                    }


                })
                this.setState({taskList : data})

            }else {
                this.setState({taskList : []})
            }

            
            }else{
                this.setState({taskList : []})
            }
          })
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
        getOnboardSubtaskList(id).then(res => {
            if (res.status == "OK") {
               
                if(res.data.length > 0 &&  this.state.department.length > 0){
                    let data = res.data.map((res) => {
                        if(res.assignId == 0){
                            let department =  this.state.department.filter((dept) => res.departments?.split(',').map(Number).includes(dept.id))
                            let arrname = department.map(dept => dept.name);
                            let applicableFor = arrname.join(", ");
                            return {...res,applicableFor : applicableFor}
    
                        }
                        if(res.assignId == 1 &&  this.state.branches.length > 0){
                            let branches =  this.state.branches.filter((dept) => res.branches?.split(',').map(Number).includes(dept.id))
                            let arrname = branches.map(dept => dept.name);
                            let applicableFor = arrname.join(", ");
                            return {...res,applicableFor : applicableFor}
                        }
                        if(res.assignId == 2){
                            return {...res,employeeId: res.employeeId.split(",").map(Number)} ;
                        }
    
    
                    })
                    this.setState({subTaskData : data})
    
                }else {
                    this.setState({taskList : []})
                }

                
            }else{
                this.setState({
                    subTaskData: [],
                })
            }
        })
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
                                                            {item.subgoalsCount} {item.subgoalsCount > 1?"Subtasks":"Subtask"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{item.numberofDays != 0? item.numberofDays:null} {item.dueOn == 1?"Days Before Joining":item.dueOn == 2?"Days After Joining":"Date of Joining"}</td>
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
                                                </td> : <td>{item.applicableFor}</td>}
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
                                                            onClick={() => { this.setState({ showForm: true, taskData: {...item, assign:item.assignId.toString(), dueOn: item.dueOn.toString()} }) }} aria-hidden="true"></i>
                                                    </div>
                                                </td>
                                            </tr>

                                            {isExpanded && (
                                              this.state.subTaskData.length > 0 &&  this.state.subTaskData?.map((sub) => (
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
                                                                            <td>{sub.numberofDays != 0?sub.numberofDays:null} {sub.dueOn == 1?"Days Before Joining":sub.dueOn == 2?"Days After Joining":"Date of Joining"}</td>
                                                                            {sub.employeeId ? <td >
                                                                                <Avatar.Group
                                                                                    max={{
                                                                                        count: 3,
                                                                                        style: { color: '#f56a00', backgroundColor: '#fde3cf' },
                                                                                    }}
                                                                                >
                                                                                    {sub.employeeId.slice(0, 3).map((memberId, index) => (
                                                                                         <Avatar key={index} style={{ backgroundColor: '#1677ff' }} icon={<EmployeeProfilePhoto className="" id={memberId} />} />
                                                                                    ))}

                                                                                    {sub.employeeId.length > 3 && (
                                                                                        <Tooltip
                                                                                            title={sub.employeeId.slice(3).map((memberId, index) => (
                                                                                                 <Avatar key={index} style={{ backgroundColor: '#1677ff' }} icon={<EmployeeProfilePhoto className="" id={memberId} />} />
                                                                                            ))}
                                                                                            placement="top"
                                                                                        >
                                                                                            <Avatar style={{ backgroundColor: '#ffb586', color: '#5f4115' }}>
                                                                                                +{sub.employeeId.length - 3}
                                                                                            </Avatar>
                                                                                        </Tooltip>
                                                                                    )}
                                                                                </Avatar.Group>
                                                                            </td> : <td>{sub.applicableFor}</td>}
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
                                                                                    <i className="menuIconFa fa fa-pencil-square-o" onClick={() => this.setState({ showSubtaskForm: true, subTask: {...sub,assign:sub.assignId.toString(), dueOn: sub.dueOn.toString()}, taskId : item.id })} aria-hidden="true"></i>
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
                        <OnboardMSTaskForm taskData={this.state.taskData} checklist={checklist} updateList={this.updateList} >
                        </OnboardMSTaskForm>
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"md"} show={this.state.showSubtaskForm} onHide={this.hidesubtaskForm}>
                    <Header closeButton>
                        <h5 className="modal-title">{this.state.subTask ? 'Edit' : 'Add'} Subtask</h5>
                    </Header>
                    <Body>
                        <OnboardSubTaskForm updateList={this.updateTaskList} subTask={this.state.subTask} taskList = {this.state.taskList} taskId= {this.state.taskId}>
                        </OnboardSubTaskForm>
                    </Body>
                </Modal>
            </div >
        );
    }
}

export default OnboardMSTaskView;
