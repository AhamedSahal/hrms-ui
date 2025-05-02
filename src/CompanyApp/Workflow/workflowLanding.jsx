import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle } from '../../utility';
import { Modal } from 'react-bootstrap';
import Process from './Process';
import Action from './Action';
import Approve from './Approve';
import Reject from './Reject';
import OnHold from './OnHold';
import Acknowledge from './Acknowledge';
import CompletedWorkflow from './Complete/complete';
const { Header, Body, Footer, Dialog } = Modal;
export default class WorkflowLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
  


    
    render() {
        return (
            <div style={{ backgroundColor: '#f5f5f5' }} className="page-wrapper">
                <Helmet>
                    <title>Workflow Automation | {getTitle()}</title>
                </Helmet>

                <div className="content container-fluid">

                    <div className="mt-4 tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Workflow Automation</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item"><a href="#process" data-toggle="tab" className="pr-3 pl-3 nav-link active">Process</a></li>
                                            <li className="nav-item"><a href="#action" data-toggle="tab" className="pr-3 pl-3 nav-link">Action</a></li>
                                            <li className="nav-item"><a href="#approve" data-toggle="tab" className="pr-3 pl-3 nav-link">Approved</a></li>
                                            <li className="nav-item"><a href="#reject" data-toggle="tab" className="pr-3 pl-3 nav-link">Rejected</a></li>
                                            <li className="nav-item"><a href="#onHold" data-toggle="tab" className="pr-3 pl-3 nav-link">On Hold</a></li>
                                            <li className="nav-item"><a href="#acknowledge" data-toggle="tab" className="pr-3 pl-3 nav-link">Acknowledged</a></li>
                                            <li className="nav-item"><a href="#complete" data-toggle="tab" className="pr-3 pl-3 nav-link">Completed</a></li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </div>
                        

                        <div id="process" className="pro-overview insidePageDiv tab-pane fade show active">
                            <Process></Process>
                        </div>
                        <div id="action" className="pro-overview insidePageDiv tab-pane fade">
                            <Action></Action>
                        </div>
                        <div id="approve" className="pro-overview insidePageDiv tab-pane fade">
                            <Approve></Approve>
                        </div>
                        <div id="reject" className=" pro-overview insidePageDiv tab-pane fade">
                            <Reject></Reject>
                        </div>
                        <div id="onHold" className="pro-overview insidePageDiv tab-pane fade">
                            <OnHold></OnHold>
                        </div>
                        <div id="acknowledge" className="pro-overview insidePageDiv tab-pane fade">
                            <Acknowledge></Acknowledge>
                        </div>
                        <div id="complete" className="pro-overview insidePageDiv tab-pane fade">
                            <CompletedWorkflow></CompletedWorkflow>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}