import * as Yup from 'yup'; 

export const WeekOffSchema = Yup.object().shape({   
    weekoffname: Yup.string()
        .required('Please provide Week Off name'),
    weekoffcodename: Yup.string()
        .required('Please provide Week Off code name'), 
    weeklyOffs: Yup.string()  
        .required('Please select Weekly off')
});