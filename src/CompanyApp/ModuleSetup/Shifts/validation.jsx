import * as Yup from 'yup';

export const ShiftsSchema = Yup.object().shape({
    shiftname: Yup.string()
        .required('Please provide shift name'),
    shiftcodename: Yup.string()
        .required('Please provide shift code name'),
    shiftstarttime: Yup.string()
        .when('NoShift', {
            is: (NoShift) => true,
            then: Yup.string().notRequired(),
            otherwise: Yup.string().required('Please provide shift start time')
        }),
    breaktime: Yup.string()
        .when('NoShift', {
            is: (NoShift) => true,
            then: Yup.string().notRequired(),
            otherwise: Yup.string().required('Please provide break time')
        }),
    shiftendtime: Yup.string()
        .when('NoShift', {
            is: (NoShift) => true,
            then: Yup.string().notRequired(),
            otherwise: Yup.string().required('Please provide shift end time')
        }),
    // employeeId: Yup.number()
    // .when('leaveTypeId', {
    //     is: (employeeId) => isEmployee,
    //     then: Yup.string().notRequired(),

    // }),
    // shiftstarttime: Yup.string()
    //     .required('Please provide shift start time'),
    // shiftendtime: Yup.string()
    //     .required('Please provide shift end time'),
    // breaktime: Yup.number() 
    //     .typeError('Please enter number only'),
});