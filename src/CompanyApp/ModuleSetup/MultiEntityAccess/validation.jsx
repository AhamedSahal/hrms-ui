import * as Yup from 'yup';

export const MultiEntityAccessValidation = Yup.object().shape({
    employeeId: Yup.string().required('Please Select Employee'),
    companyId: Yup.string().required('Please Select Company'),
    accessCompanyId: Yup.string().required('Please Select Access Company'),
    roleId: Yup.string().required('Please Select Role'),
})