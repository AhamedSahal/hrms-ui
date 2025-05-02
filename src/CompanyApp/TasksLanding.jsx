import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { getTitle, getUserType } from '../utility';
import Tasks from './Tasks'
import MyTasks from './Tasks/TaskMyIndex'
import AllTasks from './Tasks/TaskAllIndex'
import { default as RosterList } from './Employee/roster/rosterList'
// import RosterCalendar from './Employee/roster/rosterCalendar'
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class TasksLanding extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //       req: true
    //     };
    //   }
    render() {
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Tasks  | {getTitle()}</title>
                </Helmet>
                <div className="mt-4 content container-fluid">
                    <div className="tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Task List</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item"><a href="#pTasks" data-toggle="tab" className="nav-link active">My Tasks</a></li>
                                            <li className="nav-item"><a href="#pTaskslist" data-toggle="tab" className="nav-link ">Tasks created by me</a></li>
                                            <li className="nav-item"><a href="#pTaskslist1" data-toggle="tab" className="nav-link ">Everyone's tasks</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="pTasks" className={isCompanyAdmin ? "pro-overview insidePageDiv tab-pane fade show active" : "pro-overview insidePageDiv tab-pane fade show active"}>
                            <MyTasks></MyTasks>
                        </div>
                        <div id="pTaskslist" className={isCompanyAdmin ? "pro-overview insidePageDiv tab-pane " : "pro-overview insidePageDiv tab-pane "}>
                            <Tasks></Tasks>
                        </div>
                        <div id="pTaskslist1" className={isCompanyAdmin ? "pro-overview insidePageDiv tab-pane fade" : "pro-overview insidePageDiv tab-pane fade"}>
                            <AllTasks></AllTasks>
                        </div>

                    </div>

                </div>
            </div>
        )
    }
}