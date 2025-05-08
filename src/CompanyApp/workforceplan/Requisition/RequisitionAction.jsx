import { name } from 'file-loader';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { FormGroup } from 'reactstrap';
import { Anchor } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { updateStatus } from './service';
import { getReadableDate} from '../../../utility'; 
 

export default class RequisitionAction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Requisition : props.Requisition || {
                id: 0,
                employeeId:0,
                departmentId: 0,
                    department :{
                        id: 0 
                },
                reqinitiateddate:"",
                resneeddate:"",
                role: "",
                noofresources : 0,
                value: "",
                req_type : "budgeted",
                rec_reason:"",
                res_type:"",
                pos_type:""
            },
            status:props.status||"PROCESS_STARTED"
        }
    }
    hideForm = () => {
        this.setState({
          showForm: false
        })
      }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.Requisition && nextProps.Requisition != prevState.Requisition) {
            return ({ Requisition: nextProps.Requisition })
        } else if (!nextProps.Requisition) {
            return ({
                Requisition :  {
                    id: 0,
                    employeeId:0,
                    departmentId: 0,
                        department :{
                            id: 0 
                    },
                    reqinitiateddate:"",
                    resneeddate:"",
                    role: "",
                    noofresources : 0,
                    value: "",
                    req_type : "budgeted",
                    rec_reason:"",
                    res_type:"",
                    pos_type:""
                } 
            })
        }
        return null;
    }
    updateStatus = (id, status) => { 
        updateStatus(id, status).then(res => {
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
        const { Requisition } = this.state; 
        return (
            <div>
                 {Requisition && <> <table className="table">
                    <tbody>
                    <tr>
                        <th>Requsition Date</th>
                        <td>{getReadableDate(Requisition.reqinitiateddate)}</td>
                    </tr>
                    <tr>
                        <th>Expected Start Date</th>
                        <td>{getReadableDate(Requisition.resneeddate)}</td>
                    </tr>
                    <tr>
                        <th>Job Titles</th>
                        <td> {Requisition.role == " " ? Requisition.forecast?.name : (Requisition.role == " " && Requisition.forecast?.name == "Developer") ? Requisition.role : Requisition.role } </td>
                    </tr> 
                    <tr>
                        <th>Department</th>
                        <td>{Requisition.department?.name}</td>
                    </tr>
                    <tr>
                        <th>Reason for Recruitment</th>
                        <td>{Requisition.rec_reason}</td>
                    </tr>
                    <tr>
                        <th>Resource Type</th>
                        <td>{Requisition.res_type}</td>
                    </tr>
                    <tr>
                        <th>Position Type</th>
                        <td>{Requisition.pos_type}</td>
                    </tr>
                    <tr>
                        <th>Requisition Type</th>
                        <td>{Requisition.req_type}</td>
                    </tr>
                    <tr>
                        <th>No of Resources</th>
                        <td>{Requisition.noofresources}</td>
                    </tr>
                    </tbody>
                    </table>
                    <hr />
                    <Anchor onClick={() => {
                        this.updateStatus(Requisition.id, "PROCESS_STARTED");
                    }} className="btn btn-primary">Process Start</Anchor>
                    &nbsp;
                    <Anchor onClick={() => {
                    this.updateStatus(Requisition.id, "PROCESS_STOPPED");
                    }} className="btn btn-warning">Reject</Anchor> 
                </> } 
            </div>
        )
    }
}
