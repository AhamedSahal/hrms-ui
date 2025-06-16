import { FormGroup } from "reactstrap";
import React, { Component } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import EmployeeDropdown from "../../.././../ModuleSetup/Dropdown/EmployeeDropdown";
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { toast } from "react-toastify";
import { saveHireForms } from "../../service";
import { BsFillInfoCircleFill, BsGear } from "react-icons/bs";
import { RecruitmentTypeSchema } from "./validation";

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
export default class RecruitmentSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hireJobId: props.hireJobId || 0,
      value: "",
      hiringManagerName: "",
      Recruitername: "",
      name:  props.RecruitmentSetting?props.RecruitmentSetting.evaluationParameter:[] || [],
      RecruitmentSetting: props.RecruitmentSetting || {
        active: true,
        screeningAutomation: false,
        evaluationParameters: false,
     

      },
    };
  }


  handleChange = (evt) => {
    this.setState({
      value: evt.target.value,
    });
  };

  handleDelete = (toBeRemoved) => {
    this.setState({
      name: this.state.name.filter((name) => name !== toBeRemoved),
    });
  };

  handleKeyDown = (evt) => {
    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();

      var name = this.state.value.trim();

      if (name) {
        this.setState({
          name: [...this.state.name, name],
          value: "",
        });
      }
    }
  };

  // render days
  _renderDays = (len) => {
    const rows = [];
    if(len != 0.5){
   for(let i=1; i<=len; i++){
    rows.push( <div style={{width: "auto", height: "auto"}}>
      <p style={{margin: "0", textAlign: "center", border: "1px solid #e3e3e3",paddingBottom: "3px"}}>{i}</p>
      <Field style={{ border: "1px solid #e3e3e3"}} placeholder="Enter Description" name={`esParameter${i}`} className="form-control"></Field>
    </div>)
   }
  }
   
   if(len == 0){
    let num = 0.5;
    let i= 1;
    while(num <= 5){
      rows.push( <div style={{width: "auto", height: "auto"}}>
        <p style={{margin: "0", textAlign: "center", border: "1px solid #e3e3e3",paddingBottom: "3px"}}>{num}</p>
        <Field style={{ border: "1px solid #e3e3e3"}} placeholder="Enter Description" name={`esParameter${i}`} className="form-control"></Field>
      </div>)
      num = num+0.5;
      i++
     }
   }
   return rows;
  }

  
  // cancel 
  handleCancel = () => {
    window.location.href = "/app/company-app/hire/job";
  }


//   save
save = async (data, action) => {

  const {hireJobId} = this.state;
  // new job
  if(hireJobId == 0){
    let newdata;
    newdata = {...data,id: "RecruitmentSetting",evaluationParameter: this.state.name,hiringManagerName: this.state.hiringManagerName,Recruitername: this.state.Recruitername}
    this.props.nextForm(newdata); 
  }

  // update job
  if(hireJobId > 0){
    let evaluationParameter = "";
      if (this.state.name.length > 0) {
     await this.state.name.map((res, i) => {
          evaluationParameter = evaluationParameter + (i === 0 ? res : "," + res);
        });
      }
    let jobProfileFormData = {...data,
     department: data.department?data.department.id:0,
     division: data.division?data.division.id:0,
     branch: data.branch?data.branch.id:0,
     hiringManager: data.hiringManager?data.hiringManager.id:0,
     recruiter: data.recruiter?data.recruiter.id:0,
     evaluationParameter: evaluationParameter
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
      //  this.props.previousPage()
      window.location.href = "/app/company-app/hire/job"
     }
   })
   .catch((err) => {
     toast.error("Error while saving Job");
   });

     
 }

  };

  handlePrevious = () => {
    this.props.previous();
  }

