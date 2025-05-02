import * as Yup from 'yup';


export const ApplicantSchema = Yup.object().shape({
    fieldName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please provide Applicate Filed'),
});