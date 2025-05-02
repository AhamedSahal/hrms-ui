import * as Yup from 'yup';


export const JobProfileSchema = Yup.object().shape({ 
    branchId: Yup.string().nullable().required("Please provide Location"),
    
    
});


