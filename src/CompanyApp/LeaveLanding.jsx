import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle } from '../utility';
import { default as EmployeeLeave } from './Employee/leave';
import { default as LeaveBalance } from './MyEntitlements/Leave/index';
import Timeinlieu from './MyEntitlements/TimeInLieu';
export default class LeaveLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultValidation: props?.location?.fromDashboard || false
        }

    }
    render() {
        const dashboardLink = this.props?.location?.fromDashboard
        const dashboardTimeInLieu =this.props?.location?.fromDashboardTimeInLieu
        
        return (
            <div style={{ backgroundColor: '#f5f5f5' }} className="page-wrapper">
                <Helmet>
                    <title>Leave Module Setup | {getTitle()}</title>
                </Helmet>

                <div className="content container-fluid">


                    <div className="mt-4 tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Leave Module</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item"><a href="#leavelist" data-toggle="tab" className={!dashboardLink && !dashboardTimeInLieu ? "nav-link active" :  "nav-link"}>Leave List</a></li>
                                            <li className="nav-item"><a href="#leavebalance" data-toggle="tab" className={dashboardLink ? "nav-link active" :  "nav-link"} onClick={() => this.setState({defaultValidation: true})}>Leave Balance</a></li>
                                            <li className="nav-item"><a href="#timeinlieu" data-toggle="tab"className={dashboardTimeInLieu ? "nav-link active" :  "nav-link"}>Time in Lieu</a></li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div id="leavelist" className={!dashboardLink && !dashboardTimeInLieu ? "pro-overview insidePageDiv tab-pane fade show active" :  "pro-overview insidePageDiv tab-pane fade"}>
                            <EmployeeLeave {...this.props}></EmployeeLeave>
                        </div>
                        <div id="leavebalance" className={dashboardLink ? "pro-overview insidePageDiv tab-pane fade show active" :  "pro-overview insidePageDiv tab-pane fade"}>
                          {this.state.defaultValidation &&  <LeaveBalance data={dashboardLink} {...this.props}></LeaveBalance>}
                        </div>
                        <div id="timeinlieu" className={dashboardTimeInLieu ? "pro-overview insidePageDiv tab-pane fade show active" :  "pro-overview insidePageDiv tab-pane fade"}>
                            <Timeinlieu data = {dashboardTimeInLieu} {...this.props}></Timeinlieu>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}