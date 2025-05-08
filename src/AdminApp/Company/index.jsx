import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import CompanyForm from './form';
import { deleteCompany, getCompanyList } from './service';
import CompanySettingForm from './companySettingForm';
import { Link } from 'react-router-dom';
import ManageSSOForm from './manageSSO';

const { Header, Body, Footer, Dialog } = Modal;
export default class Company extends Component {
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
    this.hideForm();
    getCompanyList().then(res => {

      if (res.status == "OK") {
        this.setState({
          data: res.data,
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
  handleFormSave = () => {
};
getCompanyDetails =(company) => {
}
  updateList = (company) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == company.id);
    if (index > -1)
      data[index] = company;
    else {
      data=[company,...data];
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
      showSettingForm : false,
      showSSOKeyForm : false,
      company: undefined,     
    })
  } 
  delete = (company) => {
    confirmAlert({
      title: `Delete Company ${company.name}`,
      message: 'Are you sure, you want to delete this company?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteCompany(company.id).then(res => {
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
        title: 'Company',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: 'Contact Name',
        dataIndex: 'contactName',
        sorter: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        sorter: true,
      },

      {
        title: 'Active',
        render: (text, record) => {
          return text.active ? <i className="fa fa-check text-success"></i> : <i className="fa fa-remove text-danger"></i>
        }
      },
      {
        title: 'Action',
        render: (text, record) => (
          <div className="btn-group btn-group-sm">
            <a className="btn btn-info" href="#" onClick={() => {
              this.setState({ company: text, showForm: true })
            }}  ><i className="fa fa-pencil m-r-5" /> Edit</a>
            <a className="btn btn-danger" href="#"
              onClick={() => {
                this.delete(text);
              }}
            ><i className="fa fa-trash-o m-r-5" />
              Delete</a>
          </div>
        ),
      },
    ]
    return (
      <div className="adminInsidePageDiv">
      
      < div className = "page-container content container-fluid" >
        <Helmet>
          <title>Company Management - WorkPlus</title>
        </Helmet>
        {/* Page Content */}
        < div className = "tablePage-header" >
          <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Company</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active">Company</li>
                </ul>
              </div>
              <div className="float-right col-auto ml-auto">
                <Link to="/app/admin-app/company-add" className="dropdown-item" onClick={() => {
                }} style={{ textDecoration: 'none', color: 'inherit', backgroundColor: 'initial', }}>
                  <a href="#" className="mt-2 btn apply-button btn-primary">
                    <i className="fa fa-plus" /> Add Company</a>
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row staff-grid-row">

            {this.state.data && this.state.data.length > 0 && this.state.data.map((d, i) => {
              return <>
                <div className="col-md-4 col-sm-6 col-12 col-lg-4 col-xl-4">
                  <div className="profile-widget">
                    <div className="profile-img">
                      <Link
                        to="/app/admin-app/company-details"
                        state={{ company: d }}
                        className="dropdown-item" onClick={() => {
                          let company = d;
                          d.companyId = d.id;
                          this.setState({ company });
                        }} style={{ textDecoration: 'none', color: 'inherit', backgroundColor: 'initial', }}>
                        <a href="#" className="avatar">
                          <img src={d.companyLogo} alt={d.name} />
                        </a>
                      </Link>

                    </div>

                    <h4 className="mb-0 user-name m-t-10 text-ellipsis" style={{ textAlign: 'center' }}>
                      <Link to="/app/admin-app/company-details"
                        state={{ company: d }} className="dropdown-item" onClick={() => {
                          let company = d;
                          d.companyId = d.id;
                          this.setState({ company });
                        }} style={{ textDecoration: 'none', color: 'inherit', backgroundColor: 'initial', }}>
                        {d.name}
                      </Link>
                    </h4>
                    <h5 style={{ textAlign: 'center' }}>
                      <Link to="/app/admin-app/company-details"
                        state={{ company: d }} className="dropdown-item" onClick={() => {
                          let company = d;
                          d.companyId = d.id;
                          this.setState({ company });
                        }} style={{ textDecoration: 'none', color: 'inherit', backgroundColor: 'initial', }}>{d.contactName}
                      </Link>
                    </h5>
                    <div className="small text-muted">{d.email}</div>
                    <div className="pt-2 row">
                      {d.planName && d.duration ? <>
                        <div className="pt-2 pb-2 col-md-6">
                          <span className="badge bg-inverse-success m-t-5">{d.planName}</span></div>
                        <div className="pt-2 pb-2 col-md-6 border-left">
                          <a className="mr-1 btn btn-white btn-sm" href="#"  onClick={() => {
                          let company = d;
                          d.companyName = d.name;
                          this.setState({ company, showForm: true })
                        }} >Upgrade Plan</a>
                        </div>
                        
                      </> : <></>}
                      <div className="pt-2 pb-2 col-md-6 center">
                        Employees
                      </div>
                      <div className="pt-2 pb-2 col-md-6 center">
                        {d.employeeCount}
                      </div>
                      <div className="pt-2 pb-2 col-md-6 center">
                        Status : {d.active ? 'Active' : 'In-Active'}
                      </div>
                      <div className="pt-2 pb-2 col-md-6 center">
                        Multi Entity : {d.multiEntity ? 'Active' : 'In-Active'}
                      </div>
                      <div className='center'>
                        <h5 style={{ textAlign: 'center' }}>
                          <Link to="/app/admin-app/company-details"
                            state={{ company: d }} className="dropdown-item" onClick={() => {
                              let company = d;
                              d.companyId = d.id;
                              this.setState({ company });
                            }} style={{ textDecoration: 'none', color: 'inherit', backgroundColor: 'initial', }}>View Company
                          </Link>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            })}

          </div>

        
        {/* /Page Content */}

        {/* Manage Department Modal */}
        <Modal enforceFocus={false} size={"lg"} show={this.state.showForm} onHide={this.hideForm} >

          <Header closeButton>
            <h5 className="modal-title">{this.state.company ? 'Edit' : 'Add'} Company</h5>

          </Header>
          <Body>
            <CompanyForm updateList={this.fetchList} company={this.state.company} getCompanyDetails={this.getCompanyDetails} onFormSave={this.handleFormSave}>
            </CompanyForm>
          </Body>
        </Modal>

      </div>
      </div>
    );
  }
}
