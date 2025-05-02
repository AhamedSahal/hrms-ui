import * as Yup from "yup";

export const GradingStructureSchema = Yup.object().shape({
    refLevelId: Yup.number()
        .min(1, "Please provide reference level"),
    gradesId: Yup.number()
        .min(1, 'Please  select grades'),
    rolesname: Yup.string().required("Please provide typical role")
});
