import * as Yup from "yup";

export const AssetCategorySchema = Yup.object().shape({  
 
  // assetCatId: Yup.number().min(1,'Please select Category')
  // .required('Please select Category')
});
