import * as Yup from 'yup';


export const PaymentFileSchema = Yup.object().shape({
    employerUniqueId: Yup.string()
        .matches(/^\d{1,16}$/, 'Employer Unique ID must be numeric and not exceed 16 digits.')
        .required('Please provide Employer Unique Id')
        .typeError('Please enter Number only'),
    employerMOLId: Yup.string()
        .matches(/^\d{1,13}$/, 'Employer MOL ID must not exceed 13 digits.')
        .required('Please provide Employer MOL Id')
        .typeError('Please enter Number only'),
    bankName: Yup.string()
        .required('Please provide Bank Name')
        .matches(/^[a-zA-Z._ ]+$/,'Bank Name should not contain numbers/special characters' )
        .typeError('Please enter text only'),
    bankRoutingCode: Yup.string()
        .matches(/^\d{9}$/, 'Bank Routing Code must be exactly 9 digits.')
        .required('Please provide Bank Routing Code'),
    agentCode: Yup.string()
        .matches(/^\d{1,9}$/, 'Agent Code must be numeric and not exceed 9 digits.')
        .required('Please provide Agent Code'),
     
});