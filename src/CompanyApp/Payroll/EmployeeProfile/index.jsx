import React, { Component } from 'react'
import { getTitle } from '../../../utility'
import { Helmet } from 'react-helmet'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import EmployeeProfilePhoto from '../../Employee/widgetEmployeePhoto';
import { CgUserList } from "react-icons/cg";
import PaySummary from './paySummary';
import MonthlyPayslip from './monthlyPayslip';
import { getPaySummaryData } from './service';

export default class EmployeePayrollProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonState: true,
            activeMenu: 'summary',
            summaryData: [],
            monthlyPayslip: '',
        }
    }

    componentDidMount() {
        console.log("this.propsthis.props", this.props)
        // this.fetchList()
    }
    fetchList = () => {
        getPaySummaryData().then(res => {
            if (res.status == "OK") {
                this.setState({
                    summaryData: res.data
                })
            }
        })
    }
    handleMenuClick = (menu) => {
        this.setState({ activeMenu: menu });
    }
    render() {
        const payrollProf = this.props?.payrollData
        
        const { activeMenu, summaryData, monthlyPayslip } = this.state
        return (
            <div className="pt-0 payProfileBody page-wrapper">
                <Helmet>
                    <title>Employee Payroll Profile | {getTitle()}</title>
                </Helmet>
                <div style={{ borderBottom: 'solid 1px #ddd5d5' }}>
                    <div className="pay-menu-toggle">

                        <button
                            className={activeMenu === 'summary' ? 'active' : ''}
                            onClick={() => this.handleMenuClick('summary')}
                        >
                            <CgUserList className='mr-1' size={16} />
                            Pay Summary
                        </button>
                        <button
                            className={activeMenu === 'payslip' ? 'active' : ''}
                            onClick={() => this.handleMenuClick('payslip')}
                        >
                            <i class="fa fa-address-card mr-1" aria-hidden="true"></i>
                            Payslips
                        </button>

                    </div>
                </div>
                <div className="EmpProfile-home-page">
                    <div className="EmpProfileLeft">
                        <div >
                            <Card sx={{ boxShadow: '0px 0px 5px 0px #c5bbbb', marginTop: '17px', width: '17em', textAlignLast: 'center' }}>
                                <EmployeeProfilePhoto className="payProPic" id={payrollProf.employee?.id} alt={'Adil'} />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                       {payrollProf.employee?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                    {payrollProf.employeeId}
                                    </Typography>
                                </CardContent>
                            </Card>


                        </div>

                    </div>
                    {activeMenu === 'payslip' && <MonthlyPayslip monthlyPayslip={summaryData} employeeId={payrollProf.employee?.id} ></MonthlyPayslip>}
                    {activeMenu === 'summary' && <PaySummary summaryData={payrollProf}></PaySummary>}
                </div>
            </div>
        )
    }
}
