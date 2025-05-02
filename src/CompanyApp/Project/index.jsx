import { Route } from 'react-router-dom';
import ProjectBudget from './ProjectMain';
import ProjectCostEstimation from './ProjectCostEstimation';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { getTitle, getUserType } from '../../utility';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class ProjectsRoute extends Component {
    render() {
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Project  | {getTitle()}</title>
                </Helmet>
                <div className="mt-4 content container-fluid">
               <div className="tab-content">
                  <div className="subMenu_box row user-tabs">
                     <div className="nav-box">
                        <div className="page-headerTab">
                           <h3 style={{ color: 'white' }} className="page-title">Project</h3>
                           <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                              <ul className="nav nav-items">
                                    <li className="nav-item"><a href="#pforecast" data-toggle="tab" className="nav-link active">Budget</a></li>
                                    <li className="nav-item"><a href="#pbudget" data-toggle="tab" className="nav-link ">Costing</a></li>
                                    {/* <li className="nav-item"><a href="#prequisition" data-toggle="tab" className="nav-link ">Requisition</a></li> */}
                                </ul>
                            </div>
                            </div>
                        </div>
                    </div>
                    
                        <div id="pforecast" className="pro-overview insidePageDiv tab-pane fade show active">
                            <ProjectBudget></ProjectBudget>
                        </div>
                        <div id="pbudget" className="pro-overview insidePageDiv tab-pane fade">
                            <ProjectCostEstimation></ProjectCostEstimation>
                        </div>
                        {/* <div id="prequisition" className="pro-overview tab-pane fade">
                     <Requisition></Requisition>
                  </div> */}

                    </div>

                </div>
            </div>
        )
    }
}