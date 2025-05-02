import * as Yup from "yup";

export const meetingInfoValidation = Yup.object().shape({

    title: Yup.string().required("Please provide Title"),
    successionId: Yup.string().required("Please provide Plan"),
    topic: Yup.string().required("Please provide Topic"),
    location: Yup.string().required("Please provide location"),
    submissionDate: Yup.string().required("Please select start Date"),
});