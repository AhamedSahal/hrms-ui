import { Button } from '@mui/material'
import React, { Component } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { LuBookKey } from "react-icons/lu";
import { GiStairsGoal } from 'react-icons/gi';
import { TbClockExclamation } from 'react-icons/tb';
import { FcCalendar, FcRatings } from 'react-icons/fc';
import Chart from "react-apexcharts";
import { TbUsersGroup } from "react-icons/tb";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Label, Legend, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BsFileEarmarkText } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import { TbFileCheck } from "react-icons/tb";
import { MdOutlinePendingActions } from "react-icons/md";
import { PiCallBellLight, PiGridNineFill } from "react-icons/pi";
import TeamPerformNineBox from '../TeamPerformance/nineBox';
import OrgPerformNineBox from './nineBox';
import { Tabs, Progress, Table, Avatar, Typography } from 'antd';
import { VscFeedback } from 'react-icons/vsc';
import { Modal } from 'antd';
import { getDashboardData ,getDashboardProgressBarData} from '../PerformGoals/service';

const { Text, Link } = Typography;

const { TabPane } = Tabs;

const pendingReviewers = [
    {
        key: '1',
        name: 'Varun',
        role: 'Group Product Manager',
        department: 'Product',
        employeesToReview: 11,
    },
    {
        key: '2',
        name: 'Vijay Yalamanch',
        role: 'Managing Director',
        department: 'Executive Management',
        employeesToReview: 9,
    },
    {
        key: '3',
        name: 'Vinya Laxmi',
        role: 'Senior Product Analyst',
        department: 'Product',
        employeesToReview: 6,
    },
    {
        key: '4',
        name: 'Roshan Mathew',
        role: 'Senior Product Analyst',
        department: 'Manager',
        employeesToReview: 5,
    },
    {
        key: '5',
        name: 'Abhyn M',
        role: 'Product Manager',
        department: 'Product',
        employeesToReview: 4,
    },
];

const departmentData = [
    { department: 'CS', withObjectives: 40, withoutObjectives: 60 },
    { department: 'Sales', withObjectives: 50, withoutObjectives: 50 },
    { department: 'Office Administration', withObjectives: 30, withoutObjectives: 70 },
    { department: 'Marketing', withObjectives: 45, withoutObjectives: 55 },
    { department: 'Engineering > Product Team', withObjectives: 90, withoutObjectives: 10 },
    { department: 'HR > Talent Acquisition', withObjectives: 85, withoutObjectives: 15 },
    { department: 'Executive Management', withObjectives: 80, withoutObjectives: 20 },
    { department: 'Finance', withObjectives: 60, withoutObjectives: 40 },
    { department: 'Customer Success > Data Analyst', withObjectives: 70, withoutObjectives: 30 },
    { department: 'Sales > Inside Sales', withObjectives: 95, withoutObjectives: 5 },
    { department: 'Sales > Solution Strategy & Consulting', withObjectives: 80, withoutObjectives: 20 },
    { department: 'Product Engineering', withObjectives: 75, withoutObjectives: 25 },
];

const goalChartData = [
    { function: 'Engineering', "1-3": 2, "3-5": 4, "5-7": 4, "7+": 5 },
    { function: 'Product', "1-3": 2, "3-5": 4, "5-7": 3, "7+": 2 },
    { function: 'Sales', "1-3": 3, "3-5": 4, "5-7": 2, "7+": 1 },
    { function: 'People & Culture', "1-3": 1, "3-5": 2, "5-7": 0, "7+": 0 },
    { function: 'CEO’s Office', "1-3": 0, "3-5": 1, "5-7": 0, "7+": 0 }
];


