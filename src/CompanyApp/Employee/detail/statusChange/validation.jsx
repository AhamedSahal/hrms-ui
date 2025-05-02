import * as Yup from 'yup';


export const changeStatusSchema = Yup.object().shape({
    jobTitleId: Yup.string()
        .min(2, 'Too Short!')
        .max(99, 'Too Long!')
        .required('Please provide Name'),
    divisionId: Yup.string()
        .min(2, 'Too Short!')
        .max(999, 'Too Long!')
        .required('Please provide Company'),
    gradesId: Yup.string()
        .min(2, 'Too Short!')
        .max(20, 'Too Long!')
        .required('Please provide Contact Number'),

});