import { Table } from 'antd';
import React, { Component } from 'react';
import {  Modal, Col, Row, ButtonGroup } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import LeaveTypeForm from './form';
import { deleteLeaveType, getLeaveTypeList } from './service';
import { verifyOrgLevelViewPermission, verifyOrgLevelEditPermission, getReadableDate } from '../../../utility';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import TableDropDown from '../../../MainPage/tableDropDown';
import LeaveTypeView from './LeaveTypeViewer';
const { Header, Body, Footer, Dialog } = Modal;
export default class LeaveType extends Component {
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
      currentPage: 1,
      locationName: "",
      locationId: 0,
      showViewForm: false
    };
  }
  // componentDidMount() {
  //   this.fetchList();
  // }
  fetchList = () => {
    if (verifyOrgLevelViewPermission("Module Setup Manage")) {
      this.state.locationId != 0 && getLeaveTypeList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.locationId).then(res => {
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
  onTableDataChange = (d, filter, sorter) => {
    this.setState({
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
    }, () => {
      this.fetchList();
    })
  }
  updateList = (leaveType) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == leaveType.id);
    if (index > -1)
      data[index] = leaveType;
    else {
      data = [leaveType, ...data];
    }
    this.setState({ data },
      () => {
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
      showForm: false,
      leaveType: undefined
    })
    this.fetchList();
  }
  hideViewForm = () => {
    this.setState({
        showViewForm: false
    })
}
  delete = (leaveType) => {
    confirmAlert({
      title: `Delete Leave Type ${leaveType.title}`,
      message: 'Are you sure, you want to delete this Leave Type?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteLeaveType(leaveType.id).then(res => {
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
  render() {
    const { data, totalPages, totalRecords, currentPage, size, selected } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const menuItems = (text, record) => {
      const items = [];
     
      // Edit
        items.push(<div> 
          <a className="dropdown-item" href="#" onClick={() => {
            let { leaveType } = this.state;
            leaveType = text;
            leaveType.futureexpiryDate = leaveType.futureexpiryDate == null?"":leaveType.futureexpiryDate
            leaveType.carryexpiryDate = leaveType.carryexpiryDate == null?"":leaveType.carryexpiryDate
            this.setState({ leaveType: text, showForm: true })
          }} >
            <i className="fa fa-pencil m-r-5"></i> Edit</a>
        </div>
        );

      // View
        items.push(<div>
            <a className="dropdown-item" href="#" onClick={() => {
              let { leaveType } = this.state;
              leaveType = text;
              
            this.setState({leaveType, showViewForm: true})
            }}>
            <i className="fa fa-eye m-r-5"></i> View</a>
        </div>
        );
        items.push(<div>
              <a className="dropdown-item" href="#" onClick={() => {
                this.delete(text);
              }}>
              <i className="fa fa-trash-o m-r-5"></i> Delete</a>
        </div>
        );

      return items;
    };


    const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        sorter: true,
      },
      {
        title: 'Days',
        dataIndex: 'days',
        sorter: true,
      },
      {
        title: 'Leave Cycle',
        width: 50,
        render: (text, record) => {
          return <span>
            {text.entStartMode == 0 ? "Calender" : "Work Anniversary"}</span>
        }
      },
      {
        title: 'Status',
        width: 50,
        render: (text, record) => {
          return <span className={text.active ? "badge bg-inverse-success " : "badge bg-inverse-danger"}>
          {text.active ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
            text.active ? 'Active' : 'Inactive'
          }</span>
        }
      },
      {
        title: 'Created On',
        sorter: true,
        render: (text, record) => {
          return <span>
             {text.createdOn != null ? getReadableDate(text.createdOn) : "-"}
          </span>
        
        }
      },
      
      {
        title: 'Action',
        width: 50,
        className: "text-center",
        render: (text, record) => (
          <div>
            <Row>
              <Col md={12}>
                <TableDropDown menuItems={menuItems(text, record)} />
              </Col>
            </Row>
          </div>
        ),
      },
    ]
    return (
      <>
        {/* Page Content */}
        < div className="page-container content container-fluid" >
          {/* Page Header */}
          < div className="tablePage-header" >
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Leave Type</h3>
              </div>

              <div className="mt-2 mb-2 float-right col-auto ml-auto d-flex">
                <BranchDropdown defaultValue="Select Location"
                  onChange={(e) => {
                    this.setState({
                      locationId: e.target.value,
                      locationName: e.target.selectedOptions[0].label
                    },
                      () => { this.fetchList() }
                    )
                  }} >
                </BranchDropdown>
                {this.state.locationId > 0 && <><p style={{ width: '16em' }} className="ml-3 mt-2 btn apply-button btn-primary" onClick={() => {
                  this.setState({
                    showForm: true,
                  })
                }}><i className="fa fa-plus" />Add</p></>}
              </div>

            </div>
          </div >

          {/* /Page Header */}
          < div className="row" >
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">

                {verifyOrgLevelViewPermission("Module Setup Manage") && <Table id='Table-style' className="table-striped "
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
                {!verifyOrgLevelViewPermission("Module Setup Manage") && <AccessDenied></AccessDenied>}
              </div>
            </div>

          </div >


          {/* /Page Content */}
          <Modal enforceFocus={false} size={"xl"} show={this.state.showForm} onHide={this.hideForm} >
            <Header closeButton>
              <h5 className="modal-title">{this.state.leaveType ? 'Edit' : 'Add'} Leave Type</h5>
            </Header>
            <Body>
              <LeaveTypeForm locationId={this.state.locationId} locationName={this.state.locationName} updateList={this.updateList} leaveType={this.state.leaveType}>
              </LeaveTypeForm>
            </Body>
          </Modal>
          <Modal enforceFocus={false} size={"xl"} show={this.state.showViewForm} onHide={this.hideViewForm} >
                <Header closeButton>
                <h5 className="modal-title">View Leave Type</h5>
                </Header>
                    <Body> 
                        {<LeaveTypeView leaveType={this.state.leaveType} />}
                   </Body>
                </Modal>
        </div>
      </>
    );
  }
}
