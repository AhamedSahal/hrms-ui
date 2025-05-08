import React, { Component } from 'react';
import { FormGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateStatus } from './service';
import { Button, Stack } from '@mui/material';

export default class TimeInLieuAction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            timeinlieu: props.timeinlieu || {
                id: 0,
                employeeId: props.employeeId,
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.timeinlieu && nextProps.timeinlieu != prevState.timeinlieu) {
            return ({ timeinlieu: nextProps.timeinlieu })
        } else if (!nextProps.timeinlieu) {
            return ({
                timeinlieu: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                }
            })
        }

        return null;
    }
    updateStatus = (id, status) => {
        updateStatus(id, status, this.state.approvedHours).then(res => {
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
        const { timeinlieu } = this.state;
        return (
            <div>
                {timeinlieu && <>  <div> 
                    <div className="row">
                        <div className="col-md-4">
                            <FormGroup>
                                <label> Hours
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <input name="hours" readOnly className="form-control" value={timeinlieu.hours} />
                            </FormGroup>
                        </div>
                        <div className="col-md-4">
                            <FormGroup>
                                <label> Approved Hours
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <input name="approvedhours" className="form-control" defaultValue={this.state.timeinlieu.approvedHours}
                                    onChange={(e) => {

                                        this.setState({
                                            approvedHours: e.target.value
                                        });
                                    }} />
                            </FormGroup>
                        </div>
                    </div>
                    <hr />
                    <Stack direction="row" spacing={1}>
                        <Button sx={{ textTransform: 'none' }} size="small" onClick={() => {
                            this.updateStatus(timeinlieu.id, "APPROVED");
                        }} variant="contained" color="success">
                            Approve
                        </Button>
                        <Button sx={{ textTransform: 'none' }} size="small" onClick={() => {
                            this.updateStatus(timeinlieu.id, "REJECTED");
                        }} variant="contained" color="error">
                            Reject
                        </Button>
                    </Stack>

                </div>
                </>}

            </div>
        )
    }
}
