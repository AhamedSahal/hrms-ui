import React, { Component } from 'react';
import { Button, Modal, Anchor } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import {  verifyOrgLevelEditPermission, verifyOrgLevelViewPermission,getmenu } from '../../../utility';
import Roleform from './form';
import { getActionList, getRoleList, updateRoleActions } from './service';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const { Header, Body, Footer, Dialog } = Modal;

export default class Role extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      q: "",
      page: 0,
      size: 100,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      roleActionEntities: [],
      actions: [],
      submenu: false,
      menuValidation: false,
      companyMenu: getmenu() || [],
      companyMenuList: []
    };
  }
  componentDidMount() {
    let menuData = [];
    // get menu
    if(this.state.companyMenu?.length > 0){
      this.state.companyMenu.map((res) => {
        menuData.push(res.name)
      })

    }
   
    this.setState({companyMenuList: menuData})

    if (verifyOrgLevelViewPermission("Settings Access")) {
      getActionList().then(res => {
        this.setState({ actions: res.data.content })
      })
    }
    this.fetchList();

  }

  fetchList = () => {
    if (verifyOrgLevelViewPermission("Settings Access")) {
    getRoleList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
      if (res.status == "OK") {
        let roles = res.data.list;
        let selectedRole = roles[0];
        if (this.state.role) {
          selectedRole = roles.find(r => r.id == this.state.role.id);
        }

        this.setState({
          data: roles,
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage + 1,
          role: selectedRole,
          roleActionEntities: selectedRole.roleActionEntities
        })
      }
    })
  }
  }
  onTableDataChange = (d, filter, sorter) => {
    this.setState({
      page: d.current - 1,
      size: d.pageSize,
      sort: (sorter && sorter.field) ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
    }, () => {
      this.fetchList();
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
  updateList = (role) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == role.id);
    if (index > -1)
      data[index] = role;
    else {
      data = [role, ...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
        this.fetchList();
      });
  }
  
  hideForm = () => {
    this.setState({
      showForm: false,
      role: undefined
    })
  }

  toggleAccess = (roleId, actionId, isActionAllowed) => {

    updateRoleActions({ roleId, actionId }, isActionAllowed).then(res => {
      toast.success(res.message);
      this.fetchList();
    })
  }
  getCheckbox = (roleAction) => {
    const { roleActionEntities, role } = this.state;
    const isActionAllowed = roleActionEntities.findIndex(r => r.actionId == roleAction.id) > -1;
    return <Button variant="link" size='sm' onClick={() => {
      this.toggleAccess(role.id, roleAction.id, isActionAllowed);
    }} >
      <i className={`fa fa-2x fa-${isActionAllowed ? 'toggle-on text-success' : 'toggle-off text-danger'}`}></i>

    </Button>
  }
  render() {
    const { data, totalRecords, currentPage, size, actions,submenu,menuValidation } = this.state
    
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    let groupedAllActions = actions.filter(a => a.permissionGroup != "asdfgh").reduce(function (r, a) {
      r[a.module] = r[a.module] || [];
      r[a.module].push(a);
      return r;
    }, Object.create(null));

    const roles = data.map((role) =>
      <li className={this.state.role?.id == role.id ? "active" : ""}>
        <Anchor onClick={() => {
          this.setState({
            roleActionEntities: role.roleActionEntities,
            role: role
          })

        }}>{role.name}
          <span className="role-action">
            <span className="action-circle large" onClick={() => {
              this.setState({ role: role, showForm: true })
            }} >
              <i className="material-icons">edit</i>
            </span>
          </span>
        </Anchor>
      </li>

    );

    return (
      <>
        <div className="insidePageDiv">
         
          {/* Page Content */}
          <div className="mt-4 pb-3 pr-4 page-containerDocList content container-fluid">
            <div className="tablePage-header">
              <div className="row pageTitle-section">
                <div className="col-sm-12">
                  <h3 className="tablePage-title">Roles &amp; Permissions</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                    <li className="breadcrumb-item active">Role</li>
                  </ul>
                </div>
              </div>
            </div>
            {verifyOrgLevelViewPermission("Settings Access") && <>
            {/* /Page Header */}
            <div className="rounded row page-wrapper ant-table-background">
              <div className="col-sm-4 col-md-4 col-lg-4 col-xl-3">
              {verifyOrgLevelEditPermission("Settings Access") && 
                <a href="#" className="btn btn-primary btn-block" onClick={() => {
                  this.setState({
                    showForm: true
                  })

                }}><i className="fa fa-plus" /> Add Role</a>}
                <div className="roles-menu">
                  <ul>
                    {roles}
                  </ul>
                </div>
              </div>
              <div className="col-sm-8 col-md-8 col-lg-8 col-xl-9">
                <h6 className="card-title m-b-20">Module Access</h6>
                <div className="m-b-30">
                  <ul className="list-group notification-list">
                    {/* ROLE_TYPE li with NAME and code as value and checkbox for enable and disable*/}

                      {/* main menu */}

                      <div className='profileFormHead' style={{ width: "100%" }}>
                        <div className='profileFormHeadContent'>
                          <h3 className='dvlp-left-align'>Menu</h3>
                          <div className='dvlp-right-align'>

                            <i onClick={() => this.setState({ menuValidation: !this.state.menuValidation })}
                              className={`dvlpCardIcon ml-2 fa fa-xl ${menuValidation ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                              aria-hidden='true'
                            ></i>
                          </div>
                        </div>

                        {menuValidation &&
                          <>

                            <div className="mt-3 mb-0 card">
                              <div className="card-body">

                                <div className='dvlp-profile-card border-0 container'>
                                  <div class="row justify-content-start">
                                    {/* existing code */}
                                    <table id='Table-style' style={{ margin: "10px" }}>
                                      <thead>
                                        <tr>
                                          <th rowSpan={2}>Module</th>
                                          <th colSpan={3}>Is-Engaged</th>
                                        </tr>

                                      </thead>
                                      <tbody>
                                        {Object.keys(groupedAllActions).map((a) => {
                                          const moduleName = a;

                                          const viewOrganizationActionIndex = groupedAllActions[a].findIndex(a => a.action == "VIEW" && a.permissionLevel == "ORGANIZATION");


                                          return <>{groupedAllActions[a][0].isMainMenu == 1 && this.state.companyMenuList.includes(moduleName) && <tr>
                                            <td style={{ textAlign: "left" }}><label className='pt-1'>{moduleName === 'Employee' ? 'People' : moduleName}</label></td>
                                            <td>{viewOrganizationActionIndex > -1 && this.getCheckbox(groupedAllActions[a][viewOrganizationActionIndex])}</td>
                                          </tr>}</>
                                        })}
                                      </tbody>
                                    </table>


                                    {/* existing code */}


                                  </div>
                                </div>
                              </div>
                            </div>
                          </>}
                      </div>
                      {/* main menu */}

                      {/* sub menu */}
                      <div className='profileFormHead' style={{ width: "100%" }}>
                        <div className='profileFormHeadContent'>
                          <h3 className='dvlp-left-align'>Sub-Menu</h3>
                          <div className='dvlp-right-align'>

                            <i onClick={() => this.setState({ submenu: !this.state.submenu })}
                              className={`dvlpCardIcon ml-2 fa fa-xl ${submenu ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                              aria-hidden='true'
                            ></i>
                          </div>
                        </div>

                        {submenu &&
                          <>

                            <div className="mt-3 mb-0 card">
                              <div className="card-body">

                                <div className='dvlp-profile-card border-0 container'>
                                  <div class="row justify-content-start">
                                    {/* existing code */}
                   <table id='Table-style' style={{margin: "10px"}}>
                      <thead>
                        <tr>
                          <th rowSpan={2}>Module</th>
                          <th colSpan={3}>View Permission</th>
                          <th colSpan={3}>Edit Permission</th>
                        </tr>
                        <tr>
                          <th>Self</th>
                          <th>Hierarchy</th>
                          <th>Organization</th>
                          <th>Self</th>
                          <th>Hierarchy</th>
                          <th>Organization</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(groupedAllActions).map((a) => {
                          const moduleName = a;
                          const viewSelfActionIndex = groupedAllActions[a].findIndex(a => a.action == "VIEW" && a.permissionLevel == "SELF");
                          const viewHierarchyActionIndex = groupedAllActions[a].findIndex(a => a.action == "VIEW" && a.permissionLevel == "HIERARCHY");
                          const viewOrganizationActionIndex = groupedAllActions[a].findIndex(a => a.action == "VIEW" && a.permissionLevel == "ORGANIZATION");

                          const editSelfActionIndex = groupedAllActions[a].findIndex(a => a.action == "EDIT" && a.permissionLevel == "SELF");
                          const editHierarchyActionIndex = groupedAllActions[a].findIndex(a => a.action == "EDIT" && a.permissionLevel == "HIERARCHY");
                          const editOrganizationActionIndex = groupedAllActions[a].findIndex(a => a.action == "EDIT" && a.permissionLevel == "ORGANIZATION");
                          
                          return <>{groupedAllActions[a][0].isMainMenu == 0 && <tr>
                            <td style={{ textAlign: "left" }}><label className='pt-1'>{moduleName === 'Employee'? 'People': moduleName}</label></td>
                            <td>{viewSelfActionIndex > -1 && this.getCheckbox(groupedAllActions[a][viewSelfActionIndex])}</td>
                            <td>{viewHierarchyActionIndex > -1 && this.getCheckbox(groupedAllActions[a][viewHierarchyActionIndex])}</td>
                            <td>{viewOrganizationActionIndex > -1 && this.getCheckbox(groupedAllActions[a][viewOrganizationActionIndex])}</td>

                            <td>{editSelfActionIndex > -1 && this.getCheckbox(groupedAllActions[a][editSelfActionIndex])}</td>
                            <td>{editHierarchyActionIndex > -1 && this.getCheckbox(groupedAllActions[a][editHierarchyActionIndex])}</td>
                            <td>{editOrganizationActionIndex > -1 && this.getCheckbox(groupedAllActions[a][editOrganizationActionIndex])}</td>
                          </tr>}</>
                        })}
                      </tbody>
                    </table>
                                                          

                                                          {/* existing code */}

                                                           
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                </>}
                        </div>
                        {/* sub menu */}

                   
                  </ul>
                </div>
              </div>
            </div>
          </>}
          {!verifyOrgLevelViewPermission("Settings Access") && <AccessDenied></AccessDenied>}
          </div>
        </div>
        <div>
          <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
            <Header closeButton>
              <h5 className="modal-title">{this.state.role ? 'Edit' : 'Add'} Role</h5>
            </Header>
            <Body>
              <Roleform updateList={this.updateList} role={this.state.role}>
              </Roleform>
            </Body>
          </Modal>
        </div>
      </>
    );
  }
}
