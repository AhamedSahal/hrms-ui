import * as Yup from 'yup';


export const DesignationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please provide Name'),
    departmentId: Yup.number()
        .min(1, 'Please select Department')
        .required('Please select Department'),
});