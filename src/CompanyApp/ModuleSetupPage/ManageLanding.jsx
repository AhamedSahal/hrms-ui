import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle } from '../../utility';
import EmployeeModule from './EmployeeModule'
import LeaveModule from './LeaveModule';
import RosterModule from './RosterModule'
import PoliciesDocuments from '../ModuleSetup/PoliciesDocuments'
import DocumentRequestLanding from './DocumentRequestLanding'
import AssetsLanding from './AssetsLanding'
import { Box, Tab, Tabs } from '@mui/material';
import AttendanceFormatForm from '../Settings/Format/attendanceFormat';
import AttendanceModuleLanding from './AttendanceModuleLanding';
export default class ManageLanding extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0
        };
    }
    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    };
    render() {
        return (
            <div >


                <div className="mt-3 content container-fluid">
                    <Box className='nav_level3' >
                        <Tabs value={this.state.value} onChange={this.handleChange}>
                            <Tab href="#Employee" data-toggle="tab" className="manage-nav nav-link" id="label1" label="Employee" />
                            <Tab href="#AttendanceFormat" data-toggle="tab" className="manage-nav nav-link" id="label1" label="Attendance" />
                            <Tab href="#Leave" data-toggle="tab" className="manage-nav nav-link" id="label1" label="Leave" />
                            <Tab href="#Roster" data-toggle="tab" className="manage-nav nav-link" id="label1" label="Roster" />
                            <Tab href="#Policy" data-toggle="tab" className="manage-nav nav-link" id="label1" label="Policy & Document" />
                            <Tab href="#Document" data-toggle="tab" className="manage-nav nav-link" id="label1" label="Document Request" />
                            <Tab href="#Assets" data-toggle="tab" className="manage-nav nav-link" id="label1" label="Assets" />
                        </Tabs>
                    </Box>
                    <div className="tab-content">
                        <div id="Employee" className="pro-overview tab-pane fade show active">
                            <EmployeeModule></EmployeeModule>
                        </div>
                        <div id="Leave" className="pro-overview tab-pane fade ">
                            <LeaveModule></LeaveModule>
                        </div>
                        <div id="Roster" className="pro-overview tab-pane fade">
                            <RosterModule></RosterModule>
                        </div>
                        <div id="Policy" className="pro-overview tab-pane fade ">
                            <PoliciesDocuments></PoliciesDocuments>
                        </div>
                        <div id="Document" className="pro-overview tab-pane fade ">
                            <DocumentRequestLanding></DocumentRequestLanding>
                        </div>
                        <div id="Assets" className="pro-overview tab-pane fade ">
                            <AssetsLanding></AssetsLanding>
                        </div>
                        <div id="AttendanceFormat" className="pro-overview tab-pane fade ">
                            <AttendanceModuleLanding></AttendanceModuleLanding>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}