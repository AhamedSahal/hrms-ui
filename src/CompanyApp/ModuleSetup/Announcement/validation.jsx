import * as Yup from 'yup';


export const AnnouncementSchema = Yup.object().shape({ 
    title: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please provide Name')
});