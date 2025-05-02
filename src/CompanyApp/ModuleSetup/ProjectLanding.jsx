import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle } from '../../utility';
import Projects from './Project';
import Activity from './Project/Activity';

export default class ProjectLanding extends Component {
    render() {
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Project & Activity Module Setup | {getTitle()}</title>
                </Helmet>

                <div className="content container-fluid">
                    <div className="page-header">
                        <h3 className="page-title">Project Module Setup</h3>
                    </div>
                    <div className="tab-content">
                    <div className="row user-tabs">
                        <div className="card tab-box tab-position">
                            <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item"><a href="#projects" data-toggle="tab" className="nav-link active">Projects</a></li>
                                    <li className="nav-item"><a href="#activities" data-toggle="tab" className="nav-link">Activities</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                        <div id="projects" className="pro-overview ant-table-wrapper tab-pane fade show active">
                            <Projects></Projects>
                        </div>
                        <div id="activities" className="pro-overview ant-table-wrapper tab-pane fade">
                            <Activity></Activity>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}