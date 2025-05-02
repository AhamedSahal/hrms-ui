import { Table } from 'antd';
import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { BsSliders } from 'react-icons/bs';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { getUserType, getEmployeeId, getCustomizedWidgetDate } from '../../../../utility';
import { itemRender } from '../../../../paginationfunction';
import { getOvertimeList } from '../Overtime/service';
import { Button } from '@mui/material';



export default class MyOvertimeApproval extends Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 2);
    var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    this.state = {
      employeeId: getUserType() == 'COMPANY_ADMIN' ? '' : getEmployeeId(),
      data: [],
      q: "",
      branchId: "",
      departmentId: "",
      jobTitleId: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      self: 1,
      showFilter: false,
      fromDate: firstDay.toISOString().split('T')[0],
      toDate: lastDay.toISOString().split('T')[0],
      selected: [],
      selectedArray: [],
      buttonState: true,
      preferredMethod: 'Self',
      selectedRowKeys: [],

    };
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    var empId = this.state.employeeId;
    if (this.state.self == 1) {
      empId = getEmployeeId()
    }
    getOvertimeList(this.state.branchId, this.state.departmentId, this.state.jobTitleId, this.state.q, this.state.fromDate, this.state.toDate, this.state.page, this.state.size, this.state.sort, this.state.self).then(res => {
      if (res.status == "OK") {
        this.setState({
          data: res.data.list,
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage + 1,
          employeeId: empId,
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


  getStyle(text) {
    if (text === 'REQUESTED') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i> Requested</span>;
    }
    if (text === 'CANCELED') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i> Canceled</span>;
    }
    if (text === 'APPROVED') {
      return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i> Approved</span>;
    }
    if (text === 'REJECTED') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i> Rejected</span>;
    }
    if (text === 'PENDING') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i> Pending</span>;
    }
    return 'black';
  }


  render() {
    const { data, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const columns = [

      {
        title: 'Date',
        dataIndex: 'forDate',
        sorter: false,
        render: (text, record) => {
          return <>
            <div>{getCustomizedWidgetDate(record.forDate)}</div>
          </>
        }
      },
      {
        title: 'Plan Hours',
        dataIndex: 'plannedHours',
        sorter: false,
        className: "text-center",
        render: (text, record) => {
          return <>
            <div>{(record.plannedHours).toFixed(2)}</div>
          </>
        }
      },
      {
        title: 'Actual Hours',
        dataIndex: 'actualHours',
        sorter: false,
        className: "text-center",
        render: (text, record) => {
          return <>
            <div>{(record.actualHours).toFixed(2)}</div>
          </>
        }
      },
      {
        title: 'Actual Overtime',
        dataIndex: 'overTime',
        sorter: false,
        className: "text-center",
        render: (text, record) => {
          return <>
            <div>{(Number(record.overTime)).toFixed(2)}</div>
          </>
        }
      },
      {
        title: 'Approved Overtime',
        dataIndex: 'approvedHours',
        sorter: false,
        className: "text-center",
        render: (text, record) => {
          return <>
            <div>{(record.approvedHours).toFixed(2)}</div>
          </>
        }
      },

      {
        title: 'Status',
        dataIndex: 'overTimeApprovalStatus',
        sorter: true,
        className: "text-center",
        render: (Forecast) => {
          return <> <div>{this.getStyle(Forecast)}</div>
          </>
        }
      },
      {
        title: 'Action',
        width: 50,
        className: "text-center",
        render: (text, record) => {
          return <>
            <div className="menuIconDiv">
              <i onClick={() => {
                this.setState({ payslip: record, showPayslip: true })
              }} className="menuIconFa fa fa-eye" aria-hidden="true"></i>
            </div>
          </>
        },
      }

    ]
    return (
      <>
        {/* Page Header */}
        < div style={{ marginTop: '-40px' }} className='pl-0' id='page-head' >
          <div className="float-right col-md-5 btn-group btn-group-sm">
            {/* filter */}
            <Button onClick={() => this.setState({ showFilter: !this.state.showFilter })}
              sx={{ p: '1px', textTransform: 'none', backgroundColor: "#2e5984" }} size="small" variant="contained"  >
              <BsSliders style={{ padding: '2px' }} className='filter-btn' size={30} />
            </Button>
          </div>

          {
            this.state.showFilter && <div className='mt-5 filterCard p-3'>

              <div className="row">

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

          < div className='mt-5 Table-card' >
            <div className="tableCard-body">
              <div className="form-group p-12 m-0 pb-2">
                <div className="row " >
                  <div className="mt-3 col">
                    <h3 className="page-titleText">Overtime</h3>
                  </div>
                </div>
              </div>
              <div className="tableCard-container row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    <Table id='Table-style' className="table-striped"
                      pagination={{
                        total: totalRecords,
                        showTotal: () => {
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
                      rowKey={record => record.id}
                      onChange={this.onTableDataChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </>
    );
  }
}
