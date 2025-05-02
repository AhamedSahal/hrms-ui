import React, { Component } from 'react'
import { Button } from '@mui/material';
import TeamDetailedCalender from './detailedView';
import CardViewCalendar from './monthlyReport';
import WeeklyListViewCalendar from './weeklyCalendar';

export default class TeamCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonState: true,
            dashView: 1
        };
    }


    render() {
        const {  dashView } = this.state
        return (
            <div>
                <>
                    <div className='mb-2' style={{ textAlign: 'right' }}>
                        <Button
                            variant={dashView === 1 ? "contained" : "outlined"}
                            onClick={() => { this.setState({ dashView: 1 }) }}
                            sx={{ textTransform: 'none', mr: 1 }}
                            size="small"
                        >
                            <i className="mr-1 fa fa-id-card-o" aria-hidden="true"></i> Detailed View
                        </Button>
                        <Button
                            variant={dashView === 3 ? "contained" : "outlined"}
                            onClick={() => { this.setState({ dashView: 3 }) }}
                            sx={{ textTransform: 'none', mr: 1 }}
                            size="small"
                        >
                            <i className="mr-1 fa fa-list" aria-hidden="true"></i> List View
                        </Button>
                        <Button
                            variant={dashView === 2 ? "contained" : "outlined"}
                            onClick={() => { this.setState({ dashView: 2 }) }}
                            sx={{ textTransform: 'none', mr: 1 }}
                            size="small"
                        >
                            <i className="mr-1 fa fa-id-card-o" aria-hidden="true"></i> Card View
                        </Button>
                    </div>
                    {dashView === 1 ? <TeamDetailedCalender /> : dashView === 2 ? <CardViewCalendar /> : <WeeklyListViewCalendar />}
                </>
            </div>
        )
    }
}
