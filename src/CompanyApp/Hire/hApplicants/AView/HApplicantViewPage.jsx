import React, { Component } from "react";
import HApplicantSchedule from "./HApplicantSchedule/HApplicantSchedule";
import HApplciantInformation from "./HApplicantInfo/HApplciantInformation";
import HApplicantEvaluationHistory from "./HApplicantEvaluationHistory";
export default class HApplicantViewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          applicantInformation: props.location.state?props.location.state.text?props.location.state.text:{}:{} || {},
        }
    }

    redirectToList = () => {
        this.props.history.goBack();
     
    }

    render() {
        let {applicantInformation} = this.state;
        return (
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="mt-4 tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">

                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item"><a href="#applicantInfo" data-toggle="tab" className="nav-link active">Applicant Info</a></li>
                                            <li className="nav-item"><a href="#schedule" data-toggle="tab" className="nav-link">Schedule</a></li>
                                            <li className="nav-item"><a href="#evaluationHistory" data-toggle="tab" className="nav-link"> Evaluation History</a></li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* body */}
                        <div id="applicantInfo" className="pro-overview insidePageDiv tab-pane fade show active">
                          <HApplciantInformation applicantInformation={applicantInformation}></HApplciantInformation>
                        </div>
                        <div id="schedule" className="pro-overview insidePageDiv tab-pane fade" style={{padding: "30px"}}>
                          <HApplicantSchedule applicantInformation={applicantInformation} redirectToList={this.redirectToList}></HApplicantSchedule>
                        </div>
                        <div id="evaluationHistory" className="pro-overview insidePageDiv tab-pane fade" style={{padding: "30px"}}>
                          <HApplicantEvaluationHistory applicantInformation={applicantInformation}></HApplicantEvaluationHistory>
                        </div>

                        
                    </div>

                </div>
            </div>
        )
    }
}