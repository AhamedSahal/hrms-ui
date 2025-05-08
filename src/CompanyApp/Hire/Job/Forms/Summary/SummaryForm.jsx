import React, { Component } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveHireForms, saveApplicantMasForm } from "../../service";
import { BsFillCaretDownFill } from "react-icons/bs";
import { getDepartmentInformation } from "../../../../ModuleSetup/Department/service";
import { getDivisionInformationById } from "../../../../Organisationchart/Division/service";
import { getBranchInformation } from "../../../../ModuleSetup/Branch/service";
import { getPersonalInformation } from "../../../../Employee/detail/service";
import { BsClipboardCheck,BsArchive } from "react-icons/bs";

export default class SummaryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobProfile: props.jobProfile || {},
      jobDescription: props.jobDescription || {},
      RecruitmentSetting: props.RecruitmentSetting || {},
      JobDistribution: props.JobDistribution || {},
      SystemFields: props.SystemFields || {},
      totalCandidateInfo: [],
      divisionName: "-",
      branchName: "-",
      departmentName: "-",
      hiringManagerName: "-",
      recruiterName: "-"

    };
  }

  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    const { jobProfile,RecruitmentSetting } = this.state;
    // division
    if (jobProfile.divisionId) {
      getDivisionInformationById(jobProfile.divisionId).then((res) => {
        if (res.status == "OK") {
         this.setState({divisionName: res.data.name})
        }
      });
    }
     // department
    if (jobProfile.departmentId) {
      getDepartmentInformation(jobProfile.departmentId).then((res) => {
        if (res.status == "OK") {
          this.setState({departmentName: res.data.name})
        }
      });
    }
       // branch
       if (jobProfile.branchId) {
        getBranchInformation(jobProfile.branchId).then((res) => {
          if (res.status == "OK") {
            this.setState({branchName: res.data.name})
          }
        });
      }
      // hiring
      if (RecruitmentSetting.hiringManagerId) {
        getPersonalInformation(RecruitmentSetting.hiringManagerId).then((res) => {
          if (res.status == "OK") {
               this.setState({hiringManagerName: res.data.name})
          }
        });

      }
       // Recruiter
       if (RecruitmentSetting.RecruiterId) {
        getPersonalInformation(RecruitmentSetting.RecruiterId).then((res) => {
          if (res.status == "OK") {
               this.setState({recruiterName: res.data.name})
          }
        });

      }
  };

  handleEditForm = (num) => {
    this.props.selectedForm(num);
  };

  handlePrevious = () => {
    this.props.previous();
  };

  handleParameters = (active) => {
    const {jobProfile,jobDescription,RecruitmentSetting,JobDistribution,SystemFields,totalCandidateInfo} = this.state;
    this.setState({
      totalCandidateInfo: [
        ...SystemFields.systemField,
        ...SystemFields.CustomField,
      ],
    });
    let mustSkils = "";
    let goodSkills="";
    let evaluationParameter = "";
    if (jobDescription.name.length > 0) {
      jobDescription.name.map((res, i) => {
        mustSkils = mustSkils + (i === 0 ? res : "," + res);
      });
    }
    if (jobDescription.skills.length > 0) {
      jobDescription.skills.map((res, i) => {
        goodSkills = goodSkills + (i === 0 ? res : "," + res);
      });
    }
    if (RecruitmentSetting.evaluationParameter.length > 0) {
      RecruitmentSetting.evaluationParameter.map((res, i) => {
        evaluationParameter = evaluationParameter + (i === 0 ? res : "," + res);
      });
    }

    let paramData = {
      // jobProfile
      id : 0,
      jobCode: jobProfile.jobCode ? jobProfile.jobCode : "",
      jobTitle: jobProfile.jobTitle ? jobProfile.jobTitle : "",
      division: jobProfile.divisionId ? jobProfile.divisionId : 0,
      department: jobProfile.departmentId ? jobProfile.departmentId : 0,
      employmentType: jobProfile.employmentType ? jobProfile.employmentType : 0,
      branch: jobProfile.branchId ? jobProfile.branchId : 0,
      workplaceType: jobProfile.workplaceType ? jobProfile.workplaceType : 0,
      experienceLevel: jobProfile.experienceLevel? jobProfile.experienceLevel: 0,
      // JobDistribution
      jobType: JobDistribution.jobType ? JobDistribution.jobType  : false,
      // jobDescription
      qualification: jobDescription.qualification? jobDescription.qualification: "",
      mustSkils: mustSkils,
      goodSkills: goodSkills,
      // RecruitmentSetting
      jobOfferPrivate: RecruitmentSetting.active ? true : false,
      hiringManager: RecruitmentSetting.hiringManagerId? RecruitmentSetting.hiringManagerId: 0,
      recruiter: RecruitmentSetting.RecruiterId? RecruitmentSetting.RecruiterId: 0,
      noOfOpenings: RecruitmentSetting.noOfOpenings? RecruitmentSetting.noOfOpenings: 0,
      openingDate: RecruitmentSetting.openingDate? RecruitmentSetting.openingDate: "",
      expiryDate: RecruitmentSetting.expiryDate? RecruitmentSetting.expiryDate: "",
      evaluationScale: RecruitmentSetting.evaluationScale? RecruitmentSetting.evaluationScale: 0,
      esParameter1: RecruitmentSetting.esParameter1 ? RecruitmentSetting.esParameter1 : "",
      esParameter2: RecruitmentSetting.esParameter2 ? RecruitmentSetting.esParameter2 : "",
      esParameter3: RecruitmentSetting.esParameter3 ? RecruitmentSetting.esParameter3 : "",
      esParameter4: RecruitmentSetting.esParameter4 ? RecruitmentSetting.esParameter4 : "",
      esParameter5: RecruitmentSetting.esParameter5 ? RecruitmentSetting.esParameter5 : "",
      esParameter6: RecruitmentSetting.esParameter6 ? RecruitmentSetting.esParameter6 : "",
      esParameter7: RecruitmentSetting.esParameter7 ? RecruitmentSetting.esParameter7 : "",
      esParameter8: RecruitmentSetting.esParameter8 ? RecruitmentSetting.esParameter8 : "",
      esParameter9: RecruitmentSetting.esParameter9 ? RecruitmentSetting.esParameter9 : "",
      esParameter10: RecruitmentSetting.esParameter10? RecruitmentSetting.esParameter10: "",
      evaluationParameter: evaluationParameter,
      isActive: active,
    };
    return paramData;
  };

  handleSave = (active) => {
    let paramData = this.handleParameters(active);
    saveHireForms(paramData)
      .then((res) => {
        if (res.status == "OK") {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
        if (res.status == "OK") {
          this.candiateDetails(res.data.id);
        }
      })
      .catch((err) => {
        toast.error("Error while saving Job");
      });
  };

  candiateDetails = (jobId) => {
    const { totalCandidateInfo } = this.state;
    totalCandidateInfo.map((res, i) => {
      let parameterData = {
         id: 0,
        name: res.name,
        applicantId: res.applicant.id,
        required: res.required,
        customFieldId: res.customFieldId ? res.customFieldId : 0,
        systemFieldId: res.systemFieldId ? res.systemFieldId : 0,
        jobId: jobId,
        active: res.active
      };
      saveApplicantMasForm(parameterData)
        .then((res) => {
          if (res.status == "OK") {
          } else {
            toast.error(res.message);
          }
          if (res.status == "OK" && totalCandidateInfo.length - 1 === i) {
            toast.success(res.message);
            setTimeout(function () {
              window.location.reload()
            }, 6000)
          }
        })
        .catch((err) => {
          toast.error("Error while saving JobApplicantFied");
        });
    });
  };

  render() {
    const {jobProfile,jobDescription,RecruitmentSetting,JobDistribution,SystemFields} = this.state;
    let systemFieldBoolean = true;
    let CustomFieldBoolean = true;
    return (
      <div style={{ padding: "15px", background: "white" }}>
        <h3>
          <BsClipboardCheck size={30} style={{ color: "#1DA8D5" }} /> Summary</h3>
        <hr />
        <br />
        <div>
          <div className="row">
            <div className="col-md-12">
              <button className="collaps-btn">
                <a
                  className="collapstag"
                  data-bs-toggle="collapse"
                  href="#collapseExample"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                >
                  <div className="row">
                    <div className="col-md-10">
                      <p className="collapse-para">Job Details</p>
                    </div>
                    <div
                      className="col-md-2"
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                      }}
                    >
                      <BsFillCaretDownFill
                        size={15}
                        style={{ color: "black" }}
                      />
                    </div>
                  </div>
                </a>
              </button>
            </div>
          </div>
          <div className="collapse" id="collapseExample">
            <div className="card card-body">
              <div className="row">
                <div className="col-md-10">
                  <p className="collapse-inner-head">Job Details</p>
                </div>
                <div className="col-md-2 collapse-edit-btn-div">
                  <button
                    className="collapse-edit-btn"
                    onClick={(e) => {
                      this.handleEditForm(0);
                    }}
                  >
                    {" "}
                    <i className="fa fa-edit rosterEditIcon"> </i>
                  </button>
                </div>
              </div>
              <hr style={{ color: "#e3e3e3" }} />
              {/* body */}
              <div className="row">
                <div className="col-md-4">
                  <label>Job Code</label>
                  <p className="jobSummary_text">{jobProfile.jobCode ? jobProfile.jobCode : "-"}</p>
                </div>
                <div className="col-md-4">
                  <label>Division</label>
                  <p className="jobSummary_text">
                    {this.state.divisionName }
                  </p>
                </div>
                <div className="col-md-4">
                  <label>Job Title</label>
                  <p className="jobSummary_text">{jobProfile.jobTitle ? jobProfile.jobTitle : "-"}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <label>Deparment</label>
                  <p  className="jobSummary_text">
                    {this.state.departmentName}
                  </p>
                </div>
                <div className="col-md-4">
                  <label>Employee Type</label>
                  <p className="jobSummary_text">
                    {jobProfile.employmentType? jobProfile.employmentType == 1 ? "Full Time" : jobProfile.employmentType == 2 ? "Probation" : jobProfile.employmentType == 3  ? "Intern" : jobProfile.employmentType == 4 ? "Contrac" : jobProfile.employmentType == 5 ? "Part Time" : "-" : "-"}
                  </p>
                </div>
                <div className="col-md-4">
                  <label>Experience Level</label>
                  <p className="jobSummary_text">
                    {jobProfile.experienceLevel? jobProfile.experienceLevel: "-"}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>Location</label>
                  <p className="jobSummary_text">{this.state.branchName}</p>
                </div>
                <div className="col-md-6">
                  <label>Workplace Type</label>
                  <p className="jobSummary_text">
                    {jobProfile.workplaceType? jobProfile.workplaceType == 1? "Remote": jobProfile.workplaceType == 2? "Onsite": jobProfile.workplaceType == 3? "Hybrid": "-": "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <br />
          {/* job distribution */}
          <div className="row">
            <div className="col-md-12">
              <button className="collaps-btn">
                <a
                  className="collapstag"
                  data-bs-toggle="collapse"
                  href="#collapseExample"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                >
                  <div className="row">
                    <div className="col-md-10">
                      <p className="collapse-para">Job Distribution</p>
                    </div>
                    <div
                      className="col-md-2"
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                      }}
                    >
                      <BsFillCaretDownFill
                        size={15}
                        style={{ color: "black" }}
                      />
                    </div>
                  </div>
                </a>
              </button>
            </div>
          </div>

          {/* body */}
          <div className="collapse" id="collapseExample">
            <div className="card card-body">
              <div className="row">
                <div className="col-md-10">
                  <p className="collapse-inner-head">Job Distribution</p>
                </div>
                <div className="col-md-2 collapse-edit-btn-div">
                  <button
                    className="collapse-edit-btn"
                    onClick={(e) => {
                      this.handleEditForm(0.5);
                    }}
                  >
                    {" "}
                    <i className="fa fa-edit rosterEditIcon"> </i>
                  </button>
                </div>
              </div>
              <hr style={{ color: "#e3e3e3" }} />
              <div className="row">
                <div className="col-md-6">
                  <label>External Job</label>
                  <p  className="jobSummary_text">
                    {JobDistribution
                      ? JobDistribution.jobType
                        ? "True"
                        : "False"
                      : "-"}
                  </p>
                </div>
                <div className="col-md-6">
                  <label>Internal Job</label>
                  <p  className="jobSummary_text">
                    {jobProfile
                      ? JobDistribution.jobType
                        ? "False"
                        : "True"
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        {/* Job Description */}
        <div>
          <div className="row">
            <div className="col-md-12">
              <button className="collaps-btn">
                <a
                  className="collapstag"
                  data-bs-toggle="collapse"
                  href="#Description"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                >
                  <div className="row">
                    <div className="col-md-10">
                      <p className="collapse-para">Description</p>
                    </div>
                    <div
                      className="col-md-2"
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                      }}
                    >
                      <BsFillCaretDownFill
                        size={15}
                        style={{ color: "black" }}
                      />
                    </div>
                  </div>
                </a>
              </button>
            </div>
          </div>
          <div className="collapse" id="Description">
            <div className="card card-body">
              <div className="row">
                <div className="col-md-10">
                  <p className="collapse-inner-head">Description</p>
                </div>
                <div className="col-md-2 collapse-edit-btn-div">
                  <button
                    className="collapse-edit-btn"
                    onClick={(e) => {
                      this.handleEditForm(1);
                    }}
                  >
                    {" "}
                    <i className="fa fa-edit rosterEditIcon"> </i>
                  </button>
                </div>
              </div>
              <hr style={{ color: "#e3e3e3" }} />
              {/* body */}
              <div className="row">
                <div className="col-md-6">
                  <label>Qualification</label>
                  <p  className="jobSummary_text">
                    {jobDescription.qualification
                      ? jobDescription.qualification
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>Must Have Skills</label>
                  <p  className="jobSummary_text">
                    {jobDescription.name.length > 0
                      ? jobDescription.name.map((res, i) => (
                          <span>
                            {i !== 0 ? "," : null}
                            {res}
                          </span>
                        ))
                      : "-"}
                  </p>
                </div>
                <div className="col-md-6">
                  <label>Good to have skills</label>
                  <p  className="jobSummary_text">
                    {jobDescription.skills.length > 0
                      ? jobDescription.skills.map((res, i) => (
                          <span>
                            {i !== 0 ? "," : null}
                            {res}
                          </span>
                        ))
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        {/* Recruitment form */}

        <div>
          <div className="row">
            <div className="col-md-12">
              <button className="collaps-btn">
                <a
                  className="collapstag"
                  data-bs-toggle="collapse"
                  href="#Recruitment"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                >
                  <div className="row">
                    <div className="col-md-10">
                      <p className="collapse-para">Recruitment Settings</p>
                    </div>
                    <div
                      className="col-md-2"
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                      }}
                    >
                      <BsFillCaretDownFill
                        size={15}
                        style={{ color: "black" }}
                      />
                    </div>
                  </div>
                </a>
              </button>
            </div>
          </div>
          <div className="collapse" id="Recruitment">
            <div className="card card-body">
              <div className="row">
                <div className="col-md-10">
                  <p className="collapse-inner-head">Recruitment Settings</p>
                </div>
                <div className="col-md-2 collapse-edit-btn-div">
                  <button
                    className="collapse-edit-btn"
                    onClick={(e) => {
                      this.handleEditForm(2);
                    }}
                  >
                    {" "}
                    <i className="fa fa-edit rosterEditIcon"> </i>
                  </button>
                </div>
              </div>
              <hr style={{ color: "#e3e3e3" }} />
              {/* body */}
              <div className="row">
                <div className="col-md-6">
                  <label>Hiring Manager</label>
                  <p  className="jobSummary_text">
                    {this.state.hiringManagerName}
                  </p>
                </div>
                <div className="col-md-6">
                  <label>Recruiter Tagged</label>
                  <p  className="jobSummary_text">
                    {this.state.recruiterName}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <label>No of Openings</label>
                  <p  className="jobSummary_text">
                    {RecruitmentSetting.noOfOpenings
                      ? RecruitmentSetting.noOfOpenings
                      : "-"}
                  </p>
                </div>
                <div className="col-md-4">
                  <label>Opening Date</label>
                  <p  className="jobSummary_text">
                    {RecruitmentSetting
                      ? moment(RecruitmentSetting.openingDate).utc().format("MM-DD-YYYY"): "-"}
                  </p>
                </div>
                <div className="col-md-4">
                  <label> Expiry Date</label>
                  <p  className="jobSummary_text">
                    {RecruitmentSetting
                      ? moment(RecruitmentSetting.expiryDate).utc().format("MM-DD-YYYY"): "-"}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <label>Evaluate Candidates</label>
                  <p className="jobSummary_text">
                    {RecruitmentSetting.evaluationParameter.length > 0
                      ? RecruitmentSetting.evaluationParameter.map((res, i) => (
                          <span>
                            {i !== 0 ? "," : null}
                            {res}
                          </span>
                        ))
                      : "-"}
                  </p>
                </div>
                <div className="col-md-4">
                  <label>Screening Automation</label>
                  <p className="jobSummary_text">
                    {RecruitmentSetting
                      ? RecruitmentSetting.screeningAutomation
                        ? "True"
                        : "False"
                      : "-"}
                  </p>
                </div>
                <div className="col-md-4">
                  <label>Active</label>
                  <p className="jobSummary_text">
                    {RecruitmentSetting
                      ? RecruitmentSetting.active
                        ? "True"
                        : "False"
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        {/* Candidate fields */}
        <div>
          <div className="row">
            <div className="col-md-12">
              <button className="collaps-btn">
                <a
                  className="collapstag"
                  data-bs-toggle="collapse"
                  href="#CandidateField"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                >
                  <div className="row">
                    <div className="col-md-10">
                      <p className="collapse-para">Candidate Fields</p>
                    </div>
                    <div
                      className="col-md-2"
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                      }}
                    >
                      <BsFillCaretDownFill
                        size={15}
                        style={{ color: "black" }}
                      />
                    </div>
                  </div>
                </a>
              </button>
            </div>
          </div>
          {/* body */}
          <div className="collapse" id="CandidateField">
            <div className="card card-body">
              {/* edit */}
              <div className="row">
                <div className="col-md-10">
                  <p className="collapse-inner-head">Candidate Fields</p>
                </div>
                <div className="col-md-2 collapse-edit-btn-div">
                  <button
                    className="collapse-edit-btn"
                    onClick={(e) => {
                      this.handleEditForm(3);
                    }}
                  >
                    {" "}
                    <i className="fa fa-edit rosterEditIcon"> </i>
                  </button>
                </div>
              </div>
              <hr style={{ color: "#e3e3e3" }} />
              {SystemFields.applicantField.length > 0
                ? SystemFields.applicantField.map((applicantFieldresponse) => (
                    <div className="row">
                       {systemFieldBoolean = true}
                       {CustomFieldBoolean = true}
                      <h5>{applicantFieldresponse.fieldName}</h5>
                      <div className="col-md-6">
                        <table className="systemfieldTable">
                          {/* head */}
                          <tr>
                            <th style={{ textAlign: "left" }}>
                              <h4>System Fields</h4>
                            </th>
                            <th style={{ textAlign: "Right" }}>
                              <h4>Required</h4>
                            </th>
                          </tr>
                          {/* body */}
                          {SystemFields.systemField.length > 0
                            ? SystemFields.systemField.map(
                                (SystemFieldResponse,index) =>
                                  SystemFieldResponse.applicant.id ===
                                  applicantFieldresponse.id ? (
                                    <tr>
                                      {systemFieldBoolean = false}
                                      <td style={{ textAlign: "left" }}>
                                        {SystemFieldResponse.name}
                                      </td>
                                      <td style={{ textAlign: "Right" }}>
                                        {SystemFieldResponse.required
                                          ? "True"
                                          : "False"}
                                      </td>
                                    </tr>
                                  ) : systemFieldBoolean && index === SystemFields.systemField.length-1 && <label style={{display:"flex",justifyContent:"end"}}>No Data Found</label>
                              )
                            : null}
                        </table>
                      </div>

                      <div className="col-md-6">
                        <table className="systemfieldTable">
                          {/* head */}
                          <tr>
                            <th style={{ textAlign: "left" }}>
                              <h4>Custom Fields</h4>
                            </th>
                            <th style={{ textAlign: "Right" }}>
                              <h4>Required</h4>
                            </th>
                          </tr>
                          {/* body */}
                          {SystemFields.CustomField.length > 0
                            ? SystemFields.CustomField.map(
                                (customFieldResponse,index) =>
                                  customFieldResponse.applicant.id ===
                                  applicantFieldresponse.id ? (
                                    <tr>
                                      {CustomFieldBoolean = false}
                                      <td style={{ textAlign: "left" }}>
                                        {customFieldResponse.name}
                                      </td>
                                      <td style={{ textAlign: "Right" }}>
                                        {customFieldResponse.required
                                          ? "True"
                                          : "False"}
                                      </td>
                                    </tr>
                                  ) : CustomFieldBoolean && index === SystemFields.CustomField.length-1 && <label style={{display:"flex",justifyContent:"end"}}>No Data Found</label>
                              )
                            : null}
                        </table>
                      </div>
                    </div>
                  ))
                : null}

              {/* e */}
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-6">
          <input
              type="submit"
              className="btn btn-light hire-close"
              value={`Save as draft`}
              style={{width: "auto"}}
              onClick={(e) => {this.handleSave(1)}}
            />
          </div>
          <div
            className="col-md-6"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <input
              onClick={this.handlePrevious}
              className="btn hire-next-btn"
              value="&larr;"
              style={{ width: "50px", marginRight: "5px" }}
            />
            <input
              type="submit"
              className="btn hire-next-btn"
              value={`Publish `}
              onClick={(e) => {this.handleSave(0)}}
            />
          </div>
        </div>
      </div>
    );
  }
}
