import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle } from '../../utility';
import AdminForm from './AdminDetails';
import CompanySettingForm from './companySettingForm';
import ManageSSOForm from './manageSSO';
import AccessModule from './accessModule';
import ThemeForm from '../../CompanyApp/Settings/Theme/themeForm';
import PayrollCycle from './payrollCycle';
import CompanyForm from './form';

export default class CompanyCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            companyDetails: '',
            formSaved: false, 
        };
    }
    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    };
    handleFormSave = () => {
        this.setState({ formSaved: true });
    };
    getCompanyDetails =(company) => {
        this.setState({
            companyDetails: company,
        })
    }
    updateList=() => {

    }

    render() {
        const { companyDetails,formSaved } = this.state;
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title> Company Details | {getTitle()}</title>
                </Helmet>

                <div className="mt-4 content container-fluid">
                    <div className="tab-content">
                        <div className="row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Add Company</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item"><a href="#addCompany" data-toggle="tab" className="nav-link active">Company's Details</a> </li>
                                            <li className="nav-item"><a href="#admin" data-toggle="tab" className="nav-link ">Company's Admins</a> </li>
                                            <li className="nav-item"><a href="#theme" data-toggle="tab" className="nav-link ">Theme</a> </li>
                                            <li className="nav-item"><a href="#access-module" data-toggle="tab" className="nav-link ">Access Module</a> </li>
                                            <li className="nav-item"><a href="#company-setting" data-toggle="tab" className="nav-link ">Company's Settings</a> </li>
                                            <li className="nav-item"><a href="#sso" data-toggle="tab" className="nav-link ">Manage SSO</a> </li>
                                            <li className="nav-item"><a href="#payroll-cycle" data-toggle="tab" className="nav-link ">Payroll Cycle</a> </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tab-content">
                            <div id="addCompany" className="pro-overview moduleSetupPageContainer tab-pane fade show active">
                                <CompanyForm onFormSave={this.handleFormSave} getCompanyDetails={this.getCompanyDetails} updateList={this.updateList} />
                            </div>
                            <div id="admin" className="pro-overview moduleSetupPageContainer tab-pane fade ">
                                {!formSaved && <p style={{marginTop: '50px', marginBottom: '1em',fontSize:'larger'}} >Please save the Company's Details first.</p>}
                                {formSaved && <AdminForm company={this.state.companyDetails}/>}
                            </div>
                            <div id="theme" className="pro-overview moduleSetupPageContainer tab-pane fade ">
                            {!formSaved && <p style={{marginTop: '50px', marginBottom: '1em',fontSize:'larger'}} >Please save the Company's Details first.</p>}
                                {formSaved && <ThemeForm company={this.state.companyDetails}/>}
                            </div>
                            <div id="access-module" className="pro-overview moduleSetupPageContainer tab-pane fade ">
                            {!formSaved && <p style={{marginTop: '50px', marginBottom: '1em',fontSize:'larger'}} >Please save the Company's Details first.</p>}
                                {formSaved && <AccessModule company={this.state.companyDetails}/>}
                            </div>
                            <div id="company-setting" className="pro-overview moduleSetupPageContainer tab-pane fade ">
                            {!formSaved && <p style={{marginTop: '50px', marginBottom: '1em',fontSize:'larger'}} >Please save the Company's Details first.</p>}
                                {formSaved && <CompanySettingForm company={this.state.companyDetails}/>}
                            </div>
                            <div id="sso" className="pro-overview moduleSetupPageContainer tab-pane fade ">
                            {!formSaved && <p style={{marginTop: '50px', marginBottom: '1em',fontSize:'larger'}} >Please save the Company's Details first.</p>}
                                {formSaved && <ManageSSOForm company={this.state.companyDetails}/>}
                            </div>
                            <div id="payroll-cycle" className="pro-overview moduleSetupPageContainer tab-pane fade ">
                            {!formSaved && <p style={{marginTop: '50px', marginBottom: '1em',fontSize:'larger'}} >Please save the Company's Details first.</p>}
                                {formSaved && <PayrollCycle company={this.state.companyDetails}/>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}