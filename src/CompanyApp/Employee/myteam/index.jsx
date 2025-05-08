import { Table } from 'antd';
import React, { Component } from 'react';
import { Button, Modal, Anchor } from 'react-bootstrap';
import {CONSTANT} from '../../../constant';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { itemRender } from '../../../MainPage/paginationfunction';
import { getTitle, getUserType, verifyOrgLevelViewPermission, verifyViewPermission } from '../../../utility';
import EmployeeListColumn from '../employeeListColumn';
import { getTeamListOfEmployees } from '../service';
import TableDropDown from '../../../MainPage/tableDropDown';
import { BsSliders } from 'react-icons/bs';
import DepartmentDropdown from '../../ModuleSetup/Dropdown/DepartmentDropdown';
import DivisionDropdown from '../../ModuleSetup/Dropdown/DivisionDropdown';
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const { Header, Body, Footer, Dialog } = Modal;
export default class TeamEmployeeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      q: "",
      branchId: "",
      departmentId: "",
      designationId: "",
      divisionId: "",
      functionId: "",
      sectionId: "",
      gradesId: "",
      jobTitlesId: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      gridView: false,
      gridView: false,
      status: "ACTIVE",
      showFilter: false,
    };
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => 
   {
    getTeamListOfEmployees(this.state.q, this.state.page, this.state.size, this.state.sort,this.state.status, this.state.branchId, this.state.departmentId, this.state.designationId, this.state.divisionId).then(res => {

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

  onTableDataChange = (d,sorter) => {
    this.setState({
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
    }, () => {
      this.fetchList();
    })
  }
  updateList = (employee) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == employee.id);
    if (index > -1)
      data[index] = employee;
    else {
      data = [employee, ...data];
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
      employee: undefined
    })
  }
  hideForm = () => {
    this.setState({
      showForm: false,
      employee: undefined
    })
}
  render() {
    const isCompanyAdmin = getUserType() == "COMPANY_ADMIN";
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size)) ;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const menuItems = (text) => [
        <div key="1"><Link className="muiMenu_item" to={`/app/company-app/employee/detail/${text.id}`}>
        <i className="fa fa-pencil m-r-5"></i> Edit</Link></div>
    ]
    const columns = [
      {
        title: 'Employee',
        sorter: false,
        render: (text, record) => {
          return <EmployeeListColumn id={text.id} name={text.name} employeeId={text.employeeId}></EmployeeListColumn>
        }
      },
      {
        title: 'Email',
        dataIndex: 'email',
        sorter: true,
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        sorter: true,
      },
      {
        title: 'Division',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{record.division?.name ? record.division?.name : "-"}</div>
          </>
        }
      },

      {
        title: 'Department',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{record.department?.name}</div>
          </>
        }
      },
      {
        title: 'Section',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{record.section?.name ? record.section?.name : "-"}</div>
          </>
        }
      },
      {
        title: 'Function',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{record.function?.name ? record.function?.name : "-"}</div>
          </>
        }
      },
      {
        title: 'Grades',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{record.grades?.name ? record.grades?.name : "-"}</div>
          </>
        }
      },

      {
        title: 'Location',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{record.branch?.name}</div>
          </>
        }
      },
      {
        title: 'Role',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{record.role?.name}</div>
          </>
        }
      },
      {
        title: 'Action',
        width: 50,
        render: (text, record) => (
          <div className="">
            <TableDropDown menuItems={menuItems(text, record)} />
          </div>
        ),
      },
     
    ]
    return (

      <div className="">
        <Helmet>
          <title>Employee | {getTitle()}</title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        {(verifyViewPermission("Peoples My Team") || verifyOrgLevelViewPermission("Peoples My Team")) && < div className="empolyeePageDiv content container-fluid" >
          {/* Page Header */}
          < div id='page-head' >
          <div className="mt-1 float-right col-auto ml-auto btn-group btn-group-sm cust-button-group-mr-35">
              <BsSliders className='ml-2 filter-btn' size={25} onClick={() => this.setState({ showFilter: !this.state.showFilter })} />
            </div>
          {this.state.showFilter && <div className='mt-5 filterCard p-3'>
              {isCompanyAdmin && <div className="row">

                <div className="col-md-4">
                  <div className="form-group form-focus">
                    <DivisionDropdown defaultValue={this.state.divisionId} onChange={e => {
                      this.setState({
                        divisionId: e.target.value
                      })
                    }}></DivisionDropdown>
                    <label className="focus-label">Division</label>
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
                    <BranchDropdown defaultValue={this.state.branchId} onChange={e => {
                      this.setState({
                        branchId: e.target.value
                      })
                    }}></BranchDropdown>
                    <label className="focus-label">Location</label>
                  </div>
                </div>
              </div>}
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group form-focus">
                    <input onChange={e => {
                      this.setState({
                        q: e.target.value,
                        page:0
                      })
                    }} type="text" className="form-control floating" />
                    <label className="focus-label">Search</label>
                  </div>
                </div>
                <div className="col-md-4 ">
                  <div className="form-group form-focus">
                    <select className="form-control"
                      onChange={e => {
                        this.setState({
                          status: e.target.value
                        })
                      }}>
                      <option value="ACTIVE">Active</option>
                      <option value="">All</option>
                      <option value="RESIGNED">Resigned</option>
                      <option value="TERMINATED">Terminated</option>
                      <option value="INACTIVE">Inactive</option>

                    </select>
                    <label className="focus-label">Status</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <a href="#" onClick={() => {
                    this.fetchList();
                  }} className="btn btn-success btn-block"> Search </a>
                </div>
              </div>
            </div>}


           < div className='mt-5 approvalTable-card' >
              <div className="tableCard-body">
                <div className="row " >
                  <div className="mt-3 col">
                    <h3 className="page-titleText">My Team</h3>
                  </div>

                  <div className='mt-2 col-md-auto'  >

                    <div className="view-icons">
                      <a href="#" onClick={() => {
                        this.setState({
                          gridView: true
                        })

                      }} className={`btn btn-link list-view ${this.state.gridView ? '' : 'active'}`}><i className="fa fa-th"></i></a>

                      <a href="#" onClick={() => {
                        this.setState({
                          gridView: false
                        })
                      }} className={`btn btn-link grid-view ${this.state.gridView ? ' active' : ''}`}><i className="fa fa-bars"></i></a>
                    </div>
                  </div>
                </div>


                {/* /Page Header */}
                <div className="tableCard-container row">
                  <div className="col-md-12">
                    {!this.state.gridView ?
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
                        />  </div> : <>
                        <div className="row staff-grid-row">
                          {data && data.map((e) => {
                            return <div className="col-md-4 col-sm-6 col-12 col-lg-4 col-xl-4">
                              <div className="profile-widget">
                              <div className="profile-img">
                                  <Link to={`/app/company-app/employee/detail/${e.id}`} className="avatar"><img src={e.profilePicture ? `data:image/jpeg;base64,${e.profilePicture}` : CONSTANT.userImage} alt="" /></Link>
                                </div>
                                <div className="dropdown profile-action">
                                  <a href="#" className="action-icon dropdown-toggle"
                                    data-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <Link className="dropdown-item" to={`/app/company-app/employee/detail/${e.id}`}>
                                      <i className="fa fa-pencil m-r-5"></i> Edit</Link>
                                      <a className="dropdown-item" href="#" onClick={() => {
                                      this.setState({ employee: e, showForm: true })
                                    }}  ></a>
                                  </div>
                                </div>
                                <h4 className="user-name m-t-10 mb-0 text-ellipsis"><Link to={`/app/company-app/employee/detail/${e.id}`}>{e.name}</Link></h4>
                                <h5 style={{ color: "grey" }}>{e.employeeId}</h5>
                                <h6 style={{ color: "black" }}>{e.email}</h6>
                                <div className="small text-muted">{e.branch?.name ? e.branch?.name : "-"}</div>
                              </div>
                            </div>
                          })}


                        </div>
                        <ul className="ant-pagination ant-table-pagination ant-table-pagination-right">
                          <li className="ant-pagination-total-text">{`Showing ${startRange} to ${endRange} of ${totalRecords} entries`}</li>
                          <li className={`ant-pagination-prev ${currentPage == 1 ? 'ant-pagination-disabled' : ''}`}>
                            <a href="#" disabled={currentPage == 1} onClick={() => {
                              if (currentPage > 1) {
                                this.setState({
                                  page: currentPage - 2
                                }, () => {
                                  this.fetchList();
                                })
                              }
                            }} tabIndex={-1}>Previous</a>
                          </li>
                          {Array.from(Array(totalPages).keys()).map((e, i) => {
                            return <>
                              <li className={`ant-pagination-item ant-pagination-item-${i + 1} ${currentPage - 1 == i ? 'ant-pagination-item-active' : ''}`}>
                                <Anchor href="#" onClick={() => {
                                  this.setState({
                                    page: i
                                  }, () => {
                                    this.fetchList();
                                  })
                                }
                                }>{i + 1}</Anchor>
                              </li>

                            </>
                          })}
                          <li className={`ant-pagination-next ${currentPage == totalPages ? 'ant-pagination-disabled' : ''}`}>
                            <a href="#" disabled={currentPage == totalPages} onClick={() => {
                              if (currentPage != totalPages) {
                                this.setState({
                                  page: currentPage
                                }, () => {
                                  this.fetchList();
                                })
                              }

                            }}>Next</a>
                          </li>
                        </ul>
                      </>}
                  </div>
                </div>
                <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} ></Modal>
              </div>
            </div>
            </div>
            </div>}
        {!verifyViewPermission("Peoples My Team") && !verifyOrgLevelViewPermission("Peoples My Team") && <AccessDenied></AccessDenied>}
      </div>
    );
  }
}
