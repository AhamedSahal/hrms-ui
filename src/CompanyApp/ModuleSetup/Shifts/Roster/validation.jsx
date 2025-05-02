import * as Yup from 'yup'; 

export const RosterSchema = Yup.object().shape({   
    rostername: Yup.string()
        .required('Please provide Roster name'),
    rotationReq: Yup.string()
        .required('Please choose rotation required'),  
    shiftrepeat: Yup.number()
        .when('rotationReq', {
            is: 'no',
            then: Yup.number().notRequired(),
            otherwise: Yup.number().min(1, 'Shift Repetition days required').required('Shift Repetition days required')
        }),
    shiftId:Yup.number()
        .when('rotationReq', {
            is: 'yes',
            then: Yup.number().notRequired(),
            otherwise: Yup.number().min(1, 'Please select shift').required('Please select shift')
        }),
    weekoffId: Yup.number()
        .min(1,'Please select weekly off')
        .required('Please select weekly off'),
    effectivedate: Yup.string()
        .required('Please provide effective date'), 
    enddatenever: Yup.string()
        .required('Please choose Roster ends'), 
    enddate: Yup.string()
    .when('enddatenever', {
        is: 'yes',
        then: Yup.string().required('Please provide end date'),
        otherwise: Yup.string().notRequired()
    }),
});