import * as Yup from 'yup';


export const CountrySchema = Yup.object().shape({ 
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Please provide Name'),
        nationality:Yup.string()
        .min(2, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Please provide Nationality')
});