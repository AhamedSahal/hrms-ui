import { Table } from 'antd';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Modal, Anchor } from 'react-bootstrap'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { fileDownload } from '../../../HttpRequest'; 
import ExpenseViewer from './WEViewer';
import { itemRender } from "../../../paginationfunction"; 
import { getReadableDate, getTitle, getUserType, verifyOrgLevelViewPermission } from '../../../utility';
import { getWorkExpenses,updateStatus } from './service';  
import EmployeeListColumn from '../../../CompanyApp/Employee/employeeListColumn'; 
import TableDropDown from '../../../MainPage/tableDropDown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const { Header,  Body,Footer, Dialog } = Modal;
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class WEPending extends Component {
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
            statusname: "PENDING",
            ExpenseView: true
        };
    }
    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {  
        if(verifyOrgLevelViewPermission("Pay Work Expenses")){
        getWorkExpenses(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.statusname).then(res => {
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

     pageSizeChange = (currentPage, pageSize) => {
    this.setState({
      size: pageSize,
      page: 0
    }, () => {
      this.fetchList();
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

    hideExpenseView = () => {
        this.setState({
            showExpenseView: false,
            ExpenseView: undefined
        })
    }
    updateStatus = (id, status) => {
        updateStatus(id, status).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.fetchList();
                if (res.status == "OK") {
                    setTimeout(function () {
                        window.location.reload()
                      }, 6000) }
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            console.error(err);
            toast.error("Error while updating status");
        })
    }

    render() {
        const { data, totalPages, totalRecords, currentPage, size, ExpenseView } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const menuItems = (text, record) => [
            <div ><a className="muiMenu_item" href="#"
                onClick={() => {
                    this.setState({ ExpenseView: record, showExpenseView: true })
                }}
            ><i className="fa fa-eye m-r-5" />
                <b>View</b></a></div>,
            <div ><a className="muiMenu_item" href="#"
                onClick={() => {
                    let { statusname } = this.state;
                    statusname = "APPROVED";
                    this.updateStatus(text.id, statusname);
                }}
            ><i className="fa fa-check m-r-5" />
                <b>Approve</b></a></div>,
                <div ><a className="muiMenu_item" href="#"
                onClick={() => {
                    let { statusname } = this.state;
                    statusname =  "REJECTED";
                    this.updateStatus(text.id, statusname);
                }}
            ><i className="fa fa-close m-r-5"/>
            <b>Reject</b></a></div>,
        ]
        const columns = [
            {
                title: 'Employee',
                width: 50,
                sorter: true,
                render: (text, record) => {
                  return <EmployeeListColumn
                    id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
                }
            }, 
            {
                title: 'Expense Type',
                width: 50,
                render: (text, record) => {
                    return <>
                        <div>Reimbursement</div>
                    </>
                }
            },
            {
                title: 'Category',
                width: 50,
                render: (text, record) => {
                    return <span>{text && text ? record.category?.name : "-"}</span>
                  }
            },
            {
                title: 'Expense Spend Date',
                width: 50, 
                sorter: true,
                render: (text, record) => {
                    return <>
                        <div>{getReadableDate(record.spenddate != null ? record.spenddate : "NA")}</div>
                    </>
                }

            },
            {
                title: 'Created Date',
                width: 50, 
                sorter: true,
                render: (text, record) => {
                    return <>
                        <div>{getReadableDate(record.createdOn != null ? record.createdOn : "NA")}</div>
                    </>
                }

            },
            {
                title: 'Amount', 
                width: 50,
                sorter: true,
                render: (text, record) => {
                    return <>
                        <div>{record.amountspent != '' ? record.amountspent : "0"}</div>
                    </>
                }

            },
             
            {
                title: 'Receipt',  
                width: 50,
                render: (text, record) => {
                    return <Anchor onClick={() => {
                      fileDownload(text.id, text.id, "EXPENSES", text.fileName); 
                    }}title={text.fileName}>
                    <i className='fa fa-download'></i> Download
                    </Anchor>
                  }

            },
            {
                title: 'Action',
                width: 50,
                render: (text, record) => (
                  <div className="">
                   {isCompanyAdmin &&  <TableDropDown menuItems={menuItems(text, record)} />}
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
                                <h3 className="tablePage-title">Work Expenses</h3>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mt-3 mb-3 table-responsive">
                            {verifyOrgLevelViewPermission("Pay Work Expenses") &&
                                <Table id='Table-style' className="table-striped "
                                    pagination={{
                                        total: totalRecords,
                                        showTotal: (total, range) => {
                                            return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                                        },
                                        showSizeChanger: true, onShowSizeChange: this.pageSizeChange,
                                        itemRender: itemRender,
                                        pageSizeOptions: [10,30, 50, 100],
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
                                    {!verifyOrgLevelViewPermission("Pay Work Expenses") && <AccessDenied></AccessDenied>}
                            </div>
                        </div>
                    </div>
                </div>
                <Modal enforceFocus={false} size={"lg"} show={this.state.showExpenseView} onHide={this.hideExpenseView} >
                    <Header closeButton>
                        <h5 className="modal-title">View Claim</h5>
                    </Header>
                    <Body>
                        {ExpenseView && <ExpenseViewer ExpenseView={ExpenseView} />}
                    </Body>
                </Modal>
            </>

        );
    }
}
