import React, { Component } from 'react';

const auditHistory = [
    {
        dateTime: "2025-03-12 10:30 AM",
        name: "John Doe",
        status: true
    },
    {
        dateTime: "2025-03-11 03:15 PM",
        name: "Jane Smith",
        status: false
    },
    {
        dateTime: "2025-03-10 08:45 AM",
        name: "Michael Johnson",
        status: true
    },
    {
        dateTime: "2025-03-09 06:20 PM",
        name: "Emily Davis",
        status: false
    }
];

export default class TaskAuditHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    

    render() {

        return (
            <>
                <div className="GoalAudit-container">
                    
                    <div className="GoalAudit-timeline">
                        {auditHistory.map((audit, index) => {
                            const descendingIndex = auditHistory.length - index;
                            return (
                                <div className="GoalAudit-timelineItem" key={index}>
                                    <div className="GoalAudit-dot">
                                        <span className="GoalAudit-index">{descendingIndex}</span>
                                    </div>
                                    <div className="mt-2 GoalAudit-dotBar"></div>
                                    <div className="GoalAudit-content">
                                        <div style={{ width: '150px' }} className="GoalAudit-dateTime">
                                            <span className="GoalAudit-date">{audit.dateTime}</span>
                                        </div>
                                        <div style={{ width: '150px' }} className="GoalAudit-info">
                                            <span className="GoalAudit-name">{audit.name}</span>
                                        </div>
                                        <div style={{ width: '130px' }} className="GoalAudit-info">
                                            <span className="GoalAudit-name">{audit.status ? <><i className="fa fa-check-circle text-success" aria-hidden="true"></i> Completed</> : <><i className="fa fa-times-circle text-secondary" aria-hidden="true"></i> Not Completed</>}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </>
        );
    }
}