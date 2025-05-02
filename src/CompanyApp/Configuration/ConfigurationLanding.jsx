import React, { Component } from 'react';
import { verifyOrgLevelViewPermission } from '../../utility';
import AccessDenied from '../../MainPage/Main/Dashboard/AccessDenied';
import AttendanceConfigurationLandingPage from './AttendanceConfigurationLandingPage';

export default class ConfigurationRoute extends Component {
    render() {
        return (
            <div style={{ backgroundColor: '#f5f5f5' }} className="page-wrapper">
                <div className="content container-fluid">
                    <div className="mt-4 tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Configuration </h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item"><a href="#attendance" data-toggle="tab" className="nav-link active">Attendance</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="attendance" className="pro-overview tab-pane fade show active">
                            {verifyOrgLevelViewPermission("Settings Configuration") &&
                                <AttendanceConfigurationLandingPage></AttendanceConfigurationLandingPage>}
                            {(!verifyOrgLevelViewPermission("Settings Configuration")) && <AccessDenied></AccessDenied>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}