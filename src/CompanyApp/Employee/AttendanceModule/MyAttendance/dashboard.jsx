import { Button } from '@mui/material'
import React, { Component } from 'react'
import { BsClock } from "react-icons/bs";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import BreakdownLineChart from './breakdownChart';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { LuBookKey } from "react-icons/lu";
import { convertToUserTimeZoneForAttendance, getEmailId, getEmployeeId } from '../../../../utility';
import { getEmployeeAttendanceList } from '../../service';
import { getList } from '../../../ModuleSetup/Regularization/service';

const emailId = getEmailId()
export default class Mydashboard extends Component {
    constructor(props) {
        super(props);
        var today = new Date();
        var firstDay = new Date(today.getFullYear(), today.getMonth(), 2);
      
        this.state = {
            RegularizationSettings: false,
            clockInTime: [],
            clockOutTime: [],
            q: emailId || '',
            branchId: "",
            departmentId: "",
            designationId: "",
            jobTitleId: "",
            fromDate: firstDay.toISOString().split('T')[0],
            toDate: today.toISOString().split('T')[0],
            page: 0,
            size: 31,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            self: 1,
            employeeId: "",
            attendData: [
                { date: 'Aug 01', time: 0 },
                { date: 'Aug 02', time: -5 },
                { date: 'Aug 03', time: 10 },
                { date: 'Aug 04', time: -6 },
                { date: 'Aug 05', time: 7 },
                { date: 'Aug 06', time: 8 },
                { date: 'Aug 07', time: -5 },
                { date: 'Aug 08', time: 6 },
                { date: 'Aug 09', time: -8 },
                { date: 'Aug 10', time: 15 },
                { date: 'Aug 11', time: -10 },
                { date: 'Aug 12', time: 12 },
                { date: 'Aug 13', time: 18 },
                { date: 'Aug 14', time: -12 },
                { date: 'Aug 15', time: 9.30 },
                { date: 'Aug 16', time: 3.30 },
                { date: 'Aug 17', time: 4 },
                { date: 'Aug 18', time: -10.30 },
                { date: 'Aug 19', time: 8.30 },
                { date: 'Aug 20', time: -7 },
                { date: 'Aug 21', time: 10 },
                { date: 'Aug 22', time: -7 },
                { date: 'Aug 23', time: 11 },
                { date: 'Aug 24', time: -10 },
                { date: 'Aug 25', time: 15 },
                { date: 'Aug 26', time: -5 },
                { date: 'Aug 27', time: 16 },
                { date: 'Aug 28', time: -6 },
                { date: 'Aug 29', time: 8 },
                { date: 'Aug 30', time: 7 },
                { date: 'Aug 31', time: -6 },
            ],
           
        };

    };

    componentDidMount() {
        this.fetchList();
        this.fetchListData()

    }

    fetchListData = () => {
        getList().then(res => {
            if (res.status == "OK") {
                this.setState({ RegularizationSettings: res.data.regularizationEnabled })
            }
        })

    }
    fetchList = () => {
            getEmployeeAttendanceList(this.state.branchId, this.state.departmentId, this.state.jobTitleId, this.state.q, this.state.fromDate, this.state.toDate, this.state.page, this.state.size, this.state.sort, this.state.self).then(res => {
                if (res.status == "OK") {
                    this.setState({
                        clockData: res.data.list,
                    })
                    const clockin = [];
                    const ClockOut = []
                    res.data.list.forEach((item) => {
                        const convertedTime = convertToUserTimeZoneForAttendance(item.actualClockIn);
                        clockin.push(convertedTime);
                    });
                    res.data.list.forEach((item) => {
                        const convertedTime = convertToUserTimeZoneForAttendance(item.actualClockOut);
                        ClockOut.push(convertedTime);
                    });

                    this.setState({ clockOutTime: ClockOut });
                    this.setState({ clockInTime: clockin });

                }
            })
        
    }

    convertToMinutes = (time) => {
        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours);
        const min = parseInt(minutes.slice(0, 2));
        const isPM = time.includes('PM');
        if (isPM && hour !== 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;
        return hour * 60 + min;
    };

