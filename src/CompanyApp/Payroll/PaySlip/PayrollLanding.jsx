import { Checkbox, Table } from 'antd';
import { Form, Formik } from 'formik';
import React, { Component } from 'react';
import { ButtonGroup, Col, FormGroup, Modal, Row, Anchor } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Switch, TextField, Tooltip } from '@mui/material';
import { VscChecklist, VscCheck } from "react-icons/vsc";
import { MdRemoveDone, MdTableView, MdPlaylistRemove, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { TbListSearch } from "react-icons/tb";
import { FaSearch, FaWindowClose } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { downloadPayslipCsv, downloadPayslipSif } from '../../../HttpRequest';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { itemRender } from '../../../paginationfunction';
import { getTitle, getUserType, verifyViewPermission, verifyApprovalPermission, getSyncPeoplehumCustomField, getPayrollType, getReadableMonthYear } from '../../../utility';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import { closePayrollMonth, deletePayslip, generatePayslips, getPayrollCloseMonths, getPayslips, updateAllPayslipStatus, updatePayslipStatus, getMonthlyData } from './service';
import PayslipViewer from './view';
import { BsSliders } from 'react-icons/bs';
import TableDropDown from '../../../MainPage/tableDropDown';
import PayslipUAE02Viewer from './uae02view';
import { HiOutlineViewColumns } from "react-icons/hi2";
import MyPayslipCard from '../empPaySlip';
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import PayrollTable from './payrollTable';
import { getRegularizationCount } from '../../Employee/regularization/service';
import EntityDropdown from '../../ModuleSetup/Dropdown/EntityDropdown'; 
import { getOrgSettings } from '../../ModuleSetup/OrgSetup/service';



const { Header, Body, Footer, Dialog } = Modal;

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';


const Months = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
}

