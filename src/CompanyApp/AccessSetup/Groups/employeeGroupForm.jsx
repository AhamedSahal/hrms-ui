import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Col, Row, ButtonGroup } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { BsSliders } from 'react-icons/bs';
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../../ModuleSetup/Dropdown/DepartmentDropdown';
import DivisionDropdown from '../../ModuleSetup/Dropdown/DivisionDropdown';
import { Link } from 'react-router-dom';
import { addUserIntoGroup, getEmployeeList } from './service';

export default class EmployeeGroupForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            group: props.userGroup ? props.userGroup : {},
            groupId: props.userGroup?.id,
            selectedEmployee: [],
            employeeList: [],
            q: "",
            branchId: "",
            departmentId: "",
            divisionId: "",
            page: 0,
            size: 9999,
            sort: "empId,asc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            showFilter: false,
        }
    }
    componentDidMount() {
        this.fetchEmployees();
    }
    fetchEmployees = () => {
        const { q, page, size, sort, groupId, departmentId, divisionId, branchId } = this.state;
        getEmployeeList(q, page, size, sort, groupId, branchId, departmentId, divisionId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    employeeList: res.data.list,
                    totalPages: res.data.totalPages,
                    totalRecords: res.data.totalRecords,
                    currentPage: res.data.currentPage + 1
                })
            }
        })
    }
    onTableDataChange = (d, filter, sorter) => {
        this.setState({
            page: d.current - 1,
            size: d.pageSize,
            sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
        }, () => {
            this.fetchEmployees();
        })
    }
    pageSizeChange = (currentPage, pageSize) => {
        this.setState({
            size: pageSize,
            page: 0
        }, () => {
            this.fetchEmployees();
        })
    }

    onSelect = (data) => {
        let { selectedEmployee } = this.state;
        let index = selectedEmployee.indexOf(data.empId);
        if (index > -1) {
            selectedEmployee.splice(index, 1);
        } else {
            selectedEmployee.push(data.empId);
        }
        this.setState({ selectedEmployee });
    }
    save = () => {
        const { selectedEmployee, groupId } = this.state;
        const data = {
            ids: selectedEmployee,
            groupId: groupId,
        };
        addUserIntoGroup(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList();
                this.props.fetchList(groupId);
            } else {
                toast.error(res.message);
            }
        })
    }
    updateAll = (value) => {
        if (value === 0) {
            this.setState({
                selectedEmployee: []
            })
        }
        if (value === 1) {
            const { employeeList } = this.state;
            const selectedEmployee = employeeList.map(employee => employee.empId);
            this.setState({
                selectedEmployee: selectedEmployee,
            });
        }
    }

    render() {
        const { employeeList, selectedEmployee,branchId,departmentId,divisionId } = this.state;
        return (
            <>
                <div id='page-head m-0'>
                    <div className="row ml-1 mr-1">
                        <div className="mt-1 float-right  btn-group btn-group-sm cust-button-group-mr-35">
                            <BsSliders className='ml-2 filter-btn' size={25} onClick={() => this.setState({ showFilter: !this.state.showFilter })} />
                        </div>
                        {this.state.showFilter && <div className='mt-2 filterCard p-3'>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group form-focus">
                                        <DivisionDropdown defaultValue={this.state.divisionId} onChange={e => {
                                            this.setState({
                                                divisionId: e.target.value
                                            })
                                        }}></DivisionDropdown>
                                        <label className="focus-label">Division</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-focus">
                                        <DepartmentDropdown defaultValue={this.state.departmentId} onChange={e => {
                                            this.setState({
                                                departmentId: e.target.value
                                            })
                                        }}></DepartmentDropdown>
                                        <label className="focus-label">Department</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-focus">
                                        <BranchDropdown defaultValue={this.state.branchId} onChange={e => {
                                            this.setState({
                                                branchId: e.target.value
                                            })
                                        }}></BranchDropdown>
                                        <label className="focus-label">Location</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="form-group form-focus">
                                        <input onChange={e => {
                                            this.setState({
                                                q: e.target.value,
                                                page: 0
                                            })
                                        }} type="text" className="form-control floating" />
                                        <label className="focus-label">Search</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <a href="#" onClick={() => {
                                        this.fetchEmployees();
                                    }} className="btn btn-success btn-block"> Search </a>
                                </div>
                            </div>
                        </div>}
                    </div>
                    <div className='mt-2 approvalTable-card mb-2' >
                        <div className="tableCard-body">
                            <div className="row " >
                                <div className="mt-3 col">
                                    <h3 className="page-titleText"> Employees </h3>
                                </div>
                                <div className='col-md-auto'>
                                    <ButtonGroup className='pull-right my-3'>
                                        <button
                                            disabled={!employeeList || employeeList.length == 0}
                                            className='markAll-btn btn-sm btn-outline-secondary mr-3'
                                            onClick={() => {
                                                this.updateAll(1);
                                            }}>Select All </button>
                                        <button
                                            disabled={!selectedEmployee || selectedEmployee.length == 0}
                                            className='markAll-btn-rejected btn-sm btn-outline-secondary mr-3'
                                            onClick={() => {
                                                this.updateAll(0);
                                            }}>Unselect All </button>
                                        <button
                                            className="btn btn-primary"
                                            disabled={!selectedEmployee || selectedEmployee.length == 0}
                                            onClick={() => {
                                                this.save();
                                            }}>Assign Employee
                                        </button>
                                    </ButtonGroup>
                                </div>
                            </div>
                            {/* /Page Header */}
                            <div className="tableCard-container row">
                                <div className="col-md-12">
                                    <div className="table-responsive" style={{maxHeight:'500px'}}>
                                        <table className="table">
                                            <thead >
                                                <tr style={{ background: '#c4c4c4' }}>
                                                    <th>#</th>
                                                    <th>Employee</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeeList && employeeList.map((item, index) => (
                                                    <tr key={`${item.empId}_${index}`} className="table-row">
                                                        <td className="table-column">{index + 1}</td>
                                                        <td className="table-column">
                                                            <h2  className="table-avatar">
                                                                <Link to={`/app/company-app/employee/detail/${item.empId}`}>{item.employeeName}
                                                                    <span>{item.employeeId}</span>
                                                                </Link>
                                                            </h2>
                                                        </td>
                                                        <td className="table-column">
                                                            <Row>
                                                                <Col md={6}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedEmployee && selectedEmployee.length > 0 && selectedEmployee.indexOf(item.empId) > -1}
                                                                        className="pointer"
                                                                        onClick={() => {
                                                                            this.onSelect(item);
                                                                        }}></input>
                                                                </Col>
                                                            </Row>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {(!employeeList || employeeList.length == 0 )&&
                                                    <tr className="ant-table-placeholder">
                                                        <td colSpan={3} className="ant-table-cell">
                                                            <div className="ant-empty ant-empty-normal">
                                                                <div className="ant-empty-description">
                                                                    <h4>{(!branchId && !departmentId && !divisionId ) ? 'All Employees are already added in this Group' : 'No employee found matching the selected criteria' }</h4>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                        {employeeList.length > 10 &&
                                            <div className='col-md-auto'>
                                                <ButtonGroup className='pull-right my-3'>
                                                    <button className="btn btn-primary"
                                                        disabled={!selectedEmployee || selectedEmployee.length == 0}
                                                        onClick={() => { this.save() }}>Assign Employee
                                                    </button>
                                                </ButtonGroup>
                                            </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}