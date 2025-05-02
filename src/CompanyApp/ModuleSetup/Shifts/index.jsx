import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {  getTitle,getUserType, verifyOrgLevelViewPermission } from '../../../utility';
import Shift from './list';
import WeekOff from './Weekoff/index';
import Roster from './Roster/index';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class ShiftIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
          req: true
        };
      }
    render() {
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Roster Settings | {getTitle()}</title>
                </Helmet>
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <h2 className="page-title">Roster Settings</h2>
                            </div>
                        </div>
                    </div>
                    
                    {verifyOrgLevelViewPermission("Module Setup Roster") && <div className="tab-content">
                        <div className="row user-tabs">
                            <div className="card tab-box tab-position">
                                <div className="col-lg-12 col-md-12 col-sm-12 line-tabs" >
                                    {verifyOrgLevelViewPermission("Module Setup Roster") && <ul className="nav nav-tabs nav-tabs-bottom">
                                        <li className="nav-item"><a href="#pshifts" data-toggle="tab" className="nav-link active">Shifts</a></li>
                                        <li className="nav-item"><a href="#pweekoff" data-toggle="tab" className="nav-link ">Weekly Off</a></li>
                                        <li className="nav-item"><a href="#proster" data-toggle="tab" className="nav-link ">Roster</a></li>
                                    </ul>}
                                </div>
                            </div>
                        </div>
                         <div id="pshifts" className="pro-overview ant-table-background tab-pane fade show active ">
                        <Shift></Shift>
                        </div>
                        <div id="pweekoff" className="pro-overview ant-table-background tab-pane fade ">
                        <WeekOff></WeekOff>
                        </div>
                        <div id="proster" className="pro-overview ant-table-background tab-pane fade">
                        <Roster></Roster>
                        </div>
                    </div>}
                    {!verifyOrgLevelViewPermission("Module Setup Roster") && <AccessDenied></AccessDenied>}
                </div>
            </div>
        )
    }
}