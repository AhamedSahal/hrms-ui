import React, { Component } from 'react';
import Recognition from '../ModuleSetup/Recognition'
export default class EngageLanding extends Component {
    render() {
        return (
            <div>
                <div className="tab-content">
                    <div id="recognition" className="pro-overview tab-pane fade show active">
                        <Recognition></Recognition>
                    </div>
                </div>


            </div>
        )
    }
}