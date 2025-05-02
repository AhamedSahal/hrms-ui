import * as Yup from 'yup';


export const TimeInLieuSchema = Yup.object().shape({ 
    forDate: Yup.string()
        .required('Please provide Date'),
    hours: Yup.number()
        .typeError("Please provide Number")
        .required("Please provide Hour value")
});