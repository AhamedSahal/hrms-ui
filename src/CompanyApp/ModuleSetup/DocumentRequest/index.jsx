import { Table } from "antd";
import React, { Component } from "react";
import { Modal, Anchor } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { itemRender } from "../../../paginationfunction";
import { getTitle, isEmployee, toLocalDateTime, verifyOrgLevelViewPermission, verifyOrgLevelEditPermission, verifySelfViewPermission, verifySelfEditPermission, getEmployeeId } from "../../../utility";
import DocumentRequestForm from "./form";
import { cancelDocumentRequest, downloadDocument, getDocumentRequestList } from "./service";
import TableDropDown from "../../../MainPage/tableDropDown";
import AccessDenied from "../../../MainPage/Main/Dashboard/AccessDenied";

const { Header, Body, Footer, Dialog } = Modal;
let isCompanyAdmin = verifyOrgLevelEditPermission("Manage Document Request");

export default class DocumentRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      q: "",
      page: 0,
      size: 10,
      sort: "createdOn,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      showFilter: false,
    };
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    if (verifySelfViewPermission("Manage Document Request") || verifyOrgLevelViewPermission("Manage Document Request")) {
      getDocumentRequestList(
        this.state.q,
        this.state.page,
        this.state.size,
        this.state.sort
      ).then((res) => {
        if (res.status == "OK") {
          this.setState({
            data: res.data.list,
            totalPages: res.data.totalPages,
            totalRecords: res.data.totalRecords,
            currentPage: res.data.currentPage + 1,
          });
        }
      });
    }
  };
  updateList = (documentrequest) => {
    let { data } = this.state;
    let index = data.findIndex((d) => d.id == documentrequest.id);
    if (index > -1) data[index] = documentrequest;
    else {
      data = [documentrequest, ...data];
    }
    this.setState({ data }, () => {
      this.hideForm();
    });
  };

  hideForm = () => {
    this.setState({
      showForm: false,
      documentrequest: undefined,
    });
  };
  hideDocumentRequestImage = () => {
    this.setState({
      showDocumentRequest: false,
      documentrequest: undefined,
    });
  };
  delete = (data) => {
    confirmAlert({
      title: `Cancel Document Request`,
      message: "Are you sure, you want to cancel this Document Request?",
      buttons: [
        {
          className: "btn btn-danger",
          label: "Yes",
          onClick: () =>
            cancelDocumentRequest(data.id).then((res) => {
              if (res.status == "OK") {
                toast.success(res.message);
                this.fetchList();
              } else {
                toast.error(res.message);
              }
            }),
        },
        {
          label: "No",
          onClick: () => { },
        },
      ],
    });
  };

  onTableDataChange = (d, filter, sorter) => {
    this.setState({
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
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
  download = (id, fileName) => {
    downloadDocument(id).then(res => {
      if(res){
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      }
    })
  }
  getStyle(text) {
    if (text === 'REQUESTED') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Requested</span>;
    }
    if (text === 'CANCELED') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Canceled</span>;
    }
    if (text === 'APPROVED') {
      return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Approved</span>;
    }
    if (text === 'REJECTED') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Rejected</span>;
    }
    if (text === 'PENDING') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Pending</span>;
    }
    return 'black';
  }
  render() {
    const { location } = this.props;
    const {
      data,
      totalPages,
      totalRecords,
      currentPage,
      size,
      documentrequest,
      showDocumentRequest,
    } = this.state;
    let startRange = (currentPage - 1) * size + 1;
    let endRange = currentPage * (size + 1) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const menuItems = (text, record) => {
      const items = [];
      if (isEmployee() && text.employee.id === getEmployeeId() && text.status === "REQUESTED") {
        items.push(<div> <Anchor className="muiMenu_item"
          onClick={() => { this.setState({ documentrequest: text, showForm: true }); }} >
          <i className="fa fa-pencil m-r-5"></i> Edit
        </Anchor>
        </div>
        );
      }
      if(text.status === 'REQUESTED' && text.employee.id === getEmployeeId())
      items.push(
        <div><Anchor className="muiMenu_item"
          onClick={() => { this.delete(text); }} > <i className="fa fa-trash-o m-r-5"></i> Cancel
        </Anchor> </div>
      );
      if (verifyOrgLevelEditPermission("Manage Document Request")) {
        items.push(<div>
          <Link className="muiMenu_item" to="/app/company-app/employee-document-request" state={text}>
            <i className="fa fa-eye m-r-5"></i> View
          </Link>
        </div>
        );
      }
      if (text.status === "APPROVED" && text.allowedToDownload && (!text.expired|| text.numberOfDaysAllowedToDownload === 0)) {
        items.push(<div>
          <Anchor className="muiMenu_item" onClick={() => {
            this.download(text.id, `${text.template?.name}-${text.employee?.name}.pdf`);
          }} >
            <i className="fa fa-cloud-download m-r-5"></i> Download
          </Anchor>
        </div>
        );
      }

      return items;
    };
    let columns = [];

    if (verifyOrgLevelViewPermission("Manage Document Request")) {
      columns.push({
        title: "Employee Name",
        sorter: true,
        render: (text, record) => {
          return <span>{text.employee.name}</span>
        }
      })
    }

    columns.push(...[
      {
        title: "Document Name",
        sorter: true,
        render: (text, record) => {
          return <span>{text.template.name}</span>
        }
      },
      {
        title: "Detail",
        dataIndex: "details",
      },
      {
        title: 'Status',
        dataIndex: 'status',
        sorter: true,

        render: (text, record) => {
           return <><div >{this.getStyle(text)}</div>
          </>
        }
      },
      {
        title: "Created On",
        dataIndex: "createdOn",
        sorter: true,
        render: (cell) => {
          return toLocalDateTime(cell);
        },
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
      
    ]);
    return (
      <div className="insidePageDiv">
        <Helmet>
          <title>DocumentRequest | {getTitle()}</title>
          <meta name="description" content="Role page" />
        </Helmet>
        {/* Page Content */}

        <div className="page-containerDocList content container-fluid">
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Document Request</h3>
                <ul hidden className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/app/main/dashboard">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active">DocumentRequest</li>
                </ul>
              </div>
              <div className="mt-1 float-right col">

                {isEmployee() && verifySelfEditPermission("Manage Document Request") && <Anchor
                  className="btn apply-button btn-primary"
                  onClick={() => {
                    this.setState({
                      showForm: true,
                    }, () => {
                      console.log({ documentrequest: this.state.documentrequest })
                    });
                  }}
                >
                  <i className="fa fa-plus" /> Request Document
                </Anchor>}

              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
                {(verifySelfViewPermission("Manage Document Request") || verifyOrgLevelViewPermission("Manage Document Request")) &&
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
                  style={{ overflowX: "auto" }}
                  columns={columns}
                  // bordered
                  dataSource={[...data]}
                  rowKey={(record) => record.id}
                  onChange={this.onTableDataChange}


                />}
                {!verifySelfViewPermission("Manage Document Request") && !verifyOrgLevelViewPermission("Manage Document Request") && <AccessDenied></AccessDenied>}
              </div>
            </div>
          </div>
        </div>


        <Modal
          enforceFocus={false}
          size={"xl"}
          show={this.state.showForm}
          onHide={this.hideForm}
        >
          <Header closeButton>
            <h5 className="modal-title">
              {this.state.documentrequest ? "Edit " : "Add "} Document Request
            </h5>
          </Header>
          <Body>
            <DocumentRequestForm
              updateList={this.updateList}
              documentrequest={documentrequest}
            ></DocumentRequestForm>
          </Body>
        </Modal>
      </div>

    );
  }
}
