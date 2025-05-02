import * as Yup from "yup";

export const TaskSchema = Yup.object().shape({
  taskname: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Please provide title"),  
  startdate: Yup.date().required("Please provide start date"),
  enddate: Yup
    .date()
    .required("please provide end date"),
});
