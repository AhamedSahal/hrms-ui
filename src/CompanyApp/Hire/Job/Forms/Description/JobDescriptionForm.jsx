
import React, { Component } from 'react';
import { FormGroup } from "reactstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { BsChatSquareText } from "react-icons/bs";
import { toast } from "react-toastify";
import { saveHireForms } from '../../service';

export default class JobDescriptionForm extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        hireJobId: props.hireJobId || 0,
        skills: props.jobDescription?props.jobDescription.skills:[] || [],
        skillValue: "",
        value: "",
        name: props.jobDescription?props.jobDescription.name:[] || [],
        jobDescription: props.jobDescription || {  
          },
      };
    }


    // multi inputs
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

    //   good to have skills
    handleChangeskills = (evt) => {
        this.setState({
            skillValue: evt.target.value,

        });
      };
    
      handleDeleteskills = (toBeRemoved) => {
        this.setState({
            skills: this.state.skills.filter((skills) => skills !== toBeRemoved),
        });
      };
    
      handleKeyDownskills = (evt) => {
        if (["Enter", "Tab", ","].includes(evt.key)) {
          evt.preventDefault();
    
          var skills = this.state.skillValue.trim();
    
          if (skills) {
            this.setState({
                skills: [...this.state.skills, skills],
                skillValue: "",
            });
          }
        }
      };

      
  // cancel 
  handleCancel = () => {
    window.location.href = "/app/company-app/hire/job";
  }

    //   save
  save = (data, action) => {
    const {hireJobId} = this.state;
    const { name, skills } = this.state;
    // new job
    if (hireJobId == 0) {
      if(name.length > 0){
      let datas = {
        id: "jobDescription",
        qualification: data.qualification,
        jobRole: data.jobRole,
        name: name,
        skills: skills,
      }
      this.props.nextForm(datas);
    }else{
      toast.error("Please Fill The Required Field");
    }
    }

    // update job
    if(hireJobId > 0){
      let mustSkils = "";
      let goodSkills="";
      if (this.state.name.length > 0) {
        this.state.name.map((res, i) => {
          mustSkils = mustSkils + (i === 0 ? res : "," + res);
        });
      }
      if (this.state.skills.length > 0) {
        this.state.skills.map((res, i) => {
          goodSkills = goodSkills + (i === 0 ? res : "," + res);
        });
      }
      let jobDescriptionFormData = {...data,
       department: data.department?data.department.id:0,
       division: data.division?data.division.id:0,
       branch: data.branch?data.branch.id:0,
       hiringManager: data.hiringManager?data.hiringManager.id:0,
       recruiter: data.recruiter?data.recruiter.id:0,
       mustSkils: mustSkils,
       goodSkills: goodSkills
     }
     // service callback
     saveHireForms(jobDescriptionFormData)
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

  }

  handlePrevious = () => {
    this.props.previous();
  }
    

    render(){
        return (
          <div style={{ padding: "15px", background: "white" }}>
            <h3><BsChatSquareText size={30} style={{color: "#1DA8D5"}} /> Describe Your Job</h3>
            <br />
            <Formik
              enableReinitialize={true}
              initialValues={this.state.jobDescription}
              onSubmit={this.save}
              // validationSchema={LeaveTypeSchema}
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
                    <div className="col-md-12">
                       <FormGroup>
                    <label>
                    Qualification
                    </label>
                    <Field name="qualification" className="form-control"></Field>
                    <ErrorMessage name="qualification">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </FormGroup>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <main className="multi-inputwrapper">
                        <div>
                          <label>
                            Must Have Skills <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            className="multi-input"
                            placeholder="Type or paste skills and press `Enter`"
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
                    <div className="col-md-6">
                      <main className="multi-inputwrapper">
                        <div>
                          <label>
                            Good To Have Skills
                          </label>
                          <input
                            className="multi-input"
                            placeholder="Type or paste skills and press `Enter`"
                            value={this.state.skillValue}
                            onChange={this.handleChangeskills}
                            onKeyDown={this.handleKeyDownskills}
                          />
                        </div>
                        <br />
                        {this.state.skills.map((name) => (
                          <div className="multi-input-tag-item" key={name}>
                            {name}

                            <button
                              type="button"
                              className="button"
                              onClick={() => this.handleDeleteskills(name)}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </main>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-6">
                    <input className="btn btn-light hire-close" onClick={this.handleCancel}  value={"Cancel"} />
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