import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import JobTitlesForm from './form';
import { deletejobTitles, getJobTitlesList } from './service';
import { getTitle, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../utility';
import TableDropDown from '../../../MainPage/tableDropDown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const { Header, Body, Footer, Dialog } = Modal;
export default class JobTitles extends Component {
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
    if(verifyOrgLevelViewPermission("Organize Job Titles")){
    getJobTitlesList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

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
  updateList = (jobTitles) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == jobTitles.id);
    if (index > -1)
      data[index] = jobTitles;
    else {
      data = [jobTitles, ...data];
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
      jobTitles: undefined
    })
  }
  delete = (jobTitles) => {
    confirmAlert({
      title: `Delete Job Titles ${jobTitles.name}`,
      message: 'Are you sure, you want to delete this Job Titles?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deletejobTitles(jobTitles.id).then(res => {
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
      <div > <a className="muiMenu_item" href="#" onClick={() => {
        this.setState({ jobTitles: text, showForm: true })
      }} >
        <i className="fa fa-pencil m-r-5"></i> Edit</a></div>,
      <div > <a className="muiMenu_item" href="#" onClick={() => {
        this.delete(text);
      }}>
        <i className="fa fa-trash-o m-r-5"></i> Delete</a></div>,
    ]
    const columns = [
      {
        title: 'Job Titles',
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
      <div className="insidePageDiv">
        <Helmet>
          <title>Job Titles  | {getTitle()}</title>
          <meta name="description" content="JobTitles page" />
        </Helmet>
        <div className="page-containerDocList content container-fluid">
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Job Titles</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item active">Job Titles</li>
                </ul>
              </div>

              <div className="mt-1 float-right col">
              {verifyOrgLevelEditPermission("Organize Job Titles") &&
                <a href="#" className="btn apply-button btn-primary" onClick={() => {
                  this.setState({
                    showForm: true
                  })

                }}><i className="fa fa-plus" /> Add Job Titles</a>}

              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
              {verifyOrgLevelViewPermission("Organize Job Titles") &&
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
                {!verifyOrgLevelViewPermission("Organize Job Titles") && <AccessDenied></AccessDenied>}

              </div>
            </div>
          </div>
        </div>




        {/* /Page Content */}


        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


          <Header closeButton>
            <h5 className="modal-title">{this.state.jobTitles ? 'Edit' : 'Add'} Job Titles</h5>

          </Header>
          <Body>
            <JobTitlesForm updateList={this.updateList} jobTitles={this.state.jobTitles}>
            </JobTitlesForm>
          </Body>


        </Modal>
      </div>
    );
  }
}
