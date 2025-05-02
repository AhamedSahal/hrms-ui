import React, { Component } from 'react'
import Tooltipmui, { tooltipClasses } from '@mui/material/Tooltip';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';
import { FcCalendar, FcClock, FcLeave } from "react-icons/fc";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoWarningOutline } from "react-icons/io5";
import { IoIosCheckboxOutline } from "react-icons/io";
import { MdFlightTakeoff } from "react-icons/md";
import { styled } from '@mui/material';
import AttendanceStatusList from './AttendanceStatusview';
import { Modal } from 'react-bootstrap';
import { GiHummingbird, GiSandsOfTime } from "react-icons/gi";
import { FaAward, FaUmbrellaBeach } from 'react-icons/fa';
import { TbCalendarCancel, TbFriendsOff } from "react-icons/tb";

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

export default class TeamDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpenList: false
    }
  }

  hideAttendanceList = () => {
    this.setState({
      isOpenList: false
    })
  }
  render() {
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
          <div style={{marginLeft: '9px'}} className='teamRate'>
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
          <div style={{marginLeft: '20px'}} className="row" >
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
        <Modal enforceFocus={false} size={"lg"} show={this.state.isOpenList} onHide={this.hideAttendanceList} >


          <Header closeButton>
            <h5 className="modal-title">{this.state.AttendanceStatusTitle}</h5>
          </Header>
          <Body>
            <AttendanceStatusList ></AttendanceStatusList>
          </Body>


        </Modal>
      </div>
    )
  }
}
