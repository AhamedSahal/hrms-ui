import * as Yup from 'yup';

export const QuestionSchema = Yup.object().shape({
    question: Yup.string()
        .required('Please provide Question'),
    categoryId: Yup.number()
        .required('Please select Category'),
    answerType: Yup.string()
        .required('Please select Answer Type'),
    sortOrder: Yup.number()
        .required('Please Enter Sort Order'),

});