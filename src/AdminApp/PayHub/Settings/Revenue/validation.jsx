import * as Yup from 'yup';

export const revenueSchema = Yup.object().shape({
    name: Yup.string().required('Revenue Name is required'),
});