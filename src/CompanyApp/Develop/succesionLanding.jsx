import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle, getUserType } from '../../utility';
import TalentPool from './TalentPool';
import SuccessionPlan from './SuccessionPlan/index.jsx';
import ReviewMeeting from './ReviewMeeting/index.jsx';
import NineBoxDashboard from './Dashboard/index.jsx';
export default class SuccessionPlanLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        return (
            <div style={{ backgroundColor: '#f5f5f5' }} className="page-wrapper">
                <Helmet>
                    <title>Talent Review | {getTitle()}</title>
                </Helmet>

                <div className="content container-fluid">
                    <div className="mt-4 tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Talent Review</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item"><a href="#talentPool" data-toggle="tab" className="pr-3 pl-3 nav-link active">Talent Pool</a></li>
                                            <li className="nav-item"><a href="#successionPlan" data-toggle="tab" className="pr-3 pl-3 nav-link ">Succession Plan</a></li>
                                            <li className="nav-item"><a href="#position" data-toggle="tab" className="pr-3 pl-3 nav-link ">Review Meeting</a></li>
                                            <li className="nav-item"><a href="#nineBox" data-toggle="tab" className="pr-3 pl-3 nav-link ">Dashboard</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                         <div id="talentPool" className="pro-overview insidePageDiv tab-pane fade show active">
                            <TalentPool></TalentPool>
                        </div>
                        <div id="successionPlan" className="pro-overview insidePageDiv tab-pane ">
                            <SuccessionPlan></SuccessionPlan>
                        </div>
                        
                       <div id="position" className="pro-overview insidePageDiv tab-pane fade ">
                            <ReviewMeeting></ReviewMeeting>
                        </div>
                        <div id="nineBox" className="pro-overview insidePageDiv tab-pane fade ">
                            <NineBoxDashboard></NineBoxDashboard>
                        </div>
                        
                        
                    </div>
                </div>

            </div>
        )
    }
}