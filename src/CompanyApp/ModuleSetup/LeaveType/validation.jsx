import * as Yup from 'yup';

export const LeaveTypeSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Please provide Title'),

  days: Yup.number()
    .typeError('Please enter number only')
    .min(1, 'Too Short!')
    .required('Please provide Days'),

  carryexpiryDate: Yup.string().when(['carryForward', 'entStartMode'], 
    ([carryForward, entStartMode], schema) => {
      return carryForward && Number(entStartMode) === 0
        ? schema.required('Please provide Expiry Date')
        : schema.notRequired();
  }),

  futureexpiryDate: Yup.string().when(['futureYearLeave', 'entStartMode'], 
    ([futureYearLeave, entStartMode], schema) => {
      return futureYearLeave && Number(entStartMode) === 0
        ? schema.required('Please provide Opening Date')
        : schema.notRequired();
  }),

  carrymaxLimit: Yup.number().when(['carryForward'], 
    ([carryForward], schema) => {
      return carryForward
        ? schema.min(1, 'Max Limit should not be zero').required('Please Enter Max Limit')
        : schema.notRequired();
  }),

  negativebalmaxLimit: Yup.number().when(['negativeBalance'], 
    ([negativeBalance], schema) => {
      return negativeBalance
        ? schema.min(1, 'Max Limit should not be zero').required('Please Enter Max Limit')
        : schema.notRequired();
  }),
});
