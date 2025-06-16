import React, { Component } from 'react';
import { getCustomizedWidgetDate } from '../../../../utility';
import '../attendanceCalendar.css';
import EmployeePhoto from '../../employeePhoto';
import { Button } from '@mui/material';
import { BsSliders } from 'react-icons/bs';
import BranchDropdown from '../../../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../../../ModuleSetup/Dropdown/DepartmentDropdown';
import { DatePicker } from 'antd';
import moment from 'moment';
import EmployeeMultiSelectDropDown from '../../../ModuleSetup/Dropdown/EmployeeMultiSelectDropDown';
import JobTitlesDropdown from '../../../ModuleSetup/Dropdown/JobTitlesDropdown';

export default class WeeklyListViewCalendar extends Component {
    state = {
        currentDate: new Date(),
        today: new Date(),
        fromDate: '',
        toDate: '',
        branchId: '',
        departmentId: '',
        employeeId: [] || 0,
        selectedOptions: [],
        allDays: []
    };


    componentDidMount() {
        this.fetchList();
        this.weekGenaration()
    }
    fetchList = () => {
        // getEmployeeWeeklyCalenderList(this.state.employeeId ,this.state.branchId, this.state.departmentId, this.state.fromDate, this.state.toDate).then(res => {
        //         if (res.status == "OK") {
        //             this.setState({
        //                 data: res.data.list,
        //             })
        //         }
        //     })   

    }

    handleChange = (selectedOptions) => {
        this.setState({ selectedOptions });
    };


    handleHeaderWeekDays = () => {
        const { fromDate, toDate } = this.state
        const allDays = [];
        let current = moment(fromDate);
        while (current.isSameOrBefore(toDate)) {
            allDays.push(current.format('YYYY-MM-DD'));
            current = current.add(1, 'day');
        }

        this.setState({ allDays });
    }

    weekGenaration = (date) => {
        const today = new Date()
        const fromDate = moment(today).startOf('week').format('YYYY-MM-DD');
        const toDate = moment(today).endOf('week').format('YYYY-MM-DD');
        this.setState({ fromDate, toDate }, () => this.handleHeaderWeekDays());

    };

    updateWeekRange = (date) => {
        const fromDate = moment(date).startOf('week').format('YYYY-MM-DD');
        const toDate = moment(date).endOf('week').format('YYYY-MM-DD');
        this.setState({ fromDate, toDate }, () => {
            this.fetchList()
            this.handleHeaderWeekDays()
        });
    };


    changeWeek = (num) => {
        this.setState((prevState) => {
            const newDate = new Date(prevState.currentDate);
            newDate.setDate(newDate.getDate() + num * 7);
            this.updateWeekRange(newDate);
            return { currentDate: newDate };
        });
    };

    handleDateChange = (date) => {
        if (date) {
            const fromDate = date.startOf('week').format('YYYY-MM-DD');
            const toDate = date.endOf('week').format('YYYY-MM-DD');
            this.setState({ fromDate, toDate }, () => this.handleHeaderWeekDays());

        } else {
            this.setState({ fromDate: '', toDate: '' });
        }
    };

    isToday = (day) => {
        const { today } = this.state;
        const date = new Date(day);
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };


