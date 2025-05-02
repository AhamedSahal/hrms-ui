
import React, { Component } from 'react';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import EmployeeProfilePhoto from '../../Employee/widgetEmployeePhoto';


export default class SuccessionPlanView extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }



    render() {
        const succession = this.props.successionPlan

        return (
            <div style={{ backgroundColor: '#f5f5f5', padding: "30px" }} className="page-wrapper">

                <div className="row" style={{ border: "2px solid #E7ECF2" }}>
                    <div style={{ borderBottom: "2px solid #E7ECF2" }}>
                        <h4 style={{ paddingTop: "10px" }}>Succession Plan View</h4>
                    </div>
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Succession Plan Name</label>
                                <h5>
                                    <span style={{ padding: "2px", background: "#F2F5F8", borderRadius: "6px" }}>{succession.planName}</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Created Date</label>
                                <h5>
                                    <span>{succession.createdDate}</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Plan Type</label>
                                <h5>
                                    <span>{succession.planType.name}</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Position</label>
                                <h5>
                                    <span>{succession.position}</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Status</label>
                                <h5>
                                    <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Active</span>
                                </h5>
                            </div>


                            <div className="col-md-6" style={{ padding: "15px" }}>
                                <label>Description</label>
                                <h5>
                                    <span>{succession.description}</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}></div>

                            <div className="" style={{ padding: "15px" }}>
                                <label>Candidates</label>
                                <div className='d-flex flex-wrap'>
                                    {succession.candidate.map((item, index) => (
                                        <div key={index} className='col-4 mb-3'> 
                                            <div className='candidateSec d-flex align-items-center'>
                                                <span><EmployeeProfilePhoto className='poolImg' id={item}></EmployeeProfilePhoto></span>
                                                <span className='ml-3'>Roshan Naj</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="" style={{ padding: "15px" }}>
                                <label>Owners</label>
                                <div className='d-flex flex-wrap'>
                                    {succession.owner.map((item, index) => (
                                        <div key={index} className='col-4 mb-3'> {/* Each item takes up 4 out of 12 columns */}
                                            <div className='candidateSec d-flex align-items-center'>
                                                <span><EmployeeProfilePhoto className='poolImg' id={item}></EmployeeProfilePhoto></span>
                                                <span className='ml-3'>Roshan Naj</span>
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
