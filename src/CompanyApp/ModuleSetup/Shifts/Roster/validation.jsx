import * as Yup from 'yup'; 

export const RosterSchema = Yup.object().shape({   
    rostername: Yup.string()
        .required('Please provide Roster name'),
    rotationReq: Yup.string()
        .required('Please choose rotation required'),  
    shiftrepeat: Yup.number()
        .when('rotationReq', ([rotationReq], schema) => {
            return rotationReq === 'no'
                ? schema.notRequired()
                : schema.min(1, 'Shift Repetition days required').required('Shift Repetition days required');
        }),
    // shiftId:Yup.number()
    //     .when('rotationReq', ([rotationReq], schema) => {
    //         return rotationReq === 'no'
    //             ? schema.notRequired()
    //             : schema.min(1, 'Please select shift').required('Please select shift');
    //     }),
    weekoffId: Yup.number()
    .required('Week off is required')
    .moreThan(0, 'Please select a valid weekly off'),
    effectivedate: Yup.string()
        .required('Please provide effective date'),
    enddatenever: Yup.string()
        .required('Please choose Roster ends'), 
    enddate: Yup.string()
    .when('enddatenever', ([enddatenever], schema) => {
        return enddatenever === 'yes'
            ? schema.required('Please provide end date')
            : schema.notRequired();
    }),
});