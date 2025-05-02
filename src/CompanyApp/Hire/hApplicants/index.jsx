import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle, verifyOrgLevelEditPermission } from '../../../utility'
import { Button, Modal, Col, Row, ButtonGroup } from 'react-bootstrap';
import ApplicantNew from './ApplicantNew/ApplicantNew';
import ApplicantScreening from './ApplicantScreening/ApplicantScreening';
import ApplicantEvaluating from './AEvaluating/ApplicantEvaluating';
import ApplicantOffered from './ApplicantOffered/ApplicantOffered';
import ApplicantHired from './ApplicantHired/ApplicantHired';
import ApplicantDropouts from './ADropouts/ApplicantDropouts';
import ApplicantDrafts from './ADrafts/ApplicantDrafs';
import { Link } from 'react-router-dom';
import Offerletter from '../../Onboarding/Offerletter';
// form
import ApplicantForm from './ApplicantForm/ApplicantForm';


const { Header, Body, Footer, Dialog } = Modal;
export default class ApplicantLandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showForm: false
        };
    }

    closeForm = (data) => {
        this.hideForm()

    }

    hideForm = () => {
        this.setState({
            showForm: false,
        })
    }

    render() {
        const { showForm } = this.state
        return (
            <>
                <div style={{ backgroundColor: '#f5f5f5' }} className="page-wrapper">
                    <Helmet>
                        <title>Hire Module Setup | {getTitle()}</title>
                    </Helmet>

                    <div className="content container-fluid">


                        <div className="mt-4 tab-content">
                            <div className="subMenu_box row user-tabs">
                                <div className="nav-box">
                                    <div className="page-headerTab">

                                        <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                            <h3 style={{color: "white"}}>Applicant</h3>
                                            <ul className="nav nav-items">
                                                <li className="nav-item"><a href="#new" data-toggle="tab" className="nav-link active">New</a></li>
                                                <li className="nav-item"><a href="#screening" data-toggle="tab" className="nav-link">Screening</a></li>
                                                <li className="nav-item"><a href="#evaluating" data-toggle="tab" className="nav-link">Evaluate</a></li>
                                                <li className="nav-item"><a href="#offered" data-toggle="tab" className="nav-link">Offered</a></li>
                                                <li className="nav-item"><a href="#hired" data-toggle="tab" className="nav-link">Hired</a></li>
                                                <li className="nav-item"><a href="#dropouts" data-toggle="tab" className="nav-link">Dropouts</a></li>
                                                <li className="nav-item"><a href="#drafts" data-toggle="tab" className="nav-link">Drafts</a></li>

                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            {!showForm && <div style={{ padding: "30px", marginRight: "15px", marginBottom: "15px" }}>

                                {/* <button className="apply-button btn mr-2 applicant-button" style={{paddingBottom:"25px"}}> */}
                                {verifyOrgLevelEditPermission("Hire Applicants") &&
                                  <Link to={{ pathname:"internalApplicantForm" }} className = "apply-button btn-primary mr-2" > <i className="fa fa-plus" /> New Applicant </Link>
                                }
                                  {/* </button> */}
                            </div>}

                            <div id="new" className="pro-overview insidePageDiv tab-pane fade show active">
                                <ApplicantNew></ApplicantNew>
                            </div>
                            <div id="screening" className="pro-overview insidePageDiv tab-pane fade">
                                <ApplicantScreening></ApplicantScreening>
                            </div>
                            <div id="evaluating" className="pro-overview insidePageDiv tab-pane fade">
                                <ApplicantEvaluating></ApplicantEvaluating>
                            </div>
                            <div id="offered" className="pro-overview insidePageDiv tab-pane fade">
                                <ApplicantOffered></ApplicantOffered>
                            </div>
                            <div id="hired" className="pro-overview insidePageDiv tab-pane fade">
                                <ApplicantHired></ApplicantHired>
                            </div>
                            <div id="dropouts" className="pro-overview insidePageDiv tab-pane fade">
                                <ApplicantDropouts></ApplicantDropouts>
                            </div>
                            <div id="drafts" className="pro-overview insidePageDiv tab-pane fade">
                                <ApplicantDrafts></ApplicantDrafts>
                            </div>
                        </div>
                    </div>

                </div>
            
            </>
        )
    }
}