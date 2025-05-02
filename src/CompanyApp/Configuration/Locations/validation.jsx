import * as Yup from 'yup';

export const LocationSchema = Yup.object().shape({
    name: Yup.string().required("Please  provide Name"),
    latitude: Yup.number().required("Please provide Latitude"),
    longitude: Yup.number().required("Please provide Longitude"),
    radius: Yup.number().required("Please provide Radius In Meter")
});