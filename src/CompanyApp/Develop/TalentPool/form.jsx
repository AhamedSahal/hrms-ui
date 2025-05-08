import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup, Label } from 'reactstrap';
import GradesDropdown from '../../ModuleSetup/Dropdown/GradesDropdown';
import DepartmentDropdown from '../../ModuleSetup/Dropdown/DepartmentDropdown';
import JobTitlesDropdown from '../../ModuleSetup/Dropdown/JobTitlesDropdown';
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import { validateTalentPool } from './validation';
import { getEmployeeList, saveTalentPool } from './service';

export default class TalentPoolForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            selectedEmployees: props?.talentPool?.candidate || [],
            q: "",
            branchId: "",
            departmentId: "",
            gradesId: "",
            jobTitlesId: "",
            page: 0,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            status: "ACTIVE",
            talentPool: props.talentPool || {
                id: 0,
                poolDate: "",
                poolName: "",
                description: "",
                active: true
            }
        }
    }
    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        getEmployeeList(this.state.q, this.state.page, this.state.sort, this.state.status, this.state.branchId, this.state.departmentId, this.state.jobTitlesId).then(res => {

            if (res.status == "OK") {
                this.setState({
                    data: res.data.list,
                })
            }
        })
    }


    handleCheckboxChange = (employeeId) => {
        const { selectedEmployees } = this.state;
        const isSelected = selectedEmployees.includes(employeeId);
        if (isSelected) {
            this.setState({
                selectedEmployees: selectedEmployees.filter((id) => id !== employeeId),
            });
        } else {
            this.setState({
                selectedEmployees: [...selectedEmployees, employeeId],
            });
        }
    };



    save = (data, action) => {

        const poolData = {
            active: data.active,
            description: data.description,
            id: data.id,
            poolDate: data.poolDate,
            poolName: data.poolName,
            candidates: this.state.selectedEmployees
        }
        action.setSubmitting(true);
        saveTalentPool(poolData).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            if (res.status == "OK") {
                setTimeout(function () {
                    window.location.reload()
                }, 6000)
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving talent pool");

            action.setSubmitting(false);
        })
    }

    render() {
        const { talentPool, data, selectedEmployees } = this.state
       
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={talentPool}
                    onSubmit={this.save}
                    validationSchema={validateTalentPool}
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
                        /* and other goodies */
                    }) => (
                        <Form >
                            <div className='row'>
                                <FormGroup className='col-md-6'>
                                    <label>Pool Name
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="poolName" className="form-control"></Field>
                                    <ErrorMessage name="poolName">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className='col-md-6'>
                                    <label>Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="poolDate" type="date" className="form-control"></Field>
                                    <ErrorMessage name="poolDate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup>
                                    <label>Description</label>

                                    <Field name="description"
                                        component="textarea" rows="4"
                                        className="form-control"
                                        placeholder="Description"
                                    >
                                    </Field>
                                </FormGroup>
                                <FormGroup>
                                    <div type="checkbox" name="active" onClick={e => {
                                        let { talentPool } = this.state;
                                        talentPool.active = !talentPool.active;
                                        setFieldValue("active", talentPool.active);
                                        this.setState({
                                            talentPool
                                        });
                                    }} >
                                        <label>Is Active</label><br />
                                        <i className={`fa fa-2x ${this.state.talentPool
                                            && this.state.talentPool.active
                                            ? 'fa-toggle-on text-success' :
                                            'fa fa-toggle-off text-danger'}`}></i>
                                    </div>
                                </FormGroup>
                                <div>
                                    <label>Filter Candidates</label>
                                    <FormGroup>

                                        <div className=' row'>
                                            <div className="col-md-4 form-group">

                                                <GradesDropdown defaultValue={this.state.gradesId} onChange={e => {
                                                    this.setState({
                                                        gradesId: e.target.value
                                                    })
                                                }} ></GradesDropdown>
                                            </div>
                                            <div className=" col-md-4 form-group">
                                                <DepartmentDropdown defaultValue={this.state.departmentId} onChange={e => {
                                                    this.setState({
                                                        departmentId: e.target.value
                                                    })
                                                }}></DepartmentDropdown>
                                            </div>

                                            <div className="col-md-4 form-group">
                                                <JobTitlesDropdown defaultValue={this.state.jobTitlesId} onChange={e => {
                                                    this.setState({
                                                        jobTitlesId: e.target.value
                                                    })
                                                }}></JobTitlesDropdown>
                                            </div>
                                            <div className="col-md-4 form-group">
                                                <BranchDropdown defaultValue={this.state.branchId} onChange={e => {
                                                    this.setState({
                                                        branchId: e.target.value
                                                    })
                                                }}></BranchDropdown>
                                            </div>
                                            <div className="col-md-4">
                                                <a onClick={() => {
                                                    this.fetchList();
                                                }} href="#" className="btn btn-success btn-block"> Search </a>
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <div className='row'>
                                        <label>Add Candidates</label>
                                        <div style={{ maxHeight: '200px', overflowY: 'auto' }} className="col-md-6 table-responsive">
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Employee Id</th>
                                                        <th scope="col">Select</th>

                                                    </tr>
                                                </thead>
                                                <tbody style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                    {
                                                        data.map((employee, index) => (<tr>
                                                            <td>{employee.name}</td>
                                                            <td>{employee.employeeId}</td>
                                                            <td><input checked={selectedEmployees.includes(employee.id)}
                                                                onChange={() => this.handleCheckboxChange(employee.id)}
                                                                type="checkbox" /></td>
                                                        </tr>))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        {selectedEmployees.length > 0 && (
                                            <div style={{
                                                border: '1px solid #afafaf',
                                                marginLeft: '33px',
                                                borderRadius: '5px'
                                            }} className='col-md-5'>
                                                <label className='font-weight-bold'>Selected Candidates</label>
                                                <ul>
                                                    {selectedEmployees.map((employeeId) => {
                                                        const selectedEmployee = data.find((employee) => employee.id === employeeId);
                                                        return (
                                                            <li key={employeeId}>
                                                                {selectedEmployee && (
                                                                    <div>
                                                                        <p className='mb-0'>{selectedEmployee.name}</p>

                                                                    </div>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}




                                    </div>
                                </div>
                            </div>
                            <input type="submit" className="mt-2 btn btn-primary" value={"Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
