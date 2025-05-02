import { getWithAuthSurvey, postWithAuthSurvey, putWithAuthSurvey } from "../../../../HttpRequest";
import { getPaginationQueryString } from '../../../../utility';

const servicePath = "/survey-report";

export function getCumulativeScore(surveyId) {
    let path = `${servicePath}/cumulative-score?surveyId=${surveyId}`;
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getSurveyAttendee(searchText, pageNumber, pageSize, sort, surveyId) {
    let path = `${servicePath}/attendee-list?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&surveyId=${surveyId}`;
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getAllQuestionAndAnswer(surveyId, participantId) {
    let path = `${servicePath}/view-response/?participantId=${participantId}&surveyId=${surveyId}`;
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);

    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getQuestionLevelReport(surveyId) {
    let path = `${servicePath}/question-level-report?surveyId=${surveyId}`;
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);

    }).catch(err => {
        return Promise.reject(err);
    });
}

