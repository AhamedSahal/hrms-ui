import { Button } from '@mui/material'
import React, { Component } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { LuBookKey } from "react-icons/lu";
import { GiStairsGoal } from 'react-icons/gi';
import { TbClockExclamation } from 'react-icons/tb';
import { FcCalendar } from 'react-icons/fc';
import Chart from "react-apexcharts";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import TeamPerformNineBox from './nineBox';
import { VscFeedback } from 'react-icons/vsc';
import { FcRatings } from "react-icons/fc";
import { Modal } from 'antd';
import { getDashboardData , getDashboardProgressBarData} from '../PerformGoals/service';

const data = [
    {
        "name": "",
    },
    {
        "name": "Annual Performance Review 2024",
        "uv": 5,
        "nv": 3,
        "pv": 4,
    },
    {
        "name": "Mid year Review 2024",
        "uv": 2,
        "nv": 2,
        "pv": 3,
    },
    {
        "name": "",
    },

]



const radarData = [
    { category: 'Team-Work', Self: 3, Manager: 4, Peers: 3, Upward: 5 },
    { category: 'Customer focus', Self: 2, Manager: 3, Peers: 4, Upward: 3 },
    { category: 'Team Leading', Self: 4, Manager: 5, Peers: 3, Upward: 4 },
    { category: 'Ambassadorship', Self: 3, Manager: 2, Peers: 3, Upward: 2 },
    { category: 'Autonomy', Self: 5, Manager: 4, Peers: 5, Upward: 3 },
];

const splitRatingdata = [
    { rating: 'Outstanding', employees: 5 },
    { rating: 'Excellent', employees: 3 },
    { rating: 'Satisfactory', employees: 7 },
    { rating: 'Improvement', employees: 1 },
    { rating: 'Unsatisfactory', employees: 2 },
];



const databarchart = [
    { date: 'Apr 19', noStatus: 10, atRisk: 15, behind: 25, onTrack: 50 },
    { date: 'Apr 26', noStatus: 20, atRisk: 10, behind: 30, onTrack: 40 },
    { date: 'May 4', noStatus: 5, atRisk: 20, behind: 35, onTrack: 40 },
    { date: 'May 11', noStatus: 15, atRisk: 25, behind: 30, onTrack: 30 },
    { date: 'May 18', noStatus: 25, atRisk: 20, behind: 15, onTrack: 40 }
];

const frequency = [
    { month: 'Jan', low: 20, medium: 15, high: 30 },
    { month: 'Feb', low: 25, medium: 10, high: 35 },
    { month: 'Mar', low: 15, medium: 20, high: 25 },
    { month: 'Apr', low: 10, medium: 25, high: 40 }
];

