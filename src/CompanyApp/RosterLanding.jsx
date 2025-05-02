import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { getTitle, getUserType } from '../utility';
import Roster from './Employee/roster/rosterSelf'
import { default as RosterList } from './Employee/roster/rosterList'
import RosterCalendar from './Employee/roster/rosterCalendar'
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class RosterLanding extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //       req: true
    //     };
    //   }
    render() {
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Roster  | {getTitle()}</title>
                </Helmet>
                <div className="mt-4 content container-fluid">
                    <div className="tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Roster</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            {!isCompanyAdmin && <li className="nav-item"><a href="#proster" data-toggle="tab" className="nav-link active">My Roster</a></li>}
                                            <li className="nav-item"><a href="#prosterlist" data-toggle="tab" className={isCompanyAdmin ? "nav-link active" : "nav-link"}>{!isCompanyAdmin ? "Team Roster" : "Org Roster"}</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div id="proster" className={isCompanyAdmin ? "pro-overview insidePageDiv tab-pane fade" : "pro-overview insidePageDiv tab-pane show active"}>
                            <Roster></Roster>
                        </div>
                        <div id="prosterlist" className={isCompanyAdmin ? "pro-overview insidePageDiv tab-pane show active" : "pro-overview insidePageDiv tab-pane fade"}>
                            <RosterList {...this.props}></RosterList>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}