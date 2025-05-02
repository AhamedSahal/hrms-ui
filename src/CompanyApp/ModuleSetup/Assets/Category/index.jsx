import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { itemRender } from "../../../../paginationfunction";
import AssetsCategoryForm from './form';
import {  getAssetsCategoryList } from './service';
import { getTitle, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../../utility';
import AccessDenied from '../../../../MainPage/Main/Dashboard/AccessDenied';
const { Header, Body, Footer, Dialog } = Modal;
export default class AssetsCategory extends Component {
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
    if(verifyOrgLevelViewPermission("Module Setup Manage")){
    getAssetsCategoryList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

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
  updateList = (Assetscategory) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == Assetscategory.id);
    if (index > -1)
      data[index] = Assetscategory;
    else {
      data = [Assetscategory, ...data];
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
      Assetscategory: undefined
    })
  } 
  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const columns = [
      {
        title: 'Category',
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
          <div className="dropdow">
            <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="las la-bars"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <a className="dropdown-item" href="#" onClick={() => {
                this.setState({ Assetscategory: text, showForm: true })
              }} >
             <i className="fa fa-pencil m-r-5"></i> Edit</a> 

            </div>
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
                <h3 className="tablePage-title">Assets Category</h3>
              </div>
              <div className="float-right col-auto mt-2">
                <div className="row justify-content-end">
                {verifyOrgLevelEditPermission("Module Setup Manage") && <>
                  <a href="#" className="btn apply-button btn-primary" onClick={() => {
                    this.setState({
                      showForm: true
                    })

                  }}><i className="fa fa-plus" /> Add Asset Category</a></>}

                </div>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
              {verifyOrgLevelViewPermission("Module Setup Manage") &&
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
                {!verifyOrgLevelViewPermission("Module Setup Manage") && <AccessDenied></AccessDenied>}  
              </div>
            </div>
          </div>
        </div>




        {/* /Page Content */}


        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


          <Header closeButton>
            <h5 className="modal-title">{this.state.Assetscategory ? 'Edit' : 'Add'} Asset Category</h5>

          </Header>
          <Body>
            <AssetsCategoryForm updateList={this.updateList} Assetscategory={this.state.Assetscategory}>
            </AssetsCategoryForm>
          </Body>


        </Modal>
      </>
    );
  }
}
