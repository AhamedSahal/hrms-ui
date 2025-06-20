import * as Yup from 'yup';

export const taskValidationSchema = Yup.object().shape({
  name: Yup.string().required('Task Name is required')
    .max(200, 'Task name should be up to 200 characters.')
    .matches(
      /^[a-zA-Z0-9 _.,\-(){}\[\]/']+$/,
      "Task name contains only letters, numbers, space, _ , . - ( ) { } [ ] / '"
    ),

  description: Yup.string().required('Description is required')
    .max(200, 'Description should be up to 200 characters.'),

  assign: Yup.string().required('Assign To is required'),

  dueOn: Yup.string().required('Due Date is required'),
  numberofDays: Yup.number().when('dueOn', {
    is: (value) => value && value !== '3',
    then: Yup.number().required('Number of days is required').positive('Number of days must be positive').integer('Number of days must be an integer'),
    otherwise: Yup.number().notRequired()
  }),

  departments: Yup.array()
    .transform((value, originalValue) => {
      if (originalValue === null || originalValue === undefined) return [];
      if (typeof originalValue === 'string') return [originalValue];
      return originalValue;
    })
    .when("assign", {
      is: "0",
      then: Yup.array().min(1, "Select at least one department")
    }),

  branches: Yup.array()
    .transform((value, originalValue) => {
      if (originalValue === null || originalValue === undefined) return [];
      if (typeof originalValue === 'string') return [originalValue];
      return originalValue;
    })
    .when("assign", {
      is: "1",
      then: Yup.array().min(1, "Select at least one location")
    }),


  employeeId: Yup.array()
    .transform((value, originalValue) => {
      if (originalValue === null || originalValue === undefined) return [];
      if (typeof originalValue === 'string') return [originalValue];
      return originalValue;
    })
    .when("assign", {
      is: "2",
      then: Yup.array().min(1, "Select at least one employee")
    }),

  subtasks: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Subtask Name is required')
        .max(200, 'Subtask name should be up to 200 characters.')
        .matches(
          /^[a-zA-Z0-9 _.,\-(){}\[\]/']+$/,
          "Subtask name contains only letters, numbers, space, _ , . - ( ) { } [ ] / '"
        ),
      assign: Yup.string().required('Assign To is required'),
      dueOn: Yup.string().required('Due Date is required'),
      numberofDays: Yup.number().when('dueOn', {
        is: (value) => value && value !== '3',
        then: Yup.number().required('Number of days is required').positive('Number of days must be positive').integer('Number of days must be an integer'),
        otherwise: Yup.number().notRequired()
      }),

      departments: Yup.array()
        .transform((value, originalValue) => {
          if (originalValue === null || originalValue === undefined) return [];
          if (typeof originalValue === 'string') return [originalValue];
          return originalValue;
        })
        .when("assign", {
          is: "0",
          then: Yup.array().min(1, "Select at least one department")
        }),

      branches: Yup.array()
        .transform((value, originalValue) => {
          if (originalValue === null || originalValue === undefined) return [];
          if (typeof originalValue === 'string') return [originalValue];
          return originalValue;
        })
        .when("assign", {
          is: "1",
          then: Yup.array().min(1, "Select at least one location")
        }),


      employeeId: Yup.array()
        .transform((value, originalValue) => {
          if (originalValue === null || originalValue === undefined) return [];
          if (typeof originalValue === 'string') return [originalValue];
          return originalValue;
        })
        .when("assign", {
          is: "2",
          then: Yup.array().min(1, "Select at least one employee")
        }),
    })
  )
});

export const CheckListSchema = Yup.object().shape({
  name: Yup.string()
    .required('Checklist name is required.')
    .max(200, 'Checklist name should be up to 200 characters.')
    .matches(
      /^[a-zA-Z0-9 _.,\-(){}\[\]/']+$/,
      "Checklist name contains only letters, numbers, space, _ , . - ( ) { } [ ] / '"
    ),

  description: Yup.string()
    .required('Description is required.')
    .max(200, 'Description should be up to 200 characters.'),

  assign: Yup.string()
    .required('Applicable To is required.'),

  departments: Yup.array()
    .transform((value, originalValue) => {
      if (originalValue === null || originalValue === undefined) return [];
      if (typeof originalValue === 'string') return [originalValue];
      return originalValue;
    })
    .when("assign", {
      is: "1",
      then: Yup.array().min(1, "Select at least one department"),
      otherwise: Yup.array().nullable()
    }),


  branches: Yup.array()
    .transform((value, originalValue) => {
      if (originalValue === null || originalValue === undefined) return [];
      if (typeof originalValue === 'string') return [originalValue];
      return originalValue;
    })
    .when("assign", {
      is: "2",
      then: Yup.array().min(1, "Select at least one location"),
      otherwise: Yup.array().nullable()
    }),

  jobtitle: Yup.array()
    .transform((value, originalValue) => {
      if (originalValue === null || originalValue === undefined) return [];
      if (typeof originalValue === 'string') return [originalValue];
      return originalValue;
    })
    .when("assign", {
      is: "3",
      then: Yup.array().min(1, "Select at least one job title"),
      otherwise: Yup.array().nullable()
    }),


});