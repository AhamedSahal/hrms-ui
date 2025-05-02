import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { getEmployeeId, getTitle, verifyOrgLevelViewPermission, verifyViewPermissionForTeam } from '../../../utility';
import OffboardList from './OffboardList';
import OffboardTasklist from './OffboardList/tasklist';
import { FcTodoList } from 'react-icons/fc';


export default class OffboardChecklistModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 'checklist',
        };
    }


    handleMenuClick = (menu) => {
        this.setState({ activePage: menu });
    }




    render() {
        const { activePage } = this.state;

        return (
            <>
                <div className="page-wrapper">
                    <Helmet>
                        <title>Checklist | {getTitle()}</title>
                        <meta name="description" content="Checklist" />
                    </Helmet>
                    <div className="mt-4 content container-fluid">
                        <div className="tab-content">
                            <div className="subMenu_box row user-tabs">
                                <div className="nav-box">
                                    <div className="page-headerTab">
                                        <h3 style={{ color: 'white' }} className="page-title">Checklist</h3>
                                        <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                            <ul className="nav nav-items">
                                                {<li onClick={() => this.handleMenuSection(false)} className="nav-item"><a href="#list" data-toggle="tab" className="nav-link active"><FcTodoList /> List</a></li>}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="list" className="pro-overview mt-3 tab-pane fade show active ">
                                {activePage === 'checklist' && <OffboardList handlePage={this.handleMenuClick}></OffboardList>}
                                {activePage === 'tasklist' && <OffboardTasklist handlePage={this.handleMenuClick}></OffboardTasklist>}
                            </div>
                        </div>
                    </div>
                </div >

            </>
        );
    }
}