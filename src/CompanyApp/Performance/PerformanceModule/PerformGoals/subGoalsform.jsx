import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import EmployeeDropdown from '../../../ModuleSetup/Dropdown/EmployeeDropdown';
import GoalsEmployeeDropdown from '../../../ModuleSetup/Dropdown/GoalsEmployeeDropdown';
import { saveSubGoals, getSubGoalWeightage, getGoalsActionList } from './service';
import { FcHighPriority, FcLowPriority, FcMediumPriority } from 'react-icons/fc';
import { confirmAlert } from 'react-confirm-alert';


export default class PerformanceSubGoalsForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            description: '',
            priority: '',
            deadline: '',
            subgoalWeightage: 0,
            issubGoalWeightage: true,
            active: true,
            goalsId: 0,
            employeeId: this.props.goalDataItem?.employeeId || 0,
            goals: {
                id: 0,
            },
            goalsData: []

        }

    }

    componentDidMount() {
        if (this.props.PerformanceSubGoalsForm != undefined) {
            this.setState({ issubGoalWeightage: this.props.PerformanceSubGoalsForm.issubGoalWeightage, employeeId: this.props.PerformanceSubGoalsForm.employeeId })
        }
    }



    handleGoalStatusValidation = (id) => {
        getGoalsActionList(id).then(res => {
            if (res.status == "OK") {
                this.setState({
                    goalsData: res.data,
                })

            }
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.PerformanceSubGoalsForm && nextProps.PerformanceSubGoalsForm != prevState.PerformanceSubGoalsForm) {
            return ({ PerformanceSubGoalsForm: nextProps.PerformanceSubGoalsForm })
        } else if (!nextProps.PerformanceSubGoalsForm) {
            return prevState.PerformanceSubGoalsForm || ({
                PerformanceSubGoalsForm: {
                    id: 0,
                    name: '',
                    description: '',
                    priority: '',
                    deadline: '',
                    subgoalWeightage: 0,
                    active: true,
                    goalsId: 0,
                    goals: {
                        id: 0,
                    }
                }
            })
        }
        return null;
    }


    handleButtonClick = () => {
        this.setState((prevState) => ({
            issubGoalWeightage: !prevState.issubGoalWeightage,
            preferredMethod: prevState.issubGoalWeightage ? 'Auto' : 'Manual',
        }));


    };



    save = (data, action) => {

        if (this.state.goalsData.length > 0) {
            this.props.goalsStatusPopupMessage(data)
        } else {
            this.saveSubGoals(data);
        }

    }

    saveSubGoals = (data) => {
        data["issubGoalWeightage"] = this.state.issubGoalWeightage;

        data["goalsId"] = this.props.goalDataItem?.id || data.goalsId


        saveSubGoals(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            if (res.status == "OK") {
                this.props.updateList();
            }
        }).catch(err => {
            toast.error("Error while saving Performance Sub Goals");


        })
    }
    render() {
        const { issubGoalWeightage, PerformanceSubGoalsForm } = this.state
        const isEmployeeId = this.props?.isEmployeeGoals
        return (
            <div>
                {/* remove record */}
                {this.props.multiForm && <div className="timesheet-row">
                    <button type="button" className="close" onClick={() => this.props.removeRow(this.props.index)}>
                        <i className="fa fa-times"></i>
                    </button>
                </div>}
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.PerformanceSubGoalsForm}
                    onSubmit={this.save}
                //    validationSchema={PerformanceReviewSchema}
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
                            <div className="row">

                                {!this.props.multiForm && !this.props.subGoalsEdit && <FormGroup>
                                    <label>Employee<span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="employeeId" className="col-md-12" render={field => {
                                        return <EmployeeDropdown defaultValue={isEmployeeId || this.props.goalDataItem?.employeeId || 0} onChange={e => {
                                            this.setState({ employeeId: e.target.value })
                                            setFieldValue("goalsId", 0);
                                            setFieldValue("goals", null);
                                        }}  readOnly={isEmployeeId}></EmployeeDropdown>
                                    }}></Field>
                                </FormGroup>}

                                {/* new dropdown s */}
                                {!this.props.multiForm && (this.state.employeeId > 0 || isEmployeeId) && <div className="col-md-6">
                                    <FormGroup>
                                        <label>Goals<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="goalsId" render={field => {
                                            return <GoalsEmployeeDropdown 
                                                employeeId={this.state.employeeId || isEmployeeId} 
                                                defaultValue={ this.props.goalDataItem?.id || values.goalsId} 
                                                onChange={e => {
                                                    setFieldValue("goalsId", e.target.value);
                                                    setFieldValue("goals", { id: e.target.value });
                                                    this.handleGoalStatusValidation(e.target.value);
                                                    if (this.state.PerformanceSubGoalsForm.id > 0) {
                                                        toast.error("Are you sure, you want to update Goals");
                                                    }
                                                }} 
                                                readOnly={!this.props.enableGoalDropdown} 
                                                required>
                                            </GoalsEmployeeDropdown>
                                        }}></Field>

                                    </FormGroup>
                                </div>}


                                {/* new dropdown e */}


                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Sub Goal Name
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="name" type="text" className="form-control" required onChange={(e) => {
                                            setFieldValue("name", e.target.value)
                                            if (this.props.multiForm) {
                                                PerformanceSubGoalsForm.name = e.target.value;
                                                this.props.updateState(PerformanceSubGoalsForm, this.props.index);
                                            }
                                        }}></Field>
                                        <ErrorMessage name="name">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-4">
                                    <FormGroup>
                                        <label>Weightage</label>
                                        <div onClick={e => {
                                            if (this.props.multiForm) {
                                                PerformanceSubGoalsForm.issubGoalWeightage = !this.state.issubGoalWeightage;
                                                this.props.updateState(PerformanceSubGoalsForm, this.props.index);
                                            }
                                            this.handleButtonClick()
                                        }} className="toggles-btn-view" id="button-container">

                                            <div id="my-button" className="toggle-button-element" style={{ transform: issubGoalWeightage ? 'translateX(0px)' : 'translateX(80px)' }}>
                                                <p className='m-0 self-btn'>{issubGoalWeightage ? 'Auto' : 'Manual'}</p>

                                            </div>
                                            <p className='m-0 team-btn' style={{ transform: issubGoalWeightage ? 'translateX(-10px)' : 'translateX(-80px)' }}>{issubGoalWeightage ? 'Manual' : 'Auto'}</p>
                                        </div>


                                    </FormGroup>
                                </div>
                                {!issubGoalWeightage && <div className="col-2"> <FormGroup><label></label><Field name="subgoalWeightage" type="number" className="form-control" required onChange={(e) => {
                                    setFieldValue("subgoalWeightage", e.target.value)
                                    if (this.props.multiForm) {
                                        PerformanceSubGoalsForm.subgoalWeightage = e.target.value;
                                        this.props.updateState(PerformanceSubGoalsForm, this.props.index);
                                    }
                                }}></Field> </FormGroup></div>}
                            </div> <div className="row">
                                <div className="col-12">
                                    <FormGroup>
                                        <label>Description
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="description" component="textarea" rows="4" className="form-control" placeholder="Description" required onChange={(e) => {
                                            setFieldValue("description", e.target.value)
                                            if (this.props.multiForm) {
                                                PerformanceSubGoalsForm.description = e.target.value;
                                                this.props.updateState(PerformanceSubGoalsForm, this.props.index);
                                            }
                                        }}></Field>
                                        <ErrorMessage name="description">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <FormGroup>
                                        <label>Priority
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <select id="priority" className="form-control" name="priority"
                                            onChange={e => {
                                                setFieldValue("priority", e.target.value)
                                                if (this.props.multiForm) {
                                                    PerformanceSubGoalsForm.priority = e.target.value;
                                                    this.props.updateState(PerformanceSubGoalsForm, this.props.index);
                                                }
                                            }} defaultValue={values.priority} required>
                                            <option value="">Select Priority</option>
                                            <option value="0">Low</option>
                                            <option value="1">Medium</option>
                                            <option value="2">High</option>
                                        </select>
                                        <ErrorMessage name="priority">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-6">
                                    <FormGroup>
                                        <label>Deadline
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="deadline" type="date" className="form-control" required onChange={(e) => {
                                            setFieldValue("deadline", e.target.value)
                                            if (this.props.multiForm) {
                                                PerformanceSubGoalsForm.deadline = e.target.value;
                                                this.props.updateState(PerformanceSubGoalsForm, this.props.index);
                                            }
                                        }}></Field>
                                        <ErrorMessage name="deadline">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <FormGroup>
                                        <div type="checkbox" name="active"  >
                                            <label>Is Active</label><br />
                                            <i className={`fa fa-2x ${this.state.PerformanceSubGoalsForm
                                                && this.state.PerformanceSubGoalsForm.active
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`} onClick={e => {
                                                    let { PerformanceSubGoalsForm } = this.state;
                                                    PerformanceSubGoalsForm.active = !PerformanceSubGoalsForm.active;
                                                    setFieldValue("active", PerformanceSubGoalsForm.active);
                                                    if (this.props.multiForm) {
                                                        PerformanceSubGoalsForm.active = PerformanceSubGoalsForm.active;
                                                        this.props.updateState(PerformanceSubGoalsForm, this.props.index);
                                                    }

                                                }}></i>
                                        </div>
                                    </FormGroup>
                                </div>
                            </div>
                            {!this.props.multiForm && <div className="row mt-3">
                                <div className="col">
                                    <input type="submit" className="btn btn-success" value="Publish" />
                                </div>

                            </div>}

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
