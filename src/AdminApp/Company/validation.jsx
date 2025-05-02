import * as Yup from 'yup';


export const CompanySchema = Yup.object().shape({
    companyName: Yup.string()
        .min(2, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Please provide Company Name'),
    contactName: Yup.string()
        .min(2, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Please provide Contact Name'),
    email: Yup.string()
        .email("Please provide valid Email")
        .required("Please provide Email"),
        address: Yup.string()
        .required("Please provide Address"),
    password: Yup.string()
        .when('id', {
            is: (id) => id==0,//just an e.g. you can return a function
            then: Yup.string().required('Password is required'),
            otherwise: Yup.string()
        }), 
});