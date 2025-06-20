import { Table } from 'antd';
import React, { Component, useCallback, useEffect, useState } from 'react';
import { Modal, Col, Row, ButtonGroup, Anchor } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { BsFillInfoCircleFill, BsSliders } from "react-icons/bs";
import { itemRender } from '../../../paginationfunction';
import { getReadableDate, getUserType, verifyEditPermission, verifySelfViewPermission, verifySelfEditPermission, verifyViewPermission, verifyApprovalPermission, verifyViewPermissionForTeam, toLocalDateTime, getCompanyId, fallbackLocalDateTime } from '../../../utility';
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../../ModuleSetup/Dropdown/DepartmentDropdown';
import DesignationDropdown from '../../ModuleSetup/Dropdown/DesignationDropdown';
import EmployeeListColumn from '../employeeListColumn';
import JobTitlesDropdown from '../../ModuleSetup/Dropdown/JobTitlesDropdown';
import LeaveForm from './form';

import LeaveAction from './leaveAction';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { deleteLeave, getLeaveList } from './service';
import { updateSelectedStatus } from './service';
import { fileDownload } from '../../../HttpRequest';
import TableDropDown from '../../../MainPage/tableDropDown';
import LeaveViewForm from './leaveViewForm';
import successimg from '../../../assets/img/successimg.gif';
import checkimg from '../../../assets/img/tickmarkimg.gif';
import reject from '../../../assets/img/rejectimg.gif';
import { getModuleSetupByCompanyId } from '../../../AdminApp/Company/service';
import { getMultiApprovalMasterList } from '../../ModuleSetup/MultiApprove/LeaveMultiApproval/service';
import { Tooltip } from 'antd';
import { getHalfdayCount } from '../../ModuleSetup/LeaveType/service';
import SuccessAlert from '../../../MainPage/successToast';
import Bowser from 'bowser';
import { useParams } from 'react-router-dom';

