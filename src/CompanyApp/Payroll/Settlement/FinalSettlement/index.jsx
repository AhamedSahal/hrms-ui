import { Table, Tooltip } from "antd";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { FormGroup } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import { Link } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import FinalSettlementAction from './FinalSettlementAction';
import { itemRender } from "../../../../paginationfunction";
import { getEmployeeId, getReadableDate, getTitle, getUserType, verifyOrgLevelViewPermission, verifySelfViewPermission } from '../../../../utility';
import EmployeeDropdown from '../../../ModuleSetup/Dropdown/EmployeeDropdown';
import AccessDenied from './../../../../MainPage/Main/Dashboard/AccessDenied';
import FinalSettlementForm from './form';
import { getFFList, saveFF, updateStatus } from './service';
import FinalSlipViewer from './view';
import TableDropDown from "../../../../MainPage/tableDropDown";
const { Header, Body, Footer, Dialog } = Modal;
export default class FinalSettlement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employeeId: (getUserType() === 'EMPLOYEE' && verifySelfViewPermission("Pay Final Settlement")) ? getEmployeeId(): 0,
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
    if(getUserType() === "EMPLOYEE" && verifySelfViewPermission("Pay Final Settlement")){
      this.setState({
        employeeId : getEmployeeId(),
        tableView : "1",
      })
      this.fetchList();
    }
  }
  fetchList = () => {
    if(verifySelfViewPermission("Pay Final Settlement") || verifyOrgLevelViewPermission("Pay Final Settlement"))
    {
      (this.state.employeeId != '' && getFFList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.employeeId).then(res => {
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
  updateList = (FinalSettlementObj) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == FinalSettlementObj.id);
    if (index > -1)
      data[index] = FinalSettlementObj;
    else {
      data = [FinalSettlementObj, ...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
      });
  }
  hideForm = () => {
    this.hideFinalForm();
    this.hideAction();
    this.hideFinalslip();
  }
  hideFinalForm = () => {
    this.setState({
      showFinalForm: false
    })
  }

  hideAction = () => {
    this.setState({
      showAction: false

    })
  }
  hideFinalslip = () => {
    this.setState({
      showFinalslip: false,
      finalViewslip: undefined
    })
  }
  render() {
    let isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
    const { data, showIntitate, tableView, totalPages, totalRecords, currentPage, size, finalViewslip } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const menuItems = (FinalSettlementObj, record) => {
      const items = [];
      if (record.status == "UNPAID") {
        items.push(<div>
           <a className="muiMenu_item" href="#" onClick={() => {
                let { FinalSettlement } = this.state;
                FinalSettlement = FinalSettlementObj;
                this.setState({ FinalSettlement, showAction: true })
              }} >
                <i className="fa fa-pencil m-r-5"></i><b>Update Final Settlement</b></a>
          </div>
        );
      }
      items.push(
        <div>
          <a className="muiMenu_item" href="#"
                onClick={() => {
                  this.setState({ finalViewslip: record, showFinalslip: true })
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
                  this.updateStatus(FinalSettlementObj.id, status);
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
        title: 'Date of Join',
        render: (text, record) => {
          return <>
            <div>{getReadableDate(record.doj != null ? record.doj : "NA")}</div>
          </>
        }
      },
      {
        title: 'Resignation/Termination Date',
        render: (text, record) => {
          return <>
            <div>{getReadableDate(record.resignationDate != null ? record.resignationDate : "NA")}</div>
          </>
        }
      },
      {
        title: 'Last Working Date',
        render: (text, record) => {
          return <>
            <div>{getReadableDate(record.lwd != null ? record.lwd : "NA")}</div>
          </>
        }
      },
      {
        title: 'Total Settlement',
        render: (text, record) => {
          return <span>{record.totalamount ? record.totalamount : "15600"}</span>
        }
      },
      {
        title: 'Employment Status',
        render: (text, record) => {
          return <span>{record.empstatus}</span>
        }
      },
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
        render: (FinalSettlementObj, record) => (
          <div className="">
            <TableDropDown menuItems={menuItems(FinalSettlementObj, record)} />
          </div>
        ),
      },
      
    ]
    return (

      <>
        <div className="insidePageDiv">
          <Helmet>
            <title>Final Settlement  | {getTitle()}</title>
            <meta name="description" content="Pay Variance page" />
          </Helmet>
          <div className="pb-1 page-containerDocList content container-fluid">
            <div className="tablePage-header">
              <div className="row pageTitle-section">
                <div className="col">
                  <h3 className="tablePage-title" >Final Settlement</h3>

                </div>
                <div className="justify-content-end row mt-1 col">

                  {isCompanyAdmin && <div className="col-6">


                    <EmployeeDropdown onChange={e => { this.setState({ employeeId: e.target.value, tableView: "1" }, () => { this.fetchList(); }) }}></EmployeeDropdown>

                  </div>}
                  {(isCompanyAdmin && this.state.employeeId == '') && <div className="mt-2 col-md-auto ml-0">
                    <a className="btn apply-button btn-primary" href="#"
                      onClick={() => {
                        this.setState({ showFinalForm: true })
                      }}>
                      <i className="fa fa-hourglass-start" /> Initiate Process</a>
                  </div>}
                </div>
              </div>
            </div>
            {(isCompanyAdmin && this.state.employeeId == '') && <>
              <div className="alert alert-warning alert-dismissible fade show" role="alert">
                <span>Please click the initate process button to process the final settlement .</span>
              </div>
            </>}
            {(verifySelfViewPermission("Pay Final Settlement") || verifyOrgLevelViewPermission("Pay Final Settlement")) && <>
            {(this.state.employeeId != '' && <>   <div className="row">
              <div className="col-md-12">
                <div className="mt-3 mb-3 table-responsive">
                  <Table id='Table-style' className="table-striped "
                    pagination={{
                      total: totalRecords,
                      showTotal: (total, range) => {
                        return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                      },
                      showSizeChanger: true,
                      //onShowSizeChange: this.pageSizeChange,
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
                  />

                </div>
              </div>
            </div></>)}
              </>}
              {!verifySelfViewPermission("Pay Final Settlement") && !verifyOrgLevelViewPermission("Pay Final Settlement") && <AccessDenied></AccessDenied>}
          </div>

          <Modal enforceFocus={false} size={"md"} show={this.state.showFinalForm} onHide={this.hideFinalForm} >
            <Header closeButton>
              <h5 className="modal-title"> Final Settlement Process</h5>
            </Header>
            <Body>
              <FinalSettlementForm />
            </Body>
          </Modal>
          <Modal enforceFocus={false} size={"md"} show={this.state.showAction && isCompanyAdmin} onHide={this.hideAction} >
            <Header closeButton>
              <h5 className="modal-title">Final Settlement Action</h5>
            </Header>
            <Body>
              <FinalSettlementAction updateList={this.updateList} FinalSettlement={this.state.FinalSettlement} >
              </FinalSettlementAction>
            </Body>
          </Modal>
          <Modal enforceFocus={false} size={"lg"} show={this.state.showFinalslip} onHide={this.hideFinalslip} >
            <Header closeButton>
              <h5 className="modal-title">Final Settlement</h5>
            </Header>
            <Body>
              {finalViewslip && <FinalSlipViewer finalViewslip={finalViewslip} />}
            </Body>
          </Modal>
        </div>

      </>
    );
  }
}