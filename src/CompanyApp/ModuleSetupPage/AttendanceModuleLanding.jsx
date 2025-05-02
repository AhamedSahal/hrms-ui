import React, { Component } from 'react';
import AttendanceFormatForm from '../Settings/Format/attendanceFormat';
import RegularizationSettings from '../ModuleSetup/Regularization/form';
import RequestPermissionSettings from '../ModuleSetup/RequestPermission';
export default class AttendanceModuleLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            req: true
        };
    }
    render() {
        return (
            <div >


                <div className="tab-content">
                    <div id="Attendance" className="pro-overview tab-pane fade show active ">
                        <AttendanceFormatForm></AttendanceFormatForm>
                    </div>
                    <div id="Regularization" className="mt-2 pro-overview tab-pane fade show active">
                        <RegularizationSettings></RegularizationSettings>
                    </div>
                    <div id="RequestPermision" className="mt-2 pro-overview tab-pane fade show active">
                        <RequestPermissionSettings></RequestPermissionSettings>
                    </div>
                </div>

            </div>
        )
    }
}