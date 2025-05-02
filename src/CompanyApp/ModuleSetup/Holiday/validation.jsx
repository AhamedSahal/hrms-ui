import * as Yup from 'yup';


export const HolidaySchema = Yup.object().shape({
    occasion: Yup.string()
        .max(21, 'Occasion must not exceed 21 characters')
        .matches(/^(?!\s*$).+/, "Occasion cannot be empty or just spaces")
        .required('Please provide occasion'),
    date: Yup.string()
        .required('Please provide date')
});