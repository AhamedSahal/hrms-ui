import React, { Component } from "react";
import { Table } from "antd";
import { confirmAlert } from 'react-confirm-alert';
import { itemRender } from "../../../../paginationfunction"
import moment from "moment";
import { Modal, ButtonGroup } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { BsEyeFill,BsFillBookFill,BsFillTrashFill } from "react-icons/bs";
import { getReadableDate, getUserType } from "../../../../utility";
import { verifyOrgLevelViewPermission } from "../../../../utility";
import { saveHApplciantScreeningForms } from "../service";
import HApplicantScreeningForm from "./HApplicantScreeningForm";
import EmployeeListColumn from "../../../Employee/employeeListColumn";
import HApplicantScheduleForm from "./HApplicantScheduleForm/HApplicantScheduleForm";
import { getAllApplicant, saveHExternalApplicantForms, saveHInternalApplicantForms, saveHApplciantScheduleForms } from "../service"
import AccessDenied from "../../../../MainPage/Main/Dashboard/AccessDenied";


const { Header, Body, Footer, Dialog } = Modal;

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class ApplicantNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showForm: false,
      // change schedule form
      scheduleFormValue: 0,
      // show schedule form
      showScheduleForm: false,
      // online test ScheduleForm 
      applicantScheduleTestForm: {},
      // offline test form
      applicantScheduleOfflineForm: {},
      scheduleFormOffline: false,

      applicantName: "",
      applicantId: 0,
      happlicantMainId: 0,
      isInternal: "",
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      status: "NEW",
      selected: [],
      hiringManagerId: 0
    };
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    if(verifyOrgLevelViewPermission("Hire Applicants")){
    // get all applicant
  getAllApplicant(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.status).then(res => {
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

  hideForm = () => {
    this.setState({
      showForm: false
    })
  }

  hideScheduleForm = () => {
    this.setState({
      showScheduleForm: false
    })
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

  // Mark all to screening
  updateAll = (status) => {
    const { data } = this.state
    if (data && data.length > 0) {
      confirmAlert({
        title: `Send all to screening`,
        message: 'Are you sure, you want to send all to screening?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              this.setState({ applicantName: "All" })
              this.setState({ showForm: true })
              this.setState({ happlicantMainId: 0 })
              this.setState({ isInternal: "All" })
              this.setState({ applicantId: 0 })
            }
          },
          {
            label: 'No',
            onClick: () => { }
          }
        ]
      });
    }
  }

  // send all to schedule
  handleScheduleAllAlert = (status) => {
    const { data } = this.state
    if (data && data.length > 0) {
      confirmAlert({
        title: `Send all to Schedule`,
        message: 'Are you sure, you want to send all to Schedule?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              this.setState({ applicantName: "All" })
              this.setState({ happlicantMainId: 0 })
              this.setState({ showScheduleForm: true })
              this.setState({ isInternal: "All" })
              this.setState({ applicantId: 0 })
            }
          },
          {
            label: 'No',
            onClick: () => { }
          }
        ]
      });
    }
  }

  // send selected to schedule
  handleScheduleSelectedAlert = (status) => {
    const { data } = this.state
    if (data && data.length > 0) {
      confirmAlert({
        title: `Send selected to Schedule`,
        message: 'Are you sure, you want to send selected to Schedule?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              this.setState({ applicantName: "Seleted" })
              this.setState({ happlicantMainId: 0 })
              this.setState({ showScheduleForm: true })
              this.setState({ isInternal: "Seleted" })
              this.setState({ applicantId: 0 })
            }
          },
          {
            label: 'No',
            onClick: () => { }
          }
        ]
      });
    }
  }

  updateSelectedScreeningInfo = () => {
    const { data } = this.state
    if (data && data.length > 0) {
      confirmAlert({
        title: `Send Seleted to screening`,
        message: 'Are you sure, you want to send Seleted to screening?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              this.setState({ applicantName: "Seleted" })
              this.setState({ showForm: true })
              this.setState({ happlicantMainId: 0 })
              this.setState({ isInternal: "Seleted" })
              this.setState({ applicantId: 0 })
            }
          },
          {
            label: 'No',
            onClick: () => { }
          }
        ]
      });
    }

  }


  updateAllSchedule = (scheduledata, status) => {
    let { data } = this.state;
    this.setState({ showScheduleForm: false })
    let i =0;
    data.map((res, index) => {
      let len = data.length;
      let applicantId = res.externalId ? res.externalId : res.internalId;
      let isInternal = res.externalId ? "externalApplicant" : "internalApplicant";
      let scheduleFormParameter = { ...scheduledata, applicantId: res.id,internal : isInternal == "internalApplicant"?true:false }

      // api
      saveHApplciantScheduleForms(scheduleFormParameter)
        .then((res) => {
          if (res.status == "OK") {
            
          } else {
            toast.error(res.message);
          }
          if (res.status == "OK") {
            i++;
            this.handleStatusUpdate(applicantId, isInternal, status, len, i);
          }

        })
        .catch((err) => {
          toast.error("Error while saving Job");
        });
    })

  }


  // selected schedule
  updateSelectedSchedule = (scheduleData, status) => {
    let { data } = this.state;
    this.setState({ showScheduleForm: false })
    let index = 0;
    data.map((res) => {
      let len = this.state.selected.length;
      let validation = this.state.selected.indexOf(res.id);
      if (validation >= 0) {
        let applicantId = res.externalId ? res.externalId : res.internalId;
        let isInternal = res.externalId ? "externalApplicant" : "internalApplicant";
        let scheduleDataFormParameter = { ...scheduleData, applicantId: res.id,internal : isInternal == "internalApplicant"?true:false }
   
        // api
        saveHApplciantScheduleForms(scheduleDataFormParameter)
          .then((res) => {
            if (res.status == "OK") {
           
            } else {
              toast.error(res.message);
            }
            if (res.status == "OK") {
              index++;
              this.handleStatusUpdate(applicantId, isInternal, status, len, index);
            }

          })
          .catch((err) => {
            toast.error("Error while saving Job");
          });
      }
    })
  }

  updateSelectedScreening = (screeningData, status) => {
    let { data } = this.state;
    this.setState({ showForm: false })
 
    let index = 0;
    data.map((res) => {
      let validation = this.state.selected.indexOf(res.id)
      let len = this.state.selected.length;
      if (validation >= 0) {
        let applicantName = res.ifirstName ? res.ifirstName : res.efirstName;
        let applicantId = res.externalId ? res.externalId : res.internalId;
        let isInternal = res.externalId ? "externalApplicant" : "internalApplicant";
        let screeningFormParameter = { ...screeningData, applicantName: applicantName, applicantId: res.id }
    
        // api
        saveHApplciantScreeningForms(screeningFormParameter)
          .then((res) => {
            if (res.status == "OK") {
            
            } else {
              toast.error(res.message);
            }
            if (res.status == "OK") {
              index++;
              this.handleStatusUpdate(applicantId, isInternal, status, len, index);
            }

          })
          .catch((err) => {
            toast.error("Error while saving Job");
          });
      }
    })
  }

  updateStatus = (screeningData, status) => {
    let { data } = this.state;

    this.setState({ showForm: false })
    let i= 0;
    data.map(async (res, index) => {
      let len = data.length;
    
      let applicantName = res.ifirstName ? res.ifirstName : res.efirstName;
      let applicantId = res.externalId ? res.externalId : res.internalId;
      let isInternal = res.externalId ? "externalApplicant" : "internalApplicant";
      let screeningFormParameter = { ...screeningData, applicantName: applicantName, applicantId: res.id }
    
      // api
      await saveHApplciantScreeningForms(screeningFormParameter)
        .then(async (res) => {
          if (res.status == "OK") {
            // toast.success(res.message);
          } else {
            toast.error(res.message);
          }
          if (res.status == "OK") {
            i++
            await this.handleStatusUpdate(applicantId, isInternal, status, len, i);
          }

        })
        .catch((err) => {
          toast.error("Error while saving Job");
        });
    })

  }

  // mark to select
  onSelect = (data) => {
    let { selected } = this.state;
    let index = selected.indexOf(data.id);
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(data.id);
    }
    this.setState({ selected });
   
  }



  handleStatusUpdate = (id, message, status, length, index) => {
    let dataParameters = {
      id: id,
      status: status
    }
    if (message == "internalApplicant") {
      saveHInternalApplicantForms(dataParameters)
        .then((res) => {
          if (res.status == "OK" && length == index) {
          
            // toast.success(res.message);
          } else {
            // toast.error(res.message);
          }
          if (res.status == "OK" && length == index) {
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
          if (res.status == "OK" && length == index) {
            // toast.success(res.message);
          } else {
            // toast.error(res.message);
          }
          if (res.status == "OK" && length == index) {
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
        title: "Upcoming Stage",
        sorter: true,
        render: (text, record) => {
          return <span style={{ color: "#e56f00", background: "#fff4eb", padding: "3px" }}>Screening</span>
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
      // {
      //   title: "Recruiter Tagged",
      //   sorter: true,
      //   render: (text, record) => {
      //     return <span>{text && text.irecruiter ? <EmployeeListColumn id={text.irecruiter}></EmployeeListColumn> : "-"}</span>
      //   },
      // },
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
      // {
      //   title: "Last Worked At",
      //   sorter: true,
      //   render: (text, record) => {
      //     return <span>-</span>
      //   },
      // },
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
          <div>
            <input
              type="checkbox"
              checked={this.state.selected && this.state.selected.length > 0 && this.state.selected.indexOf(text.id) > -1}
              className="pointer"
              onClick={e => {
                this.onSelect(text);
              }}></input>
            <div className="dropdow">
              <><a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                <i className="las la-bars"></i>
              </a>
                <div className="dropdown-menu dropdown-menu-right" style={{ padding: "5px" }}>
                  {/* Send for screening */}
                  <a className="dropdown-item"
                    onClick={(e) => {
                      this.setState({ applicantName: text && text.efirstName ? text.efirstName : text.ifirstName ? text.ifirstName : "-" })
                      this.setState({ showForm: true })
                      this.setState({ happlicantMainId: text.id })
                      this.setState({ isInternal: text.externalId ? "externalApplicant" : "internalApplicant" })
                      this.setState({ applicantId: text.externalId ? text.externalId : text.internalId })
                    }}
                  >
                    <i className='fa fa-sticky-note'></i> Send for screening
                  </a>
                  {/* View */}
                
                    <Link className="dropdown-item"  to={`/app/company-app/hire/applicantviewForm/${text.id}`} state={text}  style={{ color: "black" }}> <BsEyeFill /> View </Link>
                 

                  {/* Schedule */}
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
                  <a className="dropdown-item" href="#"
                    onClick={() => {
                      this.handleStatusUpdate(text.externalId ? text.externalId : text.internalId, text.externalId ? "externalApplicant" : "internalApplicant", "DROPOUTS")
                    }}
                  >
                    <BsFillTrashFill /> Dropout</a>
                </div></>
            </div>
          </div>
        ),
      }

    ];
    return (
      <div className="page-container content container-fluid">
        <div className="form-group p-12 m-0 pb-2">
          <div className="row " >
            <div className="mt-3 col">
  
            </div>

            <div className='col-md-auto'  >
              {data && data.length > 0 && <ButtonGroup className='pull-right my-3'>
                <button
                  disabled={false}
                  className='markAll-btn btn-sm btn-outline-secondary mr-3'
                  onClick={() => {
                    this.updateAll('APPROVED');
                  }}>Mark All As Screening</button>
                <button
                  disabled={this.state.selected.length == 0}
                  className='markAll-btn btn-sm btn-outline-secondary mr-3'
                  onClick={() => {
                    this.updateSelectedScreeningInfo('REJECTED');
                  }}>Mark Selected As Screening</button>
                <button
                  disabled={false}
                  className='markAll-btn btn-sm btn-outline-secondary mr-3'
                  onClick={() => {
                    this.handleScheduleAllAlert('APPROVED');
                  }}>Mark All As Schedule</button>
                <button
                  disabled={this.state.selected.length == 0}
                  className='markAll-btn btn-sm btn-outline-secondary'
                  onClick={() => {
                    this.handleScheduleSelectedAlert('REJECTED');
                  }}>Mark Selected As Schedule</button>
              </ButtonGroup>}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="mt-3 mb-3 table-responsive" >
            {verifyOrgLevelViewPermission("Hire Applicants") && <Table
                id="Table-style"
                className="table-striped"
              
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

        {/* view form */}
        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
          <Header closeButton>
            <h5 className="modal-title">
              Send for screening
            </h5>
          </Header>
          <Body>
            <HApplicantScreeningForm applicantName={this.state.applicantName} applicantId={this.state.applicantId} isInternal={this.state.isInternal} handleStatusUpdate={this.handleStatusUpdate} hideForm={this.hideForm} happlicantMainId={this.state.happlicantMainId} updateStatus={this.updateStatus} updateSelectedScreening={this.updateSelectedScreening}></HApplicantScreeningForm>
          </Body>
        </Modal>

        {/* schedule form */}
        <Modal enforceFocus={false} size={"lg"} show={this.state.showScheduleForm} onHide={this.hideScheduleForm} >
          <Header closeButton>
            <h5 className="modal-title">
              Schedule
            </h5>
          </Header>
          <Body>
            <HApplicantScheduleForm hideScheduleForm={this.hideScheduleForm} applicantId={this.state.applicantId} happlicantMainId={this.state.happlicantMainId} handleStatusUpdate={this.handleStatusUpdate} isInternal={this.state.isInternal} applicantName={this.state.applicantName} updateAllSchedule={this.updateAllSchedule} updateSelectedSchedule={this.updateSelectedSchedule} status={this.state.status} hiringManagerId= {this.state.hiringManagerId}></HApplicantScheduleForm>

          </Body>
        </Modal>

      </div>
    );
  }
}
