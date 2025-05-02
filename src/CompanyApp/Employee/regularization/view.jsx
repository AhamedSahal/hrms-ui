import React, { Component } from "react";
import { Table } from "antd";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { itemRender } from "../../../paginationfunction";
import { toast } from "react-toastify";
import { BsLink45Deg } from "react-icons/bs";
import { getUserType, getEmployeeId, getReadableDate, convertToUserTimeZone, toLocalDateTime,formatDateTime, toDateTime } from "../../../utility";
import EmployeeListColumn from "../employeeListColumn";


const { Header, Body, Footer, Dialog } = Modal;
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class AttendaceRegularizationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regularize: props.regularize || {},
      data: [],
      showForm: false,
      job: [],
    }
  }


  getStyle(text) {

    if (text === 'APPROVED') {
      return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Approved</span>;
    }
    if (text === 'REJECTED') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Rejected</span>;
    }
    if (text === 'PENDING') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Pending</span>;
    }
    return '-';
  }

  render() {
    const { regularize } = this.state;

    return (
      <div>
        <div className="row" style={{ paddingLeft: "17px" }}>
          <div className="col-md-12">
            <div className="row" style={{ border: "2px solid #E7ECF2", padding: "5px" }}>

              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>
                {<div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  <EmployeeListColumn id={regularize.employee.id} ></EmployeeListColumn>{regularize.employee.name}

                </div>}
              </div>
              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Date
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {getReadableDate(regularize.date)}
                </div>
              </div>
              <div className="col-md-4" style={{ padding: "15px" }}>

              </div>

              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Assigned Shift
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {regularize.settingClockIn != null ? convertToUserTimeZone(toDateTime(regularize.date, regularize.settingClockIn)) : "-"} to {regularize.settingClockOut != null ? convertToUserTimeZone(toDateTime(regularize.date, regularize.settingClockOut)) : "-"}
                </div>
              </div>

              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Recorded Clock-In Time
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {regularize.actualInTimeBeforeRegularize != null ? convertToUserTimeZone(regularize.actualInTimeBeforeRegularize) : "-"}
                </div>
              </div>

              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Recorded Clock-Out Time
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {regularize.actualOutTimeBeforeRegularize != null ? convertToUserTimeZone(regularize.actualOutTimeBeforeRegularize) : "-"}
                </div>
              </div>

              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>System Reason
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {regularize.systemReason != null ? regularize.systemReason : "-"}
                </div>
              </div>

              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Requested Clock-In Time
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {regularize.regularizedInTime != null ? formatDateTime(toLocalDateTime(regularize.regularizedInTime)) : "-"}
                </div>
              </div>

              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Requested Clock-Out Time
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {regularize.regularizedOutTime != null ? formatDateTime(toLocalDateTime(regularize.regularizedOutTime)) : "-"}
                </div>
              </div>



              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Request Submission Status
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {<span className={regularize.regularizationStatus == "NOT_REGULARIZED" ? "badge bg-inverse-secondary " : regularize.regularizationStatus == "PENDING" ? "badge bg-inverse-warning " : regularize.regularizationStatus == "REGULARIZED" ? "badge bg-inverse-success " : "-"}>
                    {regularize.regularizationStatus == "NOT_REGULARIZED" ? <i className="pr-2 fa fa-ban text-secondary"></i> : regularize.regularizationStatus == "PENDING" ? <i className="pr-2 fa fa-hourglass-o text-warning"></i> : regularize.regularizationStatus == "REGULARIZED" ? <i className="pr-2 fa fa-check text-success"></i> : "-"}{
                      regularize.regularizationStatus == "NOT_REGULARIZED" ? 'Not Regularized' : regularize.regularizationStatus == "PENDING" ? 'Pending' : regularize.regularizationStatus == "REGULARIZED" ? 'Regularized' : "-"
                    }</span>}
                </div>
              </div>



              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Approval Status
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {this.getStyle(regularize.approvalstatus)}
                </div>
              </div>

              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Reason for Regularization
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {regularize.regularizationRemarks != null ? regularize.regularizationRemarks : "-"}
                </div>
              </div>

              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Remarks
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {regularize.remarks != null ? regularize.remarks : "-"}
                </div>
              </div>

              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Applied On
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {regularize.submittedOn != null ? formatDateTime(toLocalDateTime(regularize.submittedOn)) : "-"}
                </div>
              </div>

              {(regularize.approvalstatus == "REJECTED" || regularize.approvalstatus == "APPROVED") && <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>{regularize.approvalstatus == "REJECTED" ? "Rejected on" : "Approved on"}
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {regularize.approvedOn != null ? formatDateTime(toLocalDateTime(regularize.approvedOn)) : "-"}
                </div>
              </div>}
            </div>
          </div>
        </div>
        <br />



      </div>
    )
  }
}