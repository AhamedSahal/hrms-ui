import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FormGroup } from 'reactstrap';
import { saveOnboardMSSubTask, saveOnboardMSTask } from './service';
import { toast } from 'react-toastify';
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
          console.log("task tested for active:s ")
                console.log("task tested for active: ",this.props.taskData)
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

    onChangeTaskAssign(event, setFieldValue) {
        this.setState({ taskAssign: event.target.value });
        if (event.target.value === "2") {
            setFieldValue("departments", []);
            setFieldValue("branches", []);
        }
    }

    onChangeSubtaskAssign(event, index,setFieldValue) {
        const subtaskAssign = [...this.state.subtaskAssign];
        subtaskAssign[index] = event.target.value;
        this.setState({ subtaskAssign });
         if (event.target.value === "2") {
            setFieldValue(`subtasks[${index}].departments`, []);
            setFieldValue(`subtasks[${index}].branches`, []);
        }
    }

    onChangeSubtaskAssign(event, index, setFieldValue, setFieldTouched) {
        const value = event.target.value;

        const subtaskAssign = [...this.state.subtaskAssign];
        subtaskAssign[index] = value;
        this.setState({ subtaskAssign });


        setFieldValue(`subtasks[${index}].assign`, value);
        setFieldValue(`subtasks[${index}].departments`, []);
        setFieldValue(`subtasks[${index}].branches`, []);
        setFieldValue(`subtasks[${index}].employeeId`, []);

        if (value === "0") {
            setFieldTouched(`subtasks[${index}].departments`, true);
        } else if (value === "1") {
            setFieldTouched(`subtasks[${index}].branches`, true);
        } else if (value === "2") {
            setFieldTouched(`subtasks[${index}].employeeId`, true);
        }
    }


    save = (data, action) => {
        const onboardMSTaskList = {
            checklistId: this.props.checklist.id,
            id: data.id,
            name: data.name,
            description: data.description,
            active: this.state.active,
            assignId: data.assign,
            dueOn: data.dueOn,
            numberofDays: data.numberofDays
        };

        if (data.employeeId && data.employeeId.length > 0) {
            let employeeIdArray = [];
            if (Array.isArray(data.employeeId)) {
                employeeIdArray = data.employeeId;
            } else if (typeof data.employeeId === 'string') {
                employeeIdArray = data.employeeId.split(',').map(id => Number(id.trim()));
            }
            onboardMSTaskList.employeeId = employeeIdArray.join(", ");
        }
        if (data.departments && data.departments.length > 0) {

            const departmentsArray = Array.isArray(data.departments)
                ? data.departments
                : typeof data.departments === 'string'
                    ? this.state.department.filter(d => data.departments.split(',').map(id => id.trim()).includes(String(d.id)))
                    : [];

            let arr = departmentsArray.map(dept => dept.id);
            let arrname = departmentsArray.map(dept => dept.name);
            onboardMSTaskList.departments = arr.join(", ");
        }
        if (data.branches && data.branches.length > 0) {
            const branchesArray = Array.isArray(data.branches)
                ? data.branches
                : typeof data.branches === 'string'
                    ? this.state.branches.filter(d => data.branches.split(',').map(id => id.trim()).includes(String(d.id)))
                    : [];

            let arr = branchesArray.map(brnch => brnch.id);
            let arrname = branchesArray.map(brnch => brnch.name);
            onboardMSTaskList.branches = arr.join(", ");
        }

        action.setSubmitting(true);
        saveOnboardMSTask(onboardMSTaskList).then(res => {
            if (res.status == "OK") {
                if (data.id == 0) {
                    this.handleSubTaskData(res.data.id, data)
                }
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Task");

            action.setSubmitting(false);
        })

    };

    handleSubTaskData = (id, data) => {
        data.subtasks.map(subtask => {
            const subtaskData = {
                taskId: id,
                id: subtask.id,
                name: subtask.name,
                active: subtask.active,
                assignId: subtask.assign,
                assign: subtask.assign,
                dueOn: subtask.dueOn,
                numberofDays: subtask.numberofDays
            };
            if (subtask.employeeId && subtask.employeeId.length > 0) {
                let arr = subtask.employeeId;
                subtaskData.employeeId = arr.join(", ");
            }
            if (subtask.departments && subtask.departments.length > 0) {
                let arr = subtask.departments.map(dept => dept.id);
                subtaskData.departments = arr.join(", ");
            }
            if (subtask.branches && subtask.branches.length > 0) {
                let arr = subtask.branches.map(brnch => brnch.id);
                subtaskData.branches = arr.join(", ");
            }

            saveOnboardMSSubTask(subtaskData).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
                // action.setSubmitting(false)
            }).catch(err => {
                toast.error("Error while saving Subtask");
                // action.setSubmitting(false);
            })
        })
    }

    render() {
        const { active, taskAssign, subtaskAssign, subtaskBranches, subtaskDepartments } = this.state;
        let options = [];
        if (taskAssign === '1') {
            options.push(...this.state.branches);
        } else if (taskAssign === '0') {
            options.push(...this.state.department);
        }

        const CustomSelect = ({ field, setFieldValue }) => {
            const { name, value } = field;

            let selectedOptions = [];

            if (typeof value === "string") {
                const ids = value.split(",").map(id => id.trim()).filter(id => id !== "");
                selectedOptions = options.filter(opt => ids.includes(String(opt.id)));
            } else if (Array.isArray(value)) {
                selectedOptions = value;
            }


            const handleChange = (data) => {
                const ids = data.map(option => option.id);
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
                    value={selectedOptions}
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
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue,
                        setSubmitting,
                        setFieldTouched
                    }) => (
                        <Form autoComplete='off'>
                            <div className='row'>
                                <FormGroup className='col-md-6'>
                                    <label style={{ fontWeight: 700 }} htmlFor="name">Task Name<span style={{ color: "red" }}>*</span></label>
                                    <Field name="name" className="form-control" />
                                    <ErrorMessage style={{ color: 'red' }} name="name" component="div" />
                                </FormGroup>
                                <FormGroup style={{ placeItems: 'center', alignContent: 'center' }} className='col-md-6'>
                                    <div name="active" className="toggles-btn-view" id="button-container">

                                        <div id="my-button" className="toggle-button-element" style={{ transform: this.state.task.active ? 'translateX(0px)' : 'translateX(80px)' }} onClick={() => {

                                           this.setState((prevState) => ({
                                            active: !prevState.active,
                                            task: {
                                                ...prevState.task,
                                                active: !prevState.active
                                            }
                                            }));
                                            setFieldValue("active", active);
                                        }}>
                                            <p className='m-0 self-btn'>{this.state.task.active ? 'Active' : 'Inactive'}</p>

                                        </div>
                                        <p className='m-0 team-btn' style={{ transform: this.state.task.active ? 'translateX(-10px)' : 'translateX(-80px)' }}>{this.state.task.active ? 'Inactive' : 'Active'}</p>
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
                                    this.onChangeTaskAssign(e, setFieldValue);
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
                                                defaultValue={values.employeeId || []}
                                            />
                                            <ErrorMessage name="employeeId">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
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
                                <div className='d-flex mb-2' onChange={(e) => {
                                    setFieldValue("dueOn", e.target.value);
                                }}>
                                    <Field className='mr-1' type="radio" value="1" name="dueOn" /> Before Joining
                                    <Field className='ml-4 mr-1' type="radio" value="2" name="dueOn" /> After Joining
                                    <Field className='ml-4 mr-1' type="radio" value="3" name="dueOn" /> Date of Joining
                                </div>
                                <ErrorMessage name="dueOn" style={{ color: 'red' }} component="div" />
                            </FormGroup>
                            {values.dueOn && values.dueOn !== '3' && (
                                <FormGroup>
                                    <label>Enter number of days<span style={{ color: "red" }}>*</span></label>
                                    <Field name="numberofDays" type="number" className="form-control" min="0" step="1"
                                        onKeyDown={(e) => {
                                            const invalidChars = ['e', 'E', '+', '-', '.'];
                                            if (invalidChars.includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }} required />
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
                                                <i className={`fa fa-2x ${!active ? 'fa-toggle-off text-danger' : subtask.active ? 'fa-toggle-on text-success' : 'fa-toggle-off text-danger'}`}></i>
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
                                                this.onChangeSubtaskAssign(e, index, setFieldValue, setFieldTouched);
                                                setFieldValue(`subtasks[${index}].assign`, e.target.value);
                                            }}>
                                                {/* <Field className='mr-1' type="radio" value="1" name={`subtasks[${index}].assign`} /> Everyone */}
                                                <Field className='mr-1' type="radio" value="0" name={`subtasks[${index}].assign`} /> Department
                                                <Field className='ml-4 mr-1' type="radio" value="1" name={`subtasks[${index}].assign`} /> Location
                                                <Field className='ml-4 mr-1' type="radio" value="2" name={`subtasks[${index}].assign`} /> Individual Employee

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
                                                            name={`subtasks[${index}].employeeId`}
                                                            setFieldValue={setFieldValue}
                                                            defaultValue={values.subtaskEmpId}
                                                        />
                                                        <ErrorMessage name={`subtasks[${index}].employeeId`}>
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
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
                                                <Field name={`subtasks[${index}].numberofDays`} type="number" className="form-control" />
                                                <ErrorMessage style={{ color: 'red' }} name={`subtasks[${index}].numberofDays`} component="div" />
                                            </FormGroup>
                                        )}
                                    </div>
                                ))}
                                {!this.state.task.id > 0 && active && <span onClick={() => {
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