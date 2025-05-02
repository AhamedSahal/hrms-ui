import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle, verifyOrgLevelEditPermission } from '../../.././utility'
import { Button, Modal, Col, Row, ButtonGroup } from 'react-bootstrap';
import HireInformationForm from './form'
import JobActive from './JobActive/JobActive'
import JobDraft from './JobDraft/JobDraft'
import JobClose from './JobClose/JobClose';

const { Header, Body, Footer, Dialog } = Modal;
export default class JobLanding extends Component {
    constructor(props) {
      super(props);
      this.state = {
        showForm: false
      };
    }

    closeForm = (data) => {
        this.hideForm()
        
    }

    hideForm = () => {
        this.setState({
          showForm: false,
        })
      }

    render() {
        const {showForm} = this.state
        return (
            <>
            <div style={{backgroundColor: '#f5f5f5'}} className="page-wrapper">
                <Helmet>
                    <title>Hire Module Setup | {getTitle()}</title>
                </Helmet>

                <div className="content container-fluid">


                    <div className="mt-4 tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                    <h3 style={{color: "white"}}>Job</h3>
                                    <ul className="nav nav-items">
                                        <li className="nav-item"><a href="#active" data-toggle="tab" className="nav-link active">Active</a></li>
                                        <li className="nav-item"><a href="#draft" data-toggle="tab" className="nav-link">Draft</a></li>
                                        <li className="nav-item"><a href="#closed" data-toggle="tab" className="nav-link"> Closed</a></li>
                                    </ul>
                                </div>
                                </div>
                               
                            </div>
                        </div>
                        {verifyOrgLevelEditPermission("Hire Job") && <>
                       {!showForm && <div style={{padding: "30px" , marginRight: "15px", marginBottom: "15px"}}>
                       
                        <button className="apply-button btn-primary mr-2" onClick={() => {
                        this.setState({
                        showForm: true
                        })}}>
                            <i className="fa fa-plus" /> Create</button>
                        </div>}
                        </>}
                        <div id="active" className="pro-overview insidePageDiv tab-pane fade show active">
                          <JobActive></JobActive>
                        </div>
                        <div id="draft" className="pro-overview insidePageDiv tab-pane fade">
                        <JobDraft></JobDraft>
                        </div>
                        <div id="closed" className="pro-overview insidePageDiv tab-pane fade">
                        <JobClose></JobClose>
                        </div>
                    </div>
                </div>

            </div>
             {/* /Page Content */}

             <Modal enforceFocus={false} size={"lg"} show={this.state.showForm} onHide={this.hideForm} >
             <Header closeButton>
             <h5 className="modal-title">Job</h5>
             </Header>
             <Body>
                        <HireInformationForm closeForm={this.closeForm}>
                        </HireInformationForm>
                    </Body>
             </Modal>
             
         
            </>
        )
    }
}