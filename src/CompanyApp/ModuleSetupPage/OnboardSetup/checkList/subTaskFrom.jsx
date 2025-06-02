import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FormGroup } from 'reactstrap';
import Select from "react-select";
import EmployeeMultiSelectDropDown from '../../../ModuleSetup/Dropdown/EmployeeMultiSelectDropDown';
import * as Yup from 'yup';
import { saveOnboardMSSubTask } from './service';
import { toast } from 'react-toastify';

import EmpMultiSelectDropDown from '../../../ModuleSetup/Dropdown/EmpMultiSelectDropDown';
import { getBranchLists, getDepartmentLists, getFunctionLists } from '../../../Performance/ReviewCycle/CycleForms/service';

const subTaskValidationSchema = Yup.object().shape({
    selectedTask: Yup.string().required('Please select Task'),
    name: Yup.string().required('Subtask Name is required')
    .max(200, 'Sub Task name should be up to 200 characters.')
    .matches(
      /^[a-zA-Z0-9 _.,\-(){}\[\]/']+$/,
      "Sub Task name contains only letters, numbers, space, _ , . - ( ) { } [ ] / '"
    ),
    assign: Yup.string().required('Assign To is required'),
    dueOn: Yup.string().required('Due Date is required'),
    // numberofDays: Yup.number().when('dueOn', {
    //     is: (value) => value && value !== 'onJoining',
    //     then: Yup.number().required('Number of days is required')
    // })
});

class OnboardSubTaskForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            function: [],
            department: [],
            branch: [],
            taskId: this.props?.taskId || 0,
            assign: this.props.subTask?.assign,
            subTask: this.props.subTask || {
                id: 0,
                active: true,
                name: '',
                assign: '',
                dueOn: '',
                numberofDays: '',
                selectedTask: '',
                function: [],
                department: [],
                branch: [],

            }
        };
    }

    componentDidMount() {
        getBranchLists().then(res => {
            if (res.status == "OK") {
                this.setState({
                    branch: res.data,
                }, () => {
                    if (this.props.subTask?.branches != null) {
                        const brancheData = res.data.filter(br => this.props.subTask.branches.split(',').map(Number).includes(br.id));
                        let { subTask } = this.state;
                        subTask.branches = brancheData
                        this.setState({ subTask });
                    }

                })
            }
        })
        getDepartmentLists().then(res => {
            if (res.status == "OK") {
                this.setState({
                    department: res.data,
                }, () => {
                    if (this.props.subTask?.departments != null) {
                        const departmentData = res.data.filter(dept => this.props.subTask.departments.split(',').map(Number).includes(dept.id));
                        let { subTask } = this.state;
                        subTask.departments = departmentData
                        this.setState({ subTask });
                    }
                })
            }
        })
        getFunctionLists().then(res => {
            if (res.status == "OK") {
                this.setState({
                    function: res.data,
                })
            }
        })
    }

    onChangeTaskAssign(event) {
        this.setState({ assign: event.target.value });
    }

    save = (data, action) => {
        const subtask = {
            taskId: this.state.taskId,
            id: data.id,
            name: data.name,
            active: data.active,
            assign: data.assign,
            dueOn: data.dueOn,
            numberofDays: data.numberofDays
        };

        if (data.employeeId && data.employeeId.length > 0) {
            let arr = data.employeeId;
            subtask.employeeId = arr.join(", ");
        }
        if (data.departments && data.departments.length > 0) {
            let arr = data.departments.map(dept => dept.id);
            subtask.departments = arr.join(", ");
        }
        if (data.branches && data.branches.length > 0) {
            let arr = data.branches.map(brnch => brnch.id);
            subtask.branches = arr.join(", ");
        }
        if (data.functions && data.functions.length > 0) {
            let arr = data.functions;
            subtask.functions = arr.join(", ");
        }

        saveOnboardMSSubTask(subtask).then(res => {
            if (res.status === "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false);
        }).catch(err => {
            toast.error("Error while saving Subtask");
            action.setSubmitting(false);
        });
    };

    render() {
        const { active, assign, subTask } = this.state;

        let options = [];
        if (assign == '1') {
            options.push(...this.state.branch);
        } else if (assign == '0') {
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
                if (assign === '1') {
                    setFieldValue("departments", []);
                    setFieldValue("functions", []);
                } else if (assign === '0') {
                    setFieldValue("branches", []);
                    setFieldValue("functions", []);
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

        return (
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.subTask}
                    validationSchema={subTaskValidationSchema}
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
                        setSubmitting
                    }) => (
                        <Form autoComplete='off'>
                            {this.state.subTask.id == 0 && <FormGroup className=''>
                                <label htmlFor="selectedTask">Select task<span style={{ color: "red" }}>*</span></label>
                                <select name="selectedTask" className="form-control" onChange={e => this.setState({ taskId: e.target.value })}>
                                    <option value="">Select Task</option>
                                    {this.props.taskList?.length > 0 && this.props.taskList?.filter(e => e.active).map((res) => {
                                        return <option key={res.id} value={res.id} >{res.name}</option>
                                    })}
                                </select>
                                <ErrorMessage name="selectedTask" component="div" style={{ color: 'red' }} />
                            </FormGroup>}
                            <div className='row'>
                                <FormGroup className='col-md-6'>
                                    <label htmlFor="name">Subtask Name<span style={{ color: "red" }}>*</span></label>
                                    <Field name="name" className="form-control" />
                                    <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
                                </FormGroup>
                                <FormGroup style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className='col-md-6'>
                                    <div name="active" onClick={() => {
                                        setFieldValue("active", !values.active);
                                    }} className="toggles-btn-view" id="button-container">
                                        <div id="my-button" className="toggle-button-element" style={{ transform: values.active ? 'translateX(0px)' : 'translateX(80px)' }}>
                                            <p className='m-0 self-btn'>{values.active ? 'Active' : 'Inactive'}</p>
                                        </div>
                                        <p className='m-0 team-btn' style={{ transform: values.active ? 'translateX(-10px)' : 'translateX(-80px)' }}>{values.active ? 'Inactive' : 'Active'}</p>
                                    </div>
                                </FormGroup>
                            </div>
                            <FormGroup>
                                <label>Assign To
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <div className='d-flex' onChange={(e) => {
                                    this.onChangeTaskAssign(e);
                                    setFieldValue("assign", e.target.value);
                                }}>
                                    {/* <Field className='mr-1' type="radio" value="everyone" name="assign" /> Everyone */}
                                    <Field className='mr-1' type="radio" value="0" name="assign" /> Department
                                    <Field className='ml-4 mr-1' type="radio" value="1" name="assign" /> Location
                                    <Field className='ml-4 mr-1' type="radio" value="2" name="assign" /> Individual Employee
                                </div>
                                <ErrorMessage name="assign" component="div" style={{ color: 'red' }} />
                                {assign == '0' &&
                                    <div className='col-md-12'>
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
                                            <ErrorMessage name="departments" component="div" style={{ color: 'red' }} />
                                        </FormGroup>
                                    </div>
                                }
                                {assign == '2' &&
                                    <div className='col-md-12'>
                                        <FormGroup>
                                            <label>Select Employees
                                                <span style={{ color: "red" }}>*</span>
                                            </label>

                                            <EmpMultiSelectDropDown
                                                name="employeeId"
                                                setFieldValue={setFieldValue}
                                                defaultValue={values.employeeId || []}
                                            />
                                        </FormGroup>
                                    </div>
                                }
                                {assign == '1' &&
                                    <div className='col-md-12'>
                                        <FormGroup >
                                            <label>Select Location  <span style={{ color: "red" }}>*</span></label>
                                            <Field
                                                name="branches"
                                                component={CustomSelect}
                                                isMulti
                                                options={options}
                                                setFieldValue={setFieldValue}
                                            />
                                            <ErrorMessage name="branches" component="div" style={{ color: 'red' }} />
                                        </FormGroup>
                                    </div>
                                }
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="description">Due Date<span style={{ color: "red" }}>*</span></label>
                                <div className='d-flex mb-2' name="dueOn" onChange={(e) => {
                                    setFieldValue("dueOn", e.target.value);
                                }}>
                                    <Field className='mr-1' type="radio" value="1" name="dueOn" /> Before Joining
                                    <Field className='ml-4 mr-1' type="radio" value="2" name="dueOn" /> After Joining
                                    <Field className='ml-4 mr-1' type="radio" value="3" name="dueOn" /> Date of Joining
                                </div>
                                <ErrorMessage name="dueOn" component="div" style={{ color: 'red' }} />
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
                                        }} />
                                    <ErrorMessage name="numberofDays" component="div" style={{ color: 'red' }} />
                                </FormGroup>
                            )}
                            <input type="submit" className="btn btn-primary" value={this.state.subTask.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}

export default OnboardSubTaskForm;