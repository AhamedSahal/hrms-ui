import React, { Component } from "react";
// import { getJobInfoCandidate } from "../../Job/service"
import { toast } from 'react-toastify';
import { getJobInfoCandidate,getExternalApplicantInfo } from "./service";
import { FormGroup } from "reactstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { BsGeoAlt, BsFillEnvelopeXFill } from "react-icons/bs";


export default class JobCandidateInformationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jobId: props.jobId,
      jobInfo: [],
      candidateJobInfo: {},
      applicantsList: [],
      status: "NEW"
    };
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    getJobInfoCandidate(this.state.jobId).then(res => {
      if (res.status == "OK") {
        this.setState({ jobInfo: res.data[0] })
      } else {
        toast.error(res.message);
      }

    })

    getExternalApplicantInfo(this.state.jobId).then(res => {
      if (res.status == "OK") {
          this.setState({
            applicantsList: res.data,

          })
      }
  })

  }

  save = (data) => {
    const { applicantsList,jobInfo } = this.state;
    let flag = true;
    let output = {...data, hiringManagerId: jobInfo.hiringManagerId,hiringManagerName: jobInfo.hiringManagerName,jobProfile:jobInfo.hiringManagerName,}
    if (applicantsList.length > 0) {
      applicantsList.map((applciantData) => {
        if (applciantData.email == data.email) {
          flag = false
          toast.error("Email is already exist");
        }
      })
    }
    if (flag) {
      this.props.nextForm(output);

    }
  }

  render() {
    const { jobInfo } = this.state;
    return (
      <div style={{ paddingTop: "70px" }}>
        <div style={{ padding: "10px 0 0 10px", color: "#fff", borderBottom: "2px solid #E7ECF2" }}>
          <h4 >Job Details</h4>
        </div>
        <Formik
          enableReinitialize={true}
          initialValues={this.state.candidateJobInfo}
          onSubmit={this.save}
        // validationSchema={JobProfileSchema}
        >
          {() => (
            <Form autoComplete="off" >
              {/* phase 1 */}
              <div className="row" style={{ padding: "40px" }}>
                <div className="col-md-12" style={{ border: "2px solid #E7ECF2", boxShadow: "none", padding: "15px" }}>
                  <h3>{jobInfo.jobCode}</h3>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p><BsGeoAlt /> {jobInfo.location}</p>
                  </div>


                  <div className="row">
                    <div className="col-md-6">
                      <FormGroup>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E7ECF2" }}>
                            <span style={{ padding: "5px", fontSize: "15px" }}> <BsFillEnvelopeXFill /></span>
                            <Field
                              name="email"
                              required
                              style={{ border: "none" }}
                              className="form-control"
                              placeholder="Enter email"
                            ></Field>
                          </div>
                        </div>

                        <ErrorMessage name="email">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                        </ErrorMessage>
                      </FormGroup>
                    </div>
                    <div className="col-md-2" style={{ paddingLeft: "0" }}>
                      <input
                        style={{ padding: "10px 20px 10px 20px" }}
                        type="submit"
                        className="btn hire-next-btn"
                        value={`Apply`}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* phase 2 */}
              <div className="row" style={{ padding: "0 40px 0 40px" }}>
                <div className="col-md-12" style={{ border: "2px solid #E7ECF2", boxShadow: "none", padding: "15px" }}>
                  <div style={{ borderBottom: "2px solid #E7ECF2" }}>
                    <h5>{jobInfo.jobCode}</h5>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-4">
                      <h5>Division</h5>
                      <p>{jobInfo.division}</p>
                    </div>
                    <div className="col-md-4">
                      <h5>Employment Type</h5>
                      <p>
                        {jobInfo.employmentType ? jobInfo.employmentType == 1 ? "Full Time" : jobInfo.employmentType == 2 ? "Probation" : jobInfo.employmentType == 3 ? "Intern" : jobInfo.employmentType == 4 ? "Contract" : jobInfo.employmentType == 5 ? "Part Time" : "-" : "-"}
                      </p>
                    </div>
                    <div className="col-md-4">
                      <h5>Experience level</h5>
                      <p>{jobInfo.experienceLevel}</p>

                    </div>
                  </div>
                  {/* 2 row */}
                  <div className="row">
                    <div className="col-md-4">
                      <h5>Location</h5>
                      <p>{jobInfo.location}</p>
                    </div>
                    <div className="col-md-4">
                      <h5>Workplace Type</h5>
                      <p>
                        {jobInfo.workplaceType ? jobInfo.workplaceType == 1 ? "Remote" : jobInfo.workplaceType == 2 ? "Onsite" : jobInfo.workplaceType == 3 ? "Hybrid" : "-" : "-"}
                      </p>
                    </div>
                  </div>
                  {/* 3 row */}
                  <div className="row">
                    <div className="col-md-4">
                      <h5>Must have skills</h5>
                      <p>{jobInfo.mustSkils}</p>
                    </div>
                  </div>
                  {/* 3 row */}
                  <div className="row">
                    <div className="col-md-4">
                      <h5>Good to have skills</h5>
                      <p>{jobInfo.goodSkills}</p>
                    </div>

                  </div>
                </div>

              </div>

              {/* phase 3 */}
              <div className="row" style={{ padding: "40px" }}>
                <div className="col-md-12" style={{ border: "2px solid #E7ECF2", boxShadow: "none", padding: "15px" }}>
                  <p>Let's take the first step towards joining our team</p>
                  <div className="row">
                    <div className="col-md-6">
                      <FormGroup>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E7ECF2" }}>
                            <span style={{ padding: "5px", fontSize: "15px" }}> <BsFillEnvelopeXFill /></span>
                            <Field
                              name="email"
                              required
                              style={{ border: "none" }}
                              className="form-control"
                              placeholder="Enter email"
                            ></Field>
                          </div>
                        </div>
                        <ErrorMessage name="email">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                        </ErrorMessage>
                      </FormGroup>
                    </div>
                    <div className="col-md-2" style={{ paddingLeft: "0" }}>
                      <input
                        style={{ padding: "10px 20px 10px 20px" }}
                        type="submit"
                        className="btn hire-next-btn"
                        value={`Apply`}
                      />
                    </div>
                  </div>

                </div>
              </div>

            </Form>
          )}

        </Formik>


      </div>

    )
  }
}
