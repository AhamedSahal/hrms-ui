import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { getMultiEntityCompanies, getTitle } from '../../utility';
import DepartmentChart from './Organization Chart/OrganizationDepartmentChart';
import OrganizationEmployee from './Organization Chart/OrganizationEmployee';
import OrganizationCompany from './Organization Chart/OrganizationCompanyChart';

export default class OrganizationChartLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            req: true,
            defaultOwner: getMultiEntityCompanies(),
        };
    }
    render() {
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Organization Chart | {getTitle()}</title>
                </Helmet>
                <div className="mt-4 content container-fluid">
                    <div className="tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Organization Chart</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item"><a href="#chartdept" data-toggle="tab" className="nav-link active">Org Chart By Department</a></li>
                                            <li className="nav-item"><a href="#chartemp" data-toggle="tab" className="nav-link">Org Chart By Employee</a></li>
                                            {this.state.defaultOwner.length > 0 && <li className="nav-item"><a href="#chartcomp" data-toggle="tab" className="nav-link">Multi-Entity Company Chart</a></li>}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="chartdept" className="pro-overview insidePageDiv tab-pane fade show active">
                            <DepartmentChart></DepartmentChart>
                        </div>
                        <div id="chartemp" className="pro-overview insidePageDiv tab-pane fade">
                            <OrganizationEmployee></OrganizationEmployee>
                        </div>
                        {this.state.defaultOwner.length > 0 && <div id="chartcomp" className="pro-overview insidePageDiv tab-pane fade">
                            <OrganizationCompany></OrganizationCompany>
                        </div>}
                    </div>
                </div>
            </div>
        )
    }
}