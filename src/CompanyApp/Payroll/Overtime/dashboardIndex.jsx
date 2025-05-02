import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { itemRender } from '../../../paginationfunction';
import { getReadableDate, getTitle, getUserType, getEmployeeId, getPermission, verifyViewPermission, verifyApprovalPermission, verifyViewPermissionForTeam } from '../../../utility';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import OvertimeAction from './overtimeAction';
// import OvertimeAction from '../../Employee/overtime/overtimeAction';
import { getTeamOvertimeList } from './service';
import TableDropDown from '../../../MainPage/tableDropDown';

const { Header, Body, Footer, Dialog } = Modal;

export default class DashboardOvertimeApproval extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employeeId: getUserType() == 'COMPANY_ADMIN' ? '' : getEmployeeId(),
      data: [],
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      self: getUserType() == 'COMPANY_ADMIN' ? 0 : 1
    };
  }
//   componentDidMount() {
//       this.fetchList();

//   }
  fetchList = () => {
    getTeamOvertimeList( this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
        if (res.status == "OK") {
          this.setState({
            data: res.data.list,
            totalPages: res.data.totalPages,
            totalRecords: res.data.totalRecords,
            currentPage: res.data.currentPage + 1,
          })
        }
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
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const menuItems = (text, record) => [
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
    ]
    const columns = [
      {
        title: 'Employee',

        sorter: false,
        render: (text, record) => {
          return <EmployeeListColumn id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
        }
      },
      {
        title: 'Date',
        dataIndex: 'forDate',
        sorter: false,
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
        render: (text, record) => {
          return <>
            <div>{(record.overTime).toFixed(2)}</div>
          </>
        }
      },
      {
        title: 'Approved Overtime',
        dataIndex: 'approvedHours',
        sorter: false,
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

        render: (Forecast, record) => {
          return <> <div>{this.getStyle(Forecast)}</div>
          </>
        }
      },
      {
        title: 'Action',
        width: 50,
        render: (text, record) => (
          <div className="">
            {verifyApprovalPermission("Payroll Overtime") && <TableDropDown menuItems={menuItems(text, record)} />}
          </div>
        ),
      },

    ]
    return (
      <div className="page-wrapper">
        <Helmet>
          <title>Overtime  | {getTitle()}</title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        < div className="pr-5 pl-5 content container-fluid" >
          {/* Page Header */}
          < div id='page-head' >
            < div className='mt-5 Table-card' >
              <div className="tableCard-body">
                <div className="row pageTitle-section">
                  <div className="col">
                    <h3 className="mt-3 tablePage-title">Overtime</h3>
                    <ul hidden className="breadcrumb">
                      <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                      <li className="breadcrumb-item"><a href="#">Payroll</a></li>
                      <li className="breadcrumb-item active">Overtime</li>
                    </ul>
                  </div>
                  
                </div>
              </div>

              {/* /Page Header */}

              <div className="p-2 col-md-12">
                <div className="table-responsive">
                  {verifyViewPermission("Payroll Overtime") && this.state.employeeId && <Table id='Table-style' className="table-striped "
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


                </div>{!verifyViewPermission("Payroll Overtime") && <AccessDenied></AccessDenied>}

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

      </div>
    );
  }
}
