import React, { Component } from 'react';
import { getDefaultOwner, getTitle } from '../../utility';
import { Box, Tab, Tabs } from '@mui/material';
import CompanyOwners from '../Employee/CompanyOwners';
import MultiEntityAccess from '../ModuleSetup/MultiEntityAccess/list';

export default class OwnerLandingPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            defaultOwner: getDefaultOwner(),
        };
    }
    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    };
    render() {
        return (
            <div >
                <div className="mt-3 content container-fluid">
                    <Box className='nav_level3' >
                        <Tabs value={this.state.value} onChange={this.handleChange}>
                            <Tab href="#Owner" data-toggle="tab" className="manage-nav nav-link" id="label1" label="Owners" />
                            { this.state.defaultOwner && <Tab href="#Multi-entity" data-toggle="tab" className="manage-nav nav-link" id="label1" label="Multi-Entity Access" />}
                        </Tabs>
                    </Box>
                    <div className="tab-content">
                        <div id="Owner" className="pro-overview tab-pane fade show active">
                            <CompanyOwners></CompanyOwners>
                        </div>
                        {this.state.defaultOwner && <div id="Multi-entity" className="pro-overview tab-pane fade ">
                            <MultiEntityAccess></MultiEntityAccess>
                        </div>}
                    </div>
                </div>

            </div>
        )
    }
}