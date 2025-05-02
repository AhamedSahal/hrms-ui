import React, { Component } from 'react';
import { verifyOrgLevelViewPermission } from '../../utility';
import AccessDenied from '../../MainPage/Main/Dashboard/AccessDenied';
import AttendanceConfiguration from './attendanceConfig';
import LocationConfig from './Locations';
import IPConfig from './IPs';

export default class AttendanceConfigurationLandingPage extends Component {
    render() {
        return (
            <div className="">
                {verifyOrgLevelViewPermission("Settings Configuration") &&
                    <div className="tab-content">
                        <div className='pro-overview moduleSetupPageContainer tab-pane fade show active'>
                            <div id="configuration" className="pro-overview tab-pane fade show active">
                                <AttendanceConfiguration></AttendanceConfiguration>
                            </div>
                            <div id="location" className="mt-2 pro-overview tab-pane fade show active">
                                <LocationConfig></LocationConfig>
                            </div>
                            <div id="ip" className="mt-2 pro-overview tab-pane fade show active">
                                <IPConfig></IPConfig>
                            </div>
                        </div>
                    </div>
                } {(!verifyOrgLevelViewPermission("Settings Configuration")) && <AccessDenied></AccessDenied>}
            </div>
        )
    }
}