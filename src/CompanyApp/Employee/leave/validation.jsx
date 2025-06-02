import * as Yup from 'yup';
import { getUserType } from '../../../utility';

export const LeaveSchema = Yup.object().shape({
    
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