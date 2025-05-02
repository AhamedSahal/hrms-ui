import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FormGroup } from 'reactstrap';
import Select from "react-select";
import EmployeeMultiSelectDropDown from '../../../ModuleSetup/Dropdown/EmployeeMultiSelectDropDown';
import * as Yup from 'yup';
import { getBranchLists, getDepartmentLists, getFunctionLists } from '../../../Performance/ReviewCycle/CycleForms/service';

const subTaskValidationSchema = Yup.object().shape({
    selectedTask: Yup.string().required('Select Task is required'),
    name: Yup.string().required('Subtask Name is required'),
    assign: Yup.string().required('Assign To is required'),
    dueOn: Yup.string().required('Due Date is required'),
    numberofDays: Yup.number().when('dueOn', {
        is: (value) => value && value !== 'onJoining',
        then: Yup.number().required('Number of days is required')
    })
});

class OnboardSubTaskForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            function: [],
            department: [],
            branch: [],
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
                })
            }
        })
        getDepartmentLists().then(res => {
            if (res.status == "OK") {
                this.setState({
                    department: res.data,
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
            id: data.id,
            name: data.name,
            active: data.active,
            assign: data.assign,
            dueOn: data.dueOn,
            numberofDays: data.numberofDays
        };

        if (data.employeeId && data.employeeId.length > 0) {
            subtask.employeeId = data.employeeId;
        }
        if (data.departments && data.departments.length > 0) {
            subtask.departments = data.departments;
        }
        if (data.branches && data.branches.length > 0) {
            subtask.branches = data.branches;
        }
        if (data.functions && data.functions.length > 0) {
            subtask.functions = data.functions;
        }

        // saveOnboardMSSubTask(subtask).then(res => {
        //     if (res.status === "OK") {
        //         toast.success(res.message);
        //     } else {
        //         toast.error(res.message);
        //     }
        //     action.setSubmitting(false);
        // }).catch(err => {
        //     toast.error("Error while saving Subtask");
        //     action.setSubmitting(false);
        // });
    };

    render() {
        const { active, assign, subTask } = this.state;

        let options = [];
        if (assign === 'location') {
            options.push(...this.state.branch);
        } else if (assign === 'department') {
            options.push(...this.state.department);
        }

        const CustomSelect = ({ field, setFieldValue }) => {
            const { name } = field;

            const handleChange = (data) => {
                if (assign === 'location') {
                    setFieldValue("departments", []);
                    setFieldValue("functions", []);
                } else if (assign === 'department') {
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
                            <FormGroup className=''>
                                <label htmlFor="selectedTask">Select task<span style={{ color: "red" }}>*</span></label>
                                <Field as="select" name="selectedTask" className="form-control">
                                    <option value="">Select Task</option>
                                    <option value="task1">Task 1</option>
                                </Field>
                                <ErrorMessage name="selectedTask" component="div" style={{ color: 'red' }} />
                            </FormGroup>
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
                                    <Field className='mr-1' type="radio" value="department" name="assign" /> Department
                                    <Field className='ml-4 mr-1' type="radio" value="location" name="assign" /> Location
                                    <Field className='ml-4 mr-1' type="radio" value="employee" name="assign" /> Individual Employee
                                </div>
                                <ErrorMessage name="assign" component="div" style={{ color: 'red' }} />
                                {assign === 'department' &&
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
                                {assign === 'employee' &&
                                    <div className='col-md-12'>
                                        <FormGroup>
                                            <label>Select Employees
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <EmployeeMultiSelectDropDown onChange={(selectedOptions) => {
                                                const employeeIds = selectedOptions.map(option => option.value);
                                                setFieldValue('employeeId', employeeIds);
                                            }} ></EmployeeMultiSelectDropDown>
                                        </FormGroup>
                                    </div>
                                }
                                {assign === 'location' &&
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
                                    <Field name="numberofDays" type="number" className="form-control" required />
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