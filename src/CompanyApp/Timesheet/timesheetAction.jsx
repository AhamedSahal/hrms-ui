import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { updateStatus } from './service';
import { Button, Stack } from '@mui/material';
//import { LeaveSchema } from './validation';


export default class TimesheetAction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            approvedHours: props.timesheet.approvedHours || 0,
            timesheet: props.timesheet || {
                id: 0,
                employeeId: props.employeeId,
                approvedHours:props.approvedHours||0, 
            },
            approve : props.timesheet.approvalStatus === 'APPROVED'? true :null ,
            // status:props.status||"APPROVED",
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.timesheet && nextProps.timesheet != prevState.timesheet) {
            return ({ timesheet: nextProps.timesheet })
        } else if (!nextProps.timesheet) {
            return ({
                timesheet: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                }
            })
        }

        return null;
    }
    updateStatus = (id , status) => {
        let {approvedHours} = this.state;
        if(approvedHours == 0 && status != "REJECTED"){
            toast.error("Please Enter Approved Hours.");
        } else{
            updateStatus(id, this.state.approvedHours, status).then(res => {
                if (res.status == "OK") {
                    // toast.success(res.message);
                    this.props.showAlert(status)
                    this.props.updateList(res.data);
                } else {
                    toast.error(res.message);
                }

            }).catch(err => {
                console.error(err);
                toast.error("Error while updating status");
            })
        }
    };

    approveHours = (status) => {
        const { timesheet } = this.state;
        let validation = this.state.approve;
        if(status === "Approve")
        {
            this.setState({ approve: true })
        }else{
            this.setState({ approve: false, })
        }
        if(validation){
            this.updateStatus(timesheet.id , "APPROVED");

        }
    }
    render() {
        const { timesheet } = this.state;
        return (
            <div>
                {timesheet && <> <table className="table">
                    <tr>
                        <th>Employee</th>
                        <td>{timesheet.employeeName}</td>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <td>{timesheet.date}</td>
                    </tr>
                    <tr>
                        <th>Hours</th>
                        <td>{timesheet.hours}</td>
                    </tr>
                    {this.state.approve && <tr>
                        <th> Approved Hours <span style={{ color: "red" }}>*</span></th>
                       <td><input name="approvedhours" type="number" className="multi-input" defaultValue={timesheet.approvedHours}
                            onChange={(e) => { this.setState({ approvedHours: e.target.value }); }} /></td> 
                    </tr>}

                </table>
                    <hr />
                    <Stack direction="row" spacing={1}>

                    <Button sx={{ textTransform: 'none' }} size="small" onClick={() => this.approveHours("Approve")}
                        variant="contained" color="success">
                        Approve
                    </Button>


                    <Button sx={{ textTransform: 'none' }} size="small" onClick={() => {
                                    this.updateStatus(timesheet.id ,  "REJECTED");
                    }} variant="contained" color="error">
                        Reject
                    </Button>
                    </Stack>
                   
                   
                </>}
            </div>
        )
    }
}
