import React, { Component } from "react";
import JobCandidateApplicantForm from "./JobCandidateApplicantForm";
import JobCandidateInformationForm from "./JobCandidateInformationForm";
import JobResponse from "./JobResponse";

export default class JobCandidateFormIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            jobId: props.match.params.id,
            candidateForm: true,
            responseForm: false

        }
    }
    handleCandidateForm = (data) => {
        this.setState({jobInfo: data})
        this.setState({candidateForm: false})

    }

    handleResponsForm = () => {
        this.setState({responseForm: true})
    }

    render() {
        const {candidateForm} = this.state;
        return(
            <div>
                {candidateForm?<JobCandidateInformationForm  nextForm ={this.handleCandidateForm} jobId={this.state.jobId} />:!this.state.responseForm?<JobCandidateApplicantForm  jobInfo={this.state.jobInfo} jobId={this.state.jobId} handleResponsForm ={this.handleResponsForm}/>:<JobResponse />}
            </div>
        )
    }
}