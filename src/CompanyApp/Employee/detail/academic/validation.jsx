import * as Yup from 'yup';


export const AcademicSchema = Yup.object().shape({
    gpa: Yup.string() 
        .required('Please provide GPA'),
    fieldOfStudy: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please provide Field of Study'),
    institute: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please provide Institute'),
    qualification: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please provide Qualification'),
    yearOfCompletion: Yup.number()
        .required('Please provide Qualification Year'),
});