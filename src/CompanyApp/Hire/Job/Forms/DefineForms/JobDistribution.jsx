import React, { Component } from "react";
import { FormGroup } from "reactstrap";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { toast } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";
import IconButton from '@mui/material/IconButton';
import { ErrorMessage, Field, Form, Formik } from "formik";
import { BsFillInfoCircleFill,BsFileEarmarkText } from "react-icons/bs";
import {saveHireForms} from '../../service'


// tool tip
const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
      width: "150px",
      height: "auto",
      padding: "5px",
      border: "1px solid black"
    },
  }));
export default class JobDistribution extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hireJobId: props.hireJobId || 0,
      JobDistribution: props.JobDistribution || {
      jobType: props.jobType?props.jobType:true,   
      },
      
    };
  }

  
  // cancel 
  handleCancel = () => {
    window.location.href = "/app/company-app/hire/job";
  }

  save = (data, action) => {
    const {hireJobId} = this.state;
    if(hireJobId == 0){
      let datas = {
        id: "JobDistribution",
        jobType: data.jobType
      }
      this.props.nextForm(datas);
    }

    // update job
    if(hireJobId > 0){
      let jobDistributionFormData = {...data,
       department: data.department?data.department.id:0,
       division: data.division?data.division.id:0,
       branch: data.branch?data.branch.id:0,
       hiringManager: data.hiringManager?data.hiringManager.id:0,
       recruiter: data.recruiter?data.recruiter.id:0,
       jobType: data.jobType ? data.jobType  : false,
     }

     // service callback
     saveHireForms(jobDistributionFormData)
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
    this.props.previous(0);
  }

  render() {
    let {JobDistribution} = this.state;
    return (
        <div style={{ padding: "15px", background: "white" }}>
              <h3 style={{wordSpacing: "-4px"}}><BsFileEarmarkText size={30} style={{color: "#1DA8D5"}} />  Job Distribution</h3>
        <br />
        <Formik
          enableReinitialize={true}
          initialValues={this.state.JobDistribution}
          onSubmit={this.save}
        //   validationSchema={JobProfileSchema}
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
                <div className="col-md-4">
                <FormGroup>
                <Checkbox
                        checked={JobDistribution.jobType}
                        onChange={(e) => {
                          JobDistribution.jobType = JobDistribution.jobType?true:!JobDistribution.jobType
                            setFieldValue("jobType",JobDistribution.jobType)
                        }}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                      <label>External Job <span>
                             <LightTooltip title="External jobs would have the visibilities on the external job pages and will be available to the external users to apply" >
                          <IconButton>
                          <BsFillInfoCircleFill size={20} style={{color: "#1DA8D5"}} />
                          </IconButton>
                        </LightTooltip>
                        </span> </label>
                </FormGroup>
                </div>
                <div className="col-md-4">
                <FormGroup>
                <Checkbox 
                        checked={!JobDistribution.jobType}
                        onChange={(e) => {
                          JobDistribution.jobType = false
                          setFieldValue("jobType",JobDistribution.jobType)
                  
                        }}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                      <label>Internal Job <span>
                             <LightTooltip title="An internal job would only be visible to internal user of the organisation to apply" >
                          <IconButton>
                          <BsFillInfoCircleFill size={20} style={{color: "#1DA8D5"}} />
                          </IconButton>
                        </LightTooltip>
                        </span></label>
                </FormGroup>
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
    )
  }

}