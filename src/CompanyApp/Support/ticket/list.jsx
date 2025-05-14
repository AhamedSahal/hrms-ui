import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { itemRender } from '../../../paginationfunction';
import { getReadableDate, getTitle, getUserType, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission, verifySelfViewPermission } from '../../../utility';
import TicketForm from './form';
import { closeTicket, getTicketList } from './service';
import TableDropDown from '../../../MainPage/tableDropDown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const { Header, Body, Footer, Dialog } = Modal;

export default class Ticket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employeeId: props.match?.params.id,
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
    if (verifySelfViewPermission("Helpdesk Ticket") || verifyOrgLevelViewPermission("Helpdesk Ticket")) {
      getTicketList(this.state.employeeId, this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

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
  }
  updateList = (ticket) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == ticket.id);
    if (index > -1)
      data[index] = ticket;
    else {
      data = [ticket, ...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
      });
  }

  hideForm = () => {
    this.setState({
      showForm: false,
      ticket: undefined
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
  onTableDataChange = (d, filter, sorter) => {
    this.setState({
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
    }, () => {
      this.fetchList();
    })
  }
  Close = (data) => {
    confirmAlert({
      title: `Close Ticket`,
      message: 'Are you sure, you want to close this Ticket?',
      buttons: [
        {
          className: "btn btn-danger",
          label: 'Yes',
          onClick: () => closeTicket(data.id).then(res => {
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
    if (text === 'CANCELED') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Canceled</span>;
    }
    if (text === 'OPEN') {
      return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Open</span>;
    }
    if (text === 'CLOSED') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Closed</span>;
    }
    if (text === 'PENDING') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Pending</span>;
    }
    return 'black';
  }

  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size));
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const menuItems = (text, record) => [
      <div > <Link className="muiMenu_item" to={`/app/company-app/support/ticket/${record.id}`}>
        <i className="las la-check-double m-r-5"></i> Ticket Action</Link></div>,
      <div ><a className="muiMenu_item" href="#" onClick={() => {
        let { ticket } = this.state;
        ticket = text;
        try {
          ticket.endDate = ticket.endDate.substr(0, 10);
        } catch (error) {
          console.error(error)
        }
        this.setState({ ticket, showForm: true })
      }} >
        <i className="fa fa-pencil m-r-5"></i> Edit</a></div>,
      <div ><a className="muiMenu_item" href="#" onClick={() => {
        this.Close(text);
      }}>
        <i className="fa fa-trash-o m-r-5"></i> Close</a></div>,

    ]

    const columns = [
      {
        title: 'Priority',
        dataIndex: 'priority',
        sorter: true,
      },
      {
        title: 'Subject',
        dataIndex: 'subject',
        sorter: true,
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{getReadableDate(record.endDate)}</div>
          </>
        }
      },
      {

        title: 'Status',
        dataIndex: 'status',
        sorter: true,
        render: (status, record) => {
          return <> <div>{this.getStyle(status)}</div>
          </>
        }
      },

      {
        title: 'Action',
        width: 50,
        className: 'text-center',
        render: (text, record) => (
          <div className="">
            <TableDropDown menuItems={menuItems(text, record)} />
          </div>
        ),
      },

    ]
    return (
      <div className="mr-3 ml-3 insidePageDiv">
        <Helmet>
          <title>Ticket | {getTitle()}</title>
          <meta name="description" content="Login page" />
        </Helmet>
        <div className="mr-3 ml-3 page-containerDocList content container-fluid">
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Ticket </h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item"><Link to={"/app/company-app/employee"}>Employee</Link></li>
                  <li className="breadcrumb-item active">Ticket</li>
                </ul>
              </div>
              <div className="mt-1 float-right col">

                <div className="float-right col-auto ml-auto">
                  <div className="text-center">{this.state.employeeName}</div>
                  {verifyOrgLevelEditPermission("Helpdesk Ticket") &&
                    <a href="#" className="btn apply-button btn-primary" onClick={() => {
                      this.setState({
                        showForm: true
                      })

                    }}><i className="fa fa-plus" /> Add Ticket Detail</a>}
                </div>

              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
                {(verifySelfViewPermission("Helpdesk Ticket") || verifyOrgLevelViewPermission("Helpdesk Ticket")) &&
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
                {!verifySelfViewPermission("Helpdesk Ticket") && !verifyOrgLevelViewPermission("Helpdesk Ticket") && <AccessDenied></AccessDenied>}

              </div>
            </div>
          </div>
        </div>

        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


          <Header closeButton>
            <h5 className="modal-title">{this.state.ticket ? 'Edit' : 'Add'} Ticket</h5>

          </Header>
          <Body>
            <TicketForm updateList={this.updateList} ticket={this.state.ticket} employeeId={this.state.employeeId}>
            </TicketForm>
          </Body>


        </Modal>


      </div>
    );
  }
}
