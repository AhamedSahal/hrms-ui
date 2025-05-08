
import React, { Component } from 'react';

import { toast } from 'react-toastify';
import { fileDownload } from '../../HttpRequest';
import { Anchor } from 'react-bootstrap';
import EmployeeListColumn from '../../CompanyApp/Employee/employeeListColumn';
import { getReadableDate } from '../../utility';
import { updateStatus } from './service';
export default class TasksView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TasksView: props.TasksView || {
                id: 0,
                employeeId: 0,
                taskname: "",
                description: "",
                filename: "",
                url: "",
                startdate: "",
                enddate: "",
                profileImg: "",
                raisedprofileImg: ""

            }
        }

    };
    updateStatus = (id, status) => {
        updateStatus(id, status).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                setTimeout(function () {
                    window.location.reload()
                  }, 6000)
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            console.error(err);
            toast.error("Error while updating status");
        })
    }
    render() {
        const { id, employeeId, employee, taskname, description, startdate, createdOn, enddate, fileName, url, raisedby, status, completeddate, profileImg, raisedprofileImg } = this.state.TasksView;
        return (
            <div className="card" style={{ fontFamily: "wotfard" }}>
                <div className="card-body" id="card">
                    <div className="row">
                        <div className="float-left"><h4 className="payslip-title">View Task</h4></div> </div>
                    <div className="row">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="content">
                                    <p style={{ fontSize: "24px", lineHeight: "1.5", color: "#55687d" }}> {taskname}</p>
                                    <div className="labelstatus">
                                        <p>
                                            {status != "APPROVED" && <span className="label font-light task-pending-label label-danger"
                                                style={{
                                                    padding: "8px 10px", minWidth: "275px", fontSize: "14px", backgroundColor: "#f05252", fontWeight: "300",
                                                    lineHeight: "1", color: "#fff", textAlign: "center", whiteSpace: "nowrap", verticalAlign: "baseline", borderRadius: "0.25em"
                                                }}>
                                                {status == "PENDING" ? "Pending as on" : "Overdue as on"} {getReadableDate(enddate)}
                                            </span>}
                                            {status == "APPROVED" && <span className="label font-light task-pending-label label-danger"
                                                style={{
                                                    padding: "8px 10px", minWidth: "275px", fontSize: "14px", backgroundColor: "#3dc162", fontWeight: "300",
                                                    lineHeight: "1", color: "#fff", textAlign: "center", whiteSpace: "nowrap", verticalAlign: "baseline", borderRadius: "0.25em"
                                                }}>
                                                Completed on {getReadableDate(completeddate)}
                                            </span>}
                                            {status != "APPROVED" && <Anchor style={{ paddingLeft: "10px", color: "rgb(60, 179, 113)" }} onClick={() => {
                                                this.updateStatus(this.state.TasksView.id, "APPROVED");
                                            }} ><i className="fa fa-check mr-1"></i>
                                                <span>Mark as Completed</span></Anchor>}
                                            {status == "APPROVED" && <Anchor style={{ paddingLeft: "10px", color: "rgb(255, 165, 0)" }} onClick={() => {
                                                this.updateStatus(this.state.TasksView.id, "PENDING");
                                            }} ><i className="fa fa-check mr-1"></i>
                                                <span>Mark as Pending</span></Anchor>}
                                        </p>

                                    </div>
                                    <div className="description">
                                        <div style={{ display: "block", color: "#999", fontSize: "12px" }}>Description
                                            <div style={{ color: "#55687d", fontSize: "14px", paddingTop: "0px" }}>
                                                {description}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="TaskDetails">
                                        <div style={{ display: "block", color: "#999", fontSize: "12px" }}>Assigned to
                                            <div style={{ color: "#55687d", fontSize: "14px", paddingTop: "0px" }}> <EmployeeListColumn id={employee.id} ></EmployeeListColumn>
                                                {employee.name}
                                            </div>
                                        </div>
                                        <div style={{ display: "block", color: "#999", fontSize: "12px", paddingTop: "10px" }}>Start date
                                            <div style={{ color: "#55687d", fontSize: "14px" }}>
                                                {getReadableDate(startdate)}
                                            </div>
                                        </div>
                                        <div style={{ display: "block", color: "#999", fontSize: "12px", paddingTop: "10px" }}>{status != "APPROVED" ? "Due on" : "End date"}
                                            <div style={{ color: "#55687d", fontSize: "14px" }}>
                                                {getReadableDate(enddate)}
                                            </div>
                                        </div>
                                        {status == "APPROVED" && <div style={{ display: "block", color: "#999", fontSize: "12px", paddingTop: "10px" }}>Completed on
                                            <div style={{ color: "#55687d", fontSize: "14px" }}>
                                                {getReadableDate(completeddate)}
                                            </div>
                                        </div>}
                                        <div style={{ display: "block", color: "#999", fontSize: "12px", paddingTop: "10px" }}>Attachments
                                            <div style={{ color: "#55687d", fontSize: "14px" }}>
                                                <Anchor onClick={() => {
                                                    fileDownload(this.state.TasksView.id, this.state.TasksView.id, "TASKS", this.state.TasksView.fileName);
                                                }} title={this.state.TasksView.fileName}>
                                                    <i className='fa fa-download'></i> {fileName}
                                                </Anchor>
                                                <div><a href={this.state.TasksView.url}>{this.state.TasksView.url}</a> </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="content">
                                    <div style={{ display: "block", color: "#999", fontSize: "12px" }}>Raised by
                                        {raisedby != null && <> <div style={{ color: "#55687d", fontSize: "14px" }}> <EmployeeListColumn id={raisedby.id}></EmployeeListColumn>
                                            {raisedby.name}</div></>}
                                        {raisedby == null && <> <div style={{ color: "#55687d", fontSize: "14px" }}> Admin  </div></>}

                                    </div>
                                    <div style={{ display: "block", color: "#999", fontSize: "12px" }}>Raised on
                                        <div style={{ color: "#55687d", fontSize: "14px" }}>
                                            {getReadableDate(createdOn)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
                {/* <div><button className="btn btn-primary" onClick={this.generatePDF} >Export To PDF</button></div> */}
            </div>
        )
    }
}