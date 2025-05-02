import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle,getCompanyId } from '../../../.././utility';
import { Button, Modal, Col, Row, ButtonGroup } from 'react-bootstrap';
import AttendanceReportLanding from './Attendance';
import RegularizationReportLanding from './Regularization';
import { BsDropbox } from "react-icons/bs";
import { getReportAccessByCompanyId } from '../../../../AdminApp/Company/service';
import { getList } from '../../../ModuleSetup/Regularization/service';

const { Header, Body, Footer, Dialog } = Modal;
export default class AttendanceReportsLanding extends Component {
    constructor(props) {
      super(props);
      this.state = {
        showForm: false,
        value: 0,
        activeArray: ["Attendance Report"],
        activeTab: "",
        moduleSetup: [],
        companyId: getCompanyId(),
        RegularizationSettings: false

      };
    }

    componentDidMount() {
      this.fetchReportsStatus();
      this.fetchlist()
  }

    closeForm = (data) => {
        this.hideForm()
        
    }

    hideForm = () => {
        this.setState({
          showForm: false,
        })
      }
      fetchlist = () => {
        // regularization validation
    getList().then(res => {
        if (res.status == "OK") {
           this.setState({RegularizationSettings: res.data.regularizationEnabled})
        }
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
            <div style={{backgroundColor: '#f5f5f5',paddingTop:'20px'}} className="page-wrapper">
               
                <div className="content container-fluid">


                    <div className="mt-4 tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box" style={{background: "#528AAE"}}>
                                <div className="page-headerTab">
                                    
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                    <ul className="nav nav-items">

                                    {this.state.moduleSetup.map((item, index) => (<>
                                                {item.moduleName === "Attendance Report" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#Attendance" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Attendance Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Attendance Report')}>Attendance</a></li>
                                                </>}
                                                {item.moduleName === "Attendance Report" && item.isActive == "1" && this.state.RegularizationSettings && <>
                                                    <li className="nav-item"><a href="#Regularization" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Regularization' ? 'active' : ''}`} onClick={() => this.handleTabChange('Regularization')}>Regularization</a> </li>
                                                </>}
              
                                            </>))}
                                    </ul>
                                </div>
                                </div>
                               
                            </div>
                        </div>
                        {activeTab == 'Attendance Report' && <div id="Attendance" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                          <AttendanceReportLanding></AttendanceReportLanding>
                        </div>}
                        {activeTab == 'Regularization' && <div id="Regularization" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                          <RegularizationReportLanding></RegularizationReportLanding>
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