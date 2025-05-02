import React, { Component } from 'react'
import { Card, Col, DatePicker, Row } from 'antd';
import Chart from "react-apexcharts";
import EmployeeProfilePhoto from '../../widgetEmployeePhoto';
import { Button } from '@mui/material';
import { BsSliders } from 'react-icons/bs';
import BranchDropdown from '../../../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../../../ModuleSetup/Dropdown/DepartmentDropdown';
import EmployeeMultiSelectDropDown from '../../../ModuleSetup/Dropdown/EmployeeMultiSelectDropDown';
import moment from 'moment';
import JobTitlesDropdown from '../../../ModuleSetup/Dropdown/JobTitlesDropdown';

export default class OrgAttendanceCardView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [21, 1, 1, 2],
            employeeId: [],
            branchId: '',
            month: '',
            departmentId: '',
            fromDate: '',
            toDate: '',
            jobtitleId: '',
            options: {
                chart: {
                    type: 'donut',
                },
                colors: ['#45C56D', '#4DC2DD', '#f88535', '#FF4040'],
                plotOptions: {
                    pie: {
                        startAngle: -90,
                        endAngle: 270
                    }
                },
                dataLabels: {
                    enabled: false
                },
                labels: ['Present', 'Half Day', 'Leave', 'Absent'],
                legend: {
                    formatter: function (val, opts) {
                        return val + " - " + opts.w.globals.series[opts.seriesIndex]
                    }
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 150,
                        },
                        legend: {
                            position: 'bottom',

                        }
                    }
                }]
            },

        }

    }



    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        // getEmployeeAttendanceCardView(this.state.employeeId ,this.state.branchId, this.state.departmentId, this.state.fromDate, this.state.toDate).then(res => {
        //         if (res.status == "OK") {
        //             this.setState({
        //                 data: res.data.list,
        //             })
        //         }
        //     })   

    }

    handleMonthPicker = (date) => {
        if (date) {
            const selectedMonth = date.month();
            const selectedYear = date.year();
            const fromDate = moment().year(selectedYear).month(selectedMonth).startOf('month');
            const toDate = moment().year(selectedYear).month(selectedMonth).endOf('month');
            this.setState(
                {
                    month: selectedMonth + 1,
                    fromDate: fromDate.format('YYYY-MM-DD'),
                    toDate: toDate.format('YYYY-MM-DD')
                },
                () => {
                    this.fetchList();
                }
            );
        }
    };




    render() {
        const { showFilter } = this.state
        const attendanceReports = [
            { id: 1, name: "Ajith Dovel", jobtitle: "Finance Manager", employeeId: "EXPL001", present: 18, halfday: 2, leave: 1, absent: 1 },
            { id: 2, name: "Emma Watson", jobtitle: "Software Engineer", employeeId: "EXPL002", present: 20, halfday: 1, leave: 0, absent: 1 },
            { id: 3, name: "John Doe", jobtitle: "Marketing Specialist", employeeId: "EXPL003", present: 21, halfday: 1, leave: 0, absent: 0 },
            { id: 4, name: "Alice Johnson", jobtitle: "HR Manager", employeeId: "EXPL004", present: 19, halfday: 1, leave: 1, absent: 1 },
            { id: 5, name: "Michael Smith", jobtitle: "Product Manager", employeeId: "EXPL005", present: 20, halfday: 0, leave: 1, absent: 1 },
            { id: 6, name: "Sarah Parker", jobtitle: "Data Analyst", employeeId: "EXPL006", present: 17, halfday: 2, leave: 1, absent: 2 },
            { id: 7, name: "David Brown", jobtitle: "Sales Executive", employeeId: "EXPL007", present: 22, halfday: 0, leave: 0, absent: 0 },
            { id: 8, name: "Sophia Lee", jobtitle: "Operations Director", employeeId: "EXPL008", present: 18, halfday: 2, leave: 1, absent: 1 },
            { id: 9, name: "Robert Green", jobtitle: "Customer Support Specialist", employeeId: "EXPL009", present: 19, halfday: 1, leave: 1, absent: 1 },
            { id: 10, name: "Olivia Taylor", jobtitle: "UX Designer", employeeId: "EXPL010", present: 16, halfday: 2, leave: 2, absent: 2 }
        ];
        
        return (
            <>

                <Button
                    style={{
                        height: '32px',
                        position: 'absolute',
                        right: '384px',
                        top: '260px'
                    }}
                    variant={showFilter ? "contained" : "outlined"}
                    onClick={() => this.setState({ showFilter: !this.state.showFilter })}
                    sx={{ textTransform: 'none', mr: 1 }}
                    size="small"
                >
                    <BsSliders style={{ padding: '2px' }} className='filter-btn' size={30} />
                </Button>
                {this.state.showFilter && <div className='mt-2 filterCard p-3'>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group form-focus">
                                <BranchDropdown defaultValue={this.state.branchId} onChange={e => {
                                    this.setState({
                                        branchId: e.target.value
                                    })
                                }}></BranchDropdown>
                                <label className="focus-label">Location</label>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group form-focus">
                                <DepartmentDropdown defaultValue={this.state.departmentId} onChange={e => {
                                    this.setState({
                                        departmentId: e.target.value
                                    })
                                }}></DepartmentDropdown>
                                <label className="focus-label">Department</label>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group form-focus">
                                <JobTitlesDropdown defaultValue={this.state.jobTitleId} onChange={e => {
                                    this.setState({
                                        jobTitleId: e.target.value
                                    })
                                }}></JobTitlesDropdown>
                                <label className="focus-label">Job Titles</label>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group form-focus">
                                <DatePicker onChange={this.handleMonthPicker} defaultValue={moment()} format={'MMMM-YYYY'} className='form-control' picker="month" />
                            </div>

                        </div>


                        <div className="col-md-5">
                            <EmployeeMultiSelectDropDown
                                onChange={(selectedOptions) => {
                                    const employeeIds = selectedOptions.map(option => option.value);
                                    this.setState({ employeeId: employeeIds });
                                }}
                            ></EmployeeMultiSelectDropDown>
                        </div>
                        <div className="col-md-3">
                            <a href="#" onClick={() => {
                                this.fetchList();
                            }} className="btn btn-success btn-block"> Search </a>
                        </div>
                    </div>
                </div>}

                <div className='attendOrgCardSec'>
                    <div style={{ width: '100%' }} className='row'>
                        {attendanceReports.map((item, index) => (
                            <Col style={{ marginBottom: '18px' }} key={index} xs={24} sm={12} md={12} lg={6}>
                                <Card style={{ height: '160px', width: '20em', border: 'solid 1px #dbcfcf', borderRadius: '5px' }} bodyStyle={{ padding: '1px' }} className='monthlyReportPie' bordered={false}>
                                    <div className='monthlyReportCardTitle'>
                                        <div className="avatar">
                                            <EmployeeProfilePhoto id={item.id} alt={item.name}></EmployeeProfilePhoto>
                                        </div>
                                        <div style={{ display: 'grid' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.name} </span>
                                            <span style={{ fontSize: '12px', color: 'grey' }}>{item.employeeId}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <Chart options={this.state.options} series={this.state.series} type="donut" width={250} />

                                    </div>
                                </Card>
                            </Col>
                        ))}

                    </div>
                </div>
            </>
        )
    }
}
