import { Checkbox, DatePicker, Table } from 'antd';
import { Form, Formik } from 'formik';
import React, { Component } from 'react';
import { ButtonGroup, Col, FormGroup, Modal, Row } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { Box, Grid, MenuItem, Paper, styled, } from '@mui/material';

import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { itemRender } from '../../../paginationfunction';
import { getTitle, verifyViewPermission, verifyApprovalPermission, getSyncPeoplehumCustomField, getPayrollType, getReadableMonthYear } from '../../../utility';
import {  deletePayslip, generatePayslips, getPayslips, updateAllPayslipStatus, updatePayslipStatus, getMonthlyData, getSalaryInfoByDepartment,getOrganizationSalary,getOrganizationDashboardInfo} from './service';
import PayslipViewer from './view';
import PayslipUAE02Viewer from './uae02view';
import { HiOutlineViewColumns } from "react-icons/hi2";
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import { IoIosPeople, IoMdTrendingDown, IoMdTrendingUp } from "react-icons/io";
import { TbChartHistogram, TbChartPieFilled } from "react-icons/tb";
import { CiPercent } from "react-icons/ci";
import Chart from "react-apexcharts";
import { Bar, Tooltip, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import EmployeePayrollProfile from '../EmployeeProfile';
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
import PayrollTableDropDown from './payrollTableDropDown';
import moment from 'moment';
import EmployeePhoto from '../../Employee/employeePhoto';
import { getCurrencyList } from '../../ModuleSetup/Currency/service';
import EntityDropdown from '../../ModuleSetup/Dropdown/EntityDropdown';
import { getOrgSettings } from '../../ModuleSetup/OrgSetup/service';


const { Header, Body, Footer, Dialog } = Modal;
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default class PayrollTable extends Component {
    constructor(props) {
        super(props);
        const datas = [
            { 'Engineering': 12500 },
            { 'Administration': 21400 },
            { 'Operations': 11500 },
            { 'Marketing': 12350 },
            { 'Sales': 15350 },
            { 'Financial Department': 21350 },
            { 'Software Service': 21350 },
        ];

        // Extract labels and series from data
        const labels = datas.map(item => Object.keys(item)[0]);
       
        const colors = ['#FF4560', '#775DD0', '#00E396', '#FEB019', '#00D9E9', '#FF66F5', '#008000'];
        this.state = {

            data: [],
            defaultCurrency: "",
            defaultCurrencyCode: "",
            defaultCurrencyName: "",
            defaultCurrencyId: 0,
            orgsetup: false,
            entityId:0,
            CountryList: [],
            employeeId: 0,
            departmentBarInfo: [],
            organizationSalaryInfo: [],
            dashboardInfoData: [],
            previousMonthdashboardInfoData:[],
            total : 0,
            labels : [],
            monthlyDataYaxisValue: [],
            monthlyDataLastValue: 0,
            q: "",
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            showGenerate: false,
            showFilter: true,
            showForm: false,
            showSearch: false,
            month: new Date().toLocaleString('en-US', { month: '2-digit' }),
            year: new Date().getFullYear().toString(),
            selected: [],
            monthlyData: [],
            monthlyComparison: [],
            isDownArrow: false,
            checkedList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '17'],
            isHovered: false,
            branchId: 0,
            series: [],
            loading: false,
            showEmployeeProf: false,
            showChart: false,
            departmentChart: '',
            options: {
                chart: {
                    width: 380,
                    type: 'donut',
                },
                plotOptions: {
                    pie: {
                        startAngle: -90,
                        endAngle: 270
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
                colors: colors,
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
                    text: 'Department wise payout chart'
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
        this.fetchData()
        // this.getLastSixMonths()
        
    }
    getLastSixMonths = () => {
        const { month,organizationSalaryInfo } = this.state;
        
        let salary = [];
        organizationSalaryInfo.length > 0 &&  organizationSalaryInfo.map((res) => {
            salary.push(res.totalSalary);
        })
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const monthlyData = [];
        for (let i = 0; i < 6; i++) {
            const currentMonthIndex = (month - 1 - i + 12) % 12; // Get month index in reverse order
            monthlyData.unshift({
                name: monthNames[currentMonthIndex], // Add month name
                Salary: salary[i] // Assign corresponding salary
            });
        }
        let max = Math.max(...monthlyData.map(e => e.Salary))
        const maxValue = max * 1.3;
        const step = maxValue / 4;
        const dynamicTicks = Array.from({ length: 5 }, (_, i) => Math.round((step * i)));
        this.setState({monthlyDataLastValue : maxValue})
        this.setState({monthlyDataYaxisValue : dynamicTicks})
        this.setState({ monthlyComparison: monthlyData })
        return monthlyData;
    };
    fetchList = () => {
        let salaryMonth = this.getSalaryMonth();
        (verifyViewPermission("Payroll Payslip") || verifyApprovalPermission("Payroll Run Payroll")) && getPayslips(salaryMonth, this.state.q, this.state.page, this.state.size, this.state.sort,this.state.branchId,this.state.defaultCurrencyId,this.state.employeeId,this.state.entityId).then(res => {
            if (res.status == "OK") {
                this.fetchMonthlyData();
                let processedData;
                if (getPayrollType() === "NORMAL" || getPayrollType() === "UAE") {
                    processedData = res.data.list.map(record => {
                        return {
                            ...record,
                            payslipItems: record.payslipItems.filter(item => item.title.trim() !== "Gross Salary")
                        };
                    });
                } else {
                    processedData = res.data.list;
                }
                this.setState({
                    data: processedData,
                    totalPages: res.data.totalPages,
                    totalRecords: res.data.totalRecords,
                    currentPage: res.data.currentPage + 1,
                })
            }
        })
       

        // get admin deparment salary info
        getSalaryInfoByDepartment(this.getSalaryMonth(),this.state.defaultCurrencyId,this.state.branchId,this.state.entityId).then(res => {
                    if (res.status == "OK") {
                        let data = res.data;
                        
                        
                        this.setState({departmentBarInfo :data},() => {
                            let  labels = this.state.departmentBarInfo.length > 0? this.state.departmentBarInfo.map(item => item.salaryMonth == null?"No Department":item.salaryMonth):[];
                             let series = this.state.departmentBarInfo.length > 0? this.state.departmentBarInfo.map(item => Number(item.totalSalary)) : [];
                             let total = this.state.departmentBarInfo.length > 0?series.reduce((acc, value) => Number(acc) + Number(value), 0):0;
                           
                            let {options} = this.state;
                            options.labels = labels;
                            
                             this.setState({options,series:series,total:total,showChart : false})
                         })
        
                       
                    } else {
                       
                        // toast.error(res.message);
                    }
                }
                )

                // get organization salary and net pay
                getOrganizationSalary(this.getSalaryMonth(),this.state.defaultCurrencyId,this.state.branchId,0,this.state.entityId).then(res => {
                    if (res.status == "OK") {
                
        
                        // toast.success(res.message);
                        this.setState({organizationSalaryInfo : res.data}, () =>  this.getLastSixMonths())
                    } else {
                        this.setState({organizationSalaryInfo : []}, () =>  this.getLastSixMonths())
                        // toast.error(res.message);
                    }
                }
                )


                // get organization dashboard info

                getOrganizationDashboardInfo(this.getSalaryMonth(),this.state.defaultCurrencyId,this.state.branchId,this.state.entityId).then(res => {
                    if (res.status == "OK") {
                
        
                       
                        this.setState({dashboardInfoData : res.data})
                    } else {
                        this.setState({dashboardInfoData : []})
                        toast.error(res.message);
                    }
                }
                )

                 // get previous month organization dashboard info

                 getOrganizationDashboardInfo(this.getPreviousSalaryMonth(),this.state.defaultCurrencyId,this.state.branchId,this.state.entityId).then(res => {
                    if (res.status == "OK") {
                
        
                       
                        this.setState({previousMonthdashboardInfoData : res.data})
                    } else {
                        this.setState({previousMonthdashboardInfoData : []})
                        toast.error(res.message);
                    }
                }
                )




    }
    fetchMonthlyData = () => {
        let salaryMonth = this.getSalaryMonth();
        (verifyViewPermission("Payroll Payslip")) && getMonthlyData(salaryMonth, this.state.q).then(res => {

            if (res.status == "OK") {
                this.setState({
                    monthlyData: res.data
                })
            }
        })
    }

    fetchData = () => {
        getCurrencyList().then(res => {
            if (res.status == "OK") {
                this.setState({
                    CountryList: res.data,
                })
               
                    let data = res.data[0]
                   
                    this.setState({defaultCurrencyId : data.id},() =>  this.fetchList())
                    this.setState({defaultCurrency: data.countryCode})
                    this.setState({defaultCurrencyCode: data.currencyCode})
                    this.setState({defaultCurrencyName: data.currencyName})
                
            }else{
                this.fetchList();
            }
        })

        // entity validation
         // entity is present validation
         getOrgSettings().then(res => {
            if (res.status == "OK") {
              this.setState({ orgsetup: res.data.entity })
            }
          })

       

    }

    getPreviousSalaryMonth = () => {
        let { month, year } = this.state;

        let newDate = new Date(year, month - 2);
        let formattedDate = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`;
        return formattedDate;
    }
    
    getSalaryMonth = () => {
        let { month, year } = this.state;

        
        month = month.toString().length == 1 ? "0" + month : month;
        return `${year}-${month}`;
    }
    generate = () => {
        let { generateMonth, generateYear } = this.state;
        if (generateMonth != null && generateYear != null) {
            generateMonth = generateMonth.toString().length == 1 ? "0" + generateMonth : generateMonth;
            let salaryMonth = `${generateYear}-${generateMonth}`;
            this.getSalaryMonth();
            generatePayslips(salaryMonth).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                    this.fetchList();
                } else {
                    toast.error(res.message);
                }
            }
            )
        } else {
            toast.error("Please Provide Required Field");
        }
    }

    reduceString = (str, maxLength) => {
        if (typeof str !== 'string' || str.length <= maxLength) {
            return str || '';
        } else {
            return str.slice(0, maxLength) + '...';
        }
    }

   


    getColumns = () => {
        const { selected } = this.state || [];


        const menuItems = (text, record) => {
            const items = [];

            if (verifyApprovalPermission("Payroll Run Payroll")) {
                items.push(
                    <div>
                        <a className="muiMenu_item" href="#" onClick={() => { this.setState({ payslip: record, showPayslip: true }) }}>
                              <i  className="fa fa-eye" aria-hidden="true"></i> View
                            </a>
                    </div>
                );
            }

            if (verifyApprovalPermission("Payroll Run Payroll")) {
                items.push(
                    <div>
                        <a className="muiMenu_item" href="#" onClick={() => {
                            this.setState({ payslip: record, showStatusForm: true })
                        }}><i className="fa fa-pencil m-r-5" /> Update Status</a>
                    </div>
                );
            }
           
            // if (verifyApprovalPermission("Payroll Run Payroll")) {
            //     items.push(
            //         <div>
            //             <a className="muiMenu_item" href="#" onClick={() => { this.delete(record) }}>
            //                 <i className="fa fa-trash-o m-r-5"></i> Delete</a>
            //         </div>
            //     );
            // }
            return items;
        };
        const getStyle = (text, record) => {
            if (text === 'PAID') {
                return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>SENT</span>;
            }
            if (text === 'UNPAID') {
                return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>NOT SENT</span>;
            }
            return 'null';
        }

        const isCustomFieldEnabled = getSyncPeoplehumCustomField();

        return [
            {
                title: 'Employee',
                sorter: false,
                fixed: 'left',
                width: 300,
                key: '1',
                render: (text, record) => {
                    return <>
                        <div >
                            <h2 className="table-avatar">
                                <div className="avatar">
                                    <EmployeePhoto id={text.employee.id} alt={text.employee.name}></EmployeePhoto>
                                </div>
                                <div>
                                    {this.reduceString(text.employee.name, 25)}<span>{text.employeeId}</span>
                                </div>
                            </h2>
                            <i onClick={() => {
                                this.setState({ showEmployeeProf: true, payrollData: text })
                            }} className="pay-table-linkIcon fa fa-external-link" aria-hidden="true"></i>
                        </div>
                    </>
                }

            },
            {
                title: 'Department',
                dataIndex: 'department',
                sorter: false,
                width: 150,
                key: '2',
            },
            {
                title: 'Payroll Month',
                sorter: false,
                align: 'center',
                width: 120,
                key: '3',
                render: (text, record) => {
                    return <span>{getReadableMonthYear(text.salaryMonth)}<br /></span>
                }
            },
            {
                title: 'Payable Days',
                sorter: false,
                background: '#dbffdb',
                align: 'center',
                width: 150,
                key: '4',
                render: (text, record) => {
                    return <div style={{
                        fontSize: '13px'
                    }}>

                        <div> <b>{record.payableDays} Days</b></div>
                        <div> Out of {record.totalDays} </div>


                    </div>
                }
            },

            {
                title: 'Basic Salary',
                dataIndex: 'basicSalary',
                sorter: false,
                align: 'center',
                width: 100,
                key: '6',
            }, {
                title: 'Allowances',
                sorter: false,
                align: 'center',
                width: 100,
                key: '7',
                render: (text, record) => {
                    return <span >{parseFloat(text.allowance + text.otherAllowances).toFixed(2)}<br /></span>
                }
            },
            getPayrollType() === "UAE02" &&
            {
                title: 'Gross Salary',
                dataIndex: 'grossSalary',
                sorter: false,
                align: 'center',
                width: 100,
                key: '8',

            },

            {
                title: 'Over Time ',
                dataIndex: 'ot',
                sorter: false,
                align: 'center',
                width: 100,
                key: '9',
            },
            {
                title: 'Earnings',
                dataIndex: 'earningAmount',
                sorter: false,
                align: 'center',
                width: 100,
                key: '10',
                className: 'earnigs-column',
            },
            {
                title: 'Deduction',
                dataIndex: 'deductionAmount',
                sorter: false,
                align: 'center',
                width: 100,
                key: '11',
                className: 'deduction-column',
            },
            {
                title: 'Net Salary',
                dataIndex: 'netSalary',
                sorter: false,
                align: 'center',
                width: 100,
                key: '12',
                render: (text, record) => {
                    return <span style={{ fontSize: '13px' }}> <b> {record.netSalary}</b></span>
                }
            },
            {
                title: 'Payroll Status',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                width: 120,
                key: '13',
                render: (text, record) => {
                    return <><div >{getStyle(text)}</div>
                    </>
                }
            },
            isCustomFieldEnabled === true && {
                title: 'Entity Name',
                dataIndex: 'entityName',
                sorter: false,
                align: 'center',
                width: 100,
                key: '14',
            },
            isCustomFieldEnabled === true && {
                title: 'Visa Entity',
                dataIndex: 'visaEntity',
                sorter: false,
                align: 'center',
                width: 100,
                key: '15',
            },
            isCustomFieldEnabled === true && {
                title: 'BU-CC',
                dataIndex: 'buCc',
                sorter: false,
                align: 'center',
                width: 100,
                key: '16',
            },
            {
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
                align: 'center',
                width: 100,
                key: '17',
                render: (text, record) => {

                    return <>

                        <div className="menuIconDiv">
                            {/* <i onClick={() => {
                                this.setState({ payslip: record, showPayslip: true })
                            }} className="menuIconFa fa fa-eye" aria-hidden="true"></i> */}
                            <PayrollTableDropDown menuItems={menuItems(text, record)} />
                        </div>
                    </>
                }
            }
        ].filter(Boolean);

    }
    onTableDataChange = (d, filter, sorter) => {
        this.setState({
            page: d.current - 1,
            size: d.pageSize,
            sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
        }, () => {
            this.fetchList();
        })
    }
    updateList = (payslip) => {
        let { data } = this.state;
        let index = data.findIndex(d => d.id == payslip.id);
        if (index > -1)
            data[index] = payslip;
        else {
            data.push(payslip);
        }
        this.setState({ data },
            () => {
                this.hideStatusForm();
            });
    }
    pageSizeChange = (currentPage, pageSize) => {
        this.setState({
            size: pageSize,
            page: 0
        }, () => {
            this.fetchList();

        })

    }
    hideStatusForm = () => {
        this.setState({
            showStatusForm: false,
            payslip: undefined
        })
    }
    hidePayslip = () => {
        this.setState({
            showPayslip: false,
            payslip: undefined
        })
    }
    hideProf = () => {
        this.setState({
            showEmployeeProf: false,
        })
    }
    delete = (payslip) => {
        confirmAlert({
            title: `Delete Payslip for ${payslip.employee.name}`,
            message: 'Are you sure, you want to delete this payslip?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deletePayslip(payslip.id).then(res => {
                        if (res.status == "OK") {
                            toast.success(res.message);
                            this.fetchList();
                        } else {
                            toast.error(res.message)
                        }
                    })
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }
    save = (payslip) => {
        this.updateStatus([payslip.id], payslip.status);
    }

    handleCurrency = (id) => {
        if(id != ""){
            let data = this.state.CountryList.find(obj => obj.id == id);
            
            this.setState({defaultCurrencyId : data.id,defaultCurrency: data.countryCode,defaultCurrencyCode: data.currencyCode,defaultCurrencyName: data.currencyName}, () => {
                this.fetchList()
            })
        }else{
            this.setState({defaultCurrencyId : 0,defaultCurrency: "",defaultCurrencyCode: "",defaultCurrencyName: ""}, () => {
                this.fetchList()
            })
        }
        
                   
       
}

    updateStatus = (selected, status) => {
        updatePayslipStatus(selected, status).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
              this.hideStatusForm();
                this.fetchList();
            } else {
                toast.error(res.message);
            }
        })
    }


    updateAll = (status) => {
        let salaryMonth = this.getSalaryMonth();
        confirmAlert({
            title: `Update Status for all as ${status}`,
            message: 'Are you sure, you want to update status for all?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => updateAllPayslipStatus(salaryMonth, status,this.state.branchId,this.state.defaultCurrencyId).then(res => {
                        if (res.status == "OK") {
                            toast.success(res.message);
                            this.fetchList();
                        } else {
                            toast.error(res.message)
                        }
                    })
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }
    updateSelected = (status) => {
        const { selected } = this.state;

        confirmAlert({
            title: `Update Status for selected as ${status}`,
            message: 'Are you sure, you want to update status for selected?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        this.updateStatus(selected, status);
                        this.setState({ selected: [] })
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }


    handleCheckboxChange = (checkedList) => {
        this.setState({ checkedList });
    };
    handleMouseClick = () => {
        this.setState({ isHovered: !this.state.isHovered });
    };

    handleShowChart = () => {
        this.setState({ showChart: !this.state.showChart })
    }

    handleSalaryComparison = (e) => {
        const type = e.target.value

          // get organization salary and net pay
          getOrganizationSalary(this.getSalaryMonth(),this.state.defaultCurrencyId,this.state.branchId,type,this.state.entityId).then(res => {
            if (res.status == "OK") {
        

                // toast.success(res.message);
                this.setState({organizationSalaryInfo : res.data},() => this.getLastSixMonths())
            } else {
                this.setState({organizationSalaryInfo : []}, () => this.getLastSixMonths() )
                // toast.error(res.message);
            }
        }
        )
        
    }

    handleMouseLeave = () => {
        this.setState({ isHovered: false });
    };
    calculatePercentageChange = (previousTotalSalary, totalSalary) => {
        const change = totalSalary - previousTotalSalary;
        if(change == 0){
            return 0.0
        }
        const percentageChange = (change / previousTotalSalary) * 100;
        if(percentageChange == Infinity){
            return 100
        }
        return percentageChange;
    };
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            let { selected } = this.state;
            const rowsId = selectedRows.map(item => item.id)
            this.setState({ selected: rowsId });
        },
    };
    months = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];
    years = [
        2019, 2020, 2021, 2022, 2023, 2024, 2025
    ];


    handleMonthPicker = (date, dateString) => {
        if (date) {
            const selectedMonth = date.month() + 1;
            const selectedYear = date.year();
            this.setState({ month: selectedMonth, year: selectedYear }, () => { this.fetchList() });
        }
    };


    render() {
        const { showChart, checkedList, isHovered,previousMonthdashboardInfoData,dashboardInfoData } = this.state;
        const { data, totalPages, totalRecords, currentPage, size, payslip, selected, closeMonths, monthlyData, isDownArrow } = this.state

        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
       
        const salaryPercentage = this.calculatePercentageChange(previousMonthdashboardInfoData?.grossSalary != null?Number(previousMonthdashboardInfoData?.grossSalary):0, dashboardInfoData?.grossSalary != null?Number(dashboardInfoData?.grossSalary):0);
        const employeeCount = Number(dashboardInfoData?.employeesCount) - Number(previousMonthdashboardInfoData?.employeesCount);
        const employeeCountIcon = employeeCount >= 0 ? <i class="fa fa-plus" aria-hidden="true"></i> : <i class="fa fa-minus" aria-hidden="true"></i>;
        let totalNetPay = this.calculatePercentageChange(previousMonthdashboardInfoData?.netPay != null?Number(previousMonthdashboardInfoData?.netPay):0, dashboardInfoData?.netPay != null?Number(dashboardInfoData?.netPay):0);
        let totalDeductionPay = this.calculatePercentageChange(previousMonthdashboardInfoData?.deduction != null?Number(previousMonthdashboardInfoData?.deduction):0, dashboardInfoData?.deduction != null?Number(dashboardInfoData?.deduction):0);
        const columns = this.getColumns();
        console.log("cell emp ---data", employeeCount)
        const checkedOptions = columns.map(({ key, title }) => ({
            label: title,
            value: key,
        }));
        const newColumns = columns.filter(column => checkedList.includes(column.key));

        // const yearlyData = [
        //     {
        //         "name": "Jul",
        //         "Salary": 10000,
        //     },
        //     {
        //         "name": "Aug",
        //         "Salary": 15000,
        //     },
        //     {
        //         "name": "Sep",
        //         "Salary": 16000,
        //     },
        //     {
        //         "name": "Oct",
        //         "Salary": 13908,
        //     },
        //     {
        //         "name": "Nov",
        //         "Salary": 14800,
        //     },
        //     {
        //         "name": "Dec",
        //         "Salary": 25800,
        //     },

        // ]

        return (
            <div >
                <Helmet>
                    <title>Payroll | {getTitle()}</title>
                </Helmet>

                <div style={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '10px' }} className="tab-content">

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <div className='pl-0 col-md-5'> <DatePicker onChange={this.handleMonthPicker} defaultValue={moment()} format={'MMMM-YYYY'} className='form-control' picker="month" disabledDate={(current) => current && current > moment().endOf('month')} /></div>
                        </Grid>
                        <Grid item xs={6}>
                            <div className='d-flex'>
                               
                               {/* entity css validation */}
                               {!this.state.orgsetup && <div className='col-md-4'></div>}
                                <div className='col-md-4'>
                                <div  className="currency-select-box">
                                                            {this.state.defaultCurrency != '' &&  <img src={`https://flagcdn.com/w320/${this.state.defaultCurrency.toLowerCase()}.png`} alt="Currency Flag" />}
                                                                <select
                                                                    onChange={(e) =>  this.handleCurrency(e.target.value)}
                                                              
                                                                    name="currency"
                                                                    className="form-control"
                                                                    value={this.state.defaultCurrencyId}
                                                                >
                                                                    <option value=""> Select Currency</option>
                                                                    {this.state.CountryList.length && this.state.CountryList.map((cur, index) => (
                                                                        <option value={cur.id} key={index}> {(cur.currencyName).split("-")[0] + " - " + cur.currencyCode}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            </div>
                                {/* entity */}
                               {this.state.orgsetup && <div className='col-md-4'>
                                    <EntityDropdown  onChange={e => {
                                        this.setState({
                                            entityId: e.target.value == ""?0:e.target.value
                                        }, () => {this.fetchList()})

                                    }}></EntityDropdown>
                                </div>}
                                
                                <div className='pr-0 col-md-4'>
                                    <BranchDropdown defaultValue={this.state.branchId} onChange={e => {
                                        this.setState({
                                            branchId: e.target.value == ""?0:e.target.value
                                        }, () => {  this.fetchList()})
                                    }}></BranchDropdown>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                    <div>
                        <Box sx={{ width: 'calc(96% + 50px)', marginTop: '2em', flexGrow: 1 }}>
                            <Grid
                                container
                                spacing={{ xs: 2, md: 3 }}
                                columns={{ xs: 4, sm: 8, md: 12 }}
                            >
                                <Grid item xs={2} sm={3} md={3}>
                                    <Item sx={{ boxShadow: '0px 0px 3px 1px #e3d6d6', borderRadius: '6px' }}>
                                        <div style={{ textAlignLast: 'left' }} >
                                            <div style={{ placeContent: 'space-between' }} className='mb-2 d-flex'>
                                                <div>
                                                    <span className="payroll-widget-icon"><TbChartHistogram /></span>
                                                </div>

                                                <div className={salaryPercentage < 0 ? 'trandingIconDownStyle' : 'trandingIconStyle'}>
                                                    {salaryPercentage < 0 ? <IoMdTrendingDown /> : <IoMdTrendingUp />}
                                                    <span>{Math.abs(salaryPercentage).toFixed(2)}%</span>
                                                </div>

                                            </div>

                                            <div style={{}}>
                                                <span>Total Gross Salary</span>
                                                <h4 className='text-dark mb-0'>{this.state.defaultCurrencyName != ""?this.state.defaultCurrencyName.split('-')[0]:""} {this.state.dashboardInfoData == "" || this.state.dashboardInfoData == null || this.state.dashboardInfoData?.grossSalary == null ? 0 : Math.abs(this.state.dashboardInfoData?.grossSalary).toFixed(2)}</h4>

                                            </div>
                                        </div>
                                    </Item>
                                </Grid>
                                <Grid item xs={2} sm={3} md={3}>
                                    <Item sx={{ boxShadow: '0px 0px 3px 1px #e3d6d6', borderRadius: '6px' }}>
                                        <div style={{ textAlignLast: 'left' }} >
                                            <div style={{ placeContent: 'space-between' }} className='mb-2 d-flex'>
                                                <div>
                                                    <span className="payroll-widget-icon"><CiPercent /></span>
                                                </div>

                                                {/* <div className='trandingIconStyle'>
                                                    <IoMdTrendingUp />
                                                    <span>{Math.abs(totalNetPay).toFixed(2)}%</span>
                                                </div> */}
                                                <div className={totalNetPay < 0 ? 'trandingIconDownStyle' : 'trandingIconStyle'}>
                                                    {totalNetPay < 0 ? <IoMdTrendingDown /> : <IoMdTrendingUp />}
                                                    <span>{Math.abs(totalNetPay).toFixed(2)}%</span>
                                                </div>

                                            </div>
                                            <div style={{}}>
                                                <span>Total Net Pay</span>
                                                <h4 className='text-dark mb-0'>{this.state.defaultCurrencyName != ""?this.state.defaultCurrencyName.split('-')[0]:""} {this.state.dashboardInfoData == "" || this.state.dashboardInfoData == null || this.state.dashboardInfoData?.netPay == null ? 0 : Math.abs(this.state.dashboardInfoData?.netPay).toFixed(2)}</h4>

                                            </div>
                                        </div>
                                    </Item>
                                </Grid>
                                <Grid item xs={2} sm={3} md={3}>
                                    <Item sx={{ boxShadow: '0px 0px 3px 1px #e3d6d6', borderRadius: '6px' }}>
                                        <div style={{ textAlignLast: 'left' }} >
                                            <div style={{ placeContent: 'space-between' }} className='mb-2 d-flex'>
                                                <div>
                                                    <span className="payroll-widget-icon"><IoIosPeople /></span>
                                                </div>

                                                <div className={employeeCount < 0 ? 'trandingIconDownStyle' : 'trandingIconStyle'}>
                                                    
                                                    <span>{employeeCountIcon} {Math.abs(employeeCount)}</span>
                                                </div>

                                            </div>
                                            <div style={{}}>
                                                <span>Total Employees</span>
                                                <h4 className='text-dark mb-0'>{this.state.dashboardInfoData == "" || this.state.dashboardInfoData == null ||  this.state.dashboardInfoData?.employeesCount == null ? 0 : this.state.dashboardInfoData?.employeesCount}</h4>

                                            </div>
                                        </div>
                                    </Item>
                                </Grid>
                                <Grid item xs={2} sm={3} md={3}>
                                    <Item sx={{ boxShadow: '0px 0px 3px 1px #e3d6d6', borderRadius: '6px' }}>
                                        <div style={{ textAlignLast: 'left' }} >
                                            <div style={{ placeContent: 'space-between' }} className='mb-2 d-flex'>
                                                <div>
                                                    <span className="payroll-widget-icon"><TbChartPieFilled /></span>
                                                </div>

                                                {/* <div className='trandingIconStyle'>
                                                    <IoMdTrendingUp />
                                                    <span>{Math.abs(totalDeductionPay).toFixed(2)}%</span>
                                                </div> */}
                                                <div className={totalDeductionPay < 0 ? 'trandingIconDownStyle' : 'trandingIconStyle'}>
                                                    {totalDeductionPay < 0 ? <IoMdTrendingDown /> : <IoMdTrendingUp />}
                                                    <span>{Math.abs(totalDeductionPay).toFixed(2)}%</span>
                                                </div>

                                            </div>
                                            <div style={{}}>
                                                <span>Total Deduction</span>
                                                <h4 className='text-dark mb-0'>{this.state.defaultCurrencyName != ""?this.state.defaultCurrencyName.split('-')[0]:""} {this.state.dashboardInfoData == "" || this.state.dashboardInfoData == null || this.state.dashboardInfoData?.deduction == null ? 0 : Math.abs(this.state.dashboardInfoData?.deduction).toFixed(2)}</h4>

                                            </div>
                                        </div>
                                    </Item>
                                </Grid>
                            </Grid>
                        </Box>

                    </div>
                    <div className='comparisonChart' >
                        <div style={{ fontSize: '19px' }} >
                            <span>Comparison Dashboards</span>
                        </div>
                        <div >
                            <i onClick={this.handleShowChart} className={`comparisonIcon fa ${showChart ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'}`} aria-hidden="true"></i>

                        </div>
                        {showChart && <div style={{ borderTop: 'solid 1px #c9c9c9', marginTop: '14px', placeContent: 'space-between' }} className='d-flex'>

                            <div className='payrollTableGraph' >
                                <span style={{ float: 'left', fontWeight: '700' }}>Previous six months salary (Comparison)</span>
                                <select
                                     onChange={(e) => { this.handleSalaryComparison(e) }}
                                    className='rounded p-1 float-right'>
                                    <option value="0">Gross Salary</option>
                                    <option value="1">Net Pay</option>
                                </select>
                                <div style={{ marginTop: '55px' }}>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={this.state.monthlyComparison}
                                        >
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
                                    </ResponsiveContainer>
                                </div>
                            </div>


                          <div className='payrollTableGraph' >
                                <div style={{ textAlign: '-webkit-center' }} className=" mixed-chart">
                                {this.state.departmentBarInfo.length > 0  ?   <Chart options={this.state.options} series={this.state.series} type="donut" height={200} />:<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',height:'200px',fontSize: '100px' }} >N/A</div>}
                                </div>
                              {this.state.departmentBarInfo.length > 0  &&  <p className='font-weight-bold'>Total Salary: {this.state.total}</p>}
                            </div> 
                        </div>}
                    </div>


                    < div className='mt-4 Table-card' >
                        <div className="tableCard-body">
                            <div className="form-group p-12 m-0 pb-2">
                                <div style={{ borderBottom: '1px solid grey' }} className="row " >
                                    <div className="mt-3 col">
                                        <h3 className="page-titleText">Payroll Table</h3>
                                    </div>


                                    {(verifyViewPermission("Payroll Payslip") || verifyApprovalPermission("Payroll Run Payroll")) && <div className='col-md-auto'  >


                                        {verifyApprovalPermission("Payroll Run Payroll") &&  <ButtonGroup className='mt-3 pull-right my-3'>
                                           

                                            <div className="pay-drop" >
                                                <EmployeeDropdown nodefault={false} permission="ORGANIZATION" onChange={e => {
                                                    // this.getListByEmployee(e.target.value)
                                                    this.setState({employeeId:e.target.value == ""?0:e.target.value},() =>  this.fetchList())
                                                }}></EmployeeDropdown>
                                            </div>
                                         {data && data.length > 0 &&   <div className="" >
                                                <button
                                                    disabled={!data || data.length == 0}
                                                    className='markAll-btn btn-sm btn-outline-success'
                                                    onClick={() => {
                                                        this.updateAll('PAID');
                                                    }}>Sent to All</button>
                                                <button
                                                    disabled={!data || data.length == 0}
                                                    className='markAll-btn-rejected btn-sm btn-outline-danger'
                                                    onClick={() => {
                                                        this.updateAll('UNPAID');
                                                    }}>Unsent to All</button>
                                                <button
                                                   disabled={!selected || selected.length == 0}
                                                    className='markAll-btn btn-sm btn-outline-secondary mr-3'
                                                    onClick={() => {
                                                        this.updateSelected('PAID');
                                                    }}>Sent As Selected</button>
                                                <button
                                                    disabled={!selected || selected.length == 0}
                                                    className='markAll-btn-rejected btn-sm btn-outline-secondary'
                                                    onClick={() => {
                                                        this.updateSelected('UNPAID');
                                                    }}>Unsent As Selected</button>
                                            </div> }
                                         {data && data.length > 0 &&   <div className=''>
                                                <div onClick={this.handleMouseClick}
                                                    className='columnIcon'>
                                                    <HiOutlineViewColumns size={25} />
                                                </div>

                                                {isHovered && <div onMouseLeave={this.handleMouseLeave} className='tableColHide'>
                                                    <Checkbox.Group
                                                        options={checkedOptions}
                                                        value={checkedList}
                                                        onChange={this.handleCheckboxChange}
                                                    />
                                                </div>}

                                            </div>}
                                        </ButtonGroup>}



                                    </div>}

                                </div>
                            </div>
                            <div className="table-responsive mt-2">
                                {(verifyViewPermission("Payroll Payslip") || verifyApprovalPermission("Payroll Run Payroll")) &&
                                    <div className="table-responsive">
                                        <Table id='Table-style' className="table-striped "
                                            rowSelection={this.rowSelection}
                                            pagination={{
                                                total: totalRecords,
                                                showTotal: (total, range) => {
                                                    return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                                                },
                                                showSizeChanger: true, onShowSizeChange: this.pageSizeChange,
                                                itemRender: itemRender,
                                                pageSizeOptions: [10, 20, 50, 100],
                                                current: currentPage,
                                                defaultCurrent: 1,
                                            }}
                                            columns={newColumns}
                                            dataSource={data}
                                            rowKey={record => record.id}
                                            onChange={this.onTableDataChange}
                                            scroll={{ x: 1500, y: 350 }}

                                        />
                                    </div>}
                                {!verifyViewPermission("Payroll Payslip") && !verifyApprovalPermission("Payroll Run Payroll") && <AccessDenied></AccessDenied>}
                            </div>
                        </div>
                    </div>










                </div >
                <Modal enforceFocus={false} size={"md"} show={this.state.showStatusForm} onHide={this.hideStatusForm} >


                    <Header closeButton>
                        <h5 className="modal-title">Update Status</h5>

                    </Header>
                    <Body>
                        {payslip && <Formik
                            enableReinitialize={true}
                            initialValues={payslip}
                            onSubmit={this.save}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                                setFieldValue,
                                setSubmitting
                                /* and other goodies */
                            }) => (
                                <Form>
                                    <label>Employee: {payslip.employee.name}</label>
                                    <br />
                                    <label>Salary Month: {payslip.salaryMonth}</label>
                                    <br />
                                    <FormGroup>
                                        <label>Status
                                            <span style={{ color: "red" }}>*</span>
                                        </label>

                                        <select
                                            className="form-control"
                                            name="status"
                                            onChange={(e) => {
                                                setFieldValue("status", e.target.value);
                                            }} defaultValue={values.status}>
                                            <option value="PAID">Paid</option>
                                            <option value="UNPAID">Unpaid</option>
                                        </select>
                                    </FormGroup>

                                    <input type="submit" className="mt-3 btn btn-primary" value={"Update Status"} />

                                </Form>
                            )
                            }
                        </Formik>}
                    </Body>
                </Modal>

                <Modal enforceFocus={false} size={"lg"} show={this.state.showPayslip} onHide={this.hidePayslip} >
                    <Header closeButton>
                        <h5 className="modal-title">Payslip</h5>
                    </Header>

                    <Body>
                        {payslip && (getPayrollType() === "UAE02" ?
                            <PayslipUAE02Viewer payslip={payslip} /> : <PayslipViewer payslip={payslip} orgsetup={this.state.orgsetup} />)
                        }

                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"xl"} show={this.state.showEmployeeProf} onHide={this.hideProf} >
                    <Header closeButton>
                        <h5 className="modal-title">Employee Profile</h5>
                    </Header>

                    <Body>

                        <EmployeePayrollProfile payrollData={this.state.payrollData}></EmployeePayrollProfile>
                    </Body>
                </Modal>
            </div >
        )
    }
}