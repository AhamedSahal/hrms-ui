import * as Yup from 'yup';

export const talentMeetingSchema = Yup.object().shape({
    startReminder: Yup.number()
        .required('Please provide no. of days'),
    endReminder: Yup.number()
        .required('Please provide no. of days'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date().required('End date is required'),
    startTime: Yup.string().required('Start time is required'),
    endTime: Yup.string().required('End time is required'),

});