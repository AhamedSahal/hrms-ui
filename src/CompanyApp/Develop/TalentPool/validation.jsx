import * as Yup from "yup";

export const validateTalentPool = Yup.object().shape({
    poolName: Yup.string()
        .min(1, "Too Short!")
        .max(50, "Too Long!")
        .required("Please provide pool name"),
    poolDate: Yup.string().required("Please select the Date")

});
