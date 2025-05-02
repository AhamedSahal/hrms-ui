import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { itemRender } from "../../../../paginationfunction";
// import JobDescriptionForm from './form';
import JobDescriptionAction from './jobDescriptionAction'; 
import JobDescriptionViewer from './../view';
 import { deleteJobDescription, getJobDescriptionList } from './service'; 
import { getTitle,getUserType } from '../../../../utility';
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
    getJobDescriptionList(this.state.q, this.state.page, this.state.size, this.state.sort ).then(res => {

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
  updateList = (JobDescription) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id ==  JobDescription.id);
  
    if (index > -1)
      data[index] = JobDescription;
    else {
      data=[JobDescription,...data];
    }
    this.setState({ data },
      () => {
        // this.hideForm(); 
      });
  }
  updateListAction = (jobdescription) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id ==  jobdescription.id);
  
    if (index > -1)
      data[index] = jobdescription;
    else {
      data=[jobdescription,...data];
    }
    this.setState({ data },
      () => {
        this.hideJobDescriptionAction(); 
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
  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
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
          return <span>{text && text ? record.jobTitles?.name : "-" }</span>
        }
      },
       {
        title: 'Department', 
        sorter: true,
        render: (text, record) => { 
          return <span>{text && text ? record.department?.name : "-" }</span>
        }
      },
      {
        title: 'Status',
        dataIndex: 'approvalStatus',
        sorter: true,
        width: '10%'
        
      },
      {
        title: 'Action',
        width: 50,
        className: "text-center",
        render: (JobDescription, record) => (
          <div className="dropdow">
            <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="las la-bars"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
            {  <a className="dropdown-item" href="#" onClick={() => {
                let { jobdescription } = this.state;
                jobdescription = JobDescription;
               this.setState({ jobdescription , showJobDescriptionView: true, showForm: false })
              }}  ><i className="fa fa-user m-r-5" /> View </a>}
            {!isCompanyAdmin && JobDescription.approvalStatus == "PENDING" &&<a className="dropdown-item" href="#" onClick={() => {
                 let { jobdescription } = this.state;
                 jobdescription = JobDescription;
                this.setState({ jobdescription , showJobDescriptionAction: true, showForm: false })
              }} >
                <i className="las la-check-double m-r-5"></i> Approval Action</a>} 
               <a className="dropdown-item" href="#" onClick={() => {
                this.delete(JobDescription);
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
          <title>Job Description  | {getTitle()}</title>
          <meta name="description" content="JobTitles page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Job Description</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item active">Job Description</li>
                </ul>
              </div>
              {isCompanyAdmin && <div className="float-right col-auto ml-auto">
                <a href="#" className="btn add-btn btn-primary" onClick={() => {
                  this.setState({
                    showForm: true
                  })

                }}><i className="fa fa-plus" /> Add Job Description</a>
              </div>}
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

