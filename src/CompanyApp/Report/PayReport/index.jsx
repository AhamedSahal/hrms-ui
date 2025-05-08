import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle,getCompanyId } from '../../.././utility';
import { Button, Modal, Col, Row, ButtonGroup } from 'react-bootstrap';
import PlanReportLanding from './Plan';
import ProjectReportLanding from './Project';
import { BsDropbox } from "react-icons/bs";
import { getReportAccessByCompanyId } from '../../../AdminApp/Company/service';

const { Header, Body, Footer, Dialog } = Modal;
export default class workForceplaneReportLanding extends Component {
    constructor(props) {
      super(props);
      this.state = {
        showForm: false,
        value: 0,
        activeArray: ["WorkForce Plan Report","Project Report"],
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
                    <title>Plan | {getTitle()}</title>
                </Helmet>

                <div className="content container-fluid">


                    <div className="mt-4 tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                    <h3 style={{color: "white"}}>Plan</h3>
                                    <ul className="nav nav-items">

                                    {this.state.moduleSetup.map((item, index) => (<>
                                                {item.moduleName === "WorkForce Plan Report" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#workForcePlane" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'WorkForce Plan Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('WorkForce Plan Report')}>Workforce Plan</a></li>
                                                </>}
                                                {item.moduleName === "Project Report" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#project" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Project Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Project Report')}>Project</a> </li>
                                                </>}
              
                                            </>))}
                                    </ul>
                                </div>
                                </div>
                               
                            </div>
                        </div>
                        {activeTab == 'WorkForce Plan Report' && <div id="workForcePlane" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                          <PlanReportLanding></PlanReportLanding>
                        </div>}
                        {activeTab == 'Project Report' && <div id="project" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                          <ProjectReportLanding></ProjectReportLanding>
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