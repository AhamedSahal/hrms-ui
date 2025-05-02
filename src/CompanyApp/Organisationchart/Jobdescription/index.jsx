import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import JobDescriptionForm from './form';
import JobDescriptionAction from './JobdescriptionApproval/jobDescriptionAction';
import JobDescriptionViewer from './view';
import { deleteJobDescription, getJobDescriptionList } from './service';
import { getTitle, getUserType, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../utility';
import TableDropDown from '../../../MainPage/tableDropDown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const { Header, Body, Footer, Dialog } = Modal;
export default class JobDescription extends Component {
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
    if(verifyOrgLevelViewPermission("Organize Job Description")){
    getJobDescriptionList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

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
  updateList = (JobDescription) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == JobDescription.id);

    if (index > -1)
      data[index] = JobDescription;
    else {
      data = [JobDescription, ...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
      });
  }
  updateListAction = (jobdescription) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == jobdescription.id);

    if (index > -1)
      data[index] = jobdescription;
    else {
      data = [jobdescription, ...data];
    }
    this.setState({ data },
      () => {
        this.hideJobDescriptionAction();
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
      showForm: false

    })
  }
  hideJobDescriptionAction = () => {
    this.setState({
      showJobDescriptionAction: false
    })
  }
  hideJobDescriptionView = () => {
    this.setState({
      showJobDescriptionView: false,
      jobdescription: undefined
    })
  }
  delete = (JobDescription) => {
    confirmAlert({
      title: `Delete Job Description ${JobDescription.name}`,
      message: 'Are you sure, you want to delete this Job Description?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteJobDescription(JobDescription.id).then(res => {
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
  getStyle(text) {
    if (text === 'REQUESTED') {
      return <span className='badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i> Requested</span>;
    }
    if (text === 'CANCELED') {
      return <span className='badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i> Canceled</span>;
    }
    if (text === 'APPROVED') {
      return <span className='badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i> Approved</span>;
    }
    if (text === 'REJECTED') {
      return <span className='badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i> Rejected</span>;
    }
    if (text === 'PENDING') {
      return <span className='badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i> Pending</span>;
    }
    return 'black';
  }
  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    
    const menuItems = (JobDescription, record) => {
      const items = [];
      items.push(
        <div key="1">
          <a className="muiMenu_item" href="#" onClick={() => {
            let { jobdescription } = this.state;
            jobdescription = JobDescription;
            this.setState({ jobdescription, showJobDescriptionView: true, showForm: false })
          }}  ><i className="fa fa-user m-r-5" /> View </a>
        </div>
      );
      if (!isCompanyAdmin && JobDescription.approvalStatus == "PENDING") {
        items.push(
          <div key="3">
            <a className="muiMenu_item" href="#" onClick={() => {
              let { jobdescription } = this.state;
              jobdescription = JobDescription;
              this.setState({ jobdescription, showJobDescriptionAction: true, showForm: false })
            }} >
              <i className="las la-check-double m-r-5"></i> Approval Action</a>
          </div>
        );
      }
      items.push(
        <div key="1">
          <a className="muiMenu_item" href="#" onClick={() => {
            this.delete(JobDescription);
          }}>
            <i className="fa fa-trash-o m-r-5"></i> Delete</a>
        </div>
      )
      return items;

    };

    const columns = [
      {
        title: 'Job Code',
        dataIndex: 'name',
        sorter: true,
      },

      {
        title: 'Job Titles',
        sorter: true,
        render: (text, record) => {
          return <span>{text && text ? record.jobTitles?.name : "-"}</span>
        }
      },
      {
        title: 'Department',
        sorter: true,
        render: (text, record) => {
          return <span>{text && text ? record.department?.name : "-"}</span>
        }
      },
      
      {
        title: 'Status',
        dataIndex: 'approvalStatus',
        sorter: true,

        render: (approvalStatus, record) => {
          return <> <div>{this.getStyle(approvalStatus)}</div>
          </>
        }
      },
      {
        title: 'Action',
        width: 50,
        render: (JobDescription, record) => (
          <div className="">
            <TableDropDown menuItems={menuItems(JobDescription, record)} />
          </div>
        ),
      },
      
    ]
    return (
      <div className="insidePageDiv">
        <Helmet>
          <title>JobDescription  | {getTitle()}</title>
          <meta name="description" content="JobTitles page" />
        </Helmet>
        <div className="page-containerDocList content container-fluid">
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title" >Job Description</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item active">Job Description</li>
                </ul>
              </div>
              <div className="mt-1 float-right col">

                <div className="float-right col-auto ml-auto">
                {verifyOrgLevelEditPermission("Organize Job Description") &&
                  <a href="#" className="btn apply-button btn-primary" onClick={() => {
                    this.setState({
                      showForm: true
                    })

                  }}><i className="fa fa-plus" /> Create Job Description</a>
                  }</div>

              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
              {verifyOrgLevelViewPermission("Organize Job Description") &&
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
                {!verifyOrgLevelViewPermission("Organize Job Description") && <AccessDenied></AccessDenied>}

              </div>
            </div>
          </div>
        </div>



        {/* Page Content */}


        <Modal enforceFocus={false} size={"xl"} show={this.state.showForm} onHide={this.hideForm} >


          <Header closeButton>
            <h5 className="modal-title">{this.state.JobDescription ? 'Create' : 'Create'} Job Description</h5>

          </Header>
          <Body>
            <JobDescriptionForm updateList={this.updateList} JobDescription={this.state.JobDescription}>
            </JobDescriptionForm>
          </Body>


        </Modal>
        <Modal enforceFocus={false} size={"md"} show={this.state.showJobDescriptionAction && !isCompanyAdmin} onHide={this.hideJobDescriptionAction} >
          <Header closeButton>
            <h5 className="modal-title">Job Description Action</h5>
          </Header>
          <Body>
            <JobDescriptionAction updateListAction={this.updateListAction} jobdescription={this.state.jobdescription} >
            </JobDescriptionAction>
          </Body>


        </Modal>
        <Modal enforceFocus={false} size={"xl"} show={this.state.showJobDescriptionView} onHide={this.hideJobDescriptionView} >


          <Body>
            <JobDescriptionViewer jobdescription={this.state.jobdescription} />
          </Body>
        </Modal>

      </div>
    );
  }
}

