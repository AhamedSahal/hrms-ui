
import React, { Component } from 'react';
import { getReadableDate,getReadableMonthYear,getReadableDayMonth } from '../../../utility';

 
export default class LeaveTypeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leaveType: props.leaveType || {
                id: 0

            }
        }

    };
    render() {
        const { id  } = this.state;
        return (
            <div className="card" style={{ fontFamily: "wotfard" }}>
                <div className="card-body" id="card">
                        <div className="row">
                        
                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Location
                        {<div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.branch?.name} 

                        </div>}
                        </div>

                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Title
                        {<div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.title} 

                        </div>}
                        </div>
                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Days
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                           {this.state.leaveType.days}
                        </div>
                        </div> 

                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Applicable To
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.applicableGender == 0 ? "Male" : this.state.leaveType.applicableGender == 1 ? "Female" : "All"}
                        </div>
                        </div>

                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Leave Start Date
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.entStartMode == 0 ? "Calendar" : "Work Anniversary"}
                        </div>
                        </div>

                        <div className="col-md-4" style={{ color: this.state.leaveType.entStartMode == 0 ? "#999" : "White", fontSize: "14px", paddingTop: "10px" }}>Entitlement Date
                        <div style={{ color: this.state.leaveType.entStartMode == 0 ?  "#55687d" : "White", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.entOpeningDate != null ? getReadableDayMonth(this.state.leaveType.entOpeningDate) : "01-Jan"}
                        </div>
                        </div>

                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Half-Day
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.halfDay ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{this.state.leaveType.halfDay ? 'Yes' : 'No'}
                        </div>
                        </div>

                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Paid
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.paid ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{this.state.leaveType.paid ? 'Yes' : 'No'}
                        </div>
                        </div>

                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Accrual
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.accrual ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{this.state.leaveType.accrual ? 'Yes' : 'No'}
                        </div>
                        </div>

                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Encashment
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.encashment ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{this.state.leaveType.encashment ? 'Yes' : 'No'}
                        </div>
                        </div>

                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Attachment
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.attachmentRequired ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{this.state.leaveType.attachmentRequired ? 'Yes' : 'No'}
                        </div>
                        </div>

                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Show On Dashboard
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.showOnDashboard ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{this.state.leaveType.showOnDashboard ? 'Yes' : 'No'}
                        </div>
                        </div>



                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Show on App
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.showOnApp ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{this.state.leaveType.showOnApp ? 'Yes' : 'No'}
                        </div>
                        </div>



                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Carry Forward
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.carryForward ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{this.state.leaveType.carryForward ? 'Yes' : 'No'}
                        </div>
                        </div>

                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Max Limit(Carry Forward)
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.carryForward ? this.state.leaveType.carrymaxLimit : "-"}
                        </div>
                        </div>

                        {this.state.leaveType.entStartMode == 0 && <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Expiry Date(Carry Forward)
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.carryForward ? this.state.leaveType.carryexpiryDate != null ? getReadableDayMonth(this.state.leaveType.carryexpiryDate) : "-" : "-"}
                        </div>
                        </div>}

                        {this.state.leaveType.entStartMode == 1 && <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Expiry Month(Carry Forward)
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.carryForward ? this.state.leaveType.carryexpirymonth != null ? this.state.leaveType.carryexpirymonth : "-" : "-"}
                        </div>
                        </div>}

                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Future Year Leave
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                           {this.state.leaveType.futureYearLeave ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{this.state.leaveType.futureYearLeave ? 'Yes' : 'No'}
                        </div>
                        </div>

                        {this.state.leaveType.entStartMode == 0 && <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Future Year Leave Opening Date
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.futureYearLeave ? this.state.leaveType.futureexpiryDate != null ? getReadableDayMonth(this.state.leaveType.futureexpiryDate) : "-" : "-"}
                        </div>
                        </div>}

                        {this.state.leaveType.entStartMode == 1 && <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Advance Availability(Future Year Leave)
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.futureYearLeave ? this.state.leaveType.futureOpeningMonth != null ? this.state.leaveType.futureOpeningMonth : "-" : "-"}
                        </div>
                        </div>}

                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Estimate Leave Balance
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.estimateLeaveBalance ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{this.state.leaveType.estimateLeaveBalance ? 'Yes' : 'No'}
                        </div>
                        </div>

                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Negative Balance
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.negativeBalance ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{this.state.leaveType.negativeBalance ? 'Yes' : 'No'}
                        </div>
                        </div>

                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Max Limit
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                           {this.state.leaveType.negativeBalance ? this.state.leaveType.negativebalmaxLimit : "-"}
                        </div>
                        </div>

                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Created On
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                            {this.state.leaveType.createdOn != null ? getReadableDate(this.state.leaveType.createdOn) : "-"}
                        </div>
                        </div>

                        </div>
                    

                </div> 
            </div>
        )
    }
}