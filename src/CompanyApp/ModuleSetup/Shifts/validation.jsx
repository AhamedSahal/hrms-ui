import * as Yup from 'yup';

export const ShiftsSchema = Yup.object().shape({
  shiftname: Yup.string()
    .required('Please provide shift name'),

  shiftcodename: Yup.string()
    .required('Please provide shift code name'),

  shiftstarttime: Yup.string()
    .when('NoShift', ([NoShift], schema) => {
      return NoShift ? schema.notRequired() : schema.required('Please provide shift start time');
    }),

  breaktime: Yup.string()
    .when('NoShift', ([NoShift], schema) => {
      return NoShift ? schema.notRequired() : schema.required('Please provide break time');
    }),

  shiftendtime: Yup.string()
    .when('NoShift', ([NoShift], schema) => {
      return NoShift ? schema.notRequired() : schema.required('Please provide shift end time');
    }),
});
