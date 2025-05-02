import * as Yup from 'yup';


export const OverallScoreSchema = Yup.object().shape({ 
    rating: Yup.number()
    .min(1, 'Please enter number betwen 1-5 only!')
    .max(5, 'Please enter number betwen 1-5 only!')
    .required('Please provide rating')
    .typeError('Please enter number betwen 1-5 only'),
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(500, 'Too Long!')
        .required('Please provide Name'),

    scoreFrom: Yup.number()
        .min(1, 'Too Short!')
        .required('Please provide score from')
        .typeError('Please enter number only'),

    scoreTo: Yup.number()
        .min(1, 'Too Short!')
        .required('Please provide score to')
        .typeError('Please enter number only')
        .when('scoreFrom', (scoreFrom) => {
            if (scoreFrom) {
                return Yup.date()
                    .min(scoreFrom, 'score to must be greater or equal to score from')
                    .typeError('Score to is required')
            }
        }),
});