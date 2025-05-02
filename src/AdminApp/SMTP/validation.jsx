import * as Yup from 'yup'; 
export const SMTPSchema = Yup.object().shape({
    userName: Yup.string()
        .min(2, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Please provide user name'),
        password: Yup.string()
        .min(2, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Please provide password'),
        host: Yup.string()
        .min(2, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Please provide host'),
        port: Yup.number()
        .typeError("Please provide Number")
        .required("Please provide port"),
        fromEmail: Yup.string()
        .min(2, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Please provide from email'),
});