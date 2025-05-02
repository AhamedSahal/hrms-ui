import * as Yup from 'yup'; 

export const RecognitionSetupSchema = Yup.object().shape({  
    categoryName: Yup.string()
        .required('Please provide category name')
});