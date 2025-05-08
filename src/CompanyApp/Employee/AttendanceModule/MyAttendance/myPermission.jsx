import { Table } from 'antd';
import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { BsSliders } from 'react-icons/bs';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { itemRender } from '../../../../paginationfunction';
import { Button } from '@mui/material';
import { Modal } from 'react-bootstrap';
import PermissionForm from '../Permission/form';
import { deleteReqPermission } from '../Permission/service';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';

const { Header, Body, Footer, Dialog } = Modal;

const permissionReq =
  [
    {
      name: 'Mark',
      employeeId: 20,
      date: '20-Nov-2024',
      startDate: '20-Nov-2024',
      endDate: '25-Nov-2024',
      type: 'Late Arrival',
      reason: 'Family function',
      status: 'PENDING',
      startTime: '11:30',
      endTime: '00:00',
      duration: '09.30 AM',
      numberOfDays: 5
    },
    {
      name: 'John',
      employeeId: 21,
      date: '21-Nov-2024',
      startDate: '21-Nov-2024',
      endDate: '26-Nov-2024',
      type: 'Early Exit',
      reason: 'Medical Appointment',
      status: 'APPROVED',
      startTime: '10:00',
      endTime: '14:00',
      duration: '04.15 PM',
      numberOfDays: 5
    },
    {
      name: 'Jane',
      employeeId: 22,
      date: '22-Nov-2024',
      startDate: '22-Nov-2024',
      endDate: '27-Nov-2024',
      type: 'Flexible Hours',
      reason: 'Personal',
      status: 'PENDING',
      startTime: '09:00',
      endTime: '17:00',
      duration: '2hr',
      numberOfDays: 5
    },
    {
      name: 'Emily',
      employeeId: 23,
      date: '23-Nov-2024',
      startDate: '23-Nov-2024',
      endDate: '28-Nov-2024',
      type: 'Late Arrival',
      reason: 'Traffic Delay',
      status: 'REJECTED',
      startTime: '10:30',
      endTime: '18:30',
      duration: '09.45 AM',
      numberOfDays: 5
    }
  ]

export default class MyPermission extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: permissionReq || [],
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      myPermission: true,
    };
  }


  hideForm = () => {
    this.setState({
      showForm: false,
    })
  }

  //  componentDidMount() {
  //   this.fetchList();
  // }
  // fetchList = () => {
  //      getReqPermissionList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
  //       if (res.status == "OK") {
  //         this.setState({
  //           data: res.data.list,
  //           totalPages: res.data.totalPages,
  //           totalRecords: res.data.totalRecords,
  //           currentPage: res.data.currentPage + 1
  //         })
  //       }
  //     })
  // }

  updateList = (permission) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == permission.id);
    if (index > -1)
      data[index] = permission;
    else {
      data = [permission, ...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
      });
  }

  delete = (permission) => {
    confirmAlert({
      title: `Delete Permission Request ${permission.type}`,
      message: 'Are you sure, you want to delete this Permission Request?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteReqPermission(permission.id).then(res => {
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

    const columns = [

      {
        title: 'Start Date & End Date',
        sorter: false,
        render: (text, record) => {
          return <>
            <div>{record.startDate} - {record.endDate} {`(${record.numberOfDays})`}</div>
          </>
        }
      },
      {
        title: 'Type',
        dataIndex: 'type',
        sorter: false,
        className: "text-center",
      },
      {
        title: 'Duration',
        dataIndex: 'duration',
        sorter: false,
        className: "text-center",
      },
      {
        title: 'Reason',
        dataIndex: 'reason',
        sorter: false,
        className: "text-center",
      },
      {
        title: 'Date',
        dataIndex: 'date',
        sorter: false,
        className: "text-center",
      },
      {
        title: 'Status',
        sorter: false,
        className: "text-center",
        render: (text, record) => {
          return <>
            <div>{this.getStyle(record.status)}</div>
          </>
        }
      },
      {
        title: 'Action',
        width: 50,
        key: '11',
        className: "text-center",
        render: (text, record) => (

          <div className="dropdow">
            <><a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="las la-bars"></i>
            </a>
              {record.status === 'PENDING' && <div className="dropdown-menu dropdown-menu-right">
                <a className="dropdown-item" href="#" onClick={() => {
                  this.setState({ permission: text, showForm: true })
                }} >
                  <i className="fa fa-pencil m-r-5"></i> Edit</a>
                <a className="dropdown-item" href="#" onClick={() => {
                  this.delete(text);
                }}>
                  <i className="fa fa-trash-o m-r-5"></i> Delete</a>
              </div>}</>
          </div>
        ),
      },

    ]
    return (
      <>
        {/* Page Header */}
        < div style={{ marginTop: '-40px' }} className='pl-0' id='page-head' >
          <div className="align-items-center float-right col-md-5 btn-group btn-group-sm">
            {/* filter */}
            <button className="apply-button btn-primary mr-2" onClick={() => {
              this.setState({
                showForm: true
              })
            }}><i className="fa fa-plus" /> New Permission Request</button>
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
                    <h3 className="page-titleText">Request Permission</h3>
                  </div>
                </div>
              </div>
              <div className="tableCard-container row">
                <div className="col-md-12">
                  <div className="table-responsive">
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
        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >

          <Header closeButton>
            <h5 className="modal-title">Request Permission</h5>
          </Header>
          <Body>
            <PermissionForm updateList={this.updateList} myPermission={true} permission={this.state.permission} />
          </Body>
        </Modal>
      </>
    );
  }
}
