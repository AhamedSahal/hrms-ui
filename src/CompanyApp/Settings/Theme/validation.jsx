import * as Yup from 'yup';


export const ThemeSchema = Yup.object().shape({ 
    titleText: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please provide title text')
});