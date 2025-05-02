import * as Yup from 'yup';

export const DashboardSchema = Yup.object().shape({
    title: Yup.string()
        .required('Please provide Title'),
    description: Yup.string()
        .required('Please provide Description'),
    expireOn: Yup.date()
        .min(new Date(), 'Expiry Date should be greater than the current date')
        .required('Please Enter Expiry Date'),
});