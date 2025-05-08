import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal, ButtonGroup, Row, Col } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { BsSliders } from 'react-icons/bs';
import OvertimeAction from '../Overtime/overtimeAction';
import { getOvertimeList } from '../Overtime/service';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import { getReadableDate, getUserType, getEmployeeId, getPermission, verifyViewPermission, verifyApprovalPermission, verifyViewPermissionForTeam, verifyEditPermission, verifyOrgLevelEditPermission } from '../../../../utility';
import TableDropDown from '../../../../MainPage/tableDropDown';
import BranchDropdown from '../../../ModuleSetup/Dropdown/BranchDropdown';
import JobTitlesDropdown from '../../../ModuleSetup/Dropdown/JobTitlesDropdown';
import DepartmentDropdown from '../../../ModuleSetup/Dropdown/DepartmentDropdown';
import { itemRender } from '../../../../paginationfunction';
import EmployeeListColumn from '../../employeeListColumn';
import { updateSelectedStatus } from '../../../TeamApproval/Overtime/service';
import TableActionDropDown from '../../../ModuleSetup/Dropdown/TableActionDropDown';
import { Button } from '@mui/material';

const { Header, Body} = Modal;

export default class OrgOvertimeApproval extends Component {
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
      self: getUserType() == 'COMPANY_ADMIN' ? 0 : 1,
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
    if (verifyViewPermission("ATTENDANCE")) {
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

  updateSelf = () => {
    this.setState({
      self: this.state.self == 1 ? 0 : 1
    }, () => {
      this.fetchList();
    })
  }
  updateList = (overtime) => {
    this.fetchList();
    let { data } = this.state;
    let index = data.findIndex(d => d.id == overtime.id);
    if (index > -1)
      data[index] = overtime;
    else {
      data.push(overtime);
    }
    this.setState({ data },
      () => {
        this.hideOvertimeAction();
      });
  }
  hideOvertimeAction = () => {
    this.setState({
      showOvertimeAction: false,
      overtime: undefined
    })
  }
  updateStatus = (selected, status) => {
    updateSelectedStatus(selected, status).then(res => {
      if (res.status == "OK") {
        toast.success(res.message);
        this.fetchList();
      } else {
        toast.error(res.message);
      }
    })
  }
  // onSelect = (data) => {
  //   let { selected, selectedArray } = this.state;
  //   let index = selected.indexOf(data.id);
  //   if (index > -1) {
  //     selected.splice(index, 1);
  //   } else {
  //     let tempArray = {
  //       id: data.id,
  //       employeeId: data.employee.id
  //     }
  //     selectedArray.push(tempArray);
  //     selected.push(data.id);
  //   }
  //   this.setState({ selectedArray });
  //   this.setState({ selected });
  // }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let { selected, selectedArray } = this.state;

      selectedRows.forEach(row => {
        let index = selected.indexOf(row.id);

        if (index > -1) {
          // If already selected, remove it from the selected list
          selected.splice(index, 1);
          selectedArray = selectedArray.filter(item => item.id !== row.id);
        } else {
          // Otherwise, add it to the selected list
          let tempArray = {
            id: row.id,
            employeeId: row.employee.id
          };
          selectedArray.push(tempArray);
          selected.push(row.id);
        }
      });

      this.setState({ selectedArray, selected });
    },
  };

  updateSelected = (status) => {
    const { selected, selectedArray } = this.state;
    confirmAlert({
      title: `Update Status for selected as ${status}`,
      message: 'Are you sure, you want to update status for selected?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.updateStatus(selectedArray, status);
            this.setState({ selected: [] });
            this.setState({ selectedArray: [] });

          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  }

  updateAll = (status) => {
    const { data } = this.state
    if (data && data.length > 0) {
      confirmAlert({
        title: `Update Status for all as ${status}`,
        message: 'Are you sure, you want to update status for all records on page?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              let selected = []
              let test = data.map((d) => {
                let tempArray = {
                  id: d.id,
                  employeeId: d.employee.id
                }
                selected.push(tempArray)
              });
             
              this.updateStatus(selected, status);
              this.setState({ selected: [] })
            }
          },
          {
            label: 'No',
            onClick: () => { }
          }
        ]
      });
    }
  }

  handleButtonClick = () => {
    this.setState((prevState) => ({
      buttonState: !prevState.buttonState,
      preferredMethod: prevState.buttonState ? 'Self' : 'Team'
    }));
  };
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
    let isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';


    const { data, totalPages, totalRecords, currentPage, size, selected, buttonState } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const menuItems = (text, record) => {
      const items = [];
      items.push(
        <div><a className="muiMenu_item" href="#" onClick={() => {
          let { overtime } = this.state;
          overtime = text;
          try {
            overtime.startDate = overtime.startDate.substr(0, 10);
            overtime.endDate = overtime.endDate.substr(0, 10);
          } catch (error) {
            console.error(error)
          }
          this.setState({ overtime, showOvertimeAction: true, showForm: false })
        }} >
          <i className="las la-check-double m-r-5"></i> Overtime Action</a></div>,
      );

      return items;
    }
    const columns = [
      {
        title: 'Employee',
        sorter: false,
        width: 300,
        render: (text, record) => {
          return <EmployeeListColumn id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
        }
      },
      {
        title: 'Date',
        dataIndex: 'forDate',
        sorter: false,
        width: 200,
        className: "text-center",
        render: (text, record) => {
          return <>
            <div>{getReadableDate(record.forDate)}</div>
          </>
        }
      },
      {
        title: 'Plan Hours',
        dataIndex: 'plannedHours',
        sorter: false,
        width: 200,
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
        width: 200,
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
        width: 200,
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
        width: 150,
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
        width: 150,
        className: "text-center",
        render: (Forecast, record) => {
          return <> <div>{this.getStyle(Forecast)}</div>
          </>
        }
      },
      {
        title: 'Action',
        width: 50,
        width: 150,
        className: "text-center",
        render: (text, record) => {
          return <>
            <div className="menuIconDiv">
              <i onClick={() => {
                this.setState({ payslip: record, showPayslip: true })
              }} className="menuIconFa fa fa-eye" aria-hidden="true"></i>
              {verifyOrgLevelEditPermission("ATTENDANCE") && <TableActionDropDown menuItems={menuItems(text, record)} />}
            </div>
          </>
        }
      },

    ]
    return (
      <>
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
              {
                this.state.self != 1 &&
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group form-focus">
                      <BranchDropdown defaultValue={this.state.branchId} onChange={e => {
                        this.setState({
                          branchId: e.target.value
                        })
                      }}></BranchDropdown>
                      <label className="focus-label">Location</label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group form-focus">
                      <DepartmentDropdown defaultValue={this.state.departmentId} onChange={e => {
                        this.setState({
                          departmentId: e.target.value
                        })
                      }}></DepartmentDropdown>
                      <label className="focus-label">Department</label>
                    </div>
                  </div>
                  {/* job title */}
                  <div className="col-md-4">
                    <div className="form-group form-focus">
                      <JobTitlesDropdown defaultValue={this.state.jobTitleId} onChange={e => {
                        this.setState({
                          jobTitleId: e.target.value
                        })
                      }}></JobTitlesDropdown>
                      <label className="focus-label">Job Titles</label>
                    </div>
                  </div>

                </div>}
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group form-focus">
                    <input onChange={e => {
                      this.setState({
                        q: e.target.value,
                        page: 0
                      })
                    }} type="text" className="form-control floating" />
                    <label className="focus-label">Search</label>
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

          < div className='mt-5 Table-card' >
            <div className="tableCard-body">
              <div className="row " >
                <div className="mt-3 col">
                  <h3 className="page-titleText">Overtime</h3>
                </div>

                <div className='col-md-auto'  >
                  {verifyOrgLevelEditPermission("ATTENDANCE") && data && data.length > 0 && <ButtonGroup className='pull-right my-3'>
                    <button
                      disabled={!data || data.length == 0}
                      className='markAll-btn btn-sm btn-outline-secondary mr-3'
                      onClick={() => {
                        this.updateAll('APPROVED');
                      }}>Mark All As Approved</button>
                    <button
                      disabled={!data || data.length == 0}
                      className='markAll-btn-rejected btn-sm btn-outline-secondary mr-3'
                      onClick={() => {
                        this.updateAll('REJECTED');
                      }}>Mark All As Rejected</button>
                    <button
                      disabled={!selected || selected.length == 0}
                      className='markAll-btn btn-sm btn-outline-secondary mr-3'
                      onClick={() => {
                        this.updateSelected('APPROVED');
                      }}>Mark Selected As Approved</button>
                    <button
                      disabled={!selected || selected.length == 0}
                      className='markAll-btn-rejected btn-sm btn-outline-secondary'
                      onClick={() => {
                        this.updateSelected('REJECTED');
                      }}>Mark Selected As Rejected</button>
                  </ButtonGroup>}
                </div>
              </div>

              <div className="tableCard-container row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    <Table id='Table-style' className="table-striped"
                      rowSelection={this.rowSelection}
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
                      dataSource={[...data]}
                      rowKey={record => record.id}
                      onChange={this.onTableDataChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Modal enforceFocus={false} size={"md"} show={this.state.showOvertimeAction} onHide={this.hideOvertimeAction} >


              <Header closeButton>
                <h5 className="modal-title">Overtime Action</h5>
              </Header>
              <Body>
                <OvertimeAction updateList={this.updateList} overtime={this.state.overtime} employeeId={this.state.employeeId}>
                </OvertimeAction>
              </Body>


            </Modal>
          </div >
        </div >
      </>
    );
  }
}
