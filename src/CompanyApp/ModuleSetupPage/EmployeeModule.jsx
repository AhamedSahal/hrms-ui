import React, { Component } from 'react';
import AllowanceType from '../ModuleSetup/Allowance/index';
import Country from '../ModuleSetup/Country/index';
import DocumentType from '../ModuleSetup/DocumentType/index';
import Language from '../ModuleSetup/Language/index';
import Benefits from '../ModuleSetup/Benefits/index';
import EmploymentStatus from '../ModuleSetup/EmploymentStatus';
export default class EmployeeModule extends Component {
    render() {
        return (
            <div className="">



                <div className=" tab-content">
                    <div className="custom-mt pro-overview tab-pane fade show active">
                        <DocumentType></DocumentType>
                    </div>
                    <div className="mt-2 pro-overview tab-pane fade show active">
                        <AllowanceType></AllowanceType>
                    </div>

                    <div className="mt-2 pro-overview tab-pane fade show active">
                        <Country></Country>
                    </div>

                    <div className="mt-2 pro-overview tab-pane fade show active">
                        <Language></Language>
                    </div>
                    <div className="mt-2 pro-overview tab-pane fade show active">
                        <Benefits></Benefits>
                    </div>
                    <div className="mt-2 pro-overview tab-pane fade show active">
                        <EmploymentStatus></EmploymentStatus>

                    </div>
                </div>


            </div>
        )
    }
}