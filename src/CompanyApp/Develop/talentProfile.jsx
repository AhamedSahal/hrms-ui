import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle, getUserType } from '../../utility';
import IndividualProfile from './IndividualProfile';
import PositionProfile from './PositionProfile';
import JoblevelProfile from './JoblevelProfile';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class TalentProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        return (
            <div style={{ backgroundColor: '#f5f5f5' }} className="page-wrapper">
                <Helmet>
                    <title>Talent profile | {getTitle()}</title>
                </Helmet>

                <div className="content container-fluid">
                    <div className="mt-4 tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Talent profile</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item"><a href="#individual" data-toggle="tab" className="pr-3 pl-3 nav-link active">Individual Profile</a></li>
                                           {isCompanyAdmin && <>
                                            <li className="nav-item"><a href="#position" data-toggle="tab" className="pr-3 pl-3 nav-link ">Position Profile</a></li>
                                            <li className="nav-item"><a href="#joblevel" data-toggle="tab" className="pr-3 pl-3 nav-link ">Job profile</a></li>
                                            </>}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div id="individual" className="pro-overview  tab-pane fade show active">
                            <IndividualProfile></IndividualProfile>
                        </div>
                        
                        <div id="position" className="pro-overview  tab-pane fade ">
                            <PositionProfile></PositionProfile>
                        </div>
                        <div id="joblevel" className="pro-overview  tab-pane fade">
                            <JoblevelProfile></JoblevelProfile>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}