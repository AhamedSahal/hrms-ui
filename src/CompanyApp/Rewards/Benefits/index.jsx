import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import BenefitUploadDocument from './BenefitUploadDocument';
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
import GradesDropdown from '../../ModuleSetup/Dropdown/GradesDropdown';
import { getBenefitSelfList, getGradeEmployeelist } from '../../Employee/detail/benefits/service';
import { getEmployeeId, getReadableDate, getTitle, getUserType, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../utility';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import BenefitView from './BenefitView';
import { fileDownload } from '../../../HttpRequest';
import { withInfo } from 'antd/lib/modal/confirm';
import BenefitApprovalAction from './BenefitApprovalAction';
import TableDropDown from '../../../MainPage/tableDropDown';
import AccessDenied from './../../../MainPage/Main/Dashboard/AccessDenied'
const { Header, Body, Footer, Dialog } = Modal;
export default class Benefits extends Component {
    constructor(props) {
        super(props);

        this.state = {
            employeeId: getUserType() == 'COMPANY_ADMIN' ? '' : getEmployeeId(),
            gradesId: 0,
            showYearTable: false,
            showViewForm: false,
            data: [],
            data1: [],
            q: "",
            page: 0,
            size: 10,
            sort: "id,asc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            tableView: 1,
            isShow: getUserType() == 'COMPANY_ADMIN' ? 1 : 0,
            status: true,
            empshow: 0,
            year: new Date().getFullYear().toString(),
            isGradeTableShow: 0
        };
    }
    componentDidMount() {
        if (!this.isCompanyAdmin) {
            this.fetchList();
        }
    }
    fetchList = () => {
        if(verifyOrgLevelViewPermission("Reward Benefits")){
        {
            // Employee wise list-HR

            (!this.isEmployee && this.state.employeeId != '' && getBenefitSelfList(this.state.employeeId, this.state.q, this.state.page, this.state.size, this.state.sort,0).then(res => {
                if (res.status == "OK") {
                    this.setState({
                        data: res.data.list,
                        totalPages: res.data.totalPages,
                        totalRecords: res.data.totalRecords,
                        currentPage: res.data.currentPage + 1,
                        employeeName: res.data.employeeName
                    })
                }
            }))
        }

        {
        //   Employee self list employee side
            (!this.isCompanyAdmin && this.state.isShow == 0 && getBenefitSelfList(this.state.employeeId, this.state.q, this.state.page, this.state.size, this.state.sort,0).then(res => {
                if (res.status == "OK") {
                    this.setState({
                        data: res.data.list,
                        totalPages: res.data.totalPages,
                        totalRecords: res.data.totalRecords,
                        currentPage: res.data.currentPage + 1,
                        employeeName: res.data.employeeName
                    })
                }
            }))
        }
        }
    }
    fetchGradeList = () => {
        this.setState({
            isGradeTableShow: 1
        })
        getGradeEmployeelist(this.state.gradesId, this.state.year, this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
            if (res.status == "OK") {
                this.setState({
                    data1: res.data.list,
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
            this.fetchList();
        })
    }

    onTableDataChangeTwo = (d, filter, sorter) => {
        this.setState({
            page: d.current - 1,
            size: d.pageSize,
            sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
        }, () => {
            this.fetchGradeList();
        })
    }
    updateList = (Benefits) => {
        let { data } = this.state;
        let index = data.findIndex(d => d.id == Benefits.id);
        if (index > -1)
            data[index] = Benefits;
        else {
            data = [Benefits, ...data];
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

    pageSizeChangeTwo = (currentPage, pageSize) => {
        this.setState({
            size: pageSize,
            page: 0
        }, () => {
            this.fetchGradeList();

        })

    }
    handleYearTable = () => {
        this.setState({showYearTable: true})
        this.fetchGradeList()
    }
    hideForm = () => {
        this.setState({
            showForm: false
        })
        this.setState({
            showViewForm: false
        })
    }
    hideApprovalForm = () => {
        this.setState({
            showApprovalForm: false
        })
    }
    handleCheck = () => {
        this.setState({
            status: this.state.status == true ? false : true,
            empshow: this.state.status == true ? 1 : 0,
            employeeId: 0,
            year: "",
            gradesId: 0,
            showYearTable: false

        }, () => {
            this.fetchList1();

        })

    }
    fetchList1 = () => {
        if (this.state.empshow == 1 && this.state.gradesId > 0) {

            this.fetchGradeList();
        }
        if (this.state.empshow == 1 && this.state.employeeId != "") {
            this.fetchList();
        }
    }
    render() {
        let isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
        let isEmployee = getUserType() == 'EMPLOYEE';
        const { data, data1, totalPages, totalRecords, currentPage, size, tableView, DocUpdate, benefitApproval } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const menuItems = (text, record) => {
            const items = [];
            items.push(
                <div >
                    <a className="muiMenu_item" href="#" onClick={() => {
                        this.setState({ showViewForm: true })
                        this.setState({ Benefits: text })
                    }} >
                        <i className="fa fa-pencil m-r-5"></i> View</a>
                </div>)
            if (isEmployee && text.paymenttype != "1" && text.active) {
                items.push(<div> <a className="muiMenu_item" href="#" onClick={() => {
                    this.setState({ DocUpdate: text, showForm: true })
                }} >
                    <i className="fa fa-file m-r-5"></i> Upload Documents</a>
                </div>)
            }
            return items;
        }
       
        const columns = [
            {
                title: 'Grades',
                sorter: true,
                className: 'pre-wrap',
                render: (text, record) => {
                    return <span>{text && text ? record.grades1Id?.name : "-"}</span>
                }
            },
            {
                title: 'Benefit Name',
                dataIndex: 'name',
                sorter: true,
                className: 'pre-wrap'
            },
            {
                title: 'Start Date',
                sorter: true,
                render: (text, record) => {
                    return <>
                        <div>{getReadableDate(record.startDate)}</div>
                    </>
                }
            },
            {
                title: 'Payment Type',
                sorter: true,
                render: (text, record) => {
                    return <>
                        {text.paymenttype == 0 ? "Payroll" : text.paymenttype == 1 ? "Provided" : text.paymenttype == 2 ? "Reimbursed" : ""}

                    </>
                }
            }, {
                title: 'Payment Cycle',
                sorter: true,
                render: (text, record) => {
                    return <>
                        {text.paymentcycle == 0 ? "Monthly" : text.paymentcycle == 1 ? "Quarterly" : text.paymentcycle == 2 ? "Half Yearly" : text.paymentcycle == 3 ? "Annually" : text.paymentcycle == 4 ? "24 Months" : ""}
                    </>
                }
            },
            {
                title: 'Due Date',
                sorter: true,
                render: (text, record) => {
                    return <>
                        <div>{getReadableDate(record.dueDate)}</div>
                    </>
                }
            },
            {
                title: 'Eligibility',
                sorter: true,
                render: (text, record) => {
                    return <>
                        {text.eligibility == 0 ? "Employee" : text.eligibility == 1 ? "Employee + Spouse" : text.eligibility == 2 ? "Employee + Spouse + 1 child" : text.eligibility == 3 ? "Employee + Spouse + 2 child" : text.eligibility == 4 ? "Employee + Spouse + 3 child" : ""}
                    </>
                }
            },
            {
                title: 'Max Limit Per Person',
                dataIndex: 'maxperson',
                sorter: true
            },
            {
                title: 'Max Benefits Limit',
                dataIndex: 'maxemployee',
                sorter: true
            },    
            {
                title: 'Status',             
                sorter: true,
                render: (text, record) => {
                    return <div className={text.active ? "badge bg-inverse-success " : "badge bg-inverse-danger"}>{text.active?<i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{text.active?"Active":"InActive"}</div>
                }
             
            },
            {
                title: 'Action',
                width: 50,
                className: 'text-center',
                render: (text, record) => (
                  <div className="">
                    <TableDropDown menuItems={menuItems(text, record)} />
                  </div>
                ),
              },
        ]

        const yearMenuItems = (text, record) => [
            <div ><a className="muiMenu_item" href="#" onClick={() => {
                this.setState({ Benefits: text })
            }} > <i className="fa fa-pencil m-r-5"></i> Edit</a></div>,
        ]
        const Yearcolumns = [
            {
                title: 'Employee',
                sorter: false,
                render: (text, record) => {
                    return <EmployeeListColumn
                        id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}>
                    </EmployeeListColumn>
                }
            },
            {
                title: 'Grades',
                sorter: true,
                render: (text, record) => {
                    return <span>{text && text ? record.grades1Id?.name : "-"}</span>
                }
            },
            {
                title: 'Benefit Name',
                dataIndex: 'name',
                sorter: true
            },
            {
                title: 'Payment Type',
                sorter: true,
                render: (text, record) => {
                    return <>
                        {text.paymenttype == 0 ? "Payroll" : text.paymenttype == 1 ? "Provided" : text.paymenttype == 2 ? "Reimbursed" : ""}
                    </>
                }
            },
            {
                title: 'Start Date',
                sorter: true,
                render: (text, record) => {
                    return <>
                        <div>{getReadableDate(record.startDate)}</div>
                    </>
                }
            },
            {
                title: 'Due Date',
                sorter: true,
                render: (text, record) => {
                    return <>
                        <div>{getReadableDate(record.dueDate)}</div>
                    </>
                }
            },

            {
                title: 'Max Limit Per Person',
                dataIndex: 'maxperson',
                sorter: true
            },
            {
                title: 'Max Benefits Limit',
                dataIndex: 'maxemployee',
                sorter: true
            },
            {
                title: 'Utilized Amount',
                render: (text, record) => {
                    return <>
                        <div> - </div>
                    </>
                },
                sorter: true
            },
            {
                title: 'Balance',
                render: (text, record) => {
                    return <>
                        <div> - </div>
                    </>
                },
                sorter: true
            },
           
            {
                title: 'Status',
                render: (text, record) => {
                    return <>
                        {text.benefitStatus == "NOT_DUE" ? "Not Due" :
                            text.benefitStatus == "DUE" ? "Due" :
                                text.benefitStatus == "SENT_TO_PAYROLL" ? "Sent to Payroll" :
                                    text.benefitStatus == "NOT_CLAIMED" ? "Not Claimed" :
                                        text.benefitStatus == "PENDING_APPROVAL" ? "Pending Approval" :
                                            text.benefitStatus == "APPROVED" ? "Approved" :
                                                text.benefitStatus == "REJECTED" ? "Rejected" :
                                                    text.benefitStatus == "PROVIDED" ? "Provided" : "-"}
                    </>
                },
                sorter: true
            },
            {
                title: 'Action',
                width: 50,
                className: 'text-center',
                render: (text, record) => (
                  <div className="">
                    <TableDropDown menuItems={yearMenuItems(text, record)} />
                  </div>
                ),
              },
           
        ]
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Benefits  | {getTitle()}</title>
                    <meta name="description" content="Announcement page" />
                </Helmet>
                {/* Page Content */}
                <div className="mt-3 content container-fluid">
                    {/* Page Header */}
                    < div className='m-4  Table-card' >
                    {verifyOrgLevelViewPermission("Reward Benefits") && <>
                        <div className="benifitCard tableCard-body">
                            <div className="mt-3 row align-items-center">
                                <div className=" col-md-3">
                                    {isCompanyAdmin && <h3 className="tablePage-title">Benefits</h3>}
                                    {!isCompanyAdmin && <h3 className="tablePage-title">My Benefits</h3>}
                                </div>
                                {this.state.empshow == 0 && isCompanyAdmin && <><div id='benefitsPageHeaderText' className="col-md-3">
                                    <div className="float-left col-auto ml-auto">
                                        <label className="pl-2 text-dark"> Year Wise</label> &nbsp;
                                        <i onClick={() => this.handleCheck()} className={!this.state.status ? 'fa-2x fa fa-toggle-off text-danger' : 'fa-2x fa fa-toggle-on text-success'}></i>
                                        <label className="pl-2 text-dark"> Employee Wise</label> &nbsp;
                                    </div>
                                </div></>}
                                {this.state.empshow == 1 && isCompanyAdmin && <><div id='benefitsPageHeaderText' className="col-md-3">
                                    <div className="float-left col-auto ml-auto">
                                        <label className="pl-2 text-dark"> Year Wise</label> &nbsp;
                                        <i onClick={() => this.handleCheck()} className={!this.state.status ? 'fa-2x fa fa-toggle-off text-danger' : 'fa-2x fa fa-toggle-on text-success'}></i>
                                        <label className="pl-2 text-dark"> Employee Wise</label> &nbsp;
                                    </div>
                                </div></>}
                                {this.state.empshow == 0 && isCompanyAdmin && <div id='benefitsPageHeaderText' className="col-md-6">
                                    <div >
                                       
                                        <EmployeeDropdown onChange={e => {
                                            this.setState({
                                                employeeId: e.target.value
                                            }, () => {
                                                this.fetchList();
                                            })

                                        }}></EmployeeDropdown>
                                    </div>
                                </div>}
                                {this.state.empshow == 1 && isCompanyAdmin && <>< div className=" col-md-2" >
                                   
                                    <GradesDropdown
                                        onChange={e => {
                                            this.setState({
                                                gradesId: e.target.value
                                            })

                                        }}
                                    ></GradesDropdown>
                                </div>
                                    <div className="col-md-2">
                                        
                                        <select className="form-control" defaultValue={this.state.year}
                                            onChange={(e) => { this.setState({ year: e.target.value }) }}>
                                            <option value="">Select Year</option>
                                            <option value="2019">2019</option>
                                            <option value="2020">2020</option>
                                            <option value="2021">2021</option>
                                            <option value="2022">2022</option>
                                            <option value="2023">2023</option>
                                            <option value="2024">2024</option>
                                            <option value="2025">2025</option>
                                        </select>
                                        {/* </div> */}
                                    </div>
                                    <div className="col-sm-2 col-md-2" style={{ paddingTop: "25px" }}>
                                        <button className="btn btn-primary btn-block"
                                            onClick={() => { this.handleYearTable() }}>Search</button>
                                    </div> </>}
                            </div>
                        </div>
                        {/* /Page Header */}
                        {(<div className="row">
                            <div className="col-md-12">
                                <div className="p-3 table-responsive">
                                    {this.state.empshow == 0 && this.state.employeeId == '' && <><div className="alert alert-warning alert-dismissible fade show" role="alert">
                                        <span>Please select Employee.</span>
                                    </div></>}
                                    {this.state.empshow == 1 && !this.state.showYearTable && <><div className="alert alert-warning alert-dismissible fade show" role="alert">
                                        <span>Please Select Grade And Year For View Benefits.</span>
                                    </div></>}
                                    {this.state.empshow == 0 && this.state.employeeId != "" && <Table id='Table-style' className="table-striped "
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
                                        // bordered data1
                                        dataSource={[...data]}
                                        rowKey={record => record.id}
                                        onChange={this.onTableDataChange}
                                    />}

                                    {this.state.empshow == 1 && this.state.gradesId != 0 && this.state.year != 0 && this.isGradeTableShow != 0 && this.state.showYearTable && <Table id='Table-style' className="table-striped "
                                        pagination={{
                                            total: totalRecords,
                                            showTotal: (total, range) => {
                                                return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                                            },
                                            showSizeChanger: true, onShowSizeChange: this.pageSizeChangeTwo,
                                            itemRender: itemRender,
                                            pageSizeOptions: [10, 20, 50, 100],
                                            // current: currentPage,
                                            // defaultCurrent: 1,
                                        }}
                                        style={{ overflowX: 'auto' }}
                                        columns={Yearcolumns}
                                        // bordered data1
                                        dataSource={[...data1]}
                                        rowKey={record => record.id}
                                        onChange={this.onTableDataChangeTwo}
                                    />}

                                </div>
                            </div>
                        </div>)}
                        </>}
                        {!verifyOrgLevelViewPermission("Reward Benefits") && <AccessDenied></AccessDenied>}
                    </div>
                    {/* /Page Content */}


                    <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


                        <Header closeButton>
                            <h5 className="modal-title">Upload Documents</h5>

                        </Header>
                        <Body>
                            <BenefitUploadDocument updateList={this.updateList} DocUpdate={this.state.DocUpdate}>
                            </BenefitUploadDocument>
                        </Body>


                    </Modal>

                    <Modal enforceFocus={false} size={"md"} show={this.state.showApprovalForm} onHide={this.hideApprovalForm} >


                        <Header closeButton>
                            <h5 className="modal-title">Approval Claim</h5>

                        </Header>
                        <Body>
                            <BenefitApprovalAction updateList={this.updateList} benefitApproval={this.state.benefitApproval}>
                            </BenefitApprovalAction>
                        </Body>


                    </Modal>

                    {/* view */}
                    
                    <Modal enforceFocus={false} size={"xl"} show={this.state.showViewForm} onHide={this.hideForm} >


                        <Header closeButton>
                            <h5 className="modal-title">View</h5>

                        </Header>
                        <Body>
                            <BenefitView benefits={this.state.Benefits}>
                            </BenefitView>
                        </Body>


                    </Modal>
                </div >
            </div >
        );
    }
}