export default class OrgPerformDashboard extends Component {
    constructor(props) {
        super(props);

        const data = [
            { 'Completed': 100 },
            { 'On Track': 20 },
            { 'Needs Attention': 30 },
            { 'At Risk': 10 },
            { 'No Status': 10 },
        ];

        // Extract labels and series from data
        const labels = data.map(item => Object.keys(item)[0]);

        this.state = {
            dashboard: [],
            dashboardProgressBar: [],
            series: [],
            showChart: false,
            buttonState: true,
            isAllZero : false,
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
            getDashboardData(2).then(res => {
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
                getDashboardProgressBarData(2).then(res => {
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
                                }else if (weightStatusValidation >= 70 && weightStatusValidation < 100){
                                    onTrack = onTrack+1
                                }else if (weightStatusValidation >= 40 && weightStatusValidation < 70){
                                    needAttention = needAttention+1
                                }else if (weightStatusValidation > 0 && weightStatusValidation < 40){
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
                        }  // if end
                        else{
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


    handleButtonClick = () => {
        this.setState((prevState) => ({
            buttonState: !prevState.buttonState,
        }));
    };

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
        const { showChart, buttonState } = this.state

        const curveAnalysisData = [
            {
                key: '1',
                department: 'All Departments',
                employees: 170,
                ratings: [50, 50, 70],
            },
            {
                key: '2',
                department: 'Customer Success Team',
                employees: 60,
                ratings: [15, 15, 30],
            },
            {
                key: '3',
                department: 'Engineering',
                employees: 60,
                ratings: [20, 25, 15],
            },
        ];

        const nineBoxAnalysisData = [
            {
                key: '1',
                department: 'All Departments',
                employees: 170,
                ratings: [30, 15, 7, 25, 30, 15, 5, 50, 20],
            },
            {
                key: '2',
                department: 'Customer Success Team',
                employees: 70,
                ratings: [15, 15, 6, 4, 2, 8, 10, 3, 7],
            },
            {
                key: '3',
                department: 'Engineering',
                employees: 50,
                ratings: [5, 5, 10, 10, 5, 7, 3, 5, 5],
            },
        ];



        const nineBoxcolors = [
            '#ffeebf', '#b9dfc7', '#7ec5a3', '#edabab', '#ffeebf',
            '#b9dfc7', '#df6c6c', '#edabab', '#ffeebf'
        ];

        const nineBoxColumns = [
            {
                title: 'Department',
                dataIndex: 'department',
                key: 'department',
                render: (text, record) => (
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{text}</div>
                        <div style={{ color: '#888' }}>{record.employees} Employees</div>
                    </div>
                ),
            },
            {
                title: 'Bell Curve Analysis',
                dataIndex: 'ratings',
                key: 'ratings',
                render: (ratings) => {

                    return (
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    height: '20px',
                                    placeContent: 'space-between',
                                    overflow: 'hidden',
                                    backgroundColor: '#f0f0f0',
                                }}
                            >
                                {ratings.map((item, index) => (
                                    <div style={{ backgroundColor: nineBoxcolors[index] }} className='nineboxanalysisText' key={index}>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                },
            },
        ];


        const columns = [
            {
                title: 'Department',
                dataIndex: 'department',
                key: 'department',
                render: (text, record) => (
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{text}</div>
                        <div style={{ color: '#888' }}>{record.employees} Employees</div>
                    </div>
                ),
            },
            {
                title: 'Bell Curve Analysis',
                dataIndex: 'ratings',
                key: 'ratings',
                render: (ratings, record) => {
                    const [redRating, yellowRating, greenRating] = ratings;
                    const totalEmployees = record.employees;

                    const redWidth = (redRating / totalEmployees) * 100;
                    const yellowWidth = (yellowRating / totalEmployees) * 100;
                    const greenWidth = (greenRating / totalEmployees) * 100;

                    return (
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    height: '20px',
                                    borderRadius: '5px',
                                    overflow: 'hidden',
                                    backgroundColor: '#f0f0f0',
                                }}
                            >
                                <div style={{
                                    width: `${redWidth}%`,
                                    backgroundColor: '#ffaaaa',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px'
                                }}>
                                    {redRating}
                                </div>
                                <div style={{
                                    width: `${yellowWidth}%`,
                                    backgroundColor: '#ffc552',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px'
                                }}>
                                    {yellowRating}
                                </div>
                                <div style={{
                                    width: `${greenWidth}%`,
                                    backgroundColor: '#77bf53',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px'
                                }}>
                                    {greenRating}
                                </div>
                            </div>
                        </div>
                    );
                },
            },
        ];


        const pendingReviewColumns = [
            {
                title: 'Reviewer',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar style={{ backgroundColor: '#007bff', marginRight: 10 }}>
                            {record.name.split(' ').map(word => word[0]).join('')}
                        </Avatar>
                        <div style={{lineHeight: '19px'}}>
                            <Text strong style={{ color: '#4c4c4c' }}>{text}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 12 }}>{record.role}</Text>
                        </div>
                    </div>
                ),
            },
            {
                title: 'Department',
                dataIndex: 'department',
                key: 'department',
                className: "text-center",
            },
            {
                title: 'Employees to Review',
                dataIndex: 'employeesToReview',
                key: 'employeesToReview',
                className: "text-center",
            },
        ];

        const lowReviewColumns = [
            {
                title: 'Employee',
                dataIndex: 'name',
                key: 'name',
                render: (text) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div>
                            <Text strong>{text}</Text>
                        </div>
                    </div>
                ),
            },
            {
                title: 'Department',
                dataIndex: 'department',
                key: 'department',
                className: "text-center",
                render: (text) => <Text>{text}</Text>,
            },
            {
                title: 'Recent Rating',
                dataIndex: 'recentRating',
                key: 'recentRating',
                className: "text-center",
            },
        ];

        const lowEmployees = [
            {
                key: '1',
                name: 'David',
                role: 'Sales',
                department: 'Sales',
                recentRating: 2,
            },
            {
                key: '2',
                name: 'Jhon Wick',
                role: 'Admin',
                department: 'Admin',
                recentRating: 1,
            },
            {
                key: '3',
                name: 'Zara',
                role: 'Accountant',
                department: 'Accountant',
                recentRating: 2,
            },
        ];

        const areaChartData = [
            { name: '0', low: 0, avg: 0, high: 0 },
            { name: '1', low: 10, avg: 20, high: 30 },
            { name: '2', low: 30, avg: 35, high: 40 },
            { name: '3', low: 50, avg: 70, high: 100 },
            { name: '4', low: 30, avg: 30, high: 40 },
            { name: '5', low: 5, avg: 20, high: 30 },
        ];


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
                                    <FcCalendar style={{ color: '#ff7081' }} className='mydashAvarageIcon m-2' size={35} />
                                    <p className='mb-1'>Upcoming Reviews</p>
                                    <span style={{ fontSize: '14px', fontWeight: 700 }}>{this.state.dashboard.upcomingGoals != null?this.state.dashboard.upcomingGoals:0}</span>
                                </div>
                            </div>
                            <div className="col p-0">
                                <div className='mygrid-div'>
                                    <VscFeedback style={{ color: '#aba06a' }} className='mydashAvarageIcon m-2' size={35} />
                                    <p className='mb-1'>Feedback Completion %</p>
                                    <span style={{ fontSize: '14px', fontWeight: 700 }}>100</span>
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
                    <div className='row'>
                        <div className='col-8'>
                            <div className='calibration_Chart mt-0 col-12' >
                                <div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold' }} >
                                        <span>Post Review Analysis and Calibration Dashboard</span>
                                    </div>
                                    <div >
                                        <i onClick={this.handleShowChart} className={`comparisonIcon fa ${showChart ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'}`} aria-hidden="true"></i>
                                    </div>

                                </div>

                                {showChart && <div className='p-3 performLineChart mt-4 '>

                                    <div className="orgPerformTgl mr-2 mb-3">
                                        <div onClick={this.handleButtonClick} className="toggles-btn-view">
                                            <div
                                                className="toggle-button-element"
                                                style={{ transform: `translateX(${buttonState ? '0px' : '80px'})` }}
                                            >
                                                <p className="m-0 self-btn">

                                                    {buttonState ? 'Bell Curve' : '9-box'}
                                                </p>
                                            </div>
                                            <p
                                                className="m-0 team-btn"
                                                style={{ paddingLeft: '13px', transform: `translateX(${buttonState ? '0px' : '-99px'})` }}
                                            >

                                                {buttonState ? '9-box' : 'Bell Curve'}
                                            </p>
                                        </div>
                                    </div>



                                    {!buttonState ?
                                        <>
                                            <OrgPerformNineBox />
                                            <div style={{ padding: '20px' }}>
                                                <Tabs defaultActiveKey="1" type="card">
                                                    <TabPane tab="By Department" key="1">
                                                        <Table columns={nineBoxColumns} dataSource={nineBoxAnalysisData} pagination={false} />
                                                    </TabPane>
                                                    <TabPane tab="By Business unit" key="2">
                                                        <Table columns={nineBoxColumns} dataSource={nineBoxAnalysisData} pagination={false} />
                                                    </TabPane>
                                                    <TabPane tab="By Manager" key="3">
                                                        <Table columns={nineBoxColumns} dataSource={nineBoxAnalysisData} pagination={false} />
                                                    </TabPane>
                                                </Tabs>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <AreaChart data={areaChartData} width={800} height={350}
                                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}

                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />

                                                <Area type="monotone" dataKey="avg" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                                                <Area type="monotone" dataKey="high" stroke="#000" fillOpacity={0} strokeWidth={1} />


                                                <ReferenceLine x="1" stroke="gray" strokeDasharray="3 3">
                                                    <Label value="Low Performers" position="insideBottom" style={{ fill: 'red', fontSize: 12 }} />
                                                </ReferenceLine>
                                                <ReferenceLine x="3" stroke="gray" strokeDasharray="3 3">
                                                    <Label value="Average Performers" position="insideBottom" style={{ fill: 'orange', fontSize: 12 }} />
                                                </ReferenceLine>
                                                <ReferenceLine x="5" stroke="gray" strokeDasharray="3 3">
                                                    <Label value="Top Performers" position="insideBottom" style={{ fill: 'green', fontSize: 12 }} />
                                                </ReferenceLine>

                                                {/* Custom Percent Labels */}
                                                <text x={120} y={70} fill="red" fontSize={12}>↓ 5%</text>
                                                <text x={300} y={150} fill="red" fontSize={12}>↓ 15%</text>
                                                <text x={450} y={330} fill="green" fontSize={12}>↑ 2%</text>
                                            </AreaChart>

                                            <div style={{ padding: '20px' }}>
                                                {/* Tabs */}
                                                <Tabs defaultActiveKey="1" type="card">
                                                    <TabPane tab="By Department" key="1">
                                                        <Table columns={columns} dataSource={curveAnalysisData} pagination={false} />
                                                    </TabPane>
                                                    <TabPane tab="By Business unit" key="2">
                                                        <Table columns={columns} dataSource={curveAnalysisData} pagination={false} />
                                                    </TabPane>
                                                    <TabPane tab="By Manager" key="3">
                                                        <Table columns={columns} dataSource={curveAnalysisData} pagination={false} />
                                                    </TabPane>
                                                </Tabs>
                                            </div>
                                        </>
                                    }

                                </div>}

                            </div>

                            <div className='mt-4 performLineChart col-12' >
                                <span style={{ fontSize: '18px', fontWeight: '600' }}>Department-Wise Distribution of Employees With/Without Objectives</span>

                                <BarChart width={850} height={350}
                                    data={departmentData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="department" angle={-15} textAnchor="end" interval={0} />
                                    <YAxis label={{ value: 'Employees (Percentage)', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend verticalAlign="top" />
                                    <Bar dataKey="withObjectives" stackId="a" fill="#008080" name="With Objectives" barSize={20} />
                                    <Bar dataKey="withoutObjectives" stackId="a" fill="#d3d3d3" name="Without Objectives" barSize={20} />
                                </BarChart>

                            </div>
                            <div style={{ display: 'flex', placeContent: 'space-between' }} className=''>
                                <div className='mt-4 p-2 performLineChart chart_col-6' >
                                    <span className='mt-2' style={{ fontSize: '15px', fontWeight: '600' }}>Breakdown - Overall Performance Level by Function</span>

                                    <BarChart width={400} height={270}
                                        layout="vertical"
                                        data={goalChartData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="function" type="category" />
                                        <Tooltip />
                                        <Legend verticalAlign="top" />
                                        <Bar dataKey="1-3" stackId="a" fill="#008080" name="Exceeds Expectations" barSize={20} />
                                        <Bar dataKey="3-5" stackId="a" fill="#3CB371" name="Meets Expectations" barSize={20} />
                                        <Bar dataKey="5-7" stackId="a" fill="#9370DB" name="Developing" barSize={20} />
                                        <Bar dataKey="7+" stackId="a" fill="#8B4513" name="Consideration Required" barSize={20} />
                                    </BarChart>
                                </div>
                                <div className='mt-4 p-2 performLineChart chart_col-6' >
                                    <span className='mt-2' style={{ fontSize: '15px', fontWeight: '600' }}>Breakdown - Goal Count by Function</span>

                                    <BarChart width={400} height={270}
                                        layout="vertical"
                                        data={goalChartData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="function" type="category" />
                                        <Tooltip />
                                        <Legend verticalAlign="top" />
                                        <Bar dataKey="1-3" stackId="a" fill="#008080" name="1-3" barSize={20} />
                                        <Bar dataKey="3-5" stackId="a" fill="#3CB371" name="3-5" barSize={20} />
                                        <Bar dataKey="5-7" stackId="a" fill="#9370DB" name="5-7" barSize={20} />
                                        <Bar dataKey="7+" stackId="a" fill="#8B4513" name="7+" barSize={20} />
                                    </BarChart>
                                </div>
                            </div>
                            <div className='p-3 mt-4 performLineChart'>
                                <span className='mt-2' style={{ fontSize: '17px', fontWeight: '600' }}>Reviewers and their Pending Reviews</span>
                                <Table id='Table-style' className="mt-3 pendingReviewers-table table-striped"
                                    columns={pendingReviewColumns}
                                    dataSource={pendingReviewers}
                                    pagination={true}
                                />
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='mt-4 performDonutWid' >
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
                            <div className='mt-4 performDonutWid performLineChart p-3'>
                                <div className="TeamPerform_progress-bars">
                                    <div className="orgBreakDown">
                                        <span className="text-success"><TbUsersGroup style={{ color: '#1a6666' }} size={35} /></span>
                                        <span>Active Reviews Group</span>
                                        <span className="TeamPerform_progress-value">01</span>
                                    </div>
                                    <div className="orgBreakDown">
                                        <span className="text-info"><BsFileEarmarkText style={{ color: '#7b267c' }} size={35} /></span>
                                        <span>Reviews to be initiated</span>
                                        <span className="TeamPerform_progress-value">03</span>
                                    </div>
                                    <div className="orgBreakDown">
                                        <span className="text-info"><GrInProgress style={{ color: '#254464' }} size={35} /></span>
                                        <span>Reviews in Progress</span>
                                        <span className="TeamPerform_progress-value">04</span>
                                    </div>
                                    <div className="orgBreakDown">
                                        <span className="text-info"><TbFileCheck style={{ color: '#6c3621' }} size={35} /></span>
                                        <span>Reviews finalized</span>
                                        <span className="TeamPerform_progress-value">02</span>
                                    </div>
                                    <div className="orgBreakDown">
                                        <span className="text-info"><MdOutlinePendingActions style={{ color: 'ffc08a' }} size={35} /></span>
                                        <span>Pending feedback Request</span>
                                        <span className="TeamPerform_progress-value">05</span>
                                    </div>
                                </div>
                            </div>


                            <div className='p-3 mt-4 performLineChart'>
                                <span className='mt-2' style={{ fontSize: '17px', fontWeight: '600' }}>Employees with Lowest Performance Ratings</span>
                                <Table id='Table-style' className="mt-3 pendingReviewers-table table-striped"
                                    columns={lowReviewColumns}
                                    dataSource={lowEmployees}
                                    pagination={false}
                                />
                                <div style={{ textAlign: 'right', marginTop: 10 }}>
                                    <Link href="#">View Employee Ratings</Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div >

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
