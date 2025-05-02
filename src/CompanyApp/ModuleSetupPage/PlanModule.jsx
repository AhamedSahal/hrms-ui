import React, { Component } from 'react';
import Projects from '../ModuleSetup/Project';
import Activity from '../ModuleSetup/Project/Activity';
import RequestPermissionSettings from '../ModuleSetup/RequestPermission';

export default class ProjectLanding extends Component {
    render() {
        return (
            <div className="">

                <div className="tab-content">
                    <div id="projects" className="pro-overview tab-pane fade show active">
                        <Projects></Projects>
                    </div>

                    <div id="activities" className="mt-2 pro-overview tab-pane fade show active">
                        <Activity></Activity>
                    </div>
                </div>


            </div>
        )
    }
}