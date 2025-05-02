import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle } from '../../utility';
import GratuitySettingForm from './gratuity/GratuitySettingForm';
import OvertimeSettingForm from './overtime/OvertimeSettingForm';

export default class PayrollLanding extends Component {
    render() {
        return (
            <div className="page-wrapper">
                 <div className="content container-fluid">
                    <div className="page-header">
                        <h3 className="page-title">Payroll Module Setup</h3>
                    </div>
                    
                    <div className="tab-content">
                        <div className="row user-tabs">
                            <div className="card tab-box tab-position">
                                <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                                    <ul className="nav nav-tabs">
                                        <li className="nav-item"><a href="#overtime" data-toggle="tab" className="nav-link active">Overtime</a></li>
                                        <li className="nav-item"><a href="#gratuity" data-toggle="tab" className="nav-link">Gratuity</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div id="overtime" className="pro-overview ant-table-background tab-pane fade show active">
                            <OvertimeSettingForm></OvertimeSettingForm>
                        </div>
                        <div id="gratuity" className="pro-overview ant-table-background tab-pane fade">
                            <GratuitySettingForm></GratuitySettingForm>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}