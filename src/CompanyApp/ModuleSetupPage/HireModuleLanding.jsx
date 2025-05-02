import React, { Component } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import JobModule from './JobModule'


export default class HireModuleLanding extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0
        };
    }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    };

    render() {
        return (
            <>
                <div className="mt-3 content container-fluid">

                    <Box className='nav_level3'>
                        <Tabs value={this.state.value} onChange={this.handleChange}>
                            <Tab href="#Job" data-toggle="tab" className="manage-nav nav-link" id="label1" label="Job" />

                        </Tabs>
                    </Box>
                    <div className="tab-content">
                        <div id="Job" className="pro-overview tab-pane fade show active">

                            <JobModule></JobModule>
                        </div>

                    </div>

                </div>
            </>
        )
    }

}