import * as Yup from 'yup';
import { getUserType } from '../../utility';
const isEmployee = getUserType() == 'EMPLOYEE';

export const RecognitionSchema = Yup.object().shape({ 
    employeeId: Yup.number()
        .min(1, 'Employee is required')
        .required('Employee is required'), 
    recognitionId: Yup.number()
        .min(1,'Please  select category'),
    reccommentss: Yup.string().max(20, 'Too Long!')
        .required('Please provide reason for recognition'),
});