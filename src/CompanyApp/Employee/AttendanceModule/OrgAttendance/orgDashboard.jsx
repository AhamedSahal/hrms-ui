import React, { Component } from 'react'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Cell, ReferenceLine } from 'recharts';
import { FcCalendar, FcClock, FcLeave } from "react-icons/fc";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoWarningOutline } from "react-icons/io5";
import { IoIosCheckboxOutline } from "react-icons/io";
import { MdFlightTakeoff } from "react-icons/md";
import { styled } from '@mui/material';
import Tooltipmui, { tooltipClasses } from '@mui/material/Tooltip';
import { GiHummingbird, GiSandsOfTime } from "react-icons/gi";
import { FaAward, FaUmbrellaBeach } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import { TbFriendsOff } from "react-icons/tb";
import { Button } from '@mui/material';
import AttendanceStatusList from '../TeamAttendance/AttendanceStatusview';
import { getEmployeeDashboardDetail } from '../../../../MainPage/Main/Dashboard/service';
import { getCustomizedWidgetDate, getEmployeeId } from '../../../../utility';

const { Header, Body, Footer, Dialog } = Modal;

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltipmui {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'grey',
    color: 'white',
    fontSize: 11,
    width: "110px",
    height: "auto",
    padding: "5px",
    border: "1px solid #D3D3D3"
  },
}));


