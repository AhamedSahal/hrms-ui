import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import { getReadableDate, getUserType } from '../../../utility';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
import TimeInLieuAction from './action';
import TimeInLieuForm from './form';
import { deleteTimeinlieu, getEntitlementTimeinlieuList, getTeamEntitlementTimeinlieuList } from './service';
import TableDropDown from '../../../MainPage/tableDropDown';
const { Header, Body, Footer, Dialog } = Modal;
export default class TeamTimeinlieu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeId: props.match.params.id,
      data: [],
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      defaultEmployeeId: 0,
    };
  }
  componentDidMount() {
    this.fetchList()
  }
  fetchList = () => {
    getTeamEntitlementTimeinlieuList(this.state.defaultEmployeeId, this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
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
    return 'black';
  }
 
  render() {
    let isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const menuItems_emp = (text, record) => [
      <div ><a className="muiMenu_item" href="#" onClick={() => {
        this.setState({ timeinlieu: text, showForm: true })
      }} >
        <i className="fa fa-pencil m-r-5"></i> Edit</a></div>,
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
        title: 'Approval Level',
        dataIndex: 'currentApprovalLevel',
        sorter: true,
      },
      {
        title: 'Approver',
        sorter: false,
        render: (text, record) => {
          return <div>{this.getStyle(text.approver?.name)}</div>
        }
      },
      {
        title: 'Action',
        width: 50,
        render: (text, record) => (
          <div className="">
            <TableDropDown menuItems={menuItems_emp(text, record)} />
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
        title: 'Approval Level',
        dataIndex: 'currentApprovalLevel',
        sorter: false,
      },
      {
        title: 'Approver',
        render: (text, record) => {
          return <span>
            
            {text.approver?.name}</span>
        }
      },
      {
        title: 'Action',
        width: 50,
        render: (text, record) => (
          <div className="">
            <TableDropDown menuItems={menuItems_admin(text, record)} />
          </div>
        ),
      },
      
    ]
    return (
      <>
        {/* Page Content */}
        <div style={{    width: '90%', marginTop: '121px'}} className="page-container content container-fluid">
          {/* Page Header */}
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Time In Lieu</h3>
              </div>
             
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
                
                {(this.state.defaultEmployeeId != 0 || !isCompanyAdmin) && <>
                  <Table id='Table-style' className="table-striped"
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
                  />
                </>}
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
            <TimeInLieuForm updateList={this.updateList} timeinlieu={this.state.timeinlieu} employeeId={this.state.employeeId}>
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
