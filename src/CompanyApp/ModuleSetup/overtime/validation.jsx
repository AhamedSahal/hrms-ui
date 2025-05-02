import * as Yup from 'yup';


export const overtimeSchema = Yup.object().shape({
    overtimePayOnHoliday: Yup.number()
    .min(0, 'Please provide a valid percentage')
    .max(100, 'Please provide a valid percentage')
    .required('Please provide Overtime Amount (% of Basic Salary) on Holidays'), 
        overtimePayOnWorkingDay: Yup.number()
        .min(0, 'Please provide a valid percentage')
        .max(100, 'Please provide a valid percentage')
        .required('Please provide Overtime Amount (% of Basic Salary) on Working days'), 
});