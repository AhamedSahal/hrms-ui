import * as Yup from 'yup';
import { getUserType } from '../../../utility';
const isEmployee = getUserType() == 'EMPLOYEE';

export const LeaveSchema = Yup.object().shape({
    employeeId: Yup.number()
        .when('leaveTypeId', {
            is: (employeeId) => isEmployee,
            then: Yup.number().notRequired(),
            otherwise: Yup.number().min(1, 'Employee is required').required('Employee is required')
        }),
    leaveTypeId: Yup.string()
        .required('Please Select Leave Type'),
    leaveReason: Yup.string()
        .required('Please provide Leave Reason'),
    startDate: Yup.string()
        .required('Please provide Start Date'),
    endDate: Yup.string()
        .required('Please provide End Date'),
    // startDateDayType: Yup.string()
    //     .required('Please select DayType'),
    // endDateDayType: Yup.string().when(['startDate', 'endDate'], {
    //     is: (startDate, endDate) => startDate && endDate && new Date(startDate) < new Date(endDate),
    //     then: Yup.string().required('Please select DayType'),
    //     otherwise: Yup.string() 
    //     })
    });