import { Table } from 'antd';
import { Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { itemRender } from "../../paginationfunction";
import AccessDenied from '../../MainPage/Main/Dashboard/AccessDenied';
import { FormControl, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { FaSearch, FaWindowClose } from "react-icons/fa";
import { TbListSearch } from "react-icons/tb";
import { Button, ButtonGroup, Col, FormGroup, Row } from 'react-bootstrap';
import { getList, save } from './service';
import { verifyOrgLevelViewPermission, verifyOrgLevelEditPermission } from '../../utility';
import EmployeeListColumn from '../Employee/employeeListColumn';
const { Header, Body, Footer, Dialog } = Modal;

export default class ManageWorkingDays extends Component {
    constructor(props) {
        super(props);
        this.state = {
            manageWokringDays :props.manageWokringDays||{
                id : "",
                daysWorked : "",
                salaryMonth: "",
                employeeId:"",
            },
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            showGenerate: false,
            showFilter: true,
            data: [],
            showSearch: true,
            month: new Date().toLocaleString('en-US', { month: '2-digit' }),
            year: new Date().getFullYear().toString(),
            selected:[],
        };
    }
    componentDidMount() {
    }

    fetchList = () => {
        let salaryMonth = this.getSalaryMonth();
        if (verifyOrgLevelViewPermission("Pay Manage Working days")) {
            getList(this.state.page,this.state.size,salaryMonth).then(res => {
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
    }
    saveFunction = () => {
        const { selected } = this.state;
        save(selected)
            .then(res => {
                if (res.status === "OK") {
                    toast.success(res.message);
                    this.setState({ selected: [] });
                    return this.fetchList();
                } else {
                    toast.error(res.message);
                    this.setState({ selected: [] });
                }
            })
            .catch(error => {
                console.error("Error saving data:", error);
            });
    };
    onTableDataChange = (d, filter, sorter) => {
        this.setState({
            page: d.current - 1,
            size: d.pageSize,
            sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
        }, () => {
            this.fetchList();
        })
    }
    pageSizeChange = (currentPage, pageSize) => {
        this.setState({
            size: pageSize,
            page: 0
        }, () => {
            this.fetchList();
        })
    }
    getSalaryMonth = () => {
        let { month, year } = this.state;
        month = month.toString().length == 1 ? "0" + month : month;
        return `${year}-${month}`;
    }
    months = [
        'January', 'February', 'March', 'April','May', 'June', 'July', 'August','September', 'October', 'November', 'December'
    ];
    years = [
        2019, 2020, 2021, 2022, 2023, 2024, 2025 , 2026, 2027, 2028, 2029, 2030
    ];
    handleChange = (employeeId, salaryMonth, index, e) => {
        const { selected,data } = this.state;
        const { value } = e.target;

        if (value < 0) {
            toast.error("Value should be greater than 0");
            return;
        }
            if (value % 0.5 !== 0 ) {
            toast.error("Value should be a multiple of 0.5 or 1");
            return;
        }

        data[index].daysWorked = value;

        if (!salaryMonth) {
            salaryMonth = this.getSalaryMonth();
        }

        const selectedIndex = selected.findIndex(
            (item) => item.employeeId === employeeId && item.salaryMonth === salaryMonth
        );

        if (selectedIndex !== -1) {
            selected[selectedIndex].daysWorked = value;
        } else {
            selected.push({
                employeeId,
                salaryMonth,
                daysWorked: value
            });
        }

        this.setState({ data, selected });
    };

    render() {
        const { data,manageWorkingDays, totalPages, totalRecords, currentPage, size } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const columns = [
            {
                title: '#',
                dataIndex: 'serialNumber',
                render: (text, record, index) => index + 1,
            },
            {
                title: 'Employee',
                sorter: true,
                render: (text, record) => {
                    const { empId, employeeId, employeeName } = record;
                    const employees = this.state.data;
                    return employees.map((employee) => {
                        if (employee.empId === empId) {
                            return (
                                <EmployeeListColumn key={employee.empId} id={employee.empId} name={employee.employeeName} employeeId={employee.employeeId} />
                      );}
                        return null;
                    });
                },
            },
            {
                title: 'Salary Month',
                dataIndex: 'salaryMonth',
                sorter: true,
            },
            {
                title: 'Days Worked',
                dataIndex: 'daysWorked',
                sorter: true,
                render: (number, record,index) => (
                <input type="number" value={number} step="0.5" min ="0"onChange={(e) =>this.handleChange(record.empId, record.salaryMonth, index, e)
                }/>
                ),
            },
        ]
        return (
           
                <div className="insidePageDiv">
                {<Formik
                    enableReinitialize={true}
                    initialValues={manageWorkingDays}
                    onSubmit={this.save}
                >
                    
                        <div className="page-containerDocList content container-fluid">
                            <div className="tablePage-header">
                                <div className="row pageTitle-section">
                                    <div className="col">
                                        <h3 className="tablePage-title">Manage Working Days</h3>
                                    </div>
                                    <div className="mt-0 mb-2 float-right col">
                                        {<div className='text-right'>
                                            <div style={{ float: 'right' }} >
                                                <Tooltip title="Search" type="hidden" componentsProps={{ tooltip: { sx: { fontSize: '15px', bgcolor: 'common.black', '& .MuiTooltip-arrow': { color: 'common.black', }, }, }, }} placement="top-start">
                                                    <Button className="d-none" style={{ width: '110px', background: '#45C56D' }} onClick={() => { this.setState({ showSearch: !this.state.showSearch }) }} variant='warning' size='sm'>
                                                        <TbListSearch font-size='28px' />
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                            {verifyOrgLevelViewPermission("Pay Manage Working days") &&<>
                                            {this.state.showSearch && <div>
                                                <FormControl variant="standard" sx={{ marginLeft: '4em', minWidth: 120 }}>
                                                    <InputLabel id="demo-simple-select-standard-label">Select Month</InputLabel>
                                                    <Select
                                                        MenuProps={{ disableScrollLock: true }}
                                                        labelId="demo-simple-select-standard-label"
                                                        id="demo-simple-select-standard"
                                                        onChange={(e) => { this.setState({ month: e.target.value }) }}
                                                    >
                                                        {this.months.map((month, index) => (
                                                            <MenuItem value={index + 1}>{month}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>

                                                {/** Year dropdown */}

                                                <FormControl variant="standard" sx={{ ml: 3, minWidth: 120 }}>
                                                    <InputLabel id="demo-simple-select-standard-label">Select Year</InputLabel>
                                                    <Select
                                                        MenuProps={{ disableScrollLock: true }}
                                                        labelId="demo-simple-select-standard-label"
                                                        id="demo-simple-select-standard"
                                                        onChange={(e) => { this.setState({ year: e.target.value }) }}
                                                    >
                                                        {this.years.map((year, index) => (
                                                            <MenuItem value={year}>{year}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>

                                                <FaSearch style={{ cursor: 'pointer', marginTop: '20px', marginLeft: '30px' }} onClick={() => { this.fetchList() }} font-size={25} />
                                            </div>}
                                            </>}
                                        </div>}
                                    </div>
                                </div>
                            </div>
                            {/* /Page Header */}
                            <div className="mt-2 row">

                                {/* </div> */}
                                <div className="col-md-12">
                                    <div className="table-responsive">
                                        {verifyOrgLevelViewPermission("Pay Manage Working days") && <Table id='Table-style' className="table-striped "
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
                                            style={{ overflowX: 'auto' }}
                                            columns={columns}
                                            // bordered
                                            dataSource={[...data]}
                                            rowKey={record => record.id}
                                            onChange={this.onTableDataChange}
                                        />}
                                        {!verifyOrgLevelViewPermission("Pay Manage Working Days") && <AccessDenied></AccessDenied>}
                                    </div>
                                    {verifyOrgLevelEditPermission("Pay Manage Working days") &&
                                    <div className="row">
                                        <div className="mb-3 mt-3 col text-right">
                                            <input type="submit" disabled={this.state.selected.length === 0} className="btn btn-primary" value={"Update Working Days"} onClick={this.saveFunction} />
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    
                </Formik>
                }
            </div>
        );
    }
}