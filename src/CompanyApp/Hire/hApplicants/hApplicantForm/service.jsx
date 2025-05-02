import { getPaginationQueryString } from '../../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../../HttpRequest';


const servicePath = "/hexternalapplicantform";

// get job info for candidate
export function getJobInfoCandidate(jobId) {
    let path = `${servicePath}/hexternalcandidateInfo?jobId=${jobId}`;
    return getWithAuth(path, {}).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
} 

// applicant info

// input hjobapplicant filed
export function getHireJobApplicantField(searchText, pageNumber, pageSize, sort,id) {
    let path = `${servicePath}/hexternaljobapplicant?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&jobId=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
} 

export function getExternalApplicantInfo(jobId) {
    let path = `${servicePath}/externaljobinfo?jobId=${jobId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// system field

export function getSystemFieldInfo() {
    let path = `${servicePath}/hexternalsystemfield`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// applicant field

export function getApplicantInfo() {
    let path = `${servicePath}/hexternalapplicantfield`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// Save external Applicant
export function saveHExternalApplicantForms(data) {
    let path = `${servicePath}/hexternalapplicantsave`;
    let post = data.id == 0?postWithAuth(path, data,true)
    : putWithAuth(`${path}?id=${data.id}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

// save Applicant
export function saveHApplicantForms(data) {
    let path = `${servicePath}/hexternalapplicantIdsave`;
    let post = postWithAuth(path, data)
    // : putWithAuth(`${servicePath}?id=${data.id}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}


