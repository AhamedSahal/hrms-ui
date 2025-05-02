import React, { Component } from 'react'
import { Button } from '@mui/material';
import OrgDetailedCalender from './orgDetailedView';
import OrgAttendanceCardView from './orgMonthlyReport';
import OrgWeeklyListViewCalendar from './orgWeeklyCalendar';

export default class OrgCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonState: true,
            dashView: 1
        };
    }


    render() {
        const { dashView } = this.state
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
                    {dashView === 1 ? <OrgDetailedCalender /> : dashView === 2 ? <OrgAttendanceCardView /> : <OrgWeeklyListViewCalendar />}
                </>
            </div>
        )
    }
}
