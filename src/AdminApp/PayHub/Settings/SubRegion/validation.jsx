import * as Yup from 'yup';

export const subRegionSchema = Yup.object().shape({
    subRegion: Yup.string().required('Region Name is required'),
    regionId: Yup.string().required('Select the Region'),
});