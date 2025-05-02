import * as Yup from 'yup'; 

export const JobDescriptionSchema = Yup.object().shape({ 
    jobTitlesId: Yup.string() 
        .max(50, 'Too Long!')
        .required('Please provide Job Titles'),
    name: Yup.string()
        .required('Please provide Job Code')
        .max(50, 'Too Long!'),
    departmentId: Yup.number()
        .min(1,'Please provide Department'),
    repToId: Yup.number()
        .min(1,'Please provide Reporting To'),
    gradesId: Yup.number()
        .min(1,'Please provide Grades'),
    branchId: Yup.number()
        .min(1,'Please provide Location'),
    jobpurpose: Yup.string()
        .required('Please provide Job Purpose'),
    noofreports: Yup.string()
        .required('Please provide No of Reports'),
    financialParameters: Yup.string()
        .required('Please provide Financial Parameters'),
    externalInterfaces: Yup.string()
        .required('Please provide External Interface(s)'),
    internalInterfaces: Yup.string()
        .required('Please provide Internal Interface(s)'),
    keyAccResp: Yup.string()
        .required('Please provide Key Accountabilities And Responsibilities'),
    qualiExper: Yup.string()
        .required('Please provide Minimum Qualifications and Experience'),
    keyskills: Yup.string()
        .required('Please provide Key Skills and Competencies'),
    addReq: Yup.string()
        .required('Please provide Additional Requirements'),
    disclaimer: Yup.string()
        .required('Please provide Disclaimer')
});