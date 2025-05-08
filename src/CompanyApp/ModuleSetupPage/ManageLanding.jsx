import React, { Component } from 'react';
import EmployeeModule from './EmployeeModule'
import LeaveModule from './LeaveModule';
import RosterModule from './RosterModule'
import PoliciesDocuments from '../ModuleSetup/PoliciesDocuments'
import DocumentRequestLanding from './DocumentRequestLanding'
import AssetsLanding from './AssetsLanding'
import AttendanceModuleLanding from './AttendanceModuleLanding';

export default class ManageLanding extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeMenu: 'Employee' // Default active button set to 'Employee'
        };
    }

    handleMenuClick = (menu) => {
        this.setState({ activeMenu: menu });
    };

    render() {
        return (
            <div>
                <div className="mt-3 content container-fluid">
                    <div className="menu-toggle">
                        <button
                            className={this.state.activeMenu === 'Employee' ? 'active' : ''}
                            onClick={() => this.handleMenuClick('Employee')}
                        >
                            Employee
                        </button>
                        <button
                            className={this.state.activeMenu === 'Attendance' ? 'active' : ''}
                            onClick={() => this.handleMenuClick('Attendance')}
                        >
                            Attendance
                        </button>
                        <button
                            className={this.state.activeMenu === 'Leave' ? 'active' : ''}
                            onClick={() => this.handleMenuClick('Leave')}
                        >
                            Leave
                        </button>
                        <button
                            className={this.state.activeMenu === 'Roster' ? 'active' : ''}
                            onClick={() => this.handleMenuClick('Roster')}
                        >
                            Roster
                        </button>
                        <button
                            className={this.state.activeMenu === 'Policy' ? 'active' : ''}
                            onClick={() => this.handleMenuClick('Policy')}
                        >
                            Policy & Document
                        </button>
                        <button
                            className={this.state.activeMenu === 'Document' ? 'active' : ''}
                            onClick={() => this.handleMenuClick('Document')}
                        >
                            Document Request
                        </button>
                        <button
                            className={this.state.activeMenu === 'Assets' ? 'active' : ''}
                            onClick={() => this.handleMenuClick('Assets')}
                        >
                            Assets
                        </button>
                    </div>
                    <div className="tab-content">
                        {this.state.activeMenu === 'Employee' && (
                            <div>
                                <EmployeeModule />
                            </div>
                        )}
                        {this.state.activeMenu === 'Attendance' && (
                            <div>
                                <AttendanceModuleLanding />
                            </div>
                        )}
                        {this.state.activeMenu === 'Leave' && (
                            <div>
                                <LeaveModule />
                            </div>
                        )}
                        {this.state.activeMenu === 'Roster' && (
                            <div>
                                <RosterModule />
                            </div>
                        )}
                        {this.state.activeMenu === 'Policy' && (
                            <div>
                                <PoliciesDocuments />
                            </div>
                        )}
                        {this.state.activeMenu === 'Document' && (
                            <div>
                                <DocumentRequestLanding />
                            </div>
                        )}
                        {this.state.activeMenu === 'Assets' && (
                            <div>
                                <AssetsLanding />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}