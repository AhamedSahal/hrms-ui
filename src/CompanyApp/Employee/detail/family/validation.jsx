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
    .required('Please provide a date')
    
});  