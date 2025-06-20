import { Button } from '@mui/material'
import React, { Component } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { GiStairsGoal } from 'react-icons/gi';
import { TbClockExclamation } from 'react-icons/tb';
import { FcCalendar } from 'react-icons/fc';
import Chart from "react-apexcharts";
import { CartesianGrid, Legend, Line, LineChart,Tooltip, XAxis, YAxis } from 'recharts';
import { Tooltip as AntdTooltip } from 'antd';
import { VscFeedback } from "react-icons/vsc";
import {  Modal as Modals } from 'react-bootstrap';
import { MdOutline360 } from 'react-icons/md';
import { Modal } from 'antd';
import "antd/dist/reset.css";
import { getEmployeeId } from '../../../../utility';
import MeetingScheduleForm from '../1on1Meeting/meetingScheduleForm';
import { getDashboardData,getDashboardProgressBarData } from '../PerformGoals/service';
import { getMissingCountByEmployee } from '../1on1Meeting/service';

const { Header, Body, Footer, Dialog } = Modals;
let employeeId = getEmployeeId() || 0;

const data = [
    { date: 'JAN-2024', progress: 2 },
    { date: 'FEB-2024', progress: 5 },
    { date: 'MAR-2024', progress: 15 },
    { date: 'APR-2024', progress: 25 },
    { date: 'MAY-2024', progress: 30 },
    { date: 'JUN-2024', progress: 35 },
    { date: 'JUL-2024', progress: 35 },
    { date: 'AUG-2024', progress: 35 },
    { date: 'SEP-2024', progress: 45 },
    { date: 'OCT-2024', progress: 48 },
    { date: 'NOV-2024', progress: 51 },
    { date: 'DEC-2024', progress: 56 }
];




