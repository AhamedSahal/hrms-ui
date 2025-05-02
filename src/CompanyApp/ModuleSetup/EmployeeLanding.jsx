import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle } from '../../utility';
import AllowanceType from './Allowance/index';
import Country from './Country/index';
import DocumentType from './DocumentType/index';
import Language from './Language/index'; 

export default class EmployeeLanding extends Component {
    render() {
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Employee Module Setup | {getTitle()}</title>
                </Helmet>

                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="page-title">Employee Module Setup</div>
                    </div>
                    
                    <div className="tab-content">
                        <div className="row user-tabs">
                            <div className="card tab-box tab-position">
                                <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                                    <ul className="nav nav-tabs">
                                        <li className="nav-item"><a href="#documents" data-toggle="tab" className="nav-link active">Documents</a></li>
                                        <li className="nav-item"><a href="#allowances" data-toggle="tab" className="nav-link">Allowances</a></li>
                                        <li className="nav-item"><a href="#nationality" data-toggle="tab" className="nav-link">Nationality</a></li>
                                        <li className="nav-item"><a href="#language" data-toggle="tab" className="nav-link">Language</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div id="documents" className="pro-overview ant-table-background tab-pane fade show active">
                            <DocumentType></DocumentType>
                        </div>
                        <div id="allowances" className="pro-overview ant-table-background tab-pane fade">
                            <AllowanceType></AllowanceType>
                        </div>

                        <div id="nationality" className="pro-overview ant-table-background tab-pane fade">
                            <Country></Country>
                        </div>

                        <div id="language" className="pro-overview ant-table-background tab-pane fade">
                            <Language></Language>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}