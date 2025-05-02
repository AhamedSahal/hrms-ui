import * as Yup from 'yup';


export const PayVarianceSchema = Yup.object().shape({
    title: Yup.string()
        .min(2, 'Too Short!')
        .max(15, 'Too Long!')
        .required('Please provide Title'),
    fromDate: Yup.string()
        .when('fixDuration', {
            is: true,
            then: Yup.string()
                .required('Please provide From Date'),
            otherwise: Yup.string()
        }),
    toDate: Yup.string()
        .when('fixDuration', {
            is: true,
            then: Yup.string()
                .required('Please provide To Date'),
            otherwise: Yup.string()
        }),
    amount: Yup.number()
        .typeError("Please provide Number")
        .required("Please provide Discount value"),
    description: Yup.string()
        .required("Please provide Description"),

});