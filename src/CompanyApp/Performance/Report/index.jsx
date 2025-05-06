import { Table } from 'antd';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { itemRender } from "../../../paginationfunction";
import {  getPerformanceReportReviewList } from './service';
import { getTitle, getUserType } from '../../../utility'; 
const { Header, Body, Footer, Dialog } = Modal;
export default class EmployeePerformanceReviewReport extends Component {
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
    getPerformanceReportReviewList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
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
  onTableDataChange = (d, filter, sorter) => {
    this.setState({
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
    }, () => {
      this.fetchList();
    })
  }
  updateList = (performanceTemplate) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == performanceTemplate.id);
    if (index > -1)
      data[index] = performanceTemplate;
    else {
      data = [performanceTemplate, ...data];
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
  updateSelf=()=>{
    this.setState({ self: !this.state.self }); 
    this.fetchList();
  } 
  render() {
    const isAdmin = getUserType() == 'COMPANY_ADMIN';
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const columns = [
      {
        title: 'Employee',
        sorter: false,
        render: (text, record) => {
          return <Link className="page-link bg-transparent" to={`/app/company-app/performance/report/details/'${text.id}`} >
          {text.employeesId} - {text.employee.name}</Link> 
          
        }
      },
      {
        title: 'Review Period From',
        dataIndex: 'fromDate',
        sorter: true,
      },
      {
        title: 'Review Period To',
        dataIndex: 'toDate',
        sorter: true,
      },
      {
        title: 'Template Name',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: 'Reviewed By',
        dataIndex: 'reviewedBy',
        sorter: false,
      },
      {
        title: 'Review Date',
        sorter: true,
        render: (text, record) => {
          return <span>{text.submitedByReviewerOn.replace('T',' ')}</span>
          
        }
      },
     
    ]
    return (
      <div className="page-wrapper">
        <Helmet>
          <title>Performance Reviews  | {getTitle()}</title>
          <meta name="description" content="Performance Review page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col-6">
                <h3 className="page-title">Performance Review</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item active">Performance Review</li>
                </ul>
              </div> 
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">

                <Table className="table-striped table-border"
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
    );
  }
}
