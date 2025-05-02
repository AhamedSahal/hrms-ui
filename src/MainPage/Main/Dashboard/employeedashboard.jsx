/**
 * Signin Firebase
 */

import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Helmet } from "react-helmet";
import { toast } from 'react-toastify';
import { ResponsiveContainer } from 'recharts';
import {  getTitle} from '../../../utility.jsx';
import { getEmployeeDashboardDetail, postAttendance } from './service.jsx';
import SocialShare from './socialShare.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import LeaveForm from './../../../CompanyApp/Employee/leave/form';
import CreateTimesheetForm from './../../../CompanyApp/Timesheet/form';
import DocumentRequestForm from '../../../CompanyApp/ModuleSetup/DocumentRequest/form.jsx';

const { Header, Body, Footer, Dialog } = Modal;

const EmployeeDashboardWrapper = (props) => {
  const navigate = useNavigate();
  return <EmployeeDashboard {...props} navigate={navigate} />;
};

class EmployeeDashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dashboard: {},
      loadSocialShare: false
    };
  }
  componentDidMount() {
    this.getAttendance();
    this.setState({
      loadSocialShare: true
    })
  }
  getAttendance = () => {

    getEmployeeDashboardDetail(new Date().toISOString().substring(0, 16)).then(res => {
      this.setState({ dashboard: res.data });
    });
  }
  postAttendance = () => {
    postAttendance().then(res => {
      if(res.status != "OK" && res.message){
        toast.error(res.message)
      }else{
      this.getAttendance();
      }
    });
  }
  hideLeaveForm = () => {
    this.setState({
      showLeaveForm: false
    })
  }

  hideTimesheetForm = () => {
    this.setState({
      showTimesheetForm: false
    })
  }
  hideDocumentRequestForm = () => {
    this.setState({
      showDocumentRequestForm: false
    })
  }

  handleNavigation = (path) => {
    this.props.navigate(path);
  };

  // Example usage of navigation
  someMethod = () => {
    this.handleNavigation('/some-path');
  };

  render() {
    const { loadSocialShare } = this.state;
    return (
      <div className="page-wrapper">
        <Helmet>
          <title>Dashboard - {getTitle()}</title>
          <meta name="description" content="Dashboard" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
              <SocialShare loadSocialShare={loadSocialShare}></SocialShare>

        </div>

        <Modal enforceFocus={false} size={"lg"} show={this.state.showLeaveForm} onHide={this.hideLeaveForm} >
          <Header closeButton>
            <h5 className="modal-title">Add Leave</h5>
          </Header>
          <Body>
            <LeaveForm updateList={this.hideLeaveForm}>
            </LeaveForm>
          </Body>
        </Modal>

        <Modal enforceFocus={false} size={"lg"} show={this.state.showTimesheetForm} onHide={this.hideTimesheetForm} >
          <Header closeButton>
            <h5 className="modal-title">Add Timesheet</h5>
          </Header>
          <Body>
            <CreateTimesheetForm updateList={this.hideTimesheetForm}>
            </CreateTimesheetForm>
          </Body>
        </Modal>

        <Modal
          enforceFocus={false}
          size={"xl"}
          show={this.state.showDocumentRequestForm}
          onHide={this.hideDocumentRequestForm}
        >
          <Header closeButton>
            <h5 className="modal-title">
              Add DocumentRequest
            </h5>
          </Header>
          <Body>
            <DocumentRequestForm
              updateList={this.hideDocumentRequestForm}
            ></DocumentRequestForm>
          </Body>
        </Modal>
      </div>
    );
  }
}

export default EmployeeDashboardWrapper;
