import * as Yup from 'yup';


export const CouponSchema = Yup.object().shape({
    code: Yup.string()
        .min(2, 'Too Short!')
        .max(15, 'Too Long!')
        .required('Please provide Code'),
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please provide Name'),
    discount: Yup.number()
        .typeError("Please provide Number")
        .required("Please provide Discount value"),
    maxLimit: Yup.number()
        .typeError("Please provide Number")
        .required("Please provide Discount value")
});