const browser = Bowser.getParser(window.navigator.userAgent);
const browserName = browser.getBrowserName();
const isSafari = browserName === 'Safari';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const { Header, Body, Footer, Dialog } = Modal;
const Leave = () => {
  const { id } = useParams();
  const [state, setState] = useState({
    employeeId: id,
    data: [],
    q: "",
    branchId: "",
    departmentId: "",
    jobTitleId: "",
    designationId: "",
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().split('T')[0],
    toDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split('T')[0],
    page: 0,
    size: 10,
    sort: "id,desc",
    totalRecords: 0,
    currentPage: 1,
    showFilter: false,
    self: isCompanyAdmin ? 0 : 1,
    showViewForm: false,
    selected: [],
    companyId: getCompanyId(),
    multiApproveValidation: false,
    leaveModuleValidation: false,
    multiApproveMasterData: [],
    showAlert: false,
    alertMsg: '',
    imgTag: '',
    buttonState: true,
    halfDayCount: 0
  });

  const fetchList = useCallback(() => {
    if (verifyViewPermission("LEAVE")) {
      getLeaveList(state.employeeId, state.branchId, state.departmentId, state.jobTitleId, state.q, state.fromDate, state.toDate, state.page, state.size, state.sort, state.self).then(res => {
        if (res.status === "OK") {
          setState(prevState => ({
            ...prevState,
            data: res.data.list,
            totalRecords: res.data.totalRecords,
            currentPage: res.data.currentPage + 1,
            employeeName: res.data.employeeName
          }));
        }
      });
    }

    // multi approve master list
    getMultiApprovalMasterList().then(res => {
      if (res.status === 'OK') {
        setState(prevState => ({
          ...prevState,
          multiApproveMasterData: res.data,
          leaveModuleValidation: res.data.moduleIsActive
        }))
      }
    })

    // get module setup date
    getModuleSetupByCompanyId(state.companyId).then(res => {
      if (res.status === 'OK') {
        setState(prevState => ({
          ...prevState,
          moduleSetup: res.data,
        }))
        let firstActiveModule = res.data.find(module => module.isActive === "1" && module.moduleName === "Multi Approve");
        if (firstActiveModule) {
          setState(prevState => ({
            ...prevState,
            multiApproveValidation: firstActiveModule.moduleName == "Multi Approve" ? true : false
          }));
        }
      }
    })
      .catch(error => { console.log("Error: " + error); });

    // halfday check
    getHalfdayCount().then(res => {
      if (res.status === 'OK') {
        setState(prevState => ({
          ...prevState,
          halfDayCount: res.data,

        }))
      }
    })
  }, [state.employeeId, state.branchId, state.departmentId, state.jobTitleId, state.q, state.fromDate, state.toDate, state.page, state.size, state.sort, state.self, state.companyId]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const updateList = () => {
    hideLeaveAction();
    hideForm();
    setTimeout(function () {
      fetchList();
    }, 2000)
  }
  const hideForm = () => {
    setState(prevState => ({
      ...prevState,
      showForm: false,
      leave: undefined
    }))
  }

  // view hide
  const hideViewForm = () => {
    setState(prevState => ({
      ...prevState,
      showViewForm: false,
      leave: undefined
    }))
  }
  const pageSizeChange = (currentPage, pageSize) => {
    setState(prevState => ({
      ...prevState,
      size: pageSize,
      page: 0
    }), () => {
      fetchList();
    })

  }
  const onTableDataChange = (d, filter, sorter) => {
    setState(prevState => ({
      ...prevState,
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : state.sort
    }), () => {
      fetchList();
    })
  }
  const hideLeaveAction = () => {
    setState(prevState => ({
      ...prevState,
      showLeaveAction: false,
      leave: undefined
    }))
  }
  const showAlert = (status) => {
    if (status === 'APPROVED') {
      setState(prevState => ({
        ...prevState,
        alertMsg: 'Approved!',
        imgTag: successimg,
        showAlert: true
      }));
    } else if (status === 'REJECTED') {
      setState(prevState => ({
        ...prevState,
        alertMsg: 'Rejected!',
        imgTag: reject,
        showAlert: true
      }));
    } else if (status === 'submit') {
      setState(prevState => ({
        ...prevState,
        alertMsg: 'Submitted!',
        imgTag: checkimg,
        showAlert: true
      }));
    }

    setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        showAlert: false
      }));
    }, 3000);
  }
  const deleteLeaveRecord = (data) => {
    confirmAlert({
      title: `Delete Leave`,
      message: 'Are you sure, you want to delete this Leave?',
      buttons: [
        {
          className: "btn btn-danger",
          label: 'Yes',
          onClick: () => deleteLeave(data.id).then(res => {
            if (res.status == "OK") {
              toast.success(res.message);
              fetchList();
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
  const updateSelf = () => {

    setState(prevState => ({
      ...prevState,
      self: prevState.self == 1 ? 0 : 1
    }), () => {
      fetchList();
    })
  }
  const updateStatus = (selected, status) => {
    updateSelectedStatus(selected, status).then(res => {
      if (res.status == "OK") {
        toast.success(res.message);
        fetchList();
      } else {
        toast.error(res.message);
      }
    })
  }
  const onSelect = (data) => {
    let { selected } = state;
    let index = selected.indexOf(data.id);
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(data.id);
    }
    setState(prevState => ({
      ...prevState,
      selected
    }));
  }
  const updateSelected = (status) => {
    const { selected } = state;
    confirmAlert({
      title: `Update Status for selected as ${status}`,
      message: 'Are you sure, you want to update status for selected?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            updateStatus(selected, status);
            setState(prevState => ({
              ...prevState,
              selected: []
            }))
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  }
  const updateAll = (status) => {
    const { data } = state
    if (data && data.length > 0) {
      confirmAlert({
        title: `Update Status for all as ${status}`,
        message: 'Are you sure, you want to update status for all records on page?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              let selected = []
              data.map((d) => {
                if (!d.approvalStatus) {
                  selected.push(d.id)
                  return d.id;
                }
              });

              updateStatus(selected, status);
              setState(prevState => ({
                ...prevState,
                selected: []
              }))
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

  const handleButtonClick = () => {
    setState(prevState => ({
      ...prevState,
      buttonState: !prevState.buttonState
    }));
  };

  const getStyle = (text) => {
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
    if (text === 2) {
      return <span className='p-1 badge bg-inverse-success'>FH</span>;
    }
    if (text === 3) {
      return <span className='p-1 badge bg-inverse-success'>SH</span>;
    }
    return ' ';
  }

  const { buttonState, data, totalRecords, currentPage, size, selected } = state

  let startRange = ((currentPage - 1) * size) + 1;
  let endRange = ((currentPage) * (size + 1)) - 1;
  if (endRange > totalRecords) {
    endRange = totalRecords;
  }

  const menuItems = (text) => {
    const items = [];
    if (verifyApprovalPermission("LEAVE") && state.self != 1 && ((!text.approvalStatus && text.status != "REJECTED" && text.status != "APPROVED" && !text.multiApprovalNextLevelStatus) || !state.leaveModuleValidation)) {
      items.push(<div> <a className="muiMenu_item" href="#" onClick={() => {
        let { leave } = state;
        leave = text;
        try {
          leave.startDate = leave.startDate.substr(0, 10);
          leave.endDate = leave.endDate.substr(0, 10);
        } catch (error) {
          console.error(error)
        }
        setState(prevState => ({
          ...prevState,
          leave,
          showLeaveAction: true,
          showForm: false
        }))
      }} >
        <i className="las la-check-double m-r-5"></i> Leave Action</a>
      </div>
      );
    }
    // view
    if (verifyEditPermission("LEAVE") && state.multiApproveValidation && state.leaveModuleValidation) {
      items.push(<div> <a className="muiMenu_item" href="#" onClick={() => {
        let { leave } = state;
        leave = text;

        setState(prevState => ({
          ...prevState,
          leave,
          showLeaveAction: false,
          showForm: false,
          showViewForm: true
        }))
      }} >
        <i className="fa fa-eye m-r-5" />View</a>
      </div>
      );
    }

    // view
    if (verifyEditPermission("LEAVE") && text.status != "APPROVED" && text.status != "REJECTED" && text.multiApprovalStatus <= 1) {
      items.push(<div>
        <a className="muiMenu_item" href="#" onClick={() => {
          let { leave } = state;
          leave = text;
          try {
            leave.startDate = leave.startDate.substr(0, 10);
            leave.endDate = leave.endDate.substr(0, 10);
          } catch (error) {
            console.error(error)
          }
          setState(prevState => ({
            ...prevState,
            leave,
            showForm: true
          }))
        }} >
          <i className="fa fa-pencil m-r-5"></i> Edit</a>
      </div>
      );
    }
    if (verifyEditPermission("LEAVE") && text.status != "APPROVED" && text.status != "REJECTED" && text.multiApprovalStatus <= 1) {
      items.push(<div>
        <a className="muiMenu_item" href="#" onClick={() => {
          deleteLeaveRecord(text);
        }}>
          <i className="fa fa-trash-o m-r-5"></i> Delete</a>
      </div>
      );
    }

    return items;
  };

  const columns = [
    {
      title: 'Employee',
      sorter: false,
      render: (text) => {
        return <EmployeeListColumn
          id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
      }
    }, {
      title: 'Leave',
      dataIndex: 'leaveType.name',
      sorter: true,
      render: (text, record) => {
        return <>
          <div>{record.leaveType?.name}</div>
        </>
      }
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>Start Date</span>
          {state.halfDayCount > 0 && <span style={{ paddingLeft: '8px' }}>
            <Tooltip title="FH = First Half; SH = Second Half">
              <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
            </Tooltip><br />
          </span>}
        </div>
      ),
      dataIndex: 'startDate',
      sorter: true,
      render: (text, record) => {
        return <>
          <div>{getReadableDate(record.startDate)} {getStyle(record.startDateDayType)}</div>
        </>
      }
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>End Date</span>
          {state.halfDayCount > 0 && <span style={{ paddingLeft: '8px' }}>
            <Tooltip title="FH = First Half; SH = Second Half">
              <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
            </Tooltip><br />
          </span>}
        </div>
      ),
      dataIndex: 'endDate',
      sorter: true,
      render: (text, record) => {
        return <>
          <div>{getReadableDate(record.endDate)}  {getStyle(record.endDateDayType)}</div>
        </>
      }
    }, {
      title: 'Leave Count',
      dataIndex: 'totalDays',
      sorter: true,
      render: (text, record) => {
        return <>
          <div>{record.totalDays}</div>
        </>
      }
    },
    {
      title: 'Reason',
      dataIndex: 'leaveReason',
      sorter: true,
      className: 'pre-wrap',
      render: (text, record) => {
        return <>
          <div>{record.leaveReason}</div>
        </>
      }
    },
    {
      title: 'Attachment',
      sorter: true,
      width: 50,
      render: (text, record) => {
        return <> {text.attachment && <Anchor style={{ color: 'black' }} onClick={() => {
          fileDownload(text.id, text.employee.id, "LEAVE_DOCUMENT", text.attachment);
        }} title={text.attachment}>
          <i style={{ color: '#45C56D' }} className='fa fa-download'></i> Download
        </Anchor>}
          {!text.attachment && <>-</>
          }
        </>
      }
    },
    {
      title: 'Applied On',
      render: (text, record) => {
        if (!text.createdDate) return <div>-</div>;

        if (isSafari) {
          return <div>{fallbackLocalDateTime(text.createdDate)}</div>;
        } else {
          console.log(text.createdDate)
          const value = toLocalDateTime(text.createdDate);
          return <div>{value === null ? fallbackLocalDateTime(text.createdDate) : value}</div>;
        }
      }
    },
    {
      title: 'Approved By',
      render: (text, record) => {
        return <>
          {text.approvedBy != null ? <EmployeeListColumn
            id={text.approvedBy.id} name={text.approvedBy.name} employeeId={text.approverId}></EmployeeListColumn> : text.status == "APPROVED" || text.status == 'REJECTED' ? "Admin" : "-"}
        </>
      }
    },
    {
      title: 'Approved on',
      sorter: true,
      render: (text, record) => {

        if (!text.approvedOn) return <div>-</div>;

        if (isSafari) {
          return <div>{fallbackLocalDateTime(text.approvedOn)}</div>;
        } else {
          const value = toLocalDateTime(text.approvedOn);
          return <div>{value === null ? fallbackLocalDateTime(text.approvedOn) : value}</div>;
        }
      }
    },
    {
      title: 'Remarks',
      render: (text, record) => {
        return <>
          <div>{text.status == "REJECTED" && text.status != "undefined" ? text.remark : "-"}</div>
        </>
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: true,
      render: (text, record) => {
        return <div>{getStyle(record.status)}</div>
      }
    },
    {
      title: 'Action',
      width: 50,
      render: (text, record) => (
        <div>
          <Row>
            <Col md={4}>
              {verifyApprovalPermission("LEAVE") && <input
                type="checkbox"
                disabled={text.approvalStatus}
                checked={selected && selected.length > 0 && selected.indexOf(record.id) > -1}
                className="pointer"
                onClick={e => {
                  onSelect(record);
                }}></input>}
            </Col>
            <Col md={8}>
              <TableDropDown menuItems={menuItems(text, record)} />
            </Col>
          </Row>
        </div>
      ),
    },
  ]
  if (state.multiApproveValidation && state.leaveModuleValidation) {
    const index = columns.length - 1;
    const value = {
      title: 'Approval Status',
      sorter: true,
      className: 'pre-wrap',
      render: (text, record) => {
        return <div>{text.status == "APPROVED" ? <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Approved</span> : text.status == "REJECTED" ? <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Rejected</span> : text.multiApprovalNextLevelStatus ? <span className='p-1 badge bg-inverse-warning' style={{ whiteSpace: "pre-wrap" }}><i className="pr-2 fa fa-hourglass-o text-warning"></i>Moved to next level</span> : text.status == "PENDING" ? <span className='p-1 badge bg-inverse-warning' style={{ whiteSpace: "pre-wrap" }}><i className="pr-2 fa fa-hourglass-o text-warning"></i>Waiting for approval level {text.multiApprovalStatus}</span> : "-"}</div>
      }
    }
    columns.splice(index, 0, value);


  }
  return (
    <>
      {state.showAlert && (
        <SuccessAlert
          headText={state.alertMsg}
          img={state.imgTag}
        />
      )}
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div id='page-head' >


          <div className="float-right col-md-6 btn-group btn-group-sm">
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
                updateSelf()
                handleButtonClick()
              }} className="toggles-btn-view" id="button-container" >

                <div id="my-button" className="toggle-button-element" style={{ transform: buttonState ? 'translateX(0px)' : 'translateX(80px)' }}>
                  <p className='m-0 self-btn'>{buttonState ? 'Self' : 'Team'}</p>

                </div>
                <p className='m-0 team-btn' style={{ transform: buttonState ? 'translateX(0px)' : 'translateX(-80px)' }}>{buttonState ? 'Team' : 'Self'}</p>
              </div>

            </div>}


            {verifyEditPermission("LEAVE") && <button className="apply-button btn-primary mr-2" onClick={() => {
              setState(prevState => ({
                ...prevState,
                showForm: true
              }))
            }}><i className="fa fa-plus" /> Apply</button>}
            {verifyViewPermission("LEAVE") && <BsSliders className='filter-btn' size={30} onClick={() => setState(prevState => ({
              ...prevState,
              showFilter: !prevState.showFilter
            }))} />}
          </div>

        </div>
        {state.showFilter && <div className='mt-4 filterCard p-3'>
          {verifyViewPermissionForTeam("LEAVE") && <div className="row">
            <div className="col-md-4">
              <div className="form-group form-focus">
                <BranchDropdown defaultValue={state.branchId} onChange={e => {
                  setState(prevState => ({
                    ...prevState,
                    branchId: e.target.value
                  }))
                }}></BranchDropdown>
                <label className="focus-label">Location</label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group form-focus">
                <DepartmentDropdown defaultValue={state.departmentId} onChange={e => {
                  setState(prevState => ({
                    ...prevState,
                    departmentId: e.target.value
                  }))
                }}></DepartmentDropdown>
                <label className="focus-label">Department</label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group form-focus">
                <JobTitlesDropdown defaultValue={state.jobTitleId} onChange={e => {
                  setState(prevState => ({
                    ...prevState,
                    jobTitleId: e.target.value
                  }))
                }}></JobTitlesDropdown>
                <label className="focus-label">Job Titles</label>
              </div>
            </div>
          </div>}
          <div className="row">
            <div className="col-md-3">
              <div className="form-group form-focus">
                <input onChange={e => {
                  setState(prevState => ({
                    ...prevState,
                    q: e.target.value,
                    page: 0
                  }))
                }} type="text" className="form-control floating" />
                <label className="focus-label">Search</label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group form-focus">
                <input value={state.fromDate} onChange={e => {
                  setState(prevState => ({
                    ...prevState,
                    fromDate: e.target.value
                  }))
                }} type="date" className="form-control floating" />
                <label className="focus-label">From Date</label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group form-focus">
                <input value={state.toDate} onChange={e => {
                  setState(prevState => ({
                    ...prevState,
                    toDate: e.target.value
                  }))
                }} type="date" className="form-control floating" />
                <label className="focus-label">To Date</label>
              </div>
            </div>
            <div className="col-md-3">
              <a href="#" onClick={() => {
                fetchList();
              }} className="btn btn-success btn-block"> Search </a>
            </div>
          </div>
        </div>}
        <div className='Table-card'>
          <div className="tableCard-body">

            {verifyViewPermission("LEAVE") && <div className=" p-12 m-0">
              <div className="row " >
                <div className="mt-3 col">
                  <h3 className="page-titleText">Leave List</h3>
                </div>

                <div className='col-md-auto'  >
                  {verifyApprovalPermission("LEAVE") && data && data.length > 0 && <ButtonGroup className='pull-right my-3'>
                    <button
                      disabled={!data || data.length == 0}
                      className='markAll-btn btn-sm btn-outline-secondary mr-3'
                      onClick={() => {
                        updateAll('APPROVED');
                      }}>Mark All As Approved</button>
                    <button
                      disabled={!data || data.length == 0}
                      className='markAll-btn-rejected btn-sm btn-outline-secondary mr-3'
                      onClick={() => {
                        updateAll('REJECTED');
                      }}>Mark All As Rejected</button>
                    <button
                      disabled={!selected || selected.length == 0}
                      className='markAll-btn btn-sm btn-outline-secondary mr-3'
                      onClick={() => {
                        updateSelected('APPROVED');
                      }}>Mark Selected As Approved</button>
                    <button
                      disabled={!selected || selected.length == 0}
                      className='markAll-btn-rejected btn-sm btn-outline-secondary'
                      onClick={() => {
                        updateSelected('REJECTED');
                      }}>Mark Selected As Rejected</button>
                  </ButtonGroup>}
                </div>
              </div>
            </div>}
            {/* /Page Header */}
            <div className="tableCard-container row">
              <div className="col-md-12">
                <div className="table-responsive">
                  {verifyViewPermission("LEAVE") && <Table id='Table-style' className="table-striped "
                    pagination={{
                      total: totalRecords,
                      showTotal: () => {
                        return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                      },
                      showSizeChanger: true, onShowSizeChange: pageSizeChange,
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
                    onChange={onTableDataChange}
                  />}
                  {!verifyViewPermission("LEAVE") && <AccessDenied></AccessDenied>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      <Modal enforceFocus={false} size={"md"} show={state.showForm} onHide={hideForm} >
        <Header closeButton>
          <h5 className="modal-title">{state.leave ? 'Edit' : 'Apply'} Leave</h5>
        </Header>
        <Body>
          <LeaveForm showAlert={showAlert} updateList={updateList} leave={state.leave} employeeId={state.employeeId}>
          </LeaveForm>
        </Body>
      </Modal>
      <Modal enforceFocus={false} size={"md"} show={state.showLeaveAction && verifyApprovalPermission("LEAVE") && state.self != 1} onHide={hideLeaveAction} >
        <Header closeButton>
          <h5 className="modal-title">Leave Action</h5>
        </Header>
        <Body>
          <LeaveAction showAlert={showAlert} updateList={updateList} leave={state.leave} employeeId={state.employeeId}>
          </LeaveAction>
        </Body>
      </Modal>
      {/* view */}
      <Modal enforceFocus={false} size={"xl"} show={state.showViewForm} onHide={hideViewForm} >
        <Header closeButton>
          <h5 className="modal-title">Leave Details</h5>
        </Header>
        <Body>
          <LeaveViewForm leave={state.leave}></LeaveViewForm>
        </Body>
      </Modal>
    </>
  );
}

export default Leave;