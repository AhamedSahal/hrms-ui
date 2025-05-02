import * as Yup from 'yup';


export const TemplateSchema = Yup.object().shape({
    name: Yup.string()
        .required('Please provide Template Name'),
    displayName: Yup.string()
        .required('Please provide Display Name'),
    // templateType: Yup.string()
    //     .required('Please provide Template Type'),
    header: Yup.string()
        .required('Please provide Header'),
    body: Yup.string()
        .required('Please provide Body'),
    footer: Yup.string()
        .required('Please provide Footer'),
});