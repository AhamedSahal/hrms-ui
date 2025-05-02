import { deleteWithAuthSurvey, getWithAuth, getWithAuthSurvey, patchWithAuthSurvey, postWithAuthSurvey, putWithAuthSurvey } from "../../../../HttpRequest";
import { getCompanyId, getPaginationQueryString } from "../../../../utility";

const servicePath = "/participant";

export function getSurveyParticipantList(status, surveyId) {
    let path = `${servicePath}?status=${status}&surveyId=${surveyId}&companyId=${getCompanyId()}`;
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getEmployeeList(searchText, pageNumber, pageSize, sort, status, branchId, departmentId, designationId) {
    let path = `/employee?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += `&branchId=${branchId}&departmentId=${departmentId}&designationId=${designationId}`;
    if (status != null && status != undefined && status != '') {
        path += '&status=' + status;
    }
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveParticipant(participant) {
    // participant.companyId = getCompanyId();
    let post = postWithAuthSurvey(`${servicePath}`,participant);
        // : putWithAuthSurvey(`${servicePath}`,participant);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function deleteParticipant(id) {
    let path = servicePath + "?id=" + encodeURIComponent(id);
    return deleteWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateParticipant(id, name) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&name=" + name;
    return patchWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveEveryoneInDept(departmentId, surveyId) {
    let post = postWithAuthSurvey(`${servicePath}/department?surveyId=${surveyId}`,departmentId);
        // : putWithAuthSurvey(`${servicePath}`,participant);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function saveEveryoneInOrganization(surveyId) {
    let post = postWithAuthSurvey(`${servicePath}/organization`,surveyId);
        // : putWithAuthSurvey(`${servicePath}`,participant);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}