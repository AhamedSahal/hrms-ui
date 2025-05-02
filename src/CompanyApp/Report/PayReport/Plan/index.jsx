import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle } from '../../../.././utility';
import { Button, Modal, Col, Row, ButtonGroup } from 'react-bootstrap';
import ForecastReportLanding from './Forecast';
import RequisitionReportLanding from './Requisition';
import WorkForcePlanBudgetReport from './Budget';
import { Box, Tab, Tabs } from '@mui/material';


const { Header, Body, Footer, Dialog } = Modal;
export default class PlanReportLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
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
    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    };

    render() {
        const { showForm } = this.state
        return (
            <>
                <div style={{ backgroundColor: '#f5f5f5', paddingTop: '20px' }} className="page-wrapper">

                    <div className="mt-3 content container-fluid" >
                        <Box className='nav_level3'style={ {position: "static"}}>
                            <Tabs value={this.state.value} onChange={this.handleChange}>
                                <Tab href="#forecast" data-toggle="tab" className="manage-nav nav-link" id="label1" label="Forecast" />
                                <Tab href="#budget" data-toggle="tab" className="manage-nav nav-link" id="label1" label="Budget" />
                                <Tab href="#requisition" data-toggle="tab" className="manage-nav nav-link" id="label1" label="Requisition" />
                            </Tabs>

                        </Box>
                    </div>
                    <div className="tab-content">
                    <div id="forecast" className="pro-overview tab-pane fade show active">
                        <ForecastReportLanding></ForecastReportLanding>
                    </div>
                    <div id="budget" className="pro-overview tab-pane fade">
                        <WorkForcePlanBudgetReport></WorkForcePlanBudgetReport>
                    </div>
                    <div id="requisition" className="pro-overview tab-pane fade">
                        <RequisitionReportLanding></RequisitionReportLanding>
                    </div>

                    </div>

                </div>

            </>
        )
    }
}