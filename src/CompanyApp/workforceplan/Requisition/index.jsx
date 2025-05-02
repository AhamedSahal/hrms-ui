import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { DropdownService } from '../../ModuleSetup/Dropdown/DropdownService';
import { getRequisitionList } from '../Requisition/service';
import { getReadableDate, getTitle, getUserType, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../utility';
import RequisitionForm from './form';
import RequisitionAction from './RequisitionAction';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import { itemRender } from "../../../paginationfunction";
import TableDropDown from '../../../MainPage/tableDropDown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const { Header, Body, Footer, Dialog } = Modal;
class Requisition extends Component {
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
    getRequisitionList(this.state.q, this.state.page, this.state.size, this.state.sort, "APPROVED", 1).then(res => {

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
  updateList = (Requisition) => {
 
        this.hideRequisitionAction();
        this.hideForm();
        this.fetchList();
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
  hideRequisitionAction = () => {
    this.setState({
      showRequisitionAction: false

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
  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size));
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const menuItems = (text, record) => {
      const items = [];
      items.push(
        <div key="1">
          <a className="muiMenu_item" href="#" onClick={() => {
            this.setState({ Requisition: text, showRequisitionAction: true, showForm: false });
          }}>
            <i className="las la-check-double m-r-5"></i> Approval Action
          </a>
        </div>
      );
      if (record.requisitionStatus === "PROCESS_STARTED") {
        items.push(
          <div key="2">
            <a className="muiMenu_item" href="#" onClick={() => {
              window.location.href = "/app/company-app/hire/job";
            }}>
              <i className="fa fa-map-marker m-r-5"></i> Create Job
            </a>
          </div>
        );
      }
      return items;
    };
    

    const columns = [

      {
        title: 'Requisition Date',
        dataIndex: 'reqinitiateddate',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{getReadableDate(record.reqinitiateddate)}</div>
          </>
        }
      },
      {
        title: 'Expected Start Date',
        dataIndex: 'resneeddate',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{getReadableDate(record.resneeddate)}</div>
          </>
        }
      },
      {
        title: 'Job Title',
        dataIndex: 'role',
        sorter: true,
        render: (text, record) => {
          if (text == " ") { return <span>{text && record.forecast?.name}</span> } else {
            return <span>{text && record.role}</span>
          }
        }
      },
      {
        title: 'Department',
        sorter: false,
        render: (text, record) => {
          return <span>{text && text ? record.department?.name : "-"}</span>
        }
      },
      {
        title: 'Reason for Recruitment',
        dataIndex: 'rec_reason',
        sorter: true,
        render: (text, record) => {
          return <span>{text && text ? record.rec_reason : "-"}</span>
        }
      },
      {
        title: 'Resource Type',
        dataIndex: 'res_type',
        sorter: true,
        render: (text, record) => {
          return <span>{text && text ? record.res_type : "-"}</span>
        }
      },
      {
        title: 'Position Type',
        dataIndex: 'pos_type',
        sorter: true,
        render: (text, record) => {
          return <span>{text && text ? record.pos_type : "-"}</span>
        }
      },
      {
        title: 'No of Months',
        dataIndex: 'noofmonths',
        sorter: true,
        render: (text, record) => {
          return <span>{text && text ? record.noofmonths : "-"}</span>
        }
      },
      {
        title: 'Requisition Type',
        dataIndex: 'req_type',
        sorter: true,
        render: (text, record) => {
          return <span>{text && text ? record.req_type : "-"}</span>
        }
      },
      {
        title: 'No of Resources',
        dataIndex: 'noofresources',
        sorter: true,
        render: (text, record) => {
          return <span>{text && text ? record.noofresources : "-"}</span>
        }
      },
      {
        title: 'Initiated  By',
        sorter: false,
        render: (text, record) => {
          return <EmployeeListColumn
            id={text.employee.id} name={text.employee.name}></EmployeeListColumn>
        }
      },
      {
        title: 'Status',
        render: (text, record) => {
          return <span className={text && text.requisitionStatus == "PROCESS_INITIATED" ? "badge bg-inverse-warning " : record.requisitionStatus == "PROCESS_STARTED" ? "badge bg-inverse-success " : record.requisitionStatus == "PROCESS_STOPPED" ? "badge bg-inverse-danger" : "-"}>
            {text.requisitionStatus == "PROCESS_INITIATED" ? <i className="pr-2 fa fa-hourglass-o text-warning"></i> : record.requisitionStatus == "PROCESS_STARTED" ? <i className="pr-2 fa fa-check text-success"></i> : record.requisitionStatus == "PROCESS_STOPPED" ? <i className="pr-2 fa fa-remove text-danger"></i> : "-"}
            {record.requisitionStatus == "PROCESS_INITIATED" ? "Initiated" : record.requisitionStatus == "PROCESS_STOPPED" ? "Stopped" : record.requisitionStatus == "PROCESS_STARTED" ? "Started" : "-"}</span>
        }
      },
      {
        title: 'Action',
        width: 50,
        render: (text, record) => (
          <div className="">
           {isCompanyAdmin && <TableDropDown menuItems={menuItems(text, record)} />}
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
                <h3 className="tablePage-title">Requisition</h3>
              </div>
              <div className="float-right col">
                <div className="row justify-content-end">
                  {!isCompanyAdmin && <div className="float-right col-auto ml-auto mr-1 my-2"  >
                  {verifyOrgLevelEditPermission("Plan Workforce Plan") &&
                    <a href="#" className="btn apply-button btn-primary" onClick={() => {
                      this.setState({
                        showForm: true
                      })

                    }}><i className="fa fa-plus" />  Add   </a>}
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
                    pageSizeOptions: [10, 25, 50, 100],
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
        {/* /Page Content */}


        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


          <Header closeButton>
            <h5 className="modal-title">{this.state.Requisition ? 'Edit' : 'Add'} Requisition </h5>

          </Header>
          <Body>
            <RequisitionForm updateList={this.updateList} Requisition={this.state.Requisition}>
            </RequisitionForm>
          </Body>


        </Modal>
        <Modal enforceFocus={false} size={"md"} show={this.state.showRequisitionAction && isCompanyAdmin} onHide={this.hideRequisitionAction} >


          <Header closeButton>
            <h5 className="modal-title">Requisition Action</h5>
          </Header>
          <Body>
            <RequisitionAction updateList={this.updateList} Requisition={this.state.Requisition} >
            </RequisitionAction>
          </Body>


        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    jobTitles: state.dropdown.jobTitles
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getJobTitle: () => {
      dispatch(DropdownService.getJobTitle())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Requisition);
