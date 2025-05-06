import { Table } from 'antd';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import { deletePerformanceReview, getPerformanceReviewList } from './service';
import { getReadableDate, getTitle, getUserType, verifyApprovalPermission, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission, verifySelfViewPermission, verifyViewPermissionForTeam } from '../../../utility';
import PerformanceReviewForm from './form';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import DepartmentDropdown from '../../ModuleSetup/Dropdown/DepartmentDropdown';
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import TableDropdown from '../../../MainPage/tableDropDown';
import JobTitlesDropdown from '../../ModuleSetup/Dropdown/JobTitlesDropdown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { BsSliders } from 'react-icons/bs';
import PerformanceReviewDetailsForm from './detailsForm';
import SuccessAlert from '../../../MainPage/successToast';
import checkimg from '../../../assets/img/tickmarkimg.gif'
const { Header, Body, Footer, Dialog } = Modal;
export default class EmployeePerformanceReview extends Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 2);
    var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    this.state = {
      data: [],
      q: "",
      branchId: "",
      departmentId: "",
      designationId: "",
      jobTitleId: "",
      fromDate: firstDay.toISOString().split('T')[0],
      toDate: lastDay.toISOString().split('T')[0],
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      self: (getUserType()) == 'EMPLOYEE' && !verifyOrgLevelViewPermission("Performance Review") ? true : false,
      showFilter: false,
      msgAlert: false,
      alertMsg: '',
      imgTag: '',
      desc: '',
      showAlert: false,
    };
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    getPerformanceReviewList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.self, this.state.branchId, this.state.departmentId, this.state.jobTitleId, this.state.fromDate, this.state.toDate).then(res => {
      if (res.status == "OK") {
        this.setState({
          data: res.data.list,
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage + 1
        })
      }
    })
    // }
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
      data = [performanceTemplate, ...data];
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
  hideReviewForm = () => {
    this.setState({
      showReviewForm: false,
    })
  }
  updateSelf = () => {
    this.setState({ self: !this.state.self }, () => {
      this.fetchList();
    })
  }

  showAlert = (status) => {
    if (status === 'submit') {
      this.setState({
        alertMsg: 'Submited!',
        imgTag: checkimg,
        desc: 'Submited successfully',
        showAlert: true
      });
    }

    setTimeout(() => {
      this.setState({ showAlert: false });
    }, 3000);
  }
  delete = (performanceReview) => {
    confirmAlert({
      title: `Delete Performance Review ${performanceReview.name}`,
      message: 'Are you sure, you want to delete this Performance Review?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deletePerformanceReview(performanceReview.id).then(res => {
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
    const isAdmin = (verifyOrgLevelViewPermission("Performance Review") || getUserType() == 'COMPANY_ADMIN');
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const menuItems = (text) => [
      <div key="1">
        <Link
          className="muiMenu_item"
          state={{ empId: text.employee.id }}
          to={
            !text.submited
              ? '#'
              : `/app/company-app/performance/report/details/${text.id}`   
          }
          onClick={() => {
            if (!text.submited) {
              this.setState({ showReviewForm: true, reviewId: text.id });
            }
          }}
        >
          <i className="fa fa-eye m-r-5"></i> {text.submited ? 'Report' : 'View'}
        </Link>
      </div>,
      <div key="2">{text.deleteAlloweed && <a className="muiMenu_item" href="#" onClick={() => {
        this.delete(text);
      }}>
        <i className="fa fa-trash-o m-r-5"></i> Delete</a>}</div>,
    ]

    // const menuItems = (text) => {
    //   const items = [];
    //   if (text.submited) {
    //     items.push(
    //       <div key="1"><Link className="muiMenu_item" to={'/app/company-app/performance/report/details/' + text.id} >
    //         <i className="fa fa-eye m-r-5"></i> {text.submited ? 'Report' : 'View'} </Link></div>
    //     );
    //   }
    //   items.push(
    //     <div key="2">{text.deleteAlloweed && <a className="muiMenu_item" href="#" onClick={() => {
    //       this.setState({ showReviewForm: true, reviewId: text.id })
    //     }}>
    //       <i className="fa fa-eye m-r-5"></i> View</a>}</div>
    //   )
    //   items.push(
    //     <div key="3">{text.deleteAlloweed && <a className="muiMenu_item" href="#" onClick={() => {
    //       this.delete(text);
    //     }}>
    //       <i className="fa fa-trash-o m-r-5"></i> Delete</a>}</div>
    //   )
    //   return items;
    // }

    const columns = [
      {
        title: 'Employee',
        sorter: false,
        render: (text, record) => {
          return <EmployeeListColumn id={text.employee.id} name={text.employee.name} employeeId={text.employeeId} ></EmployeeListColumn>
        }
      },
      {
        title: 'Review Period From',
        dataIndex: 'fromDate',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{getReadableDate(text)}</div>
          </>
        }
      },
      {
        title: 'Review Period To',
        dataIndex: 'toDate',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{getReadableDate(text)}</div>
          </>
        }
      },
      {
        title: 'Reporting Manager',
        sorter: false,
        render: (text, record) => {
          return <span>{text.reviewer.name}</span>
        }
      },
      {
        title: 'Status',
        sorter: false,
        dataIndex: 'status',
      },
      {
        title: 'Action',
        width: 50,
        className: "text-center",

        render: (text, record) => (
          <div className="">
            <TableDropdown menuItems={menuItems(text)} />
          </div>
        ),
      },
    ]
    return (
      <div >
        {this.state.showAlert && (
          <SuccessAlert
            headText={this.state.alertMsg}
            img={this.state.imgTag}
          />
        )}
        <Helmet>
          <title>Performance Review  | {getTitle()}</title>
          <meta name="description" content="Branch page" />
        </Helmet>
        {/* Page Content */}
        < div className="p-0 content container-fluid" >
          {/* Page Header */}
          < div id='page-head' >


            <div className="float-right col-md-5 btn-group btn-group-sm">

              <div className="col-3 ">
                <div style={{ justifyContent: 'right' }} className="row">

                  <div className={isAdmin ? 'col-4 btn-group btn-group-sm' : 'col-2 btn-group btn-group-sm'}>
                    {!this.state.self &&
                      <Button className="btn apply-button btn-primary" onClick={() => {
                        this.setState({
                          showForm: true
                        })
                      }}><i className="fa fa-plus" /> Create</Button>}
                    {isAdmin && <div style={{ cursor: 'pointer' }} className='ml-2' onClick={() => this.setState({ showFilter: !this.state.showFilter })} > <BsSliders className='' size={30} /></div>}
                  </div>
                </div>

              </div>
            </div>

            {this.state.showFilter && isAdmin && <div className='mt-5 filterCard p-3'>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group form-focus">
                    <BranchDropdown defaultValue={this.state.branchId} onChange={e => {
                      this.setState({
                        branchId: e.target.value
                      })
                    }}></BranchDropdown>
                    <label className="focus-label">Branch</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group form-focus">
                    <DepartmentDropdown defaultValue={this.state.departmentId} onChange={e => {
                      this.setState({
                        departmentId: e.target.value
                      })
                    }}></DepartmentDropdown>
                    <label className="focus-label">Department</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group form-focus">
                    <JobTitlesDropdown defaultValue={this.state.jobTitleId} onChange={e => {
                      this.setState({
                        jobTitleId: e.target.value
                      })
                    }}></JobTitlesDropdown>
                    <label className="focus-label">Job Titles</label>
                  </div>
                </div>

              </div>
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group form-focus">
                    <input onChange={e => {
                      this.setState({
                        q: e.target.value
                      })
                    }} type="text" className="form-control floating" />
                    <label className="focus-label">Search</label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group form-focus">
                    <input value={this.state.fromDate} onChange={e => {
                      this.setState({
                        fromDate: e.target.value
                      })
                    }} type="date" className="form-control floating" />
                    <label className="focus-label">From Date</label>
                  </div>

                </div>

                <div className="col-md-3">
                  <div className="form-group form-focus">
                    <input value={this.state.toDate} onChange={e => {
                      this.setState({
                        toDate: e.target.value
                      })
                    }} type="date" className="form-control floating" />
                    <label className="focus-label">To Date</label>
                  </div>

                </div>
                <div className="col-md-3">
                  <a href="#" onClick={() => {
                    this.fetchList();
                  }} className="btn btn-success btn-block"> Search </a>
                </div>
              </div>
            </div>}
            < div className='mt-5 Table-card' >
              <div className="tableCard-body">
                <div className="row " >
                  <div className="mt-3 col">
                    <h3 className="page-titleText">Performance Review </h3>
                  </div>
                  {!isAdmin && <div className='mt-2 float-right col-md-auto'>
                    <i onClick={() => this.updateSelf()} className={this.state.self ? 'fa-2x fa fa-toggle-on text-success' : 'fa-2x fa fa-toggle-off text-danger'}></i>
                    <label className="pl-2 text-dark" style={{ color: 'white' }}>{this.state.self ? 'Self' : 'Team Members'}</label>
                  </div>}
                </div>
                {/* /Page Header */}
                <div className="tableCard-container row">
                  <div className="col-md-12">
                    <div className="table-responsive">
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
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>





          {/* /Page Content */}


          <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


            <Header closeButton>
              <h5 className="modal-title">{this.state.performanceTemplate ? 'Edit' : 'Add'} Performance Review</h5>

            </Header>
            <Body>
              <PerformanceReviewForm updateList={this.updateList} self={this.state.self} objectiveGroups={this.state.objectiveGroups} performanceTemplate={this.state.performanceTemplate}>
              </PerformanceReviewForm>
            </Body>


          </Modal>
          <Modal enforceFocus={false} size={"xl"} show={this.state.showReviewForm} onHide={this.hideReviewForm} >


            <Header closeButton>
              <h5 className="modal-title"> Performance Review</h5>

            </Header>
            <Body>
              <PerformanceReviewDetailsForm showAlert={this.showAlert} hideReviewForm={this.hideReviewForm} reviewId={this.state.reviewId}>
              </PerformanceReviewDetailsForm>
            </Body>


          </Modal>
        </div>
      </div>
    );
  }
}
