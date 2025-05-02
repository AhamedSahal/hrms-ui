import * as Yup from 'yup';


export const ObjectiveSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(500, 'Too Long!')
        .required('Please provide Name'),
        performanceObjectiveGroupId: Yup.number()
        .min(1, 'Please select Objective group')
        .required('Please select Objective group'),
});