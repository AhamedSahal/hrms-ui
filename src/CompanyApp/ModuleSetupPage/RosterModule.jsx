import React, { Component } from 'react';
import Shift from '../ModuleSetup/Shifts/list';
import WeekOff from '../ModuleSetup/Shifts/Weekoff/index';
import Roster from '../ModuleSetup/Shifts/Roster/index';
export default class RosterModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            req: true
        };
    }
    render() {
        return (
            <div >


                <div  className="tab-content">
                    <div id="pshifts" className="pro-overview tab-pane fade show active ">
                        <Shift></Shift>
                    </div>
                    <div id="pweekoff" className="mt-2 pro-overview tab-pane fade show active">
                        <WeekOff></WeekOff>
                    </div>
                    <div id="proster" className="mt-2 pro-overview tab-pane fade show active">
                        <Roster></Roster>
                    </div>
                </div>

            </div>
        )
    }
}