export default class OrgDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWeek: 0,
      currentMonth: 0,
      dashboard: {},
      overTimeData: [],
      ontimeData: [],
      fromDate: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0],
      fromDateOntime: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split('T')[0],
      toDateOntime: new Date().toISOString().split('T')[0],
    };
  }

  componentDidMount() {
    this.getEmployeeDashList()
    // this.fetchList();
    this.getLastSixDays()
    this.getOntimeLastSixDays()

  }




  fetchList = () => {
    // getEmployeeOvertimeList(this.state.fromDate, this.state.toDate).then(res => {
    //   if (res.status == "OK") {
    //     this.setState({
    //       data: res.data.list,
    //     })
    //   }
    // })
    // getEmployeeOntimeList(this.state.fromDateOntime, this.state.toDateOntime).then(res => {
    //   if (res.status == "OK") {
    //     this.setState({
    //       data: res.data.list,
    //     })
    //   }
    // })

  }

  getEmployeeDashList = () => {
    const EmployeeId = getEmployeeId()
    if (EmployeeId > 0) {
      getEmployeeDashboardDetail(new Date().toISOString().substring(0, 16)).then(res => {
        this.setState({ dashboard: res.data });
      });
    } else {
      this.setState({ dashboard: false });
    }
  }




  hideAttendanceList = () => {
    this.setState({
      isOpenList: false
    })
  }

  getLastSixDays = () => {
    const { fromDate, toDate } = this.state; // Use the date range from state
    const ontime = [22, 5, 11, 6, 13, 25, 45]; // Example data
    const lastSixDays = [];
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const diffInDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    for (let i = 0; i < diffInDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const day = currentDate.toLocaleString('default', { month: 'short', day: 'numeric' });
      lastSixDays.push({
        day,
        Minutes: ontime[i] || 0,
      });
    }

    this.setState({ overTimeData: lastSixDays });
    return lastSixDays;
  };


  getOntimeLastSixDays = () => {
    const { fromDateOntime, toDateOntime } = this.state;
    const Ontime = [22, 5, 11, 6, 13, 25, 45];
    const Late = [-15, -5, -10, -6, -10, -20, -35];
    const lastSixDays = [];
    const startDate = new Date(fromDateOntime);
    const endDate = new Date(toDateOntime);
    const diffInDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    for (let i = 0; i < diffInDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const day = currentDate.toLocaleString('default', { month: 'short', day: 'numeric' });
      lastSixDays.unshift({
        day,
        Ontime: Ontime[i] || 0,
        Late: Late[i] || 0,
      });
    }
    this.setState({ ontimeData: lastSixDays })
    return lastSixDays;
  };

  handlePrevWeek = () => {
    const { fromDate, toDate } = this.state;
    const newFromDate = new Date(fromDate);
    const newToDate = new Date(toDate);
    newFromDate.setDate(newFromDate.getDate() - 6);
    newToDate.setDate(newToDate.getDate() - 6);
    this.setState({ fromDate: newFromDate, toDate: newToDate }, () => {
      this.fetchList()
      this.getLastSixDays()
    });

  };


  handleNextWeek = () => {
    const { fromDate, toDate } = this.state;
    const today = new Date();
    const newFromDate = new Date(fromDate);
    const newToDate = new Date(toDate);
    newFromDate.setDate(fromDate.getDate() + 6);
    newToDate.setDate(toDate.getDate() + 6);
    if (newToDate <= today) {
      this.setState({ fromDate: newFromDate, toDate: newToDate }, () => {
        this.fetchList()
        this.getLastSixDays()
      });

    }

  };

  handleOntimePrevWeek = () => {
    const { fromDateOntime, toDateOntime } = this.state;
    const newFromDateOntime = new Date(fromDateOntime);
    const newToDateOntime = new Date(toDateOntime);
    newFromDateOntime.setDate(newFromDateOntime.getDate() - 6);
    newToDateOntime.setDate(newToDateOntime.getDate() - 6);
    this.setState({ fromDateOntime: newFromDateOntime, toDateOntime: newToDateOntime }, () => {
      this.fetchList()
      this.getOntimeLastSixDays()
    });
  };


  handleOntimeNextWeek = () => {
    const { fromDateOntime, toDateOntime } = this.state;
    const today = new Date();
    const newFromDateOntime = new Date(fromDateOntime);
    const newToDateOntime = new Date(toDateOntime);
    newFromDateOntime.setDate(fromDateOntime.getDate() + 6);
    newToDateOntime.setDate(toDateOntime.getDate() + 6);
    if (newToDateOntime <= today) {
      this.setState({ fromDateOntime: newFromDateOntime, toDateOntime: newToDateOntime }, () => {
        this.fetchList()
        this.getOntimeLastSixDays()
      });

    }

  };


  render() {
    const { currentWeek, currentMonth, ontimeData, dashboard, toDateOntime, overTimeData, fromDateOntime, fromDate, toDate } = this.state;
  

    const data = [
      { name: 'Present', August: 65, September: 70 },
      { name: 'Absent', August: 45, September: 30 },
      { name: 'On Time', August: 60, September: 70 },
      { name: 'Late', August: 5, September: 8 },
      { name: 'Half Day', August: 5, September: 20 },
      { name: 'Leave', August: 5, September: 30 },
    ];

    return (
      <div>

        <div className='d-flex'>
          <div className="TeamDashCardsBody d-flex">
            <div className="p-0 col">
              <div className='mygrid-div'>
                <FcCalendar size={35} />
                <p className='mb-1'>DATE</p>
                <h5 >10 Sep 2024</h5>
              </div>
            </div>
            <div className="p-0 col">
              <div className='mygrid-div'>
                <FaPeopleGroup color='#102746' size={35} />
                <p className='mb-1'>TEAM MEMBERS</p>
                <h5>120</h5>
              </div>
            </div>

            <div className="p-0 col">
              <div className='mygrid-div'>
                <IoIosCheckboxOutline color='#45C56D' size={35} />
                <p className='mb-1'>PRESENT</p>
                <h5 >60</h5>
              </div>
            </div>
            <div className="p-0 col">
              <div className='mygrid-div'>
                <MdFlightTakeoff color='#4DC2DD' size={35} />
                <p className='mb-1'>ON LEAVE</p>
                <h5 >15</h5>
              </div>
            </div>
            <div className="p-0 col">
              <div className='mygrid-div'>
                <IoWarningOutline color='#f88535' size={35} />
                <p className='mb-1'>LATE</p>
                <h5 >45</h5>
              </div>
            </div>
            <div className="p-0 col">
              <div className='mygrid-div'>
                <FaUmbrellaBeach color='#7c4f9d' size={35} />
                <p className='mb-1'>HOLIDAY</p>
                <h5 >45</h5>
              </div>
            </div>
            <div className="p-0 col">
              <div className='mygrid-div'>
                <TbFriendsOff color='#9d8f8f' size={35} />
                <p className='mb-1'>WEEK OFF</p>
                <h5 >15</h5>
              </div>
            </div>
            <div className="p-0 col">
              <div style={{ borderRight: 'none' }} className='mygrid-div'>
                <FcClock color='#f88535' size={35} />
                <p className='mb-1'>ONTIME</p>
                <h5 >45</h5>
              </div>
            </div>

          </div>


        </div>
        <div className='mt-4 d-flex'>
          <div className='teamDashBarChart'>
            <div style={{ placeContent: 'space-between', margin: '0px 45px 10px 45px' }} className='d-flex'>
              <div>
                <h4>Work Trends</h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className='mychart_next' style={{ fontSize: '22px', marginRight: '10px' }}>
                  <i className='fa fa-caret-left' aria-hidden='true'></i>
                </span>
                <span>Aug - Sep</span>
                <span className='mychart_next' style={{ fontSize: '22px', marginLeft: '10px' }}>
                  <i className='fa fa-caret-right' aria-hidden='true'></i>
                </span>
              </div>
            </div>
            <ResponsiveContainer width='100%' height={210}>
              <BarChart
                data={data}
                margin={{
                  top: 5, right: 5, left: 5, bottom: 5,
                }}
              >
                <CartesianGrid />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="August" fill="#7790a9" radius={[10, 10, 0, 0]} />
                <Bar dataKey="September" fill="#b0cae7" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

          </div>
          <div style={{ marginLeft: '9px' }} className=''>
            <div className="p-0 col">
              <div className='mt-0 teamDashRightCard'>
                <p style={{ background: '#f88535', color: 'white', fontSize: '12px', fontWeight: '500', marginBottom: '1px' }}>ABSENCE RATE</p>
                <div className='p-1'>
                  <h4 className='mb-0' >15%</h4>
                  <span>-3 from Previous Month</span>
                </div>
              </div>
            </div>
            <div className="p-0 col">

              <div className=' teamDashRightCard'>
                <p style={{ background: '#45C56D', color: 'white', fontSize: '12px', fontWeight: '500', marginBottom: '1px' }}>OVERTIME RATE</p>
                <div className='p-1'>
                  <h4 className='mb-0' >10%</h4>
                  <span>-3 from Previous Month</span>
                </div>
              </div>
            </div>
            <div className="p-0 col">
              <div className='teamDashRightCard'>
                <p style={{ background: '#4DC2DD', color: 'white', fontSize: '12px', fontWeight: '500', marginBottom: '1px' }}>LATECOMER RATE</p>
                <div className='p-1'>
                  <h4 className='mb-0' >6%</h4>
                  <span>-3 from Previous Month</span>
                </div>

              </div>
            </div>
          </div>
          <div style={{ marginLeft: '20px' }} className="row">
            <LightTooltip title="Click to view more" placement="top" >
              <div onClick={() => {
                this.setState({ isOpenList: true, AttendanceStatusTitle: 'Early Birds' });
              }} className="teamActionCardBody col"><div className='teamActionCard'>
                  <i style={{ position: 'absolute', right: '2px', top: '2px' }} className="pay-table-linkIcon fa fa-external-link" aria-hidden="true"></i>
                  <GiHummingbird color='#45C56D' size={35} />
                  <p className='mb-0'>Monthly Early Birds</p>
                  <h5 >20</h5>
                </div></div>
            </LightTooltip>
            <LightTooltip title="Click to view more" placement="top" >
              <div onClick={() => {
                this.setState({ isOpenList: true, AttendanceStatusTitle: 'Lates' });
              }} className="teamActionCardBody col"><div className='teamActionCard'>
                  <i style={{ position: 'absolute', right: '2px', top: '2px' }} className="pay-table-linkIcon fa fa-external-link" aria-hidden="true"></i>
                  <GiSandsOfTime color='#f88535' size={35} />
                  <p className='mb-0'>Monthly Latecomers</p>
                  <h5 >5</h5>
                </div></div>
            </LightTooltip>
            <div className="w-100"></div>
            <LightTooltip title="Click to view more" placement="top" >
              <div onClick={() => {
                this.setState({ isOpenList: true, AttendanceStatusTitle: 'Perfect Attendance' });
              }} className="teamActionCardBody col">
                <div className='teamActionCard'>
                  <i style={{ position: 'absolute', right: '2px', top: '2px' }} className="pay-table-linkIcon fa fa-external-link" aria-hidden="true"></i>
                  <FaAward color='#09579d' size={35} />
                  <p className='mb-0'>Perfect Attendance</p>
                  <h5 >60</h5>
                </div></div>
            </LightTooltip>
            <LightTooltip title="Click to view more" placement="top" >
              <div onClick={() => {
                this.setState({ isOpenList: true, AttendanceStatusTitle: 'Absences' });
              }} className="teamActionCardBody col"><div className='teamActionCard'>
                  <i style={{ position: 'absolute', right: '2px', top: '2px' }} className="pay-table-linkIcon fa fa-external-link" aria-hidden="true"></i>
                  <FcLeave color='#45C56D' size={35} />
                  <p className='mb-0'>Absences</p>
                  <h5 >10</h5>
                </div></div>
            </LightTooltip>
          </div>
        </div>

        <div className='OrgDashBarChart'>
          <div className={dashboard.overtimeEnable ? 'col-md-6' : 'col-md-12'} style={{ borderRight: 'solid 1px #d5d4d4', textAlign: 'center' }}>

            <div style={{ placeContent: 'space-between', margin: '0px 45px 10px 45px' }} className='d-flex'>
              <div>
                <h4>On Time</h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span onClick={this.handleOntimePrevWeek} className='mychart_next' style={{ fontSize: '22px', marginRight: '10px' }}>
                  <i className='fa fa-caret-left' aria-hidden='true'></i>
                </span>
                <span>{getCustomizedWidgetDate(fromDateOntime)} - {getCustomizedWidgetDate(toDateOntime)}</span>
                <span onClick={this.handleOntimeNextWeek} className='mychart_next' style={{ fontSize: '22px', marginLeft: '10px' }}>
                  <i className='fa fa-caret-right' aria-hidden='true'></i>
                </span>
              </div>
            </div>
            <ResponsiveContainer height={210}>
              <BarChart
                data={ontimeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceLine y={0} stroke="black" strokeWidth={2} />
                <Bar dataKey="Ontime" fill="#82ca9d" />
                <Bar dataKey="Late" fill="#82ca9d" />

              </BarChart>
            </ResponsiveContainer>
          </div>



          {dashboard?.overtimeEnable && <div className='col-md-6' style={{ textAlign: 'center' }}>
            <div style={{ placeContent: 'space-between', margin: '0px 45px 10px 45px' }} className='d-flex'>
              <div>
                <h4>Overtime</h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span onClick={this.handlePrevWeek} className='mychart_next' style={{ fontSize: '22px', marginRight: '10px' }}>
                  <i className='fa fa-caret-left' aria-hidden='true'></i>
                </span>
                <span>{getCustomizedWidgetDate(fromDate)} - {getCustomizedWidgetDate(toDate)}</span>
                <span onClick={this.handleNextWeek} className='mychart_next' style={{ fontSize: '22px', marginLeft: '10px' }}>
                  <i className='fa fa-caret-right' aria-hidden='true'></i>
                </span>
              </div>
            </div>
            <ResponsiveContainer height={210}>
              <BarChart
                title='Sample'
                data={overTimeData}
                margin={{
                  top: 5, right: 5, left: 5, bottom: 5,
                }}
              >
                <CartesianGrid />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="Minutes" fill="#777ca3" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>}
        </div>
        <Modal enforceFocus={false} size={"lg"} show={this.state.isOpenList} onHide={this.hideAttendanceList} >

          <Header closeButton>
            <h5 className="modal-title">{this.state.AttendanceStatusTitle}</h5>
          </Header>
          <Body>
            <AttendanceStatusList statusTitle={this.state.AttendanceStatusTitle} ></AttendanceStatusList>
          </Body>
        </Modal>
      </div>
    )
  }
}
