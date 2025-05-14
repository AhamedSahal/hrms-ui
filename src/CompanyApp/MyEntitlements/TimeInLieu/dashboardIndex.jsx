import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table } from 'antd';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import { getReadableDate, getUserType } from '../../../utility';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import TimeInLieuAction from './action';
import TimeInLieuForm from './form';
import { deleteTimeinlieu, getTeamEntitlementTimeinlieuList } from './service';
import TableDropDown from '../../../MainPage/tableDropDown';

const TeamTimeinlieu = () => {
  const { id } = useParams();
  const [state, setState] = useState({
    employeeId: id,
    data: [],
    q: "",
    page: 0,
    size: 10,
    sort: "id,desc",
    totalPages: 0,
    totalRecords: 0,
    currentPage: 1,
    defaultEmployeeId: 0,
    showForm: false,
    showAction: false,
    timeinlieu: undefined,
  });

  useEffect(() => {
    fetchList();
  }, [state.page, state.size, state.sort]);

  const fetchList = () => {
    getTeamEntitlementTimeinlieuList(state.defaultEmployeeId, state.q, state.page, state.size, state.sort).then(res => {
      if (res.status === "OK") {
        setState(prevState => ({
          ...prevState,
          data: res.data.list,
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage + 1
        }));
      }
    });
  };

  const onTableDataChange = (d, filter, sorter) => {
    setState(prevState => ({
      ...prevState,
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.field},${sorter.order === 'ascend' ? 'asc' : 'desc'}` : prevState.sort
    }));
  };

  const updateList = (timeinlieu) => {
    let { data } = state;
    let index = data.findIndex(d => d.id === timeinlieu.id);
    if (index > -1) data[index] = timeinlieu;
    else data = [timeinlieu, ...data];

    setState(prevState => ({
      ...prevState,
      data,
      showForm: false,
      showAction: false,
      timeinlieu: undefined
    }));
  };

  const pageSizeChange = (currentPage, pageSize) => {
    setState(prevState => ({
      ...prevState,
      size: pageSize,
      page: 0
    }));
  };

  const hideForm = () => {
    setState(prevState => ({
      ...prevState,
      showForm: false,
      timeinlieu: undefined
    }));
  };

  const hideAction = () => {
    setState(prevState => ({
      ...prevState,
      showAction: false,
      timeinlieu: undefined
    }));
  };

  const deleteItem = (timeinlieu) => {
    confirmAlert({
      title: `Delete Time In Lieu ${timeinlieu.forDate}`,
      message: 'Are you sure, you want to delete this Time In Lieu?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteTimeinlieu(timeinlieu.id).then(res => {
            if (res.status === "OK") {
              toast.success(res.message);
              fetchList();
            } else {
              toast.error(res.message);
            }
          })
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
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
    return 'black';
  };

  const isCompanyAdmin = getUserType() === 'COMPANY_ADMIN';
  const { data, totalPages, totalRecords, currentPage, size } = state;
  let startRange = ((currentPage - 1) * size) + 1;
  let endRange = ((currentPage) * (size + 1)) - 1;
  if (endRange > totalRecords) {
    endRange = totalRecords;
  }

  const menuItems_emp = (text) => [
    <div><a className="muiMenu_item" href="#" onClick={() => {
      setState(prevState => ({ ...prevState, timeinlieu: text, showForm: true }));
    }}>
      <i className="fa fa-pencil m-r-5"></i> Edit</a></div>,
    <div><a className="muiMenu_item" href="#" onClick={() => {
      deleteItem(text);
    }}>
      <i className="fa fa-trash-o m-r-5"></i> Delete</a></div>,
  ];

  const menuItems_admin = (text) => [
    <div><a className="muiMenu_item" href="#" onClick={() => {
      setState(prevState => ({ ...prevState, timeinlieu: text, showAction: true }));
    }}>
      <i className="fa fa-pencil m-r-5"></i> Action</a></div>,
    <div><a className="muiMenu_item" href="#" onClick={() => {
      deleteItem(text);
    }}>
      <i className="fa fa-trash-o m-r-5"></i> Delete</a></div>,
  ];

  const columns_emp = [
    {
      title: 'Employee',
      render: (text) => (
        <EmployeeListColumn id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
      ),
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
      render: (text) => (
        <div>{getStyle(text)}</div>
      ),
    },
    {
      title: 'Approval Level',
      dataIndex: 'currentApprovalLevel',
      sorter: true,
    },
    {
      title: 'Approver',
      sorter: false,
      render: (text) => (
        <div>{getStyle(text.approver?.name)}</div>
      ),
    },
    {
      title: 'Action',
      width: 50,
      render: (text) => (
        <div className="">
          <TableDropDown menuItems={menuItems_emp(text)} />
        </div>
      ),
    },
  ];

  const columns_com_admin = [
    {
      title: 'Employee',
      render: (text) => (
        <EmployeeListColumn id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
      ),
      sorter: false,
    },
    {
      title: 'Date',
      dataIndex: 'forDate',
      sorter: true,
      render: (text) => (
        <div>{getReadableDate(text)}</div>
      ),
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
      render: (text) => (
        <div>{getStyle(text)}</div>
      ),
    },
    {
      title: 'Approval Level',
      dataIndex: 'currentApprovalLevel',
      sorter: false,
    },
    {
      title: 'Approver',
      render: (text) => (
        <span>{text.approver?.name}</span>
      ),
    },
    {
      title: 'Action',
      width: 50,
      render: (text) => (
        <div className="">
          <TableDropDown menuItems={menuItems_admin(text)} />
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ width: '90%', marginTop: '121px' }} className="page-container content container-fluid">
        <div className="tablePage-header">
          <div className="row pageTitle-section">
            <div className="col">
              <h3 className="tablePage-title">Time In Lieu</h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="mt-3 mb-3 table-responsive">
              {(state.defaultEmployeeId !== 0 || !isCompanyAdmin) && (
                <Table
                  id='Table-style'
                  className="table-striped"
                  pagination={{
                    total: totalRecords,
                    showTotal: (total, range) => `Showing ${startRange} to ${endRange} of ${totalRecords} entries`,
                    showSizeChanger: true,
                    onShowSizeChange: pageSizeChange,
                    itemRender: itemRender,
                    pageSizeOptions: [10, 20, 50, 100],
                    current: currentPage,
                    defaultCurrent: 1,
                  }}
                  style={{ overflowX: 'auto' }}
                  columns={isCompanyAdmin ? columns_com_admin : columns_emp}
                  dataSource={[...data]}
                  rowKey={record => record.id}
                  onChange={onTableDataChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal enforceFocus={false} size={"md"} show={state.showForm} onHide={hideForm}>
        <Modal.Header closeButton>
          <h5 className="modal-title">{state.timeinlieu ? 'Edit' : 'Add'} Time In Lieu</h5>
        </Modal.Header>
        <Modal.Body>
          <TimeInLieuForm updateList={updateList} timeinlieu={state.timeinlieu} employeeId={state.employeeId} />
        </Modal.Body>
      </Modal>
      <Modal enforceFocus={false} size={"md"} show={state.showAction} onHide={hideAction}>
        <Modal.Header closeButton>
          <h5 className="modal-title">Time In Lieu Action</h5>
        </Modal.Header>
        <Modal.Body>
          <TimeInLieuAction updateList={updateList} timeinlieu={state.timeinlieu} employeeId={state.employeeId} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TeamTimeinlieu;
