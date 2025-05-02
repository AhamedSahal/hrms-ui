import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getCompanyIdCookie, getTitle } from '../../utility';
import ProjectLanding from './PlanModule'
import EngageLanding from './EngageLanding'
import PayLanding from './PayLanding'
import ManageLanding from './ManageLanding'
import PerformanceLanding from '../ModuleSetup/Performance/PerformanceLanding'
import OrgSetupForm from '../ModuleSetup/OrgSetup/form';
import { Box, Tab, Tabs } from '@mui/material';
import ChatbotMessage from '../ModuleSetup/ChatbotMessage';
import DocumentExpiryAlert from '../ModuleSetup/DocumentExpiryAlert/documentExpiryAlertForm';
import AutoDocs from '../ModuleSetup/Automate';
import HireModuleLanding from './HireModuleLanding';
import BulkUploadTypeForm from '../Employee/BulkUploadType';
import OwnerLandingPage from './OwnerLandingPage';
import GradingStructure from './CompensationSettings';
import CompensationReward from './CompensationSettings';
import { getModuleSetupByCompanyId } from '../../AdminApp/Company/service';
import MultiApproveLanding from './MultiApproveLanding';
import OnboardSetup from './OnboardSetup';
import OffboardSetup from './Offboard';
export default class ModuleSetupLanding extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            activeTab: "",
            moduleSetup: [],
            companyId: getCompanyIdCookie(),
        };
    }
    componentDidMount() {
        this.fetchModuleSetup();

    }
    componentWillUnmount() {
        localStorage.removeItem('selectedTab');
    }
    fetchModuleSetup = () => {
        getModuleSetupByCompanyId(this.state.companyId).then(res => {
            if (res.status === 'OK') {
                this.setState({
                    moduleSetup: res.data,
                })
                const selectedTab = localStorage.getItem('selectedTab');

                if (selectedTab) {
                    this.setState({ activeTab: selectedTab });
                } else {
                    const firstActiveModule = res.data.find(module => module.isActive === "1");

                    if (firstActiveModule) {
                        this.setState({ activeTab: firstActiveModule.moduleName });
                    }
                }

            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    }
    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    };
    handleTabChange = (tab) => {
        this.setState({ activeTab: tab });
        localStorage.setItem('selectedTab', tab);
    };

    render() {
        const { activeTab } = this.state;
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Module Setup | {getTitle()}</title>
                </Helmet>

                <div className="mt-4 content container-fluid">
                    <div className="tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Module Setup</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">

                                            {this.state.moduleSetup.map((item, index) => (<>
                                                {item.moduleName === "Plan" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#Plan" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Plan' ? 'active' : ''}`}
                                                           onClick={() => this.handleTabChange('Plan')}>Plan</a></li>
                                                </>}
                                                {item.moduleName === "Organise" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#Organise" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Organise' ? 'active' : ''}`}
                                                           onClick={() => this.handleTabChange('Organise')}>Organise</a> </li>
                                                </>}
                                                {item.moduleName === "Onboard" && item.isActive == "1" &&<>
                                                    <li className="nav-item"><a href="#Onboard" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Onboard' ? 'active' : ''}`}
                                                        onClick={() => this.handleTabChange('Onboard')}>Onboard</a> </li>
                                                </>}
                                                {item.moduleName === "Offboard" && item.isActive == "1" &&<>
                                                    <li className="nav-item"><a href="#Offboard" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Offboard' ? 'active' : ''}`}
                                                        onClick={() => this.handleTabChange('Offboard')}>Offboard</a> </li>
                                                </>}
                                                {item.moduleName === "Manage" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#manage" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Manage' ? 'active' : ''}`}
                                                        onClick={() => this.handleTabChange('Manage')}>Manage</a> </li>
                                                </>}
                                                {item.moduleName === "Hire" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#hire" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Hire' ? 'active' : ''}`}
                                                        onClick={() => this.handleTabChange('Hire')}>Hire</a> </li>
                                                </>}
                                                {item.moduleName === "Perform" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#perform" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Perform' ? 'active' : ''}`}
                                                        onClick={() => this.handleTabChange('Perform')}>Perform</a> </li>
                                                </>}
                                                {item.moduleName === "Engage" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#Engage" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Engage' ? 'active' : ''}`}
                                                        onClick={() => this.handleTabChange('Engage')}>Engage</a> </li>
                                                </>}
                                                {item.moduleName === "Pay" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#nationality" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Pay' ? 'active' : ''}`}
                                                        onClick={() => this.handleTabChange('Pay')}>Pay</a> </li>
                                                </>}
                                                {item.moduleName === "Reward" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#rewards" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Reward' ? 'active' : ''}`}
                                                        onClick={() => this.handleTabChange('Reward')}>Reward</a> </li>
                                                </>}
                                                {item.moduleName === "Chatbot" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#chatbot" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Chatbot' ? 'active' : ''}`}
                                                        onClick={() => this.handleTabChange('Chatbot')}>Chatbot</a> </li>
                                                </>}
                                                {item.moduleName === "Automate" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#Automate" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Automate' ? 'active' : ''}`}
                                                        onClick={() => this.handleTabChange('Automate')}>Automate</a> </li>
                                                </>}
                                                {item.moduleName === "Notification Alert" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#documentExpiryAlert" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Notification' ? 'active' : ''}`}
                                                        onClick={() => this.handleTabChange('Notification')}> Notification Alert</a> </li>
                                                </>}
                                                {item.moduleName === "Bulk Import" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#bulkUploadTemplate" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'BulkImport' ? 'active' : ''}`}
                                                        onClick={() => this.handleTabChange('BulkImport')}> Bulk Import</a> </li>
                                                </>}
                                                {item.moduleName === "Owner" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#owner" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Owner' ? 'active' : ''}`}
                                                        onClick={() => this.handleTabChange('Owner')}> Owner </a> </li>
                                                </>}
                                                {item.moduleName === "Multi Approve" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#multiApprove" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Multi Approve' ? 'active' : ''}`}
                                                        onClick={() => this.handleTabChange('Multi Approve')}> Multi Approve</a> </li>
                                                </>}
                                            </>))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tab-content">
                            {activeTab == 'Plan' && <div id="Plan" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <ProjectLanding></ProjectLanding>
                            </div>}
                            {activeTab == 'Organise' && <div id="Organise" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <OrgSetupForm></OrgSetupForm>
                            </div>}
                            {activeTab == 'Onboard' && <div id="Onboard" className={"pro-overview  tab-pane fade show active "}>
                                <OnboardSetup></OnboardSetup>
                            </div>}
                            {activeTab == 'Offboard' && <div id="Offboard" className={"pro-overview  tab-pane fade show active "}>
                                <OffboardSetup></OffboardSetup>
                            </div>}
                            {activeTab == 'Manage' && <div id="manage" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <ManageLanding></ManageLanding>
                            </div>}
                            {activeTab == 'Hire' && <div id="hire" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <HireModuleLanding></HireModuleLanding>
                            </div>}

                            {activeTab == 'Perform' && <div id="perform" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <PerformanceLanding></PerformanceLanding>
                            </div>}
                            {activeTab == 'Engage' && <div id="Engage" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <EngageLanding></EngageLanding>
                            </div>}
                            {activeTab == 'Pay' && <div id="nationality" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <PayLanding></PayLanding>
                            </div>}
                            {activeTab == 'Reward' && <div id="rewards" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <CompensationReward></CompensationReward>
                            </div>}
                            {activeTab == 'Chatbot' && <div id="chatbot" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <ChatbotMessage></ChatbotMessage>
                            </div>}
                            {activeTab == 'Automate' && <div id="Automate" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <AutoDocs></AutoDocs>
                            </div>}
                            {activeTab == 'Notification' && <div id="documentExpiryAlert" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <DocumentExpiryAlert></DocumentExpiryAlert>
                            </div>}
                            {activeTab == 'BulkImport' && <div id="bulkUploadTemplate" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <BulkUploadTypeForm></BulkUploadTypeForm>
                            </div>}
                            {activeTab == 'Owner' && <div id="owner" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <OwnerLandingPage></OwnerLandingPage>
                            </div>}
                            {activeTab == 'Multi Approve' && <div id="multiApprove" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <MultiApproveLanding></MultiApproveLanding>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}