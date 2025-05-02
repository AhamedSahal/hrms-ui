import * as Yup from "yup";


export const ownerFormValidation = Yup.object().shape({
    ownerType: Yup.string().required('Owner Type is required').oneOf(['1', '2', '3'], 'Invalid Owner Type'),
    employeeId: Yup.string().required("Please select the Owner")
  });

