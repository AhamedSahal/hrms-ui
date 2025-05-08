import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle, getUserType } from '../../utility'
import { Button, Modal, Col, Row, ButtonGroup, Anchor } from 'react-bootstrap'; 
import Assets from './index';
import AssetAvailable from './AssetAvailable';
import AssetAcknowledge from './AssetAcknowledge';
import {getAssetAcknowledgementStatus} from '../ModuleSetup/Assets/Acknowlegement/service';
import { verifyViewPermission,verifyEditPermission } from '../../utility';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';


const { Header, Body, Footer, Dialog } = Modal;
export default class AssetLanding extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        isAssetAcknowledgeEnabled:false
      };
    }

    componentDidMount(){
        this.isAssetAcknowledgeEnabled();
    }

    isAssetAcknowledgeEnabled = () => {
      getAssetAcknowledgementStatus().then(res => {
               if (res.status == "OK") {
                 
                 this.setState({
                    isAssetAcknowledgeEnabled:res.data
                 })
               }
             })
    }

   
    render() { 
        return (
            <>
            <div style={{backgroundColor: '#f5f5f5'}} className="page-wrapper">
                <Helmet>
                    <title>Assets | {getTitle()}</title>
                </Helmet>

                <div className="content container-fluid">


                    <div className="mt-4 tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                <h3 style={{ color: 'white' }} className="page-title">Assets</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                    <ul className="nav nav-items">
                                        
                                    {<li className="nav-item"><a href="#allocate" data-toggle="tab" className="nav-link active">Allocated</a></li>}
                                    {isCompanyAdmin && <li className="nav-item"><a href="#available" data-toggle="tab" className="nav-link">Available</a></li>}          
                                    {this.state.isAssetAcknowledgeEnabled && <><li className="nav-item"><a href="#acknowledge" data-toggle="tab" className="nav-link">Acknowledge</a></li></>} 
                                    </ul>
                                </div>
                                </div>
                               
                            </div>
                        </div> 
                        { <div id="allocate" className="pro-overview insidePageDiv tab-pane fade show active">
                          <Assets AcknowledgeStatus={this.state.isAssetAcknowledgeEnabled} ></Assets>
                        </div>}
                        { isCompanyAdmin && <div id="available" className="pro-overview insidePageDiv tab-pane fade">
                        <AssetAvailable></AssetAvailable>
                        </div>}
                        {<><div id="acknowledge" className="pro-overview insidePageDiv tab-pane fade">
                        <AssetAcknowledge></AssetAcknowledge>
                        </div></>} 
                    </div>
                </div>
            </div>
          </>
        )
    }
}