export default class TeamPerformDashboard extends Component {
    constructor(props) {
        super(props);

        const data = [
            { 'Completed': 0 },
            { 'On Track': 0 },
            { 'Needs Attention': 0 },
            { 'At Risk': 0 },
            { 'No Status': 0 },
        ];

        const labels = data.map(item => Object.keys(item)[0]);
    

        this.state = {
            dashboard: [],
            dashboardProgressBar: [],
            donetData:[],
            progressData: [],
            series: [],
            showChart: false,
            isAllZero: false,
            options: {
                chart: {
                    width: 380,
                    type: 'donut',
                },
                colors:['#20c997','#1890ff','#fd7e14','#dc3545','#6f42c1'],
                noData: {
                    text: 'N/A',  // Custom text when there's no data
                    align: 'center',
                    verticalAlign: 'middle',
                    style: {
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#333',
                    },
                },
                tooltip: {
                    enabled: true,
                    custom: function ({ series, seriesIndex, w }) {
                        const value = series[seriesIndex];
                        const total = series.reduce((acc, value) => acc + value, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        const label = w.config.labels[seriesIndex];
                        return (
                            `<div class="arrow_box">
                      <span>${label}: ${percentage}%</span>
                    </div>`
                        );
                    }
                },
                dataLabels: {
                    enabled: false
                },
                labels: labels,
                fill: {
                    type: 'gradient',
                },
                legend: {
                    formatter: function (val, opts) {
                        return val + " = " + opts.w.globals.series[opts.seriesIndex]
                    }
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },

        };

    };

    componentDidMount () {
        this.fetchList();
    }

    fetchList = () => {
        getDashboardData(1).then(res => {
                    if (res.status == "OK") {
                        this.setState({ dashboard: res.data },() => {
                            this.fetchData()
                        })
                    }else{
                        this.fetchData()
                    }
                })

               
    }

     fetchData = () => {
            getDashboardProgressBarData(1).then(res => {
                if (res.status == "OK") {
                    let progressBarData = res.data;
                    this.setState({ dashboardProgressBar: res.data })
                    let completed = 0
                    let onTrack = 0
                    let needAttention = 0
                    let atRisk = 0
                    let noStatus = 0

                    let value1 = 0
                    let value2 = 0
                    let value3 = 0
                    let value4 = 0
                    let value5 = 0
                    if(progressBarData.length > 0){
                       
                        progressBarData.map((text) => {
                            let weightStatusValidation = text.subGoalsStatusWeightage != null?text.subGoalsStatusWeightage:text.goalsStatusWeightage != null?text.goalsStatusWeightage:0
                            if(weightStatusValidation == 100){
                                completed = completed+1
                            }else if (weightStatusValidation > 70 && weightStatusValidation < 100){
                                onTrack = onTrack+1
                            }else if (weightStatusValidation > 40 && weightStatusValidation <= 70){
                                needAttention = needAttention+1
                            }else if (weightStatusValidation > 0 && weightStatusValidation <= 40){
                                atRisk = atRisk+1
                            }else if (weightStatusValidation == 0){
                                noStatus = noStatus+1
                            }
    
                          //  Progress Distribution
    
                          if(weightStatusValidation >= 80){
                            value1 = value1 +1
                        }else if (weightStatusValidation >= 60 && weightStatusValidation < 80){
                            value2  = value2 +1
                        }else if (weightStatusValidation >= 40 && weightStatusValidation < 60){
                            value3  = value3 +1
                        }else if (weightStatusValidation >= 20 && weightStatusValidation < 40){
                            value4  = value4 +1
                        }else if (weightStatusValidation >= 0 && weightStatusValidation < 20){
                            value5  = value5 +1
                        }
    
    
                        })
                        
    
                       let progressData = [
                            { range: '≥ 80%', value: (value1/progressBarData.length)*100, color: '#4CAF50', count: value1 },
                            { range: '60 - 80%', value: (value2/progressBarData.length)*100, color: '#9ACD32', count: value2 },
                            { range: '40 - 60%', value: (value3/progressBarData.length)*100, color: '#FFD700', count: value3 },
                            { range: '20 - 40%', value: (value4/progressBarData.length)*100, color: '#FFA500', count: value4 },
                            { range: '0 - 20%', value: (value5/progressBarData.length)*100, color: '#FF4C4C', count: value5 }
                        ];
    
                        this.setState({progressData: progressData})
    
                        let progressBarInfo = [
                            { 'Completed': completed },
                            { 'On Track': onTrack },
                            { 'Needs Attention': needAttention },
                            { 'At Risk': atRisk },
                            { 'No Status': noStatus },
    
                        ]
    
                        if(noStatus == 0 && atRisk == 0 && needAttention == 0 && onTrack == 0 && completed == 0 ){
                            this.setState({isAllZero: true})
                       }
    
                        this.setState({donetData :progressBarInfo},() => {
                           let  labels = this.state.donetData.map(item => Object.keys(item)[0]);
                            let series = this.state.donetData.map(item => Object.values(item)[0]);
                            let total = series.reduce((acc, value) => acc + value, 0);
                           
    
                            this.setState({labels:labels,series:series,total:total})
                        })
                    }else{
                        let progressData = [
                            { range: '≥ 80%', value: 0, color: '#4CAF50', count: value1 },
                            { range: '60 - 80%', value: 0, color: '#9ACD32', count: value2 },
                            { range: '40 - 60%', value: 0, color: '#FFD700', count: value3 },
                            { range: '20 - 40%', value: 0, color: '#FFA500', count: value4 },
                            { range: '0 - 20%', value: 0, color: '#FF4C4C', count: value5 }
                        ];
    
                        this.setState({progressData: progressData})
    
                        let progressBarInfo = [
                            { 'Completed': completed },
                            { 'On Track': onTrack },
                            { 'Needs Attention': needAttention },
                            { 'At Risk': atRisk },
                            { 'No Status': noStatus },
    
                        ]

                        if(noStatus == 0 && atRisk == 0 && needAttention == 0 && onTrack == 0 && completed == 0 ){
                            this.setState({isAllZero: true})
                       }
    
                      
    
                        this.setState({donetData :progressBarInfo},() => {
                           let  labels = this.state.donetData.map(item => Object.keys(item)[0]);
                            let series = this.state.donetData.map(item => Object.values(item)[0]);
                            let total = series.reduce((acc, value) => acc + value, 0);
                           
    
                            this.setState({labels:labels,series:series,total:total})
                        })

                    }
                }
            })
    
        }

    handleShowChart = () => {
        this.setState({ showChart: !this.state.showChart })
    }

    showModal = () => {
        this.setState({ isModalVisible: true });
    };

    handleOk = () => {
        this.setState({ isModalVisible: false });
    };

    handleCancel = () => {
        this.setState({ isModalVisible: false });
    };


    render() {
        const { showChart } = this.state
        return (
            <div className='container-fluid ' style={{ paddingBottom: '30px' }}>
                <div className='d-flex' >
                    <div className='pl-0 col-md-12' >
                        <div className="ml-0 myDashCardsBody row">
                            <div className="col p-0">
                                <div className='mygrid-div'>
                                    <GiStairsGoal style={{ color: '#4DC2DD' }} className='mydashAvarageIcon m-2' size={35} />
                                    <p className='mb-1'>Total Goals Count</p>
                                    <span style={{ fontSize: '14px', fontWeight: 700 }}>{this.state.dashboard.totalGoals != null?this.state.dashboard.totalGoals:0}</span>
                                </div>
                            </div>
                            <div className="col p-0">
                                <div className='mygrid-div'>
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
                                    <p className='mb-1'>Average Progress</p>
                                    <span style={{ fontSize: '14px', fontWeight: 700 }}>{this.state.dashboard.progress != null?this.state.dashboard.progress:0}%</span>

                                </div>
                            </div>
                            <div className="col p-0">
                                <div className='mygrid-div'>
                                    <TbClockExclamation style={{ color: '#ff7081' }} className='mydashAvarageIcon m-2' size={35} />
                                    <p className='mb-1'>Overdue Goals</p>
                                    <span style={{ fontSize: '14px', fontWeight: 700 }}>{this.state.dashboard.overDue != null?this.state.dashboard.overDue:0}</span>
                                </div>
                            </div>
                            <div className="col p-0">
                                <div className='mygrid-div'>
                                    <FcCalendar style={{ color: '#f88535' }} className='mydashAvarageIcon m-2' size={35} />
                                    <p className='mb-1'>Upcoming Reviews</p>
                                    <span style={{ fontSize: '14px', fontWeight: 700 }}>{this.state.dashboard.upcomingGoals != null?this.state.dashboard.upcomingGoals:0}</span>
                                </div>
                            </div>
                            <div className="col p-0">
                                <div className='mygrid-div'>
                                    <VscFeedback style={{ color: '#ff7081' }} className='mydashAvarageIcon m-2' size={35} />
                                    <p className='mb-1'>Feedback Completion %</p>
                                    <span style={{ fontSize: '14px', fontWeight: 700 }}>30</span>
                                </div>
                            </div>
                            <div className="col p-0">
                                <div style={{ border: 'none' }} className='mt-2 mygrid-div'>
                                    <span
                                        className="perform-dash-gradestyle gnInfovalue"
                                        style={{ backgroundColor: 'rgb(128, 128, 128)',color:'white'}}
                                    >
                                         N/A
                                    </span>
                                    <p className='mt-2 mb-1'>Average Performance Rating</p>
                                    <span style={{ fontSize: '14px', fontWeight: 700 }}> N/A</span>
                                </div>
                            </div>

                        </div>

                    </div>


                </div>
                <div className="mt-4 pr-0">
                    {/* 2nd Row */}

                    <div className="row ">
                        <div className="col-4">
                            <div className='performBarGraphBg'>
                                <span style={{ fontSize: '18px', fontWeight: '600' }}>Team Goal Status</span>
                                <ResponsiveContainer width={440} height={210}>
                                    <BarChart
                                        width={600}
                                        height={300}
                                        data={databarchart}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        barSize={30}

                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />

                                        <Bar dataKey="noStatus" stackId="a" fill="#d3d3d3" name="No Status" />
                                        <Bar dataKey="atRisk" stackId="a" fill="#FF8042" name="At Risk" />
                                        <Bar dataKey="behind" stackId="a" fill="#FFBB28" name="Behind" />
                                        <Bar dataKey="onTrack" stackId="a" fill="#00C49F" name="On Track" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className='performBarGraphBg'>
                                <span style={{ fontSize: '18px', fontWeight: '600' }}>Check-in-frequency</span>
                                <ResponsiveContainer width={440} height={210}>
                                    <BarChart
                                        width={500}
                                        height={300}
                                        data={frequency}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        barSize={30}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" label={{ value: "Time", position: "insideBottom", offset: -5 }} />
                                        <YAxis label={{ value: "Check-in counts", angle: -90, position: "insideLeft" }} />
                                        <Tooltip />
                                        <Legend />

                                        <Bar dataKey="low" stackId="a" fill="#82ca9d" name="Low" />
                                        <Bar dataKey="medium" stackId="a" fill="#8884d8" name="Medium" />
                                        <Bar dataKey="high" stackId="a" fill="#8dd1e1" name="High" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className='performDonutWid' >
                                <span style={{ fontSize: '18px', fontWeight: '600' }}>Goal Progress</span>
                                <span onClick={this.showModal} style={{ color: '#2196f3', cursor: 'pointer', float: 'right' }}>How it works!</span>
                                <div style={{ marginTop: '35px',position: 'relative' }} className=" mixed-chart">
                            {/* n/a */}
                            {this.state.isAllZero && (
                                <div className='myPerform-na-div' style={{ textAlign: 'center', fontSize: '47px', marginBottom: '20px', position:'absolute' , top:'49px',left:'89px',width:'103px'}}>
                                    N/A
                                </div>
                            )}
                                    <Chart options={this.state.options} series={this.state.series} type="donut" height={400} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row mt-4">
                        <div class="col-12">
                            <div className='calibration_Chart mt-0' >
                                <div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold' }} >
                                        <span>Post Review Analysis and Calibration Dashboard</span>
                                    </div>
                                    <div >
                                        <i onClick={this.handleShowChart} className={`comparisonIcon fa ${showChart ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'}`} aria-hidden="true"></i>
                                    </div>
                                </div>

                                {showChart && <div>
                                    <div className="row ">
                                        <div className="col-6">
                                            <TeamPerformNineBox />
                                        </div>

                                        <div className='col-6 p-2 performLineChart'>
                                            <span style={{ fontSize: '18px', fontWeight: '600' }}>Average Progress</span>
                                            <LineChart width={600} height={250} data={data}
                                                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis domain={[1, 5]} />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="linear" dataKey="nv" stroke="#8884d8" strokeWidth={3} />
                                                <Line type="linear" dataKey="pv" stroke="#8884d8" strokeWidth={3} />
                                                <Line type="linear" dataKey="uv" stroke="#82ca9d" strokeWidth={3} />
                                            </LineChart>
                                        </div>

                                    </div>
                                    <div className="row mt-4 ">
                                        <div className="col-6">
                                            <div className='performBarGraphBg'>
                                                <span style={{ fontSize: '18px', fontWeight: '600' }}>Overall Split of Team Ratings</span>
                                                <ResponsiveContainer width={640} height={210}>
                                                    <BarChart
                                                        width={600}
                                                        height={300}
                                                        data={splitRatingdata}
                                                        margin={{ top: 30, right: 20, left: 5, bottom: 5 }}
                                                        barSize={30}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis  angle={-30} dataKey="rating" />
                                                        <YAxis label={{ value: "Count of Employees",style: { textAnchor: 'middle' }, angle: -90, position: "insideLeft" }}  />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar dataKey="employees" fill="#82ca9d" strokeWidth={3} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className='performBarGraphBg'>
                                                <span style={{ fontSize: '18px', fontWeight: '600' }}>Performance Chart</span>
                                                <ResponsiveContainer width={540} height={210}>
                                                    <RadarChart data={radarData} outerRadius="80%">
                                                        <PolarGrid />
                                                        <PolarAngleAxis dataKey="category" />
                                                        <PolarRadiusAxis angle={30} domain={[0, 5]} />
                                                        <Radar name="Self" dataKey="Self" stroke="#FF0000" fill="#FF0000" fillOpacity={0.3} />
                                                        <Radar name="Manager" dataKey="Manager" stroke="#008000" fill="#008000" fillOpacity={0.3} />
                                                        <Radar name="Peers" dataKey="Peers" stroke="#800080" fill="#800080" fillOpacity={0.3} />
                                                        <Radar name="Upward" dataKey="Upward" stroke="#0000FF" fill="#0000FF" fillOpacity={0.3} />
                                                        <Legend />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                            </div>
                        </div >
                    </div>

                </div>
                <div class="pl-0 mt-4 col-6">
                    <div className='performLineChart p-3'>
                        <span style={{ fontSize: '18px', fontWeight: '600' }}>Progress Distribution</span>
                        <div className="TeamPerform_progress-bars">
                            {this.state.progressData.length > 0 && this.state.progressData.map((item, index) => (
                                <div key={index} className="TeamPerform_progress-bar-container">
                                    <span className="TeamPerform_progress-label">{item.range}</span>
                                    <div className="TeamPerform_progress-container">
                                        <div className="TeamPerform_progress-bar" style={{ width: `${item.value}%`, background: item.color }}></div>
                                    </div>
                                    <span className="TeamPerform_progress-value">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <Modal
                        title="Automatic Status"
                        visible={this.state.isModalVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={null}
                        width={800}
                    >
                        <span style={{ fontSize: '18px', fontWeight: '600' }}>How status is being calculated?</span>
                        <div className='goalStatusDis'>
                        <p className='p-2' style={{ borderBottom: 'solid 1px #d1cbcb' }}><span style={{ color: 'red', fontWeight: 600 }}>● At risk:</span> <span style={{ float: 'right' }} >  Expected Progress - Actual Progress &gt; 0% &amp; &lt; 40% </span> </p>
                            <p className='p-2' style={{ borderBottom: 'solid 1px #d1cbcb' }}><span style={{ color: 'orange', fontWeight: 600 }}>● Needs attention:</span> <span style={{ float: 'right' }} > Expected Progress - Actual Progress &ge; 40% &amp; &lt; 70%</span> </p>
                            <p className='p-2 ' style={{ borderBottom: 'solid 1px #d1cbcb' }} ><span style={{ color: 'blue', fontWeight: 600 }}>● On track:</span> <span style={{ float: 'right' }} > Expected Progress - Actual Progress &ge;  70% &amp; &lt; 100%</span> </p>
                            <p className='p-2' style={{ borderBottom: 'solid 1px #d1cbcb' }}><span style={{ color: 'green', fontWeight: 600  }}>● Completed:</span> <span style={{ float: 'right' }} > Expected Progress - Actual Progress = 100%</span> </p>
                            <p className='p-2 mb-0' ><span style={{ color: '#775dd0', fontWeight: 600  }}>● No Status:</span> <span style={{ float: 'right' }} > Expected Progress - Actual Progress = 0%</span> </p>
                        </div>
                        <p><strong>Expected result:</strong> Expected progress is calculated based on the 'Start date' and 'End date' specified for a goal/sub goal.</p>
                    </Modal>
                </div>
            </div >
        )
    }
}
