import * as Yup from 'yup';
import { getUserType } from '../../../../utility';
import moment from 'moment';
const isEmployee = getUserType() == 'EMPLOYEE';

export const NewPermissionSchema = Yup.object().shape({
    employeeId: Yup.number()
        .required('Employee is required'),
    permissionType: Yup.string()
        .required('Permission Type is required'),

    reason: Yup.string()
        .required('Reason is Required'),
    startDate: Yup.string().required('Start Date & End Date is required'),
    // startTime: Yup.string()
    //     .required('Please provide Start Time'),
    // endTime: Yup.string()
    //     .required('Please provide End Time'),
    startTime: Yup.string().when('permissionType', {
        is: (permissionType) => permissionType === '1' || permissionType === '3',
        then: Yup.string().required('Start Time is required'),
        otherwise: Yup.string().nullable(), // No validation if permissionType is '2'
    }),

    endTime: Yup.string().when('permissionType', {
        is: (permissionType) => permissionType === '2' || permissionType === '3',
        then: Yup.string().required('End Time is required'),
        otherwise: Yup.string().nullable(), // No validation if permissionType is '1'
    }),
    hours: Yup.number().when('permissionType', {
        is: (permissionType) => permissionType === '4',
        then: Yup.string().required('Hours are required'),
    }),
    minutes: Yup.number().when('permissionType', {
        is: (permissionType) => permissionType === '4',
        then: Yup.string().required('Hours are required')
            .min(0, 'Minutes must be at least 0')
            .max(59, 'Minutes must be less than 60'),
    }),
});