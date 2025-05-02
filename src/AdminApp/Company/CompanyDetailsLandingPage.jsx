import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { getTitle } from '../../utility';
import CompanyDetails from './CompanyDetails';
import AdminForm from './AdminDetails';
import CompanySettingForm from './companySettingForm';
import ManageSSOForm from './manageSSO';
import AccessModule from './accessModule';
import ThemeForm from '../../CompanyApp/Settings/Theme/themeForm';
import CompanyActiveUsers from './CompanyActiveUser';
import PayrollCycle from './payrollCycle';
import MultiEntityForm from './CompanyMultiEntityForm';

const CompanyDetailsLandingPage = () => {
    const location = useLocation();
    const { company } = location.state || {};

    const [activeTab, setActiveTab] = useState('CompanyInfo');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="page-wrapper">
            <Helmet>
                <title> Company Details | {getTitle()}</title>
            </Helmet>

            <div className="mt-4 content container-fluid">
                <div className="tab-content">
                    <div className="subMenu_box row user-tabs">
                        <div className="nav-box">
                            <div className="page-headerTab">
                                <h3 style={{ color: 'white' }} className="page-title">{company && company.name} Company's Details</h3>
                                <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                    <ul className="nav nav-items">
                                        <li className="nav-item"><a href="#details" data-toggle="tab" className={`nav-link ${activeTab === 'CompanyInfo' ? 'active' : ''}`} onClick={() => handleTabChange('CompanyInfo')}>Company's Information</a> </li>
                                        <li className="nav-item"><a href="#multi-entity" data-toggle="tab" className={`nav-link ${activeTab === 'MultiEntity' ? 'active' : ''}`} onClick={() => handleTabChange('MultiEntity')}> Multi Entity </a> </li>
                                        <li className="nav-item"><a href="#admin" data-toggle="tab" className={`nav-link ${activeTab === 'CompanyAdmin' ? 'active' : ''}`} onClick={() => handleTabChange('CompanyAdmin')}>Company's Admins</a> </li>
                                        <li className="nav-item"><a href="#theme" data-toggle="tab" className={`nav-link ${activeTab === 'Theme' ? 'active' : ''}`} onClick={() => handleTabChange('Theme')}>Theme</a> </li>
                                        <li className="nav-item"><a href="#access-module" data-toggle="tab" className={`nav-link ${activeTab === 'AccessModule' ? 'active' : ''}`} onClick={() => handleTabChange('AccessModule')}>Access Module</a> </li>
                                        <li className="nav-item"><a href="#company-setting" data-toggle="tab" className={`nav-link ${activeTab === 'CompanySetting' ? 'active' : ''}`} onClick={() => handleTabChange('CompanySetting')}>Company's Settings</a> </li>
                                        <li className="nav-item"><a href="#sso" data-toggle="tab" className={`nav-link ${activeTab === 'ManageSso' ? 'active' : ''}`} onClick={() => handleTabChange('ManageSso')}>Manage SSO</a> </li>
                                        <li className="nav-item"><a href="#active-users" data-toggle="tab" className={`nav-link ${activeTab === 'ActiveUser' ? 'active' : ''}`} onClick={() => handleTabChange('ActiveUser')}>Active Users</a> </li>
                                        <li className="nav-item"><a href="#payroll-cycle" data-toggle="tab" className={`nav-link ${activeTab === 'PayrollCycle' ? 'active' : ''}`} onClick={() => handleTabChange('PayrollCycle')}>Payroll Setting</a> </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tab-content">
                        {activeTab === 'CompanyInfo' && <div id="details" className="pro-overview moduleSetupPageContainer tab-pane fade show active">
                            <CompanyDetails company={company}></CompanyDetails>
                        </div>}
                        {activeTab === 'MultiEntity' && <div id="multi-entity" className="pro-overview moduleSetupPageContainer tab-pane fade show active">
                            <MultiEntityForm company={company}></MultiEntityForm>
                        </div>}
                        {activeTab === 'CompanyAdmin' && <div id="admin" className="pro-overview moduleSetupPageContainer tab-pane fade show active">
                            <AdminForm company={company}></AdminForm>
                        </div>}
                        {activeTab === 'Theme' && <div id="theme" className="pro-overview moduleSetupPageContainer tab-pane fade show active">
                            <ThemeForm company={company}></ThemeForm>
                        </div>}
                        {activeTab === 'AccessModule' && <div id="access-module" className="pro-overview moduleSetupPageContainer tab-pane fade show active">
                            <AccessModule company={company}></AccessModule>
                        </div>}
                        {activeTab === 'CompanySetting' && <div id="company-setting" className="pro-overview moduleSetupPageContainer tab-pane fade show active">
                            <CompanySettingForm company={company}></CompanySettingForm>
                        </div>}
                        {activeTab === 'ManageSso' && <div id="sso" className="pro-overview moduleSetupPageContainer tab-pane fade show active">
                            <ManageSSOForm company={company}></ManageSSOForm>
                        </div>}
                        {activeTab === 'ActiveUser' && <div id="active-users" className="pro-overview moduleSetupPageContainer tab-pane fade show active">
                            <CompanyActiveUsers company={company}></CompanyActiveUsers>
                        </div>}
                        {activeTab === 'PayrollCycle' && <div id="payroll-cycle" className="pro-overview moduleSetupPageContainer tab-pane fade show active">
                            <PayrollCycle company={company}></PayrollCycle>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetailsLandingPage;