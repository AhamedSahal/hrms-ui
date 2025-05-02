import React, { Component } from "react";
import { Table } from "antd";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { itemRender } from "../../../../../paginationfunction";
import { toast } from "react-toastify";
import { getScheduleListbyAplicant } from "../../service";
import { BsLink45Deg } from "react-icons/bs";
import { getUserType,getEmployeeId } from "../../../../../utility";
import EvaluatingForm from "./EvaluateForm/EvaluatingForm"
import EmployeeListColumn from "../../../../Employee/employeeListColumn";

const { Header, Body, Footer, Dialog } = Modal;
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class HApplicantSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applicantInformation: props.applicantInformation,
      data: [],
      showForm: false,
      job: [],
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
    }
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    getScheduleListbyAplicant(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.applicantInformation.id).then(res => {
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

  hideForm = () => {
    this.setState({
      showForm: false
    })
    this.props.redirectToList();
    // window.location.reload();
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
    const { data, totalPages, totalRecords, currentPage, size,applicantInformation } = this.state;
    let startRange = (currentPage - 1) * size + 1;
    let endRange = currentPage * (size + 1) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const columns = [
      {
        title: "Date",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.startDate ? moment(text.startDate).format("ll") : "-"}</span>
        },
      },

      {
        title: "Interviewer/Reviewer",
        sorter: true,
        render: (text, record) => {
          return <span>{text.reviewer != null?<EmployeeListColumn id={text.reviewer?.id} name={text.reviewer?.name}></EmployeeListColumn>:"-"}</span>
        },
      },
      {
        title: "Interview Stages",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.interviewStages ? text.interviewStages == 1 ? "Asssessment - English & General Knowledge Test-Test" : text.interviewStages == 2 ? "Skill Interview-Interview" : text.interviewStages == 3 ? "Behavioural Interview-Interview" : text.interviewStages == 4 ? "HR Interview-Interview" : text.interviewStages == 5 ? "Skill Test-Test" : "-" : "-"}</span>
        },
      },
      {
        title: "Round No",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.interviewStages ? text.interviewStages : "-"}</span>
        },
      },
      {
        title: "Status",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.status == 0 ? <span style={{background: "#fff4eb",color: "#e56f00", padding: "2px"}}>Scheduled</span> : text.status == 1?<span style={{background: "#effbf6",color: "#2db87f", padding: "2px"}}>Completed</span>:"-"}</span>
        },
      },
      {
        title: "Link",
        sorter: true,
        render: (text, record) => {
          return <span>{ text && text.testLink != null?<a href={text.testLink}><BsLink45Deg /></a>:"-"}</span>
        },
      },
      {
        title: 'Action',
        width: 50,
        className: "text-center",
        render: (text, record) => (
          text.status != 1 &&
          <div className="dropdow">
            <><a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="las la-bars"></i>
            </a>
              <div className="dropdown-menu dropdown-menu-right" style={{ padding: "5px" }}>
               {(isCompanyAdmin || text.reviewer?.id == getEmployeeId() || text.hiringManagerId == getEmployeeId() ) && <a className="dropdown-item" href="#"
                  onClick={() => {
                    this.setState({ happlicantMainId: this.state.applicantInformation.id })
                    this.setState({ showForm: true })
                    this.setState({scheduleInfo: text})
                    this.setState({ externalJobId: this.state.applicantInformation.ejobId })
                    this.setState({ isInternal: this.state.applicantInformation.externalId ? "External Applicant" : "Internal Applicant" })
                    this.setState({ applicantName: this.state.applicantInformation && this.state.applicantInformation.efirstName ? this.state.applicantInformation.efirstName : this.state.applicantInformation.ifirstName ? this.state.applicantInformation.ifirstName : "-" })
                  }}
                >
                  <b>Evaluate</b></a>}
              </div>
            </>
          </div>
      
        )
      }
    ]

    return (
      <div>
            <div className="row" style={{paddingLeft: "17px"}}>
                    <div className="col-md-8">
                        <div className="row"  style={{ border: "2px solid #E7ECF2" }}>
                    <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Applicant Name</label>
                                <h5>
                                    <span style={{ padding: "2px", background: "#F2F5F8", borderRadius: "6px" }}>{applicantInformation && applicantInformation.efirstName ? applicantInformation.efirstName : applicantInformation.ifirstName ? applicantInformation.ifirstName : "-"}</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Email</label>
                                <h5>
                                    <span>{applicantInformation && applicantInformation.eemail ? applicantInformation.eemail : applicantInformation.iemail ? applicantInformation.iemail : "-"}</span>
                                </h5>
                            </div>
                            </div>
                    </div>
                </div>
                <br />
      <div className="page-container content container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="mt-3 mb-3 table-responsive">
              <Table
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
              />
            </div>
          </div>
        </div>

        
        {/* view form */}
        <Modal enforceFocus={false} size={"lg"} show={this.state.showForm} onHide={this.hideForm} >
        <Header closeButton>
            <h5 className="modal-title">
              Score
            </h5>
          </Header>
          <Body>
            <EvaluatingForm hideForm={this.hideForm} applicantName={this.state.applicantName} isInternal={this.state.isInternal} happlicantMainId={this.state.happlicantMainId} externalJobId ={this.state.externalJobId} scheduleInfo = {this.state.scheduleInfo}></EvaluatingForm>
          </Body>
        </Modal> 
      </div>
      </div>
    )
  }
}