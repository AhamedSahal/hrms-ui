import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import LeaveTypeDropdown from '../../ModuleSetup/Dropdown/LeaveTypeDropdown';
import {  updateStatus } from './service';
import { LeaveSchema } from './validation';
import { Button, Stack } from '@mui/material';


export default class LeaveAction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            remark: "",
            leave: props.leave || {
                id: 0,
                employeeId: props.employeeId,
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.leave && nextProps.leave != prevState.leave) {
            return ({ leave: nextProps.leave })
        } else if (!nextProps.leave) {
            return ({
                leave: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                }
            })
        }

        return null;
    }
    updateStatus = (id, status) => {
       
        if((status == "REJECTED" && this.state.remark != "") || status == "APPROVED"){
        updateStatus(id, status,this.state.remark).then(res => {
            if (res.status == "OK") {
                // toast.success(res.message);
                this.props.showAlert(status);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            console.error(err);
            toast.error("Error while updating status");
        })
    }else{
        toast.error("Remark is required");
    }
    }

    getLeaveDaytype = (type) => {
        if(type ==2) return "FH";
       else if(type ==3) return "SH";
       return "";

   }
    render() {
        const { leave } = this.state;
        return (
            <div>
                {leave && <> <table className="table">
                     <tr>
                        <th>Employee</th>
                        <td>{leave.employee?.name}</td>
                    </tr>
                    <tr>
                        <th>Leave Type</th>
                        <td>{leave.leaveType?.name}</td>
                    </tr>
                    <tr>
                        <th>From</th>
                        <td>{leave.startDate} <b>{this.getLeaveDaytype(leave.startDateDayType)}</b></td>
                    </tr>
                    <tr>
                        <th>To</th>
                        <td>{leave.endDate} <b>{this.getLeaveDaytype(leave.endDateDayType)}</b></td>
                    </tr>
                    <tr>
                        <th>Leave Reason</th>
                        <td>{leave.leaveReason}</td>
                    </tr>
                    <tr>
                        <th>Remark</th>
                        <td><input   className="multi-input"
                         onChange={ (e) => this.setState({remark : e.target.value})}
                        /></td>
                    </tr>
                </table>
                    <hr />
                    <Stack direction="row" spacing={1}>
                    <Button sx={{ textTransform: 'none' }} size="small" onClick={() => {
                        this.updateStatus(leave.id, "APPROVED");
                    }} variant="contained" color="success">
                        Approve
                    </Button>
                    <Button sx={{ textTransform: 'none' }} size="small" onClick={() => {
                        this.updateStatus(leave.id, "REJECTED");
                    }} variant="contained" color="error">
                        Reject
                    </Button>
                    </Stack>
                </>}

            </div>
        )
    }
}
