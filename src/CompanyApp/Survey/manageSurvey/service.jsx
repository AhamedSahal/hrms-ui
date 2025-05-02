import { deleteWithAuthSurvey, getWithAuthSurvey, postWithAuthSurvey, putWithAuthSurvey } from "../../../HttpRequest";
import { getPaginationQueryString, getCompanyId } from "../../../utility";

const servicePath = "/survey";

export function getActiveList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}/active?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&companyId=${getCompanyId()}`;
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getDraftList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}/draft?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&companyId=${getCompanyId()}`;
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getTemplateList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}/template?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&companyId=${getCompanyId()}`;
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getStandByList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}/stand-by?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&companyId=${getCompanyId()}`;
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getScheduledList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}/scheduled?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&companyId=${getCompanyId()}`;
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getCompletedList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}/completed?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&companyId=${getCompanyId()}`;
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function saveSurvey(survey) {
    survey.companyId = getCompanyId();
    if (!survey.id || survey.id === 0) {
        let post = postWithAuthSurvey('survey', survey);
        return post.then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            console.log({ err })
            return Promise.reject(err);
        });
    } else {
        let post = putWithAuthSurvey(`survey`, survey);
        return post.then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            console.log({ err })
            return Promise.reject(err);
        });
    }
}
export function deleteSurvey(id) {
    let path = servicePath + "?id=" + encodeURIComponent(id);
    return deleteWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function publishSurvey(id) {
    let path = `${servicePath}/publish` + "?id=" + encodeURIComponent(id);
    return postWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function suspendSurvey(data) {
    let path = `${servicePath}/suspend`;
    return postWithAuthSurvey(path, data).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getSurveyByLanguageIdAndSurveyId(surveyId, languageId) {
    let path = `${servicePath}/survey` + "?languageId=" + encodeURIComponent(languageId) + "&surveyId=" + encodeURIComponent(surveyId) + "&companyId=" + getCompanyId();
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
    export function getSurveyById(surveyId){
        let path = `${servicePath}/id`+'?surveyId='+ encodeURIComponent(surveyId);
        return getWithAuthSurvey(path).then(res =>{
            return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
    }

    // get Participated Info
    export function getSurveyByParticipated(surveyId){
        let path = `${servicePath}/participated`+'?surveyId='+ encodeURIComponent(surveyId) +"&companyId=" + getCompanyId();
        return getWithAuthSurvey(path).then(res =>{
            return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
    }

    // get Participated completed Info
    export function getSurveyByParticipatedCompleted(surveyId){
        let path = `${servicePath}/participatedCompleted`+'?surveyId='+ encodeURIComponent(surveyId) +"&companyId=" + getCompanyId();
        return getWithAuthSurvey(path).then(res =>{
            return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
    }

