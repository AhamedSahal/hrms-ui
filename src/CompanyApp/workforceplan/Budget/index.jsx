import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { getBudgetList } from './service';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import { getForecastList } from '../Forecast/service';
import { getTitle, getUserType, verifyOrgLevelViewPermission } from '../../../utility';
import BudgetAction from './BudgetAction';
import { itemRender } from "../../../paginationfunction";
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const { Header, Body, Footer, Dialog } = Modal;
export default class Budget extends Component {
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
    if(verifyOrgLevelViewPermission("Plan Workforce Plan")){
    getBudgetList(this.state.q, this.state.page, this.state.size, this.state.sort, "APPROVED").then(res => {

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
  updateList = (Budget) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == Budget.id);
    if (index > -1)
      data[index] = Budget;
    else {
      data.push(Budget);
    }
    this.setState({ data },
      () => {
        this.hideBudgetAction();
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
      showForm: false

    })
  }
  hideBudgetAction = () => {
    this.setState({
      showBudgetAction: false

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
  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size));
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const columns = [
      {
        title: 'Department',
        sorter: false,
        render: (text, record) => {
          return <>
            <div>{record.department?.name}</div>
          </>
        }
      },
      {
        title: 'Job Title',
        dataIndex: 'name',
        sorter: true,
      },

      {
        title: 'Requested no of Resources',
        dataIndex: 'persons',
        sorter: true,
      },
      {
        title: 'Approved no of Resources',
        sorter: true,
        dataIndex: 'appnoofresources',
      },
      {
        title: 'Initiated  By',
        sorter: false,
        render: (text, record) => {
          return <EmployeeListColumn
            id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
        }
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
             
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
              {verifyOrgLevelViewPermission("Plan Workforce Plan") &&
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
                  {!verifyOrgLevelViewPermission("Plan Workforce Plan") && <AccessDenied></AccessDenied>}
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
       
      </>
    );
  }
} 