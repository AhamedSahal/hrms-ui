import { deleteWithAuth, deleteWithAuthSurvey, getWithAuth, getWithAuthSurvey, patchWithAuth, postWithAuth, postWithAuthSurvey, putWithAuth, putWithAuthSurvey } from "../../../../HttpRequest";
import { getPaginationQueryString, getCompanyId } from "../../../../utility";

const servicePath = "/survey-message-template";

export function getSurveyMessage(id) {
    let path = `${servicePath}?surveyId=${id}&companyId=${getCompanyId()}`;
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveSurveyMessage(surveyTemplate) {
    surveyTemplate.companyId = getCompanyId();
    let post = surveyTemplate.id == 0 ? postWithAuthSurvey(`${servicePath}`,surveyTemplate) :
    putWithAuthSurvey(`${servicePath}`,surveyTemplate);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });

}

export function getCompanyName() {
    let companyId = getCompanyId();
    let path = `company/company-name?companyId=${companyId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}