import React, { Component } from 'react';
import MultiApprove from '../ModuleSetup/MultiApprove/MultiApprove';



export default class MultiApproveLanding extends Component {
    render() {
        return (
            <div className="">

            <div className="tab-content">
                <div id="multiApprove" className="pro-overview tab-pane fade show active">
                    <MultiApprove></MultiApprove>
                </div>
            </div>


        </div>
        )
    }
}