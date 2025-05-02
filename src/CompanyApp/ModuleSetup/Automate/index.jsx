import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { itemRender } from "../../../paginationfunction";
import { getWorkflow } from './service';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import WorkflowFrom from './workflowForm';
import WorkflowStepForm from './workflowStepForm';
import { getUserType, verifyOrgLevelViewPermission } from '../../../utility';
import WorkFlowAutomateDropdown from '../Dropdown/WorkFlowAutomateDropdown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';

const { Header, Body } = Modal;
export default class AutoDocs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formPage: 0,
            name: "",
            data: [],
            workFlowId: "",
            q: "",
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1

        };
    }
   componentDidMount() { 
        this.fetchList();
      }
 
      fetchList = () => {
        if(verifyOrgLevelViewPermission("Module Setup Automate"))
        {
            (this.state.workFlowId != 0 && getWorkflow(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.workFlowId).then(res => {
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
    nextPage = (item) => {
        this.setState({ formPage: item.formPage, name: item.name })
    }

    onTableDataChange = (d, filter, sorter) => {
        this.setState(
          {
            page: d.current - 1,
            size: d.pageSize,
            sort: sorter && sorter.field ? `${sorter.field},${sorter.order == "ascend" ? "asc" : "desc"}` : this.state.sort,
          },
          () => {
            this.fetchList();
          }
        );
      };

    pageSizeChange = (currentPage, pageSize) => {
        this.setState(
          {
            size: pageSize,
            page: 0,
          },
          () => {
            this.fetchList();
          }
        );
      };
    
    hideForm = () => {
        this.setState({
            showForm: false,
        })
    }
    closeForm = (value) => {
        this.hideForm()
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
                title: 'Steps',
                dataIndex: 'workFlowStepName',
                width: 120,
            },
            {
                title: 'Assignee',
                width: 120,
                render: (text, record) => {
                  
                    return <>
                    {
                    text.assignTo == 0 ? <EmployeeListColumn id={text.employeeId} name={text.employeename} employeeId={text.employee} ></EmployeeListColumn> : 
                    text.assignTo == 1?<p>{record.roleId != null ? record.roleId == 1 ? "Reporting Manager" : record.roleId == 2 ? "HR" : "-" : "-" }</p>:
                    text.assignTo == 2?<p>Every One</p>:null
                     }
                    </>
                  },
            },
            {
                title: 'Start',
                width: 70,
                render: (text, record) => {
                    const newArray = text.start
                    return <>
                    {newArray == 1 ? <p><i class="fa fa-check" aria-hidden="true"></i></p> : <p><i class="fa fa-times" aria-hidden="true"></i></p>  }
                    </>
                  },
            },
            {
                title: 'Approve',
                width: 70,
                render: (text, record) => {
                    const newArray = text.approve
                    return <>
                    {newArray == 1 ? <p><i class="fa fa-check" aria-hidden="true"></i></p> : <p><i class="fa fa-times" aria-hidden="true"></i></p>  }
                    </>
                  },

            },
            {
                title: 'Reject',
                width: 70,
                render: (text, record) => {
                    const newArray = text.reject
                    return <>
                    {newArray == 1 ? <p><i class="fa fa-check" aria-hidden="true"></i></p> : <p><i class="fa fa-times" aria-hidden="true"></i></p>  }
                    </>
                  },

            },
            {
                title: 'OnHold',
                width: 70,
                render: (text, record) => {
                    const newArray = text.onHold
                    return <>
                    {newArray == 1 ? <p><i class="fa fa-check" aria-hidden="true"></i></p> : <p><i class="fa fa-times" aria-hidden="true"></i></p>  }
                    </>
                  },

            },
            {
                title: 'Acknowledge',
                width: 50,
                render: (text, record) => {
                    const newArray = text.acknowledge
                    return <>
                    {newArray == 1 ? <p><i class="fa fa-check" aria-hidden="true"></i></p> : <p><i class="fa fa-times" aria-hidden="true"></i></p>  }
                    </>
                  },

            },
            {
                title: 'Complete the workflow',
                width: 50,
                render: (text, record) => {
                    const newArray = text.completed
                    return <>
                    {newArray == 1 ? <p><i class="fa fa-check" aria-hidden="true"></i></p> : <p><i class="fa fa-times" aria-hidden="true"></i></p>  }
                    </>
                  },

            },

        ]
        return (


            <div className="page-container content container-fluid">
                {/* Page Header */}
                <div className="tablePage-header">
                    <div className="row pageTitle-section">
                        <div className="col">
                            <h3 className="tablePage-title">Workflow</h3>
                        </div>
                        <div className="mt-2 mb-2 float-right col-auto ml-auto d-flex">
                            <WorkFlowAutomateDropdown defaultValue="Select Workflow"
                            onChange={(e) => {
                                this.setState({ workFlowId:e.target.value},
                                () => {this.fetchList()}    
                                    )
                            }}
                            >

                            </WorkFlowAutomateDropdown>
                            {verifyOrgLevelViewPermission("Module Setup Automate") && <><p style={{ width: '16em' }} className="ml-3 mt-2 btn apply-button btn-primary" onClick={() => {
                                this.setState({
                                    showForm: true,
                                    formPage: 0
                                })
                            }}><i className="fa fa-plus" />Add Workflow</p></>}
                        </div>


                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="mt-3 mb-3 table-responsive">
                            {verifyOrgLevelViewPermission("Module Setup Automate") && 
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
                                dataSource={[...data]}
                                onChange={this.onTableDataChange}
                            />}
                        {!verifyOrgLevelViewPermission("Module Setup Automate")&& <AccessDenied></AccessDenied>}
                        </div>
                    </div>
                </div>


                < Modal enforceFocus={false} size={"lg"} show={this.state.showForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title">Add Workflow</h5>
                    </Header>
                    <Body>
                        {this.state.formPage === 0 && <WorkflowFrom nextPage={this.nextPage}>

                        </WorkflowFrom>}
                        {this.state.formPage === 1 && <WorkflowStepForm closeForm={this.closeForm} nextPage={this.nextPage} workflow={this.state.name} >
                        </WorkflowStepForm>}
                    </Body>
                </Modal >
            </div>

        );
    }
}
