import { Table } from 'antd';
import React, { Component } from 'react';
import { Button, Modal, Anchor } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CONSTANT } from '../../constant';
import { itemRender } from '../../paginationfunction';
import { getTitle, getUserType } from '../../utility';
import BranchDropdown from '../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../ModuleSetup/Dropdown/DepartmentDropdown';
import DesignationDropdown from '../ModuleSetup/Dropdown/DesignationDropdown';
import DivisionDropdown from '../ModuleSetup/Dropdown/DivisionDropdown';
import ChangeProfilePicture from './changeProfilePicture';
import ChangeUsernameForm from './changeUsernameForm';
import EmployeeListColumn from './employeeListColumn';
import EmployeeRoleForm from './employeeRoleForm';
import ResetPasswordForm from './resetPasswordForm';
import { deleteEmployee, getEmployeeList } from './service';
import { BsSliders } from 'react-icons/bs';
import TableDropDown from '../../MainPage/tableDropDown';
import EntityDropdown from '../ModuleSetup/Dropdown/EntityDropdown';
import { getOrgSettings } from '../ModuleSetup/OrgSetup/service';
const { Header, Body, Footer, Dialog } = Modal;
export default class EmployeeList extends Component {


  
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
      status: "ACTIVE",
      showFilter: false,
      entityId:"",
      orgsetup: false
    };
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    getEmployeeList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.status, this.state.branchId, this.state.departmentId, this.state.designationId, this.state.divisionId, this.state.entityId).then(res => {

      if (res.status == "OK") {
        this.setState({
          data: res.data.list,
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage + 1
        })
      }
    })

     // entity is present validation
     getOrgSettings().then(res => {
      if (res.status == "OK") {
        this.setState({ orgsetup: res.data.entity })
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
  delete = (employee) => {
    confirmAlert({
      title: `Delete Employee ${employee.name}`,
      message: 'Are you sure, you want to delete this employee?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteEmployee(employee.id).then(res => {
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
  hidePasswordForm = () => {
    this.setState({
      showPasswordForm: false,
      employee: undefined
    })
  }
  hideProfilePictureForm = () => {
    this.setState({
      showProfilePictureForm: false,
      employee: undefined
    })
  }

  hideAssignRoleForm = () => {
    this.setState({
      showAssignRoleForm: false,
      employee: undefined
    })
  }
  updateProfilePicture = (employeeId, profilePicture) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == employeeId);
    if (index > -1)
      data[index].profilePicture = profilePicture;

    this.setState({
      data,
      showProfilePictureForm: false,
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
        <i className="fa fa-pencil m-r-5"></i> Edit</Link></div>,
      <div key="2">  <a className="muiMenu_item" href="#" onClick={() => {
        this.setState({ employee: text, showForm: true })
      }}  ><i className="fa fa-user m-r-5" /> Change Username</a></div>,
      <div key="3"><a className="muiMenu_item" href="#" onClick={() => {
        this.setState({ employee: text, showPasswordForm: true })
      }}  ><i className="fa fa-lock m-r-5" /> Reset Password</a></div>,
      <div key="4"><a className="muiMenu_item" href="#" onClick={() => {
        this.setState({ employee: text, showProfilePictureForm: true })
      }}  ><i className="fa fa-image m-r-5" /> Change Profile Picture</a></div>,
      <div key="5"> <a className="muiMenu_item" href="#" onClick={() => {
        this.setState({ employee: text, showAssignRoleForm: true })
      }}  ><i className="fa fa-user m-r-5" /> Assign Role</a></div>,
      <div key="6"><a className="muiMenu_item" href="#" onClick={() => {
        this.delete(text);
      }}>
        <i className="fa fa-ban m-r-5"></i> Inactive</a></div>,
    ]
    let columns = []
    // 
    if(this.state.orgsetup){
       columns = [
        {
          title: 'Employee',
          sorter: false,
          render: (text) => {
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
          title: 'Entity',
          sorter: true,
          render: (text, record) => {
            return <>
              <div>{record.entity?.name ? record.entity?.name : "-"}</div>
            </>
          }     
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

    }else{

      // colums 2 without entity
       columns = [
        {
          title: 'Employee',
          sorter: false,
          render: (text) => {
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

    }
    
    return (

      <div className="">
        <Helmet>
          <title>Employee | {getTitle()}</title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        < div className="empolyeePageDiv content container-fluid" >
          {/* Page Header */}
          < div id='page-head' >

            <div className="mt-1 float-right col-auto ml-auto btn-group btn-group-sm cust-button-group-mr-35">
              <button type="button" className="btn apply-button btn-primary dropdown-toggle mr-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fa fa-plus" /> Add</button>
              <div className="dropdown-menu">
                <Link to="/app/company-app/employee/create" className="dropdown-item" ><i className="fa fa-plus" /> Add Employee</Link>
              </div>
              <BsSliders className='ml-2 filter-btn' size={25} onClick={() => this.setState({ showFilter: !this.state.showFilter })} />
            </div>


            {this.state.showFilter && <div className='mt-5 filterCard p-3'>
              {isCompanyAdmin && <div className="row">

              {this.state.orgsetup &&  <div className="col-md-3">
                  <div className="form-group form-focus">
                    <EntityDropdown
                    defaultValue={this.state.entityId} onChange={e => {
                      this.setState({
                        entityId: e.target.value
                      })
                    }}></EntityDropdown>
                    <label className="focus-label">Entity</label>
                  </div>
                </div>}

                <div className="col-md-3">
                  <div className="form-group form-focus">
                    <DivisionDropdown defaultValue={this.state.divisionId} onChange={e => {
                      this.setState({
                        divisionId: e.target.value
                      })
                    }}></DivisionDropdown>
                    <label className="focus-label">Division</label>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group form-focus">
                    <DepartmentDropdown defaultValue={this.state.departmentId} onChange={e => {
                      this.setState({
                        departmentId: e.target.value
                      })
                    }}></DepartmentDropdown>
                    <label className="focus-label">Department</label>
                  </div>
                </div>
                <div className="col-md-3">
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
                <div className="col-md-3">
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
                <div className="col-md-3 ">
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
                <div className="col-md-3">
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
                    <h3 className="page-titleText">Employee</h3>
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
                            showTotal: () => {
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
                                    }}  ><i className="fa fa-pencil m-r-5" /> Change Username</a>
                                    <a className="dropdown-item" href="#" onClick={() => {
                                      this.setState({ employee: e, showPasswordForm: true })
                                    }}  ><i className="fa fa-pencil m-r-5" /> Reset Password</a>
                                    <a className="dropdown-item" href="#" onClick={() => {
                                      this.setState({ employee: e, showProfilePictureForm: true })
                                    }}  ><i className="fa fa-pencil m-r-5" /> Change Profile Picture</a>
                                    <a className="dropdown-item" href="#" onClick={() => {
                                      this.delete(e);
                                    }}>
                                      <i className="fa fa-trash-o m-r-5"></i> Delete</a>
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
              </div>
            </div>
          </div>


          {/* /Page Content */}

          <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


            <Header closeButton>
              <h5 className="modal-title">Update Username</h5>

            </Header>
            <Body>
              <ChangeUsernameForm updateList={this.updateList} employee={this.state.employee}>
              </ChangeUsernameForm>
            </Body>
          </Modal>

          <Modal enforceFocus={false} size={"md"} show={this.state.showPasswordForm} onHide={this.hidePasswordForm} >


            <Header closeButton>
              <h5 className="modal-title">Reset Password</h5>

            </Header>
            <Body>
              <ResetPasswordForm updateList={this.hidePasswordForm} employee={this.state.employee}>
              </ResetPasswordForm>
            </Body>
          </Modal>


          <Modal enforceFocus={false} size={"md"} show={this.state.showProfilePictureForm} onHide={this.hideProfilePictureForm} >


            <Header closeButton>
              <h5 className="modal-title">Change Profile Picture</h5>

            </Header>
            <Body>
              <ChangeProfilePicture updateList={this.updateProfilePicture} employee={this.state.employee}>
              </ChangeProfilePicture>
            </Body>
          </Modal>

          <Modal enforceFocus={false} size={"md"} show={this.state.showAssignRoleForm} onHide={this.hideAssignRoleForm} >


            <Header closeButton>
              <h5 className="modal-title">Assign Role</h5>

            </Header>
            <Body>
              <EmployeeRoleForm updateList={this.hideAssignRoleForm} employee={this.state.employee}>
              </EmployeeRoleForm>
            </Body>
          </Modal>

        </div>
      </div>
    );
  }
}
