import * as Yup from 'yup';


export const RecognitionSetupSchema = Yup.object().shape({
    policiesName: Yup.string()
        .required('Please Provide Policies Name'),
        file: Yup.string()
        .required('Please Provide File')
});