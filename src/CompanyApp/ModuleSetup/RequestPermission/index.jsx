import { Checkbox, Table } from 'antd';
import React, { Component } from 'react';
import { ButtonGroup, Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import { deletePermissionType } from './service';
import { verifyOrgLevelViewPermission, verifyOrgLevelEditPermission } from '../../../utility';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import AttendancePermissionForm from './form';
import { HiOutlineViewColumns } from 'react-icons/hi2';
const { Header, Body, Footer, Dialog } = Modal;
const permissionData = [
  {
    permissionName: 'Late Arrival',
    criteria: 'Unlimited Request',
    permissionCriteria: '1',
    applicablePeriod: '0',
    allowedTime: '0',
    allowedReq: '0',
    minReq: '0',
    maxReq: '0',
    reqType: 'Late Clock-In',
    lateClockIn: false,
    generalShift: true,
    shiftHours: false,
  },
  {
    permissionName: 'Early Exit',
    criteria: 'Number of Request',
    permissionCriteria: '2',
    applicablePeriod: 'Weekly',
    allowedTime: '0',
    allowedReq: '0',
    minReq: '0',
    maxReq: '0',
    reqType: 'Early Clock-In',
    generalShift: true,
    shiftHours: true
  },
  {
    permissionName: 'Flexible Hours',
    criteria: 'Allocated Hours',
    permissionCriteria: '3',
    applicablePeriod: 'Weekly',
    allowedTime: '7 Hrs',
    allowedReq: '3',
    minReq: '3 Hrs',
    maxReq: '30 Hrs',
    reqType: 'Early Clock-In',
    generalShift: true,
    shiftHours: false
  },
  {
    permissionName: 'Early In & Early Out',
    criteria: 'Unlimited Request',
    permissionCriteria: '1',
    applicablePeriod: '0',
    allowedTime: '0',
    allowedReq: '0',
    minReq: '0',
    maxReq: '0',
    reqType: 'Late Clock-In',
    generalShift: true,
    shiftHours: false,
  }
];
export default class RequestPermissionSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: permissionData || [],
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      isHovered: false,
      checkedList: ['1', '2', '3','7', '8', '9', '10', '11'],
    };
  }
  // componentDidMount() {
  //   this.fetchList();
  // }
  // fetchList = () => {
  //   if (verifyOrgLevelViewPermission("Module Setup Manage")) {
  //      getPermissionTypeList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
  //       if (res.status == "OK") {
  //         this.setState({
  //           data: res.data.list,
  //           totalPages: res.data.totalPages,
  //           totalRecords: res.data.totalRecords,
  //           currentPage: res.data.currentPage + 1
  //         })
  //       }
  //     })
  //   }
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
  updateList = (permissionType) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == permissionType.id);
    if (index > -1)
      data[index] = permissionType;
    else {
      data = [permissionType, ...data];
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
      permissionType: undefined
    })

  }

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  handleMouseClick = () => { 
    this.setState({ isHovered: !this.state.isHovered });
  };
  handleCheckboxChange = (checkedList) => {
    this.setState({ checkedList });
  };
  delete = (permissionType) => {
    confirmAlert({
      title: `Delete Permission Type ${permissionType.permissionName}`,
      message: 'Are you sure, you want to delete this Permission Type?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deletePermissionType(permissionType.id).then(res => {
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
    const { data, isHovered, checkedList, totalRecords, currentPage, size } = this.state

    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const columns = [
      {
        title: 'Permission Name',
        dataIndex: 'permissionName',
        key: '1',
        sorter: true,
      },
      {
        title: 'Permission Criteria',
        dataIndex: 'criteria',
        className: "text-center",
        key: '2',
        sorter: true,
      },
      {
        title: 'Applicable Period',
        sorter: true,
        key: '3',
        className: "text-center",
        dataIndex: 'allowedTime',
        render: (text, record) => {
          return <>
            {text === '0' ? <span className={"badge bg-inverse-warning"}>
              <i className="pr-2 fa fa-remove text-warning"></i>'Not Applicable' </span> :
              <span>{text}</span>
            }
          </>
        }
      },
      {
        title: 'Total Allowed time',
        dataIndex: 'applicablePeriod',
        className: "text-center",
        key: '4',
        render: (text, record) => {
          return <>
            {text === '0' ? <span className={"badge bg-inverse-warning"}>
              <i className="pr-2 fa fa-remove text-warning"></i>'Not Applicable' </span> :
              <span>{text}</span>
            }
          </>
        }
      },
      {
        title: 'Min Time Per Request',
        dataIndex: 'minReq',
        className: "text-center",
        key: '5',
        render: (text, record) => {
          return <>
            {text === '0' ? <span className={"badge bg-inverse-warning"}>
              <i className="pr-2 fa fa-remove text-warning"></i>'Not Applicable' </span> :
              <span>{text}</span>
            }
          </>
        }
      },
      {
        title: 'Max Time Per Request',
        dataIndex: 'maxReq',
        className: "text-center",
        key: '6',
        render: (text, record) => {
          return <>
            {text === '0' ? <span className={"badge bg-inverse-warning"}>
              <i className="pr-2 fa fa-remove text-warning"></i>'Not Applicable' </span> :
              <span>{text}</span>
            }
          </>
        }
      },
      {
        title: 'Total Allowed Request',
        dataIndex: 'allowedReq',
        className: "text-center",
        key: '7',
        render: (text, record) => {
          return <>
            {text === '0' ? <span className={"badge bg-inverse-warning"}>
              <i className="pr-2 fa fa-remove text-warning"></i>'Not Applicable' </span> :
              <span>{text}</span>
            }
          </>
        }
      },
      {
        title: 'Request Type',
        className: "text-center",
        dataIndex: 'reqType',
        key: '8',
        sorter: true,
      },
      {
        title: 'General Shift',
        dataIndex: 'generalShift',
        className: "text-center",
        key: '9',
        render: (text, record) => {
          return <span className={text ? "badge bg-inverse-success " : "badge bg-inverse-danger"}>
            {text ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
              text ? 'Yes' : 'No'
            }</span>
        }
      },
      {
        title: 'Shift Hours',
        dataIndex: 'shiftHours',
        className: "text-center",
        key: '10',
        render: (text, record) => {
          return <span className={text ? "badge bg-inverse-success " : "badge bg-inverse-danger"}>
            {text ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
              text ? 'Yes' : 'No'
            }</span>
        }
      },
      {
        title: 'Action',
        width: 50,
        key: '11',
        className: "text-center",
        render: (text, record) => (

          <div className="dropdow">
            {verifyOrgLevelEditPermission("Module Setup Manage") && <><a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="las la-bars"></i>
            </a>
              <div className="dropdown-menu dropdown-menu-right">
                <a className="dropdown-item" href="#" onClick={() => {
                  this.setState({ permissionType: text, showForm: true })
                }} >
                  <i className="fa fa-pencil m-r-5"></i> Edit</a>
                <a className="dropdown-item" href="#" onClick={() => {
                  this.delete(text);
                }}>
                  <i className="fa fa-trash-o m-r-5"></i> Delete</a>
              </div></>}
          </div>
        ),
      },
    ]

    const checkedOptions = columns.map(({ key, title }) => ({
      label: title,
      value: key,
    }));
    const newColumns = columns.filter(column => checkedList.includes(column.key));
    return (
      <>
        {/* Page Content */}
        < div className="page-container content container-fluid" >
          {/* Page Header */}
          < div className="tablePage-header" >
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Permission Rules Setup</h3>
              </div>
              <div className="mt-2 mb-2 float-right col-auto ml-auto d-flex">
                <p className="ml-3 mt-2 btn apply-button btn-primary" onClick={() => {
                  this.setState({
                    showForm: true,
                  })
                }}><i className="fa fa-plus" /> Create Permission</p>

                <div className=''>
                  <div onClick={this.handleMouseClick}
                    className='columnIcon'>
                    <HiOutlineViewColumns size={25} />
                  </div>
                    {isHovered && <div onMouseLeave={this.handleMouseLeave} style={{width: '195px'}} className='tableColHide'>
                      <Checkbox.Group
                        options={checkedOptions}
                        value={checkedList}
                        onChange={this.handleCheckboxChange}
                      />
                    </div>}
                </div>
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
                  columns={newColumns}
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
          <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
            <Header closeButton>
              <h5 className="modal-title">{this.state.permissionType ? 'Edit' : 'Add'} Permission</h5>
            </Header>
            <Body>
              <AttendancePermissionForm updateList={this.updateList} permissionType={this.state.permissionType} >
              </AttendancePermissionForm>
            </Body>
          </Modal>
        </div >
      </>
    );
  }
}
