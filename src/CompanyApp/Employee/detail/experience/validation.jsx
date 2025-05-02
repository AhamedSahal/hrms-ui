import * as Yup from 'yup';


export const ExperienceSchema = Yup.object().shape({
    designation: Yup.string()
        .min(2, 'Too Short!')
        .required('Please provide Experience'),
    jobDescription: Yup.string()
        .min(2, 'Too Short!')
        .max(999, 'Too Long!')
        .required('Please provide Description'),
    fromDate: Yup.string()
        .required('Please provide From Date'),
    toDate: Yup.string()
        .required('Please provide To Date'),
    company: Yup.string()
        .required('Please provide Company'),
});