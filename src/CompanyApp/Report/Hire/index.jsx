import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle,getCompanyId } from '../../.././utility';
import { Button, Modal, Col, Row, ButtonGroup } from 'react-bootstrap';
import JobReportLanding from './JobReport';
import ApplicantReportLanding from './ApplicantReport';
import { BsDropbox } from "react-icons/bs";
import { getReportAccessByCompanyId } from '../../../AdminApp/Company/service';

const { Header, Body, Footer, Dialog } = Modal;
export default class HireReportLanding extends Component {
    constructor(props) {
      super(props);
      this.state = {
        showForm: false,
        value: 0,
        activeArray: ["Job Report","Applicant Report"],
        activeTab: "",
        moduleSetup: [],
        companyId: getCompanyId(),
      };
    }

    componentDidMount() {
      this.fetchReportsStatus();
  }

    closeForm = (data) => {
        this.hideForm()
        
    }

    hideForm = () => {
        this.setState({
          showForm: false,
        })
      }

      fetchReportsStatus = () => {
        getReportAccessByCompanyId(this.state.companyId).then(res => {
            if (res.status === 'OK') {
                this.setState({
                    moduleSetup: res.data,
                })
                const firstActiveModule = res.data.find(module => module.isActive === "1");
                let name = (res.data).find((datas) => datas.isActive === "1" && this.state.activeArray.includes(datas.moduleName))
                if (firstActiveModule) {
                this.setState({ activeTab: name.moduleName });
                }
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    }

    handleTabChange = (tab) => {
      this.setState({ activeTab: tab });
  };

    render() {
        const {showForm,activeTab} = this.state
        return (
            <>
            <div style={{backgroundColor: '#f5f5f5'}} className="page-wrapper">
                <Helmet>
                    <title>Hire | {getTitle()}</title>
                </Helmet>

                <div className="content container-fluid">


                    <div className="mt-4 tab-content">
                    <div className="row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                    <h3 style={{color: "white"}}>Hire</h3>
                                    <ul className="nav nav-items">

                                    {this.state.moduleSetup.map((item, index) => (<>
                                                {item.moduleName === "Job Report" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#job" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Job Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Job Report')}>Job</a></li>
                                                </>}
                                                {item.moduleName === "Applicant Report" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#applicant" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Applicant Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Applicant Report')}>Applicant</a> </li>
                                                </>}
              
                                            </>))}
                                    </ul>
                                </div>
                                </div>
                               
                            </div>
                        </div>
                        {activeTab == 'Job Report' && <div id="job" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                          <JobReportLanding></JobReportLanding>
                        </div>}

                        {activeTab == 'Applicant Report' && <div id="applicant" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                          <ApplicantReportLanding></ApplicantReportLanding> 
                        </div>}

                        {activeTab == "" &&  <div className='verticalCenter' style={{textAlign:"center",paddingTop: "200px"}}>
                        <BsDropbox size={60} />
                         <h3>No Data Found</h3>
                            </div>}
                       
                    </div>
                </div>

            </div> 
    
            </>
        )
    }
}