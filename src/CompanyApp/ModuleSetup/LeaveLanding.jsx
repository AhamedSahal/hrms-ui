import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle } from '../../utility';
import Holiday from './Holiday';
import LeaveType from './LeaveType';

export default class LeaveLanding extends Component {
    render() {
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Leave Module Setup | {getTitle()}</title>
                </Helmet>

                <div className="content container-fluid">
                    <div className="page-header">
                        <h3 className="page-title">Leave Module Setup</h3>
                    </div>
                    <div className="tab-content">
                        <div className="row user-tabs">
                            <div className="card tab-box tab-position">
                                <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                                    <ul className="nav nav-tabs">
                                        <li className="nav-item"><a href="#leavetype" data-toggle="tab" className="nav-link active">Leave Type</a></li>
                                        <li className="nav-item"><a href="#holidays" data-toggle="tab" className="nav-link">Holidays</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div id="leavetype" className="pro-overview ant-table-background tab-pane fade show active">
                            <LeaveType></LeaveType>
                        </div>
                        <div id="holidays" className="pro-overview ant-table-background tab-pane fade">
                            <Holiday></Holiday>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}