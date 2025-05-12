

import { ConfigProvider, DatePicker, Empty } from 'antd';
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
import React, { Component } from 'react';
import Chart from "react-apexcharts";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getEmployeemonthlySalary } from './service';
import { generatePayslips, getPayslips,getPayslipsGeneratedMonth,getMonthSalaryScale,getPayslipPercentageInfo } from '../PaySlip/service';
import { toast } from 'react-toastify';
import { getEmployeeId, getPayrollType, verifyApprovalPermission, verifyViewPermission } from '../../../utility';
import { Button, Grid } from '@mui/material';
import moment from 'moment';
import { FormGroup } from 'reactstrap';
import PayslipUAE02Viewer from '../PaySlip/uae02view';
import PayslipViewer from '../PaySlip/view';
import { getPayslipsPdf } from '../../../HttpRequest';


export default class MyPayslipCard extends Component {
    constructor(props) {
        super(props);
        const data = [
            { 'Basic Salary': 0 },
            { 'Allowance': 0 },
            { 'Earning': 0 },
            { 'Deduction': 0 },
        ];

        // Extract labels and series from data
        const labels = data.map(item => Object.keys(item)[0]);
        
      
        this.state = {
            active: false,
            comparison: '0',
            payslipGenerated: false,
            employeeId: getEmployeeId(),
            month: new Date().toLocaleString('en-US', { month: '2-digit' }),
            year: new Date().getFullYear().toString(),
            payslipYear: new Date().getFullYear().toString(),
            payslipMonthValidation : [],
            monthSalaryScaleData: [],
            totalAmount: "100",
            monthlyPersentageData: [],
            // total: total,
            series: [],
            data: '',
            monthlyData: [],
            monthlyDataLastValue: 0,
            monthlyDataYaxisValue: [],
            lastSixYears: [],
            options: {
                chart: {
                    width: 380,
                    type: 'donut',
                },
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                show: true,
                                total: {
                                    show: true,
                                    label: 'Total Salary',
                                    formatter: () => this.state.total
                                }
                            }
                        }
                    }
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
                title: {
                    text: 'Previous month salary scale'
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
    }


    componentDidMount() {
        this.fetchList();
        // getEmployeemonthlySalary().then(res => {
        //     if (res.status == "OK") {
        //     }
        // })
       
        this.getLastSixYears()
    }

    getLastSixYears = () => {
        const { year,monthlyPersentageData } = this.state; 
        const salary = [];
        monthlyPersentageData.map((res) => {
            salary.push(res.totalSalary);
        })
        const lastSixYears = [];
    
        for (let i = 0; i < 6; i++) {
            lastSixYears.unshift({
                name: (year - i).toString(), 
                Salary: salary[i] 
            });
        }
        let max = Math.max(...lastSixYears.map(e => e.Salary))
        const maxValue = max * 1.3;
        const step = maxValue / 4;
        const dynamicTicks = Array.from({ length: 5 }, (_, i) => Math.round((step * i)));
        this.setState({monthlyDataLastValue : maxValue})
        this.setState({monthlyDataYaxisValue : dynamicTicks})
     this.setState({lastSixYears: lastSixYears})
        return lastSixYears;
    };

    
    getLastSixMonths = () => {
        const { month, monthlyPersentageData } = this.state; 
        let salary = [];
        monthlyPersentageData.length > 0 &&  monthlyPersentageData.map((res) => {
            salary.push(res.totalSalary);
        })

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const monthlyData = [];
    
        for (let i = 0; i < 6; i++) {
            const currentMonthIndex = (month - 1 - i + 12) % 12; 
            monthlyData.unshift({
                name: monthNames[currentMonthIndex], 
                Salary: salary[i] 
            });    
        }
           let max = Math.max(...monthlyData.map(e => e.Salary))
        const maxValue = max * 1.3;
        const step = maxValue / 4;
        const dynamicTicks = Array.from({ length: 5 }, (_, i) => Math.round((step * i)));
        this.setState({monthlyDataLastValue : maxValue})
        this.setState({monthlyDataYaxisValue : dynamicTicks})
        this.setState({monthlyData: monthlyData})
        return monthlyData;
    };
    


