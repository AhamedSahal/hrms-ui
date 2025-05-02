
import React, { Component } from 'react';
import moment from "moment";
import EmployeeListColumn from '../../Employee/employeeListColumn';



export default class WorkflowView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workflowprocess: props.workflowprocess || {}
            
        }

    };


    render() {
        let {workflowprocess} = this.state;
        return (
            <div className="card mb-0" >
                <div className="row">
                    <div className="col-md-12 ">
                        <div className="">
                            <table className="table table-borderless">
                                <thead >
                                    <tr>

                                        <th>Workflow Name</th>
                                        <th>Step Name</th>
                                        <th>Comment</th>
                                        <th>Status</th>
                                        <th>Created By</th>
                                        <th>Created Date</th>

                                    </tr>
                                </thead>
                                <tbody>

                                    <tr className="table-row">
                                        <td className="table-column">{workflowprocess.workflowautomate?.name}</td>
                                        <td className="table-column">{workflowprocess.workflowstepautomate?.name}</td>
                                        <td className="table-column"> {workflowprocess.comment?workflowprocess.comment:"-"}</td>
                                        <td className="table-column">{workflowprocess.status}</td>
                                        <td className="table-column">{
                                         workflowprocess.raisedby !=null  ? <EmployeeListColumn id={workflowprocess.raisedby.id} name={workflowprocess.raisedby.name}></EmployeeListColumn>:"Admin"         
                                        }</td>
                                        <td className="table-column">{moment(workflowprocess.createdOn).format("ll")}</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}