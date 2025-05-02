import * as Yup from 'yup';


export const PermissionTypeSchema = Yup.object().shape({
    name: Yup.string().required('Permission Name is required'),
    permissionCriteria: Yup.string().required('Permission Criteria is required'),
    totalAllowedTime: Yup.number().when('permissionCriteria', {
      is: '3',
      then: Yup.number().min(1, 'Total Allowed Time is required').required('Total Allowed Time is required'),
    }),
    minReq: Yup.number().when('permissionCriteria', {
      is: '3',
      then: Yup.number().min(1, 'Min Time Per Request is required').required('Min Time Per Request is required'),
    }),
    maxReq: Yup.number().when('permissionCriteria', {
      is: '3',
      then: Yup.number().min(1, 'Max Time Per Request is required').required('Max Time Per Request is required'),
    }),
    allowedReq: Yup.number().when('isEnableReqLimit', {
      is: true,
      then: Yup.number().min(1, 'Number of Allowed Requests is required').required('Number of Allowed Requests is required'),
    }),
    
    // Custom validation for request type
    permissionType: Yup.object().shape({
      lateClockIn: Yup.boolean(),
      earlyClockIn: Yup.boolean(),
      earlyClockOut: Yup.boolean(),
    }).test('is-one-selected', 'At least one Request Type must be enabled', function (value) {
      return value.lateClockIn || value.earlyClockIn || value.earlyClockOut;
    }),
    
});