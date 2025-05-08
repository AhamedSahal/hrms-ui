import React, { Component } from "react";
import { Table } from "antd";
import { Button, Modal, Anchor } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { itemRender } from "../../../paginationfunction";
import { getTitle, getUserType, toLocalDateTime, verifyOrgLevelViewPermission, verifyOrgLevelEditPermission } from "../../../utility";
import TemplateForm from "./form";
import { deleteTemplate, getTemplateList } from "./service";
import { TEMPLATE_TYPE, TEMPLATE_TYPE_SUPER_ADMIN } from "../../../Constant/enum";
import EnumDropdown from "../Dropdown/EnumDropdown";
import AccessDenied from "../../../MainPage/Main/Dashboard/AccessDenied";

const { Header, Body, Footer, Dialog } = Modal;
let isSuperAdmin = getUserType() == 'SUPER_ADMIN';
const defaultTemplateType = isSuperAdmin ? "EMAIL" : "DOCUMENT";
export default class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateType: defaultTemplateType,
      data: [],
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      showFilter: false,
      template: {
        id: 0,
        templateType: defaultTemplateType,
        name:'',
        displayName:'',
        subject:'',
        footer:'',
        body:'',
        header:'',
      }
    };
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    if (verifyOrgLevelViewPermission("Module Setup Manage")) {
      getTemplateList(
        this.state.templateType,
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
  updateList = (template) => {
    let { data } = this.state;
    let index = data.findIndex((d) => d.id == template.id);
    if (index > -1) data[index] = template;
    else {
      data = [template, ...data];
    }
    this.setState({ data }, () => {
      this.hideForm();
    });
  };

  hideForm = () => {
    this.setState({
      showForm: false,
      template: undefined,
    });
  };
  hideTemplateImage = () => {
    this.setState({
      showTemplate: false,
      template: undefined,
    });
  };
  delete = (data) => {
    confirmAlert({
      title: `Delete Template`,
      message: "Are you sure, you want to delete this Template?",
      buttons: [
        {
          className: "btn btn-danger",
          label: "Yes",
          onClick: () =>
            deleteTemplate(data.id).then((res) => {
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
  render() {
    const {
      data,
      totalPages,
      totalRecords,
      currentPage,
      size,
      template,
      showTemplate,
    } = this.state;
    let startRange = (currentPage - 1) * size + 1;
    let endRange = currentPage * (size + 1) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        sorter: true,
      },
      {
        title: "Display Name",
        dataIndex: "displayName",
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
        title: "Action",
        width: 50,
        render: (text, record) => (
          <div className="dropdow">
            {verifyOrgLevelEditPermission("Module Setup Manage") && <> <Anchor
              className="action-icon dropdown-toggle"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="las la-bars"></i>
            </Anchor>
              <div className="dropdown-menu dropdown-menu-right">
                <Anchor
                  className="dropdown-item"
                  onClick={() => {
                    this.setState({ template: text, showForm: true });
                  }}
                >
                  <i className="fa fa-pencil m-r-5"></i> Edit
                </Anchor>
                <Anchor hidden={text.templateType != "DOCUMENT"}
                  className="dropdown-item"
                  onClick={() => {
                    this.delete(text);
                  }}
                >
                  <i className="fa fa-trash-o m-r-5"></i> Delete
                </Anchor>
              </div></>}
          </div>
        ),
      },
    ];
    return (
      <div className="">
      {/* Page Content */ }
      < div className = "page-container content container-fluid" >
        {/* Page Header */ }
        < div className = "tablePage-header" >
          <div className="row pageTitle-section">
            <div className="col">
              <h3 className="tablePage-title">Template</h3>
              <ul hidden className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/app/main/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Template</li>
              </ul>
            </div>

            <div className="mt-2 d-flex float-right col-auto ml-auto">
              
                {verifyOrgLevelViewPermission("Module Setup Manage") && <div className="mb-2 col-8" >
                  <label className="overtime-label doc-label">Template Type
                  </label>
                  <EnumDropdown label={"Template Type"} enumObj={isSuperAdmin ? TEMPLATE_TYPE_SUPER_ADMIN : TEMPLATE_TYPE} defaultValue={defaultTemplateType} onChange={e => {
                    let { template } = this.state;
                    if (!template)
                      template = {};
                    template.templateType = e.target.value;
                    this.setState({
                      template,
                      templateType: e.target.value
                    }, () => {
                      this.fetchList();
                    })
                  }}>
                  </EnumDropdown>
                </div>}
                {verifyOrgLevelEditPermission("Module Setup Manage") && <a
                  className="mt-1 btn apply-button btn-primary"
                  onClick={() => {
                    this.setState({
                      showForm: true,
                    }, () => {
                      console.log({ template: this.state.template })
                    });
                  }}
                >
                  <i className="fa fa-plus" /> Add
                </a>}
                
              
            </div>

          </div>
       </div >

      {/* /Page Header */ }
      < div className = "row" >
        <div className="col-md-12">
          <div className="mt-3 mb-3 table-responsive">



            {verifyOrgLevelViewPermission("Module Setup Manage") && <Table
              id='Table-style' className="table-striped"
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
            {!verifyOrgLevelViewPermission("Module Setup Manage") && <AccessDenied></AccessDenied>}
          </div>

        </div >

       </div >




          <Modal
            enforceFocus={false}
            size={"xl"}
            show={this.state.showForm}
            onHide={this.hideForm}
          >
            <Header closeButton>
              <h5 className="modal-title">
                {this.state.template ? "Edit" : "Add"} Template
              </h5>
            </Header>
            <Body>
              <TemplateForm
                updateList={this.updateList}
                template={template}
              ></TemplateForm>
            </Body>
          </Modal>
        </div>
        </div>
    );
  }
}
