import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import SurveyAttendeeList from './attendeeList';
import SurveyQuestionLevelReport from './questionLevelReport/questionLevelReport';
import SurveyGraphReport from './graphLevelReport/surveyGraphReport';


const { Header, Body, Footer, Dialog } = Modal;
export default class SurveyReportLevel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      survey: this.props.survey,
    };
  }
  
  
  
  render() {
    
    return (
      <>
        <div className="page-wrapper" style={{paddingTop: 0}}>
          <Helmet>
            <title>Survey Attendees</title>
            <meta name="description" content="Attendance" />
          </Helmet>
          <div className="content container-fluid">
            <div className="tab-content">
              <div className="row user-tabs">
                <div className="nav-box">
                  <div className="page-headerTab">
                    <h3 style={{ color: 'white' }} className="page-title">Survey Attendees</h3>
                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                      <ul className="nav nav-items">
                        <li className="nav-item"><a href="#individualLevel" data-toggle="tab" className="nav-link active">Individual Level</a></li>
                        <li className="nav-item"><a href="#questionLevel" data-toggle="tab" className="nav-link">Question Level</a></li>
                        <li className="nav-item"><a href="#graphReport" data-toggle="tab" className="nav-link">Graph Report</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

                <div id="individualLevel" className="pro-overview tab-pane fade show active">
                    <SurveyAttendeeList survey={this.props.survey} ></SurveyAttendeeList>
                </div>
                <div id="questionLevel" className="pro-overview tab-pane fade">
                   <SurveyQuestionLevelReport survey={this.props.survey} cumulativeReport={this.props.cumulativeReport}/>
                </div>
                <div id="graphReport" className="pro-overview tab-pane fade">
                   <SurveyGraphReport survey={this.props.survey} cumulativeReport={this.props.cumulativeReport}/>
                </div>
                          
            </div>
          </div>
        </div>
      </>
    );
  }
}
