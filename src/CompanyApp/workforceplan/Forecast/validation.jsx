import * as Yup from 'yup';


export const ForecastSchema = Yup.object().shape({ 
    name: Yup.string() 
        .max(50, 'Too Long!')
        .required('Please provide Position Titles'),
    departmentId: Yup.number()
        .min(1,'Please select Department')
        .required('Please select Department'),
    persons: Yup.number()
        .min(1, 'Resources can not be zero')
        .required('Please provide No of resources')
        .typeError('Please enter number only'),
    jobresponsible: Yup.string() 
        .max(50, 'Too Long!')
        .typeError('Please enter alphabet only'),
    qualification: Yup.string() 
        .max(50, 'Too Long!')
        .typeError('Please enter alphabet only'),
    experience: Yup.number() 
        .typeError('Please enter number only')
});