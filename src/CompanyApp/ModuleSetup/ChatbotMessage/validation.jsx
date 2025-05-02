import * as Yup from 'yup';


export const ChatbotMessageSchema = Yup.object().shape({
    code: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please provide code'),
    message: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please provide message'),
    questionDescription: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please provide questionDescription'),

});