import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { getTitle } from '../../utility';
import Division from './Division';
import Function from './Function';
import Grades from './Grades';
import Section from './Section';
import Branch from '../ModuleSetup/Branch';
import Department from '../ModuleSetup/Department';
import Entity from './Entity';
import { OrgChart } from 'd3-org-chart';
import { getOrgSettings } from '../ModuleSetup/OrgSetup/service';
export default class OrgSetupMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            req: true,
            orgsetup: ""
        };
    }
    componentDidMount(){
        getOrgSettings().then(res => {
          if (res.status == "OK") {
            this.setState({ orgsetup: res.data })
          }
        })
      }
    render() {
        const {orgsetup} = this.state;
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Organization Modules | {getTitle()}</title>
                </Helmet>
                <div className="mt-4 content container-fluid">
                    <div className="tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Organization</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            {orgsetup.entity && <li className="nav-item"><a href="#pent" data-toggle="tab" className="nav-link active">Entity</a></li>}
                                            <li className="nav-item"><a href="#pdiv" data-toggle="tab" className="nav-link">Division</a></li>
                                            <li className="nav-item"><a href="#pdep" data-toggle="tab" className="nav-link">Department</a></li>
                                            <li className="nav-item"><a href="#psec" data-toggle="tab" className="nav-link">Section</a></li>
                                            <li className="nav-item"><a href="#pfunc" data-toggle="tab" className="nav-link">Function</a></li>
                                            <li className="nav-item"><a href="#ploc" data-toggle="tab" className="nav-link">Location</a></li>
                                            <li className="nav-item"><a href="#pgra" data-toggle="tab" className="nav-link">Grades</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="pent" className={orgsetup.entity ? "pro-overview insidePageDiv tab-pane fade show active" : "pro-overview insidePageDiv tab-pane fade" }>
                            <Entity></Entity>
                        </div>
                        <div id="pdiv" className={!orgsetup.entity ? "pro-overview insidePageDiv tab-pane fade  show active" : "pro-overview insidePageDiv tab-pane fade" }>
                            <Division></Division>
                        </div>
                        <div id="pdep" className="pro-overview insidePageDiv tab-pane fade">
                            <Department></Department>
                        </div>
                        <div id="psec" className="pro-overview insidePageDiv tab-pane fade">
                            <Section></Section>
                        </div>
                        <div id="pfunc" className="pro-overview insidePageDiv tab-pane fade">
                            <Function></Function>
                        </div>
                        <div id="ploc" className="pro-overview insidePageDiv tab-pane fade">
                            <Branch></Branch>
                        </div>
                        <div id="pgra" className="pro-overview insidePageDiv tab-pane fade">
                            <Grades></Grades>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}