import React, { Component } from 'react';
import GroupConfiguration from './groupConfigurationForm';

export default class AttendanceSettingLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userGroup: this.props.userGroup ? props.userGroup : {},
            value: 0,
        };
    }
    render() {
        return (
            <div style={{ backgroundColor: '#f5f5f5', padding: "10px", margin: "-30px" }} >
                <div className="content container-fluid">
                    <div className="tab-content">
                        <div className="subMenu_box row user-tabs " style={{ position: "static" }}>
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item"><a href="#attendanceSettings" data-toggle="tab" className="nav-link active">Attendance Settings</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="attendanceSettings" className="pro-overview tab-pane fade show active mt-3 mb-3">
                            <GroupConfiguration fetchList={this.props.fetchList} userGroup={this.props.userGroup} updateList={this.props.updateList}></GroupConfiguration>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}