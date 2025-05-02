import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import BenefitsForm from './form';
import { getBenefitsTypeList } from './service';
import { getReadableDate, getTitle, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../utility';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const { Header, Body, Footer, Dialog } = Modal;
export default class Benefits extends Component {
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
            currentPage: 1
        };
    }
    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        if(verifyOrgLevelViewPermission("Module Setup Manage")){
        getBenefitsTypeList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

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
    onTableDataChange = (d, filter, sorter) => {
        this.setState({
            page: d.current - 1,
            size: d.pageSize,
            sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
        }, () => {
            this.fetchList();
        })
    }
    updateList = (Benefits) => {
        this.setState({
            showForm: false
        })
        this.fetchList();
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

    render() {
        const { data, totalPages, totalRecords, currentPage, size } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const columns = [
            {
                title: 'Grades',
                sorter: true,
                className: 'pre-wrap',
                render: (text, record) => {
                    return <span>{text && text ? record.grades?.name : "-"}</span>
                }
            },
            {
                title: 'Name',
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

                                this.setState({ Benefits: text, showForm: true })
                            }} >
                                <i className="fa fa-pencil m-r-5"></i> Edit</a>

                        </div>
                    </div>
                ),
            },
        ]
        return (
            <>
                {/* Page Content */}
                < div className="page-container content container-fluid" >
                    {/* Page Header */}
                    < div className="tablePage-header" >
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Benefit Type</h3>
                            </div>

                            <div className="mt-2 float-right col-auto ml-auto">
                            {verifyOrgLevelEditPermission("Module Setup Manage") &&
                                <a href="#" className="btn apply-button btn-primary" onClick={() => {
                                    this.setState({
                                        showForm: true
                                    })

                                }}><i className="fa fa-plus" /> Add</a>}
                            </div>

                        </div>
                    </div >

                    {/* /Page Header */}
                    < div className="row" >
                        <div className="col-md-12">
                            <div className="mt-3 mb-3 table-responsive">
                            {verifyOrgLevelViewPermission("Module Setup Manage") &&
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
                                />}
                                {!verifyOrgLevelViewPermission("Module Setup Manage") && <AccessDenied></AccessDenied>}              
                            </div>
                        </div>

                    </div >


                    {/* /Page Content */}


                    <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


                        <Header closeButton>
                            <h5 className="modal-title">{this.state.Benefits ? 'Edit' : 'Add'} Benefit Type</h5>

                        </Header>
                        <Body>
                            <BenefitsForm updateList={this.updateList} Benefits={this.state.Benefits}>
                            </BenefitsForm>
                        </Body>


                    </Modal>
                </div >
            </>
        );
    }
}
