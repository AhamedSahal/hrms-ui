import * as Yup from 'yup';


export const ApplicantTypeSchema = Yup.object().shape({ 
    recruiterId: Yup.string()
        .min(1, 'Too Short!')
        .required('Please provide Name')
});