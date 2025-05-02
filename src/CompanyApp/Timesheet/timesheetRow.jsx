import { ErrorMessage, Field } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getPermission,  verifyApprovalPermission } from '../../utility';
import AllActivityDropdown from '../ModuleSetup/Dropdown/AllActivityDropdown';
import EmployeeDropdown from '../ModuleSetup/Dropdown/EmployeeDropdown';
import ProjectDropdown from './../ModuleSetup/Dropdown/ProjectDropdown';


export default class TimesheetRow extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let { timesheet, index, self ,removeRow} = this.props;
        const currentDate = new Date().toISOString().split('T')[0];
        return (
            <>
            <div className="timesheet-row">
                <button type="button" className="close" onClick={() => removeRow(index)}>
                    <i className="fa fa-times"></i>
                </button>
            </div>
            <div className="row" data-parent>
                { !self && verifyApprovalPermission("TIMESHEET") && <div className="col-md-4">
                    <FormGroup>
                        <label>Employee
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <Field name="employeeId" render={field => {
                                        return <EmployeeDropdown permission={getPermission("TIMESHEET","EDIT")} defaultValue={timesheet.employeeId} onChange={e => {
                                            timesheet.employeeId = e.target.value;
                                            this.props.updateState(timesheet, index);
                                        }} isRequired ={true}></EmployeeDropdown>
                        }}></Field>
                    </FormGroup>
                </div>
                }
                <div className="col-md-4">
                    <FormGroup>
                        <label>Date
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <Field name={'date'} defaultValue={timesheet.date} max={currentDate}required className="form-control" type="date" onChange={e => {
                            timesheet.date = e.currentTarget.value;
                            this.props.updateState(timesheet, index);
                        }}></Field>
                        <ErrorMessage name="date">
                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                        </ErrorMessage>
                    </FormGroup>
                </div>
                <div className="col-md-4">
                    <FormGroup>
                        <label>Hours
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input name={'hours'} min ="0"  defaultValue={timesheet.hours} className="form-control" onChange={(e) => {
                            timesheet.hours = e.currentTarget.value;
                            this.props.updateState({timesheet, index});
                        }}/>
                        <ErrorMessage name="hours">
                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                        </ErrorMessage>
                    </FormGroup>
                </div>
                <div className="col-md-4">
                    <FormGroup>
                        <label className='mb-0'>Project Name / Code
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <ProjectDropdown defaultValue={timesheet.projectId} onChange={e => {
                            timesheet.projectId = e.currentTarget.value;
                            this.props.updateState(timesheet, index);
                        }} isRequired ={true}></ProjectDropdown>
                        <ErrorMessage name="projectId">
                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                        </ErrorMessage>
                    </FormGroup>
                </div>
                <div className="col-md-4">
                    <FormGroup>
                        <label>Activity
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <AllActivityDropdown projectId={timesheet.projectId} defaultValue={timesheet.activityId} onChange={e => {
                            timesheet.activityId = e.currentTarget.value;
                            this.props.updateState(timesheet, index);
                        }} isRequired ={true}></AllActivityDropdown>
                        <ErrorMessage name="activityId">
                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                        </ErrorMessage>
                    </FormGroup>
                </div>
                <div className="col-md-12">
                    <FormGroup>
                        <label>Remark</label>
                        <Field name={'description'} defaultValue={timesheet.description}
                            onChange={e => {
                                timesheet.description = e.currentTarget.value;
                                this.props.updateState(timesheet, index);
                            }}
                            component="textarea" rows="4"
                            className="form-control"
                            placeholder="Description"
                            maxLength="250"
                        >
                        </Field>
                    </FormGroup>
                </div>
                <hr />
            </div>
        </>
        )
    }
}
