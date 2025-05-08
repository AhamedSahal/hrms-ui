import * as Yup from 'yup';


export const TimesheetSchema = Yup.object().shape({
    date: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please provide date'),
    hours: Yup.number()
        .min(0.01, 'Hours can not be zero')
        .required('Please provide hours')
        .typeError('Please enter number only')
        .test('decimal-places', 'Hours should have only 2 decimal places', (value) => {
            if (value === undefined || value === null) return true;
            return /^\d+(\.\d{1,2})?$/.test(value.toString()); 
          })
});