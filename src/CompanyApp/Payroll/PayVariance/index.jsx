import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { getReadableDate, getTitle, getUserType, getEmployeeId, verifySelfViewPermission, verifySelfEditPermission, verifyEditPermission, getPermission, verifyViewPermission, verifyApprovalPermission, verifyViewPermissionForTeam, getReadableMonthYear } from '../../../utility';
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
import PayVarianceForm from './form';
import { deletePayVariance, getPayVarianceList } from './service';
import TableDropDown from '../../../MainPage/tableDropDown';

const { Header, Body, Footer, Dialog } = Modal;
export default class PayVariance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employeeId: getUserType() == 'COMPANY_ADMIN' ? '' : verifySelfViewPermission("Payroll Pay Variance") ? getEmployeeId() : "",
      data: [],
      self: getUserType() == 'COMPANY_ADMIN' ? 0 : verifySelfViewPermission("Payroll Pay Variance") ? 1 : 0,
      buttonState: true,
    };
  }
  componentDidMount() {
    if (getUserType() != 'COMPANY_ADMIN') {
      this.fetchList();
    }
  }
  fetchList = () => {
    if (verifyViewPermission("Payroll Pay Variance")) {
      var empId = this.state.employeeId;
      if (this.state.self == 1) {
        empId = getEmployeeId()
      }
      empId > 0 && getPayVarianceList(empId).then(res => {
        if (res.status == "OK") {
          this.setState({
            data: res.data ? res.data : [],
            employeeId: empId,
          })
        }
      })
    }
  }
  updateList = (payVariance) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == payVariance.id);
    if (index > -1)
      data[index] = payVariance;
    else {
      data = [payVariance, ...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
      });
  }

  hideForm = () => {
    this.setState({
      showForm: false,
      payVariance: undefined
    })
  }
  updateSelf = () => {

    this.setState({
      self: this.state.self == 1 ? 0 : 1
    }, () => {
      this.fetchList();
    })
  }
  delete = (data) => {
    confirmAlert({
      title: `Delete Pay Variance for ${data.title}`,
      message: 'Are you sure, you want to delete this Pay Variance?',
      buttons: [
        {
          className: "btn btn-danger",
          label: 'Yes',
          onClick: () => deletePayVariance(data.id).then(res => {
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

  handleButtonClick = () => {
    this.setState((prevState) => ({
      buttonState: !prevState.buttonState,
      preferredMethod: prevState.buttonState ? 'Self' : 'Team'
    }));
  };

  render() {
    let isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
    const { data,buttonState } = this.state
    const debitData = data.filter(d => d.type == "DEBIT");
    const creditData = data.filter(d => d.type != "DEBIT");
    const menuItems = (text, record) => [
      <div ><a className="muiMenu_item" href="#" onClick={() => {
        let { payVariance } = this.state;
        payVariance = text;
        payVariance.employeeId = this.state.employeeId;
        this.setState({ payVariance, showForm: true })
      }} >
        <i className="fa fa-pencil m-r-5"></i> Edit</a></div>,
      <div ><a className="muiMenu_item" href="#" onClick={() => {
        this.delete(text);
      }}>
        <i className="fa fa-trash-o m-r-5"></i> Delete</a></div>,
    ]
    const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
      },
      {
        title: 'Total Amount',
        dataIndex: 'amount',
      },
      {
        title: 'Start Month',
        dataIndex: 'fromDate',
        render: (text, record) => {
          return <span>{text && text ? getReadableMonthYear(text) : "NA"}</span>
        }
      },
      {
        title: 'End Month',
        dataIndex: 'toDate',
        render: (text, record) => {
          return <span>{text ? getReadableMonthYear(text) : "NA"}</span>
        }
      },
      {
        title: 'Description',
        dataIndex: 'description',
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

      <>
        <div className="insidePageDiv">
          <Helmet>
            <title>Pay Variance  | {getTitle()}</title>
            <meta name="description" content="Pay Variance page" />
          </Helmet>
          <div className="pb-1 page-containerDocList content container-fluid">
            <div className="tablePage-header">
              <div className="row pageTitle-section">
                <div className="col">
                  <h3 className="tablePage-title">Pay Variance </h3>
                  <ul hidden className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                    <li className="breadcrumb-item active">Payroll</li>
                    <li className="breadcrumb-item active">Pay Variance</li>
                  </ul>
                </div>
                <div className="row leave-balance-table">

                {verifyViewPermissionForTeam("Payroll Pay Variance") && !isCompanyAdmin && 
                  //old
                  // <>
                  //   <div class="btn-group btn-cust-group" role="group" aria-label="Basic example">
                  //     {verifySelfViewPermission("Payroll Pay Variance") && <button type="button" className={this.state.self == 1 ? 'btn btn-sm btn-primary btn-selected' : 'btn btn-sm btn-secondary'} onClick={e => {
                  //       this.updateSelf()
                  //     }} > Self </button>}

                  //     <button type="button" className={this.state.self != 1 ? 'btn btn-sm btn-primary btn-selected' : 'btn btn-sm btn-secondary'} onClick={e => {
                  //       verifySelfViewPermission("Payroll Pay Variance") && this.updateSelf()
                  //     }} > Team </button>
                  //   </div>
                  // </>
                  // new
                  <div className="col-sm-2" style={{marginRight: '100px',marginTop: '10px'}}>
                        <div onClick={e => {
                          this.updateSelf()
                          this.handleButtonClick()
                        }} className="toggles-btn-view" id="button-container" >

                          <div id="my-button" className="toggle-button-element" style={{ transform: buttonState ? 'translateX(0px)' : 'translateX(80px)' }}>
                            <p className='m-0 self-btn'>{buttonState ? 'Self' : 'Team'}</p>

                          </div>
                          <p className='m-0 team-btn' style={{ transform: buttonState ? 'translateX(0px)' : 'translateX(-80px)' }}>{buttonState ? 'Team' : 'Self'}</p>
                        </div>

                      </div>
                  }

                  {verifyViewPermissionForTeam("Payroll Pay Variance") && this.state.self == 0 && <div className="col-sm-4 col-md-4">
                    <div>
                      <EmployeeDropdown onChange={e => {
                        this.setState({
                          employeeId: e.target.value
                        }, () => {
                          this.fetchList();
                        })

                      }} permission={getPermission("Payroll Pay Variance", "VIEW")} ></EmployeeDropdown>
                    </div>
                  </div>}
                 
                </div>
              </div>
            </div>
            {(verifyViewPermissionForTeam("Payroll Pay Variance") && this.state.employeeId == '') && <>
              <div className="p-2 alert alert-warning alert-dismissible fade show" role="alert">
                <span>Please select Employee.</span>
              </div>
            </>}
            {verifyViewPermission("Payroll Pay Variance") && this.state.employeeId && <>  <div className="row row-top-margin-30">
              <div className="col-lg-6">
                <div className="card">
                  <div className="payVariance-card card-header card-header-action">
                    <div className="row align-items-center">
                      <div className="col earning-deduc-div"><h3 className="tablePage-title">Earning</h3>
                        {(this.state.self == 0 && this.state.employeeId > 0 && verifyEditPermission("Payroll Pay Variance")) && <a href="#" className="btn btn-primary" onClick={() => {
                          let { payVariance } = this.state;
                          payVariance = {
                            type: "CREDIT",
                            employeeId: this.state.employeeId
                          };
                          this.setState({ payVariance, showForm: true })
                        }}><i className="fa fa-plus"></i></a>}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 table-responsive">

                    <Table id='Table-style' className="table-striped "
                      style={{ overflowX: 'auto' }}
                      columns={columns}
                      // bordered
                      dataSource={[...creditData]}
                      rowKey={record => record.id}
                      pagination={false}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card">
                  <div className="payVariance-card card-header">
                    <div className="row align-items-center">
                      <div className="col earning-deduc-div"><h3 className="tablePage-title">Deduction</h3>
                        {(this.state.self == 0 && this.state.employeeId > 0 && verifyEditPermission("Payroll Pay Variance")) && <a href="#" className="btn btn-primary" onClick={() => {
                          let { payVariance } = this.state;
                          payVariance = {
                            type: "DEBIT",
                            employeeId: this.state.employeeId
                          };
                          this.setState({ payVariance, showForm: true })
                        }}><i className="fa fa-plus"></i></a>}
                      </div>

                    </div>
                  </div>
                  <div className="p-3 table-responsive">
                    <Table id='Table-style' className="table-striped "
                      style={{ overflowX: 'auto' }}
                      columns={columns}
                      // bordered
                      dataSource={[...debitData]}
                      rowKey={record => record.id}
                      pagination={false}
                    />
                  </div>
                </div>
              </div>
            </div></>}
            {!verifyViewPermission("Payroll Pay Variance") && <AccessDenied></AccessDenied>}
          </div>





          <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
            <Header closeButton>
              <h5 className="modal-title">{this.state.payVariance && this.state.payVariance.id > 0 ? 'Edit ' : 'Add '} {this.state.payVariance && this.state.payVariance.type == "CREDIT" ? 'Earning' : 'Deduction'}</h5>
            </Header>
            <Body>
              <PayVarianceForm updateList={this.updateList} payVariance={this.state.payVariance} employeeId={this.state.employeeId}>
              </PayVarianceForm>
            </Body>
          </Modal>
        </div>


      </>
    );
  }
}
