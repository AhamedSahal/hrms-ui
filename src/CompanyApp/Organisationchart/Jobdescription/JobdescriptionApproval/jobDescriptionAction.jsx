import { name } from 'file-loader';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { FormGroup } from 'reactstrap';
import { Anchor } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { updateStatus } from '../service'; 
 


export default class  JobDescriptionAction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            jobdescription : props.jobdescription || {
                id: 0,
                name: ""
                }
        }
    }
    hideForm = () => {
        this.setState({
          showForm: false
        })
      }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.jobdescription && nextProps.jobdescription != prevState.jobdescription) {
            return ({ jobdescription: nextProps.jobdescription })
        } else if (!nextProps.jobdescription) {
            return ({
                jobdescription :  {
                    id: 0,
                    name: ""
                }
                 
            })
        }
        return null;
    }
    updateStatus = (id) => {  
        updateStatus(id, this.state.status,this.state.remarks).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateListAction(res.data);
            } else {
                
                toast.error(res.message);
            } 
         })
        .catch(err => { 
            console.log(err);
            toast.error("wdwsError while updating status");
        })
    }
    render() {
        const { jobdescription } = this.state; 
        return (
            <div>
                 {jobdescription && <> <table className="table">
                    <tbody>
                    <tr>
                        <th>Job Code - Job Titles </th>
                        <td>{jobdescription.name} - {jobdescription.jobTitles?.name} </td>
                    </tr>
                        <tr>
                        <th>Department</th>
                        <td>{ jobdescription.department?.name}</td>
                    </tr>
                    <tr>
                    <th>Status</th>
                    <td>
                    <label className='mr-2'> <input name="status" type="radio" value="APPROVED"   defaultValue={this.state.jobdescription.status} onChange={(e) => {
                        this.setState({
                            status: "APPROVED",
                            remarks: ""
                        });
                    }} /> Approve</label>
                      <input name="status" type="radio" value="REJECTED"  defaultValue={ this.state.jobdescription.status} onChange={(e) => {
                        this.setState({
                            status: "REJECTED",
                            remarks: this.state.jobdescription.remarks 
                        });
                        }}/> Reject 
                    </td> 
                    </tr>
                    <tr>
                    <th> Remarks<br/>
                    <p style={{fontSize:"10px",fontFamily:"Arial"}}>(Use this field to enter any comments<br/> about why the item was rejected.)</p></th>
                    <td>
                    <input name="remarks" type="text" className="form-control" defaultValue={ jobdescription.remarks}
                    onChange={(e) => {
                    this.setState({remarks: e.target.value});
                    }}/>
                    </td>
                    </tr> 
                    </tbody>
                    </table>
                    <hr />
                    <Anchor onClick={() => {
                        this.updateStatus( jobdescription.id);
                    }} className="btn btn-primary">Update</Anchor>
                </> } 
            </div>
        )
    }
}
