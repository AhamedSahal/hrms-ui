import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle } from '../../utility';
import LogoForm from './Logo/LogoForm';
import FormatForm from './Format/formatForm';
export default class SystemSetupLanding extends Component {
    render() {
        return (
            <div style={{backgroundColor: '#f5f5f5'}} className="page-wrapper">
                <Helmet>
                    <title>System Setup | {getTitle()}</title>
                </Helmet>

                <div className="content container-fluid">
                    <div className="mt-4 tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{color: 'white'}}  className="page-title">System Setup</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                    <ul className="nav nav-items">
                                        <li className="nav-item"><a href="#logo" data-toggle="tab" className="nav-link active">Logo</a></li>
                                        <li className="nav-item"><a href="#appsettings" data-toggle="tab" className="nav-link">App Settings</a></li>
                                    </ul>
                                </div>
                                </div>
                               
                            </div>
                        </div>
                        <div id="logo" className="pro-overview  tab-pane fade show active">
                           <LogoForm></LogoForm>
                        </div>
                        <div id="appsettings" className="pro-overview tab-pane fade">
                            <FormatForm></FormatForm>
                        </div>
                       
                    </div>
                </div>

            </div>
        )
    }
}