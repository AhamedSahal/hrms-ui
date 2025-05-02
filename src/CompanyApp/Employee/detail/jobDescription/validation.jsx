import * as Yup from 'yup'; 

export const PeoplesJobDescriptionSchema = Yup.object().shape({ 
    jobpurpose: Yup.string()
        .required('Please provide Job Purpose'),
    keyAccResp: Yup.string()
        .required('Please provide Key Accountabilities And Responsibilities'),
    qualiExper: Yup.string()
        .required('Please provide Minimum Qualifications and Experience'),
    keyskills: Yup.string()
        .required('Please provide Key Skills and Competencies'),
    addreq: Yup.string()
        .required('Please provide Additional Requirements'),
});