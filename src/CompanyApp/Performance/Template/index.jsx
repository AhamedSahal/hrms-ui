import { Table } from 'antd';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import { deletePerformanceTemplate, getPerformanceTemplateList,getObjectiveGroups } from './service';
import { getTitle } from '../../../utility';
import PerformanceTemplateForm from './form';
const { Header, Body, Footer, Dialog } = Modal;
export default class PerformanceTemplate extends Component {
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
    getObjectiveGroups().then(res => {
      if (res.status == "OK") {
      this.setState({
        objectiveGroups: res.data
      })
    }else{
      toast.error(res.message);
    }
    });
  }
  fetchList = () => {
    getPerformanceTemplateList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
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
  onTableDataChange = (d, filter, sorter) => {
    this.setState({
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
    }, () => {
      this.fetchList();
    })
  }
  updateList = (performanceTemplate) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == performanceTemplate.id);
    if (index > -1)
      data[index] = performanceTemplate;
    else {
      data=[performanceTemplate,...data];
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
      performanceTemplate: undefined
    })
  }
  delete = (performanceTemplate) => {
    confirmAlert({
      title: `Delete Performance Review Template ${performanceTemplate.name}`,
      message: 'Are you sure, you want to delete this Performance Review Template?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deletePerformanceTemplate(performanceTemplate.id).then(res => {
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
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
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
              <Link className="dropdown-item" to={'/app/company-app/performance/template/details/'+text.id} >
                <i className="fa fa-cogs m-r-5"></i> Configure</Link>
              <a className="dropdown-item" href="#" onClick={() => {
                this.delete(text);
              }}>
                <i className="fa fa-trash-o m-r-5"></i> Delete</a>

            </div>
          </div>
        ),
      },
    ]
    return (
      <div className="page-wrapper">
        <Helmet>
          <title>Performance Review Template  | {getTitle()}</title>
          <meta name="description" content="Branch page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Performance Review Template</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item active">Performance Review Template</li>
                </ul>
              </div>
              <div className="float-right col-auto ml-auto">
                <a href="#" className="btn add-btn" onClick={() => {
                  this.setState({
                    showForm: true
                  })

                }}><i className="fa fa-plus" /> Add Performance Review Template</a>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">

                <Table className="table-striped table-border"
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
                />

              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}


        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


          <Header closeButton>
            <h5 className="modal-title">{this.state.performanceTemplate ? 'Edit' : 'Add'} Performance Review Template</h5>

          </Header>
          <Body>
            <PerformanceTemplateForm updateList={this.updateList} objectiveGroups={this.state.objectiveGroups} performanceTemplate={this.state.performanceTemplate}>
            </PerformanceTemplateForm>
          </Body>


        </Modal>
      </div>
    );
  }
}
