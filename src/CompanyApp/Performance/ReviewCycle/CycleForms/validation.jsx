import * as Yup from 'yup';


export const cycleDetailsvalidationSchema = Yup.object().shape({
    cyclename: Yup.string()
        .min(2, 'Name is Too Short!')
        .max(100, 'Name is Too Long!')
        .required('Enter cycle name'),
    individualSettings: Yup.string().required("Select an option"),
    assign: Yup.string().required("Select an option"),
    departments: Yup.array().when('assign', {
        is: (assign, schema) => assign === 'department',
        then: Yup.array().min(1, 'At least one option must be selected'),
        otherwise: Yup.array(),
    }),
    branches: Yup.array().when('assign', {
        is: (assign, schema) => assign === 'location',
        then: Yup.array().min(1, 'At least one option must be selected'),
        otherwise: Yup.array(),
    }),
    functions: Yup.array().when('assign', {
        is: (assign, schema) => assign === 'function',
        then: Yup.array().min(1, 'At least one option must be selected'),
        otherwise: Yup.array(),
    }),
});


export const selectTemplateValidationSchema = Yup.object().shape({
    assign: Yup.string().required("Select an option"),
    cycleRatingScale: Yup.string().required('Select a rating scale'),
    ratingValue: Yup.array().when('assign', {
        is: (assign, schema) => assign === 'department',
        then: Yup.array().min(1, 'At least one option must be selected'),
        otherwise: Yup.array(),
    }),
    branches: Yup.array().when('assign', {
        is: (assign, schema) => assign === 'location',
        then: Yup.array().min(1, 'At least one option must be selected'),
        otherwise: Yup.array(),
    }),
    functions: Yup.array().when('assign', {
        is: (assign, schema) => assign === 'function',
        then: Yup.array().min(1, 'At least one option must be selected'),
        otherwise: Yup.array(),
    }),
});

export const feedbackValidationSchema = Yup.object().shape({
    feedback: Yup.array()
        .min(1, 'At least one option must be selected')
        .required('Select at least one option'),
    hierarchy: Yup.string().required("Select an option"),
    numberOfDays: Yup.number().when('active', {
        is: true,
        then: Yup.number()
            .max(60, 'Maximum number of days allowed is 60')
            .required('Number of days is required'),
        otherwise: Yup.number(),
    }),
})

export const cycleTimeValidationSchema = Yup.object().shape({
    instancename: Yup.string()
        .min(2, 'Name is Too Short!')
        .max(100, 'Name is Too Long!')
        .required('Enter instance name'),
    cycleStartDate: Yup.date()
        .required('Start Date is required'),
    cycleEndDate: Yup.date().required('End Date is required'),
    hrConfirmation_startDate: Yup.date().required('Start Date is required'),
    hrConfirmation_endDate: Yup.date().required('End Date is required'),
    hrConfirmation_startTime: Yup.string()
        .required('Start Time is required')
        .matches(
            /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            'Invalid time format (HH:MM)'
        ),
    hrConfirmation_endTime: Yup.string()
        .required('End Time is required')
        .matches(
            /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            'Invalid time format (HH:MM)'
        ),
    appraisal_startDate: Yup.date().required('Start Date is required'),
    appraisal_endDate: Yup.date().required('End Date is required'),
    appraisal_startTime: Yup.string()
        .required('Start Time is required')
        .matches(
            /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            'Invalid time format (HH:MM)'
        ),
    appraisal_endTime: Yup.string()
        .required('End Time is required')
        .matches(
            /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            'Invalid time format (HH:MM)'
        ),
    goalTimeline_startDate: Yup.string().when('goal', {
        is: true,
        then: Yup.string()
            .required('Start date is required'),

        otherwise: Yup.string(),
    }),
    goalTimeline_endDate: Yup.string().when('goal', {
        is: true,
        then: Yup.string()
            .required('End date is required'),
        otherwise: Yup.string(),
    }),
    interim_startDate: Yup.string().when('interim', {
        is: true,
        then: Yup.string()
            .required('Start date is required'),
        otherwise: Yup.string(),
    }),
    interim_endDate: Yup.string().when('interim', {
        is: true,
        then: Yup.string()
            .required('End date is required'),
        otherwise: Yup.string(),
    }),
    regularCheck_ins: Yup.string().when('regular', {
        is: true,
        then: Yup.string().required('At least one option must be selected'),
        otherwise: Yup.string(),
    }),



});

