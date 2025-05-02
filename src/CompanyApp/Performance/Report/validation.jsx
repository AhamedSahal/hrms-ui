import * as Yup from 'yup';


export const PerformanceReviewSchema = Yup.object().shape({ 
    fromDate: Yup.string().nullable()
        .required('Please provide Review Period From Date'),
    toDate: Yup.string().nullable()
        .required('Please provide Review Period To Date'),
    templateId: Yup.string().nullable()
        .required('Please select Performance Review Template'),
    employeeId: Yup.string().nullable()
        .required('Please select Employee'),

});