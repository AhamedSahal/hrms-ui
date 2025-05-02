import * as Yup from 'yup';
import { getUserType } from '../../../utility';
const isEmployee = getUserType() == 'EMPLOYEE';

export const TicketSchema = Yup.object().shape({
     
    priority: Yup.string()
        .required('Please Select Ticket Type'),
    subject: Yup.string()
        .required('Please provide Ticket Reason'),
    description: Yup.string()
        .required('Please provide Start Date'),
    endDate: Yup.string()
        .required('Please provide End Date'),
});