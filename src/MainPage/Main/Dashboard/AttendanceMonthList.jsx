import React, { Component } from 'react';
import { getAttendanceCountMonth } from './service'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { FormControl, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { FaSearch, FaWindowClose } from "react-icons/fa";
import { TbListSearch } from "react-icons/tb";
import { Button } from 'react-bootstrap';
import { getReadableDate } from '../../../utility';

export default class AttendanceMonthList extends Component {
  constructor(props) {
    super(props);
    const currentMonth = new Date().toLocaleString('en-US', { month: '2-digit' });
    const currentYear = new Date().getFullYear().toString();
    const monthYear = `${currentYear}-${currentMonth}`;

    this.state = {
      monthAttendance: [],
      monthYear: monthYear,
      calenderData: undefined,
      month: currentMonth,
      year: currentYear,
      showSearch: true,
    };
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    let monthYear = this.getMonthYear();
    getAttendanceCountMonth(monthYear).then(res => {
      if (res.status === 'OK') {
        this.setState({
          monthAttendance: res.data,
        });
      } else {
        console.log("Error: " + res.error);
      }
    })
      .catch(error => { console.log("Error: " + error); });
  }
  getMonthYear = () => {
    let { month, year } = this.state;
    month = month.toString().length == 1 ? "0" + month : month;
    return `${year}-${month}`;
  }
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  years = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  render() {
    const { monthAttendance } = this.state;

    return (
      <div className="insidePageDiv">
        <div className="page-containerDocList content container-fluid">
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Monthly Attendance</h3>
              </div>
              <div className="mt-0 float-right col">

                {<div>
                  <div style={{ float: 'right' }} >
                    <Tooltip title="Search" type="hidden" componentsProps={{ tooltip: { sx: { fontSize: '15px', bgcolor: 'common.black', '& .MuiTooltip-arrow': { color: 'common.black', }, }, }, }} placement="top-start">
                      <Button className="d-none" style={{ width: '110px', background: '#45C56D' }} onClick={() => { this.setState({ showSearch: !this.state.showSearch }) }} variant='warning' size='sm'>
                        <TbListSearch font-size='28px' />
                      </Button>
                    </Tooltip>
                  </div>
                  {this.state.showSearch && <div style={{ paddingLeft: "35%" }}>
                    <FormControl variant="standard" sx={{ marginLeft: '4em', minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-standard-label">Select Month</InputLabel>
                      <Select
                        MenuProps={{ disableScrollLock: true }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        onChange={(e) => { this.setState({ month: e.target.value }) }}
                      >
                        {this.months.map((month, index) => (
                          <MenuItem value={index + 1}>{month}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/** Year dropdown */}
                    <FormControl variant="standard" sx={{ ml: 3, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-standard-label">Select Year</InputLabel>
                      <Select
                        MenuProps={{ disableScrollLock: true }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        onChange={(e) => { this.setState({ year: e.target.value }) }}
                      >
                        {this.years.map((year, index) => (
                          <MenuItem value={year}>{year}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FaSearch style={{ cursor: 'pointer', marginTop: '20px', marginLeft: '30px' }} onClick={() => { this.fetchList() }} font-size={25} />
                  </div>}
                </div>}

              </div>
            </div>
          </div>
          <div className='attendanceDiv'>
            <div className='attendance-list'>
              {monthAttendance.length === 0 ? (
                <div> <b> Attendance List Not Found.</b></div>
              ) : (
                monthAttendance.map((data, index) => (
                  <div className="AttendanceCard" key={index}>
                    <div className="attendanceTitle Title">
                      <h3 className="newDashboardTitleAction">{getReadableDate(data.date)}</h3>
                    </div>
                    <div className="float-left qui">
                      <div className="attendCircle">
                        <CircularProgressbarWithChildren
                          value={data.onTime}
                          styles={buildStyles({
                            strokeLinecap: 'butt',
                            pathTransitionDuration: 0.5,
                            pathColor: '#45C56D',
                            trailColor: '#8C5FE4',
                            backgroundColor: '#3e98c7',
                          })}
                        >
                          <div>
                            <p style={{ marginBottom: '-10px', fontSize: '20px', fontWeight: 700 }}>
                              {data.total}
                            </p>
                            <label className="m-0" style={{ fontSize: '14px' }}>
                              Total
                            </label>
                          </div>
                        </CircularProgressbarWithChildren>
                      </div>
                    </div>
                    <div style={{ width: '130px' }} className="float-right mr-2">
                      <div className="d-flex" style={{ color: '#45C56D', borderBottom: '1px solid #c3c3c3' }}>
                        <p>On Time</p>
                        <span style={{ marginLeft: '60px' }}>{data.onTime}</span>
                      </div>
                      <div className="mt-1 d-flex" style={{ color: '#8C5FE4', borderBottom: '1px solid #c3c3c3' }}>
                        <p>Absent</p>
                        <span style={{ marginLeft: '60px' }}>{data.absent}</span>
                      </div>
                      <div className="mt-1 d-flex" style={{ color: '#f88535' }}>
                        <p>Late</p>
                        <span style={{ marginLeft: '85px' }}>{data.onLate}</span>
                      </div>
                    </div>
                  </div>
                )))}
            </div>
            </div>
          </div>
        </div>
        );
  }
}

