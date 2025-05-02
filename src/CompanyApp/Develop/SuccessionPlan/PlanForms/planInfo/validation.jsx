import * as Yup from "yup";

export const planInfoValidation = Yup.object().shape({
    planName: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("Please provide the Plan Name"),
    planType: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("Please provide the Plan Name"),
    typeOfSuccessor: Yup.string().required("Please select the Plan Type"),
    createdDate: Yup.string().required("Please select the Plan Type"),
    jobTitlesId: Yup.string().when('planType', {
        is: 1,
        then: Yup.string()
            .required('Please select the Position'),
        otherwise: Yup.string(),
    }),
    employeeId: Yup.string().when('planType', {
        is: 2,
        then: Yup.string()
            .required('Please select the Person'),
        otherwise: Yup.string(),
    }),
});

