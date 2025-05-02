import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle } from '../../utility';
import Holiday from '../ModuleSetup/Holiday';
import LeaveType from '../ModuleSetup/LeaveType';

export default class LeaveModule extends Component {
    render() {
        return (
            <div>


                <div className="tab-content">
                    <div id="leavetype" className="pro-overview tab-pane fade show active">
                        <LeaveType></LeaveType>
                    </div>
                    <div id="holidays" className="mt-3 pro-overview tab-pane fade show active">
                        <Holiday></Holiday>
                    </div>
                </div>
            </div>


        )
    }
}