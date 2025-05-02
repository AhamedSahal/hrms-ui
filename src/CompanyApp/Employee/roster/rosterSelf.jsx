import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import { getReadableDate, getTitle, getUserType, verifyOrgLevelViewPermission, verifySelfViewPermission, convertToUserTimeZoneWithAMPM } from '../../../utility';
import { getRosterSelf } from './service';
import EmployeeListColumn from '../employeeListColumn';
import EmployeeDropdown from "../../ModuleSetup/Dropdown/EmployeeDropdown";
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { BsSliders } from 'react-icons/bs';
const { Header, Body, Footer, Dialog } = Modal;
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class rosterSelf extends Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 2);
    var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);

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
      showFilter: false,
      fromDate: firstDay.toISOString().split('T')[0],
      toDate: lastDay.toISOString().split('T')[0]
    };
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    if (verifySelfViewPermission("Manage Roster")) {
      getRosterSelf(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.fromDate, this.state.toDate).then(res => {
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
  getListByEmployee = () => {
    getRosterSelf(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.fromDate, this.state.toDate).then(res => {
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
        title: 'Profile',
        render: (text, record) => {
          return <EmployeeListColumn id={text.employee.id} name={text.employee.name} employeeId={text.employeeId} ></EmployeeListColumn>
        },
        sorter: false,
      },
      {
        title: 'Roster Date',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{getReadableDate(record.rosterDate != null ? record.rosterDate : "NA")}</div>
          </>
        }

      },
      {
        title: 'Shift',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{record.shifts?.id != null ? record.shifts?.name : "NA"} </div>
          </>
        }
      },
      {
        title: 'Shift Time',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{record.shifts?.name == "WeekOff" ? "-" : record.shifts?.id != null ? (record.shiftstarttime == "00:00:00" && record.shiftendtime == "23:59:00") ? "12:00 AM" : convertToUserTimeZoneWithAMPM(record.shiftstarttime) != null ? convertToUserTimeZoneWithAMPM(record.shiftstarttime) : "NA" : "NA"} - {record.shifts?.name == "WeekOff" ? "-" : record.shifts?.id != null ? (record.shiftstarttime == "00:00:00" && record.shiftendtime == "23:59:00") ? "11:59 PM" : convertToUserTimeZoneWithAMPM(record.shiftendtime) != null ? convertToUserTimeZoneWithAMPM(record.shiftendtime) : "NA" : "NA"} </div>
          </>
        }
      },

    ]
    return (
      <>
        {/* filter */}
        < div id='page-head' >
          <div className="float-right col-md-5 btn-group btn-group-sm">
            <BsSliders className='filter-btn' size={30} onClick={() => this.setState({ showFilter: !this.state.showFilter })} />
          </div>
        </div>
        {this.state.showFilter &&
          <div className='mt-4 filterCard p-3'>

            <div className="row">
              <div className="col-md-3">
                <div className="form-group form-focus">
                  <input onChange={e => {
                    this.setState({
                      q: e.target.value
                    })
                  }} type="text" className="form-control floating" />
                  <label className="focus-label">Shift Name</label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group form-focus">
                  <input value={this.state.fromDate} onChange={e => {
                    this.setState({
                      fromDate: e.target.value
                    })
                  }} type="date" className="form-control floating" />
                  <label className="focus-label">From Date</label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group form-focus">
                  <input value={this.state.toDate} onChange={e => {
                    this.setState({
                      toDate: e.target.value
                    })
                  }} type="date" className="form-control floating" />
                  <label className="focus-label">To Date</label>
                </div>
              </div>
              <div className="col-md-3">
                <a href="#" onClick={() => {
                  this.fetchList();
                }} className="btn btn-success btn-block"> Search </a>
              </div>
            </div>
          </div>
        }
        {/* filter */}
        <div className="page-container content container-fluid">
          {/* Page Header */}
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">My Roster</h3>
              </div>

            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
                {verifySelfViewPermission("Manage Roster") &&
                  <Table id='Table-style' className="table-striped "
                    pagination={{
                      total: totalRecords,
                      showTotal: (total, range) => {
                        return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                      },
                      showSizeChanger: true, onShowSizeChange: this.pageSizeChange,
                      itemRender: itemRender,
                      pageSizeOptions: [30, 50, 100],
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
                {!verifySelfViewPermission("Manage Roster") && <AccessDenied></AccessDenied>}
              </div>
            </div>
          </div>
        </div>
      </>

      // <div className="row">
      //   <div className="col-md-12">
      //     <div className="table-responsive">
      //       <Table className="table-striped table-border"
      //         pagination={{
      //           total: totalRecords,
      //           showTotal: (total, range) => {
      //             return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
      //           },
      //           showSizeChanger: true, onShowSizeChange: this.pageSizeChange,
      //           itemRender: itemRender,
      //           pageSizeOptions: [30, 50, 100],
      //           current: currentPage,
      //           defaultCurrent: 1,
      //         }}
      //         style={{ overflowX: 'auto' }}
      //         columns={columns}
      //         // bordered
      //         dataSource={[...data]}
      //         rowKey={record => record.id}
      //         onChange={this.onTableDataChange}
      //       /> 


      //     </div>
      //   </div>
      // </div> 




    );
  }
}
