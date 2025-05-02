import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle, getCompanyIdCookie } from '../../.././utility';
import { Button, Modal, Col, Row, ButtonGroup } from 'react-bootstrap';
import WorkExpensesReportLanding from './WorkExpenses';
import PayrollReportLanding from './Payroll';
import OvertimeReportLanding from './Overtime';
import ManageWorkDaysReport from './ManageWorkDays';
import FinalSettlementReportLanding from './Finalsettlement';
import LeaveSettlementReportLanding from './LeaveSettlement';
import PayVarianceReportLanding from './PayVariance';
import { BsDropbox } from "react-icons/bs";
import { getReportAccessByCompanyId } from '../../../AdminApp/Company/service';

const { Header, Body, Footer, Dialog } = Modal;
export default class PayReportLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showForm: false,
            value: 0,
            activeTab: "",
            activeArray: ["Payroll Report", "Overtime Report", "Manage Work Days Report", "Pay Variance Report", "Leave Settlement Report", "Final Settlement Report", "Work Expenses Report"],
            moduleSetup: [],
            companyId: getCompanyIdCookie(),
        };
    }

    componentDidMount() {
        this.fetchReportsStatus();
    }

    closeForm = (data) => {
        this.hideForm()

    }

    hideForm = () => {
        this.setState({
            showForm: false,
        })
    }

    fetchReportsStatus = () => {
        getReportAccessByCompanyId(this.state.companyId).then(res => {
            if (res.status === 'OK') {
                this.setState({
                    moduleSetup: res.data,
                })
                const firstActiveModule = res.data.find(module => module.isActive === "1");
                let name = (res.data).find((datas) => datas.isActive === "1" && this.state.activeArray.includes(datas.moduleName))
                if (firstActiveModule) {
                    this.setState({ activeTab: name.moduleName });
                }
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    }

    handleTabChange = (tab) => {
        this.setState({ activeTab: tab });
    };

    render() {
        const { showForm, activeTab } = this.state
        return (
            <>
                <div style={{ backgroundColor: '#f5f5f5' }} className="page-wrapper">
                    <Helmet>
                        <title>Pay | {getTitle()}</title>
                    </Helmet>

                    <div className="content container-fluid">


                        <div className="mt-4 tab-content">
                            <div className="subMenu_box row user-tabs">
                                <div className="nav-box">
                                    <div className="page-headerTab">

                                        <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                            <h3 style={{ color: "white" }}>Pay</h3>
                                            <ul className="nav nav-items">

                                                {this.state.moduleSetup.map((item, index) => (<>
                                                    {item.moduleName === "Payroll Report" && item.isActive == "1" && <>
                                                        <li className="nav-item"><a href="#payroll" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Payroll Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Payroll Report')}>Payroll</a></li>
                                                    </>}
                                                    {item.moduleName === "Overtime Report" && item.isActive == "1" && <>
                                                        <li className="nav-item"><a href="#overtime" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Overtime Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Overtime Report')}>Overtime</a> </li>
                                                    </>}
                                                    {item.moduleName === "Manage Work Days Report" && item.isActive == "1" && <>
                                                        <li className="nav-item"><a href="#manageworkdays" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Manage Work Days Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Manage Work Days Report')}>Manage Work Days</a> </li>
                                                    </>}
                                                    {item.moduleName === "Pay Variance Report" && item.isActive == "1" && <>
                                                        <li className="nav-item"><a href="#payvariance" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Pay Variance Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Pay Variance Report')}>Pay Variance</a> </li>
                                                    </>}
                                                    {item.moduleName === "Leave Settlement Report" && item.isActive == "1" && <>
                                                        <li className="nav-item"><a href="#leavesettlement" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Leave Settlement Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Leave Settlement Report')}>Leave Settlement</a> </li>
                                                    </>}
                                                    {item.moduleName === "Final Settlement Report" && item.isActive == "1" && <>
                                                        <li className="nav-item"><a href="#finalsettlement" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Final Settlement Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Final Settlement Report')}>Final Settlement</a> </li>
                                                    </>}
                                                    {item.moduleName === "Work Expenses Report" && item.isActive == "1" && <>
                                                        <li className="nav-item"><a href="#workExpenses" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Work Expenses Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Work Expenses Report')}>Work Expenses</a> </li>
                                                    </>}
                                                </>))}
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {activeTab == 'Payroll Report' && <div id="payroll" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <PayrollReportLanding></PayrollReportLanding>
                            </div>}

                            {activeTab == 'Overtime Report' && <div id="overtime" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <OvertimeReportLanding></OvertimeReportLanding>
                            </div>}

                            {activeTab == 'Manage Work Days Report' && <div id="manageworkdays" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <ManageWorkDaysReport></ManageWorkDaysReport>
                            </div>}

                            {activeTab == 'Pay Variance Report' && <div id="payvariance" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <PayVarianceReportLanding></PayVarianceReportLanding>
                            </div>}

                            {activeTab == 'Leave Settlement Report' && <div id="leavesettlement" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <LeaveSettlementReportLanding></LeaveSettlementReportLanding>
                            </div>}

                            {activeTab == 'Final Settlement Report' && <div id="finalsettlement" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <FinalSettlementReportLanding></FinalSettlementReportLanding>
                            </div>}

                            {activeTab == 'Work Expenses Report' && <div id="workExpenses" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                                <WorkExpensesReportLanding></WorkExpensesReportLanding>
                            </div>}

                            {activeTab == "" && <div className='verticalCenter' style={{ textAlign: "center", paddingTop: "200px" }}>
                                <BsDropbox size={60} />
                                <h3>No Data Found</h3>
                            </div>}

                        </div>
                    </div>

                </div>

            </>
        )
    }
}