    render() {
        const { allDays, toDate, fromDate, showFilter } = this.state;
        const weeklyAttendance = [
            {
                Id: 15,
                name: "David Alex",
                employeeId: "EX000FD",
                weeklyData: [
                    { in: null, out: null, status: "weekoff" },
                    { in: "9:45 AM", out: "5:45 PM", status: "holiday" },
                    { in: "9:15 AM", out: "5:15 PM", status: "Absent" },
                    { in: "9:00 AM", out: "5:00 PM", status: "present" },
                    { in: "9:30 AM", out: "5:30 PM", status: "Absent" },
                    { in: "9:30 AM", out: "5:30 PM", status: "Absent" },
                    { in: null, out: null, status: "weekoff" },
                ]
            },
            {
                Id: 16,
                name: "Sarah Smith",
                employeeId: "EX001FD",
                weeklyData: [
                    { in: "9:30 AM", out: "5:30 PM", status: "present" },
                    { in: "9:45 AM", out: "5:45 PM", status: "holiday" },
                    { in: "9:15 AM", out: "5:15 PM", status: "Absent" },
                    { in: "9:00 AM", out: "5:00 PM", status: "present" },
                    { in: "9:30 AM", out: "5:30 PM", status: "present" },
                    { in: null, out: null, status: "weekoff" },
                    { in: null, out: null, status: "weekoff" }
                ]
            },
            {
                Id: 17,
                name: "John Doe",
                employeeId: "EX002FD",
                weeklyData: [
                    { in: "9:30 AM", out: "5:30 PM", status: "present" },
                    { in: "9:45 AM", out: "5:45 PM", status: "holiday" },
                    { in: "9:15 AM", out: "5:15 PM", status: "Absent" },
                    { in: "9:00 AM", out: "5:00 PM", status: "present" },
                    { in: "9:30 AM", out: "5:30 PM", status: "present" },
                    { in: null, out: null, status: "weekoff" },
                    { in: null, out: null, status: "weekoff" }
                ]
            },
            {
                Id: 18,
                name: "Jhon Abraham",
                employeeId: "EX000FD",
                weeklyData: [
                    { in: null, out: null, status: "weekoff" },
                    { in: "9:45 AM", out: "5:45 PM", status: "holiday" },
                    { in: "9:15 AM", out: "5:15 PM", status: "present" },
                    { in: "9:00 AM", out: "5:00 PM", status: "present" },
                    { in: null, out: null, },
                    { in: null, out: null, },
                    { in: null, out: null, status: "weekoff" },
                ]
            },
            {
                Id: 19,
                name: "Ajmal Ahmed",
                employeeId: "EX001FD",
                weeklyData: [
                    { in: null, out: null, status: "weekoff" },
                    { in: "9:45 AM", out: "5:45 PM", status: "holiday" },
                    { in: "9:15 AM", out: "5:15 PM", status: "present" },
                    { in: "9:00 AM", out: "5:00 PM", status: "Absent" },
                    { in: "9:30 AM", out: "5:30 PM", status: "present" },
                    { in: "9:30 AM", out: "5:30 PM", status: "Absent" },
                    { in: null, out: null, status: "weekoff" },
                ]
            },
            {
                Id: 20,
                name: "Kareem",
                employeeId: "EX000FD",
                weeklyData: [
                    { in: null, out: null, status: "weekoff" },
                    { in: "9:45 AM", out: "5:45 PM", status: "holiday" },
                    { in: null, out: null, },
                    { in: "9:00 AM", out: "5:00 PM", status: "present" },
                    { in: "9:30 AM", out: "5:30 PM", status: "Absent" },
                    { in: "9:30 AM", out: "5:30 PM", status: "Absent" },
                    { in: null, out: null, status: "weekoff" },
                ]
            },
            {
                Id: 21,
                name: "Fathima Sarah",
                employeeId: "EX001FD",
                weeklyData: [
                    { in: null, out: null, status: "weekoff" },
                    { in: "9:45 AM", out: "5:45 PM", status: "holiday" },
                    { in: "9:15 AM", out: "5:15 PM", status: "Absent" },
                    { in: null, out: null, },
                    { in: null, out: null, },
                    { in: "9:00 AM", out: "5:00 PM", status: "present" },
                    { in: null, out: null, status: "weekoff" }
                ]
            },
        ];

        return (
            <div>
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

                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group form-focus">
                                <DatePicker className='form-control' onChange={this.handleDateChange} picker="week" />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <a href="#" onClick={() => {
                                this.fetchList();
                            }} className="btn btn-success btn-block"> Search </a>
                        </div>
                    </div>
                </div>}
                <div className='calendarDayChange_btn' >

                    <div className="mt-3 col-md-10 d-flex chart-list">
                        <div className="col">
                            <span className="badge weeklyCalendar-present p-2">Present</span>
                        </div>
                        <div className="col">
                            <span className="badge weeklyCalendar-absent p-2">Absent</span>
                        </div>
                        <div className="col">
                            <span className="badge weeklyCalendar-leave p-2">Leave</span>
                        </div>
                        <div className="col">
                            <span className="badge weeklyCalendar-week-off text-dark p-2">WeekOff</span>
                        </div>
                        <div className="col">
                            <span className="badge weeklyCalendar-holiday text-dark p-2">Holiday</span>
                        </div>
                        <div className="col">
                            <span className="badge weeklyCalendar-half-day text-dark p-2">Half Day</span>
                        </div>
                        <div className="col">
                            <span className="badge weeklyCalendar-half-day-absent text-dark p-2">Half Day leave & Absent</span>
                        </div>
                    </div>
                </div>

                <div className="weekly_tbl_cntnr ">
                    <div style={{ float: 'left', width: '55%' }} className='mb-3' >

                        <EmployeeMultiSelectDropDown
                           
                            onChange={(selectedOptions) => {
                                const employeeIds = selectedOptions.map(option => option.value);
                                this.setState({ employeeId: employeeIds }, () => this.fetchList());
                            }}
                        ></EmployeeMultiSelectDropDown>
                    
                    </div>
                    <div className='weekSelectionTag_div'>
                        <span onClick={() => this.changeWeek(-1)} className='mychart_next' style={{ marginRight: '9px', fontSize: '19px' }}>
                            <i className='fa fa-caret-left' aria-hidden='true'></i>
                        </span>
                        <span className='weekSelectionTag'>
                            {getCustomizedWidgetDate(fromDate)} -{' '}
                            {getCustomizedWidgetDate(toDate)}
                        </span>
                        <span onClick={() => this.changeWeek(1)} className='mychart_next' style={{ marginLeft: '9px', fontSize: '19px' }}>
                            <i className='fa fa-caret-right' aria-hidden='true'></i>
                        </span>
                    </div>
                    <div className="table-container" style={{ overflow: 'hidden' }}>
                        <table className="weeklyCalendar table table-bordered" style={{ borderRadius: '6px', borderBottom: 'none', tableLayout: 'fixed', width: '100%' }}>
                            <thead>
                                <tr style={{ background: '#b7b7b7' }}>
                                    <th className='p-1 font-weight-bold' scope="col-md-2" style={{ width: '15%' }}>Name</th>
                                    {allDays?.map((day, index) => {
                                        const date = new Date(day);
                                        return (
                                            <th key={index} className="p-1 text-center font-weight-bold" scope="col" style={{ width: '15%' }}>
                                                <div className={`calendar-day ${this.isToday(date) ? 'highlight-today' : ''}`}>
                                                    <span>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                    <span>{date.getDate()}</span>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                        </table>

                        {/* Scrollable tbody section */}
                        <div style={{ maxHeight: '350px', overflowY: 'scroll' }}>
                            <table className="weeklyCalendar table table-bordered" style={{ borderRadius: '6px', borderTop: 'none', tableLayout: 'fixed', width: '100%' }}>
                                <tbody>
                                    {weeklyAttendance.map((item, rowIndex) => (
                                        <tr key={rowIndex}>
                                            <td scope="col" style={{ width: '15.4%' }}>
                                                <h2  className="table-avatar">
                                                    <div className="avatar">
                                                        <EmployeePhoto id={item.Id} alt={item.name}></EmployeePhoto>
                                                    </div>
                                                    <div>{item.name} <span style={{ fontFamily: 'system-ui' }}>{item.employeeId}</span></div>
                                                </h2>
                                            </td>

                                            {item.weeklyData.map((data, colIndex) => (
                                                <td key={colIndex} scope="col-md-2" style={{
                                                    backgroundColor: this.isToday(allDays[colIndex]) ? '#e0f5ff' : '',
                                                    textAlignLast: 'center', placeContent: 'center', width: '15%'
                                                }}>
                                                    {data.status === 'present' ? (
                                                        <div className="d-flex clockInOutTime_weeklyTbl">
                                                            <div><span>Clock-In</span><br />{data.in}</div>
                                                            <div className="clockInOut_weeklytbl"></div>
                                                            <div><span>Clock-Out</span><br />{data.out}</div>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="weeklyBadgeAb"
                                                            style={{
                                                                background: data.status === 'Absent' ? '#fab9b1' :
                                                                    data.status === 'weekoff' ? '#b9bbb9' :
                                                                        data.status === 'holiday' ? '#f1eaa7' : '#b9cafa',
                                                                color: data.status === 'Absent' ? '#ac2a19' : '#000'
                                                            }}
                                                        >
                                                            {data.status === 'Absent' ? 'Absent' :
                                                                data.status === 'weekoff' ? 'WeekOff' :
                                                                    data.status === 'holiday' ? 'Holiday' : 'Leave'}
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div >
        );
    }
}

