import * as Yup from "yup";

export const AssetSchema = Yup.object().shape({
    serialno: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("Please provide serial no"),
  //  employeeId: Yup.string().required("Please select Employee"),
 
  assetCatId: Yup.number().min(1,'Please select Category')
  .required('Please select Category'),
  assetId: Yup.number().min(1,'Please select Asset')
  .required('Please select Asset'), 
  assignDate: Yup.string().nullable().when("employeeId", {
    is: (value) => value !== null && value !== undefined,
    then: (schema) => schema.required("Please select assign Date"), 
  }),
});
