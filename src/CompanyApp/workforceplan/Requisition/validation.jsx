import * as Yup from 'yup'; 

export const RequisitionSchema = Yup.object().shape({ 
    role: Yup.string() 
        .max(50, 'Too Long!')
        .required('Please provide Job Titles'),
    noofresources: Yup.number().min(1,'Please provide no of resources')
        .required('Please provide no of resources')
        .typeError('Please enter number only'),
    reqinitiateddate: Yup.string()
        .required('Please provide Requisition Initiated Date'),
    resneeddate: Yup.string()
        .required('Please provide Expected Start Date'),
    req_type: Yup.string()
        .min(1,'Please provide Requisition Type'),
    forecastId: Yup.number()
        .min(1,'Please provide Job Titles'),
    departmentId: Yup.number()
        .min(1,'Please provide Department'),
    rec_reason:Yup.string()
        .min(1,'Please provide Recruitment Reason'),
    res_type: Yup.string()
        .min(1,'Please provide Resource Type'),
    pos_type: Yup.string()
        .min(1,'Please provide Position Type'),
    noofmonths: Yup.number()
        .required('Please provide No of Months')
        .typeError('Please enter number only'),
    reportingManagerId: Yup.number()
        .min(1,'Please provide Reporting Manager')
   
});