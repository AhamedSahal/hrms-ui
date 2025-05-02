import React, { Component } from 'react';
import ApplicantField from '../ModuleSetup/ApplicantField/index'
import CustomField from '../ModuleSetup/CustomField/index'
import SystemField from '../ModuleSetup/SystemField/index'
import HSourceType from '../ModuleSetup/HSourceType';

export default class JobModule extends Component {
    render() {
        return (
            <div className="">
                <div className="tab-content">
                 <div className="pro-overview tab-pane fade show active">
                        <ApplicantField></ApplicantField>
                    </div>
                    <div className="mt-2 pro-overview tab-pane fade show active">
                       <SystemField></SystemField>
                    </div>
                    <div className="mt-2 pro-overview tab-pane fade show active">
                       <CustomField></CustomField>
                    </div>
                    <div className="mt-2 pro-overview tab-pane fade show active">
                       <HSourceType></HSourceType>
                    </div>
                 </div>
            </div>
        )
    }
}