import * as Yup from 'yup';


export const GratuitySchema = Yup.object().shape({
    name: Yup.string()
        .required('Please provide Details'),
   
});