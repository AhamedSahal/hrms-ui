import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { itemRender } from "../../../paginationfunction";
import ProjectMainForm from '../ProjectMain/form';
import ProjectActivityMainForm from '../ProjectMain/Activityform';
import { getTitle,verifyOrgLevelViewPermission } from '../../../utility';
import { getCostEstimationList, save, saveCostEstimation } from '../ProjectMain/service';
import ProjectDropdown from '../../ModuleSetup/Dropdown/ProjectDropdown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';

const { Header, Body } = Modal;
export default class ProjectCostEstimation extends Component {
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
            projectId: 0
        };
    }
    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
    if(verifyOrgLevelViewPermission("Plan Projects")){
        {
            (this.state.projectId != 0 && getCostEstimationList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.projectId).then(res => {
                if (res.status == "OK") {
                    this.setState({
                        data: res.data.list,
                        totalPages: res.data.totalPages,
                        totalRecords: res.data.totalRecords,
                        currentPage: res.data.currentPage + 1
                    })
                }
            }))
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
    refresh = () => {
        saveCostEstimation().then(res => {
            if (res.status == "OK") {
                toast.success(res.message);

            } else {
                toast.error(res.message);
            }
        }).catch(err => {
            toast.error("Error while refresh the project");

        })
    }
    hideForm = () => {
        this.setState({
            showForm: false,
            showActivityForm: false,
            ProjectMain: undefined
        })
    }
    render() {
        const { data, totalPages, totalRecords, currentPage, size } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const columns = [
            {
                title: 'Project',
                render: (text, record) => {
                    return <>
                        {<div> {record.projectCode?.name} - {record.project?.name}  </div>}
                    </>
                }
            },
            {
                title: 'Activity Name',
                render: (text, record) => {
                    return <>
                        {<div> {record.activity?.name}  </div>}
                    </>
                }
            },
            {
                title: 'Project Budget',
                render: (text, record) => {
                    return <>
                        {<div> {record.projtotalcost}  </div>}
                    </>
                }
            },
            {
                title: 'Activity Budget',
                render: (text, record) => {
                    return <>
                        {<div> {record.projActivitycost}  </div>}
                    </>
                }
            },
            {
                title: 'Activity Expense',
                render: (text, record) => {
                    return <>
                        {<div> {record.accuredActivityCost}  </div>}
                    </>
                }
            },

            {
                title: 'Activity Balance',
                render: (text, record) => {
                    return <>
                        {<div> {record.activityCostRemains}  </div>}
                    </>
                }
            },
            {
                title: 'Project Balance',
                render: (text, record) => {
                    return <>
                        {<div> {record.projectCostRemains}  </div>}
                    </>
                }
            },
            {/* {
                title: 'Action',
                width: 50,
                className: "text-center",
                render: (text, record) => (
                    <div className="dropdow">
                        <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                            <i className="las la-bars"></i>
                        </a>
                         <div className="dropdown-menu dropdown-menu-right">
                            <a className="dropdown-item" href="#" onClick={() => {
                                this.setState({ project: text, showForm: true })
                            }} >
                                <i className="fa fa-pencil m-r-5"></i> Edit Project</a>

                            <a className="dropdown-item" href="#" onClick={() => {
                                this.setState({ project: text, showActivityForm: true })
                            }} >
                                <i className="fa fa-pencil m-r-5"></i> Edit Activity</a>

                            <a className="dropdown-item" href="#" onClick={() => {
                                // this.setState({ project: text, showActivityForm: true })
                            }} >
                                <i className="fa fa-pencil m-r-5"></i> View</a>

                        </div> 
                    </div>
                ),
            },*/}
        ]
        return (
            <>
                <div className="page-container content container-fluid">
                    {/* Page Header */}
                    {verifyOrgLevelViewPermission("Plan Projects") &&<>
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Costing</h3>
                            </div>
                            <div className="float-right col">
                                <div className="row justify-content-end">
                                    <div>
                                        <div className='refresh-btn-label'>
                                            <label style={{ fontWeight: "bold" }}>Project<span style={{ color: "red" }}>*</span></label>
                                            <button title="Refresh for latest updates" onClick={() => { this.refresh() }} style={{ border: "1px none" }}  ><i class="fa fa-refresh" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                        <ProjectDropdown onChange={e => { this.setState({ projectId: e.target.value }, () => { this.fetchList(); }) }}>
                                        </ProjectDropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    {(this.state.projectId == '') && <>
                        <div className="alert alert-warning alert-dismissible fade show" role="alert">
                            <span>Please click the button to generate the latest update and select the project to view the status.</span>
                        </div>
                    </>}
                    <div className="row">
                        {(this.state.projectId != '' && <> <div className="col-md-12">
                            <div className="mt-3 mb-3 table-responsive">
                             <div>
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
                                /></div>
                            </div>
                        </div></>)}
                    </div>                                
                    </>}{!verifyOrgLevelViewPermission("Plan Projects") && <AccessDenied></AccessDenied>}              
                </div>






                <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title">{this.state.ProjectMain ? 'Edit' : 'Add'} Project</h5>
                    </Header>
                    <Body>
                        <ProjectMainForm updateList={this.updateList} ProjectMain={this.state.ProjectMain}>
                        </ProjectMainForm>
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"md"} show={this.state.showActivityForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title">{this.state.ProjectMain ? 'Edit' : 'Add'} Activity</h5>
                    </Header>
                    <Body>
                        <ProjectActivityMainForm updateList={this.updateList} ProjectMain={this.state.ProjectMain}>
                        </ProjectActivityMainForm>
                    </Body>
                </Modal>

            </>
        );
    }
}
