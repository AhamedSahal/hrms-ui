import * as Yup from "yup";

export const addCandidatesValidation = Yup.object().shape({
    candidateId: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("Please select the Candidate"),
    readiness: Yup.string().required("Please select the Readiness")
  
});

export const addPoolMembersValidation = Yup.object().shape({
    poolId: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("Please Select the pool"),
    candidateId: Yup.string().required("Please select the Candidate"),
    readiness: Yup.string().required("Please select the Readiness")
  
});