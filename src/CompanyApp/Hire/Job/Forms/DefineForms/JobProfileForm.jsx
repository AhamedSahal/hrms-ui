import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormGroup } from "reactstrap";
import Checkbox from "@mui/material/Checkbox";
import { ErrorMessage, Field, Form, Formik } from "formik";
import DivisionDropdown from "../../.././../ModuleSetup/Dropdown/DivisionDropdown";
import DepartmentDropdown from "../../.././../ModuleSetup/Dropdown/DepartmentDropdown";
import BranchDropdown from "../../.././../ModuleSetup/Dropdown/BranchDropdown";
import { JobProfileSchema } from "../../Validation"
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { BsFillInfoCircleFill, BsChatSquareText } from "react-icons/bs";
import { getJobsList, saveHireForms } from '../../service'




// tool tip
const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
    width: "150px",
    height: "auto",
    padding: "5px",
    border: "1px solid black"
  },
}));


export default class JobProfileForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeData: [],
      hireJobId: props.hireJobId || 0,
      jobProfile: props.jobProfile || {},
      remote: true,
    };
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    getJobsList(this.state.q, this.state.page, this.state.size, this.state.sort, 0).then(res => {
      if (res.status == "OK") {
        this.setState({
          activeData: res.data.list,
        })
      }
    })
  }

  // cancel 
  handleCancel = () => {
    window.location.href = "/app/company-app/hire/job";
  }


  save = (data, action) => {
    const { hireJobId } = this.state;
    // new job
    if (hireJobId == 0) {
      let { activeData } = this.state
      let flag = true;
      activeData.map((res) => data.jobCode === res.jobCode ? flag = false : null)
      if (flag) {
        this.props.nextForm(data, 0.5);
      } else {
        toast.error("Job Code Already Exist");
      }

    }
    // update job
    if (hireJobId > 0) {
      let jobProfileFormData = {
        ...data,
        department: data.department ? data.department.id : 0,
        division: data.division ? data.division.id : 0,
        branch: data.branch ? data.branch.id : 0,
        hiringManager: data.hiringManager ? data.hiringManager.id : 0,
        recruiter: data.recruiter ? data.recruiter.id : 0
      }
      // service callback
      saveHireForms(jobProfileFormData)
        .then((res) => {
          if (res.status == "OK") {
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
          if (res.status == "OK") {
            window.location.href = "/app/company-app/hire/job"
            // this.props.previousPage()
          }
        })
        .catch((err) => {
          toast.error("Error while Update Job");
        });


    }


  };



  render() {
    let {hireJobId} = this.state;
    return (
      <div style={{ padding: "15px", background: "white" }}>
        <h3 style={{wordSpacing: "-4px"}}>
          <BsChatSquareText size={30} style={{ color: "#1DA8D5" }} /> Let's Define The Basics About The Job
        </h3>
        <br />
        <Formik
          enableReinitialize={true}
          initialValues={this.state.jobProfile}
          onSubmit={this.save}
         validationSchema={hireJobId == 0?JobProfileSchema:null}
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
            <Form autoComplete="off" style={{ border: "0.5px solid #e3e3e3", padding: "20px" }}>
              <div className="row">
                <div className="col-md-4">
                  <FormGroup>
                    <label>
                      Job Code <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="jobCode"
                      required
                      className="form-control"
                      placeholder="Eg. JD101"
                    ></Field>
                    <ErrorMessage name="jobCode">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </FormGroup>
                </div>

                <div className="col-md-4">
                  <FormGroup>
                    <label>
                      Job Title <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="jobTitle"
                      required
                      className="form-control"
                      placeholder="Eg. Digital Marketing"
                    ></Field>
                    <ErrorMessage name="jobTitle">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </FormGroup>
                </div>

                {/* division */}
                <div className="col-md-4">
                  <label>Division</label>
                  <FormGroup className="p-0 mb-0">
                    <Field
                      className="form-control"
                      name="divisionId"
                      render={(field) => {
                        return (
                          <DivisionDropdown
                            defaultValue={values.division?.id}
                            onChange={(e) => {
                              setFieldValue("divisionId", e.target.value);
                              setFieldValue("division", { id: e.target.value });
                            }}
                          ></DivisionDropdown>
                        );
                      }}
                    ></Field>
                  </FormGroup>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-4">
                  <FormGroup>
                    <label>Department</label>
                    <Field
                      name="departmentId"
                      render={(field) => {
                        return (
                          <DepartmentDropdown
                            defaultValue={values.department?.id}
                            onChange={(e) => {
                              setFieldValue("departmentId", e.target.value);
                              setFieldValue("department", {
                                id: e.target.value,
                              });
                            }}
                          ></DepartmentDropdown>
                        );
                      }}
                    ></Field>
                    <ErrorMessage name="departmentId">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </FormGroup>
                </div>

                <div className="col-md-4">
                  <label>Employment Type</label>
                  <select
                    className="form-control"
                    name="employmentType"
                    id="employmentType"
                    defaultValue={values.employmentType}
                    onChange={(e) => {
                      setFieldValue("employmentType", e.target.value);
                    }}
                  >
                    <option value="">Select Employment Type</option>
                    <option value="1">Full Time</option>
                    <option value="2">Probation</option>
                    <option value="3">Intern</option>
                    <option value="4">Contract</option>
                    <option value="5">Part Time</option>
                  </select>
                </div>
              </div>
              <br />
              {/* third row */}
              <div className="row">
                {/* location */}

                <div className="col-md-4">
                  <FormGroup>
                    <label>
                      Location <span style={{ color: "red" }}>*</span> <span>
                        <LightTooltip title="This field will only show office location which are added in the organization settings. Please specify the office location even if the workplace type is remote" placement="top" style={{ margin: "-10px" }}>
                          <IconButton>
                            <BsFillInfoCircleFill size={20} style={{ color: "#1DA8D5" }} />
                          </IconButton>
                        </LightTooltip>
                      </span>
                    </label>
                    <Field
                      name="branchId"
                      render={(field) => {
                        return (
                          <BranchDropdown
                            required
                            defaultValue={values.branch?.id}
                            onChange={(e) => {
                              setFieldValue("branchId", e.target.value);
                              setFieldValue("branch", { id: e.target.value });
                            }}
                          ></BranchDropdown>
                        );
                      }}
                    ></Field>
                    <ErrorMessage name="branchId">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </FormGroup>
                </div>

                {/* workplace Type */}

                <div className="col-md-4">
                  <label>Workplace Type</label>
                  <select
                    className="form-control"
                    name="workplaceType"
                    id="workplaceType"
                    defaultValue={values.workplaceType}
                    onChange={(e) => {
                      setFieldValue("workplaceType", e.target.value);
                    }}
                  >
                    <option value="">Select Workplace Type</option>
                    <option value="1">Remote</option>
                    <option value="2">On Site</option>
                    <option value="3">Hybrid</option>
                  </select>
                </div>

                {/* experience level */}

                <div className="col-md-4">
                  <FormGroup>
                    <label>Experience Level</label>
                    <Field
                      name="experienceLevel"
                      className="form-control"
                      placeholder="Add Experience Level"
                    ></Field>
                    <ErrorMessage name="experienceLevel">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </FormGroup>
                </div>
              </div>
              <br />
              {/* btn */}
              <div className="row">
                <div className="col-md-6">
                  <input className="btn btn-light hire-close" onClick={this.handleCancel} value={"Cancel"} />
                </div>
                <div
                  className="col-md-6"
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  {this.state.hireJobId == 0 ?
                    <input
                      type="submit"
                      className="btn hire-next-btn"
                      value={`Next Step `}
                    /> :
                    <input
                      type="submit"
                      className="btn hire-next-btn"
                      value={`Apply Changes`}
                    />
                  }
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
