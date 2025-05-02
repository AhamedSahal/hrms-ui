import * as Yup from 'yup';


export const PerformanceSchema = Yup.object().shape({ 
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(500, 'Too Long!')
        .required('Please provide Name'),
        weightage : Yup.number().
        min(1).max(100).required("Please provice weightage")
        
});