import { Table } from 'antd';
import React, { Component } from 'react';
import { ButtonGroup, Modal, Row, Col } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import { getReadableDate, getRoleId, getUserType, verifyApprovalPermission, verifyViewPermission } from '../../../utility';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
import TimeInLieuAction from './action';
import TimeInLieuForm from './form';
import { deleteTimeinlieu, getEntitlementTimeinlieuList } from './service';
import TableDropDown from '../../../MainPage/tableDropDown';
import { BsSliders } from 'react-icons/bs';
import { verifyViewPermissionForTeam } from '../../../utility';
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../../ModuleSetup/Dropdown/DepartmentDropdown';
import JobTitlesDropdown from '../../ModuleSetup/Dropdown/JobTitlesDropdown';
import { verifySelfViewPermission } from '../../../utility';
import { verifyEditPermission } from '../../../utility';
import { getTeamEntitlementTimeinlieuList, updateSelectedStatus } from '../../TeamApproval/TimeInLieu/service';
import { getRoles } from '../../../MainPage/Main/Dashboard/service';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const { Header, Body, Footer, Dialog } = Modal;
const isCompanyAdmin =getUserType() =="COMPANY_ADMIN"
export default class Timeinlieu extends Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 2);
    var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    this.state = {
      employeeId: props.match?.params.id,
      data: [],
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      defaultEmployeeId: 0,
      showFilter: false,
      fromDate: firstDay.toISOString().split('T')[0],
      toDate: lastDay.toISOString().split('T')[0],
      branchId: "",
      departmentId: "",
      jobTitleId: "",
      selected: [],
      self: isCompanyAdmin ? 0 : 1,
      buttonState: true,
    };
  }
  updateSelf = () => {

    this.setState({
      self: this.state.self == 1 ? 0 : 1,
      currentPage: 1,
      page: 0
    }, () => {
      if(this.state.self == 1){
        this.fetchList();
      }else{
        this.updateListTeam();
      }
    

    })
  }
  componentDidMount() {
     let isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
   { this.fetchList(); }
  }
  updateListTeam = () =>{
    getTeamEntitlementTimeinlieuList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.fromDate, this.state.toDate, this.state.branchId, this.state.departmentId, this.state.jobTitleId).then(res => {

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
  fetchList = () => {
    getEntitlementTimeinlieuList(this.state.branchId, this.state.departmentId, this.state.jobTitleId, this.state.q, this.state.fromDate, this.state.toDate, this.state.page, this.state.size, this.state.sort).then(res => {
      if (res.status == "OK") {
        this.setState({
          data: res.data.list,
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage + 1
        })
      }
    })
    this.state.self !=1 && getTeamEntitlementTimeinlieuList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.fromDate, this.state.toDate, this.state.branchId, this.state.departmentId, this.state.jobTitleId).then(res => {

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
  // getListByEmployee = (employeeId) => {
  //   this.setState({
  //     defaultEmployeeId: employeeId
  //   });
  //   getEntitlementTimeinlieuList(this.state.branchId, this.state.departmentId, this.state.jobTitleId, this.state.q, this.state.fromDate, this.state.toDate, this.state.page, this.state.size, this.state.sort).then(res => {
  //     if (res.status == "OK") {
  //       this.setState({
  //         data: res.data.list,
  //         totalPages: res.data.totalPages,
  //         totalRecords: res.data.totalRecords,
  //         currentPage: res.data.currentPage + 1
  //       })
  //     }
  //   })
  // }
  onTableDataChange = (d, filter, sorter) => {
    this.setState({
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
    }, () => {
      this.fetchList();
    })
  }
  updateList = (timeinlieu) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == timeinlieu.id);
    if (index > -1)
      data[index] = timeinlieu;
    else {
      data = [timeinlieu, ...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
        this.hideAction();
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
      showForm: false,
      timeinlieu: undefined
    })
  }
  hideAction = () => {
    this.setState({
      showAction: false,
      timeinlieu: undefined
    })
  }
  updateStatus = (selected, status) => {
    updateSelectedStatus(selected, status).then(res => {
      if (res.status == "OK") {
        toast.success(res.message);
        this.updateListTeam();
      } else {
        toast.error(res.message);
      }
    })
  }
  onSelect = (data) => {
    let { selected } = this.state;
    let index = selected.indexOf(data.id);
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(data.id);
    }
    this.setState({ selected });
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
    const { data } = this.state
    if (data && data.length > 0) {
      confirmAlert({
        title: `Update Status for all as ${status}`,
        message: 'Are you sure, you want to update status for all records on page?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              let selected = data.map(d => d.id);
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
  delete = (timeinlieu) => {
    confirmAlert({
      title: `Delete Time In Lieu ${timeinlieu.forDate}`,
      message: 'Are you sure, you want to delete this Time In Lieu?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteTimeinlieu(timeinlieu.id).then(res => {
            if (res.status == "OK") {
              toast.success(res.message);
              this.fetchList();
            } else {
              toast.error(res.message)
            }
          })
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  }

  handleButtonClick = () => {
    this.setState((prevState) => ({
      buttonState: !prevState.buttonState,
      preferredMethod: prevState.buttonState ? 'Self' : 'Team'
    }));
  };
  getStyle(text) {
    if (text === 'REQUESTED') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Requested</span>;
    }
    if (text === 'CANCELED') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Canceled</span>;
    }
    if (text === 'APPROVED') {
      return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Approved</span>;
    }
    if (text === 'REJECTED') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Rejected</span>;
    }
    if (text === 'PENDING') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Pending</span>;
    }
  }

  render() {
    let isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
    const { data, totalPages, totalRecords, currentPage, size, selected,roleName,self,buttonState} = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const menuItems_emp = (text, record) => [
      <div >{this.state.self != 1 && <a className="muiMenu_item" href="#" onClick={() => {
        this.setState({ timeinlieu: text, showAction: true })
      }} >
        <i className="fa fa-pencil m-r-5"></i> Action</a>}</div>,
      <div >{this.state.self == 1 && <a className="muiMenu_item" href="#" onClick={() => {
        this.setState({ timeinlieu: text, showForm: true })
          }} >
        <i className="fa fa-pencil m-r-5"></i> Edit</a>}</div>,
      <div ><a className="muiMenu_item" href="#" onClick={() => {
          this.delete(text);
        }}>
        <i className="fa fa-trash-o m-r-5"></i> Delete</a></div>,
    ]
    const menuItems_admin = (text, record) => [
      <div ><a className="muiMenu_item" href="#" onClick={() => {
        this.setState({ timeinlieu: text, showAction: true })
      }} >
        <i className="fa fa-pencil m-r-5"></i> Action</a></div>,
      <div ><a className="muiMenu_item" href="#" onClick={() => {
        this.delete(text)
      }}>
        <i className="fa fa-trash-o m-r-5"></i> Delete</a></div>,
    ]
    const columns_emp = [
      {
        title: 'Employee',
        render: (text, record) => {
          console.log(text)
          return <EmployeeListColumn id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
        },
        sorter: false,
      },
      {
        title: 'Date',
        dataIndex: 'forDate',
        sorter: true,
      },
      {
        title: 'Hours',
        dataIndex: 'hours',
        sorter: true,
      },
      {
        title: 'Approved Hours',
        dataIndex: 'approvedHours',
        sorter: true,
      },
      {

        title: 'Status',
        dataIndex: 'approvalStatus',
        sorter: true,
        render: (text, record) => {
          return <> <div>{this.getStyle(text)}</div>
          </>
        }
      },

      {
        title: 'Action',
        width: 50,
        render: (text, record) => (
          <div className="">
           <Row>
            <Col md={4}>
            {this.state.self != 1 && <input
                type="checkbox"
                checked={selected && selected.length > 0 && selected.indexOf(record.id) > -1}
                className="pointer"
                onClick={e => {
                  this.onSelect(record);
                }}></input>}
            </Col>
            <Col> 
            <TableDropDown menuItems={menuItems_emp(text, record)} />
            </Col>
          </Row>
          </div>
        ),
      },

    ]
    const columns_com_admin = [
      {
        title: 'Employee',
        render: (text, record) => {
          return <EmployeeListColumn id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
        },
        sorter: false,
      },
      {
        title: 'Date',
        dataIndex: 'forDate',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{getReadableDate(text)}</div>
          </>
        }
      },
      {
        title: 'Hours',
        dataIndex: 'hours',
        sorter: true,
      },
      {
        title: 'Approved Hours',
        dataIndex: 'approvedHours',
        sorter: true,
      },
      {

        title: 'Status',
        dataIndex: 'approvalStatus',
        sorter: true,
        render: (text, record) => {
          return <> <div>{this.getStyle(text)}</div>
          </>
        }
      },
      {
        title: 'Action',
        width: 50,
        render: (text, record) => (
          <Row>
            <Col md={4}>
            {this.state.self != 1 && <input
                type="checkbox"
                checked={selected && selected.length > 0 && selected.indexOf(record.id) > -1}
                className="pointer"
                onClick={e => {
                  this.onSelect(record);
                }}></input>}
            </Col>
            <Col> 
            <TableDropDown menuItems={menuItems_admin(text, record)} />
            </Col>
          </Row>
        ),
      },

    ]
    return (
      <>
        {/* Page Content */}
         {/* filter */}
    < div id='page-head' >
           <div className="float-right col-md-5 btn-group btn-group-sm">
              {/* {verifyViewPermissionForTeam("LEAVE") && !isCompanyAdmin && <>
                <div class="btn-group btn-cust-group" role="group" aria-label="Basic example">
                  {verifySelfViewPermission("LEAVE") && <button  type="button" className={this.state.self == 1 ? 'btn btn-sm btn-success btn-selected self-btn' : 'btn btn-sm btn-secondary'} onClick={e => {
                    this.updateSelf()
                  }} > Self </button>}

                  <button  type="button" className={this.state.self != 1 ? 'btn btn-sm btn-primary btn-selected' : 'btn btn-sm btn-secondary'} onClick={e => {
                   verifySelfViewPermission("LEAVE") && this.updateSelf()
                  }} > Team </button>
                </div>
              </>} */}
                {verifyViewPermissionForTeam("LEAVE") && !isCompanyAdmin && <div className="mr-2">
                <div onClick={e => {
                  this.updateSelf()
                  this.handleButtonClick()
                }} className="toggles-btn-view" id="button-container" >

                  <div id="my-button" className="toggle-button-element" style={{ transform: buttonState ? 'translateX(0px)' : 'translateX(80px)' }}>
                    <p className='m-0 self-btn'>{buttonState ? 'Self' : 'Team'}</p>

                  </div>
                  <p className='m-0 team-btn' style={{ transform: buttonState ? 'translateX(0px)' : 'translateX(-80px)' }}>{buttonState ? 'Team' : 'Self'}</p>
                </div>

              </div>}
            {verifyEditPermission("LEAVE") && <button className="apply-button btn-primary mr-2" onClick={() => {
              this.setState({
                showForm: true
              })
            }}><i className="fa fa-plus" /> Add</button>}
            {verifyViewPermission("LEAVE") && <BsSliders className='filter-btn' size={30} onClick={() => this.setState({ showFilter: !this.state.showFilter })} />}
          </div>

        </div>
        {this.state.showFilter &&
          <div className='mt-5 filterCard p-3'>
             { this.state.self != 1 && <div className="row">
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
                            page:0
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
            {<div className="form-group p-12 m-0 pb-2">
              <div className="row " >
                <div className="mt-3 col">
                  <h3 className="page-titleText">Time In Lieu</h3>
                </div>

                <div className='col-md-auto'  >
                    {this.state.self != 1 && data && data.length > 0 && <ButtonGroup className='pull-right my-3'>
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
            </div>}
            {/* filter */}
            <div className="tableCard-container row">
                  <div className="col-md-12">
                    <div className="table-responsive">
                      {verifyViewPermission("LEAVE") && <Table id='Table-style' className="table-striped "

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
                        columns={isCompanyAdmin ? columns_com_admin : columns_emp}
                        // bordered
                        dataSource={[...data]}
                        rowKey={record => record.id}
                        onChange={this.onTableDataChange}
                      />}
                      {!verifyViewPermission("LEAVE") && <AccessDenied></AccessDenied>}

                    </div>
                  </div>
                </div>
            </div>
          </div>
        {/* /Page Content */}
        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
          <Header closeButton>
            <h5 className="modal-title">{this.state.timeinlieu ? 'Edit' : 'Add'} Time In Lieu</h5>
          </Header>
          <Body>
            <TimeInLieuForm updateList={this.updateList} self={this.state.self} timeinlieu={this.state.timeinlieu} employeeId={this.state.employeeId}>
            </TimeInLieuForm>
          </Body>
        </Modal>
        <Modal enforceFocus={false} size={"md"} show={this.state.showAction} onHide={this.hideAction} >
          <Header closeButton>
            <h5 className="modal-title">Time In Lieu Action</h5>
          </Header>
          <Body>
            <TimeInLieuAction updateList={this.updateList} timeinlieu={this.state.timeinlieu} employeeId={this.state.employeeId}>
            </TimeInLieuAction>
          </Body>
        </Modal>
      </>
    );
  }
}
