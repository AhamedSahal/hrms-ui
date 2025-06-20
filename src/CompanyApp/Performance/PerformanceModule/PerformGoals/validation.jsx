import * as Yup from 'yup';

export const PerformanceGoalSchema = Yup.object().shape({
  employeeId: Yup.number()
    .required('Please select an employee')
    .min(1, 'Please select an employee'),

  name: Yup.string()
    .required('Goal name is required'),

  description: Yup.string()
    .required('Description is required'),

  priority: Yup.string()
    .required('Priority is required'),

  deadline: Yup.string()
    .required('Deadline is required'),

  active: Yup.boolean(),

  subGoalsData: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .required('Sub Goal name is required'),

      description: Yup.string()
        .required('Sub Goal description is required'),

      priority: Yup.string()
        .required('Sub Goal priority is required'),

      deadline: Yup.string()
        .required('Sub Goal deadline is required'),

      goalWeightage: Yup.number()
        .nullable()
        .when('$issubGoalWeightage', {
          is: false, 
          then: schema => schema
            .required('Sub Goal weightage is required')
            .min(1, 'Minimum weightage is 1')
            .max(99, 'Maximum manual weightage is 99'),
          otherwise: schema => schema.notRequired()
        }),

      active: Yup.boolean().required('Active status is required')
    })
  )
});








export const PerformanceSubGoalSchema = Yup.object().shape({
//  employeeId: Yup.number()
//     .typeError('Employee is required')
//     .required('Employee is required')
//     .moreThan(0, 'Employee is required'),

    
  name: Yup.string()
    .required("Sub Goal name is required"),


  description: Yup.string()
    .required("Description is required"),

  priority: Yup.string()
    .required("Priority is required"),

  deadline: Yup.string()
        .required("Deadline is required"),
});
