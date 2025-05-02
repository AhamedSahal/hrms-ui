import React, { Component } from 'react';
import AssetsCategory from '../ModuleSetup/Assets/Category'
import AssetsSetup from '../ModuleSetup/Assets/index.jsx'

export default class AssetsLanding extends Component {
    render() {
        return (
            <div>
                
            <div>
                <div id="Category" className="pro-overview tab-pane fade show active">
                    <AssetsCategory></AssetsCategory>
                </div>
                <div  id="Assets" className="mt-3 pro-overview tab-pane fade show active">
                    <AssetsSetup></AssetsSetup>
                </div>
            </div>
      

    </div>
        )
    }
}