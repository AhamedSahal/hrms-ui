import * as Yup from 'yup';


export const GratuitySchema = Yup.object().shape({
    gratuityServiceRequired: Yup.number()
        .min(0, 'Gratuity Service Required must be greater than 0')
        .max(70, 'Gratuity Service Required must be less than 100')
        .required('Please provide Minimum Service Duration (Years)'),
        gratuityAmountPer: Yup.number()
        .min(0, 'Please provide a valid percentage')
        .max(100, 'Please provide a valid percentage')
        .required('Please provide Amount (% of Basic Salary)'), 
});