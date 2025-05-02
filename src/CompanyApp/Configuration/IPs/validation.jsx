import * as Yup from 'yup';
const ipRegex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;

export const IPSchema = Yup.object().shape({
    name: Yup.string().required("Please provide Name"),
    ip: Yup.string()
        .required("Please provide IP Address")
        .matches(ipRegex, "Please provide a valid IP address")
});