    fetchList = () => {
        getPayslipsGeneratedMonth(this.state.payslipYear,0).then(res => {
            if (res.status == "OK") {
                // toast.success(res.message);
                this.setState({payslipMonthValidation : res.data})
            } else {
                this.setState({payslipMonthValidation : []})
                // toast.error(res.message);
            }
        }
        )

        getMonthSalaryScale(this.getPrevSalaryMonth()).then(res => {
            if (res.status == "OK") {
                let data = res.data;
                
                if(data != null){
                    this.setState({totalAmount : data.totalSalary})
                let progressBarInfo = [
                    { 'Basic Salary': data.basicSalary },
                    { 'Allowance ': data.allowance },
                    { 'Earning ': data.earning },
                    { 'Deduction ': data.deduction  }

                ]

                this.setState({monthSalaryScaleData :progressBarInfo},() => {
                    let  labels = this.state.monthSalaryScaleData.map(item => Object.keys(item)[0]);
                     let series = this.state.monthSalaryScaleData.map(item => Object.values(item)[0]);
                     let total = series.reduce((acc, value) => Number(acc) + Number(value), 0);
                    
                    
                     this.setState({labels:labels,series:series,total:total})
                 })

                }
                

                // toast.success(res.message);
              
            } 
        }
        )

        // get payslip %
        getPayslipPercentageInfo(this.getSalaryMonth(),0).then(res => {
            if (res.status == "OK") {
                // toast.success(res.message);
               this.setState({monthlyPersentageData : res.data}, () => {
                this.getLastSixMonths()
               })
            } else {
                // this.setState({payslipMonthValidation : []})
                // toast.error(res.message);
            }
        }
        )
    }
    getSalaryMonth = () => {
        let { month, year } = this.state;
        month = month.toString().length == 1 ? "0" + month : month;
        return `${year}-${month}`;
    }
    getPrevSalaryMonth = () => {
        let { month, year } = this.state;
        let prevMonth = new Date(year, month - 2); // Get the previous month
        let formattedMonth = (prevMonth.getMonth() + 1).toString().padStart(2, '0'); // Format month with leading zero
        let formattedYear = prevMonth.getFullYear().toString();
        return `${formattedYear}-${formattedMonth}`;
    }
    
    // handlePayslipGenerator(date, dateString) {
    //     getPayslips(dateString).then(res => {
    //         if (res.status == "OK") {
    //             toast.success(res.message);
    //         } else {
    //             toast.error(res.message);
    //         }
    //     })
    // }

    handleSalaryComparison = (e) => {
        this.setState({ comparison: e.target.value })
         // get payslip %
         getPayslipPercentageInfo(this.getSalaryMonth(),e.target.value).then(res => {
            if (res.status == "OK") {
                // toast.success(res.message);
                this.setState({monthlyPersentageData : res.data})

                if (this.state.comparison == 0) {
                    this.getLastSixMonths()
                } else {
                    this.getLastSixYears()
                }
            } else {
                // this.setState({payslipMonthValidation : []})
                toast.error(res.message);
            }
        }
        )

    }

    handleYearChange = (date, dateString) => {
        this.setState({ payslipYear: dateString })
        getPayslipsGeneratedMonth(dateString,0).then(res => {
            if (res.status == "OK") {
                // toast.success(res.message);
                this.setState({payslipMonthValidation : res.data})
            } else {
                this.setState({payslipMonthValidation : []})
                // toast.error(res.message);
            }
        }
        )
    }

      handlepayslipMonthandYear = (value) => {
        let { payslipYear } = this.state;
        let salaryMonth = `${payslipYear}-${value.month}`
       

          getPayslipsPdf(salaryMonth)

    }


