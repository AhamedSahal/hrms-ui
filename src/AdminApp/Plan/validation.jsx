import * as Yup from 'yup';


export const PlanSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(15, 'Too Long!')
        .required('Please provide Name'), 
    price: Yup.number()
        .min(-1, 'Too Short!')
        .typeError("Please provide Number")
        .required("Please provide Price"),
    maxEmployees: Yup.number()
        .min(-1, 'Too Short!')
        .typeError("Please provide Number")
        .required("Please provide Max Employee"),
    maxUsers: Yup.number()
        .min(-1, 'Too Short!')
        .typeError("Please provide Number")
        .required("Please provide Max Users"),
    duration: Yup.string()
        .required("Please Select Duration")
});