import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle,getCompanyId } from '../../.././utility';
import { Button, Modal, Col, Row, ButtonGroup } from 'react-bootstrap';
import { BsDropbox } from "react-icons/bs";
import { getReportAccessByCompanyId } from '../../../AdminApp/Company/service';
import ReviewsReport from './ReviewsReport';

const { Header, Body, Footer, Dialog } = Modal;
export default class PerformReportLanding extends Component {
    constructor(props) {
      super(props);
      this.state = {
        activeArray: ["Reviews Report"],
        activeTab: "",
        moduleSetup: [],
        companyId: getCompanyId(),
      };
    }

    componentDidMount() {
      this.fetchReportsStatus();
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
        const {activeTab} = this.state
        return (
            <>
            <div style={{backgroundColor: '#f5f5f5'}} className="page-wrapper">
                <Helmet>
                    <title>Perform | {getTitle()}</title>
                </Helmet>

                <div className="content container-fluid">


                    <div className="mt-4 tab-content">
                    <div className="row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                    <h3 style={{color: "white"}}>Perform</h3>
                                    <ul className="nav nav-items">

                                    {this.state.moduleSetup.map((item, index) => (<>
                                                {item.moduleName === "Reviews Report" && item.isActive == "1" && <>
                                                    <li className="nav-item"><a href="#Reviews" data-toggle="tab" className={`nav-link ${this.state.activeTab === 'Reviews Report' ? 'active' : ''}`} onClick={() => this.handleTabChange('Reviews Report')}>Reviews</a></li>
                                                </>}
                                               
              
                                            </>))}
                                    </ul>
                                </div>
                                </div>
                               
                            </div>
                        </div>
                        {activeTab == 'Reviews Report' && <div id="Reviews" className={"pro-overview moduleSetupPageContainer tab-pane fade show active "}>
                          <ReviewsReport></ReviewsReport>
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