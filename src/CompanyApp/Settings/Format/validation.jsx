import * as Yup from 'yup';


export const FormatSchema = Yup.object().shape({
    currencySymbol: Yup.string()
        .required('Please provide Currency Symbol'),
    dateFormat: Yup.string()
        .required('Please provide Date Format'),
    dateTimeFormat: Yup.string()
        .required('Please provide Date Time Format'),
    shiftStart: Yup.string()
        .required('Please provide Shift Start'),
    shiftEnd: Yup.string()
        .required('Please provide Shift End'),
    breakTime: Yup.string()
        .required('Please provide Break Time'),
    employeeIdFormat: Yup.string()
    .required('Please provide Employee Id Format (Refer ToolTip)')
    .test(
        'is-valid-employee-id',
        'Special characters should be present either prefix or suffix.',
        value => {
            // Regex pattern

         const regex = /^(?:[#\\_,()&][a-zA-Z0-9]+|[a-zA-Z0-9]+[#\\_,()&])$/;

            let onlyStringRegex = /^[A-Za-z]*$/
            if(onlyStringRegex.test(value)){
                return onlyStringRegex.test(value);
            } else{
                return regex.test(value);   
               
            }           
        }
    )
       
        
});