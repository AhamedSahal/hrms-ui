
import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Empty } from 'antd';
import EmployeeListColumn from '../../employeeListColumn';


export default class AttendanceStatusList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attendanceList: [],
            name:'',
        };
    }
    componentDidMount() {
        this.fetchList();
    }

    fetchList = () => {
        const listName = this.props?.statusTitle
        if (listName === 'Early Birds') {
            this.setState({ name: "John Doe" });
            // getEmployeeOntimeDashboardDetail(new Date().toISOString().substring(0, 16), this.props.selfPermission).then(res => {
            //     this.setState({ attendanceList: res.data });
            // });
        } else if (listName === 'Lates') {
            this.setState({ name: "Arun Dev" });
            // getEmployeeAbsentDashboardDetail(new Date().toISOString().substring(0, 16), this.props.selfPermission).then(res => {
            //     this.setState({ attendanceList: res.data });
            // });
        }else if (listName === 'Absences') {
            this.setState({ name: "Shameer" });
            // getEmployeeAbsentDashboardDetail(new Date().toISOString().substring(0, 16), this.props.selfPermission).then(res => {
            //     this.setState({ attendanceList: res.data });
            // });
        }
         else {
            this.setState({ name: "David Deo" });
            // getEmployeeLateDashboardDetail(new Date().toISOString().substring(0, 16), this.props.selfPermission).then(res => {
            //     this.setState({ attendanceList: res.data });
            // });
        }

    };




    render() {
        

         
          
        return (
            <>
                <div className="content container-fluid">
                    <div>
                        <div className="row">
                            <div className="col-md-12 ">
                                <div className="expireDocs-table">
                                    <table className="table">
                                        <thead >
                                            <tr style={{ background: '#c4c4c4' }}>
                                                <th>#</th>
                                                <th style={{ textAlign: 'center' }}>Name</th>
                                                <th style={{ textAlign: 'center' }}>Days</th>
                                                <th style={{ textAlign: 'center' }}>Times</th>



                                            </tr>
                                        </thead>
                                        <tbody>

                                              <tr className="table-row">
                                                    <td className="table-column">1</td>
                                                    <td style={{ textAlign: 'center' }} className="table-column">{this.state.name}</td>
                                                    <td style={{ textAlign: 'center' }} className="table-column">12 days</td>
                                                    <td style={{ textAlign: 'center' }} className="table-column">10 mints</td>
                                                   
                                                </tr>

                                        </tbody>
                                    </table>
                                   

                                </div>
                            </div>
                        </div>
                    </div>
                    </div>

            </>
        );
    };
}
