import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import { getTitle, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../utility';
import { DropdownService } from '../Dropdown/DropdownService';
import DepartmentForm from './form';
import { deleteDepartment, getDepartmentList } from './service';
import TableDropDown from '../../../MainPage/tableDropDown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';

const { Header, Body, Footer, Dialog } = Modal;

export default class Department extends Component {
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
    if(verifyOrgLevelViewPermission("Organize Org Setup")){
    getDepartmentList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

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
  updateList = (department) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == department.id);
    if (index > -1)
      data[index] = department;
    else {
      data=[department,...data];
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
      department: undefined
    })
  }
  delete = (department) => {
    confirmAlert({
      title: `Delete Department ${department.name}`,
      message: 'Are you sure, you want to delete this Department?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteDepartment(department.id).then(res => {
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
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const menuItems = (text, record) => [
      <div ><a className="muiMenu_item" href="#" onClick={() => {
        this.setState({ department: text, showForm: true })
      }} >
        <i className="fa fa-pencil m-r-5"></i> Edit</a></div>,
      <div > <a className="muiMenu_item" href="#" onClick={() => {
        this.delete(text);
      }}>
        <i className="fa fa-trash-o m-r-5"></i> Delete</a></div>,
    ]

    const columns = [
      {
        title: 'Department',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: 'Is Active',
        width: 50,
        render: (text, record) => {
          return <span className={text.active ? "badge bg-inverse-success " : "badge bg-inverse-danger"}>
            {text.active ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
              text.active ? 'Yes' : 'No'
            }</span>
        }
      },
      {
        title: 'Action',
        width: 50,
        className: "text-center",
        render: (text, record) => (
          <div className="">
            <TableDropDown menuItems={menuItems(text, record)} />
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
              <h3 className="tablePage-title">Department</h3>
            </div>
            <div className="float-right col-auto mt-2">
              <div className="row justify-content-end">
              {verifyOrgLevelEditPermission("Organize Org Setup") &&
              <a href="#" className="btn apply-button btn-primary" onClick={() => {
                  this.setState({
                    showForm: true
                  })

                }}><i className="fa fa-plus" /> Add Department</a>}

              </div>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-md-12">
            <div className="mt-3 mb-3 table-responsive">
            {verifyOrgLevelViewPermission("Organize Org Setup") &&
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
                {!verifyOrgLevelViewPermission("Organize Org Setup") && <AccessDenied></AccessDenied>}
            </div>
          </div>
        </div>
      </div>



      
         
        {/* /Page Content */}


        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


          <Header closeButton>
            <h5 className="modal-title">{this.state.department ? 'Edit' : 'Add'} Department</h5>

          </Header>
         <Body>
            <DepartmentForm updateList={this.updateList} department={this.state.department}>
            </DepartmentForm>
          </Body> 


        </Modal>
      </>
    );
  }
}
 
