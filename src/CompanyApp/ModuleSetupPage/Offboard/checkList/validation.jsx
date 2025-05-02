import * as Yup from 'yup';

export const taskValidationSchema = Yup.object().shape({
    name: Yup.string().required('Task Name is required'),
    description: Yup.string().required('Description is required'),
    assign: Yup.string().required('Assign To is required'),
    dueOn: Yup.string().required('Due Date is required'),
    numberofDays: Yup.number().when('dueOn', {
        is: (value) => value && value !== '3',
        then: Yup.number().required('Number of days is required').positive('Number of days must be positive').integer('Number of days must be an integer'),
        otherwise: Yup.number().notRequired()
    }),
    subtasks: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('Subtask Name is required'),
            assign: Yup.string().required('Assign To is required'),
            dueOn: Yup.string().required('Due Date is required'),
            numberofDays: Yup.number().when('dueOn', {
                is: (value) => value && value !== '3',
                then: Yup.number().required('Number of days is required').positive('Number of days must be positive').integer('Number of days must be an integer'),
                otherwise: Yup.number().notRequired()
            })
        })
    )
});
