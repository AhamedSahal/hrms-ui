import * as Yup from 'yup';


export const LeaveTypeSchema = Yup.object().shape({
    title: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please provide Title'),
    days: Yup.number()
        .min(1, 'Too Short!')
        .required('Please provide Days')
        .typeError('Please enter number only'),
    carrymaxLimit: Yup.number()
        .when('carryForward', {
            is: false,
            then: Yup.number().notRequired(),
            otherwise: Yup.number().min(1, 'Max Limit should not be zero').required('Please Enter Max Limit')
        }),
    
    carryexpiryDate: Yup.string()
        .when(['carryForward','entStartMode'], {
        is:  (carryForward, entStartMode) => carryForward == true && entStartMode == 0,
        then: Yup.string().required('Please provide Expiry Date'),
        otherwise: Yup.string().notRequired(),
       
        
        
        }),
    futureexpiryDate: Yup.string()
    .when(['futureYearLeave','entStartMode'], {
        is:  (futureYearLeave, entStartMode) => futureYearLeave == true && entStartMode == 0,
        then: Yup.string()
        .required('Please provide Opening Date'),
        otherwise: Yup.string().notRequired(),
       
        
        }),
    negativebalmaxLimit: Yup.number()
        .when('negativeBalance', {
            is: (negativeBalance) => true,
            then: Yup.number().notRequired(),
            otherwise: Yup.number().min(1, 'Max Limit should not be zero').required('Please Enter Max Limit')
        })
});