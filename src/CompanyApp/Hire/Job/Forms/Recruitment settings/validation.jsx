import * as Yup from 'yup';


export const RecruitmentTypeSchema = Yup.object().shape({ 
    hiringManagerId: Yup.string()
        .min(1, 'Too Short!')
        .required('Please provide Name')
});