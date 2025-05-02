import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle } from '../../../.././utility';
import { Button, Modal, Col, Row, ButtonGroup } from 'react-bootstrap';
import CostingReportLanding from './Costing';
import { Box, Tab, Tabs } from '@mui/material';
import ProjectBudgetReportLanding from './Budget';

const { Header, Body, Footer, Dialog } = Modal;
export default class ProjectReportLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      value: 0
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

  handleChange = (event, newValue) => {
    this.setState({ value: newValue })
  };

  render() {
    const { showForm } = this.state
    return (
      <>
        <div style={{ backgroundColor: '#f5f5f5', paddingTop: '20px'}} className="page-wrapper">



          <div className="mt-3 content container-fluid">
            <Box className='nav_level3' style={ {position: "static"}}>
              <Tabs value={this.state.value} onChange={this.handleChange}>
                <Tab href="#budget" data-toggle="tab" className="manage-nav nav-link" id="label1" label="Budget" />
                <Tab href="#costing" data-toggle="tab" className="manage-nav nav-link" id="label1" label="Costing" />

              </Tabs>
            </Box>
          </div>
          <div className="tab-content">
            <div id="budget" className="pro-overview tab-pane fade show active">
              <ProjectBudgetReportLanding></ProjectBudgetReportLanding>
            </div>
            <div id="costing" className="pro-overview tab-pane fade ">
              <CostingReportLanding></CostingReportLanding>
            </div>
          </div>

        </div>

      </>
    )
  }
}