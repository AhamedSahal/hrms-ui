import React, { Component } from 'react';
import { Table } from 'antd';
import moment from "moment";
import { itemRender } from '../../../paginationfunction';
import { Modal, Anchor } from 'react-bootstrap';
import { fileDownload } from '../../../HttpRequest';
import { getUserType } from '../../../utility';
import BenefitApprovalAction from './BenefitApprovalAction';
import { getBenefitSelfActionList } from '../../Employee/detail/benefits/service';
const { Header, Body, Footer, Dialog } = Modal;
let isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class BenefitView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            benefitsInfo: props.benefits,
            benefitsListId: props.benefits.id,
            employeeId: props.benefits.employee?.id,
            q: "",
            data: [],
            benefitActionInfo: [],
            page: 0,
            size: 10,
            showApprovalForm: false,
            sort: "id,asc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1
        }
    }

    componentDidMount() {
        this.fetchList();
    }

    fetchList = () => {

        getBenefitSelfActionList(this.state.employeeId, this.state.q, this.state.page, this.state.size, this.state.sort, this.state.benefitsListId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    data: res.data.list,
                    totalPages: res.data.totalPages,
                    totalRecords: res.data.totalRecords,
                    currentPage: res.data.currentPage + 1,
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

    hideApprovalForm = () => {
        this.setState({
            showApprovalForm: false
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

    render() {
        let { data, totalPages, totalRecords, currentPage, size, benefitsInfo } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const columns = [
            {
                title: 'S.No',
                sorter: true,
                render: (text, record,index) => {
                    return <>
                        {index+1}
                    </>
                }
            },
            {
                title: 'Request Claimed Amount',
                dataIndex: 'requestClaimedAmount',
                sorter: true,
             
            },
       
            {
                title: 'Claimed Amount',
                //dataIndex: 'claimedAmount',
                sorter: true,
                render: (text, record) => {
                    return <>
                        {text.claimedAmount}
                    </>
                }
            },
            {
                title: 'Status',
                render: (text, record) => {
                    return <>
                        { text.benefitStatus == "NOT_DUE" ? "Not Due" :
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
                title: "Claimed  Date",
                sorter: true,
                render: (text, record) => {
                  return <span>{text && text.createdOn ? moment(text.createdOn).format("ll")  : "-"}</span>
                },
              },
              {
                title: "Approved Date",
                sorter: true,
                render: (text, record) => {
                  return <span>{text && text.approvedOn ? moment(text.approvedOn).format("ll")  : "-"}</span>
                },
              },
            {
                title: 'File ',
                sorter: true,
                width: 50,
                render: (text, record) => {
                    return <Anchor onClick={() => {
                        fileDownload(text.id, this.state.employeeId, "BENEFITS_DOCUMENT", text.fileName);
                    }} title={text.fileName}>
                        <i className='fa fa-download'></i> View
                    </Anchor>
                }
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
                        {isCompanyAdmin && this.state.benefitsInfo.active && text.active  && <div className="dropdown-menu dropdown-menu-right">
                              <>
                                <a className="dropdown-item" href="#" onClick={() => {

                                    this.setState({ benefitActionInfo: text, showApprovalForm: true })
                                }} >
                                    <i className="fa fa-check m-r-5"></i>Approval Action</a>
                            </>
                        </div>}

                    </div>
                ),
            }

        ]
        return (
            <>
                <div className='row'>
                    <div className="col-md-3">
                        <h5>Benefit Name</h5> 
                        <p>{benefitsInfo.name}</p>
                    </div>
                    <div className="col-md-3">
                        <h5 >Benefit Status</h5>
                        <p>
                        { benefitsInfo.benefitStatus == "NOT_DUE" ? "Not Due" :
                            benefitsInfo.benefitStatus == "DUE" ? "Due" :
                            benefitsInfo.benefitStatus == "SENT_TO_PAYROLL" ? "Sent to Payroll" :
                            benefitsInfo.benefitStatus == "NOT_CLAIMED" ? "Not Claimed" :
                            benefitsInfo.benefitStatus == "PENDING_APPROVAL" ? "Pending Approval" :
                            benefitsInfo.benefitStatus == "APPROVED" ? "Approved" :
                            benefitsInfo.benefitStatus == "REJECTED" ? "Rejected" :
                            benefitsInfo.benefitStatus == "PROVIDED" ? "Provided" : "-"}
                        </p>
                    </div>
                    <div className="col-md-3">
                        <h5>Max Benefits Limit</h5> 
                        <p>{benefitsInfo.maxemployee}</p>
                    </div>
                    <div className='col-md-12'>
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
                            // bordered data1
                            dataSource={[...data]}
                            rowKey={record => record.id}
                            onChange={this.onTableDataChange}
                        />
                    </div>

                </div>
                <Modal enforceFocus={false} size={"md"} show={this.state.showApprovalForm} onHide={this.hideApprovalForm} >


                    <Header closeButton>
                        <h5 className="modal-title">Approval Claim</h5>

                    </Header>
                    <Body>
                        <BenefitApprovalAction benefitApproval={this.state.benefitsInfo} benefitActionInfo={this.state.benefitActionInfo}>
                        </BenefitApprovalAction>
                    </Body>


                </Modal>
            </>


        )
    }
}

