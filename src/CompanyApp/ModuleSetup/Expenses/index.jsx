import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import ExpensesSettingForm from './ExpensesSettingForm';
import { getExpenseCategoryList,deleteExpense } from './service';
 import { verifyOrgLevelViewPermission, verifyOrgLevelEditPermission } from '../../../utility';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied'; 
const { Header, Body, Footer, Dialog } = Modal;

export default class Expenses extends Component {
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
    if(verifyOrgLevelViewPermission("Module Setup Pay")){
        getExpenseCategoryList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
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
  updateList = (documentType) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == documentType.id);
    if (index > -1)
      data[index] = documentType;
    else {
      data = [documentType, ...data];
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
      expensecategories: undefined
    })
  }
  delete = (expense) => {
    confirmAlert({
      title: `Delete Expense Category ${expense.name}`,
      message: 'Are you sure, you want to delete this Expense Category?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteExpense(expense.id).then(res => {
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
    let endRange = ((currentPage) * (size));
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const columns = [
      {
        title: 'Name', 
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: 'Policy',
        render: (text, record) => (<span>
              {text && text.policy?text.policy:"-"}
        </span>)
      },
      
      {
        title: 'Action',
        width: 50,
        className: "text-center",
        render: (text, record) => (
          <div className="dropdow">
            { verifyOrgLevelEditPermission("Module Setup Pay") && <><a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="las la-bars"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <a className="dropdown-item" href="#" 
              onClick={() => {
                this.setState({ expensecategories: text, showForm: true })
              }} 
              >
                <i className="fa fa-pencil m-r-5"></i> Edit</a>
              <a className="dropdown-item" href="#" onClick={() => {this.delete(text);
              }}>
                <i className="fa fa-trash-o m-r-5"></i> Delete</a>
            </div></>}
          </div>
        ),
      },
    ]
    return (
      <div className="page-container content container-fluid">
      {/* Page Header */}
      <div className="tablePage-header">
        <div className="row pageTitle-section">
          <div className="col">
            <h3 className="tablePage-title">Expense Categories</h3>
          </div>

          <div className="mt-2 float-right col-auto ml-auto">
          {verifyOrgLevelEditPermission("Module Setup Pay") && <a href="#" className="btn apply-button btn-primary" onClick={() => {
                  this.setState({
                    showForm: true
                  })
                }}><i className="fa fa-plus" /> Add</a>}
          </div>

        </div>
      </div>

      {/* /Page Header */}
      <div className="row">
        <div className="col-md-12">
          <div className="mt-3 mb-3 table-responsive">
              {verifyOrgLevelViewPermission("Module Setup Pay") && <Table id='Table-style' className="table-striped "
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
            {!verifyOrgLevelViewPermission("Module Setup Pay") && <AccessDenied></AccessDenied>}
          </div>
        </div>
      </div>



          <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
            <Header closeButton>
              <h5 className="modal-title">{this.state.expensecategories ? 'Edit' : 'New'} Expense Category</h5>
            </Header>
            <Body>
              <ExpensesSettingForm updateList={this.updateList} expensecategories={this.state.expensecategories}>
              </ExpensesSettingForm>
            </Body>
          </Modal>
        </div>
    );
  }
}
