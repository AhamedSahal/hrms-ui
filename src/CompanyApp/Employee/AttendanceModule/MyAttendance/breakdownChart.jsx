import React, { Component } from 'react';
import Chart from 'react-apexcharts';

export default class BreakdownLineChart extends Component {
    constructor(props) {
        super(props);

        // Initial data setup
        const attendanceStatus = [
            {
                month: 'Aug',
                year: 2024,
                days: [-10, 5, -3, 8, 30, -6, 4, 9, -2, 0, 30, -5, 7, -30, 2, -10, -8, 6, -7, 1, 15, -4, 5, 9, -3, 2, -6, 11, 8, -2, 4]
            },
            {
                month: 'Sep',
                year: 2024,
                days: [1, -3, 5, -2, 8, -1, 0, 2, 7, -4, 3, 6, -5, 4, -2, 8, 1, -6, 3, 7, 0, -1, 5, -3, 9, 2, -8, 6, 4, 0]
            },
            {
                month: 'Oct',
                year: 2024,
                days: [4, 8, -26, 7, 1, -25, 9, 0, 3, -5, 6, -7, 2, 8, -30, 5, 3, -1, 0, 7, -3, 20, 1, -8, 4, 9, 2, -5, 8, -2, 3]
            },
            {
                month: 'Dec',
                year: 2024,
                days: [-1, 5, -3, 8, 2, -26, 7, 0, 3, -4, 5, 9, -7, 2, 6, -30, 8, 1, 0, -2, 7, -8, 24, 3, -6, 9, 5, -1, 2, 0, 6]
            },
            {
                month: 'Jan',
                year: 2025,
                days: [-10, 5, -3, 8, 22, -2, 7, 0, 3, -4, 5, 9, -17, 2, 16, -30, 8, 1, 0, -2, 17, -8, 24, 3, -6, 9, 5, -1, 2, 0, 6]
            }
        ];

        const initialMonth = 0;

        this.state = {
            currentMonthIndex: initialMonth,
            attendanceStatus: attendanceStatus,
            options: {
                chart: {
                    type: 'line',
                    toolbar: {
                        show: true,
                    },
                },
                stroke: {
                    width: 2,
                },
               
                markers: {
                    size: 5,
                    colors: ['#000'],
                    strokeWidth: 2,
                    hover: {
                        size: 7,
                    },
                },
                title: {
                    text: 'Detailed Attendance Breakdown',
                    align: 'left',
                    style: {
                        fontSize:  '19px',
                        fontWeight:  'bold',
                        fontFamily: 'sans-serif',
                        color:  'black'
                      },
                },
                xaxis: {
                    categories: this.getCategories(attendanceStatus, initialMonth),
                    labels: {
                        rotate: -45,
                    },
                    axisBorder: {
                        show: true,
                    },
                    tickAmount: 7,
                },
                yaxis: {
                    title: {
                        text: 'Minutes',
                        style: {
                            fontFamily: 'CircularStd'
                        },
                        
                    },
                    min: -30,
                    max: 30,
                    labels: {
                        formatter: (val) => (val > 0 ? `${val} mins early` : `${Math.abs(val)} mins late`),
                    },
                },
                annotations: {
                    yaxis: [
                        {
                            y: 0,
                            borderColor: '#000',
                            strokeDashArray: 0,
                            label: {
                                borderColor: '#000',
                                style: {
                                    color: '#fff',
                                    background: '#000',
                                },
                                text: 'On Time',
                            },
                        },
                    ],
                },
                tooltip: {
                    enabled: true,
                    shared: true,
                    intersect: false,
                    y: {
                        formatter: (val) => {
                            if (val > 0) {
                                return `${val} mins early`;
                            } else if (val < 0) {
                                return `${Math.abs(val)} mins late`;
                            } else {
                                return 'On Time';
                            }
                        },
                    },
                },
            },
            series: [
                {
                    name: 'Time',
                    data: this.getSeriesData(attendanceStatus, initialMonth), // Initialize with data for the first month
                },
            ],
        };
    }

  
    getCategories = (attendanceStatus, index) => {
        const daysInMonth = attendanceStatus[index].days.length;
        const month = attendanceStatus[index].month;
        return Array.from({ length: daysInMonth }, (_, i) => `${month} ${i + 1}`);
    };

    
    getSeriesData = (attendanceStatus, index) => {
        return attendanceStatus[index].days;
    };

    handleNextMonth = () => {
        this.setState((prevState) => {
            const nextIndex = (prevState.currentMonthIndex + 1) % prevState.attendanceStatus.length;
            return { currentMonthIndex: nextIndex };
        }, this.updateChartData);
    };

    handlePreviousMonth = () => {
        this.setState((prevState) => {
            const prevIndex = (prevState.currentMonthIndex - 1 + prevState.attendanceStatus.length) % prevState.attendanceStatus.length;
            return { currentMonthIndex: prevIndex };
        }, this.updateChartData);
    };

    updateChartData = () => {
        const { currentMonthIndex, attendanceStatus } = this.state;
        this.setState({
            options: {
                ...this.state.options,
                xaxis: {
                    ...this.state.options.xaxis,
                    categories: this.getCategories(attendanceStatus, currentMonthIndex),
                },
            },
            series: [
                {
                    name: 'Time',
                    data: this.getSeriesData(attendanceStatus, currentMonthIndex),
                },
            ],
        });
    };

    render() {
        const { currentMonthIndex, attendanceStatus } = this.state;
        const currentMonth = attendanceStatus[currentMonthIndex].month;
        const currentYear = attendanceStatus[currentMonthIndex].year;

        return (
            <div>
                <div className='dashboard_line_chart' id='chart'>
                    <div className='calendarDayChange_btn' >
                        <span onClick={this.handlePreviousMonth} className='mychart_next' style={{ marginRight: '10px' }}>
                            <i className='fa fa-caret-left' aria-hidden='true'></i>
                        </span>
                        <span>
                            {currentMonth} {currentYear}
                        </span>
                        <span onClick={this.handleNextMonth} className='mychart_next' style={{ marginLeft: '10px' }}>
                            <i className='fa fa-caret-right' aria-hidden='true'></i>
                        </span>
                    </div>
                    <div>
                        <Chart options={this.state.options} series={this.state.series} type='line' height={350} />
                    </div>
                </div>
            </div>
        );
    }
}
