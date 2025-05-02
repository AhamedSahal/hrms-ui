import React, { Component } from "react";
import { Table } from "antd";
import { Modal } from "react-bootstrap";
import { itemRender } from "../../../paginationfunction";
import CustomForm from './form';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import {getCustomFieldList, deleteCustomField} from './service'
import { verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from "../../../utility";
import AccessDenied from "../../../MainPage/Main/Dashboard/AccessDenied";
const { Header, Body, Footer, Dialog } = Modal;
export default class CustomField extends Component {
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
    };
  }
  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => { 
    if(verifyOrgLevelViewPermission("Module Setup Hire")){
    getCustomFieldList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
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
  };

  onTableDataChange = (d, filter, sorter) => {
    this.setState(
      {
        page: d.current - 1,
        size: d.pageSize,
        sort:
          sorter && sorter.field
            ? `${sorter.field},${sorter.order == "ascend" ? "asc" : "desc"}`
            : this.state.sort,
      },
      () => {
        this.fetchList();
      }
    );
  };

  
  delete = (res) => {
    confirmAlert({
      title: `Delete Custom Field ${res.name}`,
      message: 'Are you sure, you want to delete this Custom Field?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteCustomField(res.id).then(res => {
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

  pageSizeChange = (currentPage, pageSize) => {
    this.setState(
      {
        size: pageSize,
        page: 0,
      },
      () => {
        this.fetchList();
      }
    );
  };

  updateData = () => {
    this.setState({
        showForm: false,
        custom: undefined,
      });
    this.fetchList();
  }

  hideForm = () => {
    this.setState({
      showForm: false,
      custom: undefined,
    });
  };

  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state;
    let startRange = (currentPage - 1) * size + 1;
    let endRange = currentPage * (size + 1) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
    },{
      title: 'Applicant Field name',
      render: (text, record) => {
         return <>{text.applicant?text.applicant.name:null}</>
      }
      
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
      title: 'Is Required',
      width: 50,
      render: (text, record) => {
        return <span className={text.required ? "badge bg-inverse-success " : "badge bg-inverse-danger"}>
          {text.required ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
            text.required ? 'Yes' : 'No'
          }</span>
      }
    }, 
    {
      title: 'Default',
      width: 50,
      render: (text, record) => {
        return <span className={text.defaults ? "badge bg-inverse-success " : "badge bg-inverse-danger"}>
          {text.defaults ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
            text.defaults ? 'Yes' : 'No'
          }</span>
      }
    },
    {
      title: 'Action',
      width: 50,
      className: "text-center",
      render: (text, record) => (
        <div className="dropdow">
           <><a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
            <i className="las la-bars"></i>
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <a className="dropdown-item" href="#" onClick={() => {
              this.setState({ custom: text, showForm: true })
            }} >
              <i className="fa fa-pencil m-r-5"></i> Edit</a>
            <a className="dropdown-item" href="#" onClick={() => {
              this.delete(text);
            }}>
              <i className="fa fa-trash-o m-r-5"></i> Delete</a>
          </div></>
        </div>
      ),
    }

  ]
    return (
      <div className="page-container content container-fluid">
        {/* Page Header */}
        <div className="tablePage-header">
          <div className="row pageTitle-section">
            <div className="col">
              <h3 className="tablePage-title">Custom Field</h3>
            </div>

            <div className="mt-2 float-right col-auto ml-auto">
            {verifyOrgLevelEditPermission("Module Setup Hire") &&<a
                href="#"
                className="btn apply-button btn-primary"
                onClick={() => {
                  this.setState({
                    showForm: true,
                  });
                }}
              >
                <i className="fa fa-plus" /> Add
              </a>}
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-md-12">
            <div className="mt-3 mb-3 table-responsive">
            {verifyOrgLevelViewPermission("Module Setup Hire") &&
              <Table
                id="Table-style"
                className="table-striped "
                pagination={{
                  total: totalRecords,
                  showTotal: (total, range) => {
                    return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                  },
                  showSizeChanger: true,
                  onShowSizeChange: this.pageSizeChange,
                  itemRender: itemRender,
                  pageSizeOptions: [10, 20, 50, 100],
                  current: currentPage,
                  defaultCurrent: 1,
                }}
                style={{ overflowX: 'auto' }}
                columns={columns}
                dataSource={[...data]}
                onChange={this.onTableDataChange}
              ></Table>
            }
            {!verifyOrgLevelViewPermission("Module Setup Hire") && <AccessDenied></AccessDenied>}
            </div>
          </div>
        </div>

        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
        <Header closeButton>
        <h5 className="modal-title"> Custom Field</h5>
        </Header>
        <Body>
          <CustomForm custom = {this.state.custom} updateData = {this.updateData}></CustomForm>
        </Body>
        </Modal>
      </div>
    );
  }
}
