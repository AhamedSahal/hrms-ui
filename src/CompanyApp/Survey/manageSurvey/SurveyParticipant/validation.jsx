import * as Yup from 'yup';

export const SurveyParticipantSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please provide Name'),
    email: Yup.string()
        .email('Invalid email')
        .required('Please provide email'),
    mobile: Yup.string()
        .min(7, 'Too Short!')
        .max(15, 'Too Long!')
        .required('Please provide phone number'),
});