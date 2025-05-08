import React, { Component } from 'react';
import { Col, Modal, Row, Anchor, ButtonGroup } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import GroupForm from './form';
import { deleteGroup, deleteUserFromGroup, getEmployeeList, getGroupList, getUserGroupEmployeeList } from './service';
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../../ModuleSetup/Dropdown/DepartmentDropdown';
import DivisionDropdown from '../../ModuleSetup/Dropdown/DivisionDropdown';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { BsSliders } from 'react-icons/bs';
import EmployeeGroupForm from './employeeGroupForm';
import GroupConfiguration from './ConfigurationSettings/groupConfigurationForm';
import AttendanceSettingLanding from './ConfigurationSettings/AttendanceSettingLanding';

const { Header, Body } = Modal;

export default class Groups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            q: "",
            userGroup: {},
            groupId: 9999,
            branchId: "",
            departmentId: "",
            divisionId: "",
            page: 0,
            size: 9999,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            showFilter: false,
            userGroupData: [],
            selectedEmployee: [],
            showGroupEmployee: true,
            isDefault: false,
        };
    }
    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        getGroupList().then(res => {
            const data = res.data;
            this.setState({ data }, () => {
                const defaultGroup = data.find(record => record.default === true);
                if (defaultGroup) {
                    this.setState({ isDefault: defaultGroup.default })
                    this.fetchEmployees(defaultGroup.default, defaultGroup.id);
                }
            });
        });
    };
    fetchEmployees = (isDefault, groupId) => {
        if (isDefault == true) {
            const { q, page, size, departmentId, divisionId, branchId } = this.state;
            getEmployeeList(q, page, size, "empId,asc", groupId, branchId, departmentId, divisionId).then(res => {
                if (res.status == "OK") {
                    this.setState({
                        userGroupData: res.data.list,
                        totalPages: res.data.totalPages,
                        totalRecords: res.data.totalRecords,
                        currentPage: res.data.currentPage + 1
                    })
                }
            })
        }
        else {
            const { q, page, size, sort, departmentId, divisionId, branchId } = this.state;
            getUserGroupEmployeeList(q, page, size, sort, groupId, branchId, departmentId, divisionId).then(res => {
                if (res.status == "OK") {
                    this.setState({
                        userGroupData: res.data.list,
                        totalPages: res.data.totalPages,
                        totalRecords: res.data.totalRecords,
                        currentPage: res.data.currentPage + 1
                    })
                }
            })
        }
    }
    updateList = (group) => {
        let { data } = this.state;
        let index = data.findIndex(d => d.id == group.id);
        if (index > -1) {
            this.setState({ userGroup: group })
            data[index] = group;
        } else {
            data = [...data, group];
        }
        this.setState({ data },
            () => {
                this.hideForm();
            });
    }
    onTableDataChange = (d, filter, sorter) => {
        this.setState({
            page: d.current - 1,
            size: d.pageSize,
            sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
        }, () => {
            this.fetchEmployees(this.state.isDefault, this.state.groupId);
        })
    }

    pageSizeChange = (currentPage, pageSize) => {
        this.setState({
            size: pageSize,
            page: 0
        }, () => {
            this.fetchEmployees(this.state.isDefault, this.state.groupId);
        })
    }
    hideForm = () => {
        this.setState({
            showForm: false,
            showAddEmployeeForm: false,
            showSettingForm: false,
            group: undefined
        })
    }
    delete = (group) => {
        confirmAlert({
            title: `Delete Group ${group.name}`,
            message: 'Are you sure, you want to delete this Group?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteGroup(group.id).then(res => {
                        if (res.status == "OK") {
                            toast.success(res.message);
                            this.setState({ userGroup: {} })
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
    save = () => {
        const { selectedEmployee, groupId } = this.state;
        const data = {
            ids: selectedEmployee,
            groupId: groupId,
        };
        deleteUserFromGroup(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.setState({ selectedEmployee: [] })
                this.fetchEmployees(this.state.isDefault, this.state.groupId);
            } else {
                toast.error(res.message);
            }
        })
    }
    onSelect = (data) => {
        let { selectedEmployee } = this.state;
        let index = selectedEmployee.indexOf(data.id);
        if (index > -1) {
            selectedEmployee.splice(index, 1);
        } else {
            selectedEmployee.push(data.id);
        }
        this.setState({ selectedEmployee });
    }
    updateAll = (value) => {
        if (value === 0) {
            this.setState({
                selectedEmployee: []
            })
        }
        if (value === 1) {
            const { userGroupData } = this.state;
            const selectedEmployee = userGroupData.map(employee => employee.id);
            this.setState({
                selectedEmployee: selectedEmployee,
            });
        }
    }
    callBack = () => {
        this.fetchEmployees(this.state.isDefault, this.state.groupId);
    }
    render() {
        const { data, selectedEmployee, userGroupData, groupId, isDefault, userGroup, branchId, departmentId, divisionId } = this.state;
        const groups = data.map((group) =>
            <li className={(groupId == group.id) ? "active" : ""}>
                <Anchor onClick={() => {
                    this.setState({
                        userGroup: group,
                        groupId: group.id,
                        isDefault : group.default,
                        showGroupEmployee: true,
                        q: "",
                        branchId: "",
                        departmentId: "",
                        divisionId: "",
                        showFilter: false,
                    }, () => {
                        this.fetchEmployees(group.default, group.id);
                    })
                }}>{group.default ? "All Employees" : group.name}
                </Anchor>
            </li>
        );

        return (
            <>
                <div id='page-head mt-0'>
                    {/* Page Content */}
                    <div className="mt-4 pb-3 pr-4 page-containerDocList content container-fluid">
                        <div className="tablePage-header">
                            <div className="row pageTitle-section">
                                <div className="col-sm-12">
                                    <h3 className="tablePage-title">Manage Groups</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item active">Groups</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* /Page Header */}
                        <div className="rounded row page-wrapper ant-table-background">
                            <div className="col-sm-4 col-md-4 col-lg-4 col-xl-3">
                                <a href="#" className="btn btn-primary btn-block" onClick={() => {
                                    this.setState({
                                        showForm: true,
                                        group: undefined
                                    })
                                }}><i className="fa fa-plus" /> Add Group</a>
                                <div className="roles-menu">
                                    <ul>
                                        {groups}
                                    </ul>
                                </div>
                            </div>

                            {this.state.userGroup && this.state.showGroupEmployee &&
                                <div className="col-sm-8 col-md-8 col-lg-8 col-xl-9">
                                    <div className="mt-0 float-right col-md-12 ml-auto btn-group btn-group-sm cust-button-group-mr-35">
                                        {userGroup.id > 0 && <><div className="mt-0 mb-2 float-right col-md-3 d-flex">
                                            <p style={{ width: '16em', backgroundColor: "#2fc6c6", color: "rgb(236 239 241)", border: "white" }} className="ml-3 mt-2 btn apply-button btn-primary" onClick={() => {
                                                this.setState({ showSettingForm: true })
                                            }}><i className="fa fa-gears" /> Attendance Settings </p>
                                        </div>
                                        {this.state.isDefault == false && <>
                                            <div className="mt-0 mb-2 float-right col-md-2 d-flex">
                                                <p style={{ width: '16em', backgroundColor: "#d3b547", color: "rgb(236 239 241)", border: "white" }} className="ml-3 mt-2 btn apply-button btn-primary" onClick={() => {
                                                    this.setState({ group: this.state.userGroup, showForm: true })
                                                }}><i className="fa fa-pencil" /> Edit </p>
                                            </div>
                                            <div className="mt-0 mb-2 float-right col-md-2 d-flex">
                                                <p style={{ width: '16em', backgroundColor: "#db2d2d", color: "rgb(236 239 241)", border: "white" }} className="ml-3 mt-2 btn apply-button btn-primary" onClick={() => {
                                                    this.delete(this.state.userGroup)
                                                }}><i className="fa fa-trash" /> Delete </p>
                                            </div>
                                            <div className="mt-0 mb-2 float-right col-md-2 d-flex">
                                                <p style={{ width: '16em', backgroundColor: "#63d463", color: "rgb(236 239 241)", border: "white" }} className="ml-3 mt-2 btn apply-button btn-primary" onClick={() => {
                                                    this.setState({
                                                        showAddEmployeeForm: true,
                                                    })
                                                }}><i className="fa fa-plus" /> Add </p>
                                            </div>
                                        </>}
                                        </>}

                                        <BsSliders className='ml-2 filter-btn mt-2' size={25} onClick={() => this.setState({ showFilter: !this.state.showFilter })} />
                                    </div>

                                    {this.state.showFilter && <div className='mt-5 mb-0 filterCard p-3'>
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
                                                    this.fetchEmployees(isDefault, groupId);
                                                }} className="btn btn-success btn-block"> Search </a>
                                            </div>
                                        </div>
                                    </div>}
                                    {/*  Show Employee Added in that group */}
                                    <div id='page-head mt-0'>

                                        < div className='mt-5 approvalTable-card' >
                                            <div className="tableCard-body">
                                                <div className="row " >
                                                    <div className="mt-3 col">
                                                        <h3 className="page-titleText"> {(Object.keys(userGroup).length === 0 || userGroup.default) ? 'All Employees' : userGroup.name} </h3>
                                                    </div>
                                                    <div className='col-md-auto'>
                                                        {this.state.isDefault == false && <ButtonGroup className='pull-right my-3'>
                                                            <button
                                                                disabled={!userGroupData || userGroupData.length == 0}
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
                                                                disabled={!selectedEmployee || selectedEmployee.length == 0}
                                                                className="markAll-btn-rejected btn-sm btn-outline-secondary mr-3"
                                                                onClick={() => {
                                                                    this.save();
                                                                }}>Remove Employee
                                                            </button>
                                                        </ButtonGroup>}
                                                    </div>
                                                </div>

                                                <div className="tableCard-container row">
                                                    <div className="col-md-12">
                                                        <div className="table-responsive">
                                                            <table className="table">
                                                                <thead >
                                                                    <tr style={{ background: '#c4c4c4' }}>
                                                                        <th>#</th>
                                                                        <th>Employee</th>
                                                                        <th>Contact Details</th>
                                                                        <th>Division</th>
                                                                        <th>Department</th>
                                                                        <th>Location</th>
                                                                        {this.state.isDefault == false &&
                                                                            <th>Action</th>
                                                                        }
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {userGroupData && userGroupData.map((item, index) => (
                                                                        <tr key={`${item.empId}_${index}`} className="table-row">
                                                                            <td className="table-column">{index + 1}</td>
                                                                            <td className="table-column">
                                                                                <h2 style={{ wordSpacing: '-5px' }} className="table-avatar">
                                                                                    <Link to={`/app/company-app/employee/detail/${item.empId}`}>{item.employeeName} <span>{item.employeeId}</span> </Link>
                                                                                </h2>
                                                                            </td>
                                                                            <td className="table-column">
                                                                                {item.email != '' && <Row>
                                                                                    <h2 style={{ wordSpacing: '-5px' }} className="table-avatar">
                                                                                        Email : <span style={{ paddingBottom: "3px", fontSize: "14px" }}>{item.email}</span>
                                                                                    </h2>
                                                                                </Row>}
                                                                                {item.phoneNumber != '' && <Row>
                                                                                    <h2 style={{ wordSpacing: '-5px' }} className="table-avatar">
                                                                                        Phone : <span style={{ paddingBottom: "3px", fontSize: "14px" }}>{item.phoneNumber}</span>
                                                                                    </h2>
                                                                                </Row>}
                                                                            </td>
                                                                            <td className="table-column">
                                                                                {item.divisionName ? item.divisionName : '-'}
                                                                            </td>
                                                                            <td className="table-column">
                                                                                {item.departmentName ? item.departmentName : '-'}
                                                                            </td>
                                                                            <td className="table-column">
                                                                                {item.branchName ? item.branchName : '-'}
                                                                            </td>
                                                                            {this.state.isDefault == false &&
                                                                                <td className="table-column">
                                                                                    <Row>
                                                                                        <Col md={8}>
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={selectedEmployee && selectedEmployee.length > 0 && selectedEmployee.indexOf(item.id) > -1}
                                                                                                className="pointer"
                                                                                                onClick={() => {
                                                                                                    this.onSelect(item);
                                                                                                }}></input>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </td>}
                                                                        </tr>
                                                                    ))}
                                                                    {(!userGroupData || userGroupData.length == 0) &&
                                                                        <tr className="ant-table-placeholder">
                                                                            <td colSpan={7} className="ant-table-cell">
                                                                                <div className="ant-empty ant-empty-normal">
                                                                                    <div className="ant-empty-description">
                                                                                        <h4>{(!branchId && !departmentId && !divisionId) ? 'No employee found' : 'No employee found matching the selected criteria'}</h4>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    }
                                                                </tbody>
                                                            </table>
                                                            {this.state.isDefault == false && userGroupData.length > 10 &&
                                                                <div className='col-md-auto'>
                                                                    <ButtonGroup className='pull-right my-3'>
                                                                        <button className="btn btn-primary"
                                                                            disabled={!selectedEmployee || selectedEmployee.length == 0}
                                                                            onClick={() => { this.save() }}>Remove Employee
                                                                        </button>
                                                                    </ButtonGroup>
                                                                </div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                        </div>
                    </div>
                    <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
                        <Header closeButton>
                            <h5 className="modal-title">{this.state.group ? 'Edit' : 'Add'} Group</h5>
                        </Header>
                        <Body>
                            <GroupForm updateList={this.updateList} group={this.state.group}>
                            </GroupForm>
                        </Body>
                    </Modal>
                    <Modal enforceFocus={true} size={"xl"} show={this.state.showAddEmployeeForm} onHide={this.hideForm} >
                        <Header closeButton>
                            <h5 className="modal-title">Add Employee to {this.state.userGroup?.name} </h5>
                        </Header>
                        <Body>
                            <EmployeeGroupForm fetchList={this.callBack} userGroup={this.state.userGroup} updateList={this.hideForm}>
                            </EmployeeGroupForm>
                        </Body>
                    </Modal>
                    <Modal enforceFocus={true} size={"xl"} show={this.state.showSettingForm} onHide={this.hideForm} >
                        <Header closeButton>
                            <h5 className="modal-title" style={{color:"white"}}>{this.state.userGroup?.default ? 'All Employees' : this.state.userGroup.name} Settings</h5>
                        </Header>
                        <Body>
                            <AttendanceSettingLanding fetchList={this.callBack} userGroup={this.state.userGroup} updateList={this.hideForm}>
                            </AttendanceSettingLanding>
                        </Body>
                    </Modal>
                </div>
            </>)
    }
}