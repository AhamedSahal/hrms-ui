
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';


const servicePath = "/happlicant";


// get all applciant
export function getAllApplicant(searchText, pageNumber, pageSize, sort,status) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&status=${status}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// get schedule for particular applicant
export function getScheduleListbyAplicant(searchText, pageNumber, pageSize, sort,id) {
    let path = `${servicePath}/happlicantscheduleform?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&applicantId=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// GET Internal education info
export function getInternalEducationInfo(jobId) {
    let path = `${servicePath}/internaleducationinfo?jobId=${jobId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
} 

// GET Internal work experience i info
export function getInternalWorkExperienceInfo(jobId) {
    let path = `${servicePath}/internalWorkinfo?jobId=${jobId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
} 

// GET Evaluating info
export function getEvaluatingInfo(jobId) {
    let path = `${servicePath}/happlicantevaluatingform?jobId=${jobId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
} 

// save Applicant
export function saveHApplicantForms(data) {
    let post = postWithAuth(servicePath, data)
    // : putWithAuth(`${servicePath}?id=${data.id}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

// Save external Applicant
export function saveHExternalApplicantForms(data) {
    let path = `${servicePath}/externalapplicant`;
    let post = data.id == 0?postWithAuth(path, data,true)
    : putWithAuth(`${path}?id=${data.id}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

// save internal Applicant
export function saveHInternalApplicantForms(data) {
    let path = `${servicePath}/internalapplicant`;
    let post = data.id == 0?postWithAuth(path, data,true)
    : putWithAuth(`${path}?id=${data.id}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

// save internal work experience
export function saveHInternalWorkExperienceForms(data) {
    let path = `${servicePath}/internalworkexperience`;
    let post = postWithAuth(path, data)
    // : putWithAuth(`${servicePath}?id=${data.id}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

// save internal education
export function saveHInternalEducationForms(data) {
    let path = `${servicePath}/internaleducation`;
    let post = postWithAuth(path, data)
    // : putWithAuth(`${servicePath}?id=${data.id}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

// save internal education
export function saveHInternalAdditionInfoForms(data) {
    let path = `${servicePath}/internaladditionalinfo`;
    let post = postWithAuth(path, data)
    // : putWithAuth(`${servicePath}?id=${data.id}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

// save applicant screening form
export function saveHApplciantScreeningForms(data) {
    let path = `${servicePath}/happlicantscreeningform`;
    let post = postWithAuth(path, data)
    // : putWithAuth(`${servicePath}?id=${data.id}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

// save applicant schedule form
export function saveHApplciantScheduleForms(data) {
    let path = `${servicePath}/happlicantscheduleform`;
    let post = postWithAuth(path, data)
    // : putWithAuth(`${servicePath}?id=${data.id}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

// save applicant Evaluating form
export function saveHApplciantEvaluatingForms(data) {
    let path = `${servicePath}/happlicantevaluatingform`;
    let post = postWithAuth(path, data)
    // : putWithAuth(`${servicePath}?id=${data.id}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}