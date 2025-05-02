import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { itemRender } from "../../../paginationfunction";
import { getTitle, getUserType } from '../../../utility';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
import GratuityEntitlementForm from './form';
import { getEntitlementGratuityList } from './service';
const { Header, Body, Footer, Dialog } = Modal;
const isCompanyAdmin = getUserType() === 'COMPANY_ADMIN';
export default class Gratuity extends Component {
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
      currentPage: 1,
      defaultEmployeeId: 0,
    };
  }
  componentDidMount() {
    let isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
    if (!isCompanyAdmin) { this.fetchList(); }
  }
  fetchList = () => {

    getEntitlementGratuityList(this.state.defaultEmployeeId, this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
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

  getListByEmployee = (employeeId) => {
    this.setState({
      defaultEmployeeId:employeeId
    });
    employeeId && getEntitlementGratuityList(employeeId, this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

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
  updateList = (gratuity) => {
    try {
      let { data } = this.state;
      let index = data.findIndex(d => d.id == gratuity.id);
      if (index > -1)
        data[index] = gratuity;
      else {
        data = [gratuity, ...data];
      }
      this.setState({ data },
        () => {
          this.hideForm();
        });
    } catch (error) {
      console.log(error);
    } finally {
      this.hideForm();
    }
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
      gratuity: null
    })
  }
  render() {
    let isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const columns = [
      {
        title: 'Employee',
        render: (text, record) => {
          return <EmployeeListColumn id={text.employee.id} name={text.employee.name} employeeId={text.employeeId} ></EmployeeListColumn>
        },
        sorter: false,
      },
      {
        title: 'For Month',       
        sorter: true,
        render: (text, record) => {
          return <span>{record.forMonth?.substring(0,7)}</span>
        }
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        sorter: true,
      },
      {
        title: 'Remark',
        dataIndex: 'remark',
        sorter: true,
      },
    ]
    return (
      <div className="page-wrapper">
        <Helmet>
          <title>Gratuity  | {getTitle()}</title>
          <meta name="description" content="Gratuity page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Gratuity</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item active">Gratuity</li>
                </ul>
              </div>
              
              {isCompanyAdmin && <div className="float-right col">
              <div className="row">
                <div className="col-9">
                  <label>Employee
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <EmployeeDropdown nodefault={false} onChange={e => {
                    this.getListByEmployee(e.target.value)
                  }}></EmployeeDropdown>
                </div>
                  <div className="col-3 mt-4">
                    <a href="#" className="btn add-btn mt-2" onClick={() => {
                      this.setState({
                        showForm: true
                      })
                    }}><i className="fa fa-plus" /> Add</a>
                  </div>
              </div>
              </div>}

            </div>
            
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
              { (isCompanyAdmin && this.state.defaultEmployeeId==0) && <>
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    <span>Please select Employee.</span>                    
             </div>
          </>}
          { (this.state.defaultEmployeeId!=0 || !isCompanyAdmin) && <>
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
              </>}
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}

        <Modal enforceFocus={false} size={"md"} show={this.state.showForm && isCompanyAdmin} onHide={this.hideForm} >


          <Header closeButton>
            <h5 className="modal-title">{this.state.leave ? 'Edit' : 'Add'} Gratuity</h5>
          </Header>
          <Body>
            <GratuityEntitlementForm updateList={this.updateList} gratuity={this.state.gratuity} employeeId={this.state.employeeId}>
            </GratuityEntitlementForm>
          </Body>


        </Modal>

      </div>
    );
  }
}
