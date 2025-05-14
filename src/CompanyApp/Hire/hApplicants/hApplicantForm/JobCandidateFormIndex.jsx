import React, { useState } from "react";
import { useParams } from "react-router-dom";
import JobCandidateApplicantForm from "./JobCandidateApplicantForm";
import JobCandidateInformationForm from "./JobCandidateInformationForm";
import JobResponse from "./JobResponse";

const JobCandidateFormIndex = () => {
    const { id: jobId } = useParams();
    const [candidateForm, setCandidateForm] = useState(true);
    const [responseForm, setResponseForm] = useState(false);
    const [jobInfo, setJobInfo] = useState(null);
 console.log("cell ---jobId", jobId);
 
    const handleCandidateForm = (data) => {
        setJobInfo(data);
        setCandidateForm(false);
    };

    const handleResponsForm = () => {
        setResponseForm(true);
    };

    return (
        <div>
            {candidateForm ? (
                <JobCandidateInformationForm nextForm={handleCandidateForm} jobId={jobId} />
            ) : !responseForm ? (
                <JobCandidateApplicantForm jobInfo={jobInfo} jobId={jobId} handleResponsForm={handleResponsForm} />
            ) : (
                <JobResponse />
            )}
        </div>
    );
};

export default JobCandidateFormIndex;