export default class MyPerformDashboard extends Component {
    constructor(props) {
        super(props);

        const data = [
            { 'Completed': 1 },
            { 'On Track': 1 },
            { 'Needs Attention': 1 },
            { 'At Risk': 1 },
            { 'No Status': 1 },
        ];

        // Extract labels and series from data
        const labels = data.map(item => Object.keys(item)[0]);

        this.state = {
            dashboard: [],
            donetData: [],
            progressData:[],
            dashboardProgressBar: [],
            missingCount: 0,
            total: 0,
            isAllZero : false,
            meetingSchedule : {
                id: 0,
                employee : {
                    id:  getEmployeeId() || 0
                },
                dashboardValidation: true,
                employeeId:  getEmployeeId() || 0
            },
            showForm: false,
            series: [],
            isModalVisible: false,
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
                    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
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
                            position: 'bottom',
                            position: 'absolute',
                            left: 'auto',
                            top: '7px',
                            right: '5px',
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
        getDashboardData(0).then(res => {
                    if (res.status == "OK") {
                        this.setState({ dashboard: res.data },() => {
                            this.fetchData()
                        })
                        
                    }else{
                        this.fetchData()
                    }
                })

                getMissingCountByEmployee().then(res => {
                    if (res.status == "OK") {
                        this.setState({ missingCount: res.data })
                        
                    }
                })



               
    }

    fetchData = () => {
        getDashboardProgressBarData(0).then(res => {
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
                        { 'No Status': noStatus }
                        

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

    hideForm = () => {
        this.setState({
          showForm: false,
        })
      }

      updateList = () => {
        this.setState({
            showForm: false,
          })
          window.location.reload()
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


        return (
            <div style={{ paddingBottom: '30px' }}>
                <div className='d-flex' >
                    <div className='myCardsGrid' >
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
                                <div style={{ border: 'none' }} className='mygrid-div'>
                                    <FcCalendar style={{ color: '#f88535' }} className='mydashAvarageIcon m-2' size={35} />
                                    <p className='mb-1'>Upcoming Goals</p>
                                    <span style={{ fontSize: '14px', fontWeight: 700 }}>{this.state.dashboard.upcomingGoals != null?this.state.dashboard.upcomingGoals:0}</span>
                                </div>
                            </div>

                        </div>
                        <div className="mt-4 ml-0 myDashCardsBody2 row">
                            <div className="col p-0">
                                <div className='mygrid-div'>
                                    <div className='permissionBtnGrid d-flex'>
                                        <VscFeedback style={{ color: '#2e5984', margin: '10px' }} className='mydashAvarageIcon' size={40} />
                                        <p style={{ alignContent: 'center' }} className='m-2'> Feedback from peers, <br /> Manager and Team</p>
                                        <Button disabled={true} variant="contained" sx={{ placeSelf: 'center', height: '31px', textTransform: 'none' }} size="small" >Request Feedback</Button>
                                    </div>

                                </div>
                            </div>
                            <div className="col p-0">
                                <div style={{ borderRight: 'none' }} className='mygrid-div'>
                                    <div className='permissionBtnGrid d-flex'>
                                        <MdOutline360 style={{ color: '#8c5fe8', margin: '10px' }} className='mydashAvarageIcon' size={40} />
                                        <p style={{ alignContent: 'center' }} className='m-2'>Continues Feedback</p>
                                        <Button onClick={() => this.setState({showForm: true})} variant="contained" sx={{ placeSelf: 'center', height: '31px', textTransform: 'none' }}  size="small">Request 1-on-1</Button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '34%' }} className='performDonutWid' >
                        <span style={{ fontSize: '18px', fontWeight: '600' }}>Goal Progress</span>

                        <span onClick={this.showModal} style={{ color: '#2196f3', cursor: 'pointer', float: 'right' }}>How it works!</span>
                        <div style={{ marginTop: '35px',position: 'relative' }} className=" mixed-chart">
                            {/* n/a */}
                            
                            {this.state.donetData.length == 0 ? 
                                <div className='myPerform-na-div' style={{ textAlign: 'center', fontSize: '47px', marginBottom: '20px', position:'absolute' , top:'49px',left:'145px',width:'103px'}}>
                                    N/A
                                </div> : <Chart options={this.state.options} series={this.state.series} type="donut" height={400} />
                            }
                            
                        </div>
                    </div>

                </div>
                <div className='mt-4 d-flex'>
                    <div className='col p-2 performLineChart'>
                        <span style={{ fontSize: '18px', fontWeight: '600' }}>Average Progress</span>
                        <span style={{ float: 'right' }}><AntdTooltip title="Shows the average completion percentage across all the user’s goals. This indicates how close the user is to meeting all their targets.">
                            <i className="fa fa-info-circle" style={{ marginLeft: '8px', cursor: 'pointer' }}></i>
                        </AntdTooltip></span>
                        <LineChart width={600} height={200} data={data}
                            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="linear" dataKey="progress" stroke="#82ca9d" strokeWidth={3} />
                        </LineChart>
                    </div>
                    <div className='ml-3 col performPendingPrev'>
                        <div className='myPendingAction'>
                            <div className='myPerform-miss-div'>
                                <span style={{ fontSize: '17px' }}> {this.state.missingCount}</span> <br />
                                Missing
                            </div>
                            <span>Pending Action</span>
                            <span><Button onClick={() => this.props.updateActiveMenu()} variant="contained" sx={{ placeSelf: 'center', height: '31px', textTransform: 'none' }} size="small">View</Button></span>
                        </div>
                        <div className='prevPerformRate'>
                            <span className=''>Previous / Recent <br /> Performance Rating</span>
                            <span
                                className="perform-dash-gradestyle gnInfovalue"
                                style={{ backgroundColor: 'rgb(128, 128, 128)',color:'white' }}
                            >
                                N/A
                            </span>
                        </div>

                    </div>
                    <div className='ml-3 p-3 col performLineChart'>
                        <span style={{ fontSize: '18px', fontWeight: '600' }}>Progress Distribution</span>
                        <div style={{ lineHeight: '36px' }} className="progress-bars">
                            {this.state.progressData.length > 0 && this.state.progressData.map((item, index) => (
                                <div key={index} className="TeamPerform_progress-bar-container">
                                    <span className="TeamPerform_progress-label">{item.range}</span>
                                    <div className="TeamPerform_progress-container">
                                        <div className="TeamPerform_progress-bar" style={{ width: `${item.value}%`, background: 'grey' }}></div>
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
                        width={800}
                        visible={this.state.isModalVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={null}
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

                <Modals enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


                    <Header closeButton>
                        <h5 className="modal-title">Meeting Schedule Form</h5>

                    </Header>
                    <Body>
                        <MeetingScheduleForm rescheduleId={this.state.rescheduleId} updateList={this.updateList} meetingSchedule={this.state.meetingSchedule}> </MeetingScheduleForm>
                    </Body>


                </Modals>
            </div >
        )
    }
}
