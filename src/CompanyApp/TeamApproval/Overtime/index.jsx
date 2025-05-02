import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal, Col, Row, ButtonGroup } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { itemRender } from '../../../paginationfunction';
import { getReadableDate, getTitle } from '../../../utility';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import TeamOvertimeAction from './overtimeAction';
// import TeamOvertimeAction from '../../Employee/teamOvertime/teamOvertimeAction';
import { getTeamOvertimeList, updateSelectedStatus } from './service';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { BsSliders } from 'react-icons/bs';
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../../ModuleSetup/Dropdown/DepartmentDropdown';
import JobTitlesDropdown from '../../ModuleSetup/Dropdown/JobTitlesDropdown';

const { Header, Body, Footer, Dialog } = Modal;

export default class TeamOvertimeApproval extends Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 2);
    var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    this.state = {
      data: [],
      q: "",
      branchId: "",
      departmentId: "",
      jobTitleId: "",
      designationId: "",
      fromDate: firstDay.toISOString().split('T')[0],
      toDate: lastDay.toISOString().split('T')[0],
      page: 0,
      size: 10,
      sort: "approvalStatus,asc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      selected: [],
      showFilter: false,
    };
  }
  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    getTeamOvertimeList(this.state.q, this.state.page, this.state.size, this.state.sort,this.state.fromDate, this.state.toDate, this.state.branchId, this.state.departmentId, this.state.jobTitleId).then(res => {
      if (res.status == "OK") {
        this.setState({
          data: res.data.list,
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage + 1
        })
      }else{
        this.setState({
        data: res.data.list,
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
  updateList = (teamOvertime) => {
    this.fetchList();
    let { data } = this.state;
    let index = data.findIndex(d => d.id == teamOvertime.id);
    if (index > -1)
      data[index] = teamOvertime;
    else {
      data.push(teamOvertime);
    }
    this.setState({ data },
      () => {
        this.hideTeamOvertimeAction();
      });
  }


  hideTeamOvertimeAction = () => {
    this.setState({
      showTeamOvertimeAction: false,
      teamOvertime: undefined
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
  onSelect = (data) => {

    let { selected } = this.state;
    let index = selected.findIndex(item => item.id === data.id);
    if (index > -1) {
      selected.splice(index, 1);
      this.setState({ selected });
    } else {
      let newSelected = {
        id: data.id,
        employeeId: data.employeeId
      };
      const updatedEmp = [...selected, newSelected];
      this.setState({ selected: updatedEmp });
    }
  }
  updateSelected = (status) => {
    const { selected } = this.state;
    confirmAlert({
      title: `Update Status for selected as ${status}`,
      message: 'Are you sure, you want to update status for selected?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
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
  updateAll = (status) => {
    const { data } = this.state;
    if (data && data.length > 0) {
      confirmAlert({
        title: `Update Status for all as ${status}`,
        message: 'Are you sure, you want to update status for all records on page?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              let selected = []
              let test = data.map(d => {
                let tempArray = {
                  id: d.id,
                  employeeId: d.employeeId
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


  render() {
    const { data, totalPages, totalRecords, currentPage, size, selected } = this.state
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
          return <EmployeeListColumn id={text.employeeId} name={text.employeeName} employeeId={text.employeeStrId}></EmployeeListColumn>
        }
      },
      {
        title: 'Date',
        dataIndex: 'forDate',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{getReadableDate(record.forDate)}</div>
          </>
        }
      },
      {
        title: 'Over Time',
        dataIndex: 'hours',
        sorter: true,
      },
      {
        title: 'Approved Hours',
        sorter: false,
        dataIndex: 'approvedHours',
      },

      {
        title: 'Status',
        // dataIndex: 'overTimeApprovalStatus',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{text.overTimeApprovalStatus == null?"PENDING":text.overTimeApprovalStatus}</div>
          </>
        }
      },
      {
        title: 'Action',
        width: 50,
        render: (text, record) => (
          <Row>
            <Col md={4}>
              {<input
                type="checkbox"
                checked={selected && selected.length > 0 && selected.findIndex(item => item.id === record.id) > -1}
                className="pointer"
                onClick={e => {
                  this.onSelect(record);
                }}></input>}
            </Col>
            <Col md={8}>
              <div className="dropdow">
                <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                  <i className="las la-bars"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right">
                  <a className="dropdown-item" href="#" onClick={() => {
                    let { teamOvertime } = this.state;
                    teamOvertime = text;
                    this.setState({ teamOvertime, showTeamOvertimeAction: true, showForm: false })
                  }} >
                    <i className="las la-check-double m-r-5"></i> Team Overtime Action</a>
                </div>
              </div>
            </Col>
          </Row>
        ),
      },
    ]
    return (

      <>
        <div className="content container-fluid" >
          < div id='page-head' >
          <div className="float-right col-md-5 btn-group btn-group-sm">
              <BsSliders className='filter-btn' size={30} onClick={() => this.setState({ showFilter: !this.state.showFilter })} />
            </div>
          </div>
            {this.state.showFilter && 
            <div className='mt-4 filterCard p-3'>
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
              </div>
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group form-focus">
                    <input onChange={e => {
                      this.setState({
                        q: e.target.value
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

      <div className="">
        <Helmet>
          <title>Team Overtime  | {getTitle()}</title>
          <meta name="description" content="Over time" />
        </Helmet>
        {/* Page Content */}
          {/* Page Header */}
          <div>
            < div className='Table-card' >
              <div className="tableCard-body">
                <div className="row " >
                  <div className="mt-3 col">
                    <h3 className="page-titleText">Overtime</h3>
                  </div>

                  <div className='col-md-auto'  >
                    {data && data.length > 0 && <ButtonGroup className='pull-right my-3'>
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


                {/* /Page Header */}
                <div className="tableCard-container row">
                  <div className="col-md-12">
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
          </div>

          <Modal enforceFocus={false} size={"md"} show={this.state.showTeamOvertimeAction} onHide={this.hideTeamOvertimeAction} >


            <Header closeButton>
              <h5 className="modal-title">Team Overtime Action</h5>
            </Header>
            <Body>
              <TeamOvertimeAction updateList={this.updateList} teamOvertime={this.state.teamOvertime}>
              </TeamOvertimeAction>
            </Body>


          </Modal>
        </div>
      </div>
      </>
    );
  }
}
