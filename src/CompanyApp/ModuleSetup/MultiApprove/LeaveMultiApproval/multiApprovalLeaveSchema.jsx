import * as Yup from 'yup';


export const multiApprovalLeaveSchema = Yup.object().shape({
    approvers: Yup.number()
        .min(1, 'Too Short!')
        .required('Please provide Days')
        .typeError('Please enter number only'),
        moveToNextLevelCount: Yup.number().moreThan(0,'Too Short!')
        .min(1, 'Too Short!')
        .required('Please provide move to next level count')
        .typeError('Please enter number only'),
        inDays: Yup.number().moreThan(0,'Too short!')
        .test('No leading zeros allowed', value => {
            return value && !/^0\d+/.test(String(value));
          })
          .min(1, 'Day cannot be less than 1')
          
});