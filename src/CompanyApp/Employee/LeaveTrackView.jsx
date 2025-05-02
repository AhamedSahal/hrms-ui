
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { FormGroup } from 'reactstrap';
import { toast } from 'react-toastify';
//import { fileDownload } from '../../HttpRequest';
import { Anchor } from 'react-bootstrap';
// import EmployeeListColumn from '../../CompanyApp/Employee/employeeListColumn';
import { getTitle, getCustomizedDate, getUserType, verifyViewPermission, getEmployeeId, getDefaultProfilePicture } from '../../utility';
import { getLeaveTrackList } from './service';
import { updateStatusLeaveTrack } from './leave/service';
import EmployeeListColumn from './employeeListColumn';
const isEmployee = getUserType() == 'EMPLOYEE';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class LeaveTrackView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.history.location.state.id || '',
            data: [],
            employeeId: isEmployee ? getEmployeeId() : undefined,
            status: 1,
            date1: new Date().toLocaleString(),
            comments: "",
            self: props.history.location.state.self || ''
        }
    };
    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        console.log(this.state.self)
        getLeaveTrackList(this.state.id).then(res => {
            let data = res.data
            if (res.status == "OK") {
                this.setState({ data },
                    () => {

                    })
            }
        })
    }
    updateStatus = (comments, id, status) => {
        console.log(this.state.comments)
        updateStatusLeaveTrack(comments, id, status).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                window.location.reload();
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            console.error(err);
            toast.error("Error while updating status");
        })
    }
    render() {
        const { data } = this.state;
        // const { id, employeeId, employee, taskname, description, startdate, createdOn, enddate, fileName, url, raisedby, status, completeddate } = this.state.LeaveTrack;
        return (
            <div className="card" style={{ fontFamily: "wotfard" }}>
                <Helmet>
                    <title>View Leave | {getTitle()}</title>
                </Helmet>
                <div className="page-wrapper" >
                    <div className="col-sm-12" style={{ paddingTop: "30px" }}>
                        <div id="page-header" className="col-sm-12" style={{
                            backgroundColor: "white", minHeight: "650px",
                            overflowY: "auto",
                            border: "2px solid #E7ECF2",
                            borderRadius: "8px",
                            marginBottom: "20px",
                            padding: "32px",
                            position: "relative"
                        }}>
                            {/* <div className="row align-items-center" > */}
                            <div className="col" style={{ fontFamily: "Tahoma" }}>
                                <div className="divHeader" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0 16px", marginBottom: "16px", borderBottom: "2px solid #E7ECF2" }}>
                                    <h3 className="page-title">Leave details</h3>
                                </div>
                            </div>
                            <div className="divContent" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0 0 16px" }}>
                                <div className="divRequest">
                                    <div className="divRequestedBy">
                                        {/* <div style={{ display: "inline-block", color: "#999", fontSize: "12px", width: "200px", marginBottom: "4px" }}>Requested by</div> */}
                                        <div style={{ display: "inline-block", color: "#999", fontSize: "12px", marginBottom: "4px" }}>Requested For</div>
                                        <div>
                                            {/* <span style={{ color: "#55687d", fontSize: "12px", paddingTop: "0px", display: "inline-block", width: "200px" }}>
                                                <img style={{ width: "20px", height: "20px", backgroundPosition: "0 0", backgroundSize: "60%", backgroundRepeat: "no-repeat", borderRadius: "50%" }} className="img-fluid"
                                                    onError={({ currentTarget }) => {
                                                        currentTarget.onerror = null; // prevents looping
                                                        currentTarget.src = getDefaultProfilePicture();
                                                    }} src={'data:image/jpeg;base64,' + data.createdprofileImg} />

                                                <span style={{ color: "#55687d" }}> {data.createdby}</span>

                                            </span> */}
                                            <span style={{ color: "#55687d", fontSize: "12px", display: "inline-block" }}>
                                                <img style={{ width: "20px", height: "20px", backgroundPosition: "0 0", backgroundSize: "60%", backgroundRepeat: "no-repeat", borderRadius: "50%" }} className="img-fluid"
                                                    onError={({ currentTarget }) => {
                                                        currentTarget.onerror = null; // prevents looping
                                                        currentTarget.src = getDefaultProfilePicture();
                                                    }} src={'data:image/jpeg;base64,' + data.profileImg} />

                                                <span style={{ color: "#55687d" }}> {data.employee?.name}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="divTypeLeave">
                                        <div style={{
                                            display: "inline-block", color: "#999", fontSize: "12px", paddingTop: "10px", marginBottom: "4px"
                                        }}>Type Of Leave</div>
                                        <div>
                                            <span style={{ color: "#55687d", fontSize: "14px", lineHeight: "1.5", paddingTop: "0px", display: "inline-block" }}>
                                                {data.leaveType?.name}
                                            </span>
                                            {data.status == "PENDING" && <span className="label font-light task-pending-label label-danger"
                                                style={{
                                                    padding: "4px 8px", marginLeft: "5px", fontSize: "10px", backgroundColor: "#e56f00", fontWeight: "400",
                                                    lineHeight: "1", color: "#fff", textAlign: "center", whiteSpace: "nowrap", verticalAlign: "middle", borderRadius: "8px"
                                                }}> Applied
                                            </span>}
                                            {data.status == "APPROVED" && <span className="label font-light task-pending-label label-danger"
                                                style={{
                                                    padding: "4px 8px", marginLeft: "5px", fontSize: "10px", backgroundColor: "#3dc162", fontWeight: "400",
                                                    lineHeight: "1", color: "#fff", textAlign: "center", whiteSpace: "nowrap", verticalAlign: "middle", borderRadius: "8px"
                                                }}>
                                                Approved
                                            </span>}
                                            {data.status == "REJECTED" && <span className="label font-light task-pending-label label-danger"
                                                style={{
                                                    padding: "4px 8px", marginLeft: "5px", fontSize: "10px", backgroundColor: "#c32222", fontWeight: "400",
                                                    lineHeight: "1", color: "#fff", textAlign: "center", whiteSpace: "nowrap", verticalAlign: "middle", borderRadius: "8px"
                                                }}>
                                                Rejected
                                            </span>}
                                        </div>
                                    </div>
                                    <div className="divLeaveDate" style={{ paddingTop: "10px", marginBottom: "4px" }}>
                                        <div style={{ display: "inline-block", color: "#999", fontSize: "12px", width: "200px", marginBottom: "4px" }}>Leave Start Date</div>
                                        <div style={{ display: "inline-block", color: "#999", fontSize: "12px", marginBottom: "4px" }}>Leave End Date</div>
                                        <div>
                                            <span style={{ color: "#55687d", fontSize: "14px", paddingTop: "0px", display: "inline-block", width: "200px" }}>
                                                {getCustomizedDate(data.startDate)}
                                            </span>
                                            <span style={{ color: "#55687d", fontSize: "14px", display: "inline-block" }}>{getCustomizedDate(data.endDate)}</span>
                                        </div>
                                    </div>
                                    <div className="divRequest" style={{ paddingTop: "10px", marginBottom: "4px" }}>
                                        <div style={{ display: "inline-block", color: "#999", fontSize: "12px", width: "200px", marginBottom: "4px" }}>Requested On</div>
                                        <div>
                                            <span style={{ color: "#55687d", fontSize: "14px", paddingTop: "0px", display: "inline-block", width: "200px" }}>
                                                {getCustomizedDate(data.createdDate)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="divReason" style={{ paddingTop: "10px", marginBottom: "4px" }}>
                                        <div style={{ display: "inline-block", color: "#999", fontSize: "12px", width: "200px", marginBottom: "4px" }}>Reason</div>
                                        <div>
                                            <span style={{ color: "#55687d", fontSize: "14px", paddingTop: "0px", display: "inline-block", width: "200px" }}>
                                                {data.leaveReason}
                                            </span>
                                        </div>
                                    </div>
                                    {data.status != "PENDING" && <> <div className="divComments" style={{ paddingTop: "10px", marginBottom: "4px" }}>
                                        <div style={{ display: "inline-block", color: "#999", fontSize: "12px", width: "200px", marginBottom: "4px" }}>Approval Comments</div>
                                        <div>
                                            <span style={{ color: "#55687d", fontSize: "14px", paddingTop: "0px", display: "inline-block", width: "200px" }}>
                                                {data.comments == "" ? "-" : data.comments}
                                            </span>
                                        </div>
                                    </div></>}
                                </div>
                            </div>

                            <div className="divButton" style={{ paddingLeft: "16px", paddingTop: "10px" }}>
                                {this.state.self != 1 && data.status == "PENDING" && <><FormGroup> <label style={{ color: "#999" }}>Comments</label>
                                    <input name="comments" type="text" className="form-control" autoComplete='off'
                                        onChange={(e) => {
                                            this.setState({
                                                comments: e.target.value
                                            });
                                        }} />
                                </FormGroup>
                                    <Anchor
                                        onClick={() => {
                                            this.updateStatus(this.state.comments, this.state.id, "APPROVED");
                                        }}
                                        className="btn btn-primary btn-sm">Approve</Anchor>
                                    &nbsp;
                                    <Anchor
                                        onClick={() => {
                                            this.updateStatus(this.state.comments, this.state.id, "REJECTED");
                                        }}
                                        className="btn btn-danger btn-sm">Reject</Anchor></>}
                            </div>
                        </div>

                    </div>
                </div>

            </div >
        )
    }
}