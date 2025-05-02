import React, { Component } from 'react';
import Signature from '../ModuleSetup/Signature'
import Template from '../ModuleSetup/Template'

export default class DocumentRequestLanding extends Component {
    render() {
        return (
            <div>
                
            <div>
                <div id="projects" className="pro-overview tab-pane fade show active">
                    <Signature></Signature>
                </div>
                <div  id="activities" className="mt-3 pro-overview tab-pane fade show active">
                    <Template></Template>
                </div>
            </div>
      

    </div>
        )
    }
}