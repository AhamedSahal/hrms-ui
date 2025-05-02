import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap'; 
import WorkExpensesForm from './WorkExpensesForm';
import { getTitle, verifyOrgLevelEditPermission } from '../../../utility';
import WEPending from './WEPending';
import WERejected from './WERejected';
import WEAddedtopayroll from './WEAddedtopayroll'; 
import WESettled from './WESettled';
import Branch from '../../ModuleSetup/Branch';
 import WEApproved from './WEApproved';
 const { Header, Body, Footer, Dialog } = Modal;
export default class WorkExpensesRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            req: true
        };
    }
    hideForm = () => {
        this.setState({
            showForm: false
        })
    }
    render() {
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Work Expenses | {getTitle()}</title>
                </Helmet>
                <div className="mt-4 content container-fluid">
                    <div className="tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Work Expenses</h3>
                                    
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item"><a href="#ppending" data-toggle="tab" className="nav-link active">Pending</a></li>
                                            <li className="nav-item"><a href="#papproved" data-toggle="tab" className="nav-link">Approved</a></li>
                                            <li className="nav-item"><a href="#prejected" data-toggle="tab" className="nav-link">Rejected</a></li>
                                            <li className="nav-item"><a href="#paddedtopayroll" data-toggle="tab" className="nav-link">Added to payroll</a></li>
                                            <li className="nav-item"><a href="#psettled" data-toggle="tab" className="nav-link">Settled</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                        <div className="float-right col" >
                                <div className="row justify-content-end">
                                {verifyOrgLevelEditPermission("Pay Work Expenses") &&
                                    <div className="mt-2 float-right col-auto ml-auto" style={{paddingRight:"60px"}}>
                                    <button className="apply-button btn-primary mr-2" onClick={() => {
                                        this.setState({
                                        showForm: true
                                        })
                                    }}><i className="fa fa-plus" /> New Claim</button>
                                    </div>}
                                </div>
                            </div></div>
                        <div id="ppending" className="pro-overview insidePageDiv tab-pane fade show active">
                            <WEPending></WEPending>
                        </div>
                        <div id="papproved" className="pro-overview insidePageDiv tab-pane fade">
                            <WEApproved></WEApproved>
                        </div>
                        <div id="prejected" className="pro-overview insidePageDiv tab-pane fade">
                            <WERejected></WERejected>
                        </div>
                        <div id="paddedtopayroll" className="pro-overview insidePageDiv tab-pane fade">
                            <WEAddedtopayroll></WEAddedtopayroll>
                        </div>
                        <div id="psettled" className="pro-overview insidePageDiv tab-pane fade">
                            <WESettled></WESettled>
                        </div>
                         
                    </div>
                </div>
                <Modal enforceFocus={false} size={"xl"} show={this.state.showForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title">Add Expense Reimbursement</h5>
                    </Header>
                    <Body>
                        <WorkExpensesForm updateList={this.updateList} WorkExpenses={this.state.WorkExpenses}>
                        </WorkExpensesForm>
                    </Body>
                </Modal>
            </div>
            
        )
    }
}