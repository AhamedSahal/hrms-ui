import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { itemRender } from "../../paginationfunction";
import { getReadableDate } from '../../utility';
import { getMyTasksList, updateStatus } from './service';
import Tasksform from './form';
import TasksViewer from './view';
import EmployeeListColumn from '../../CompanyApp/Employee/employeeListColumn';
import EmployeeDropdown from "../ModuleSetup/Dropdown/EmployeeDropdown";
import TableDropDown from '../../MainPage/tableDropDown';
const { Header, Body, Footer, Dialog } = Modal;
export default class MyTasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            employeeId: props.employeeId,
            data: [],
            q: "",
            page: 0,
            size: 10,
            sort: "id",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            defaultEmployeeId: 0,
            dashboardView: false,
            status: true,
            TasksView: true,
            isCheck: 0,
            statusname: "PENDING",
            statname: "REJECTED"
        };
    }
    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        getMyTasksList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.statusname, this.state.statname,this.state.dashboardView).then(res => {
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
    updateStatus = (id, status) => {
        updateStatus(id, status).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.fetchList();
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            console.error(err);
            toast.error("Error while updating status");
        })
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
    pageSizeChange = (currentPage, pageSize) => {
        this.setState({
            size: pageSize,
            page: 0
        }, () => {
            this.fetchList();

        })

    }
    hideForm = () => {
        this.setState({
            showForm: false
        })
    }
    hideTaskView = () => {
        this.setState({
            showTaskView: false,
            TasksView: undefined
        })
    }
    updateSelf = () => {
       this.setState({statusname: this.state.status == true ? "PENDING" : "APPROVED"},() => this.fetchList())
    }

    render() {
        const { data, totalPages, totalRecords, currentPage, size, TasksView } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const menuItems = (text, record) => [
            <div ><a className="muiMenu_item" href="#" onClick={() => {
                this.setState({ Tasks: text, showForm: true })
            }} >
                <i className="fa fa-pencil m-r-5"></i> <b>Edit</b></a></div>,
            <div ><a className="muiMenu_item" href="#"
                onClick={() => {
                    this.setState({ TasksView: record, showTaskView: true })
                }}
            ><i className="fa fa-eye m-r-5" />
                <b>View</b></a></div>,
            <div ><a className="muiMenu_item" href="#"
                onClick={() => {
                    let { status } = this.state;
                    status = (record.status == "PENDING" ? "APPROVED" : "PENDING");
                    this.updateStatus(text.id, status);
                }}
            >{record.status != "PENDING" ? <i className="fa fa-check m-r-5" /> : <i className="fa fa-check m-r-5" />}<b>
                    {record.status == "APPROVED" ? "Mark as pending" : "Mark as completed"}</b></a></div>
        ]
        const columns = [
            {
                title: 'Title',
                sorter: true,
                width: 350,
                render: (text, record) => {
                    return <>
                        <div>{record.taskname} </div>
                    </>
                }
            },
            {
                title: 'Created by',
                render: (text, record) => {
                    return text.raisedby != null ?
                        <EmployeeListColumn id={text.raisedby.id} name={text.raisedby.name} employeeId={text.employeeId}></EmployeeListColumn> : 'Admin'
                },
                sorter: false,
            },
            {
                title: 'Created on',
                width: 150,
                sorter: true,
                render: (text, record) => {
                    return <>
                        <div>{getReadableDate(record.startdate != null ? record.startdate : "NA")}</div>
                    </>
                }

            },
            {
                title: 'Status',
                sorter: true,
                render: (text, record) => {
                    return <span className={text.status == "PENDING" ? "badge bg-inverse-warning " : text.status == "APPROVED" ? "badge bg-inverse-success" : "badge bg-inverse-danger"}>
                        {text.status == "PENDING" ? <i className="pr-2 fa fa-hourglass-o text-warning"></i> : text.status == "APPROVED" ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
                            text.status == "PENDING" ? 'PENDING' : text.status == "APPROVED" ? 'COMPLETED' : 'OVERDUE'
                        }</span>
                }
            },
            {
                title: this.state.status == true ? 'Due on' : 'completed on',
                width: 150,
                sorter: true,
                render: (text, record) => {
                    return <>
                        <div>{text.status == "PENDING" ? getReadableDate(record.enddate != null ? record.enddate : "NA") :
                            text.status == "APPROVED" ? getReadableDate(record.completeddate != null ? record.completeddate : "NA") :
                                getReadableDate(record.enddate != null ? record.enddate : "NA")} </div>
                    </>
                }
            },
            {
                title: 'Action',
                width: 50,
                render: (text, record) => (
                  <div className="">
                    <TableDropDown menuItems={menuItems(text, record)} />
                  </div>
                ),
              },
            

        ]
        return (
            <>
                <div className="page-container content container-fluid">
                    {/* Page Header */}
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">My Task</h3>
                            </div>
                            <div className="float-right col">
                                <div className="row justify-content-end">
                                    <div className="mt-2 float-right col-auto ml-auto flex items-center space-x-2">
                                        
                                          <div onClick={() => 
                                             this.setState({status: this.state.status == true ? false : true},() =>  this.updateSelf())  
                                            } className="toggles-btn-view " id="button-container" >

                                            <div id="my-button" className="toggle-button-element" style={{ transform:  this.state.status ? 'translateX(0px)' : 'translateX(80px)' }}>
                                                <p className='m-0 self-btn'>{ this.state.status ? 'Pending' : 'Completed'}</p>

                                            </div>
                                            <p className='m-0 team-btn' style={{ transform:  this.state.status ? 'translateX(-10px)' : 'translateX(-100px)' }}>{this.state.status ? 'Completed' : 'Pending'}</p>
                                            </div>


                                        <Link to="/app/company-app/Taskform" className="btn apply-button btn-primary"><i className="fa fa-plus" /> New Task</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mt-3 mb-3 table-responsive">
                                <Table id='Table-style' className="table-striped "
                                    pagination={{
                                        total: totalRecords,
                                        showTotal: (total, range) => {
                                            return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                                        },
                                        showSizeChanger: true, onShowSizeChange: this.pageSizeChange,
                                        itemRender: itemRender,
                                        pageSizeOptions: [30, 50, 100],
                                        current: currentPage,
                                        defaultCurrent: 1,
                                    }}
                                    style={{ overflowX: 'auto' }}
                                    columns={columns}
                                    // bordered
                                    dataSource={[...data]}
                                    rowKey={record => record.id}
                                    onChange={this.onTableDataChange}
                                />

                            </div>
                        </div>
                    </div>
                </div>

                <Modal enforceFocus={false} size={"xl"} show={this.state.showForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title">Edit Task</h5>
                    </Header>
                    <Body>
                        <Tasksform hideForm={this.hideForm} updateList={this.updateList} Tasks={this.state.Tasks}>
                        </Tasksform>
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"xl"} show={this.state.showTaskView} onHide={this.hideTaskView} >
                <Header closeButton>
                <h5 className="modal-title">Task</h5>
                </Header>
                    <Body>
                        {TasksView && <TasksViewer TasksView={TasksView} />}
                    </Body>
                </Modal>
            </>

        );
    }
}
