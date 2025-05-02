
import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import EmployeePhoto from '../../../CompanyApp/Employee/employeePhoto';
import { Button } from '@mui/material';
import { getReadableDate, convertToUserTimeZone } from '../../../utility';
import { Link } from 'react-router-dom';
import { Empty } from 'antd';
import EmployeeListColumn from '../../../CompanyApp/Employee/employeeListColumn';
import { Scrollbars } from 'react-custom-scrollbars-2';

import { getEmployeeLateDashboardDetail, getEmployeeOntimeDashboardDetail, getEmployeeAbsentDashboardDetail } from './service';


export default class TodaysAttendanceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attendanceList: [],
        };
    }
    componentDidMount() {
        this.fetchList();
    }

    fetchList = () => {
        const listName = this.props?.presentsList
        if (listName === 'onTime') {
            getEmployeeOntimeDashboardDetail(new Date().toISOString().substring(0, 16), this.props.selfPermission).then(res => {
                this.setState({ attendanceList: res.data });
            });
        } else if (listName === 'absent') {
            getEmployeeAbsentDashboardDetail(new Date().toISOString().substring(0, 16), this.props.selfPermission).then(res => {
                this.setState({ attendanceList: res.data });
            });
        } else {
            getEmployeeLateDashboardDetail(new Date().toISOString().substring(0, 16), this.props.selfPermission).then(res => {
                this.setState({ attendanceList: res.data });
            });
        }

    };




    render() {
        let listName = this.props?.presentsList
        return (
            <>
                <div className="content container-fluid">
                    <div>
                        <div className="row">
                            <div className="col-md-12 ">
                                <div className="expireDocs-table" style={{ width: '100%'}}>
                                <Scrollbars autoHide style={this.state.attendanceList.length > 0?(this.state.attendanceList.length < 6?{height:60+(63*(this.state.attendanceList.length))}:{height:375}):{height:51}}>
                                    <table className="table" style={{ width: '100%' }}>                                   
                                        <thead >
                                            <tr style={{ background: '#c4c4c4' }}>
                                                <th>#</th>
                                                <th>Employee</th>
                                                <th>Date</th>
                                                <th>Clock In</th>
                                                <th>Clock Out</th>
                                                {listName === 'onTime' && <th>Status</th>}



                                            </tr>
                                        </thead>
                                         <tbody>
                                        
                                                {this.state.attendanceList.length > 0 && this.state.attendanceList.map((list, index) => (
                                                
                                                <tr className="table-row">
                                                    <td className="table-column">{index + 1}</td>
                                                    <td className="table-column">
                                                      
                                                        <EmployeeListColumn id={list.employee != null ? list.employee.id : list.id} name={list.employee != null ? list.employee.name : list.name} employeeId={list.employeeId}></EmployeeListColumn>
                                                    </td>
                                                    <td className="table-column">{getReadableDate(list.date)}</td>
                                                    <td className="table-column">{list.actualClockIn != null ? convertToUserTimeZone(list.actualClockIn) : '-'}</td>
                                                    <td className="table-column">{list.actualClockOut ? convertToUserTimeZone(list.actualClockOut) : '-'}</td>
                                                    {listName === 'onTime' && <td className="table-column">{list.status == 'no' ? '-' : list.status}</td>}

                                                </tr>
                                                
                                            ))}
                                                
                                        </tbody>
                                     
                                      
                                    </table>
                                    </Scrollbars>
                                    {this.state.attendanceList.length == 0 && <span><Empty /></span>}
                                   
                                    
                                  
                                    

                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>

            </>
        );
    };
}
