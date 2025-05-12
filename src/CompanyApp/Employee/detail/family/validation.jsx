import * as Yup from 'yup';


export const FamilySchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please provide Name'),
    relation: Yup.string()
        .max(50, 'Too Long!')
        .required('Please select relation'),
    significantDate: Yup.string()
    .required('Please provide a date'),
    contactNo: Yup.string()
        .nullable()
        .matches(/^\+?[0-9]*$/, "Only numbers are allowed, and '+' must be the first character if present.")
        .matches(/^\+?[0-9]{10,15}$/, "Contact number must be between 10 and 15 digits.")
    
});  