import * as Yup from 'yup';

export const oneOnOneSchema = Yup.object().shape({
    title: Yup.string()
        .required('Please provide title'),
    dateAndTime: Yup.string()
        .required('Please provide date And Time'),
        meetingType: Yup.string()
        .required('Please provide meeting Type'),
        employeeId: Yup.string()
        .required('Please provide employeeId').nullable('Please provide employeeId'),
        reviewer: Yup.string()
        .required('Please provide reviewer').nullable('Please provide reviewer'),

});