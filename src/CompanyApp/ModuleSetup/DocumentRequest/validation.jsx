import * as Yup from 'yup';


export const DocumentRequestSchema = Yup.object().shape({
    details: Yup.string()
        .required('Please provide Details'),
    templateId: Yup.string()
        .required('Please select Template'),
});