//   preveious

  render() {
    let { RecruitmentSetting } = this.state;
    return (
      <div style={{ padding: "15px", background: "white" }}>
        <h3 ><BsGear size={30} style={{color: "#1DA8D5"}} /> Set Up Your Recruitments Options.</h3>
        <br />
        <Formik
          enableReinitialize={true}
          initialValues={this.state.RecruitmentSetting}
          onSubmit={this.save}
          validationSchema={RecruitmentTypeSchema}
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
            <Form autoComplete="off" style={{border: "0.5px solid #e3e3e3",padding: "20px"}}>
              <div className="row">
                <div className="col-md-10">
                  <h4>Do you want to make this job offer private ?</h4>
                  <label>
                    This will hide the job from the career page,API,referal for
                    the clients and job boards
                  </label>
                </div>
                <div className="col-md-2">
                  <FormGroup>
                    <div
                      type="checkbox"
                      name="active"
                      onClick={(e) => {
                        let { RecruitmentSetting } = this.state;
                        RecruitmentSetting.active = !RecruitmentSetting.active;
                        setFieldValue("active", RecruitmentSetting.active);
                        this.setState({
                          RecruitmentSetting,
                        });
                      }}
                    >
                      <i
                        className={`fa fa-2x ${
                          this.state.RecruitmentSetting &&
                          this.state.RecruitmentSetting.active
                            ? "fa-toggle-on text-success"
                            : "fa fa-toggle-off text-danger"
                        }`}
                      ></i>
                    </div>
                  </FormGroup>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-4">
                  <FormGroup>
                    <label>
                      Hiring Manager <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="hiringManagerId"
                      render={(field) => {
                        return (
                          <EmployeeDropdown
                          defaultValue={values.hiringManager?.id}
                            onChange={(e) => {
                              setFieldValue("hiringManagerId", e.target.value);
                              setFieldValue("hiringManager", { id: e.target.value });
                            }}
                          ></EmployeeDropdown>
                        );
                      }}
                    ></Field>
                      <ErrorMessage name="hiringManagerId">
                    {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                  </ErrorMessage>
                  </FormGroup>
                </div>
                <div className="col-md-4">
                  <FormGroup>
                    <label>
                      Recruiter Tagged
                    </label>
                    <Field
                      name="RecruiterId"
                      render={(field) => {
                        return (
                          <EmployeeDropdown
                          defaultValue={values.recruiter?.id}
                            onChange={(e) => {
                              setFieldValue("RecruiterId", e.target.value);
                              setFieldValue("recruiter", { id: e.target.value });
                            }}
                          ></EmployeeDropdown>
                        );
                      }}
                    ></Field>
                  </FormGroup>
                  <ErrorMessage name="RecruiterId">
                    {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                  </ErrorMessage>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <FormGroup>
                    <label>
                      No of Openings <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field required placeholder="Enter no. of openings" name="noOfOpenings" className="form-control" type="number"></Field>
                    <ErrorMessage name="noOfOpenings">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </FormGroup>
                </div>
                <div className="col-md-4">
                  <FormGroup>
                    <label>
                      Opening Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                    required
                      name={"openingDate"}
                      defaultValue={values.openingDate}
                      className="form-control"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("openingDate",e.currentTarget.value);
                      }}
                    ></Field>
                    <ErrorMessage name="openingDate">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </FormGroup>
                </div>
                <div className="col-md-4">
                  <FormGroup>
                    <label>
                      Expiry Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                    required
                      name={"expiryDate"}
                      defaultValue={values.expiryDate}

                      className="form-control"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("expiryDate",e.currentTarget.value);
                      }}
                    ></Field>
                    <ErrorMessage name="expiryDate">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </FormGroup>
                </div>
              </div>
              <hr style={{color: "#e3e3e3"}}/>
              {/* scale functinalities */}
              <div className={`row ${this.state.RecruitmentSetting.evaluationParameter?"screeningAutomation":null}`}>
                <div className="col-md-10">
                  <h4>Set Up Scale For Evaluation Parameter</h4>
                </div>
                <div className="col-md-2">
                  <FormGroup>
                    <div
                      type="checkbox"
                      name="evaluationParameter"
                      onClick={(e) => {
                        let { RecruitmentSetting } = this.state;
                        RecruitmentSetting.evaluationParameters =
                          !RecruitmentSetting.evaluationParameters;
                        setFieldValue(
                          "evaluationParameter",
                          RecruitmentSetting.evaluationParameters
                        );
                        this.setState({
                          RecruitmentSetting,
                        });
                      }}
                    >
                      <i
                        className={`fa fa-2x ${
                          this.state.RecruitmentSetting &&
                          this.state.RecruitmentSetting.evaluationParameters
                            ? "fa-toggle-on text-success"
                            : "fa fa-toggle-off text-danger"
                        }`}
                      ></i>
                    </div>
                  </FormGroup>
                </div>
                
                <div className="col-md-12">
                <hr style={{color: "#e3e3e3"}}/>
                  <label>
                  The default evaluation scale will always be 5 points if you don't set one up
                  </label>
                </div>
              </div>
              <br />

              {/* scale dropdown */}
              {RecruitmentSetting.evaluationParameters &&
               <div className="row">
                <div className="col-md-12">
                  <label>Evaluation Scale</label>
                  <select
                    className="form-control"
                    name="evaluationScale"
                    id="evaluationScale"
                    defaultValue={values.evaluationScale}
                    onChange={(e) => {
                      setFieldValue("evaluationScale", e.target.value);
                    }}
                  >
                   <option value="2">2 Point Scale</option>
                   <option value="3">3 Point Scale</option>
                   <option value="4">4 Point Scale</option>
                   <option value="5">5 Point Scale</option>
                    <option value="0">5 Scale with 0.5</option>
                    <option value="10">10 Point Scale</option> 
                  </select>
                  <br />
                    {values.evaluationScale && 
                  
                    <div style={{display: "flex", whiteSpace: "nowrap", justifyContent: "start", alignItems: "center"}}>
                      {this._renderDays(values.evaluationScale)}
                    </div>
                    }
                 <br />
                 <div>

                 </div>
                </div>
               </div>
              }

              <br />
              {/* e */}
              <div className="row">
                <div className="col-md-12">
                 <label>
                 Set Evaluation Parameters <span>
                        <LightTooltip title="You can also set up the evaluation parameters at each stage, while setting up hiring pipeline" placement="top" style={{margin: "-10px"}}>
                          <IconButton>
                          <BsFillInfoCircleFill size={20} style={{color: "#1DA8D5"}} />
                          </IconButton>
                        </LightTooltip>
                      </span>
                  </label> 
                  <main className="multi-inputwrapper">
                    <div>
                      <input
                        className="multi-input"
                        placeholder="Enter Parameters"
                        value={this.state.value}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                      />
                    </div>
                    <br />
                    {this.state.name.map((name) => (
                      <div className="multi-input-tag-item" key={name}>
                        {name}

                        <button
                          type="button"
                          className="button"
                          onClick={() => this.handleDelete(name)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </main>
                </div>
              </div>
              <hr style={{color: "#e3e3e3"}}/>
              <div className="row screeningAutomation">
                <div className="col-md-10">
                  <h4>Screening Automation</h4>
                </div>
                <div className="col-md-2">
                  <FormGroup>
                    <div
                      type="checkbox"
                      name="screeningAutomation"
                      onClick={(e) => {
                        let { RecruitmentSetting } = this.state;
                        RecruitmentSetting.screeningAutomation =
                          !RecruitmentSetting.screeningAutomation;
                        setFieldValue(
                          "screeningAutomation",
                          RecruitmentSetting.screeningAutomation
                        );
                        this.setState({
                          RecruitmentSetting,
                        });
                      }}
                    >
                      <i
                        className={`fa fa-2x ${
                          this.state.RecruitmentSetting &&
                          this.state.RecruitmentSetting.screeningAutomation
                            ? "fa-toggle-on text-success"
                            : "fa fa-toggle-off text-danger"
                        }`}
                      ></i>
                    </div>
                  </FormGroup>
                </div>
                
                <div className="col-md-12">
                <hr style={{color: "#e3e3e3"}}/>
                  <label>
                    Your HR has selected the default value as shown below.if
                    required please change it as per the job profile.
                  </label>
                </div>
              </div>
              {/* work on scale progress bar */}
            <br />
              {/* save */}
              <div className="row">
                    <div className="col-md-6">
                      <input
                      onClick={this.handleCancel} 
                        className="btn btn-light hire-close"
                        value={"Cancel"}  
                      />
                    </div>
                    <div
                      className="col-md-6"
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                  {this.state.hireJobId == 0 ?
                    <>
                      <input
                        onClick={this.handlePrevious}
                        className="btn hire-next-btn"
                        value="&larr;"
                        style={{ width: "50px", marginRight: "5px" }}
                      />
                      <input
                        type="submit"
                        className="btn hire-next-btn"
                        value={`Next Step `}
                      /></> : <input
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
