import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import ProjectMainForm from './form';
import ProjectActivityMainForm from './Activityform';
import ProjectActivityViewer from './Activityview';
import { getTitle, getReadableDate,verifyOrgLevelViewPermission, verifyOrgLevelEditPermission } from '../../../utility';
import { getList, getActivityList, save, updateStatus, updateActivityStatus } from './service';
import TableDropDown from '../../../MainPage/tableDropDown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';

const { Header, Body } = Modal;
export default class ProjectMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //   employeeId: props.employeeId,
            data: [],
            q: "",
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            status: true
        };
    }
    componentDidMount() {
        this.fetchList();
    }

    fetchList = () => {
        if(verifyOrgLevelViewPermission("Plan Projects")){
        {
            !this.state.status ?
                getActivityList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
                    if (res.status == "OK") {
                        this.setState({
                            data: res.data.list,
                            totalPages: res.data.totalPages,
                            totalRecords: res.data.totalRecords,
                            currentPage: res.data.currentPage + 1
                        })
                    }
                }) :
                getList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
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
    updateList = (ProjectMain) => {
        let { data } = this.state;
        let index = data.findIndex(d => d.id == ProjectMain.id);
        if (index > -1)
            data[index] = ProjectMain;
        else {
            data = [ProjectMain, ...data];
        }
        this.setState({ data },
            () => {
                this.hideForm();
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
    hideForm = () => {
        this.setState({
            showForm: false,
            showActivityForm: false
        })
    }
    handleCheck = () => {
        this.setState({
            status: this.state.status == true ? false : true

        }, () => {
            this.fetchList();
        })
    }
    hideActivity = () => {
        this.setState({
            showActivity: false,
            payslip: undefined
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
    updateActivityStatus = (id, status) => {
        updateActivityStatus(id, status).then(res => {
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
    render() {
        const { data, totalPages, totalRecords, currentPage, size, payslip } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const menuItems = (text, record) => {
            const items = [];
            if (this.state.status && record.projectStatus != "COMPLETED") {
                items.push(
                    <div>
                        {verifyOrgLevelEditPermission("Plan Projects") && 
                        <a className="muiMenu_item" href="#" onClick={() => {
                            let { projectActivityMain } = this.state;
                            projectActivityMain = text;
                            this.setState({ projectActivityMain, showActivityForm: true })
                        }} >
                            <i className="fa fa-pencil m-r-5"></i> Add Activity</a>}
                    </div>
                );
            }
            if (!this.state.status) {
                items.push(
                    <div>
                        <a className="muiMenu_item" href="#" onClick={() => {
                            let { payslip } = this.state;
                            payslip = text;
                            this.setState({ payslip, showActivity: true })
                        }} >
                            <i className="fa fa-eye m-r-5"></i>View Detail</a>
                    </div>
                );
            }
            if (this.state.status && record.projectStatus == "NOT_STARTED") {
                items.push(<div> <a className="muiMenu_item" href="#" onClick={() => {
                    let { status } = this.state; status = "INPROGRESS";
                    this.updateStatus(text.id, status);
                }} ><i className="fa fa-hourglass-start m-r-5" />Launch Project</a>
                </div>
                );
            }
            if (this.state.status && record.projectStatus == "NOT_STARTED" || record.projectStatus == "INPROGRESS" || record.projectStatus == "OVERDUE") {
                items.push(<div> <a className="muiMenu_item" href="#" onClick={() => {
                    let { status } = this.state; status = "COMPLETED"; this.updateStatus(text.id, status);
                }}><i className="fa fa-check m-r-5" />Completed</a>
                </div>
                );
            }
            if (!this.state.status && record.projectActivityStatus == "NOT_STARTED") {
                items.push(<div><a className="muiMenu_item" href="#" onClick={() => {
                    let { status } = this.state; status = "INPROGRESS"; this.updateActivityStatus(text.id, status);
                }}><i className="fa fa-hourglass-start m-r-5" />Launch Activity</a> </div>
                );
            }
            if (!this.state.status && record.projectStatus == "NOT_STARTED" || record.projectActivityStatus == "INPROGRESS" || record.projectActivityStatus == "OVERDUE") {
                items.push(<div> <a className="muiMenu_item" href="#" onClick={() => {
                    let { status } = this.state; status = "COMPLETED";
                    this.updateActivityStatus(text.id, status);
                }} ><i className="fa fa-check m-r-5" />Completed</a>
                </div>
                );
            }
            return items;
        };
        const columns = [

            {
                title: !this.state.status ? 'Activity ' : 'Project',
                render: (text, record) => {
                    return <>
                        {this.state.status == true ? <div> {record.projectCode} - {record.projectName}  </div> : <div> {record.activity?.name} </div>}
                    </>
                }
            },
            {
                title: !this.state.status ? 'Project Name' : "",
                render: (text, record) => {
                    return <>
                        {this.state.status == false ? <div> {record.project?.name}  </div> : ""}
                    </>
                }
            },
            {
                title: 'Budget',
                render: (text, record) => {
                    return <>
                        {this.state.status ? <div> {record.projtotalcost}  </div> : <div> {record.projActivitycost}  </div>}
                    </>
                }
            },
            {
                title: 'Start Date',
                render: (text, record) => {
                    return <>
                        {this.state.status ? <div> {getReadableDate(record.projstartdate)}  </div> : <div> {getReadableDate(record.activitystartdate)}  </div>}
                    </>
                }
            },
            {
                title: 'End Date',
                render: (text, record) => {
                    return <>
                        {this.state.status ? <div> {getReadableDate(record.projenddate)}  </div> : <div> {getReadableDate(record.activityenddate)}  </div>}
                    </>
                }
            },
            {
                title: 'Status',
                render: (text, record) => {
                    return <>
                        {this.state.status ? <span className={text.projectStatus == "NOT_STARTED" ? "badge bg-inverse-secondary " : text.projectStatus == "INPROGRESS" ? "badge bg-inverse-warning " : text.projectStatus == "COMPLETED" ? "badge bg-inverse-success " : "badge bg-inverse-danger"}>
                            {text.projectStatus == "NOT_STARTED" ? <i className="pr-2 fa fa-ban text-secondary"></i> : text.projectStatus == "INPROGRESS" ? <i className="pr-2 fa fa-hourglass-o text-warning"></i> : text.projectStatus == "COMPLETED" ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
                                text.projectStatus == "NOT_STARTED" ? 'Not Started' : text.projectStatus == "INPROGRESS" ? 'In Progress' : text.projectStatus == "COMPLETED" ? 'Completed' : 'Overdue'
                            }</span> :
                            <span className={text.projectActivityStatus == "NOT_STARTED" ? "badge bg-inverse-secondary " : text.projectActivityStatus == "INPROGRESS" ? "badge bg-inverse-warning " : text.projectActivityStatus == "COMPLETED" ? "badge bg-inverse-success " : "badge bg-inverse-danger"}>
                                {text.projectActivityStatus == "NOT_STARTED" ? <i className="pr-2 fa fa-ban text-secondary"></i> : text.projectActivityStatus == "INPROGRESS" ? <i className="pr-2 fa fa-hourglass-o text-warning"></i> : text.projectActivityStatus == "COMPLETED" ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
                                    text.projectActivityStatus == "NOT_STARTED" ? 'Not Started' : text.projectActivityStatus == "INPROGRESS" ? 'In Progress' : text.projectActivityStatus == "COMPLETED" ? 'Completed' : 'Overdue'
                                }</span>}
                    </>
                }
            },
            {
                title: this.state.status ? 'Budget Status' : "",
                render: (text, record) => {
                    return <>
                        {this.state.status ? <span className={text.projectCostStatus == "UNDER_ESTIMATION" ? "badge bg-inverse-warning " : text.projectCostStatus == "ATPAR" ? "badge bg-inverse-success " : text.projectCostStatus == "OVER_ESTIMATION" ? "badge bg-inverse-danger" : ""}>
                            {text.projectCostStatus == "UNDER_ESTIMATION" ? <i className="pr-2 fa fa-hourglass-o text-warning"></i> : text.projectCostStatus == "ATPAR" ? <i className="pr-2 fa fa-check text-success"></i> : text.projectCostStatus == "OVER_ESTIMATION" ? <i className="pr-2 fa fa-remove text-danger"></i> : ""}{
                                text.projectCostStatus == "UNDER_ESTIMATION" ? 'Under Expense' : text.projectCostStatus == "ATPAR" ? 'At Par' : text.projectCostStatus == "OVER_ESTIMATION" ? 'Over Expense' : ""
                            }</span> :
                            ""}
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
                                <h3 className="tablePage-title">Budget</h3>
                            </div>
                            <div className="float-right col">
                                <div className="row justify-content-end">
                                {verifyOrgLevelEditPermission("Plan Projects") &&
                                    <div className="float-left col-auto ml-auto mr-1 my-2">
                                        <label className="pl-2"> Activity</label> &nbsp;
                                        <i onClick={() => this.handleCheck()} className={!this.state.status ? 'fa-2x fa fa-toggle-off text-danger' : 'fa-2x fa fa-toggle-on text-success'}></i>
                                        <label className="pl-2"> Project</label> &nbsp;
                                        {this.state.status && <><a href="#" className="btn apply-button btn-primary" onClick={() => {
                                            this.setState({
                                                showForm: true
                                            })
                                        }}><i className="fa fa-plus" /> New Budget</a></>}
                                    </div>
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mt-3 mb-3 table-responsive">
                            {verifyOrgLevelViewPermission("Plan Projects") && <div>
                                <Table id='Table-style' className="table-striped "
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
                                />                    </div>}
                                {!verifyOrgLevelViewPermission("Plan Projects") && <AccessDenied></AccessDenied>}              

                            </div>
                        </div>
                    </div>
                </div>




                {/* /Page Content */}
                <Modal enforceFocus={false} size={"xl"} show={this.state.showForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title">{this.state.ProjectMain ? 'Edit' : 'Add'} New Budget</h5>
                    </Header>
                    <Body>
                        <ProjectMainForm updateList={this.updateList} projectMain={this.state.projectMain}>
                        </ProjectMainForm>
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"xl"} show={this.state.showActivityForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title">{this.state.ProjectMain ? 'Edit' : 'Add'} Activity</h5>
                    </Header>
                    <Body>
                        <ProjectActivityMainForm updateList={this.updateList} projectActivityMain={this.state.projectActivityMain}>
                        </ProjectActivityMainForm>
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"xl"} show={this.state.showActivity} onHide={this.hideActivity} >
                    <Header closeButton>
                        <h5 className="modal-title">Detailed Project View</h5>
                    </Header>
                    <Body>
                        <ProjectActivityViewer payslip={payslip}></ProjectActivityViewer>
                    </Body>
                </Modal>

            </>
        );
    }
}
