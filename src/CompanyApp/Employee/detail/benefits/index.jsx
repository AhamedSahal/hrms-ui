import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { itemRender } from '../../../../paginationfunction';
import { verifyEditPermission, getReadableDate } from '../../../../utility';
import { getBenefitSelfList } from './service';

const { Header, Body, Footer, Dialog } = Modal;
export default class BenefitsDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            employeeId: props.employeeId || 0,
            data: [],
            status: 1,
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
        getBenefitSelfList(this.state.employeeId, this.state.q, this.state.page, this.state.size, this.state.sort,this.state.status).then(res => {

            if (res.status == "OK") {
                this.setState({
                    data: res.data.list,
                    totalPages: res.data.totalPages,
                    totalRecords: res.data.totalRecords,
                    currentPage: res.data.currentPage + 1,
                    employeeName: res.data.employeeName
                })
            }

        })
    }
    updateList = (skill) => {
        let { data } = this.state;
        let index = data.findIndex(d => d.id == skill.id);
        if (index > -1)
            data[index] = skill;
        else {
            data = [skill, ...data];
        }
        this.setState({ data },
            () => {
                this.hideForm();
            });
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
            skill: undefined
        })
    }

    render() {
        const { data, totalPages, totalRecords, currentPage, size } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const isEditAllowed = true;//verifyEditPermission("EMPLOYEE");
        const columns = [
            {
                title: 'Benefit Name',
                dataIndex: 'name',
                sorter: true,
            },
            {
                title: 'Grades',
                render: (text, record) => {
                    return <span>{text && text ? record.grades1Id?.name : "-"}</span>
                },
            },
            {
                title: 'Eligibility',
                render: (text, record) => {
                    return <>
                        {text.eligibility == 0 ? "Employee" : text.eligibility == 1 ? "Employee + Spouse" : text.eligibility == 2 ? "Employee + Spouse + 1 child" : text.eligibility == 3 ? "Employee + Spouse + 2 child" : text.eligibility == 4 ? "Employee + Spouse + 3 child" : ""}
                    </>
                }
            },
            {
                title: 'Payment Cycle',
                render: (text, record) => {
                    return <>
                        {text.paymentcycle == 0 ? "Monthly" : text.paymentcycle == 1 ? "Quarterly" : text.paymentcycle == 2 ? "Half Yearly" : text.paymentcycle == 3 ? "Annually" : text.paymentcycle == 4 ? "24 Months" : ""}
                    </>
                },
            },
            {
                title: 'Due Date',
                render: (text, record) => {
                    return <>
                        <div>{getReadableDate(record.dueDate)}</div>
                    </>
                }
            },
            {
                title: 'Max Per Person',
                dataIndex: 'maxperson',
                sorter: true,
            },
            {
                title: 'Total Max',
                dataIndex: 'maxemployee',
                sorter: true,
            },
        ]
        return (
            <>

                {/* /Page Header */}
                <div className="row">
                    <div className="mt-3 col-md-12">
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive">

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
                                    />


                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* /Page Content */}

            </>
        );
    }
}
