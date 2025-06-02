import React, { Component } from 'react';
import { getHistoryList } from './service';
import { toLocalDateTime } from '../../../../../utility';



export default class TaskAuditHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskData: []
        };
    }

    componentDidMount (){
        this.fetchList()
    }

     fetchList = () => {
            getHistoryList( this.props.historyId,this.props.historyStatus).then(res => {
                   if (res.status == "OK") {
                     this.setState({
                        taskData: res.data,
                  
                     })
                   }
                 })
    
        }

    render() {

        return (
            <>
                <div className="GoalAudit-container">
                    
                    <div className="GoalAudit-timeline">
                        {(!this.state.taskData || this.state.taskData.length === 0) ? (
                            <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                <span>No Records Found</span>
                            </div>
                          ) :
                        (this.state.taskData.map((audit, index) => {
                            const descendingIndex = this.state.taskData.length - index;
                            return (
                                <div className="GoalAudit-timelineItem" key={index}>                   
                                    <div className="GoalAudit-dot">
                                        <span className="GoalAudit-index">{descendingIndex}</span>
                                    </div>
                                    <div className="mt-2 GoalAudit-dotBar"></div>
                                    <div className="GoalAudit-content">
                                        <div style={{ width: '150px' }} className="GoalAudit-dateTime">
                                        <span className="GoalAudit-name">Date</span>
                                            <span className="GoalAudit-date">{toLocalDateTime(audit.date)}</span>
                                        </div>
                                        <div style={{ width: '150px' }} className="GoalAudit-info">
                                        <span className="GoalAudit-name">Employee Name</span>
                                            <span className="GoalAudit-name">{audit.employeeName}</span>
                                        </div>
                                        <div style={{ width: '130px' }} className="GoalAudit-info">
                                        <span className="GoalAudit-name">Status</span>
                                            <span className="GoalAudit-name">{audit.completed ? <><i className="fa fa-check-circle text-success" aria-hidden="true"></i> Completed</> : <><i className="fa fa-times-circle text-secondary" aria-hidden="true"></i> Not Completed</>}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }))}
                    </div>
                </div>

            </>
        );
    }
}