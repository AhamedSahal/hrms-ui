import React, { Component } from 'react';
import jsPDF from 'jspdf';
import { Table } from 'antd';
import html2canvas from "html2canvas";
import { itemRender } from "../../../paginationfunction";
import { getCurrency, getLogo, getReadableDate } from '../../../utility';
import { getMainActivityList } from './service'
export default class ProjectActivityViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            no: 0,
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            payslip: props.payslip || {
                logo: getLogo(),
                projid: 0
            }
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.payslip && nextProps.payslip != prevState.payslip) {
            return ({ payslip: nextProps.payslip })
        } else if (!nextProps.payslip) {
            return prevState.payslip || ({
                payslip: {
                    projid: 0
                }
            })
        }
        return null;
    }
    componentDidMount() {
        this.fetchList()
    }

    fetchList = () => {
        this.setState({
            projid: this.state.payslip.project.id,
            no: 1
        })
        this.get();
    }
    get = () => {

        getMainActivityList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.payslip.project.id).then(res => {
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
    render() {
        const { project, projActivitycost, projectCode, activity, projtotalcost } = this.state.payslip
        const { data, totalPages, totalRecords, currentPage, size, payslip } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }

        const columns = [
            {
                title: 'Activity Name',
                render: (text, record) => {
                    return <>
                        <div>{record.activityName}  </div>
                    </>
                }
            },
            {
                title: 'Project Start Date',
                render: (text, record) => {
                    return <>
                        <div>{getReadableDate(record.projstartdate != null ? record.projstartdate : "NA")}</div>
                    </>
                }

            },
            {
                title: 'Project End Date',
                render: (text, record) => {
                    return <>
                        <div>{getReadableDate(record.projenddate != null ? record.projenddate : "NA")}</div>
                    </>
                }

            },
            {
                title: 'Activity Start Date',
                render: (text, record) => {
                    return <>
                        <div>{getReadableDate(record.activitystartdate != null ? record.activitystartdate : "NA")}</div>
                    </>
                }

            },
            {
                title: 'Activity End Date',
                render: (text, record) => {
                    return <>
                        <div>{getReadableDate(record.activityenddate != null ? record.activityenddate : "NA")}</div>
                    </>
                }

            },
            {
                title: 'Project Budget',
                render: (text, record) => {
                    return <>
                        <div>{record.projtotalcost}</div>
                    </>
                }

            },
            {
                title: 'Activity Cost',
                render: (text, record) => {
                    return <>
                        <div>{record.projActivitycost}</div>
                    </>
                }

            },
            {
                title: 'Project Status',
                render: (text, record) => {
                    return <>
                        <span className={record.projectStatus == "NOT_STARTED" ? "badge bg-inverse-secondary " : record.projectStatus == "INPROGRESS" ? "badge bg-inverse-warning " : record.projectStatus == "COMPLETED" ? "badge bg-inverse-success " : "badge bg-inverse-danger"}>
                            {record.projectStatus == "NOT_STARTED" ? <i className="pr-2 fa fa-ban record-secondary"></i> : record.projectStatus == "INPROGRESS" ? <i className="pr-2 fa fa-hourglass-o text-warning"></i> : record.projectStatus == "COMPLETED" ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
                                record.projectStatus == "NOT_STARTED" ? 'Not Started' : record.projectStatus == "INPROGRESS" ? 'In Progress' : record.projectStatus == "COMPLETED" ? 'Completed' : 'Overdue'
                            }</span>
                    </>
                }

            },
            {
                title: 'Activity Status',
                render: (text, record) => {
                    return <>
                        <span className={record.projectActivityStatus == "NOT_STARTED" ? "badge bg-inverse-secondary " : record.projectActivityStatus == "INPROGRESS" ? "badge bg-inverse-warning " : record.projectActivityStatus == "COMPLETED" ? "badge bg-inverse-success " : "badge bg-inverse-danger"}>
                            {record.projectActivityStatus == "NOT_STARTED" ? <i className="pr-2 fa fa-ban record-secondary"></i> : record.projectActivityStatus == "INPROGRESS" ? <i className="pr-2 fa fa-hourglass-o text-warning"></i> : record.projectActivityStatus == "COMPLETED" ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
                                record.projectActivityStatus == "NOT_STARTED" ? 'Not Started' : record.projectActivityStatus == "INPROGRESS" ? 'In Progress' : record.projectActivityStatus == "COMPLETED" ? 'Completed' : 'Overdue'
                            }</span>
                    </>
                }

            },


        ]
        return (
            <div className="row">
                <div className="col-md-12">
                    <div style={{ backgroundColor: "#36A1D4", color: "#EEF8FB", borderRadius: "5px", height: "35px" }} className="col-md-3">
                        <p style={{ textAlign: "center", fontWeight: "bold", paddingTop: "5px" }}>Project Name : {project.name} &nbsp;</p>
                    </div>
                </div> &nbsp;
                <div className="col-md-12">
                    <div className="table-responsive">
                    <Table id='Table-style' className="table-striped "
                            style={{ overflowX: 'auto' }}
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
                            columns={columns}
                            // bordered
                            dataSource={[...data]}
                            rowKey={record => record.id}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
