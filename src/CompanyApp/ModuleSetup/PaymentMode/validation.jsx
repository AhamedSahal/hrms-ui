import * as Yup from 'yup';

export const PaymentModeSchema = Yup.object().shape({ 
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(500, 'Too Long!')
        .required('Please provide Name')
    });