import { Table, Tooltip } from "antd";
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { Link } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { itemRender } from "../../../../paginationfunction";
import { getEmployeeId, getReadableDate, getTitle, getUserType, verifyOrgLevelViewPermission, verifySelfViewPermission } from '../../../../utility';
import EmployeeDropdown from '../../../ModuleSetup/Dropdown/EmployeeDropdown';
//import PayVarianceForm from './form';
import { getLeaveList, saveLeaveList, updateStatus } from './service';
import LeaveSlipViewer from './view';
import TableDropDown from "../../../../MainPage/tableDropDown";
import AccessDenied from "../../../../MainPage/Main/Dashboard/AccessDenied";

const { Header, Body, Footer, Dialog } = Modal;
export default class LeaveSettlement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employeeId: (getUserType() === 'EMPLOYEE' && verifySelfViewPermission("Pay Leave Settlement")) ? getEmployeeId(): 0,
      data: [],
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      tableView: '',
    };
  }
  componentDidMount() {
    if(getUserType() === "EMPLOYEE" && verifySelfViewPermission("Pay Leave Settlement")){
      this.setState({
        employeeId : getEmployeeId(),
        tableView : "1",
      })
      this.fetchList();
    }
  }
  fetchList = () => {
    if(verifySelfViewPermission("Pay Leave Settlement") || verifyOrgLevelViewPermission("Pay Leave Settlement")){
    {
      (this.state.employeeId != '' && getLeaveList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.employeeId).then(res => {
        if (res.status == "OK") {
          this.setState({
            data: res.data.list,
            totalPages: res.data.totalPages,
            totalRecords: res.data.totalRecords,
            currentPage: res.data.currentPage + 1
          })
        }
      }))
      }
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
  save = () => {
    saveLeaveList(this.state.employeeId).then(res => {
      if (res.status == "OK") {
        toast.success(res.message);
        this.fetchList();
      } else {
        toast.error(res.message);
      }
    }).catch(err => {
      toast.error(err);
    })
  }
  // delete = (data) => {
  //   confirmAlert({
  //     title: `Delete Pay Variance for ${data.title}`,
  //     message: 'Are you sure, you want to delete this Pay Variance?',
  //     buttons: [
  //       {
  //         className: "btn btn-danger",
  //         label: 'Yes',
  //         onClick: () => deletePayVariance(data.id).then(res => {
  //           if (res.status == "OK") {
  //             toast.success(res.message);
  //             this.fetchList();
  //           } else {
  //             toast.error(res.message)
  //           }
  //         })
  //       },
  //       {
  //         label: 'No',
  //         onClick: () => { }
  //       }
  //     ]
  //   });
  // }
  updateStatus = (id, status) => {
    updateStatus(id, status).then(res => {
      if (res.status == "OK") {
        toast.success(res.message);
        this.fetchList();
      } else {
        toast.error(res.message);
      }

    }).catch(err => {
      console.error(err);
      toast.error("Error while updating status");
    })
  }
  hideLeaveslip = () => {
    this.setState({
      showLeaveslip: false,
      leaveViewslip: undefined
    })
  }
  render() {
    let isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
    const { data, totalPages, totalRecords, currentPage, size, tableView, leaveViewslip } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const menuItems = (Leaveslip, record) => {
      const items = [];
      items.push(
        <div>
          <a className="muiMenu_item" href="#"
            onClick={() => {
              this.setState({ leaveViewslip: record, showLeaveslip: true })
            }}
          ><i className="fa fa-eye m-r-5" /><b>
              View</b></a>
        </div>
      );
      if (record.status == "UNPAID") {
        items.push(<div>
            <a className="muiMenu_item" href="#"
              onClick={() => {
                let { status } = this.state;
                status = (record.status == "UNPAID" ? "PAID" : "UNPAID");
                this.updateStatus(Leaveslip.id, status);
              }}
            >{record.status != "PAID" ? <i className="fa fa-check m-r-5" /> : <i className="fa fa-close m-r-5" />}<b>
                {record.status == "UNPAID" ? "Mark as PAID" : "UNPAID"}</b></a>
          </div>
        );
      }
      return items;
    };
    const columns = [
      {
        title: 'Payroll Month',
        // dataIndex: 'title',
        render: (text, record) => {
          return <span>{text && text ? record.payrollMonth : "Not Available"}</span>
        }
      },
      {
        title: 'Leave Name',
        // dataIndex: 'title',
        render: (text, record) => {
          return <span>{record.leavename ? record.leavename : ""}</span>
        }
      },
      {
        title: 'Approved Leave Date',
        render: (text, record) => {
          return <span>{text && text ? record.leavestartendmonthname : "Not Available"}</span>
        }
      },
      {
        title: 'No of days',
        // dataIndex: 'title',
        render: (text, record) => {
          return <span>{record.noofdays ? record.noofdays : 0}</span>
        }
      },
      {
        // title: <Tooltip title={"Total Amount = Net Salary for Payroll Month + (Leave Approved Days * Salary for Per day)"}>Total Amount </Tooltip>,
        title: "Net Settlement Amount",
        dataIndex: 'totalamount',
      },
      // {
      //   title: 'Status',
      //   render: (text, record) => {
      //       return <span>{text && record.status ? record.status : "A"}</span>
      //     }
      // },
      {
        title: 'Status',
        render: (text, record) => {
          return <span className={text.status == "PAID" ? "badge bg-inverse-success " : "badge bg-inverse-danger"}>
            {text.status == "PAID" ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
              text.status == "PAID" ? 'PAID' : 'UNPAID  '
            }</span>
        }
      },
      {
        title: 'Action',
        width: 50,
        render: (Leaveslip, record) => (
          <div className="">
            <TableDropDown menuItems={menuItems(Leaveslip, record)} />
          </div>
        ),
      },
      
    ]
    return (

      <>
        <div className="insidePageDiv">
          <Helmet>
            <title>Leave Settlement  | {getTitle()}</title>
            <meta name="description" content="Pay Variance page" />
          </Helmet>
          <div className="pb-1 page-containerDocList content container-fluid">
            <div className="tablePage-header">
              <div className="row pageTitle-section">
                <div className="col">
                  <h3 className="tablePage-title" >Leave Settlement</h3>

                </div>
                <div className="row mt-1 float-right col">

                  {isCompanyAdmin && <div className="py-2 col">
                    <div className="float-right col-md-6">

                      <EmployeeDropdown onChange={e => {
                        this.setState({
                          employeeId: e.target.value,
                          tableView: "1"
                        }, () => {
                          this.fetchList();
                        })

                      }}></EmployeeDropdown>
                    </div>
                  </div>}
                  {(isCompanyAdmin && this.state.employeeId != '') && <div className="py-2 float-right col-md-auto ml-auto" >
                    <a className="btn apply-button btn-primary" onClick={() => { this.setState({ tableView: "1" }); this.save(); }}><i className="fa fa-hourglass-start" />Process</a>
                  </div>}
                </div>
              </div>
            </div>
            {(isCompanyAdmin && this.state.employeeId == '') && <>
              <div className="p-3 alert alert-warning alert-dismissible fade show" role="alert">
                <span>Please select Employee & click the process button to generate leave settlement .</span>
              </div>
            </>}
            {(verifySelfViewPermission("Pay Leave Settlement") || verifyOrgLevelViewPermission("Pay Leave Settlement")) && <>
            {(this.state.employeeId != '' && tableView == "1" && <>   <div className="row">
              <div className="col-md-12">
                <div className="mt-3 mb-3 table-responsive">
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
            </div></>)}
            </>}
              {!verifySelfViewPermission("Pay Leave Settlement") && !verifyOrgLevelViewPermission("Pay Leave Settlement") && <AccessDenied></AccessDenied>}
          </div>
          <Modal enforceFocus={false} size={"lg"} show={this.state.showLeaveslip} onHide={this.hideLeaveslip} >
            <Header closeButton>
              <h5 className="modal-title">Leave Settlement</h5>
            </Header>
            <Body>
              {leaveViewslip && <LeaveSlipViewer leaveViewslip={leaveViewslip} />}
              {/* <LeaveSlipViewer />  */}
            </Body>
          </Modal>
        </div>

      </>
    );
  }
}
