import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle } from '../../utility';
import LeaveApproval from './leave';
import TeamOvertimeApproval from './Overtime';
import TimeinlieuApproval from './TimeInLieu/list';
import TimesheetApproval from './Timesheet';
import { getOvertimeActive } from '../Employee/service';

export default class TeamApprovalLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
          overtimeEnable: false,
        };
      }

      componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        getOvertimeActive().then(res => {
            if (res.status == "OK") {
               this.setState({overtimeEnable: res.data})
            }
        })
    }
    render() {
        console.log("Loading")
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Team Approvals | {getTitle()}</title>
                </Helmet>



                <div className="mt-4 content container-fluid">
                    <div className="tab-content">
                        <div className="row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Approvals Module</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item"><a href="#leave" data-toggle="tab" className="nav-link active">Leave</a></li>
                                            <li className="nav-item"><a href="#timesheet" data-toggle="tab" className="nav-link">Timesheet</a></li>
                                         {this.state.overtimeEnable &&  <li className="nav-item"><a href="#overtime" data-toggle="tab" className="nav-link">Overtime</a></li>}
                                            <li className="nav-item"><a href="#timeinlieu" data-toggle="tab" className="nav-link">Time in Lieu</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="leave" className="pro-overview  tab-pane fade show active">
                            <LeaveApproval></LeaveApproval>
                        </div>
                        <div id="timesheet" className="pro-overview  tab-pane fade">
                            <TimesheetApproval></TimesheetApproval>
                        </div>
                        <div id="overtime" className="pro-overview  tab-pane fade">
                            <TeamOvertimeApproval></TeamOvertimeApproval>
                        </div>
                        <div id="timeinlieu" className="pro-overview  tab-pane fade">
                            <TimeinlieuApproval></TimeinlieuApproval>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}