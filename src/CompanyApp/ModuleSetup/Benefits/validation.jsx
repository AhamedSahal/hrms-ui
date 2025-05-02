import * as Yup from 'yup';

export const BenefitsModuleSetupSchema = Yup.object().shape({
    paymenttype: Yup.string().nullable().required("Please Provide Payment Type"),
    paymentcycle: Yup.string().nullable().required("Please Provide payment Cycle"),
    eligibility: Yup.string().nullable().required("Please Provide Eligibility")
})