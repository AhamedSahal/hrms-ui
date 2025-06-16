import * as Yup from 'yup';
import { getUserType } from '../../../utility';
const isEmployee = getUserType() == 'EMPLOYEE';

export const TicketSchema = Yup.object().shape({
    priority: Yup.string()
        .required('Please select a priority'),
    subject: Yup.string()
        .required('Please provide a subject'),
    endDate: Yup.string()
        .required('Please provide an end date'),
});