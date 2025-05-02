import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FormGroup } from 'reactstrap';
import Select from "react-select";
import { getBranchLists, getDepartmentLists } from '../../../Performance/ReviewCycle/CycleForms/service';
import { taskValidationSchema } from './validation';
import EmpMultiSelectDropDown from '../../../ModuleSetup/Dropdown/EmpMultiSelectDropDown';

class OnboardMSTaskForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            taskAssign: this.props.taskData?.assign || '',
            subtaskAssign: [],
            taskname: '',
            description: '',
            active: true,
            subCheckList: [],
            function: [],
            department: [],
            branches: [],
            employeeId: this.props.taskData?.employeeId || [],
            subtaskEmpId: [],
            subtaskBranches: [],
            subtaskDepartments: [],
            task: this.props.taskData || {
                id: 0,
                active: true,
                name: '',
                description: '',
                subtasks: [],
                assign: '',
                branches: [],
                departments: [],
                functions: [],
                employeeId: [],
                numberofDays: '',
                dueOn: ''
            },


        };

    }

    componentDidMount() {
        getBranchLists().then(res => {
            if (res.status === "OK") {
                this.setState({
                    branches: res.data,
                }, () => {
                    if (this.props.taskData?.branches) {
                        const brancheData = res.data.filter(br => this.props.taskData.branches.includes(br.id));
                        this.setState(prevState => ({
                            task: {
                                ...prevState.task,
                                branches: brancheData
                            }
                        }));
                    }
                });
            }
        });
        getDepartmentLists().then(res => {
            if (res.status === "OK") {
                this.setState({
                    department: res.data,
                }, () => {
                    if (this.props.taskData?.departments) {
                        const departmentData = res.data.filter(dept => this.props.taskData.departments.includes(dept.id));
                        this.setState(prevState => ({
                            task: {
                                ...prevState.task,
                                departments: departmentData
                            }
                        }));
                    }
                });
            }
        });
        // Fetch branch and department lists for subtasks
        getBranchLists().then(res => {
            if (res.status === "OK") {
                this.setState({ subtaskBranches: res.data });
            }
        });
        getDepartmentLists().then(res => {
            if (res.status === "OK") {
                this.setState({ subtaskDepartments: res.data });
            }
        });
    }

    onChangeTaskAssign(event) {
        this.setState({ taskAssign: event.target.value });
    }

    onChangeSubtaskAssign(event, index) {
        const subtaskAssign = [...this.state.subtaskAssign];
        subtaskAssign[index] = event.target.value;
        this.setState({ subtaskAssign });
    }

    save = (data, action) => {
        const onboardMSTaskList = {
            checklistId: this.props.checklistId,
            id: data.id,
            name: data.name,
            description: data.description,
            active: data.active,
            assignId: data.assign,
            dueOn: data.dueOn,
            numberofDays: data.numberofDays
        };

        if (data.employeeId && data.employeeId.length > 0) {
            onboardMSTaskList.employeeId = data.employeeId;
        }
        if (data.departments && data.departments.length > 0) {
            onboardMSTaskList.departments = data.departments.map(dept => dept.id);
        }
        if (data.branches && data.branches.length > 0) {
            onboardMSTaskList.branches = data.branches.map(brnch => brnch.id);
        }

        action.setSubmitting(true);
        // saveOnboardMSTask(onboardMSTaskList).then(res => {
        //     if (res.status == "OK") {
        //         toast.success(res.message);
        //     } else {
        //         toast.error(res.message);
        //     }
        //     action.setSubmitting(false)
        // }).catch(err => {
        //     toast.error("Error while saving Task");

        //     action.setSubmitting(false);
        // })
        // saveOnboardMSSubTask(subtaskList).then(res => {
        //     if (res.status == "OK") {
        //         toast.success(res.message);
        //     } else {
        //         toast.error(res.message);
        //     }
        //     action.setSubmitting(false)
        // }).catch(err => {
        //     toast.error("Error while saving Subtask");

        //     action.setSubmitting(false);
        // })
    };

    render() {
        const { active, taskAssign, subtaskAssign, subtaskBranches, subtaskDepartments } = this.state;
        let options = [];
        if (taskAssign === '0') {
            options.push(...this.state.branches);
        } else if (taskAssign === '1') {
            options.push(...this.state.department);
        }

        const CustomSelect = ({ field, setFieldValue }) => {
            const { name } = field;

            const handleChange = (data) => {
                if (taskAssign === '0') {
                    setFieldValue("branches", []);
                    setFieldValue("employeeId", []);
                } else if (taskAssign === '1') {
                    setFieldValue("employeeId", []);
                    setFieldValue("departments", []);
                } else if (taskAssign === '2') {
                    setFieldValue("departments", []);
                    setFieldValue("branches", []);
                }

                setFieldValue(name, data);
            };
            return (
                <Select
                    {...field}
                    onChange={handleChange}
                    options={options}
                    isMulti
                    getOptionValue={(options) => options.id}
                    getOptionLabel={(options) => options.name}
                />
            );
        };

        const SubtaskCustomSelect = ({ field, setFieldValue, subtaskIndex }) => {
            const { name } = field;
            const subtaskAssignType = subtaskAssign[subtaskIndex];

            const handleChange = (data) => {
                if (taskAssign === '0') {
                    setFieldValue("branches", []);
                    setFieldValue("employeeId", []);
                } else if (taskAssign === '1') {
                    setFieldValue("employeeId", []);
                    setFieldValue("departments", []);
                } else if (taskAssign === '2') {
                    setFieldValue("departments", []);
                    setFieldValue("branches", []);
                }
                setFieldValue(name, data);
            };

            let subtaskOptions = [];
            if (subtaskAssignType === '1') {
                subtaskOptions = subtaskBranches;
            } else if (subtaskAssignType === '0') {
                subtaskOptions = subtaskDepartments;
            }

            return (
                <Select
                    {...field}
                    onChange={handleChange}
                    options={subtaskOptions}
                    isMulti
                    getOptionValue={(options) => options.id}
                    getOptionLabel={(options) => options.name}
                />
            );
        };

        return (
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.task}
                    validationSchema={taskValidationSchema}
                    onSubmit={this.save}
                >
                    {({
                        values,
                        setFieldValue,
                    }) => (
                        <Form autoComplete='off'>
                            <div className='row'>
                                <FormGroup className='col-md-6'>
                                    <label style={{ fontWeight: 700 }} htmlFor="name">Task Name<span style={{ color: "red" }}>*</span></label>
                                    <Field name="name" className="form-control" />
                                    <ErrorMessage style={{ color: 'red' }} name="name" component="div" />
                                </FormGroup>
                                <FormGroup style={{ placeItems: 'center', alignContent: 'center' }} className='col-md-6'>
                                    <div name="active" onClick={() => {
                                        setFieldValue("active", active);
                                        this.setState({ active: !active });
                                    }} className="toggles-btn-view" id="button-container">

                                        <div id="my-button" className="toggle-button-element" style={{ transform: active ? 'translateX(0px)' : 'translateX(80px)' }}>
                                            <p className='m-0 self-btn'>{active ? 'Active' : 'Inactive'}</p>

                                        </div>
                                        <p className='m-0 team-btn' style={{ transform: active ? 'translateX(-10px)' : 'translateX(-80px)' }}>{active ? 'Inactive' : 'Active'}</p>
                                    </div>
                                </FormGroup>
                            </div>
                            <FormGroup>
                                <label htmlFor="description">Description<span style={{ color: "red" }}>*</span></label>
                                <Field name="description" className="form-control" />
                                <ErrorMessage name="description" style={{ color: 'red' }} component="div" />
                            </FormGroup>
                            <FormGroup>
                                <label>Assign To
                                    <span style={{ color: "red" }}>*</span>
                                </label>

                                <div className='d-flex mb-2' onChange={(e) => {
                                    this.onChangeTaskAssign(e);
                                    setFieldValue("assign", e.target.value);
                                }}>
                                    {/* <Field className='mr-1' type="radio" value="1" name="assign" /> Everyone */}
                                    <Field className='mr-1' type="radio" value="0" name="assign" /> Department
                                    <Field className='ml-4 mr-1' type="radio" value="1" name="assign" /> Location
                                    <Field className='ml-4 mr-1' type="radio" value="2" name="assign" /> Individual Employee

                                </div>
                                <ErrorMessage name="assign">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                                {taskAssign === '0' &&
                                    <div className='pl-0 col-md-12'>
                                        <FormGroup >
                                            <label>Select Department
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field
                                                name="departments"
                                                component={CustomSelect}
                                                isMulti
                                                options={options}
                                                setFieldValue={setFieldValue}
                                            />
                                            <ErrorMessage name="departments">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                }
                                {taskAssign === '2' &&
                                    <div className='pl-0 col-md-12'>
                                        <FormGroup>
                                            <label>Select Employees
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <EmpMultiSelectDropDown
                                                name="employeeId"
                                                setFieldValue={setFieldValue}
                                                defaultValue={values.employeeId}
                                            />
                                        </FormGroup>
                                    </div>
                                }

                                {taskAssign === '1' &&
                                    <div className='pl-0 col-md-12'>
                                        <FormGroup >
                                            <label>Select Location  <span style={{ color: "red" }}>*</span></label>
                                            <Field
                                                name="branches"
                                                component={CustomSelect}
                                                isMulti
                                                options={options}
                                                setFieldValue={setFieldValue}
                                            />
                                            <ErrorMessage name="branches">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                }

                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="description">Due Date<span style={{ color: "red" }}>*</span></label>
                                <div className='d-flex mb-2'>
                                    <Field className='mr-1' type="radio" value="1" name="dueOn" onChange={(e) => setFieldValue("dueOn", e.target.value)} /> Before Joining
                                    <Field className='ml-4 mr-1' type="radio" value="2" name="dueOn" onChange={(e) => setFieldValue("dueOn", e.target.value)} /> After Joining
                                    <Field className='ml-4 mr-1' type="radio" value="3" name="dueOn" onChange={(e) => setFieldValue("dueOn", e.target.value)} /> Date of Joining
                                </div>
                                <ErrorMessage name="dueOn" style={{ color: 'red' }} component="div" />
                            </FormGroup>
                            {values.dueOn && values.dueOn !== '3' && (
                                <FormGroup>
                                    <label>Enter number of days<span style={{ color: "red" }}>*</span></label>
                                    <Field name="numberofDays" type="number" className="form-control" required />
                                    <ErrorMessage name="numberofDays" style={{ color: 'red' }} component="div" />
                                </FormGroup>
                            )}

                            {/* Sub task Form */}
                            <FormGroup>
                                {values.subtasks && values.subtasks.length > 0 && <label style={{ fontWeight: 700 }} >Sub Task</label>} <br />
                                {values.subtasks && values.subtasks.length > 0 && values.subtasks.map((subtask, index) => (
                                    <div className='subTaskOnboardBorder' key={index}>
                                        <div className="d-flex align-items-center mb-2">
                                            <Field name={`subtasks[${index}].name`} className="form-control mr-2" placeholder="Subtask Name" /> <br />

                                            <div type="checkbox" name={`subtasks[${index}].active`} onClick={() => {
                                                let subtasks = [...subtasks[index].active];
                                                subtasks[index].active = !subtasks[index].active;
                                                setFieldValue("subtasks", subtasks);
                                            }}>
                                                <i className={`fa fa-2x ${subtask.active ? 'fa-toggle-on text-success' : 'fa-toggle-off text-danger'}`}></i>
                                            </div>
                                            <button type="button" className="btn btn-light ml-2" onClick={() => {
                                                let subtasks = [...values.subtasks];
                                                subtasks.splice(index, 1);
                                                setFieldValue("subtasks", subtasks);
                                            }}><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                                        </div>
                                        <ErrorMessage name={`subtasks[${index}].name`}>
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                        <FormGroup>
                                            <label>Assign To
                                                <span style={{ color: "red" }}>*</span>
                                            </label>

                                            <div className='d-flex mb-2' onChange={(e) => {
                                                this.onChangeSubtaskAssign(e, index);
                                                setFieldValue(`subtasks[${index}].assign`, e.target.value);
                                            }}>
                                                {/* <Field className='mr-1' type="radio" value="1" name={`subtasks[${index}].assign`} /> Everyone */}
                                                <Field className='mr-1' type="radio" value="0" name={`subtasks[${index}].assign`} /> Department
                                                <Field className='ml-4 mr-1' type="radio" value="2" name={`subtasks[${index}].assign`} /> Location
                                                <Field className='ml-4 mr-1' type="radio" value="1" name={`subtasks[${index}].assign`} /> Individual Employee

                                            </div>
                                            <ErrorMessage name={`subtasks[${index}].assign`}>
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                            {subtaskAssign[index] === '0' &&
                                                <div className='pl-0 col-md-12'>
                                                    <FormGroup >
                                                        <label>Select Department
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field
                                                            name={`subtasks[${index}].departments`}
                                                            component={SubtaskCustomSelect}
                                                            isMulti
                                                            setFieldValue={setFieldValue}
                                                            subtaskIndex={index}
                                                        />
                                                        <ErrorMessage name={`subtasks[${index}].departments`}>
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                            }
                                            {subtaskAssign[index] === '2' &&
                                                <div className='pl-0 col-md-12'>
                                                    <FormGroup>
                                                        <label>Select Employees
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <EmpMultiSelectDropDown
                                                            name="subtaskEmpId"
                                                            setFieldValue={setFieldValue}
                                                            defaultValue={values.subtaskEmpId}
                                                        />
                                                    </FormGroup>
                                                </div>
                                            }

                                            {subtaskAssign[index] === '1' &&
                                                <div className='pl-0 col-md-12'>
                                                    <FormGroup >
                                                        <label>Select Location  <span style={{ color: "red" }}>*</span></label>
                                                        <Field
                                                            name={`subtasks[${index}].branches`}
                                                            component={SubtaskCustomSelect}
                                                            isMulti
                                                            setFieldValue={setFieldValue}
                                                            subtaskIndex={index}
                                                        />
                                                        <ErrorMessage name={`subtasks[${index}].branches`}>
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                            }

                                        </FormGroup>
                                        <FormGroup>
                                            <label htmlFor="description">Due Date<span style={{ color: "red" }}>*</span></label>
                                            <div className='d-flex'>
                                                <Field className='mr-1' type="radio" value="1" name={`subtasks[${index}].dueOn`} onChange={(e) => setFieldValue(`subtasks[${index}].dueOn`, e.target.value)} /> Before Joining
                                                <Field className='ml-4 mr-1' type="radio" value="2" name={`subtasks[${index}].dueOn`} onChange={(e) => setFieldValue(`subtasks[${index}].dueOn`, e.target.value)} /> After Joining
                                                <Field className='ml-4 mr-1' type="radio" value="3" name={`subtasks[${index}].dueOn`} onChange={(e) => setFieldValue(`subtasks[${index}].dueOn`, e.target.value)} /> Date of Joining
                                            </div>
                                            <ErrorMessage style={{ color: 'red' }} name={`subtasks[${index}].dueOn`} component="div" />
                                        </FormGroup>
                                        {subtask.dueOn && subtask.dueOn !== '3' && (
                                            <FormGroup>
                                                <label>Enter number of days<span style={{ color: "red" }}>*</span></label>
                                                <Field name={`subtasks[${index}].numberofDays`} type="number" className="form-control" required />
                                                <ErrorMessage style={{ color: 'red' }} name={`subtasks[${index}].numberofDays`} component="div" />
                                            </FormGroup>
                                        )}
                                    </div>
                                ))}
                                {!this.state.task.id > 0 && <span onClick={() => {
                                    let subtasks = values.subtasks || [];
                                    subtasks.push({ id: 0, name: '', active: true, assign: '', dueOn: '', numberofDays: '' });
                                    setFieldValue("subtasks", subtasks);
                                }} style={{ color: '#007bff', fontSize: '13px', cursor: 'pointer' }}>+ Add SubTask</span>}

                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.task.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )}
                </Formik>
            </div>

        );
    }
}

export default OnboardMSTaskForm;