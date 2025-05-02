import * as Yup from 'yup';


export const ObjectiveGroupSchema = Yup.object().shape({ 
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(500, 'Too Long!')
        .required('Please provide Name'),
    
        weightage : Yup.number()
        .min(1, 'Min 1% required!')
        .max(100, 'Max 100% allowed!')
        .required('Please provide weightage')
});