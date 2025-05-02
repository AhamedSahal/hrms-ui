import * as Yup from 'yup';

export const industrySchema = Yup.object().shape({
    name: Yup.string().required('Region Name is required'),
});