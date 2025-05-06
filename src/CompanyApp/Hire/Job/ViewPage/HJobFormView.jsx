import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BsFillPencilFill, BsFillCaretDownFill } from "react-icons/bs";
import HSourceTypeDropdown from "../../../ModuleSetup/Dropdown/HSourceTypeDropdown";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FormGroup } from "reactstrap";
import { Table } from "antd";
import { itemRender } from "../../../../paginationfunction";
import moment from "moment";
import { Modal } from "react-bootstrap";
import HireInformationForm from "../form";
import { toast } from "react-toastify";
import {
  saveHireJobLiknForm,
  getJobLinkInfo,
  getHireJobApplicantField,
  getApplicantInfo,
  getCustomFieldInfo,
  getSystemFieldInfo,
  getJobInfoCandidate,
} from "../service";
import JobProfileForm from "../Forms/DefineForms/JobProfileForm";
import JobDistribution from "../Forms/DefineForms/JobDistribution";
import JobDescriptionForm from "../Forms/Description/JobDescriptionForm";
import RecruitmentSetting from "../Forms/Recruitment settings/RecruitmentSetting";
import SystemFields from "../Forms/Applicant Field/SystemFields";
import { getAPIUrl } from "../../../../HttpRequest";

const HJobFormView = () => {
  const location = useLocation();
  const [state, setState] = useState({
    jobView: location.state.text || {},
    activeJob: location.state.text.isActive,
    jobApplicantFieldData: [],
    systemField: [],
    CustomField: [],
    viewCondition: true,
    data: [],
    showForm: false,
    openForm: 0,
    job: [],
    q: "",
    page: 0,
    size: 10,
    sort: "id,desc",
    totalPages: 0,
    totalRecords: 0,
    currentPage: 1,
    jobApplicantField: [],
    applicantField: [],
  });

  console.log("cell ---state", location);
  

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = () => {
    let id = Number(state.jobView.id);

    getJobLinkInfo(state.q, state.page, state.size, state.sort, id).then((res) => {
      if (res.status === "OK") {
        setState((prevState) => ({
          ...prevState,
          data: res.data.list,
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage + 1,
        }));
      }
    });

    getHireJobApplicantField(state.q, state.page, state.applicantSize, state.sort, id).then((res) => {
      if (res.status === "OK") {
        setState((prevState) => ({ ...prevState, jobApplicantField: res.data.list }));
      }
    });

    getApplicantInfo().then((res) => {
      if (res.status === "OK") {
        setState((prevState) => ({ ...prevState, applicantField: res.data }));
      }
    });

    getSystemFieldInfo().then((res) => {
      if (res.status === "OK") {
        setState((prevState) => ({ ...prevState, systemField: res.data }));
      }
    });

    getCustomFieldInfo().then((res) => {
      if (res.status === "OK") {
        setState((prevState) => ({ ...prevState, CustomField: res.data }));
      }
    });
  };

  const onTableDataChange = (d, filter, sorter) => {
    setState((prevState) => ({
      ...prevState,
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.field},${sorter.order === "ascend" ? "asc" : "desc"}` : prevState.sort,
    }));
    fetchList();
  };

  const pageSizeChange = (currentPage, pageSize) => {
    setState((prevState) => ({ ...prevState, size: pageSize, page: 0 }));
    fetchList();
  };

  const hideForm = () => {
    setState((prevState) => ({ ...prevState, showForm: false }));
    window.location.reload();
  };

  const handleEditForm = (data) => {
    const { jobView } = state;
    if (data === 3) {
      let mustskillConcat = jobView.mustSkils + ",";
      let goodskillConcat = jobView.goodSkills + ",";
      let name = mustskillConcat.split(",");
      let skills = goodskillConcat.split(",");
      name.pop();
      skills.pop();
      let output = { ...jobView, name: name, skills: skills };
      setState((prevState) => ({ ...prevState, jobView: output }));
    }
    if (data === 4) {
      let evaluationParameterConcat = jobView.evaluationParameter + ",";
      let evaluationParameter = evaluationParameterConcat.split(",");
      evaluationParameter.pop();
      let output = {
        ...jobView,
        evaluationParameter: evaluationParameter,
        evaluationParameters: jobView.evaluationScale > 0 ? true : false,
      };
      setState((prevState) => ({ ...prevState, jobView: output }));
    }

    setState((prevState) => ({ ...prevState, showForm: true, openForm: data }));
  };

  const previousPage = () => {
    setState((prevState) => ({ ...prevState, showForm: false }));
  };

  const handleJobApplicantEditForm = (data) => {
    const { jobApplicantField, applicantField, CustomField, systemField } = state;
    let customFieldParam = [];
    let systemFieldParam = [];

    jobApplicantField.forEach((jobApplicantdata) => {
      systemField.forEach((systemFieldData) => {
        if (jobApplicantdata.systemFieldId === systemFieldData.id) {
          let systemFieldDataValue = {
            ...systemFieldData,
            required: jobApplicantdata.required,
            jobApplicantId: jobApplicantdata.id,
            active: jobApplicantdata.active,
          };
          systemFieldParam.push(systemFieldDataValue);
        }
      });
    });

    jobApplicantField.forEach((jobApplicantdata) => {
      CustomField.forEach((customFieldData) => {
        if (jobApplicantdata.customFieldId === customFieldData.id) {
          let customFieldDataValue = {
            ...customFieldData,
            required: jobApplicantdata.required,
            jobApplicantId: jobApplicantdata.id,
            active: jobApplicantdata.active,
          };
          customFieldParam.push(customFieldDataValue);
        }
      });
    });

    let datas = {
      CustomField: customFieldParam,
      systemField: systemFieldParam,
      applicantField: applicantField,
      flag: false,
      hireJobId: state.jobView.id,
    };
    setState((prevState) => ({ ...prevState, jobApplicantFieldData: datas, showForm: true, openForm: data }));
  };

  const save = (data, action) => {
    let linkData = {
      jobId: data.id,
      expiryDate: data.expiryDate,
      sourceName: data.sourceName,
      sourceType: data.sourceType,
    };

    saveHireJobLiknForm(linkData)
      .then((res) => {
        if (res.status === "OK") {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
        if (res.status === "OK") {
          fetchList();
        }
      })
      .catch(() => {
        toast.error("Error while saving Job Link");
      });
  };

  const {
    jobView,
    openForm,
    jobApplicantField,
    applicantField,
    activeJob,
    data,
    totalPages,
    totalRecords,
    currentPage,
    size,
  } = state;

  let systemFieldBoolean = true;
  let CustomFieldBoolean = true;
  let startRange = (currentPage - 1) * size + 1;
  let endRange = currentPage * (size + 1) - 1;
  if (endRange > totalRecords) {
    endRange = totalRecords;
  }

  const columns = [
    {
      title: "Source Type",
      sorter: true,
      render: (text) => {
        return <span>{text.hSourceTypeEntity.name}</span>;
      },
    },
    {
      title: "Source Name",
      dataIndex: "sourceName",
      sorter: true,
    },
    {
      title: "Link",
      sorter: true,
      render: (text) => {
        let url = window.location.href;
        let splitUrl = url.split("/app");
        return <span>{<a>{`${splitUrl[0]}/hire/candidateinfo/${text.hJobEntity.id}/${text.url}`}</a>}</span>;
      },
    },
  ];

  return (
    <div style={{ backgroundColor: "#f5f5f5", margin: "50px", padding: "20px" }} className="page-wrapper">
      <h1>{jobView.jobTitle}-#{jobView.jobCode}</h1>
      {/* parent row 1 */}
      <div className="row">
        {/* Job Details */}
        <div className="col-md-6" style={{ border: "2px solid #E7ECF2" }}>
          {/* head */}
          <div
            className="row"
            style={{ padding: "10px 0 10px 0", background: "#F7F9FA" }}
          >
            <div className="col-md-10">
              <h4>Job Details</h4>
            </div>
            <div className="col-md-2">
              {activeJob == 0?
               <button
               className="collapse-edit-btn"
               style={{ background: "none" }}
               onClick={(e) => {
                 handleEditForm(1);
               }}
             >
               {" "}
               <BsFillPencilFill style={{ color: "black" }} />
             </button>
              :null}
             
            </div>
          </div>
          {/* body */}
          {/* row 1 */}
          <div className="row">
            {/* job code */}
            <div className="col-md-6">
              <label>Job Code</label>
              <h5>{jobView.jobCode ? jobView.jobCode : "-"}</h5>
            </div>
            {/* division */}
            <div className="col-md-6">
              <label>Division</label>
              <h5>{jobView.division ? jobView.division.name : "-"}</h5>
            </div>
          </div>
          {/* row 2 */}
          <div className="row">
            {/* job Title */}
            <div className="col-md-6">
              <label>Job Title</label>
              <h5>{jobView.jobTitle ? jobView.jobTitle : "-"}</h5>
            </div>
            {/* Deparment */}
            <div className="col-md-6">
              <label>Deparment</label>
              <h5>{jobView.department ? jobView.department.name : "-"}</h5>
            </div>
          </div>
          {/* row 3 */}
          <div className="row">
            {/* Employment Type */}
            <div className="col-md-6">
              <label>Employment Type</label>
              <h5>
                {jobView.employmentType ? jobView.employmentType == 1 ? "Full Time" : jobView.employmentType == 2 ? "Probation" : jobView.employmentType == 3 ? "Intern" : jobView.employmentType == 4 ? "Contract" : jobView.employmentType == 5 ? "Part Time" : "-" : "-"}
              </h5>
            </div>
            {/* Experience Level */}
            <div className="col-md-6">
              <label>Experience Level</label>
              <h5>{jobView.experienceLevel ? jobView.experienceLevel : "-"}</h5>
            </div>
          </div>
          {/* row 4 */}
          <div className="row">
            {/* Location */}
            <div className="col-md-6">
              <label>Location</label>
              <h5>
                {jobView.branch ? jobView.branch.name : "-"}
              </h5>
            </div>
            {/* Workplace Type */}
            <div className="col-md-6">
              <label>Workplace Type</label>
              <h5>
                {jobView.workplaceType ? jobView.workplaceType == 1 ? "Remote" : jobView.workplaceType == 2 ? "Onsite" : jobView.workplaceType == 3 ? "Hybrid" : "-" : "-"}
              </h5>
            </div>
          </div>
        </div>

        {/* Recruitment form */}

        <div className="col-md-6" style={{ border: "2px solid #E7ECF2" }}>
          {/* head */}
          <div
            className="row"
            style={{ padding: "10px 0 10px 0", background: "#F7F9FA" }}
          >
            <div className="col-md-10">
              <h4>Recruitment Settings</h4>
            </div>
            <div className="col-md-2">
            {activeJob == 0?
              <button
                className="collapse-edit-btn"
                style={{ background: "none" }}
                onClick={(e) => {
                  handleEditForm(4);
                }}
              >
                {" "}
                <BsFillPencilFill style={{ color: "black" }} />
              </button>
               :null}
            </div>
          </div>
          {/* row 1 */}
          <div className="row">
            {/* Accessibility */}
            <div className="col-md-6">
              <label>Accessibility</label>
              <h5>{jobView.jobOfferPrivate == true ? "Private" : "Public"}</h5>
            </div>
            {/* Number of Openings */}
            <div className="col-md-6">
              <label>Number of Openings</label>
              <h5>{jobView.noOfOpenings ? jobView.noOfOpenings : "-"}</h5>
            </div>
          </div>
          {/* row 2 */}
          <div className="row">
            {/* Hiring Manager */}
            <div className="col-md-6">
              <label>Hiring Manager</label>
              <h5>
                {jobView.hiringManager ? jobView.hiringManager.name : "-"}
                {/* {jobView.hiringManager ? <EmployeeListColumn id={jobView.hiringManager.id} name={jobView.hiringManager.name} employeeId={jobView.hiringManager.id}></EmployeeListColumn> : "-"} */}
              </h5>
            </div>
            {/* Recruiter Tagged */}
            <div className="col-md-6">
              <label>Recruiter Tagged</label>
              <h5>{jobView.recruiter ? jobView.recruiter.name : "-"}</h5>
            </div>
          </div>
          {/* row 3 */}
          <div className="row">
            {/* Opening Date */}
            <div className="col-md-6">
              <label>Opening Date</label>
              <h5>{jobView.openingDate ? moment(jobView.openingDate).format("ll") : "-"}</h5>
            </div>
            {/* Expiry Date */}
            <div className="col-md-6">
              <label>Expiry Date</label>
              <h5>{jobView.expiryDate ? moment(jobView.expiryDate).format("ll") : "-"}</h5>
            </div>
          </div>
          {/* row 4 */}
          <div className="row">
            {/* Evaluation parameters */}
            <div className="col-md-12">
              <label>Evaluation Parameters</label>
              <h5>{jobView.evaluationParameter ? jobView.evaluationParameter : "-"}</h5>
            </div>
            {/* Screening Automation */}
            <div className="col-md-12">
              <label>Screening Automation</label>
              <h5>-</h5>
            </div>
          </div>
        </div>
      </div>
      <br />

      {/* parent row 3 */}
      <div className="row" style={{ border: "2px solid #E7ECF2" }}>
        {/* head */}
        <div className="col-md-12">
          <div
            className="row"
            style={{ padding: "10px 0 10px 0", background: "#F7F9FA" }}
          >
            <div className="col-md-10">
              <h4>Job Description</h4>
            </div>
            <div className="col-md-1" style={{ marginLeft: "50px" }}>
            {activeJob == 0?
              <button
                className="collapse-edit-btn"
                style={{ background: "none" }}
                onClick={(e) => {
                  handleEditForm(2);
                }}
              >
                {" "}
                <BsFillPencilFill style={{ color: "black" }} />
              </button>
               :null}
            </div>
          </div>
        </div>
        {/* External job */}
        <div className="col-md-4">
          <label>External Job</label>
          <h5>
            {jobView.jobType == true ? "True" : "False"}
          </h5>
        </div>
        {/* Internal job */}
        <div className="col-md-4">
          <label>Internal Job</label>
          <h5>
            {jobView.jobType == false ? "True" : "False"}
          </h5>
        </div>
      </div>
      <br />
      {/* parent row 3 */}
      <div className="row" style={{ border: "2px solid #E7ECF2" }}>
        {/* head */}
        <div className="col-md-12">
          <div
            className="row"
            style={{ padding: "10px 0 10px 0", background: "#F7F9FA" }}
          >
            <div className="col-md-10">
              <h4>Job Distribution</h4>
            </div>
            <div className="col-md-1" style={{ marginLeft: "50px" }}>
            {activeJob == 0?
              <button
                className="collapse-edit-btn"
                style={{ background: "none" }}
                onClick={(e) => {
                  handleEditForm(3);
                }}
              >
                {" "}
                <BsFillPencilFill style={{ color: "black" }} />
              </button>
               :null}
            </div>
          </div>
        </div>
        {/* Qualifications */}
        <div className="col-md-12">
          <label>Qualifications</label>
          <h5>{jobView.qualification ? jobView.qualification : "-"}</h5>
        </div>
        {/* Must have skills */}
        <div className="col-md-6">
          <label>Must have skills</label>
          <h5>{jobView.mustSkils ? jobView.mustSkils : "-"}</h5>
        </div>
        {/* Good to have skills */}
        <div className="col-md-6">
          <label>Good to have skills</label>
          <h5>{jobView.goodSkills ? jobView.goodSkills : "-"}</h5>
        </div>
      </div>
      <br />
      {/* parent row 4 */}
      {activeJob == 0?
      <div className="row" style={{ border: "2px solid #E7ECF2" }}>
        {/* head */}
        <div className="col-md-12">
          <div
            className="row"
            style={{ padding: "10px 0 10px 0", background: "#F7F9FA" }}
          >
            <div className="col-md-10">
              <h4>Job Application Links</h4>
            </div>
          </div>
        </div>
        <Formik
          enableReinitialize={true}
          initialValues={state.jobView}
          onSubmit={save}
        // validationSchema={JobProfileSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            setSubmitting,
            /* and other goodies */
          }) => (
            <Form autoComplete="off">
              <div className="row" style={{ display: "flex", alignItems: "center" }}>
                {/* source type */}
                <div className="col-md-4">
                  <label style={{ margin: "0" }}>Source Type <span style={{ color: "red" }}>*</span></label>
                  <FormGroup>
                    <Field
                      className="form-control"
                      name="sourceType"
                      render={(field) => {
                        return (
                          <HSourceTypeDropdown
                            defaultValue={values.sourceType?.id}
                            onChange={(e) => {
                              setFieldValue("sourceType", e.target.value);
                              setFieldValue("sourceTypeId", { id: e.target.value });
                            }}
                          ></HSourceTypeDropdown>
                        );
                      }}
                    ></Field>
                  </FormGroup>
                </div>
                {/* Source Name  */}
                <div className="col-md-4">
                  <FormGroup>
                    <label>
                      Source Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="sourceName"
                      required
                      className="form-control"
                      placeholder="Enter"
                    ></Field>
                    <ErrorMessage name="sourceName">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </FormGroup>
                </div>
                <div className="col-md-4" style={{ marginTop: "9px" }}>
                  <input
                    type="submit"
                    className="btn hire-next-btn"
                    value={`Generate Link`}
                  />
                </div>
                {data.length > 0 ?
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
                            onShowSizeChange: pageSizeChange,
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
                          onChange={onTableDataChange}
                        />
                      </div>

                    </div>
                  </div> : null}
              </div>
            </Form>
          )}

        </Formik>
        <br />

        {/* Candidate Info */}

      </div>
       :null}
      <br />

      {/* parent row 5 */}
      <div className="row" style={{ border: "2px solid #E7ECF2" }}>
        {/* head */}
        <div className="col-md-12">
          <div
            className="row"
            style={{ padding: "10px 0 10px 0", background: "#F7F9FA" }}
          >
            <div className="col-md-10">
              <h4>Candidate Fields</h4>
            </div>
            <div className="col-md-1" style={{ marginLeft: "50px" }}>
            {activeJob == 0?
              <button
                className="collapse-edit-btn"
                style={{ background: "none" }}
                onClick={(e) => {
                  handleJobApplicantEditForm(5);
                }}
              >
                {" "}
                <BsFillPencilFill style={{ color: "black" }} />
              </button>
               :null}
            </div>
          </div>
        </div>
        {/* body */}
        {/* candidate form using hjobapplicant */}
        {applicantField.map((applicantField) => (

          <div className="col-md-12" style={{ border: "2px solid #E7ECF2", background: "#fff" }}>
            <div className="row">
              {systemFieldBoolean = true}
              {CustomFieldBoolean = true}
              <div className="col-md-12" style={{ padding: "0" }}>
                <button className="collaps-btn" style={{ background: "none" }}>
                  <a
                    className="collapstag"
                    data-bs-toggle="collapse"
                    href={`#${applicantField.fieldName.replace(/ /g, '')}`}
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                  >
                    <div className="row">
                      <div className="col-md-10">
                        <h4 className="collapse-para">{applicantField.fieldName}</h4>
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
            <div className="collapse" id={applicantField.fieldName.replace(/ /g, '')} style={{ borderTop: "2px solid #E7ECF2" }}>
              {/* row 1 */}
              <div className="row" style={{ padding: "10px" }}>
                {/* system field */}
                <div className="col-md-6">
                  <table style={{ width: "100%" }}>
                    <tr>
                      <th>System Field</th>
                      <th>Required</th>
                    </tr>
                    {jobApplicantField.map((jobApplicantdata, index) => (
                      jobApplicantdata.applicant.id == applicantField.id && jobApplicantdata.systemFieldId != 0 ?
                        <tr key={jobApplicantdata.id}>
                          {systemFieldBoolean = false}
                          <td>{jobApplicantdata.fieldName}</td>
                          <td>{jobApplicantdata.required ? "True" : "False"}</td>
                        </tr>
                        : systemFieldBoolean && index === jobApplicantField.length - 1 && <label style={{ display: "flex", justifyContent: "end", padding: "10px" }}>No Data Found</label>

                    ))}
                  </table>
                </div>

                {/* custom field */}
                <div className="col-md-6">
                  <table style={{ width: "100%" }}>
                    <tr>
                      <th>Custom Field</th>
                      <th>Required</th>
                    </tr>
                    {jobApplicantField.map((jobApplicantdata, index) => (
                      jobApplicantdata.applicant.id == applicantField.id && jobApplicantdata.customFieldId != 0 ?
                        <tr key={jobApplicantdata.id}>
                          {CustomFieldBoolean = false}
                          <td>{jobApplicantdata.fieldName}</td>
                          <td>{jobApplicantdata.required ? "True" : "False"}</td>
                        </tr>
                        : CustomFieldBoolean && index === jobApplicantField.length - 1 && <label style={{ display: "flex", justifyContent: "end", padding: "10px" }}>No Data Found</label>

                    ))}
                  </table>
                </div>



              </div>

            </div>

          </div>


        ))}


        {/* body e */}

      </div>

      {/* form */}
      <Modal enforceFocus={false} size={"lg"} show={state.showForm} onHide={hideForm} >
        <Modal.Header closeButton>
          <h5 className="modal-title">Hire</h5>
        </Modal.Header>
        <Modal.Body>
          {openForm == 1 && <JobProfileForm hireJobId={state.jobView.id} jobProfile={state.jobView} previousPage={previousPage} />}
          {openForm == 2 && <JobDistribution hireJobId={state.jobView.id} JobDistribution={state.jobView} jobType={state.jobView.jobType} previousPage={previousPage} />}
          {openForm == 3 && <JobDescriptionForm hireJobId={state.jobView.id} jobDescription={state.jobView} previousPage={previousPage} />}
          {openForm == 4 && <RecruitmentSetting hireJobId={state.jobView.id} RecruitmentSetting={state.jobView} previousPage={previousPage} />}
          {openForm == 5 && <SystemFields hireJobId={state.jobView.id} SystemFields={state.jobApplicantFieldData} previousPage={previousPage} />}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HJobFormView;
