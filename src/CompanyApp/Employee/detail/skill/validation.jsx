import * as Yup from 'yup';


export const SkillSchema = Yup.object().shape({
    skill: Yup.string()
        .min(2, 'Too Short!')
        .required('Please provide Skill'),
    description: Yup.string()
        .min(2, 'Too Short!')
        .max(999, 'Too Long!')
        .required('Please provide Description'),
});