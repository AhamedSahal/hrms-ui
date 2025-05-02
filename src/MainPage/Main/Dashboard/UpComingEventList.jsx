import React, { Component } from 'react';
import { getUpComingHire, getUpComingLeaving } from './service'
import EmployeeListColumn from '../../../CompanyApp/Employee/employeeListColumn';
import { getReadableDate } from '../../../utility';

export default class UpComingEventList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            upComingHire: [],
            upComingLeaving: [],
            activeTab: 'newHires',

        };
    }
    componentDidMount() {
        this.getUpComingHire();
        this.getUpComingLeaving();
    }

    getUpComingHire = () => {
        getUpComingHire().then(res => {
            if (res.status === 'OK') {
                this.setState({
                    upComingHire: res.data,
                })
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    };
    getUpComingLeaving = () => {
        getUpComingLeaving().then(res => {
            if (res.status === 'OK') {
                this.setState({
                    upComingLeaving: res.data,
                })
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    };

    handleTabChange = (tab) => {
        this.setState({ activeTab: tab });
    };

    render() {
        const { upComingLeaving, upComingHire, activeTab } = this.state;

        return (
            <div className="page-wrapper">
                <div className="mt-4 content container-fluid">
                    <div className="tab-content">
                        <div className="row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Upcoming Events</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item">
                                                <a
                                                    href="#NewHires"
                                                    onClick={() => this.handleTabChange('newHires')}
                                                    className={`nav-link ${activeTab === 'newHires' ? 'active' : ''}`}
                                                    style={{ paddingBottom: "0px", height: "40px" }}
                                                >
                                                    New Hires
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a
                                                    href="#Leaving"
                                                    onClick={() => this.handleTabChange('leaving')}
                                                    className={`nav-link ${activeTab === 'leaving' ? 'active' : ''}`}
                                                    style={{ paddingBottom: "0px", height: "40px" }}
                                                >
                                                    Leaving
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="insidePageDiv">
                        <div className="row">
                            <div className="col-md-12 ">
                                {activeTab === 'leaving' && (
                                    <div className="chatBot-table">
                                        <h4>Leaving</h4>
                                        <table className="table">
                                            <thead>
                                                <tr style={{ background: '#c4c4c4' }}>
                                                    <th>#</th>
                                                    <th>Employee</th>
                                                    <th>Last Working Day</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {upComingLeaving.map((item, index) => (
                                                    <tr key={item.day} className="table-row">
                                                        <td className="table-column">{index + 1}</td>
                                                        <td className="table-column">
                                                            <EmployeeListColumn
                                                                key={item.id}
                                                                id={item.id}
                                                                name={`${item.firstName} ${item.middleName} ${item.lastName}`}
                                                                employeeId={item.employeeId}
                                                            />
                                                        </td>
                                                        <td className="table-column">{getReadableDate(item.date)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === 'newHires' && (
                                    <div className="chatBot-table">
                                        <h4>New Hire</h4>
                                        <table className="table">
                                            <thead>
                                                <tr style={{ background: '#c4c4c4' }}>
                                                    <th>#</th>
                                                    <th>Employee</th>
                                                    <th>Date of Joining</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {upComingHire.map((item, index) => (
                                                    <tr key={item.day} className="table-row">
                                                        <td className="table-column">{index + 1}</td>
                                                        <td className="table-column">
                                                            <EmployeeListColumn
                                                                key={item.id}
                                                                id={item.id}
                                                                name={`${item.firstName} ${item.middleName} ${item.lastName}`}
                                                                employeeId={item.employeeId}
                                                            />
                                                        </td>
                                                        <td className="table-column">{getReadableDate(item.date)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

