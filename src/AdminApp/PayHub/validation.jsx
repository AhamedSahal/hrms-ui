
import * as Yup from 'yup';

export const payHubBulkSchema = Yup.object().shape({
    regionId: Yup.string().required('Please select the Region'),
    year: Yup.string().required('Year is Required'),
    subRegionId: Yup.string().required('Sub Region is required'),
    revenueId: Yup.string().required('Select the Revenue'),
    industryId: Yup.string().required('Select the Industry'),
    importType: Yup.string().required('Select the Import Type'),
});