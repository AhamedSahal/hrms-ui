import * as Yup from 'yup';


export const SignatureSchema = Yup.object().shape({
    signature: Yup.string()
        .required('Please provide Signature Image'),
});