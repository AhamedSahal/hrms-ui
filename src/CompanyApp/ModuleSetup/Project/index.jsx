import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import ProjectForm from './form';
import { getList, save } from './service';
import EmployeeListColumn from '../../../CompanyApp/Employee/employeeListColumn';
import { verifyOrgLevelViewPermission, verifyOrgLevelEditPermission } from '../../../utility';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const { Header, Body } = Modal;
export default class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeId: props.employeeId,
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
    if (verifyOrgLevelViewPermission("Module Setup Plan")) {
      getList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
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
  updateList = (project) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == project.id);
    if (index > -1)
      data[index] = project;
    else {
      data = [project, ...data];
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
      project: undefined
    })
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
        title: 'Code',
        dataIndex: 'code',
        sorter: true,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: 'Assigned to',
        render: (text, record) => {
          return <EmployeeListColumn id={text.employee?.id} name={text.employee?.name} employeeId={text.employeeId}></EmployeeListColumn>
        },
        sorter: false,
      },
      {
        title: 'Status',
        width: 50,
        render: (text, record) => {
          return <span className={text.active ? "badge bg-inverse-success " : "badge bg-inverse-danger"}>
            {text.active ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
              text.active ? 'Active' : 'In Active'
            }</span>
        }
      },
      {
        title: 'Action',
        width: 50,
        className: "text-center",
        render: (text, record) => (
          <div className="dropdow">
            {verifyOrgLevelEditPermission("Module Setup Plan") && <><a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="las la-bars"></i>
            </a>
              <div className="dropdown-menu dropdown-menu-right">
                <a className="dropdown-item" href="#" onClick={() => {
                  this.setState({ project: text, showForm: true })
                }} >
                  <i className="fa fa-pencil m-r-5"></i> Edit</a>

              </div></>}
          </div>
        ),
      },
    ]
    return (

      <div className="page-container content container-fluid">
        {/* Page Header */}
        <div className="tablePage-header">
          <div className="row pageTitle-section">
            <div className="col">
              <h3 className="tablePage-title">Projects</h3>
            </div>

            <div className="mt-2 float-right col-auto ml-auto">
              {verifyOrgLevelEditPermission("Module Setup Plan") && <a href="#" className="btn apply-button btn-primary" onClick={() => {
                this.setState({
                  showForm: true
                })
              }}><i className="fa fa-plus" /> Add</a>}
            </div>

          </div>
        </div>

        {/* /Page Header */}
        <div className="row">
          <div className="col-md-12">
            <div className="mt-3 mb-3 table-responsive">
              {verifyOrgLevelViewPermission("Module Setup Plan") && <Table id='Table-style' className="table-striped "
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
              {!verifyOrgLevelViewPermission("Module Setup Plan") && <AccessDenied></AccessDenied>}
            </div>
          </div>
        </div>




        {/* Page Content */}

        {/* /Page Content */}
        < Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
          <Header closeButton>
            <h5 className="modal-title">{this.state.project ? 'Edit' : 'Add'} Project</h5>
          </Header>
          <Body>
            <ProjectForm updateList={this.updateList} project={this.state.project}>
            </ProjectForm>
          </Body>
        </Modal >
      </div>

    );
  }
}
