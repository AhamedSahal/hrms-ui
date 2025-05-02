import * as Yup from 'yup';

export const regionSchema = Yup.object().shape({
    name: Yup.string().required('Region Name is required'),
});