/**
 * Signin Firebase
 */

import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { useNavigate } from 'react-router-dom';
import {getTitle} from '../../../utility';
 
import "../../index.css"
import SocialShare from './socialShare.jsx';

const CompanyAdminDashboardWrapper = (props) => {
  const navigate = useNavigate();
  return <CompanyAdminDashboard {...props} navigate={navigate} />;
};

class CompanyAdminDashboard extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      loadSocialShare: false
    };
  }
  componentDidMount() { 
    this.setState({
      loadSocialShare: true
    })
  }
 
  UNSAFE_componentWillMount() {
    let firstload = localStorage.getItem("firstload")
    if (firstload === "true") {
      setTimeout(function () {
        window.location.reload(1)
        localStorage.removeItem("firstload")
      }, 1000)
    }
  }

  render() {
    const { loadSocialShare } = this.state;
    return (

      <div className="page-wrapper">
        <Helmet>
          <title>Dashboard | {getTitle()}</title>
          <meta name="description" content="Dashboard" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
           
          <div className="tab-content pt-0">
             
            <div className="tab-pane active">
              <SocialShare loadSocialShare={loadSocialShare}></SocialShare>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </div>
    );
  }
}

export default CompanyAdminDashboardWrapper;
