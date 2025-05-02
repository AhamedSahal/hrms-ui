import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { updateStatus } from './service';
import { Button, Stack } from '@mui/material';
//import { LeaveSchema } from './validation';


export default class TeamOvertimeAction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            teamOvertime: props.teamOvertime || {
                id: 0,
            },
            approvedHours: props.teamOvertime && props.teamOvertime.hours || 0,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.teamOvertime && nextProps.teamOvertime != prevState.teamOvertime) {
            return ({ teamOvertime: nextProps.teamOvertime })
        } else if (!nextProps.teamOvertime) {
            return ({
                teamOvertime: {
                    id: 0,
                }
            })
        }

        return null;
    }
    updateStatus = (id, status) => {

        updateStatus(id, this.state.approvedHours, status, this.state.teamOvertime.employeeId).then(res => {
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
        const { teamOvertime } = this.state;
        return (
            <div>
                {teamOvertime &&
                    <div>
                        <div className="row">

                            <div className="col-md-4">
                                <FormGroup>
                                    <label> Hours
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input name="hours" className="form-control" readOnly value={teamOvertime.hours} />
                                </FormGroup>
                                <FormGroup>
                                    <label> Approved Hours
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input name="approvedhours" className="form-control" defaultValue={teamOvertime?.approvedHours}
                                        onChange={(e) => {
                                            let teamOvertime = this.state.teamOvertime
                                            teamOvertime.approvedHours = e.target.value
                                            this.setState({
                                                approvedHours: e.target.value,
                                                teamOvertime: {...teamOvertime}
                                            });
                                        }}
                                    />
                                     {parseFloat(teamOvertime?.approvedHours) == 0.00 && <div style={{ color: 'red' }}>Overtime Approved Hours Should not be zero.</div>}
                                     {parseFloat(teamOvertime?.hours) < teamOvertime?.approvedHours && <div style={{ color: 'red' }}>The maximum allowed overtime hours are {teamOvertime.hours}</div>}
                                </FormGroup>
                            </div>
                        </div>
                        <hr />

                        <Stack direction="row" spacing={1}>

                           {parseFloat(teamOvertime.hours) < teamOvertime.approvedHours ? <Button sx={{ textTransform: 'none' }} size="small" disabled variant="contained" color="success">
                                                          Approve
                                                      </Button> :  <Button sx={{ textTransform: 'none' }} size="small" onClick={() => {
                                this.updateStatus(teamOvertime.id, "APPROVED");
                            }}
                                variant="contained" color="success">
                                Approve
                            </Button>}


                            <Button sx={{ textTransform: 'none' }} size="small" onClick={() => {
                                this.updateStatus(teamOvertime.id, "REJECTED");
                            }} variant="contained" color="error">
                                Reject
                            </Button>
                        </Stack>
                       
                    </div>}
            </div>
        )
    }
}
