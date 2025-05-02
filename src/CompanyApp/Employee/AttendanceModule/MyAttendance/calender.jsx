import { Calendar } from 'antd';
import React, { Component } from 'react'
import { convertToUserTimeZoneForAttendance, getEmployeeId } from '../../../../utility';
import moment from 'moment';
import '../attendanceCalendar.css';
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { getEmployeeCalender } from '../../service';

export default class MyCalender extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      gridView: false,
      showFilter: false,
      employeeId: getEmployeeId() || 0,
      calenderData: [],
      calenderDate: undefined,
      buttonState: true,
      dashboard: {}
    };
  }

  componentDidMount() {
    this.fetchCalender()
  }

  fetchCalender = (date) => {
    var empId = this.state.employeeId;
    let { calenderDate } = this.state;
    if (date) {
      calenderDate = new Date(date);
    }
    else if (!calenderDate) {
      calenderDate = new Date();
    }
    this.setState({
      calenderDate
    })
    var year = calenderDate.getFullYear();
    var month = calenderDate.getMonth();
    var firstDayOfMonth = moment([year, month, 1]);
    firstDayOfMonth = firstDayOfMonth.format('YYYY-MM-DD');
    if (this.state.self == 1) {
      empId = getEmployeeId()
    }
    empId > 0 && getEmployeeCalender(empId, firstDayOfMonth).then(res => {
      if (res.status == "OK") {
        this.setState({
          calenderData: res.data ? res.data : [],
          employeeId: empId,
        })
      }
    })
  }

  dateCellRender = (date) => {

    const selectedData = this.state.calenderData.find((item) => {
      return item.calenderDate === date.format('YYYY-MM-DD');
    });
    const isToday = moment().isSame(date, 'day');
    return (
      <div>

        {selectedData && (
          <div>
            <div>
              {selectedData.inTime && <span className="badge  text-dark" style={{ width: '80%', height: '20px', fontSize: '12px' }}><FiArrowDownRight size={15} style={{ color: '#45C56D' }} />In Time: {convertToUserTimeZoneForAttendance(selectedData.inTime)}</span>} <br />
              {selectedData.outTime && <span className="badge  text-dark" style={{ width: '80%', height: '20px', fontSize: '12px' }}><FiArrowUpRight size={15} style={{ color: '#f88535' }} />Out Time: {convertToUserTimeZoneForAttendance(selectedData.outTime)}</span>} <br />
            </div>
            <span className={selectedData.typeOfDay == 'Present' ? "badge bg-present" :
              selectedData.typeOfDay == 'Holiday' ? "badge bg-holiday" :
                selectedData.typeOfDay == 'Weekoff' ? "badge bg-week-off" :
                  selectedData.typeOfDay == 'Leave' ? "badge bg-leave" :
                    selectedData.typeOfDay == 'Halfday' ? "badge bg-half-day" :
                      selectedData.typeOfDay == 'Half day leave - Half day absent' ? "badge bg-halfday-absent" : "badge bg-absent"}
              style={{ width: '100%', height: '20px', fontSize: '12px', placeContent: 'center' }}>{selectedData.typeOfDay == "Half day leave - Half day absent" ? "Half day leave & Absent" : selectedData.typeOfDay}</span>
          </div>
        )}
        {isToday && (
          <div className='today_style' >
            Today
          </div>
        )}
      </div>
    );
  };




  render() {
    return (
      <div className="attendanceBadge">
        <div style={{ justifyContent: 'right' }} className="row">
          <div className="col-md-12 mt-1 mb-2">
            <div className="row chart-list">
              <div className="col">
                <span className="badge bg-present p-2">Present</span>
              </div>
              <div className="col">
                <span className="badge bg-absent p-2">Absent</span>
              </div>
              <div className="col">
                <span className="badge bg-leave p-2">Leave</span>
              </div>
              <div className="col">
                <span className="badge bg-week-off text-dark p-2">WeekOff</span>
              </div>
              <div className="col">
                <span className="badge bg-holiday text-dark p-2">Holiday</span>
              </div>
              <div className="pr-0 col">
                <span className="badge bg-half-day text-dark p-2">Half Day</span>
              </div>
              <div className="col">
                <span className="badge bg-halfday-absent text-dark p-2">Half Day leave & Absent</span>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="calender_div">
            <Calendar className="custom-calendar" mode='month' dateCellRender={this.dateCellRender} onChange={this.fetchCalender} />
          </div>
        </div>
      </div>

    )
  }
}
