import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import {  getUserType, verifyOrgLevelViewPermission } from '../../../utility';
import Draft from './Draft';
import Active from './Active';
import Scheduled from './Scheduled';
import Completed from './Completed';
import StandBy from './StandBy';
import { Box, Tab, Tabs } from '@mui/material';
import Template from './Template';

const isCompanyAdmin = (getUserType() == 'COMPANY_ADMIN' || verifyOrgLevelViewPermission("Survey"));
const isSuperAdmin = getUserType() == 'SUPER_ADMIN'
export default class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: isSuperAdmin ? "Template" : (isCompanyAdmin ? "Draft" : "Draft"),
            prevActiveTab: ""
        };
    }

    handleTabChange = (tab) => {

        this.setState({ activeTab: tab });
    };

    componentDidUpdate() {
        if (this.state.activeTab !== this.state.prevActiveTab) {
            const activeComponent = this.getActiveComponent();
            if (activeComponent && typeof activeComponent.fetchList === 'function') {
                activeComponent.fetchList();
            }
            this.setState({ prevActiveTab: this.state.activeTab });
        }
    }

    getActiveComponent() {
        switch (this.state.activeTab) {
            case "Draft":
                return this.draftComponentRef;
            case "Active":
                return this.activeComponentRef;
            case "Scheduled":
                return this.scheduledComponentRef;
            case "Completed":
                return this.completedComponentRef;
            case "StandBy":
                return this.standbyComponentRef;
            case "Template":
                return this.templateComponentRef;
            default:
                return null;
        }
    }

    render() {
        console.log("cell Landing", this.state.activeTab, this.state.prevActiveTab);
        return (


            <div className="page-wrapper">
                
                <div className="mt-4 content container-fluid">
                    <div className="tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Survey Module</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">

                                            {isCompanyAdmin && <li className="nav-item" onClick={() => this.handleTabChange("Draft")}>
                                                <a href="#Draft" data-toggle="tab" className={`nav-link ${this.state.activeTab === "Draft" ? "active" : ""}`}>
                                                    Draft
                                                </a>
                                            </li>}
                                            {isCompanyAdmin && <li className="nav-item" onClick={() => this.handleTabChange("Scheduled")}>
                                                <a href="#Scheduled" data-toggle="tab" className={`nav-link ${this.state.activeTab === "Scheduled" ? "active" : ""}`}>
                                                    Scheduled
                                                </a>
                                            </li>}
                                            {isCompanyAdmin && <li className="nav-item" onClick={() => this.handleTabChange("Active")}>
                                                <a href="#Active" data-toggle="tab" className={`nav-link ${this.state.activeTab === "Active" ? "active" : ""}`}>
                                                    Active
                                                </a>
                                            </li>}
                                            {isCompanyAdmin && <li className="nav-item" onClick={() => this.handleTabChange("Completed")}>
                                                <a href="#Completed" data-toggle="tab" className={`nav-link ${this.state.activeTab === "Completed" ? "active" : ""}`}>
                                                    Completed 
                                                </a>
                                            </li>}
                                            {isCompanyAdmin && <li className="nav-item" onClick={() => this.handleTabChange("StandBy")}>
                                                <a href="#StandBy" data-toggle="tab" className={`nav-link ${this.state.activeTab === "StandBy" ? "active" : ""}`}>
                                                    StandBy
                                                </a>
                                            </li>}
                                            {isCompanyAdmin && <li className="nav-item" onClick={() => this.handleTabChange("Template")}>
                                                <a href="#Template" data-toggle="tab" className={`nav-link ${this.state.activeTab === "Template" ? "active" : ""}`}>
                                                    Template
                                                </a>
                                            </li>}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tab-content">
                            {isCompanyAdmin && <div id="Draft" className={`pro-overview tab-pane ant-table-background fade ${this.state.activeTab === "Draft" ? "show active" : ""}`}>
                                <Draft ref={(ref) => (this.draftComponentRef = ref)} onTabChange={this.handleTabChange} />
                            </div>}
                            {isCompanyAdmin && <div id="Active" className={`pro-overview tab-pane ant-table-background fade ${this.state.activeTab === "Active" ? "show active" : ""}`}>
                                <Active ref={(ref) => (this.activeComponentRef = ref)} onTabChange={this.handleTabChange} />
                            </div>}
                            {isCompanyAdmin && <div id="Scheduled" className={`pro-overview tab-pane ant-table-background fade ${this.state.activeTab === "Scheduled" ? "show active" : ""}`}>
                                <Scheduled ref={(ref) => (this.scheduledComponentRef = ref)} onTabChange={this.handleTabChange} />
                            </div>}
                            {isCompanyAdmin && <div id="Completed" className={`pro-overview tab-pane ant-table-background fade ${this.state.activeTab === "Completed" ? "show active" : ""}`}>
                                <Completed ref={(ref) => (this.completedComponentRef = ref)} onTabChange={this.handleTabChange} />
                            </div>}
                            {isCompanyAdmin && <div id="StandBy" className={`pro-overview tab-pane ant-table-background fade ${this.state.activeTab === "StandBy" ? "show active" : ""}`}>
                                <StandBy ref={(ref) => (this.standbyComponentRef = ref)} onTabChange={this.handleTabChange} />
                            </div>}
                            {isCompanyAdmin && <div id="Template" className={`pro-overview tab-pane ant-table-background fade ${this.state.activeTab === "Template" ? "show active" : ""}`}>
                                <Template ref={(ref) => (this.templateComponentRef = ref)} onTabChange={this.handleTabChange} />
                            </div>}
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
