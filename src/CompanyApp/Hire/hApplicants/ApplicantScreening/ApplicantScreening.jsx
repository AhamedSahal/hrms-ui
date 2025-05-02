import React, { Component } from "react";
import { Table } from "antd";
import { itemRender } from "../../../../paginationfunction"
import moment from "moment";
import { Modal } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { BsEyeFill,BsFillBookFill,BsFillTrashFill,BsHourglassSplit } from "react-icons/bs";
import EmployeeListColumn from "../../../Employee/employeeListColumn";
import { getReadableDate, getUserType } from "../../../../utility";
import { verifyOrgLevelViewPermission } from "../../../../utility";
import HApplicantScheduleForm from "../ApplicantNew/HApplicantScheduleForm/HApplicantScheduleForm";
import { getAllApplicant,saveHInternalApplicantForms,saveHExternalApplicantForms } from "../service"
import AccessDenied from "../../../../MainPage/Main/Dashboard/AccessDenied";
const { Header, Body, Footer, Dialog } = Modal;
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';

export default class ApplicantScreening extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showForm: false,
      q: "",
      page: 0,
      showScheduleForm: false,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      status: "SCREENING",
      hiringManagerId: 0
    };
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    if(verifyOrgLevelViewPermission("Module Setup Performance")){
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

  hideScheduleForm = () => {
    this.setState({
      showScheduleForm: false
    })
  }

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
            window.location.reload();
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
            window.location.reload();
          }
        })
        .catch((err) => {
          toast.error("Error while Update Job");
        });

    }

  }

  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state;
    let startRange = (currentPage - 1) * size + 1;
    let endRange = currentPage * (size + 1) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const columns = [
      {
        title: "Applicant Name",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.efirstName ?text.efirstName:text.ifirstName ?text.ifirstName:"-" }</span> 
           },
      },
      {
        title: "Last Updated On",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.imodifiedOn ? getReadableDate(text.imodifiedOn) : text.emodifiedOn ? getReadableDate(text.emodifiedOn) : "-"}</span>  
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
        title: "Status",
        sorter: true,
        render: (text, record) => {
          return  <span style={{color:"#e56f00", background: "#fff4eb", padding: "3px"}}>Screening</span>
        },
      },
      {
        title: "Stage",
        sorter: true,
        render: (text, record) => {
          return  <span>Asssessment - English & General Knowledge Test</span>
        },
      },
      {
        title: "Upcoming Stage",
        sorter: true,
        render: (text, record) => {
          return  <span>Skill Interview</span>
        },
      },
      {
        title: "Applied On",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.edateOfApplicant ? moment(text.edateOfApplicant).format("ll") : text.idateOfApplicant ? moment(text.idateOfApplicant).format("ll") : "-"}</span>
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
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.externalId ? "External Recruiter" : "Internal Recruiter"}</span>
        },
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
        className: "text-center",
        render: (text, record) => (
          <div className="dropdow">
            <><a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="las la-bars"></i>
            </a>
              <div className="dropdown-menu dropdown-menu-right" style={{ padding: "5px" }}>
                {/* view */}
              
                   <Link className="dropdown-item" to={{ pathname: `applicantviewForm/${text.id}`, state: { text: text } }} style={{ color: "black" }}> <BsEyeFill /> View </Link>
                   <a className="dropdown-item" href="#"
                   onClick={() => {
                    this.setState({ applicantName: text && text.efirstName ? text.efirstName : text.ifirstName ? text.ifirstName : "-" })
                    this.setState({ happlicantMainId: text.id })
                    this.setState({ showScheduleForm: true })
                    this.setState({ isInternal: text.externalId ? "externalApplicant" : "internalApplicant" })
                    this.setState({ applicantId: text.externalId ? text.externalId : text.internalId })
                    this.setState({hiringManagerId: text.ehiringManagerId != null?text.ehiringManagerId : text.irecruiter != null? text.irecruiter : 0})
                  }}
                >
                  <BsFillBookFill/> Schedule</a>
                {/* Dropout */}
               {isCompanyAdmin &&<a className="dropdown-item" href="#"
                  onClick={() => {
                    this.handleStatusUpdate(text.externalId ? text.externalId : text.internalId, text.externalId ? "externalApplicant" : "internalApplicant", "DROPOUTS")
                  }}
                >
                  <BsFillTrashFill /> Dropout</a>}
                {/* On Hold */}
               {isCompanyAdmin && <a className="dropdown-item" href="#"
                  onClick={() => {
                    this.handleStatusUpdate(text.externalId ? text.externalId : text.internalId, text.externalId ? "externalApplicant" : "internalApplicant", "DRAFTS")
                      
                  }}
                >
                  <BsHourglassSplit /> On Hold</a>}
                {/* Dropout */}
             
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

            {/* schedule form */}
            <Modal enforceFocus={false} size={"lg"} show={this.state.showScheduleForm} onHide={this.hideScheduleForm} >
          <Header closeButton>
            <h5 className="modal-title">
              Schedule
            </h5>
          </Header>
          <Body>
            <HApplicantScheduleForm hideScheduleForm={this.hideScheduleForm} applicantId={this.state.applicantId} happlicantMainId={this.state.happlicantMainId} handleStatusUpdate={this.handleStatusUpdate} isInternal={this.state.isInternal} applicantName={this.state.applicantName} status= {"NEW"} hiringManagerId = {this.state.hiringManagerId}></HApplicantScheduleForm>

          </Body>
        </Modal>

      </div>
    );
  }
}
