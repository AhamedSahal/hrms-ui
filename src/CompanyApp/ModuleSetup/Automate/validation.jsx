import * as Yup from 'yup';

export const WorkflowStepSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is Too Short!')
    .max(100, 'Name is Too Long!')
    .required('Please Provide Step name'),

  assign: Yup.string().required('Please Select Assignee'),

  employeeId: Yup.number()
    .nullable()
    .when('assign', ([assign], schema) => {
      return assign === '0'
        ? schema.min(1, 'Employee is required').required('Employee is required')
        : schema.notRequired();
    }),

  roleId: Yup.number()
    .nullable()
    .when('assign', ([assign], schema) => {
      return assign === '1'
        ? schema.min(1, 'Role is required').required('Role is required')
        : schema.notRequired();
    }),

  checked: Yup.array()
    .min(1, 'Please Provide One Action'),
});
