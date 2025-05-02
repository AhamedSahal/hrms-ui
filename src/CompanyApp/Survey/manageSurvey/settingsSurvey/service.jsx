import { deleteWithAuth, deleteWithAuthSurvey, getWithAuthSurvey, patchWithAuth, postWithAuth, postWithAuthSurvey, putWithAuth, putWithAuthSurvey, getWithAuth} from "../../../../HttpRequest";
import { getCompanyId, getPaginationQueryString } from "../../../../utility";

const servicePath = "/survey-settings";

export function getSurveySettings(id) {
    let path = `${servicePath}?surveyId=${id}&companyId=${getCompanyId()}`;
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveSurveySettings(surveySetting) {
    surveySetting.companyId= getCompanyId();
    let post = putWithAuthSurvey(`${servicePath}`,surveySetting);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function getLanguages() {
    let path = `/languages/select`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}