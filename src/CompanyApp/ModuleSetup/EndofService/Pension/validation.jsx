import * as Yup from 'yup';

export const PensionSchema = Yup.object().shape({
    pensionName: Yup.string()
        .required('Pension Name is required'),
    employeeContribution: Yup.number()
        .required('Employee Contribution is required')
        .min(0, 'Employee Contribution must be greater than or equal to 0')
        .max(100, 'Employee Contribution must be less than or equal to 100'),
    employerContribution: Yup.number()
        .required('Employer Contribution is required')
        .min(0, 'Employer Contribution must be greater than or equal to 0')
        .max(100, 'Employer Contribution must be less than or equal to 100'),
    governmentContribution: Yup.number()
        .min(0, 'Government Contribution must be greater than or equal to 0')
        .max(100, 'Government Contribution must be less than or equal to 100'),
    pensionComponent: Yup.array()
        .min(1, 'At least one Pension Component must be selected')
        .required('Pension Component is required'),
});
