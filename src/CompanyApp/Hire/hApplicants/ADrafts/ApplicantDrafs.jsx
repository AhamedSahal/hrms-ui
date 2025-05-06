import React, { Component } from "react";
import { Table } from "antd";
import { itemRender } from "../../../../paginationfunction"
import moment from "moment";
import { getReadableDate, getUserType } from "../../../../utility";
import { verifyOrgLevelViewPermission } from "../../../../utility";
import { BsEyeFill,BsFillBookFill,BsFillTrashFill,BsHourglassSplit,BsFillEnvelopePaperFill } from "react-icons/bs";
import { Modal } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { getAllApplicant,saveHExternalApplicantForms,saveHInternalApplicantForms } from "../service"
import EmployeeListColumn from "../../../Employee/employeeListColumn";
import TableDropDown from "../../../../MainPage/tableDropDown";
import AccessDenied from "../../../../MainPage/Main/Dashboard/AccessDenied";
const { Header, Body, Footer, Dialog } = Modal;
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';

export default class ApplicantDrafts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showForm: false,
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      status: "DRAFTS"
    };
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    if(verifyOrgLevelViewPermission("Hire Applicants")){
    // get all applicant
    getAllApplicant(this.state.q, this.state.page, this.state.size, this.state.sort,this.state.status).then(res => {
      if (res.status == "OK") {
        this.setState({ data: res.data, totalRecords: res.data.length })
      }
    })
  }
  }

  onTableDataChange = (d, filter, sorter) => {
    this.setState(
      {
        page: d.current - 1,
        size: d.pageSize,
        sort: sorter && sorter.field ? `${sorter.field},${sorter.order == "ascend" ? "asc" : "desc"}` : this.state.sort,
      },
      () => {
        this.fetchList();
      }
    );
  };

  handleStatusUpdate = (id, message, status) => {
    let dataParameters = {
      id: id,
      status: status,
      currentStatus: this.state.status
    }
    if (message == "internalApplicant") {
      saveHInternalApplicantForms(dataParameters)
        .then((res) => {
          if (res.status == "OK") {
            // toast.success(res.message);
          } else {
            toast.error(res.message);
          }
          if (res.status == "OK") {
            setTimeout(function () {
              window.location.reload()
            }, 6000)
          }
        })
        .catch((err) => {
          toast.error("Error while Update Job");
        });

    }
    if (message == "externalApplicant") {

      saveHExternalApplicantForms(dataParameters)
        .then((res) => {
          if (res.status == "OK") {
            // toast.success(res.message);
          } else {
            toast.error(res.message);
          }
          if (res.status == "OK") {
            setTimeout(function () {
              window.location.reload()
            }, 6000)
          }
        })
        .catch((err) => {
          toast.error("Error while Update Job");
        });

    }

  }

  pageSizeChange = (currentPage, pageSize) => {
    this.setState(
      {
        size: pageSize,
        page: 0,
      },
      () => {
        this.fetchList();
      }
    );
  };

  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state;
    let startRange = (currentPage - 1) * size + 1;
    let endRange = currentPage * (size + 1) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const menuItems = (text, record) => [
      <div ><Link className="muiMenu_item" to={`/app/company-app/hire/applicantviewForm/${text.id}`} state={text}  style={{ color: "black" }}> <b>View</b> </Link></div>,
    ]

    const columns = [
      {
        title: "Applicant Name",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.efirstName ? text.efirstName : text.ifirstName ? text.ifirstName : "-"}</span>
        },
      },
      {
        title: "Applied On",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.edateOfApplicant ? getReadableDate(text.edateOfApplicant) : text.idateOfApplicant ? getReadableDate(text.idateOfApplicant) : "-"}</span>
        },
      },
      {
        title: "Job Profile",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.ijobProfile ? text.ijobProfile :text.ejobProfile ? text.ejobProfile: "-"}</span>
        },
      },
      {
        title: "Hiring Manager",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.ehiringManagerId > 0 ? <EmployeeListColumn id={text.ehiringManagerId} name={text.ehiringManagerName}></EmployeeListColumn> :text.irecruiter > 0?<EmployeeListColumn id={text.irecruiter} name={text.ihiringManagerName}></EmployeeListColumn> :"-"}</span>
        },
      },
      {
        title: "Email",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.eemail ? text.eemail : text.iemail ? text.iemail : "-"}</span>
        },
      },
      {
        title: "Phone Number",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.ephone ? text.ephone : text.iphone ? text.iphone : "-"}</span>
        },
      },
      {
        title: "Source Type",
        dataIndex: "phone",
        sorter: true,
      },
     
      {
        title: "Work Experience(In Years)",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.etotalWorkExperience ? text.etotalWorkExperience : text.itotalexperienceYear ? text.itotalexperienceYear : "-"}</span>
        },
      },
      {
        title: "Relevant Experience(In Years)",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.irelevantExperienceYear ? text.irelevantExperienceYear : text.erelevantWorkExperience ? text.erelevantWorkExperience : "-"}</span>
        },
      },
      {
        title: "Last Worked At",
        dataIndex: "jobTitle",
        sorter: true,
      },
      {
        title: "Source Name",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.isourceName ? text.isourceName : "-"}</span>
        },
      },
      {
        title: "Notice Period(In Days)",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.enoticePeriod ? text.enoticePeriod : text.inoticePeriod ? text.inoticePeriod : "-"}</span>
        },
      },
      {
        title: "Current Salary",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.icurrentSalary && text.icurrentSalary > 0 ? text.icurrentSalary :text.ecurrentSalary && text.ecurrentSalary > 0 ? text.ecurrentSalary: "-"}</span>
        },
      },
      {
        title: "Expected Salary",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.iexpectedSalaryMaximum && text.iexpectedSalaryMaximum > 0? text.iexpectedSalaryMaximum : text.eexpectedSalary && text.eexpectedSalary > 0 ? text.eexpectedSalary : "-"}</span>
        },
      },
      {
        title: "Linkedin Profile Link",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.elinkedinProfileLink ? text.elinkedinProfileLink : "-"}</span>
        },
      },
      {
        title: 'Action',
        width: 50,
        className: 'text-center',
        render: (text, record) => (
          <div className="dropdow">
            <><a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="las la-bars"></i>
            </a>
              <div className="dropdown-menu dropdown-menu-right" style={{ padding: "5px" }}>
                {/* Edit */}
                <Link className="dropdown-item" to={`/app/company-app/hire/applicantviewForm/${text.id}`} state={text}  style={{ color: "black" }}> <BsEyeFill /> View </Link>
                {/* move to previous */}
                {isCompanyAdmin && <a className="dropdown-item" href="#"
                  onClick={() => {
                    this.handleStatusUpdate(text.externalId ? text.externalId : text.internalId, text.externalId ? "externalApplicant" : "internalApplicant", text.idraftStatus != null?text.idraftStatus:text.edraftStatus)
                  }}
                >
                  <BsHourglassSplit /> {text.idraftStatus != null?text.idraftStatus == "NEW"?"New":text.idraftStatus == "SCREENING"?"Screening":text.idraftStatus == "EVALUATING"?"Evaluate":text.idraftStatus == "OFFERED"?"Offered":text.idraftStatus == "HIRED"?"Hired":null
                  :text.edraftStatus == "SCREENING"?"Screening":text.edraftStatus == "EVALUATING"?"Evaluate":text.edraftStatus == "OFFERED"?"Offered":text.edraftStatus == "HIRED"?"Hired":null}</a>}
              </div></>
          </div>
        ),
      }
     

    ];
    return (
      <div className="page-container content container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="mt-3 mb-3 table-responsive">
            {verifyOrgLevelViewPermission("Hire Applicants") && <Table
                id="Table-style"
                className="table-striped "
                pagination={{
                  total: totalRecords,
                  showTotal: (total, range) => {
                    return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                  },
                  showSizeChanger: true,
                  onShowSizeChange: this.pageSizeChange,
                  itemRender: itemRender,
                  // pageSizeOptions: [10, 20, 50, 100],
                  // current: currentPage,
                  defaultCurrent: 1,
                }}
                style={{ overflowX: "auto" }}
                columns={columns}
                // bordered
                dataSource={[...data]}
                rowKey={(record) => record.id}
                onChange={this.onTableDataChange}
              />}
              {!verifyOrgLevelViewPermission("Hire Applicants") && <AccessDenied></AccessDenied>}
            </div>
          </div>
        </div>

        {/* view form */}
        <Modal enforceFocus={false} size={"lg"} show={this.state.showForm} onHide={this.hideForm} >
          <Body>
            <h1>name</h1>
          </Body>
        </Modal>

      </div>
    );
  }
}
