
import React, { Component } from 'react';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import EmployeeProfilePhoto from '../../Employee/widgetEmployeePhoto';


export default class ReviewMeetingView extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }



    render() {
        const data = this.props.reviewMeetingData
        return (
            <div style={{ backgroundColor: '#f5f5f5', padding: "30px" }} className="page-wrapper">

                <div className="row" style={{ border: "2px solid #E7ECF2" }}>
                    <div style={{ borderBottom: "2px solid #E7ECF2" }}>
                        <h4 style={{ paddingTop: "10px" }}>Talent Review Meeting View</h4>
                    </div>
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-6" style={{ padding: "15px" }}>
                                <label>Meeting Title</label>
                                <h5>
                                    <span style={{ padding: "2px", background: "#F2F5F8", borderRadius: "6px" }}>{data.title}</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Succession Plan</label>
                                <h5>
                                    <span>{data.successionName}</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Meeting Location</label>
                                <h5>
                                    <span>{data.location}</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Agenda/Topic</label>
                                <h5>
                                    <span>{data.topic}</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Submission Date</label>
                                <h5>
                                    <span>{data.submissionDate}</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Status</label>
                                <h5>
                                    <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Active</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Meeting Status</label>
                                <h5>
                                <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Completed</span>
                                </h5>
                            </div>
                            <div style={{ borderBottom: "2px solid #E7ECF2" }}>
                                <h4 style={{ paddingTop: "10px" }}>Schedule</h4>
                            </div>
                            <div className="col-md-2" style={{ padding: "15px" }}>
                                <label>Start Date</label>
                                <h5>
                                    <span>{data.schedules.startDate}</span>
                                </h5>
                            </div>
                            <div className="col-md-2" style={{ padding: "15px" }}>
                                <label>End Date</label>
                                <h5>
                                    <span>{data.schedules.endDate}</span>
                                </h5>
                            </div>
                            <div className="col-md-2" style={{ padding: "15px" }}>
                                <label>Start Time</label>
                                <h5>
                                    <span>{data.schedules.startTime}</span>
                                </h5>
                            </div>
                            <div className="col-md-2" style={{ padding: "15px" }}>
                                <label>End Time</label>
                                <h5>
                                    <span>{data.schedules.endTime}</span>
                                </h5>
                            </div>
                            <div className="col-md-2" style={{ padding: "15px" }}>
                                <label>End Reminder</label>
                                <h5>
                                    <span>{data.schedules.endReminder}</span>
                                </h5>
                            </div>
                            <div className="col-md-2" style={{ padding: "15px" }}>
                                <label>Start Reminder</label>
                                <h5>
                                    <span>{data.schedules.startReminder}</span>
                                </h5>
                            </div>

                            <div className="col-md-6" style={{ padding: "15px" }}>
                                <label>Description</label>
                                <h5>
                                    <span>{data.description}</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}></div>

                            <div className="" style={{ padding: "15px" }}>
                                <label>Participants</label>
                                <div className='d-flex flex-wrap'>
                                    {data.participants.map((item, index) => (
                                        <div key={index} className='col-4 mb-3'> {/* Each item takes up 4 out of 12 columns */}
                                            <div className='candidateSec d-flex align-items-center'>
                                                <span><EmployeeProfilePhoto className='poolImg' id={item.id}></EmployeeProfilePhoto></span>
                                                <span className='ml-3'>{item.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
