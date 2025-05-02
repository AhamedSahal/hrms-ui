import * as Yup from 'yup'; 

export const OfferLetterSchema = Yup.object().shape({ 
    candidatename: Yup.string() 
        .max(1000, 'Too Long!')
        .required('Please provide Candidate Name'),
    candidateemailid: Yup.string()
        .max(200, 'Too Long!')
        .email('Invalid Candidate Email Id')
        .required('Please provide Candidate Email Id'),
    candidateposition: Yup.string()
        .max(200, 'Too Long!')
        .required('Please provide Candidate Position'),
    offerletterdate: Yup.string() 
        .required('Please provide Offer Letter Date'),
    joiningdate: Yup.string()
        .required('Please provide Joining Date'),
    salary: Yup.string()
        .max(50, 'Too Long!')
        .required('Please provide Salary(In AED)'),
    basicsalary: Yup.string()
        .max(50, 'Too Long!')
        .required('Please provide Basic Salary(In AED)'),
    allowances: Yup.string()
        .max(50, 'Too Long!')
        .required('Please provide Allowances(In AED)'),
    workplace: Yup.string()
        .max(500, 'Too Long!')
        .required('Please provide Place of Work'),
    worktype: Yup.string()
        .max(500, 'Too Long!')
        .required('Please provide Work Type'),
    weekworkhours: Yup.string()
        .max(500, 'Too Long!')
        .required('Please provide Weekly Working Hours'),
    workingdays: Yup.string()
        .max(500, 'Too Long!')
        .required('Please provide Working Days'),
    weekoffdays: Yup.string()
        .max(500, 'Too Long!')
        .required('Please provide Weekoff Days'),
    annualleave: Yup.number()
        .required('Please provide Annual Leave'),
    probationdays: Yup.number() 
        .required('Please provide On Probation Days'),
    noticeperiod: Yup.number() 
        .required('Please Notice Period(In Months)'),
    businesslanguages: Yup.string()
        .required('Please provide Business Languages'),
    // signatureholdername: Yup.string()
    //     .required('Please provide Signature Name'),
    // signatureholderposition: Yup.string()
    //     .required('Please provide Signature Role')
});