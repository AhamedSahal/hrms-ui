import { Table } from 'antd';
import React, { Component } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { itemRender } from '../../../paginationfunction';
import { getUserType, verifyEditPermission, verifyOrgLevelViewPermission, verifyViewPermission } from '../../../utility';
import SurveyForm from './form';
import { deleteSurvey, getStandByList } from './service';
import { Link } from 'react-router-dom';
import TableDropdown from '../../../MainPage/tableDropDown';

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const { Header, Body, Footer, Dialog } = Modal;
export default class StandBy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      q: "",
      page: 0,
      size: 10,
      sort: "desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      showFilter: false,
      refresh: false,
      id:0
    };

  }
  componentDidMount() {
    this.fetchList();
  }


  fetchList = () => {
    if(verifyOrgLevelViewPermission("Survey")){
    getStandByList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
      if (res.status == "OK") {
        this.setState({
          data: res.data.list,
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage + 1,
        })
      }
    })
  }
  }
  delete = (data) => {
    confirmAlert({
      title: `Delete Survey`,
      message: 'Are you sure, you want to delete '+data.name+'?',
      buttons: [
        {
          className: "btn btn-danger",
          label: 'Yes',
          onClick: () => deleteSurvey(data.id).then(res => {
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

  hideForm = () => {
    this.setState({
      showForm: false,
      survey: undefined
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

  updateList = (survey) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == survey.id);
    if (index > -1) {
      data[index] = survey;
    }
    else {
      data = [survey, ...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
      });
  }
  onTableDataChange = (d, filter, sorter) => {
    this.setState({
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
    }, () => {
      this.fetchList();
    })
  }

  render() {
    const { data, totalPages, totalRecords, currentPage, size, selected } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const menuItems = (text, record) => [
      <div key="1"><Link
        className="muiMenu_item"
        to="/app/company-app/survey/manage"
        state={{ data: record }}
      >
        <i className="fa fa-pencil m-r-5"></i>  Edit
      </Link></div>,
      <div key="2"> <a className="muiMenu_item" href="#" onClick={() => { this.delete(text); }} >
        <i className="fa fa-trash-o m-r-5"></i> Delete</a></div>,
    ]

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
        title: 'Invited Users',
        width: 50,
        dataIndex: 'participantCount'
      },
      {
        title: 'Action',
        width: 50,
        render: (text, record) => (
          <div className="">
            <TableDropdown menuItems={menuItems(text , record)} />
          </div>
        ),
      },
    ]
    return (
      <>
        {/* Page Content */}
        <div className="page-container content container-fluid">
          {/* Page Header */}
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Manage Survey</h3>
              </div>
              <div className="float-right d-flex col-auto mt-2">
                <div style={{ margin: '-6px 0px 6px 0px' }} className="col-md-8">
                  <input onChange={e => {
                    this.setState({
                      q: e.target.value
                    })
                  }} type="text" className="form-control" placeholder='Search' />
                </div>
                <div className='col-md-6'>
                  <button className="btn btn-primary btn-group-sm"
                    onClick={() => { this.fetchList() }}><i className="fa fa-search" /> Search</button>
                </div>

              </div>
            </div>
          </div>


          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
                {verifyViewPermission("Survey") && verifyOrgLevelViewPermission("Survey") && <Table id='Table-style' className="table-striped"
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
        {/* /Page Content */}
        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
          <Header closeButton>
            <h5 className="modal-title">{this.state.survey ? "Edit Survey" : "Add Survey"}</h5>
          </Header>
          <Body>
            <SurveyForm survey={this.state.survey} updateList={this.updateList} fetchList={this.fetchList}></SurveyForm>
          </Body>
        </Modal>
      </>
    );
  }
}