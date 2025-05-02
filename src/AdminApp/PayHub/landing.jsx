import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle, getUserType } from '../../utility';
import PayHubBulkUpload from './payHubBulkUpload';
import SettingsModule from './Settings/settingModule';
import PayHubReports from './Reports';
import PayHubReport from './Reports';
export default class PayHubLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        return (
            <div style={{ backgroundColor: '#f5f5f5' }} className="page-wrapper">
                <Helmet>
                    <title>PayHub | {getTitle()}</title>
                </Helmet>

                <div className="content container-fluid">
                    <div className="mt-4 tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Manage Pay Hub</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item"><a href="#payhub" data-toggle="tab" className="pr-3 pl-3 nav-link active">Pay Hub</a></li>
                                            <li className="nav-item"><a href="#settings" data-toggle="tab" className="pr-3 pl-3 nav-link ">Settings</a></li>
                                            <li className="nav-item"><a href="#reports" data-toggle="tab" className="pr-3 pl-3 nav-link ">Reports</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="payhub" className="pro-overview insidePageDiv tab-pane fade show active">
                            <PayHubBulkUpload></PayHubBulkUpload>
                        </div>
                        <div id="settings" className="pro-overview insidePageDiv tab-pane fade ">
                            <SettingsModule></SettingsModule>
                        </div>
                        <div id="reports" className="pro-overview insidePageDiv tab-pane fade ">
                            <PayHubReport></PayHubReport>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}