    convertToTime = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const isPM = hours >= 12;
        let hour = isPM ? hours - 12 : hours;
        if (hour === 0) hour = 12;
        if (hours === 12) hour = 12;
        return `${hour}:${minutes < 10 ? '0' : ''}${minutes} ${isPM ? 'PM' : 'AM'}`;
    };

    calculateAverageTime = (data) => {
        const totalMinutes = data?.map(this.convertToMinutes)
            .reduce((acc, curr) => acc + curr, 0);
        const averageMinutes = Math.round(totalMinutes / data?.length);
        return this.convertToTime(averageMinutes);
    };

    handleNavigateRegularize = (item) => {
        this.props.isActive(item)
    }

    render() {
      const employeeId = getEmployeeId()
      
        const averageClockInTime = this.calculateAverageTime(this.state.clockInTime)
        const averageClockOutTime = this.calculateAverageTime(this.state.clockOutTime)

        const statistics = [
            { label: 'Today', hours: 3.5, maxHours: 8 },
            { label: 'This Week', hours: 28, maxHours: 40 },
            { label: 'This Month', hours: 90, maxHours: 160 },
            { label: 'Overtime', hours: 5, maxHours: 10 },
        ];
        return (
            <div style={{ paddingBottom: '30px' }}>

                <div className='d-flex' >
                    <div className='myCardsGrid' >
                        <div className="ml-0 myDashCardsBody row">
                            <div className="col p-0">
                                <div className='mygrid-div'>
                                    <BsClock style={{ color: '#4DC2DD' }} className='mydashAvarageIcon m-2' size={35} />
                                    <p className='mb-1'>Average hours</p>
                                    <span style={{ fontSize: '14px', fontWeight: 700 }}>7h 17 mints</span>
                                </div>
                            </div>
                            <div className="col p-0">
                                <div className='mygrid-div'>
                                    <IoMdLogIn style={{ color: '#45C56D' }} className='mydashAvarageIcon m-2' size={35} />
                                    <p className='mb-1'>Average Clock-in</p>
                                    <span style={{ fontSize: '14px', fontWeight: 700 }}>{employeeId > 0 ? averageClockInTime : '-'}</span>
                                </div>
                            </div>

                            <div className="col p-0">
                                <div className='mygrid-div'>
                                    <IoMdLogOut style={{ color: '#f88535' }} className='mydashAvarageIcon m-2' size={35} />
                                    <p className='mb-1'>Average Check-out</p>
                                    <span style={{ fontSize: '14px', fontWeight: 700 }}>{employeeId > 0 ? averageClockOutTime : '-'}</span>
                                </div>
                            </div>
                            <div className="col p-0">
                                <div style={{ borderRight: 'none' }} className='mygrid-div'>

                                    <CircularProgressbar
                                        className='punctualityChart'
                                        value={80}
                                        strokeWidth={50}
                                        styles={buildStyles({
                                            strokeLinecap: 'butt',
                                            pathTransitionDuration: 0.5,
                                            pathColor: '#45C56D',
                                            trailColor: '#dbdbdb',
                                            backgroundColor: '#3e98c7',
                                        })}
                                    />
                                    <p className='mb-1'>Punctuality</p>
                                    <span style={{ fontSize: '14px', fontWeight: 700 }}>80%</span>

                                </div>
                            </div>

                        </div>
                        <div className="mt-4 ml-0 myDashCardsBody2 row">
                            <div className="col p-0">
                                <div className='mygrid-div'>
                                    <div className='permissionBtnGrid d-flex'>
                                        <LuBookKey style={{ color: '#8c5fe8' }} className='mydashAvarageIcon' size={40} />
                                        <p style={{ alignContent: 'center' }} className='m-2'>Late Clock-In <br /> Early Clock-Out</p>
                                        <Button variant="contained" sx={{ placeSelf: 'center', height: '31px', textTransform: 'none' }} size="small" disabled>Request Permission</Button>
                                    </div>

                                </div>
                            </div>
                            <div className="col p-0">
                                <div style={{ borderRight: 'none' }} className='mygrid-div'>
                                    <div className='permissionBtnGrid d-flex'>
                                        <div className='regularize-grid-div'>
                                            <span style={{ fontSize: '17px' }}>4</span> <br />
                                            Missing
                                        </div>
                                        <p style={{ alignContent: 'center' }} className='m-2'>Pending Attendance <br /> Attendance Correction</p>
                                        <Button onClick={() => this.handleNavigateRegularize('regularize')} variant="contained" sx={{ placeSelf: 'center', height: '31px', textTransform: 'none' }} disabled={!this.state.RegularizationSettings}  size="small">Regularize</Button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '25%' }}>
                        <div className="myStatistics-container">
                            <div className="myStatistics-title">Statistics</div>
                            {statistics.map((stat, index) => (
                                <>
                                    <div className="myStatistics-bar" key={index}>
                                        <span className='float-left'>{stat.label}</span>
                                        <span className='float-right'>{stat.hours} / {stat.maxHours} hrs</span> <br />
                                        <div className="myProgress">
                                            <div
                                                className={`myProgress-bar ${stat.label.toLowerCase().replace(' ', '-')}`}
                                                style={{ width: `${(stat.hours / stat.maxHours) * 100}%` }}
                                            >
                                                {/* {stat.hours} / {stat.maxHours} hrs */}
                                            </div>
                                        </div>
                                    </div>

                                </>
                            ))}
                        </div>
                    </div>
                </div>

                <BreakdownLineChart></BreakdownLineChart>
            </div >
        )
    }
}
