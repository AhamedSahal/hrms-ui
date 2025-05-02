import * as Yup from 'yup';


export const ProfessionalReferenceSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(99, 'Too Long!')
        .matches(/^[A-Za-z\s]+$/, 'Name should contain only letters and spaces')
        .required('Please provide Name'),
    company: Yup.string()
        .min(2, 'Too Short!')
        .max(999, 'Too Long!')
        .required('Please provide Company'),
    contactNumber: Yup.string()
        .matches(/^[0-9]{2,20}$/, 'Contact-Number should be a Numeric with 2 to 20 digits')
        .required('Please provide Contact Number'),
    email: Yup.string()
        .email('Invalid email')
        .required('Please provide Email'),
});