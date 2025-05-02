import React, { Component } from "react";
// import StepProgressBar from "react-step-progress";
// import "react-step-progress/dist/index.css";
import ProgressBar from "react-bootstrap/ProgressBar";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Typography from "@mui/material/Typography";
import JobProfileForm from "./Forms/DefineForms/JobProfileForm"
import JobDescriptionForm from "./Forms/Description/JobDescriptionForm"
import RecruitmentSetting from './Forms/Recruitment settings/RecruitmentSetting'
import SystemFields from './Forms/Applicant Field/SystemFields'
import SummaryForm from './Forms/Summary/SummaryForm'
import JobDistribution from "./Forms/DefineForms/JobDistribution"

export default class HireInformationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewDetails: props.viewDetails || {},
      viewCondition:props.viewCondition || false,
      activeStep: 0
  }
}

componentDidMount() {
       if(this.state.viewCondition){
         this.handleEditForm()
       }
  }

  handleEditForm = () => {
    const {viewDetails} = this.state;
     this.setState({hireJobId: viewDetails.id})
      this.setState({jobProfile: viewDetails})
      this.setState({JobDistribution: viewDetails})
      this.setState({jobDescription: viewDetails})
      this.setState({RecruitmentSetting: viewDetails})
      this.setState({jobProfile: viewDetails})
     
  }
 
  nextForm = (data,next) => {
    const {activeStep} = this.state;
    if(data.id === "jobDescription"){
      this.setState({jobDescription: data })
    }else if(data.id === "RecruitmentSetting"){
      this.setState({RecruitmentSetting: data })
    }else if(data.id === "SystemFields"){
      this.setState({SystemFields: data })
    }else if(data.id === "JobDistribution") {
      this.setState({JobDistribution: data })
    }
    else{
      this.setState({jobProfile: data })
    }
    if(next === 0.5){
      this.setState( {activeStep: next})
    }else{
      this.setState( {activeStep: activeStep === 0.5?1:activeStep+1})
    }
    
}

previous = (num) => {
  const {activeStep} = this.state;
  this.setState( {activeStep: num === 0?0:activeStep === 1?0.5:activeStep-1})
}

selectedForm = (number) => {
  this.setState( {activeStep: number})
}

  render() {
    const { activeStep } = this.state;
    const steps = [
      {
        label: "Define",
      },
      {
        label: "Description",
      },
      {
        label: "Recruitment Settings",
      },
      {
        label: "Applicant Fields",
      },
      {
        label: "Summary",
      },
    ];

    return (
      <div style={{ padding: "30px" }}>
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((res) => (
              <Step key={res.label}>
                <StepLabel>{res.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* forms */}
        {activeStep === 0  && <JobProfileForm nextForm={this.nextForm} jobProfile={this.state.jobProfile}></JobProfileForm>}

        {activeStep === 0.5 && <JobDistribution nextForm={this.nextForm} previous={this.previous} JobDistribution={this.state.JobDistribution}></JobDistribution>}

        {activeStep === 1 && <JobDescriptionForm  nextForm={this.nextForm} previous={this.previous} jobDescription = {this.state.jobDescription}></JobDescriptionForm>}

        {activeStep === 2 && <RecruitmentSetting nextForm={this.nextForm} previous={this.previous} RecruitmentSetting = {this.state.RecruitmentSetting}></RecruitmentSetting>}

         {activeStep === 3 && <SystemFields nextForm={this.nextForm} previous={this.previous} SystemFields={this.state.SystemFields}></SystemFields>}

         {activeStep === 4 && <SummaryForm selectedForm={this.selectedForm} previous={this.previous}  jobProfile={this.state.jobProfile} jobDescription={this.state.jobDescription} RecruitmentSetting={this.state.RecruitmentSetting} JobDistribution={this.state.JobDistribution} SystemFields={this.state.SystemFields}></SummaryForm>}
         
      </div>
    );
  }
}