    generatePDF = () => {
        const input = document.getElementById('payslip');
        html2canvas(input).then(function (canvas) {
            canvas.getContext('2d');
            var imgWidth = canvas.width;
            var imgHeight = canvas.height * imgWidth / canvas.width;
            var top_left_margin = 15;
            var PDF_Width = imgWidth + (top_left_margin * 2);
            var PDF_Height = (PDF_Width * 2) + (top_left_margin * 2);
            var totalPDFPages = Math.ceil(imgHeight / PDF_Height) - 1;
            var imgData = canvas.toDataURL("image/png", 1.0);
            var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
            pdf.addImage(imgData, 'PNG', top_left_margin, top_left_margin, imgWidth, imgHeight);
            for (var i = 1; i <= totalPDFPages; i++) {
                pdf.addPage([PDF_Width, PDF_Height], 'p');
                pdf.addImage(imgData, 'PNG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), imgWidth, imgHeight);
            }

            pdf.save("Payslip" + Date().toLocaleString() + ".pdf");
        });
    };

    render() {
        const { payslipGenerated, text, desc, employeeId, comparison } = this.state
        const salary = [9000 , 8500 , 11000 , 9800 , 13000 , 14800]
        
        
       
        const yearlyData = [
            {
                "name": "2019",
                "Salary": 0,
            },
            {
                "name": "2020",
                "Salary": 0,
            },
            {
                "name": "2021",
                "Salary": 0,
            },
            {
                "name": "2022",
                "Salary": 13908,
            },
            {
                "name": "2023",
                "Salary": 14800,
            },
            {
                "name": "2024",
                "Salary": 53800,
            },

        ]
        const months = [
            { name: 'Jan',month:'01', value: false },
            { name: 'Feb',month:'02', value: false },
            { name: 'Mar',month:'03', value: false },
            { name: 'Apr',month:'04', value: false },
            { name: 'May',month:'05', value: false },
            { name: 'Jun',month:'06', value: false },
            { name: 'Jul',month:'07', value: false },
            { name: 'Aug',month:'08', value: false },
            { name: 'Sep',month:'09', value: false },
            { name: 'Oct',month:'10', value: false },
            { name: 'Nov',month:'11', value: false },
            { name: 'Dec',month:'12', value: false }
        ];
        const disableFutureYears = (current) => {
            return current && current.year() > new Date().getFullYear();
        };
        return (
            <>


                <div className=''>
                    <div className='d-flex'>
                        <div className='ml-5 myPayCard col-md-5' style={{ height: '21em' }}>
                            <div className="Title d-flex">
                                <h2 className='newDashboardTitleAction'>Payslip</h2>

                            </div>
                            <div className='myPayslip-Section'>
                                <ConfigProvider locale={moment.locale('en-gb')}>
                                    <DatePicker
                                        // onChange={this.handlePayslipGenerator}
                                        disabledDate={disableFutureYears}
                                        picker="year"
                                        className='mypay form-control neo-datePicker'
                                        placeholder='YYYY'
                                        format="YYYY"
                                        defaultValue={moment()}
                                        onChange={this.handleYearChange}
                                    />
                                </ConfigProvider>
                                <div className="mt-1 payslip-status">
                                    <div>
                                        {/* {months.map((item , index) => (
                                            <Button sx={{ textTransform: 'none'}} key={index} size="small" onClick={this.generatePDF()} className='mt-4' disabled={item.value} variant="contained">{item.name} <i className='ml-2 fa fa-download'></i></Button>
                                        )) } */}
                                        <Grid container spacing={0} columns={{ xs: 4, sm: 8, md: 12 }}>
                                            {months.map((item, index) => (
                                                <Grid item xs={1} sm={2} md={3} key={index}>
                                                    <Button disabled = {!this.state.payslipMonthValidation.includes(item.month)} sx={{ background: '#64b5f6', textTransform: 'none' }} className='mySlip-btn m-2' size="medium" onClick={(e) =>  this.handlepayslipMonthandYear(item)}  variant="contained">{item.name} <i className='ml-2 fa fa-download'></i></Button>
                                                </Grid>
                                            ))}
                                        </Grid>

                                    </div>
                                    {/* <Empty style={{ lineHeight: '0.5715', fontWeight: '500' }} className='mt-2' description={'No payslips generated'} /> */}
                                    {/* <p className="no-payslip">
                                No payslips generated
                            </p>
                            <p className="message">
                                Please select another month. Payslips for this month is not yet generated.
                            </p> */}

                                </div>
                            </div>
                        </div>
                        <div className='ml-5 myPayCard col-md-5' style={{ width: '100%', height: '21em' }}>
                            <span style={{ float: 'left', fontWeight: '500' }}>Previous six {comparison === '0' ? 'months' : 'years'} salary (Comparison)</span>
                            <select onChange={(e) => { this.handleSalaryComparison(e) }} className='rounded p-1 float-right'>
                                <option value="0">Monthly</option>
                                <option value="1">Yearly</option>
                            </select>
                            <div style={{ marginTop: '55px' }}>
                                <LineChart width={520} height={220} data={comparison === '0' ? this.state.monthlyData : this.state.lastSixYears}
                                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" padding={{ left: 20, right: 10 }} />
                                    {/* <YAxis /> */}
                                    <YAxis
                                        domain={[0, Math.round(this.state.monthlyDataLastValue)]}
                                        ticks={this.state.monthlyDataYaxisValue.map(Number)}
                                        tickFormatter={(value) => value.toFixed(2)}
/>
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Salary" stroke="#8884d8" strokeWidth={4} />
                                </LineChart>
                            </div>
                        </div>
                    </div>
                    <div className='ml-5 myPayCard col-md-5' style={{ width: '100%', height: '19em' }}>
                        <div style={{ textAlign: '-webkit-center' }} className=" mixed-chart">
                        {this.state.monthSalaryScaleData.length > 0  ?  <Chart options={this.state.options} series={this.state.series} type="donut" height={200} />:<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',height:'200px',fontSize: '100px' }} >N/A</div>}
                        </div>
                        {this.state.monthSalaryScaleData.length > 0  ?  <p className='font-weight-bold'>Total Salary: {this.state.total}</p>:null}
                    </div>
                    {/* <PayslipViewer payslip={payslip}></PayslipViewer> */}
                </div>
            </>
        );
    }
}

