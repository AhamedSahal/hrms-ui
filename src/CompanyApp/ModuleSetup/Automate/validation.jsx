import * as Yup from 'yup';




export const WorkflowStepSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name is Too Short!')
        .max(100, 'Name is Too Long!')
        .required('Please Provide Step name'),
    assign: Yup.string()
        .required('Please Select Assignee'),
    employeeId: Yup.number()
        .when('assign', {
            is: '0',
            then: Yup.number().min(1, 'Employee is required').required('Employee is required'),
            otherwise: Yup.number().notRequired(),

        }),
        roleId: Yup.number()
        .when('assign', {
            is: '1',
            then: Yup.number().min(1, 'Role is required').required('Role is required'),
            otherwise: Yup.number().notRequired(),

        }),
    checked: Yup.array()
        .min(1, 'Please Provide One Action'),
 
        


});