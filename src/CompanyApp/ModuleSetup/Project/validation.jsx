import * as Yup from 'yup';


export const ProjectSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name is Too Short!')
        .max(100, 'Name is Too Long!')
        .required('Please provide Name'),
    code: Yup.string()
        .min(2, 'Name  is Too Short!')
        .max(100, 'Name is Too Long!')
        .required('Please provide Code')
    });