import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import ForecastForm from './form';
import { getForecastList } from './service';
import { getTitle, getUserType, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../utility';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import ForecastAction from './forecastAction';
import TableDropDown from '../../../MainPage/tableDropDown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const { Header, Body, Footer, Dialog } = Modal;
export default class Forecast extends Component {
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
    getForecastList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

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
  updateList = (forecast) => {

    let { data } = this.state;
    let index = data.findIndex(d => d.id == forecast.id);
    if (index > -1)
      data[index] = forecast;
    else {
      data.push(forecast);
    }
    this.setState({ data },
      () => {
        this.hideForecastAction();
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
  hideForecastAction = () => {
    this.setState({
      showForecastAction: false
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
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size));
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const menuItems = (Forecast, record) => {
      const items = [];
      if (isCompanyAdmin) {
        items.push(
          <div key="1">
            <a className="muiMenu_item" onClick={() => {
              let { forecast } = this.state;
              forecast = Forecast;
              this.setState({ forecast, showForecastAction: true, showForm: false })
            }}>
              <i className="las la-check-double m-r-5"></i> Approval Action
            </a>
          </div>
        );
      }
      if (!isCompanyAdmin && Forecast.forecastStatus === "PENDING") {
        items.push(
          <div key="2">
            <a className="muiMenu_item" onClick={() => {
              let { forecast } = this.state;
              forecast = Forecast;
              this.setState({ forecast, showForm: true })
            }}>
              <i className="fa fa-pencil m-r-5"></i> Edit
            </a>
          </div>
        );
      }

      return items;
    };
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
        title: 'Initiated  By',
        sorter: false,
        render: (text, record) => {
          return <EmployeeListColumn
            id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
        }
      },
      {
        title: 'Status',
        dataIndex: 'forecastStatus',
        sorter: true,

        render: (Forecast, record) => {
          return <> <div>{this.getStyle(Forecast)}</div>
          </>
        }
      },
      {
        title: 'Action',
        width: 50,
        render: (Forecast, record) => (
          <div className="">
            {Forecast.forecastStatus == "PENDING" && <TableDropDown menuItems={menuItems(Forecast, record)} />}
          </div>
        ),
      },
     
    ]
    return (
      <>
        <div className="page-container content container-fluid">
          {/* Page Header */}
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Forecast</h3>
              </div>
              <div className="float-right col">
                <div className="row justify-content-end">
                  {!isCompanyAdmin && <div className="float-right col-auto ml-auto mr-1 my-2">
                  {verifyOrgLevelEditPermission("Plan Workforce Plan") &&
                    <a href="#" className="btn apply-button btn-primary" onClick={() => {
                      this.setState({
                        showForm: true
                      })

                    }}><i className="fa fa-plus" /> Add Forecast </a>}
                  </div>}
                </div>
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

        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


          <Header closeButton>
            <h5 className="modal-title">{this.state.forecast ? 'Edit' : 'Add'} Forecast </h5>

          </Header>
          <Body>
            <ForecastForm updateList={this.updateList} forecast={this.state.forecast}>
            </ForecastForm>
          </Body>


        </Modal>
        <Modal enforceFocus={false} size={"md"} show={this.state.showForecastAction && isCompanyAdmin} onHide={this.hideForecastAction} >


          <Header closeButton>
            <h5 className="modal-title">Forecast Action</h5>
          </Header>
          <Body>
            <ForecastAction updateList={this.updateList} forecast={this.state.forecast} >
            </ForecastAction>
          </Body>


        </Modal>
      </>
    );
  }
} 