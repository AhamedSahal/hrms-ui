import React, { Component } from "react";
import { Table } from "antd";
import { Button, Modal, Anchor } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { itemRender } from "../../../paginationfunction";
import { getTitle, toLocalDateTime, verifyOrgLevelViewPermission, verifyOrgLevelEditPermission, getEmployeeId } from "../../../utility";
import SignatureForm from "./form";
import { deleteSignature, getSignatureList } from "./service";
import AccessDenied from "../../../MainPage/Main/Dashboard/AccessDenied";

const { Header, Body, Footer, Dialog } = Modal;

export default class Signature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeId: getEmployeeId(),
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
    if (verifyOrgLevelViewPermission("Module Setup Manage")) {
      getSignatureList(
        this.state.employeeId,
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
  updateList = (signature) => {
    let { data } = this.state;
    let index = data.findIndex((d) => d.id == signature.id);
    if (index > -1) data[index] = signature;
    else {
      data = [signature, ...data];
    }
    this.setState({ data }, () => {
      this.hideForm();
      this.fetchList()
    });
  };

  hideForm = () => {
    this.setState({
      showForm: false,
      signature: undefined,
    });
  };
  hideSignatureImage = () => {
    this.setState({
      showSignature: false,
      signature: undefined,
    });
  };
  delete = (data) => {
    confirmAlert({
      title: `Delete Signature`,
      message: "Are you sure, you want to delete this Signature?",
      buttons: [
        {
          className: "btn btn-danger",
          label: "Yes",
          onClick: () =>
            deleteSignature(data.id).then((res) => {
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

  render() {
    const {
      data,
      totalPages,
      totalRecords,
      currentPage,
      size,
      signature,
      showSignature,
    } = this.state;
    let startRange = (currentPage - 1) * size + 1;
    let endRange = currentPage * (size + 1) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const columns = [
      {
        title: "Employee",
        dataIndex: "employeeName",
        sorter: true,
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
        title: "Signature",
        sorter: true,
        render: (text) => {
          return (
            <>
              <Anchor
                onClick={() => {
                  this.setState({
                    signature: text,
                    showSignature: true,
                  });
                }}
              >
                View
              </Anchor>
            </>
          );
        },
      },
      {
        title: "Action",
        width: 50,
        render: (text, record) => (
          <div className="dropdow">
            {verifyOrgLevelEditPermission("Module Setup Manage") && <> <a
              href="#"
              className="action-icon dropdown-toggle"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="las la-bars"></i>
            </a>
              <div className="dropdown-menu dropdown-menu-right">
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    this.setState({ signature: text, showForm: true });
                  }}
                >
                  <i className="fa fa-pencil m-r-5"></i> Edit
                </a>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    this.delete(text);
                  }}
                >
                  <i className="fa fa-trash-o m-r-5"></i> Delete
                </a>
              </div></>}
          </div>
        ),
      },
    ];
    return (
      <>
        {/* Page Content */}
        < div className="page-container content container-fluid" >
          {/* Page Header */}
          < div className="tablePage-header" >
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Signature</h3>
                <ul hidden className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/app/main/dashboard">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active">Signature</li>
                </ul>
              </div>

              <div className="mt-2 float-right col-auto ml-auto">
                {verifyOrgLevelEditPermission("Module Setup Manage") && <a
                  href="#"
                  className="btn apply-button btn-primary"
                  onClick={() => {
                    this.setState({
                      showForm: true,
                    });
                  }}
                >
                  <i className="fa fa-plus" /> Add
                </a>}
              </div>

            </div>
          </div >

          {/* /Page Header */}
          < div className="row" >
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">

                {verifyOrgLevelViewPermission("Module Setup Manage") && <Table
                  id='Table-style' className="table-striped"
                  pagination={{
                    total: totalRecords,
                    showTotal: (total, range) => {
                      return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                    },
                    showSizeChanger: true,
                    onShowSizeChange: this.pageSizeChange,
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
                {!verifyOrgLevelViewPermission("Module Setup Manage") && <AccessDenied></AccessDenied>}
              </div>

            </div >

          </div >






          <Modal
            enforceFocus={false}
            size={"md"}
            show={this.state.showForm}
            onHide={this.hideForm}
          >
            <Header closeButton>
              <h5 className="modal-title">
                {this.state.signature ? "Edit" : "Add"} Signature
              </h5>
            </Header>
            <Body>
              <SignatureForm
                updateList={this.updateList}
                signature={this.state.signature}
                employeeId={this.state.employeeId}
              ></SignatureForm>
            </Body>
          </Modal>

          <Modal
            enforceFocus={false}
            size={"md"}
            show={showSignature}
            onHide={this.hideSignatureImage}
          >
            <Header closeButton>
              <h5 className="modal-title">
                Signature by {signature?.employeeName}
              </h5>
            </Header>
            <Body>
              <img src={signature?.signature} style={{ maxWidth: "100%" }} />
            </Body>
          </Modal>
        </div>
      </>
    );
  }
}
