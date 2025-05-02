import * as Yup from 'yup';


export const EmploymentStatusSchema = Yup.object().shape({ 
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please provide Name'),
        modeOfPay: Yup.string()
        .required('Please select Mode Of Pay')
});       