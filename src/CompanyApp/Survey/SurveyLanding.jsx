import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Landing from './manageSurvey/landing';
import SurveyCategory from './SurveyCategory/surveyCategory';
import { Box, Tab, Tabs } from '@mui/material';
import { getUserType, verifyOrgLevelViewPermission } from '../../utility';
import Template from './manageSurvey/Template';

export default class SurveyLanding extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0
        };
    }
    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    };
    render() {
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title> Manage Survey</title>
                </Helmet>

                <div className="content container-fluid">
                    {/* <div className="card">
                        <div className="row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{color: 'white'}}  className="page-title">Manage Survey</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                    <ul className="nav nav-items">
                                    <li className="nav-item"><a href="#Survey" data-toggle="tab" className="nav-link active">Survey</a></li>
                                    <li className="nav-item"><a href="#Category" data-toggle="tab" className="nav-link">Category</a></li>
                                </ul>
                            </div>
                            </div>
                        </div>
                    </div> */}
                    {/* value={this.state.value} onChange={this.handleChange} */}
                    <Box className='survey_header' sx={{ mt:2, width: '100%'}}>
                        <Tabs value={this.state.value} onChange={this.handleChange} centered >
                            <Tab href="#Survey" data-toggle="tab" className="sub-nav nav-link" id="label1" label="Survey" />
                            <Tab href="#Category" data-toggle="tab" className="sub-nav nav-link" id="label1" label="Category" />
                        </Tabs>
                    </Box>
                    <div className="tab-content">
                        <div id="Survey" className="pro-overview tab-pane fade show active">
                           {(getUserType() == 'COMPANY_ADMIN' || verifyOrgLevelViewPermission("Survey")) && <Landing></Landing>}
                           <div className='mt-4'>
                           {getUserType() == 'SUPER_ADMIN' && <Template></Template>}
                           </div>
                        </div>
                        <div id="Category" className="pro-overview tab-pane fade">
                            <SurveyCategory></SurveyCategory>
                        </div>
                          
                    
                    </div>
                </div>

            </div>
        )
    }
}
