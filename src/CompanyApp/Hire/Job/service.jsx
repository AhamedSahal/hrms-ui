
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';


const servicePath = "/hjobs";
const servicePath1 = "/hjobs/hjoblink";

// get active jobs
export function getJobsList(searchText, pageNumber, pageSize, sort,active) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&active=${active}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveHireForms(data) {
    let post = data.id == 0 ?postWithAuth(servicePath, data)
    : putWithAuth(`${servicePath}?id=${data.id}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

// get job info for candidate
export function getJobInfoCandidate(jobId) {
    let path = `${servicePath}/hcandidateInfo?jobId=${jobId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
} 

// input hjobapplicant filed
export function getHireJobApplicantField(searchText, pageNumber, pageSize, sort,id) {
    let path = `${servicePath}/hjobapplicant?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&jobId=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
} 

// save genrate ling
export function saveHireJobLiknForm(data) {
    let path = `${servicePath}/hjoblink`;
    let post =  postWithAuth(path, data)
    // : putWithAuth(`${servicePath}?id=${data.id}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

// export function getJobLinkInfo(id) {
//     let path = `${servicePath}/hjoblink?id=${id}`;
//     return getWithAuth(path).then(res => {
//         return Promise.resolve(res.data);
//     }).catch(err => {
//         return Promise.reject(err);
//     });
// }

export function getJobLinkInfo(searchText, pageNumber, pageSize, sort,id) {
    let get = getWithAuth(`${servicePath1}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&jobId=${id}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// candidate info
export function saveApplicantMasForm(data) {
    let path = `${servicePath}/applicantmasform`
    let post = data.id == 0 ? postWithAuth(path, data)
    : putWithAuth(`${path}?id=${data.id}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function getSystemFieldInfo() {
    let path = `${servicePath}/systemfield`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getCustomFieldInfo() {
    let path = `${servicePath}/customfield`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getApplicantInfo() {
    let path = `${servicePath}/applicantfield`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
