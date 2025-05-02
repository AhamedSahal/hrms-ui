import * as Yup from 'yup';
export const SurveySchema = Yup.object().shape({
    name: Yup.string()
        .required('Please provide Name'),
});