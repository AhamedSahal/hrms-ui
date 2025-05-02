import * as Yup from 'yup';

export const SurveyMessageSchema = Yup.object().shape({
    invitationWhatsapp: Yup.string()
        .required('Please provide Invitation WhatApp message template'),
    reminderWhatsapp: Yup.string()
        .required('Please provide Reminder Whatsapp message template'),
    thankYouWhatsapp: Yup.string()
        .required('Please provide Thank You WhatApp message template'),
});