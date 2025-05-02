import { Table } from 'antd';
import React, { Component } from 'react';
import { Button, ButtonGroup, Col, Modal, Row } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { itemRender } from '../../../paginationfunction';
import { getUserType, verifyApprovalPermission, verifyEditPermission, verifySelfViewPermission, verifyViewPermission, verifyViewPermissionForTeam } from '../../../utility';
import { deleteCategory, getSurveyCategoryList } from './service';
import CategoryForm from './categoryForm';

import { toast } from 'react-toastify';

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const { Header, Body, Footer, Dialog } = Modal;
export default class SurveyCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      q: "",
      status:"ACTIVE",
      name:"",
      categoryId:"",
      page: 0,
      size: 10,
      sort: "desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      showFilter: false,
      selected: []
    };
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    if (verifyViewPermission("LEAVE")) {
      getSurveyCategoryList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.status).then(res => {
        if (res.status == "OK") {
          this.setState({
            data: res.data.list,
            totalPages: res.data.totalPages,
            totalRecords: res.data.totalRecords,
            currentPage: res.data.currentPage + 1,
            employeeName: res.data.employeeName
          })
        }
      })
    }
  }
  updateList = (category) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == category.id);
    if (index > -1)
      data[index] = category;
    else {
      data = [category, ...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
      });
  }
  hideForm = () => {
    this.setState({
      showForm: false,
      category: undefined
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
  delete = (data) => {
    confirmAlert({
      title: `Delete Category`,
      message: 'Are you sure, you want to delete '+data.name+'?',
      buttons: [
        {
          className: "btn btn-danger",
          label: 'Yes',
          onClick: () => deleteCategory(data.id).then(res => {
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
    const columns = [
       {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{record.name}</div>
          </>
        }
      },
      {
        title: 'Action',
        width: 50,
        render: (text, record) => (
          <Row>
            <Col >
              <div className="dropdow">
                <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                  <i className="las la-bars"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right">
                  {verifyEditPermission("LEAVE") && <a className="dropdown-item" href="#" onClick={() => {
                    let { category } = this.state;
                    category = text;
                    this.setState({ category, showForm: true })
                  }} >
                    <i className="fa fa-pencil m-r-5"></i> Edit</a>}
                  {verifyEditPermission("LEAVE") && <a className="dropdown-item" href="#" onClick={() => {
                    this.delete(text);
                  }}>
                    <i className="fa fa-trash-o m-r-5"></i> Delete</a>}
                </div>
              </div>
            </Col>
          </Row>
        ),
      },
    ]
    return (
      <>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">    
              <div className="col-md-7">
               {getUserType() == 'SUPER_ADMIN' ? (<h3 className="page-title">Survey Template Category</h3>)
               : (<h3 className="page-title">Manage Survey Category</h3>)}
              </div>
              <div className="col-md-5 btn-group">
                {verifyViewPermissionForTeam("Survey") && !isCompanyAdmin && <>
                  <div class="btn-group btn-cust-group" role="group" aria-label="Basic example">
                    {verifySelfViewPermission("Survey") && <button type="button" className={this.state.self == 1 ? 'btn btn-sm btn-primary btn-selected' : 'btn btn-sm btn-secondary'} onClick={e => {
                      this.updateSelf()
                    }} > Self </button>}

                    <button type="button" className={this.state.self != 1 ? 'btn btn-sm btn-primary btn-selected' : 'btn btn-sm btn-secondary'} onClick={e => {
                      verifySelfViewPermission("Survey") && this.updateSelf()
                    }} > Team </button>
                  </div>
                </>}
                {verifyEditPermission("Survey") && <Button className="btn add-btn" onClick={() => {
                  this.setState({
                    showForm: true
                  })
                }}><i className="fa fa-plus" /> New</Button>}
                
              </div>
            </div>
          </div>
          <div className='card'>
            <div className="card-body p-0">
              {/* /Page Header */}
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    {verifyViewPermission("Survey") && <Table className="table-striped table-border manage-survey-table"
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
                    {!verifyViewPermission("Survey") && <AccessDenied></AccessDenied>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
          <Header closeButton>
            <h5 className="modal-title">Add Survey Category</h5>
          </Header>
          <Body>
          <CategoryForm updateList={this.updateList} category={this.state.category}></CategoryForm>
          </Body>
        </Modal>
      </>
    );
  }
}
