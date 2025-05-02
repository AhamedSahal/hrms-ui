import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { updateStatus } from './service';
import { Button, Stack } from '@mui/material';


export default class OvertimeAction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            overtime: props.overtime || {
                id: 0,
                employeeId: props.employeeId,
            }
        }
      }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.overtime && nextProps.overtime != prevState.overtime) {
            return ({ overtime: nextProps.overtime })
        } else if (!nextProps.overtime) {
            return ({
                overtime: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                }
            })
        }

        return null;
    }
    updateStatus = (id, status) => {
        if(this.state.overtime.approvedHours <= 0 && status == 'APPROVED'){
            toast.error("Approved Hours Should not be less than or equal to Zero")
            return null;
        }
        updateStatus(id, this.state.overtime.approvedHours, this.state.overtime.employee.id, status).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            console.error(err);
            toast.error("Error while updating status");
        })
    }
    render() {
        const { overtime } = this.state;
        const overtimeHours = (overtime.actualHours - overtime.plannedHours).toFixed(2)
        return (
            <Form autoComplete='off'>
            <div>
                {overtime &&
                    <div>
                        <div className="row">
                            <div className="col-md-4">
                                <FormGroup>
                                    <label> Plan Hours : {Number(overtime.plannedHours).toFixed(2)}
                                    </label>
                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <FormGroup>
                                    <label>Actual Hours: {Number(overtime.actualHours).toFixed(2)}
                                    </label>

                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <FormGroup>
                                    <label>Overtime Hours: {overtimeHours}
                                    </label>

                                </FormGroup>
                            </div>
                            <div className="col-md-7">
                                <FormGroup>
                                    <label> Overtime Approved Hours
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input  type ="number"name="overTime" className="form-control" defaultValue={overtime.approvedHours} onChange={(e) => {
                                        let overtime = this.state.overtime;
                                        overtime.approvedHours = e.target.value;
                                        this.setState({
                                            overtime: {
                                                ...overtime
                                            }
                                        })
                                    }} />
                                    {parseFloat(overtime.approvedHours) == 0.00 && <div style={{ color: 'red' }}>Overtime Approved Hours Should not be zero.</div>}
                                    {parseFloat(overtime.overTime) < overtime.approvedHours && <div style={{ color: 'red' }}>The maximum allowed overtime hours are {overtime.overTime}</div>}
                                </FormGroup>
                            </div>
                        </div>
                        <hr />
                        <Stack direction="row" spacing={1}>
                            {parseFloat(overtime.overTime) < overtime.approvedHours ? <Button sx={{ textTransform: 'none' }} size="small" disabled variant="contained" color="success">
                                Approve
                            </Button> :
                                <Button sx={{ textTransform: 'none' }} size="small" onClick={() => {
                                    this.updateStatus(overtime.id, "APPROVED");
                                }} variant="contained" color="success">
                                    Approve
                                </Button>}
                            &nbsp;
                            <Button sx={{ textTransform: 'none' }} size="small" onClick={() => {
                                this.updateStatus(overtime.id, "REJECTED");
                            }} variant="contained" color="error">
                                Reject
                            </Button>
                        </Stack>
                    </div>}
            </div>
            </Form>
        )
    }
}
