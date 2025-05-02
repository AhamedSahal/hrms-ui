import { yupToFormErrors } from 'formik';
import * as  Yup from 'yup';

export const rosterschema = Yup.object().shape({
    Shiftstarttime: Yup.string()
        .required('please check start time'),
    Shiftendtime: Yup.string()
        .required('please check end time'),
    rosterId: Yup.string()
        .required('Please select roster'),
    weekoffId: Yup.string()
        .required('Please select weekoff'),
});