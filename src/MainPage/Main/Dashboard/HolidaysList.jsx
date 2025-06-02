import React, { Component } from "react";
import { getAllHolidayList } from "../../../CompanyApp/ModuleSetup/Holiday/service";
import moment from "moment"; // Importing moment.js for date formatting
import BranchDropdown from "../../../CompanyApp/ModuleSetup/Dropdown/BranchDropdown";
import { Empty } from "antd";
import { getBranchId } from "../../../utility";


class HolidayCalendar extends Component {
    constructor(props) {
        super(props);
        const currentYear = new Date().getFullYear(); 
        this.state = {
            holidays: [],
            data: [],
            q: "",
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            validation: false,
            locationName: "",
            locationId: getBranchId(),
            holidayYear: currentYear.toString(), 
        };
    }

    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        getAllHolidayList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.locationId, this.state.holidayYear).then(res => {
            if (res.status == "OK") {
                this.setState({
                    data: res.data.list,
                    totalPages: res.data.totalPages,
                    totalRecords: res.data.totalRecords,
                    currentPage: res.data.currentPage + 1
                })
            }
        })
    }



    render() {
        const { data } = this.state;

        return (
            <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px", marginBottom: "10px" }}>
                    <div className="pl-0 col-md-4">
                        <BranchDropdown defaultValue={this.state.locationId || "Select Location"} // Set default value to locationId
                            onChange={(e) => {
                                this.setState({
                                    locationId: e.target.value,
                                    locationName: e.target.selectedOptions[0]?.label || "",
                                }, () => {
                                    this.fetchList();
                                });
                            }} >
                        </BranchDropdown>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <button className="btn btn-secondary" onClick={() => {
                            this.setState(prevState => ({ holidayYear: (parseInt(prevState.holidayYear) - 1).toString() }), () => {
                                this.fetchList();
                            });
                        }}>←</button>
                        <span style={{ margin: "0 15px", fontSize: "18px", fontWeight: "bold" }}>{this.state.holidayYear}</span>
                        <button className="btn btn-secondary" onClick={() => {
                            this.setState(prevState => ({ holidayYear: (parseInt(prevState.holidayYear) + 1).toString() }), () => {
                                this.fetchList();
                            });
                        }}>→</button>
                    </div>
                </div>
                {data.length === 0 &&
                        <div style={{marginBottom: '25px' }}>
                            <Empty />
                        </div>
                    }
                <div className="holiday-container">
                    
                    <div className="row">

                        {data.map((holiday, index) => {
                            const formattedDate = moment(holiday.date, "YYYY-MM-DD"); // Parse the date
                            const month = formattedDate.format("MMM"); // Get 3-character month name
                            const day = formattedDate.format("dddd"); // Get full day name
                            const date = formattedDate.format("DD"); // Get date

                            const isPastHoliday = formattedDate.isBefore(moment(), "day"); // Check if the holiday is in the past

                            return (
                                <React.Fragment key={index}>
                                    <div className="col-md-6 mb-2">
                                        <div className={`holiday-item ${isPastHoliday ? 'past-holiday' : ''}`}> {/* Add conditional class */}
                                            <div className="month-date">
                                                <div style={{ fontWeight: '600', color: ' white' }} className={`holiday-month-${month.toLowerCase()}`}>{month.toUpperCase()}</div>
                                                <div className="holiday-date">{date}</div>
                                            </div>
                                            <div className="holiday-info">
                                                <div className="holiday-name">{holiday.occasion}</div>
                                                <div className="holiday-day">{day}</div>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }
}

export default HolidayCalendar;
