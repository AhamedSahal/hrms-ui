import * as Yup from 'yup';

export const SurveySettingsSchema = Yup.object().shape({
    surveyStartReminder: Yup.number()
        .required('Please provide no. of days'),
    surveyEndReminder: Yup.number()
        .required('Please provide no. of days'),

});