export default class PayrollLanding extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
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
            isDownArrow: false,
            checkedList: this.getColumns().map((item) => item.key),
            isHovered: false,
            branchId: '',
            isChecked: false,
            regularizationValidation: false,
            entityId: 0,
            orgsetup: "",
            entityValidationMonth: ""
        };
    }
    componentDidMount() {
        this.fetchList();
        getOrgSettings().then(res => {
                if (res.status == "OK") {
                this.setState({ orgsetup: res.data })
                }
            })
    }
    fetchList = () => {
        let salaryMonth = this.getSalaryMonth();
        (verifyViewPermission("Payroll Payslip") || verifyApprovalPermission("Payroll Run Payroll")) && getPayslips(salaryMonth, this.state.q, this.state.page, this.state.size, this.state.sort,0,0,0,0).then(res => {
            if (res.status == "OK") {
                this.fetchMonthlyData();
                let processedData;
                if(getPayrollType() === "NORMAL" || getPayrollType() === "UAE"){
                    processedData = res.data.list.map(record => {
                        return {
                            ...record,
                            payslipItems: record.payslipItems.filter(item => item.title.trim() !== "Gross Salary")
                        };
                    });
                }else{
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
        // this.fetchMonthlyData();
    }
    fetchMonthlyData = () => {
        let salaryMonth = this.getSalaryMonth();
        (verifyViewPermission("Payroll Payslip")) && getMonthlyData(salaryMonth, this.state.q).then(res => {
            // this.fetchMonthlyData();
            if (res.status == "OK") {
                this.setState({
                    monthlyData: res.data
                })
            }
        })
    }
    // regularization get
    getRegularizationData = () => {
        let { generateMonth, generateYear } = this.state;
        let monthString = `${generateYear}-${generateMonth}`;
      
        getRegularizationCount(monthString).then(response => {
            if(response.status == "OK"){
              if(response.data > 0){
                this.setState({regularizationValidation: true})
                this.regularizationPopupMessage()
              }else{
                this.generate();
             
              }
              
          }else{
            this.generate();
            
          }
          })

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

    // regularization popup message
    regularizationPopupMessage = () => {
        if (this.state.regularizationValidation) {
          confirmAlert({
            title: `Attendance regularization is not regularized `,
            message: 'Are you sure, you want to run the payroll?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {this.generate()
                    return null
                }
                
              },
              {
                label: 'No',
                onClick: () => { }





              }
            ]
          });
        }
      }

    getColumns = () => {
        
        const getStyle = (text) => {
            if (text === 'PAID') {
                return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>SENT</span>;
            }
            if (text === 'UNPAID') {
                return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>UNSENT</span>;
            }
            return 'null';
        }

        const isCustomFieldEnabled = getSyncPeoplehumCustomField();

        return [
            {
                title: 'Employee',
                sorter: false,
                width: 220,
                hidden: true,
                fixed: 'left',
                key: '1',
                render: (text) => {
                    return <EmployeeListColumn id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
                }
            },
            {
                title: 'Department',
                dataIndex: 'department',
                sorter: false,
                hidden: true,
                width: 150,
                key: '2',
            },
            {
                title: 'Payroll Month',
                sorter: false,
                align: 'center',
                width: 120,
                key: '3',
                render: (text) => {
                    return <span>{getReadableMonthYear(text.salaryMonth)}<br /></span>
                }
            }, {
                title: 'Total Days',
                dataIndex: 'totalDays',
                sorter: false,
                align: 'center',
                width: 100,
                key: '4',
            },
            {
                title: 'Present Days',
                dataIndex: 'payableDays',
                sorter: false,
                align: 'center',
                width: 120,
                key: '5',
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
                render: (text) => {
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
                key: '10',
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
                    return <span> <b> {record.netSalary}</b></span>
                }
            },
            {
                title: 'Status',
                dataIndex: 'status',
                align: 'center',
                width: 100,
                key: '13',
                render: (text) => {
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
                align: 'center',
                width: 100,
                key: '17',
                render: (text, record) => {

                    // return <>
                    //     <Row md={4}>
                    //         <Col className='mt-2' >
                    //             {verifyApprovalPermission("Payroll Run Payroll") && <input
                    //                 type="checkbox"
                    //                 checked={selected && selected.length > 0 && selected.indexOf(record.id) > -1}
                    //                 className="pointer"
                    //                 onClick={e => {
                    //                     this.onSelect(record);
                    //                 }}></input>}
                    //         </Col>
                    //         <Col >
                    //             <div className="">
                    //                 <TableDropDown menuItems={menuItems(text, record)} />
                    //             </div>
                    //         </Col>
                    //     </Row>

                    // </>

                     return <>
                    
                                            <div className="menuIconDiv">
                                                <i onClick={() => {
                                                    this.setState({ payslip: record, showPayslip: true })
                                                }} className="menuIconFa fa fa-eye" aria-hidden="true"></i>
                                                {/* <PayrollTableDropDown menuItems={menuItems(text, record)} /> */}
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

    updateStatus = (selected, status) => {
        updatePayslipStatus(selected, status).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.fetchList();
            } else {
                toast.error(res.message);
            }
        })
    }


    onSelect = (data) => {
        let { selected } = this.state;
        let index = selected.indexOf(data.id);
        if (index > -1) {
            selected.splice(index, 1);
        } else {
            selected.push(data.id);
        }
        this.setState({ selected });
    }
    updateAll = (status) => {
        let salaryMonth = this.getSalaryMonth();
        confirmAlert({
            title: `Update Status for all as ${status}`,
            message: 'Are you sure, you want to update status for all?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => updateAllPayslipStatus(salaryMonth, status,0,0).then(res => {
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
    getCloseMonths = (closeYear) => {
        if (!closeYear || closeYear.length == 0) {
            this.setState({
                closeYear: undefined,
                closeMonths: undefined
            })
            return;
        }

        getPayrollCloseMonths(closeYear).then(res => {
            
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            this.setState({
                closeYear,
                closeMonths: res.data
            })
        })

    }
    closePayroll = (month) => {
        const { closeYear } = this.state;
        month = month.toString().length == 1 ? "0" + month : month;
        let monthYear = `${closeYear}-${month}`;
        closePayrollMonth(monthYear).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            this.getCloseMonths(closeYear);
        })
    }
    handleCheckboxChange = (checkedList) => {
        this.setState({ checkedList });
    };
    handleMouseClick = () => {
        this.setState({ isHovered: !this.state.isHovered });
    };

    handleChange = () => {
        this.setState({ isChecked: !this.state.isChecked });
    };

    handleMouseLeave = () => {
        this.setState({ isHovered: false });
    };
   
    months =   [
        { name: 'January',month:'1', value: false },
        { name: 'February',month:'2', value: false },
        { name: 'March',month:'3', value: false },
        { name: 'April',month:'4', value: false },
        { name: 'May',month:'5', value: false },
        { name: 'June',month:'6', value: false },
        { name: 'July',month:'7', value: false },
        { name: 'August',month:'8', value: false },
        { name: 'September',month:'9', value: false },
        { name: 'October',month:'10', value: false },
        { name: 'November',month:'11', value: false },
        { name: 'December',month:'12', value: false }
    ];
    years = [
        2019, 2020, 2021, 2022, 2023, 2024, 2025
    ];

    // close payroll popup message
    closePayrollPopupMessage = (month) => { 
          confirmAlert({
            title: `Close Payroll?`,
            message: 'Are you sure, you want to close the payroll?',
            buttons: [
              {
                label: 'Yes',
                className: "btn btn-success",
                onClick: () => {this.closePayroll(month)
                    return null
                }
                
              },
              {
                label: 'No',
                className: "btn btn-danger",
                onClick: () => { }
              }
            ]
          }); 
      }
    render() {
        const { checkedList, isChecked, isHovered,orgsetup } = this.state;
        const { data, totalPages, totalRecords, currentPage, size, payslip, selected, closeMonths, monthlyData } = this.state
        const payrollTypes = closeMonths && closeMonths.map((p) => p.payrollType);
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const salaryDiff = monthlyData?.previousTotalSalary < 0 || monthlyData?.totalSalary < 0 ? monthlyData == "" ? 0 : (monthlyData?.totalSalary + monthlyData?.previousTotalSalary).toFixed(2) : monthlyData == "" ? 0 : (monthlyData?.totalSalary - monthlyData?.previousTotalSalary).toFixed(2)

        const employeeCountDiff = monthlyData == "" ? 0 : monthlyData?.count - monthlyData?.previousCount
        const closeYearMonth = closeMonths && closeMonths.map((c) => c.salaryMonth);
        const columns = this.getColumns();

        const options = columns.map(({ key, title }) => ({
            label: title,
            value: key,
        }));
        const newColumns = columns.map((item) => ({
            ...item,
            hidden: !checkedList.includes(item.key),
        }));



        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Payroll | {getTitle()}</title>
                </Helmet>

                <div className="mt-4 content container-fluid">
                    <div className="tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Salary Process</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                           {isChecked && <li className="nav-item"><a href="#myPay" data-toggle="tab" className="nav-link">My Pay</a></li>}
                                            { verifyApprovalPermission("Payroll Run Payroll")  && <li className="nav-item"><a href="#payslips" data-toggle="tab" className="nav-link active">Payroll Table</a></li>}
                                            {verifyApprovalPermission("Payroll Run Payroll") && <li className="nav-item"><a href="#generate" data-toggle="tab" className="nav-link">Run Payroll</a></li>}


                                        </ul>
                                    </div>
                                </div>
                                <div className='tempBtn' >
                                <span  onClick={this.handleChange}>New</span>
                               
                            </div>
                            </div>

                        </div>
                        <div id="myPay" className="pro-overview ant-table-background tab-pane fade ">
                            <MyPayslipCard></MyPayslipCard>
                        </div>
                        <div id="payslips" className="pro-overview ant-table-background tab-pane fade show active">
                            
                            {isChecked  && verifyApprovalPermission("Payroll Run Payroll") ?
                                <PayrollTable></PayrollTable> :
                                <>
                                    <div style={{ textAlign: 'right',paddingRight: '40px', paddingTop: '10px' }} >

                                        <Tooltip title="Search"

                                            componentsProps={{
                                                tooltip: {
                                                    sx: {
                                                        fontSize: '15px',
                                                        bgcolor: 'common.black',
                                                        '& .MuiTooltip-arrow': {
                                                            color: 'common.black',
                                                        },
                                                    },
                                                },
                                            }} placement="top-start">
                                            <Button onClick={() => {
                                                this.setState({
                                                    showSearch: !this.state.showSearch
                                                })
                                            }} sx={{ textTransform: 'none' }} size="small" variant="contained" color="success" >
                                                <TbListSearch className='filter-btn' size={30} />
                                            </Button>
                                        </Tooltip>
                                    </div>


                                    {
                                        this.state.showSearch && <div style={{ margin: '34px' }} className='mt-2 filterCard p-3'>
                                            <div className="row">
                                              
                                                <div className="col-md-3">
                                                    <select
                                                        onChange={(e) => {
                                                            
                                                            this.setState({ month: e.target.value })
                                                        }}
                                                        
                                                        defaultValue={this.state.month == '01'?1:this.state.month == '02'?2:this.state.month == '03'?3:this.state.month == '04'?4:this.state.month == '05'?5:this.state.month == '06'?6:this.state.month == '07'?7:this.state.month == '08'?8:this.state.month == '09'?9:this.state.month}
                                                        className="form-control"
                                                    >
                                                        <option value="">Select Month</option>
                                                        {this.months.map((month, index) => (
                                                            <option value={index + 1} key={index}>{month.name}</option>
                                                        ))}

                                                    </select>

                                                </div>
                                                <div className="col-md-3">
                                                    <select
                                                        onChange={(e) => { this.setState({ year: e.target.value }) }}
                                                         defaultValue={this.state.year}
                                                        className="form-control"
                                                    >

                                                        <option value="">Select Year</option>
                                                        {this.years.map((year) => (
                                                            <option value={year} >{year}</option>
                                                        ))}

                                                    </select>

                                                </div>
                                              
                                                <div className="mt-2 ml-5 col-md-3">

                                                    <Button sx={{ textTransform: 'none', width: '15em' }} size="small" onClick={() => { this.fetchList() }}
                                                        variant="contained" color="success" > Search</Button>
                                                </div>

                                            </div>


                                        </div>
                                    }


                                    {isCompanyAdmin && <div style={{
                                        marginTop: '25px',
                                        width: '60%',
                                        paddingLeft: '40px',

                                    }} md={6}>
                                        {(verifyViewPermission("Payroll Payslip") || verifyApprovalPermission("Payroll Run Payroll")) &&

                                            <div style={{ display: 'flex' }} className='m-0  payrollView'>
                                                <div className="col-md-6 ">
                                                    <div className="p-3  payroll_dash_widget">
                                                        <p className='payrollCardTittle'>Employee Count</p>
                                                        <div className="card-body">
                                                            <span className="payroll_icon"><i className="fa fa-user" /></span>
                                                            <div className="">
                                                                <h3>{monthlyData == "" ? 0 : monthlyData?.count}</h3>
                                                                <span><span className={employeeCountDiff > 0 ? 'payrollCountPve' : ' payrollCountNve'}>
                                                                    <i className={employeeCountDiff > 0 ? 'fa fa-arrow-circle-up' : ' fa fa-arrow-circle-down'} aria-hidden="true"></i></span>
                                                                    <b>{Math.abs(employeeCountDiff)}</b> vs Last month</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-6 ">
                                                    <div className="p-3  payroll_dash_widget">
                                                        <p className='payrollCardTittle'>Payroll Cost(Gross Salary)</p>
                                                        <div className="card-body">
                                                            <span className="payroll_icon"><i className="fa fa-money" ></i></span>
                                                            <div className="">
                                                                <h3>{monthlyData == "" ? 0 : monthlyData?.totalSalary}</h3>
                                                                <span><span className={salaryDiff < 0 ? 'payrollCountNve ' : ' payrollCountPve'}>
                                                                    <i className={salaryDiff < 0 ? 'fa fa-arrow-circle-down' : 'fa fa-arrow-circle-up'} aria-hidden="true"></i></span>
                                                                    <b>{Math.abs(salaryDiff)}</b> vs Last month</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        }

                                    </div>}

                                    {/* Page Content */}
                                    < div className="pr-3 pl-3 content container-fluid" >
                                        {/* Page Header */}
                                        < div id='page-head' >
                                            <div className="float-right col-md-5 btn-group btn-group-sm">

                                            </div>

                                            < div className='mt-0 Table-card' >
                                                <div className="tableCard-body">
                                                    <div className="form-group p-12 m-0 pb-2">
                                                        <div className="row " >
                                                            <div className="mt-3 col">
                                                                <h3 className="page-titleText">Payroll Table</h3>
                                                            </div>


                                                            {(verifyViewPermission("Payroll Payslip") || verifyApprovalPermission("Payroll Run Payroll")) && <div className='col-md-auto'  >


                                                                {verifyApprovalPermission("Payroll Run Payroll") && data && data.length > 0 && <ButtonGroup className='mt-3 pull-right my-3'>
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
                                                                    <div className=''>
                                                                        <div onClick={this.handleMouseClick}
                                                                            className='columnIcon'>
                                                                            <HiOutlineViewColumns size={25} />
                                                                        </div>

                                                                        {isHovered && <div onMouseLeave={this.handleMouseLeave} className='tableColHide'>
                                                                            <Checkbox.Group
                                                                                value={checkedList}
                                                                                options={options}
                                                                                onChange={this.handleCheckboxChange}
                                                                            />
                                                                        </div>}

                                                                    </div>
                                                                </ButtonGroup>}



                                                            </div>}

                                                        </div>
                                                    </div>

                                                    {/* /Page Header */}
                                                    <div className="tableCard-container row">
                                                        <div className="col-md-12">
                                                            <div className="table-responsive">
                                                                {(verifyViewPermission("Payroll Payslip") || verifyApprovalPermission("Payroll Run Payroll")) && <div className="table-responsive">

                                                                    <Table id='Table-style' className="table-striped "
                                                                        pagination={{
                                                                            total: totalRecords,
                                                                            showTotal: () => {
                                                                                return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                                                                            },
                                                                            showSizeChanger: true, onShowSizeChange: this.pageSizeChange,
                                                                            itemRender: itemRender,
                                                                            pageSizeOptions: [10, 20, 50, 100],
                                                                            current: currentPage,
                                                                            defaultCurrent: 1,
                                                                        }}
                                                                        columns={newColumns.filter((column) => !column.hidden)}
                                                                        dataSource={data}
                                                                        rowKey={record => record.id}
                                                                        onChange={this.onTableDataChange}
                                                                        

                                                                    />
                                                                </div>}
                                                                {!verifyViewPermission("Payroll Payslip") && !verifyApprovalPermission("Payroll Run Payroll") && <AccessDenied></AccessDenied>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <ul hidden className="ant-pagination ant-table-pagination ant-table-pagination-right">
                                            <li className="ant-pagination-total-text">{`Showing ${startRange} to ${endRange} of ${totalRecords} entries`}</li>
                                            <li className={`ant-pagination-prev ${currentPage == 1 ? 'ant-pagination-disabled' : ''}`}>
                                                <a href="#" disabled={currentPage == 1} onClick={() => {
                                                    if (currentPage > 1) {
                                                        this.setState({
                                                            page: currentPage - 2
                                                        }, () => {
                                                            this.fetchList();
                                                        })
                                                    }
                                                }} tabIndex={-1}>Previous</a>
                                            </li>
                                            {Array.from(Array(totalPages).keys()).map((e, i) => {
                                                return <>
                                                    <li className={`ant-pagination-item ant-pagination-item-${i + 1} ${currentPage - 1 == i ? 'ant-pagination-item-active' : ''}`}>
                                                        <Anchor href="#" onClick={() => {
                                                            this.setState({
                                                                page: i
                                                            }, () => {
                                                                this.fetchList();
                                                            })
                                                        }
                                                        }>{i + 1}</Anchor>
                                                    </li>

                                                </>
                                            })}
                                            <li className={`ant-pagination-next ${currentPage == totalPages ? 'ant-pagination-disabled' : ''}`}>
                                                <a href="#" disabled={currentPage == totalPages} onClick={() => {
                                                    if (currentPage != totalPages) {
                                                        this.setState({
                                                            page: currentPage
                                                        }, () => {
                                                            this.fetchList();
                                                        })
                                                    }

                                                }}>Next</a>
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            }

                        </div>


                        {verifyApprovalPermission("Payroll Run Payroll") &&
                            <div id="generate" className="p-3 mt-4 pro-overview  tab-pane fade">
                                <div className='card'>
                                    <div className="card-body p-2">
                                        <div className="form-group p-0 m-0">
                                            <label>Run Payroll</label>
                                            <div className="row align-items-center">
                                                {/** Month dropdown */}
                                                <div className="col-sm-4 col-md-4">
                                                    <select className="form-control" defaultValue={this.state.generateMonth}
                                                        onChange={(e) => { this.setState({ generateMonth: e.target.value }) }}>
                                                        <option value="">Month</option>
                                                        <option value="01">January</option>
                                                        <option value="02">February</option>
                                                        <option value="03">March</option>
                                                        <option value="04">April</option>
                                                        <option value="05">May</option>
                                                        <option value="06">June</option>
                                                        <option value="07">July</option>
                                                        <option value="08">August</option>
                                                        <option value="09">September</option>
                                                        <option value="10">October</option>
                                                        <option value="11">November</option>
                                                        <option value="12">December</option>
                                                    </select>
                                                </div>
                                                {/** Year dropdown */}
                                                <div className="col-sm-4 col-md-4">
                                                    <select className="form-control" defaultValue={this.state.generateYear}
                                                        onChange={(e) => {
                                                            this.setState({ generateYear: e.target.value })
                                                        }}>
                                                        <option value="">Year</option>
                                                        {this.years.map((year) => (
                                                            <option value={year.toString()} >{year}</option>
                                                        ))}

                                                    </select>
                                                </div>
                                                <div className="col-sm-4 col-md-4">
                                                    <button className="btn btn-primary"
                                                        onClick={() => { this.getRegularizationData() }}>Run</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='card'>
                                    <div className="card-body p-2">
                                        <div className="form-group p-0 m-0">
                                            <label>Close Payroll</label>
                                            <div className="row">
                                                {/** Year dropdown */}
                                                <div className="col-sm-4 col-md-4 mb-5">
                                                    <select className="form-control" defaultValue={this.state.closeYear}
                                                        onChange={e => {
                                                            this.getCloseMonths(e.currentTarget.value)
                                                        }}>
                                                        <option value="">Year</option>
                                                        <option value="2019">2019</option>
                                                        <option value="2020">2020</option>
                                                        <option value="2021">2021</option>
                                                        <option value="2022">2022</option>
                                                        <option value="2023">2023</option>
                                                        <option value="2024">2024</option>
                                                        <option value="2025">2025</option>
                                                    </select>
                                                </div>
                                                {this.state.closeYear && <div className="col-sm-12 col-md-12">
                                                    <div className='table-responsive'>
                                                        <table className='table table-bordered'>
                                                            <thead>
                                                                <tr>
                                                                    <th>Month</th>
                                                                    <th>Status</th>
                                                                    {(payrollTypes.includes("UAE") || payrollTypes.includes("UAE02")) && <th>Download</th>}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {Object.keys(Months).sort((a, b) => parseInt(a) - parseInt(b)).map((m) => {
                                                                    const yearMonth = `${this.state.closeYear}-${m}`;
                                                                    const isClosed = closeYearMonth.indexOf(`${this.state.closeYear}-${m}`) > -1;
                                                                    const payrollType = payrollTypes.length > 0 && (payrollTypes.includes("UAE") || payrollTypes.includes("UAE02")) ? "UAE" : "";
                                                                    return (<tr>
                                                                        <td>{Months[m]}</td>
                                                                        <td>
                                                                            {!isClosed && (<Anchor className='badge bg-inverse-primary' onClick={() => {
                                                                                this.closePayrollPopupMessage(m)
                                                                            }}>Open</Anchor>)}
                                                                            {isClosed && <strong className='badge bg-inverse-success'>Close</strong>}
                                                                        </td>
                                                                        {(payrollType === "UAE" || payrollType === "UAE02") && isClosed &&  (orgsetup.entity == false) && (
                                                                            <td>
                                                                            <button className='btn btn-info mr-5' onClick={() => downloadPayslipSif(yearMonth,this.state.entityId)}>
                                                                                <i className="fa fa-download mr-2"></i>Download SIF File
                                                                            </button>
                                                                            <button className='btn btn-success' onClick={() => downloadPayslipCsv(yearMonth,this.state.entityId)}>
                                                                                <i className="fa fa-download mr-2"></i>Download CSV File
                                                                            </button>
                                                                            </td>
                                                                 
                                                                        )}
                                                                          {(payrollType === "UAE" || payrollType === "UAE02") && isClosed &&  (orgsetup.entity ) && (<td>
                                                                                
                                                                                <tr className="pedo">
                                                                                <td className='col-md-6'>
                                                                                <EntityDropdown defaultValue={this.state.entityValidationMonth == Months[m]?this.state.entityId:0} onChange={e => {
                                                                                    this.setState({
                                                                                        entityId: e.target.value,
                                                                                        entityValidationMonth: Months[m]
                                                                                    })  
                                                                                     
                                                                                }}></EntityDropdown></td>
                                                                                
                                                                                
                                                                                {(this.state.entityId > 0) && this.state.entityValidationMonth == Months[m] && <> <td className='col-md-3'> <button className='btn btn-info mr-5' onClick={() => downloadPayslipSif(yearMonth,this.state.entityId)}>
                                                                                    <i className="fa fa-download mr-2"></i>Download SIF File
                                                                                </button></td><td className='col-md-3'>
                                                                                <button className='btn btn-success' onClick={() => downloadPayslipCsv(yearMonth,this.state.entityId)}>
                                                                                    <i className="fa fa-download mr-2"></i>Download CSV File
                                                                                </button></td></>}
                                                                                </tr>
                                                                            </td>)}
                                                                    </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}





                    </div>
                </div>
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
                                setFieldValue,
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

                                    <input type="submit" className="btn btn-primary" value={"Update Status"} />

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
                            <PayslipUAE02Viewer payslip={payslip} /> : <PayslipViewer payslip={payslip} />)
                        }

                    </Body>
                </Modal>
            </div >
        )
    }
}