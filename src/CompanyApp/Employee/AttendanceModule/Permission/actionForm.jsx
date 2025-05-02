import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Stack } from '@mui/material';


export default class PermissionAction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            remark: "",
            permission: props.permission || {
                id: 0,
                employeeId: props.employeeId,
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.permission && nextProps.permission != prevState.permission) {
            return ({ permission: nextProps.permission })
        } else if (!nextProps.permission) {
            return ({
                permission: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                }
            })
        }

        return null;
    }
    // updateStatus = (id, status) => {
       
    //     if((status == "REJECTED" && this.state.remark != "") || status == "APPROVED"){
    //     updateStatus(id, status,this.state.remark).then(res => {
    //         if (res.status == "OK") {
    //             // toast.success(res.message);
    //             this.props.showAlert(status);
    //             this.props.updateList(res.data);
    //         } else {
    //             toast.error(res.message);
    //         }

    //     }).catch(err => {
    //         console.error(err);
    //         toast.error("Error while updating status");
    //     })
    // }else{
    //     toast.error("Remark is required");
    // }
    // }
    render() {
        const { permission } = this.state;
        return (
            <div>
                {permission && <> <table className="table">
                     <tr>
                        <th>Employee</th>
                        <td>{permission.name}</td>
                    </tr>
                    <tr>
                        <th>Permission Type</th>
                        <td>{permission.type}</td>
                    </tr>
                    <tr>
                        <th>From</th>
                        <td>{permission.startDate}</td>
                    </tr>
                    <tr>
                        <th>To</th>
                        <td>{permission.endDate}</td>
                    </tr>
                    <tr>
                        <th>Permission Reason</th>
                        <td>{permission.reason}</td>
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
                        this.updateStatus(permission.id, "APPROVED");
                    }} variant="contained" color="success">
                        Approve
                    </Button>
                    <Button sx={{ textTransform: 'none' }} size="small" onClick={() => {
                        this.updateStatus(permission.id, "REJECTED");
                    }} variant="contained" color="error">
                        Reject
                    </Button>
                    </Stack>
                </>}

            </div>
        )
    }
}
