import React, { Component } from 'react';
import OvertimeSettingForm from '../ModuleSetup/overtime/OvertimeSettingForm';
import Expenses from '../ModuleSetup/Expenses/index';
import PaymentMode from '../ModuleSetup/PaymentMode/list';
import CurrencySettingForm from '../ModuleSetup/Currency/form';
import EndofServices from '../ModuleSetup/EndofService';

export default class PayLanding extends Component {
    render() {
        return (
            <div >
                <div className="tab-content">
                    <div id="overtime" className="pro-overview tab-pane fade show active">
                        <OvertimeSettingForm></OvertimeSettingForm>
                    </div>
                    <div id="currency" className="pro-overview tab-pane fade show active">
                        <CurrencySettingForm></CurrencySettingForm>
                    </div>
                    <div id="gratuity" className="pro-overview tab-pane fade show active">
                        <EndofServices></EndofServices>
                    </div>
                    <div id="Expenses" className="pro-overview tab-pane fade show active">
                        <Expenses></Expenses>
                    </div>
                    <div id="PaymentMode" className="pro-overview tab-pane fade show active">
                        <PaymentMode></PaymentMode>
                    </div>
                </div>
            </div>
        )
    }
}