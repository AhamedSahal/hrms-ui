import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { updateStatus } from './service';
import { Button, Stack } from '@mui/material';


export default class TimeInLieuction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            timeinlieu: props.timeinlieu || {
                id: 0,
            },
            approvedHours: props.timeinlieu && props.timeinlieu.hours || 0,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.timeinlieu && nextProps.timeinlieu != prevState.timeinlieu) {
            return ({ timeinlieu: nextProps.timeinlieu })
        } else if (!nextProps.timeinlieu) {
            return ({
                timeinlieu: {
                    id: 0,
                }
            })
        }

        return null;
    }
    updateStatus = (id, status) => {

        updateStatus(id, this.state.approvedHours, status,this.state.timeinlieu.employeeId).then(res => {
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
                {timeinlieu &&
                    <div>
                        <div className="row">

                            <div className="col-md-4">
                                <FormGroup>
                                    <label> Hours
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input name="hours" className="form-control" readOnly value={timeinlieu.hours} />
                                </FormGroup>
                                <FormGroup>
                                    <label> Approved Hours
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input name="approvedhours" className="form-control" defaultValue={timeinlieu.hours}
                                        onChange={(e) => {
                                            this.setState({
                                                approvedHours: e.target.value
                                            });
                                        }}
                                    />
                                </FormGroup>
                            </div>
                        </div>
                        <hr />
                        <Stack direction="row" spacing={2}>
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

                    </div>}
            </div>
        )
    }
}
