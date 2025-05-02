import { DatePicker } from 'antd';
import moment from 'moment';
import React, { Component } from 'react'
import { getDocumentInformation } from '../../Employee/detail/service';
import PayslipViewer from './payslipViewer';
import { getPayslipsPdfView } from '../../../HttpRequest';
import { toast } from 'react-toastify';
import { getPayslipsGeneratedMonth } from '../PaySlip/service';
import { styled } from '@mui/material';


export default class MonthlyPayslip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            monthlyPayslip: props.monthlyPayslip || {},
            selectedMonth: 'November 2024',
            data: [],
            pdfUrl : "",
            payslipYear: new Date().getFullYear().toString(),
            payslipMonthValidation: [],
            payslipName: ''
        }
    }
    componentDidMount() {
        this.fetchList();
       
        getDocumentInformation(551).then(res => {
            if (res.status == "OK") {
                this.setState({
                    data: res.data,
                })
            }
        })
    }

    fetchList = () => {
        getPayslipsGeneratedMonth(this.state.payslipYear,this.props.employeeId).then(res => {
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

    handleYearChange = (date, dateString) => {
        this.setState({payslipYear: dateString})

        getPayslipsGeneratedMonth(dateString,this.props.employeeId).then(res => {
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

    handleMonthSelect = (value) => {
        let { payslipYear } = this.state;
      
        let salaryMonth = `${payslipYear}-${value.month}`

        let payslipNametemp = 'paylip_'+salaryMonth+'_'+this.props.employeeId+'.pdf'
       getPayslipsPdfView(salaryMonth,this.props.employeeId).then((res) => {
        
        this.setState({pdfUrl: res,payslipName: payslipNametemp})
       })
       
    }


    render() {
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
       
        const { selectedMonth, data } = this.state
        const file = data[1]?.fileName
        return (
            <div className="EmpPay-home-page">
                <div className="slipSidebar">
                    <DatePicker style={{
                        margin: '7px',
                        borderRadius: '6px',
                        width: '193px'
                    }} className='form-control' defaultValue={moment()} picker="year" onChange={this.handleYearChange} />
                    <div className="scrollable-container">
                        {months.map((month) => (
                            
                            <div
                                key={month}
                                // disabled = {!this.state.payslipMonthValidation.includes(month.month)}
                                style={!this.state.payslipMonthValidation.includes(month.month)?{opacity:'0.5' , pointerEvents: 'none',cursor: 'not-allowed'}:{}}
                                className={`payslip-month-btn ${selectedMonth === month ? 'active' : ''} `}
                                onClick={() => this.handleMonthSelect(month)}
                            >
                                <span>{month.name} {this.state.payslipYear}</span>
                                <span><i className="fa fa-chevron-right" aria-hidden="true"></i></span>
                            </div>
                           
                        ))}
                    </div>

                </div>

                <div>
                    <PayslipViewer pdfUrl= {this.state.pdfUrl} payslipName ={this.state.payslipName}></PayslipViewer>
                </div>

            </div>
        )
    }
}
